#!/usr/bin/env python3
"""
Generate Cost Saver app icons from CS logo design
Generates PNG icons for all Android density buckets
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Define icon sizes for Android density buckets
ICON_SIZES = {
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192,
}

# Colors
RED = '#E31837'  # Costco red for C
BLUE = '#005DAA'  # Costco blue for S
WHITE = '#FFFFFF'
BACKGROUND = '#F8FAFC'  # Light background

def create_app_icon(size, output_path):
    """Create app icon with CS monogram"""
    # Create square image with background
    img = Image.new('RGB', (size, size), BACKGROUND)
    draw = ImageDraw.Draw(img)
    
    # Try to use a bold font, fall back to default
    try:
        font_size = int(size * 0.5)
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    # Calculate positions for C and S
    margin = int(size * 0.1)
    letter_width = size // 3
    
    # Draw red C
    c_x = margin
    c_y = (size - font_size) // 2
    draw.text((c_x, c_y), "C", font=font, fill=RED)
    
    # Draw blue S (positioned to overlap slightly)
    s_x = c_x + letter_width
    s_y = c_y
    draw.text((s_x, s_y), "S", font=font, fill=BLUE)
    
    # Save with high quality
    img.save(output_path, 'PNG', quality=95)
    print(f"Generated: {output_path}")

def generate_all_icons():
    """Generate icons for all densities"""
    base_dir = 'android/app/src/main/res'
    
    for density, size in ICON_SIZES.items():
        # Generate launcher icons
        output_dir = os.path.join(base_dir, f'mipmap-{density}')
        os.makedirs(output_dir, exist_ok=True)
        
        # Main icon
        create_app_icon(size, os.path.join(output_dir, 'ic_launcher.png'))
        
        # Round icon
        create_app_icon(size, os.path.join(output_dir, 'ic_launcher_round.png'))
        
        # Foreground icon (for adaptive icon)
        create_app_icon(size, os.path.join(output_dir, 'ic_launcher_foreground.png'))

if __name__ == '__main__':
    print("Generating Cost Saver app icons...")
    generate_all_icons()
    print("✓ All app icons generated successfully!")
