#!/usr/bin/env python3
"""
Generate Cost Saver favicon
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_favicon():
    """Create favicon with CS monogram"""
    size = 256  # Generate high-res, will scale down
    img = Image.new('RGB', (size, size), '#F8FAFC')
    draw = ImageDraw.Draw(img)
    
    # Try to use a bold font
    try:
        font_size = int(size * 0.5)
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    # Draw red C
    draw.text((int(size * 0.1), int(size * 0.25)), "C", font=font, fill='#E31837')
    
    # Draw blue S
    draw.text((int(size * 0.45), int(size * 0.25)), "S", font=font, fill='#005DAA')
    
    # Save as ICO (will create 256x256 version)
    img.save('public/favicon.ico', 'ICO', sizes=[(256, 256)])
    print("Generated: public/favicon.ico")

if __name__ == '__main__':
    print("Generating Cost Saver favicon...")
    create_favicon()
    print("✓ Favicon generated successfully!")
