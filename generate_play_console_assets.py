#!/usr/bin/env python3
"""
Generate Google Play Console Assets from Actual App Icon
Creates App Icon (512x512) and Feature Graphic (1024x500) for Google Play Store submission
Uses the actual iOS app icon as source
"""

from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT_DIR = "google_play_assets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Costco brand colors (exact match)
COSTCO_RED = "#E31837"      # C red
COSTCO_BLUE = "#005DAA"     # S blue  
WHITE = "#FFFFFF"
LIGHT_GRAY = "#F0F0F0"

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def draw_curved_letter_c(draw, x, y, size, color):
    """Draw stylized curved 'C' letter"""
    rgb = hex_to_rgb(color)
    radius = size // 2
    thickness = int(size * 0.15)
    
    # Draw filled C shape using arc/ellipse
    # Outer circle
    draw.ellipse([x - radius, y - radius, x + radius, y + radius], outline=rgb, fill=rgb)
    # Inner white circle (to create hollow C)
    inner_radius = radius - thickness
    draw.ellipse([x - inner_radius, y - inner_radius, x + inner_radius, y + inner_radius], 
                 fill=hex_to_rgb(WHITE))

def draw_curved_letter_s(draw, x, y, size, color):
    """Draw stylized curved 'S' letter"""
    rgb = hex_to_rgb(color)
    radius = size // 2
    
    # Create a temporary image for the S and paste it
    s_img = Image.new('RGBA', (size + 100, size + 100), (255, 255, 255, 0))
    s_draw = ImageDraw.Draw(s_img)
    
    # Draw two circles stacked for S shape
    thickness = int(size * 0.15)
    
    # Top curve
    top_y = y - radius // 2
    s_draw.ellipse([x - radius//2, top_y - radius//2, x + radius//2, top_y + radius//2], 
                   outline=rgb, width=thickness)
    
    # Bottom curve
    bot_y = y + radius // 2
    s_draw.ellipse([x - radius//2, bot_y - radius//2, x + radius//2, bot_y + radius//2], 
                   outline=rgb, width=thickness)

def create_app_icon_from_source(size=512):
    """Create app icon by copying and resizing the actual iOS icon"""
    ios_icon_path = r"ios\App\App\Assets.xcassets\AppIcon.appiconset\AppIcon-512@2x.png"
    
    if os.path.exists(ios_icon_path):
        # Load the actual iOS icon
        original = Image.open(ios_icon_path)
        
        # Resize to exactly 512x512
        icon = original.resize((size, size), Image.Resampling.LANCZOS)
        
        filepath = os.path.join(OUTPUT_DIR, "icon_512x512.png")
        icon.save(filepath, 'PNG')
        print(f"✅ Created: {filepath} (from actual iOS icon)")
        return filepath
    else:
        print(f"⚠️ Warning: iOS icon not found at {ios_icon_path}")
        print("Creating generic icon instead...")
        return create_generic_cs_icon(size)

def create_generic_cs_icon(size=512):
    """Fallback: Create generic CS icon if iOS icon not found"""
    img = Image.new('RGB', (size, size), hex_to_rgb(WHITE))
    draw = ImageDraw.Draw(img)
    
    # Draw red C on left with proper curve
    c_center_x = size // 4
    c_center_y = size // 2
    c_radius = int(size * 0.2)
    
    # Draw C as donut (filled circle with white hole)
    draw.ellipse(
        [c_center_x - c_radius, c_center_y - c_radius, c_center_x + c_radius, c_center_y + c_radius],
        fill=hex_to_rgb(COSTCO_RED)
    )
    # Inner white circle
    inner_r = int(c_radius * 0.6)
    draw.ellipse(
        [c_center_x - inner_r, c_center_y - inner_r, c_center_x + inner_r, c_center_y + inner_r],
        fill=hex_to_rgb(WHITE)
    )
    
    # Draw blue S on right
    s_center_x = int(size * 0.75)
    s_center_y = size // 2
    s_radius = int(size * 0.2)
    
    # Draw S shape with two curved parts
    draw.ellipse(
        [s_center_x - s_radius, s_center_y - s_radius, s_center_x + s_radius, s_center_y + s_radius],
        fill=hex_to_rgb(COSTCO_BLUE)
    )
    # Inner white area
    inner_s = int(s_radius * 0.6)
    draw.ellipse(
        [s_center_x - inner_s, s_center_y - inner_s, s_center_x + inner_s, s_center_y + inner_s],
        fill=hex_to_rgb(WHITE)
    )
    
    filepath = os.path.join(OUTPUT_DIR, "icon_512x512.png")
    img.save(filepath, 'PNG')
    print(f"✅ Created: {filepath}")
    return filepath

def create_feature_graphic(width=1024, height=500):
    """Create feature graphic with actual app icon"""
    # Load actual icon if available
    ios_icon_path = r"ios\App\App\Assets.xcassets\AppIcon.appiconset\AppIcon-512@2x.png"
    
    img = Image.new('RGB', (width, height), hex_to_rgb(WHITE))
    draw = ImageDraw.Draw(img)
    
    # Create gradient background from Costco red to blue
    for x in range(width):
        ratio = x / width
        # Interpolate between red and blue
        r = int(227 * (1 - ratio) + 0 * ratio)      # 227 to 0
        g = int(24 * (1 - ratio) + 93 * ratio)      # 24 to 93
        b = int(55 * (1 - ratio) + 170 * ratio)     # 55 to 170
        
        for y in range(height):
            draw.point((x, y), fill=(r, g, b))
    
    # Place app icon on left side
    icon_size = int(height * 0.8)
    icon_x = int(width * 0.15)
    icon_y = (height - icon_size) // 2
    
    if os.path.exists(ios_icon_path):
        icon = Image.open(ios_icon_path)
        icon = icon.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
        img.paste(icon, (icon_x, icon_y))
    
    # Add text on right side
    try:
        title_font = ImageFont.truetype("arial.ttf", 70)
        subtitle_font = ImageFont.truetype("arial.ttf", 36)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
    
    text_x = int(width * 0.55)
    
    # "Cost Saver" title
    title = "Cost Saver"
    draw.text((text_x, int(height * 0.25)), title, font=title_font, fill=hex_to_rgb(WHITE))
    
    # "Track Costco Prices" subtitle
    subtitle = "Save on Every Purchase"
    draw.text((text_x, int(height * 0.55)), subtitle, font=subtitle_font, fill=hex_to_rgb(WHITE))
    
    filepath = os.path.join(OUTPUT_DIR, "feature_graphic_1024x500.png")
    img.save(filepath, 'PNG')
    print(f"✅ Created: {filepath}")
    return filepath

if __name__ == "__main__":
    print("🎨 Generating Google Play Console Assets...\n")
    
    print("📱 Creating App Icon (512×512)...")
    create_app_icon_from_source()
    
    print("\n📊 Creating Feature Graphic (1024×500)...")
    create_feature_graphic()
    
    print(f"\n✅ All assets created in: {os.path.abspath(OUTPUT_DIR)}/")
    print("\n📋 Google Play Console Requirements:")
    print("   • App Icon: icon_512x512.png (512×512, PNG)")
    print("   • Feature Graphic: feature_graphic_1024x500.png (1024×500, PNG)")
    print("\n📝 Upload these files to Google Play Console:")
    print("   1. Go to Google Play Console > Your App > Store Listing > Graphics")
    print("   2. App Icon: Upload icon_512x512.png")
    print("   3. Feature Graphic: Upload feature_graphic_1024x500.png")
    print("\n✨ Done!")
