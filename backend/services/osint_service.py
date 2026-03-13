"""
osint_service.py — Real-time OSINT investigation engine for Blood Moon
Uses only free/public APIs and local libraries. No API keys required.
"""
import asyncio
import hashlib
import os
import socket
import re
import json
import urllib.parse
from datetime import datetime, timezone
from typing import Optional, Any
from pathlib import Path

import httpx
from PIL import Image, ExifTags


# ── Helper ──────────────────────────────────────────────────────────────────────
def _clean(val: Any) -> Any:
    """Make a value JSON-serializable."""
    if val is None:
        return None
    if isinstance(val, (str, int, float, bool)):
        return val
    if isinstance(val, (list, tuple)):
        return [_clean(v) for v in val]
    if isinstance(val, dict):
        return {str(k): _clean(v) for k, v in val.items()}
    return str(val)


def _extract_domain(url: str) -> Optional[str]:
    try:
        parsed = urllib.parse.urlparse(url if url.startswith("http") else "https://" + url)
        return parsed.netloc or parsed.path.split("/")[0]
    except:
        return None


def _detect_platform(url: str) -> dict:
    url_l = url.lower()
    platforms = {
        "youtube.com": {"name": "YouTube", "type": "Video Platform", "risk": "HIGH"},
        "youtu.be":    {"name": "YouTube", "type": "Video Platform", "risk": "HIGH"},
        "tiktok.com":  {"name": "TikTok",  "type": "Short Video",   "risk": "HIGH"},
        "t.me":        {"name": "Telegram", "type": "Messaging",     "risk": "CRITICAL"},
        "twitter.com": {"name": "X / Twitter", "type": "Social",    "risk": "HIGH"},
        "x.com":       {"name": "X / Twitter", "type": "Social",    "risk": "HIGH"},
        "instagram.com":{"name": "Instagram","type": "Photo/Video",  "risk": "HIGH"},
        "facebook.com": {"name": "Facebook", "type": "Social",      "risk": "MEDIUM"},
        "reddit.com":   {"name": "Reddit",   "type": "Forum",       "risk": "MEDIUM"},
        "discord.com":  {"name": "Discord",  "type": "Messaging",   "risk": "HIGH"},
    }
    for domain, info in platforms.items():
        if domain in url_l:
            return info
    return {"name": "Unknown Platform", "type": "Web", "risk": "MEDIUM"}


# ── EXIF Extraction ─────────────────────────────────────────────────────────────
async def extract_exif(file_path: str) -> dict:
    """Extract real EXIF metadata from an image file."""
    result = {
        "available": False,
        "fields": {},
        "gps": None,
        "camera": None,
        "timestamp": None,
        "software": None,
        "warnings": []
    }
    try:
        img = Image.open(file_path)
        raw_exif = img._getexif()  # type: ignore
        if not raw_exif:
            result["warnings"].append("No EXIF data found — metadata may have been deliberately stripped")
            return result

        result["available"] = True
        tag_map = {v: k for k, v in ExifTags.TAGS.items()}

        # Parse all EXIF tags
        readable = {}
        for tag_id, value in raw_exif.items():
            tag_name = ExifTags.TAGS.get(tag_id, str(tag_id))
            try:
                readable[tag_name] = _clean(value)
            except:
                pass
        result["fields"] = readable

        # Camera info
        make = readable.get("Make", "")
        model = readable.get("Model", "")
        if make or model:
            result["camera"] = f"{make} {model}".strip()

        # Software
        sw = readable.get("Software", "")
        result["software"] = sw or None
        if sw and any(x in sw.lower() for x in ["photoshop", "stable diffusion", "midjourney", "dall", "gimp", "lightroom", "ai"]):
            result["warnings"].append(f"⚠ AI/Editing software detected in metadata: {sw}")

        # Timestamp
        ts = readable.get("DateTimeOriginal") or readable.get("DateTime")
        result["timestamp"] = ts

        # GPS
        gps_info = raw_exif.get(34853)  # GPSInfo tag
        if gps_info:
            try:
                def to_decimal(d):
                    return float(d[0]) + float(d[1]) / 60 + float(d[2]) / 3600
                lat = to_decimal(gps_info[2]) * (1 if gps_info[1] == "N" else -1)
                lon = to_decimal(gps_info[4]) * (1 if gps_info[3] == "E" else -1)
                result["gps"] = {"lat": round(lat, 6), "lon": round(lon, 6)}
                result["warnings"].append(f"📍 GPS location embedded: {lat:.4f}, {lon:.4f}")
            except:
                pass

    except Exception as e:
        result["warnings"].append(f"EXIF extraction error: {str(e)}")
    return result


# ── File Hash & Fingerprint ─────────────────────────────────────────────────────
async def compute_file_hash(file_path: str) -> dict:
    """Compute SHA256 and MD5 hashes for file integrity verification."""
    try:
        sha256 = hashlib.sha256()
        md5 = hashlib.md5()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(8192), b""):
                sha256.update(chunk)
                md5.update(chunk)
        size = os.path.getsize(file_path)
        ext = Path(file_path).suffix.lower()
        return {
            "sha256": sha256.hexdigest(),
            "md5": md5.hexdigest(),
            "size_bytes": size,
            "extension": ext,
            "file_type": _get_file_type(ext),
        }
    except Exception as e:
        return {"error": str(e)}


def _get_file_type(ext: str) -> str:
    mapping = {
        ".jpg": "JPEG Image", ".jpeg": "JPEG Image", ".png": "PNG Image",
        ".gif": "GIF Image", ".webp": "WebP Image", ".bmp": "BMP Image",
        ".mp4": "MPEG-4 Video", ".avi": "AVI Video", ".mov": "QuickTime Video",
        ".mkv": "Matroska Video", ".webm": "WebM Video",
    }
    return mapping.get(ext, f"Unknown ({ext})")


# ── WHOIS Domain Lookup ─────────────────────────────────────────────────────────
async def whois_lookup(domain: str) -> dict:
    """Real WHOIS lookup using python-whois."""
    result = {"domain": domain, "available": False, "data": {}, "error": None}
    try:
        import whois  # python-whois
        w = whois.whois(domain)
        
        def _whois_clean(v):
            if isinstance(v, list):
                v = v[0]
            if hasattr(v, 'isoformat'):
                return v.isoformat()
            return str(v) if v else None

        result["available"] = True
        result["data"] = {
            "registrar": _whois_clean(w.registrar),
            "creation_date": _whois_clean(w.creation_date),
            "expiration_date": _whois_clean(w.expiration_date),
            "updated_date": _whois_clean(w.updated_date),
            "name_servers": [str(ns) for ns in (w.name_servers or [])[:4]],
            "status": [str(s) for s in (w.status or [])[:3]] if isinstance(w.status, list) else [str(w.status or "")],
            "org": _whois_clean(w.org),
            "country": _whois_clean(w.country),
            "registrant": _whois_clean(w.registrant_name or w.name),
            "emails": list(set([str(e) for e in (w.emails or [])[:4]])) if isinstance(w.emails, list) else (
                [str(w.emails)] if w.emails else []
            ),
        }
        # Age analysis
        cd = w.creation_date
        if cd:
            if isinstance(cd, list): cd = cd[0]
            days_old = (datetime.now() - cd.replace(tzinfo=None)).days
            result["domain_age_days"] = days_old
            if days_old < 30:
                result["risk_flags"] = ["⚠ Domain created less than 30 days ago — high-risk indicator"]
            elif days_old < 180:
                result["risk_flags"] = ["⚠ Domain created less than 6 months ago"]
            else:
                result["risk_flags"] = []
    except ImportError:
        result["error"] = "python-whois not installed (run: pip install python-whois)"
    except Exception as e:
        result["error"] = str(e)
    return result


# ── IP Geolocation ──────────────────────────────────────────────────────────────
async def geolocate_ip(ip: str) -> dict:
    """Free IP geolocation via ipapi.co — no API key required."""
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            r = await client.get(f"https://ipapi.co/{ip}/json/", headers={"User-Agent": "BloodMoon/4.0"})
            data = r.json()
            if "error" in data:
                return {"error": data.get("reason", "Unknown IP")}
            return {
                "ip": data.get("ip"),
                "city": data.get("city"),
                "region": data.get("region"),
                "country": data.get("country_name"),
                "country_code": data.get("country_code"),
                "latitude": data.get("latitude"),
                "longitude": data.get("longitude"),
                "isp": data.get("org"),
                "asn": data.get("asn"),
                "timezone": data.get("timezone"),
                "is_vpn_indicator": any(x in (data.get("org", "")).lower()
                                        for x in ["vpn", "digitalocean", "linode", "tor", "nordvpn", "pvdata", "mullvad", "proton"])
            }
    except Exception as e:
        return {"error": str(e)}


# ── Shodan InternetDB (free, no key) ────────────────────────────────────────────
async def shodan_internetdb(ip: str) -> dict:
    """Query Shodan InternetDB — free, no API key needed."""
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            r = await client.get(f"https://internetdb.shodan.io/{ip}")
            if r.status_code == 200:
                data = r.json()
                return {
                    "open_ports": data.get("ports", []),
                    "hostnames": data.get("hostnames", []),
                    "tags": data.get("tags", []),
                    "cpes": data.get("cpes", []),
                    "vulns": data.get("vulns", []),
                }
            return {"note": "No Shodan data available for this IP"}
    except Exception as e:
        return {"error": str(e)}


# ── DNS Resolution ──────────────────────────────────────────────────────────────
async def resolve_domain(domain: str) -> dict:
    """Real DNS resolution — get actual IPs for a domain."""
    try:
        loop = asyncio.get_event_loop()
        ips = await loop.run_in_executor(None, lambda: [
            str(info[4][0]) for info in socket.getaddrinfo(domain, None)
        ])
        unique_ips = list(set(ips))
        return {"domain": domain, "ips": unique_ips[:5], "resolved": True}
    except Exception as e:
        return {"domain": domain, "resolved": False, "error": str(e)}


# ── URLScan.io ──────────────────────────────────────────────────────────────────
async def urlscan_search(url: str) -> dict:
    """
    Search URLScan.io for information about a URL.
    Uses the search API which is free and doesn't require a key for reading.
    """
    try:
        encoded = urllib.parse.quote(url, safe="")
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(
                f"https://urlscan.io/api/v1/search/?q=page.url:{encoded}&size=5",
                headers={"User-Agent": "BloodMoon/4.0"}
            )
            if r.status_code == 200:
                data = r.json()
                results = data.get("results", [])
                if results:
                    latest = results[0]
                    page = latest.get("page", {})
                    verdict = latest.get("verdicts", {}).get("overall", {})
                    return {
                        "found": True,
                        "scan_count": len(results),
                        "last_scan": latest.get("task", {}).get("time"),
                        "screenshot": latest.get("screenshot"),
                        "page_url": page.get("url"),
                        "server": page.get("server"),
                        "ip": page.get("ip"),
                        "country": page.get("country"),
                        "malicious": verdict.get("malicious", False),
                        "score": verdict.get("score", 0),
                        "categories": verdict.get("categories", []),
                        "tags": verdict.get("tags", []),
                        "report_link": f"https://urlscan.io/result/{latest.get('_id', '')}/"
                    }
                return {"found": False, "note": "No prior scans found on URLScan.io"}
            return {"found": False, "error": f"URLScan API status {r.status_code}"}
    except Exception as e:
        return {"error": str(e)}


# ── Google Safe Browsing (via public lookup) ─────────────────────────────────────
async def check_google_transparency(url: str) -> dict:
    """Check Google Safe Browsing transparency report (no API key needed for basic check)."""
    try:
        encoded = urllib.parse.quote(url, safe="")
        async with httpx.AsyncClient(timeout=8.0, follow_redirects=True) as client:
            r = await client.get(
                f"https://transparencyreport.google.com/transparencyreport/api/v3/safebrowsing/status?site={encoded}",
                headers={"User-Agent": "BloodMoon/4.0"}
            )
            text = r.text
            # Parse the Google API response (it starts with )]}'\n)
            clean = text.lstrip(")]}'")
            data = json.loads(clean) if clean.strip().startswith("[") else {}
            return {"checked": True, "raw": str(data)[:200]}
    except Exception as e:
        return {"checked": False, "error": str(e)}


# ── Google News RSS ─────────────────────────────────────────────────────────────
async def search_news(query: str) -> list:
    """Search Google News RSS feed for related news — real results."""
    try:
        encoded = urllib.parse.quote(query)
        url = f"https://news.google.com/rss/search?q={encoded}+deepfake&hl=en-US&gl=US&ceid=US:en"
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            r = await client.get(url, headers={"User-Agent": "Mozilla/5.0 BloodMoon/4.0"})
            text = r.text
            # Parse RSS manually to avoid lxml dependency
            items = []
            import re as _re
            entries = _re.findall(r'<item>(.*?)</item>', text, _re.DOTALL)
            for entry in entries[:5]:
                title = _re.search(r'<title><!\[CDATA\[(.*?)\]\]></title>', entry)
                link  = _re.search(r'<link>(.*?)</link>', entry)
                pub   = _re.search(r'<pubDate>(.*?)</pubDate>', entry)
                if title:
                    items.append({
                        "title": title.group(1).strip(),
                        "link": link.group(1).strip() if link else None,
                        "published": pub.group(1).strip() if pub else None,
                    })
            return items
    except Exception as e:
        return [{"error": str(e)}]


# ── Main OSINT Orchestrator ─────────────────────────────────────────────────────
async def run_osint(target_url: Optional[str], file_path: Optional[str]) -> dict:
    """
    Run full OSINT investigation:
    - If URL provided: WHOIS, DNS, IP geo, Shodan, URLScan, news search
    - If file provided: EXIF, file hash, metadata forensics
    - Always: news search for context
    """
    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "target": target_url or (os.path.basename(file_path) if file_path else "Unknown"),
        "file_forensics": None,
        "domain_intel": None,
        "ip_intel": None,
        "network_intel": None,
        "urlscan": None,
        "related_news": [],
        "platform_detection": None,
        "risk_summary": [],
    }

    tasks = []

    # ── File Forensics ──────────────────────────
    if file_path and os.path.exists(file_path):
        hash_data = await compute_file_hash(file_path)
        exif_data = {}
        ext = Path(file_path).suffix.lower()
        if ext in [".jpg", ".jpeg", ".png", ".tiff", ".webp"]:
            exif_data = await extract_exif(file_path)
        report["file_forensics"] = {
            "hash": hash_data,
            "exif": exif_data,
        }
        if exif_data.get("warnings"):
            report["risk_summary"].extend(exif_data["warnings"])

    # ── URL / Domain Intel ──────────────────────
    if target_url:
        domain = _extract_domain(target_url)
        report["platform_detection"] = _detect_platform(target_url)

        if domain:
            # Run WHOIS + DNS in parallel
            whois_data, dns_data = await asyncio.gather(
                whois_lookup(domain),
                resolve_domain(domain),
                return_exceptions=True
            )
            report["domain_intel"] = {
                "domain": domain,
                "whois": whois_data if not isinstance(whois_data, Exception) else {"error": str(whois_data)},
                "dns": dns_data if not isinstance(dns_data, Exception) else {"error": str(dns_data)},
            }

            # Risk flags from WHOIS
            if isinstance(whois_data, dict) and whois_data.get("risk_flags"):
                report["risk_summary"].extend(whois_data["risk_flags"])

            # IP intelligence for each resolved IP
            if isinstance(dns_data, dict) and dns_data.get("ips"):
                ip = dns_data["ips"][0]
                geo_data, shodan_data = await asyncio.gather(
                    geolocate_ip(ip),
                    shodan_internetdb(ip),
                    return_exceptions=True
                )
                report["ip_intel"] = {
                    "primary_ip": ip,
                    "geolocation": geo_data if not isinstance(geo_data, Exception) else {"error": str(geo_data)},
                    "shodan": shodan_data if not isinstance(shodan_data, Exception) else {"error": str(shodan_data)},
                }
                if isinstance(geo_data, dict) and geo_data.get("is_vpn_indicator"):
                    report["risk_summary"].append(f"⚠ VPN/Proxy/Datacenter IP detected: {ip} ({geo_data.get('isp', '')})")

        # URLScan
        urlscan_data = await urlscan_search(target_url)
        report["urlscan"] = urlscan_data
        if isinstance(urlscan_data, dict) and urlscan_data.get("malicious"):
            report["risk_summary"].append("🚨 URLScan.io flagged this URL as MALICIOUS")

        # News search
        news_query = domain or target_url[:50]
        report["related_news"] = await search_news(news_query)
    else:
        # File-only: search news about deepfakes generically
        report["related_news"] = await search_news("deepfake detection")

    return _clean(report)
