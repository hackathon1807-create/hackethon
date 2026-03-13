import cv2
import os
import json
import glob

def extract_frames_from_set(dataset_path, output_path, frames_per_video=3):
    """
    Extracts frames from DFDC videos and saves them into labeled directories.
    """
    if not os.path.exists(output_path):
        os.makedirs(output_path)
    
    # Metadata file is usually inside the dataset directory
    metadata_path = os.path.join(dataset_path, "metadata.json")
    if not os.path.exists(metadata_path):
        print(f"Error: metadata.json not found in {dataset_path}")
        return

    with open(metadata_path, 'r') as f:
        metadata = json.load(f)

    for video_name, info in metadata.items():
        label = info['label'].lower() # 'real' or 'fake'
        video_path = os.path.join(dataset_path, video_name)
        
        if not os.path.exists(video_path):
            continue

        label_dir = os.path.join(output_path, label)
        if not os.path.exists(label_dir):
            os.makedirs(label_dir)

        cap = cv2.VideoCapture(video_path)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total_frames <= 0:
            continue

        interval = max(1, total_frames // frames_per_video)
        count = 0
        for i in range(0, total_frames, interval):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i)
            ret, frame = cap.read()
            if ret:
                frame_name = f"{video_name.replace('.mp4', '')}_f{count}.jpg"
                cv2.imwrite(os.path.join(label_dir, frame_name), frame)
                count += 1
            if count >= frames_per_video:
                break
        
        cap.release()
        print(f"Processed {video_name} ({label})")

if __name__ == "__main__":
    # Example usage:
    # dataset_dir = "data/dfdc_train_part_0"
    # processed_dir = "data/processed_train"
    # extract_frames_from_set(dataset_dir, processed_dir)
    print("Usage: Call extract_frames_from_set(dataset_path, output_path)")
