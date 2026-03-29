#!/usr/bin/env python3
"""
Generate Cost Saver app icons from iOS source design
Generates PNG icons for all Android density buckets by scaling from iOS icon
"""

from PIL import Image
import os

# Define icon sizes for Android density buckets
ICON_SIZES = {
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192,
}

# iOS source icon path
IOS_ICON_SOURCE = 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png'

def resize_app_icon(source_image, size, output_path):
    """Resize iOS source icon to target size with 20% reduction and centered"""
    # Reduce the design by 20% (scale to 80% of target size)
    design_size = int(size * 0.8)
    
    # Resize the source image to 80% of target size
    design = source_image.resize((design_size, design_size), Image.Resampling.LANCZOS)
    
    # Create a white background image with padding
    img = Image.new('RGB', (size, size), 'white')
    
    # Calculate centered position for the design
    padding = (size - design_size) // 2
    img.paste(design, (padding, padding))
    
    # Save with high quality
    img.save(output_path, 'PNG', quality=95)
    print(f"Generated: {output_path}")

def generate_all_icons():
    """Generate icons for all densities from iOS source"""
    # Load the iOS source icon
    if not os.path.exists(IOS_ICON_SOURCE):
        print(f"Error: iOS icon source not found at {IOS_ICON_SOURCE}")
        return
    
    source_img = Image.open(IOS_ICON_SOURCE).convert('RGB')
    base_dir = 'android/app/src/main/res'
    
    for density, size in ICON_SIZES.items():
        # Generate launcher icons
        output_dir = os.path.join(base_dir, f'mipmap-{density}')
        os.makedirs(output_dir, exist_ok=True)
        
        # Main icon
        resize_app_icon(source_img, size, os.path.join(output_dir, 'ic_launcher.png'))
        
        # Round icon (same image, will be rounded by Android)
        resize_app_icon(source_img, size, os.path.join(output_dir, 'ic_launcher_round.png'))
        
        # Foreground icon (for adaptive icon)
        resize_app_icon(source_img, size, os.path.join(output_dir, 'ic_launcher_foreground.png'))

if __name__ == '__main__':
    print("Generating Cost Saver app icons from iOS source...")
    generate_all_icons()
    print("✓ All app icons generated successfully!")
