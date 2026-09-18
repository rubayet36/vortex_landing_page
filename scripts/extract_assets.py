import os
from PIL import Image

def main():
    os.makedirs('public/assets', exist_ok=True)
    
    # 1. Load images
    landing = Image.open('Figma Image/lifthub-editable-design.png')
    form_img = Image.open('Figma Image/join-now-form.png')
    print(f"Landing size: {landing.size}, Form size: {form_img.size}")
    
    # Crop hero background (x: 40 to 1400, y: 25 to 688)
    hero_bg = landing.crop((40, 25, 1400, 688))
    hero_bg.save('public/assets/hero-banner.png')
    print("Saved hero-banner.png")
    
    # Bento images in section "More Than Reps":
    # Looking at the bento grid:
    # 1. Cable pulldown woman: left side tall card
    # Let's inspect coordinates for bento items
    # Lat pulldown: approx x: 40 to 476, y: 885 to 1235
    pulldown = landing.crop((40, 885, 476, 1235))
    pulldown.save('public/assets/bento-pulldown.png')
    
    # 2. Outdoor dips man: center tall card
    # approx x: 500 to 936, y: 1115 to 1465
    dips = landing.crop((500, 1115, 936, 1465))
    dips.save('public/assets/bento-dips.png')
    
    # 3. Barbell lifters: top right wide card
    # approx x: 960 to 1400, y: 885 to 1145
    lifters = landing.crop((960, 885, 1400, 1145))
    lifters.save('public/assets/bento-lifters.png')
    
    # 4. Detail square images at bottom right:
    # kettlebell: x: 960 to 1096, y: 1355 to 1465
    # shoes: x: 1112 to 1248, y: 1355 to 1465
    # plates: x: 1264 to 1400, y: 1355 to 1465
    kettlebell = landing.crop((960, 1355, 1096, 1465))
    kettlebell.save('public/assets/bento-kettlebell.png')
    shoes = landing.crop((1112, 1355, 1248, 1465))
    shoes.save('public/assets/bento-shoes.png')
    plates = landing.crop((1264, 1355, 1400, 1465))
    plates.save('public/assets/bento-plates.png')
    
    # Facilities images:
    # Card 1 (Supplement Cafe): approx x: 563 to 884, y: 1595 to 2010
    # Card 2 (Advance Equipment): approx x: 908 to 1229, y: 1640 to 2010
    # Card 3 (Female Zone): approx x: 1253 to 1360, y: 1700 to 2010
    # Let's verify these coordinates in a script
    print("Initial bento crops done.")

if __name__ == '__main__':
    main()
