import os
from PIL import Image

directory = r"C:\Users\MSI\Desktop\Новая папка"

# Process all webp files
for filename in os.listdir(directory):
    if filename.lower().endswith(".webp"):
        filepath = os.path.join(directory, filename)
        try:
            with Image.open(filepath) as img:
                original_size = os.path.getsize(filepath)
                # Max width for mobile
                max_width = 600
                
                # Calculate new size maintaining aspect ratio
                if img.width > max_width:
                    ratio = max_width / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                
                # Save with compression
                img.save(filepath, "webp", quality=50, method=4)
                new_size = os.path.getsize(filepath)
                print(f"Compressed {filename}: {original_size//1024}KB -> {new_size//1024}KB")
        except Exception as e:
            print(f"Error processing {filename}: {e}")
