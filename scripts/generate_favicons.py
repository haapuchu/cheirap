from PIL import Image
import base64
import os

png_path = os.path.join('web', 'public', 'manipur_emblem_badge.png')
img = Image.open(png_path)

# Save favicon.ico
ico_path = os.path.join('web', 'public', 'favicon.ico')
img.save(ico_path, format='ICO', sizes=[(16,16), (32,32), (48,48), (64,64)])

# Save PNG sizes
img.resize((32,32), Image.Resampling.LANCZOS).save(os.path.join('web', 'public', 'favicon-32x32.png'))
img.resize((192,192), Image.Resampling.LANCZOS).save(os.path.join('web', 'public', 'favicon-192x192.png'))

# Save SVG
with open(png_path, 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <image width="100" height="100" href="data:image/png;base64,{b64}"/>
</svg>'''

with open(os.path.join('web', 'public', 'favicon.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_content)

print("Generated favicon.ico, favicon.svg, and png icons from manipur_emblem_badge.png")
