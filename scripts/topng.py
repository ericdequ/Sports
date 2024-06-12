import os
from PIL import Image
import piexif

def convert_webp_to_png(src_folder):
    counter = 1
    for root, dirs, files in os.walk(src_folder):
        for file in files:
            if file.endswith('.webp'):
                src_path = os.path.join(root, file)
                dst_path = os.path.join(root, f"{counter}.png")

                try:
                    with Image.open(src_path) as im:
                        exif_data = piexif.load(im.info.get("exif", b""))
                        im.save(dst_path, "PNG", exif=exif_data)
                        print(f"Converted {src_path} to {dst_path}")
                        counter += 1
                except Exception as e:
                    print(f"Error converting {src_path}: {e}")

if __name__ == "__main__":
    src_folder = "C:/Users/ericd/Desktop/Blog/My-Blog/robotric"
    convert_webp_to_png(src_folder)