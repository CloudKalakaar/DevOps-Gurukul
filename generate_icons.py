from PIL import Image
import os

source_path = r'C:\Users\Admin\.gemini\antigravity\brain\dce5dbbb-5205-4772-8903-d4f23de52899\devops_icon_512_1783083672349.png'

sizes = [72, 96, 128, 144, 152, 192, 384, 512]
os.makedirs('icons', exist_ok=True)

try:
    with Image.open(source_path) as img:
        # Convert to RGBA just in case we need proper PNG format
        img = img.convert("RGBA")
        
        for size in sizes:
            resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
            output_path = f'icons/icon-{size}.png'
            resized_img.save(output_path, "PNG")
            print(f"Generated {output_path}")
except Exception as e:
    print(f"Error: {e}")
