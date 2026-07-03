from PIL import Image
import os

source_path = r'C:\Users\Admin\.gemini\antigravity\brain\dce5dbbb-5205-4772-8903-d4f23de52899\devops_icon_512_1783083672349.png'
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

def make_transparent(img):
    img = img.convert("RGBA")
    datas = img.getdata()
    new_data = []
    for item in datas:
        # If the pixel is white or very close to white, make it transparent
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    return img

try:
    with Image.open(source_path) as img:
        img_trans = make_transparent(img)
        os.makedirs('icons', exist_ok=True)
        for size in sizes:
            resized_img = img_trans.resize((size, size), Image.Resampling.LANCZOS)
            output_path = f'icons/icon-{size}.png'
            resized_img.save(output_path, "PNG")
            print(f"Generated {output_path}")
except Exception as e:
    print(f"Error: {e}")
