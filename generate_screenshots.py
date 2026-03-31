#!/usr/bin/env python3
"""
Generate App Screenshots for Google Play Console
Creates phone, 7-inch tablet, and 10-inch tablet screenshots
"""

from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT_DIR = "google_play_assets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Brand colors
COSTCO_RED = "#E31837"
COSTCO_BLUE = "#005DAA"
WHITE = "#FFFFFF"
LIGHT_GRAY = "#F3F4F6"
DARK_GRAY = "#374151"
TEXT_GRAY = "#6B7280"

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_phone_screenshot(index, width=1080, height=1920):
    """Create phone screenshot (1080x1920)"""
    screenshots_data = [
        {
            "title": "Track Prices",
            "description": "Monitor Costco prices in real-time",
            "icon": "📊",
            "content_y": 600
        },
        {
            "title": "Upload Receipts",
            "description": "Capture and parse receipts instantly",
            "icon": "📸",
            "content_y": 600
        },
        {
            "title": "Get Alerts",
            "description": "Receive notifications on price drops",
            "icon": "🔔",
            "content_y": 600
        },
        {
            "title": "Save Money",
            "description": "See your total savings at a glance",
            "icon": "💰",
            "content_y": 600
        },
    ]
    
    data = screenshots_data[index % len(screenshots_data)]
    
    img = Image.new('RGB', (width, height), hex_to_rgb(WHITE))
    draw = ImageDraw.Draw(img)
    
    # Status bar (mock)
    draw.rectangle([0, 0, width, 50], fill=hex_to_rgb(DARK_GRAY))
    
    # Header gradient
    for y in range(200):
        ratio = y / 200
        r = int(227 * (1 - ratio) + 255 * ratio)
        g = int(24 * (1 - ratio) + 255 * ratio)
        b = int(55 * (1 - ratio) + 255 * ratio)
        draw.rectangle([0, 50 + y, width, 51 + y], fill=(r, g, b))
    
    # Header text "Cost Saver"
    try:
        title_font = ImageFont.truetype("arial.ttf", 48)
        desc_font = ImageFont.truetype("arial.ttf", 28)
        content_font = ImageFont.truetype("arial.ttf", 24)
        icon_font = ImageFont.truetype("arial.ttf", 100)
    except:
        title_font = desc_font = content_font = icon_font = ImageFont.load_default()
    
    draw.text((50, 80), "Cost Saver", font=title_font, fill=hex_to_rgb(WHITE))
    
    # Main icon
    icon_y = 350
    draw.text((width // 2 - 50, icon_y), data["icon"], font=icon_font, fill=hex_to_rgb(COSTCO_BLUE))
    
    # Feature title
    title_y = 550
    draw.text((50, title_y), data["title"], font=title_font, fill=hex_to_rgb(DARK_GRAY))
    
    # Feature description
    desc_y = 650
    draw.text((50, desc_y), data["description"], font=desc_font, fill=hex_to_rgb(TEXT_GRAY))
    
    # Feature box
    box_y = 800
    draw.rectangle([40, box_y, width - 40, box_y + 400], fill=hex_to_rgb(LIGHT_GRAY), outline=hex_to_rgb(COSTCO_BLUE), width=3)
    
    # Mock content inside box
    draw.text((60, box_y + 40), "✓ Real-time price tracking", font=content_font, fill=hex_to_rgb(DARK_GRAY))
    draw.text((60, box_y + 100), "✓ Receipt instant parsing", font=content_font, fill=hex_to_rgb(DARK_GRAY))
    draw.text((60, box_y + 160), "✓ Push notifications", font=content_font, fill=hex_to_rgb(DARK_GRAY))
    draw.text((60, box_y + 220), "✓ Savings tracking", font=content_font, fill=hex_to_rgb(DARK_GRAY))
    
    # Bottom CTA
    draw.rectangle([40, height - 200, width - 40, height - 80], fill=hex_to_rgb(COSTCO_RED))
    draw.text((width // 2 - 120, height - 150), "Get Started Now", font=desc_font, fill=hex_to_rgb(WHITE))
    
    filename = f"phone_screenshot_{index + 1}.png"
    filepath = os.path.join(OUTPUT_DIR, filename)
    img.save(filepath, 'PNG')
    print(f"✅ Created: {filepath}")
    return filepath

def create_tablet_7_screenshot(index, width=1200, height=1920):
    """Create 7-inch tablet screenshot (1200x1920)"""
    screenshots_data = [
        {
            "title": "Dashboard",
            "subtitle": "View all tracked items and savings",
        },
        {
            "title": "Receipt Upload",
            "subtitle": "Capture and extract items automatically",
        },
        {
            "title": "Price Alerts",
            "subtitle": "Get notified of price drops instantly",
        },
    ]
    
    data = screenshots_data[index % len(screenshots_data)]
    
    img = Image.new('RGB', (width, height), hex_to_rgb(WHITE))
    draw = ImageDraw.Draw(img)
    
    # Status bar
    draw.rectangle([0, 0, width, 60], fill=hex_to_rgb(DARK_GRAY))
    
    # Header
    for y in range(250):
        ratio = y / 250
        r = int(0 * (1 - ratio) + 255 * ratio)
        g = int(93 * (1 - ratio) + 255 * ratio)
        b = int(170 * (1 - ratio) + 255 * ratio)
        draw.rectangle([0, 60 + y, width, 61 + y], fill=(r, g, b))
    
    try:
        title_font = ImageFont.truetype("arial.ttf", 56)
        subtitle_font = ImageFont.truetype("arial.ttf", 32)
        content_font = ImageFont.truetype("arial.ttf", 28)
    except:
        title_font = subtitle_font = content_font = ImageFont.load_default()
    
    draw.text((60, 120), data["title"], font=title_font, fill=hex_to_rgb(WHITE))
    draw.text((60, 200), data["subtitle"], font=subtitle_font, fill=hex_to_rgb(WHITE))
    
    # Content cards
    card_y = 350
    for i in range(3):
        card_height = 400
        draw.rectangle([40, card_y + i * 450, width - 40, card_y + i * 450 + card_height], 
                      fill=hex_to_rgb(LIGHT_GRAY), outline=hex_to_rgb(COSTCO_BLUE), width=3)
        
        draw.text((60, card_y + i * 450 + 40), f"Item {i + 1}", font=title_font, fill=hex_to_rgb(DARK_GRAY))
        draw.text((60, card_y + i * 450 + 120), "Price: $XX.XX", font=content_font, fill=hex_to_rgb(TEXT_GRAY))
        draw.text((60, card_y + i * 450 + 180), "$X.XX saved", font=content_font, fill=hex_to_rgb(COSTCO_RED))
    
    filename = f"tablet_7_screenshot_{index + 1}.png"
    filepath = os.path.join(OUTPUT_DIR, filename)
    img.save(filepath, 'PNG')
    print(f"✅ Created: {filepath}")
    return filepath

def create_tablet_10_screenshot(index, width=1600, height=2560):
    """Create 10-inch tablet screenshot (1600x2560)"""
    screenshots_data = [
        {
            "title": "Tracked Items",
            "description": "Monitor all your Costco purchases",
        },
        {
            "title": "Savings Overview",
            "description": "See how much you've saved",
        },
    ]
    
    data = screenshots_data[index % len(screenshots_data)]
    
    img = Image.new('RGB', (width, height), hex_to_rgb(WHITE))
    draw = ImageDraw.Draw(img)
    
    # Status bar
    draw.rectangle([0, 0, width, 80], fill=hex_to_rgb(DARK_GRAY))
    
    # Header with gradient
    for y in range(350):
        ratio = y / 350
        r = int(227 * (1 - ratio) + 0 * ratio)
        g = int(24 * (1 - ratio) + 93 * ratio)
        b = int(55 * (1 - ratio) + 170 * ratio)
        draw.rectangle([0, 80 + y, width, 81 + y], fill=(r, g, b))
    
    try:
        title_font = ImageFont.truetype("arial.ttf", 72)
        subtitle_font = ImageFont.truetype("arial.ttf", 40)
        content_font = ImageFont.truetype("arial.ttf", 32)
    except:
        title_font = subtitle_font = content_font = ImageFont.load_default()
    
    draw.text((80, 150), data["title"], font=title_font, fill=hex_to_rgb(WHITE))
    draw.text((80, 270), data["description"], font=subtitle_font, fill=hex_to_rgb(WHITE))
    
    # Two-column layout
    col_width = (width - 120) // 2
    left_x = 60
    right_x = left_x + col_width + 60
    
    card_y = 500
    card_height = 600
    
    # Left column cards
    for i in range(2):
        y = card_y + i * (card_height + 60)
        draw.rectangle([left_x, y, left_x + col_width, y + card_height], 
                      fill=hex_to_rgb(LIGHT_GRAY), outline=hex_to_rgb(COSTCO_BLUE), width=4)
        draw.text((left_x + 40, y + 40), f"Product {i + 1}", font=subtitle_font, fill=hex_to_rgb(DARK_GRAY))
        draw.text((left_x + 40, y + 140), "$XX.XX → $YY.YY", font=content_font, fill=hex_to_rgb(COSTCO_RED))
    
    # Right column cards
    for i in range(2):
        y = card_y + i * (card_height + 60)
        draw.rectangle([right_x, y, right_x + col_width, y + card_height], 
                      fill=hex_to_rgb(LIGHT_GRAY), outline=hex_to_rgb(COSTCO_BLUE), width=4)
        draw.text((right_x + 40, y + 40), f"Product {i + 3}", font=subtitle_font, fill=hex_to_rgb(DARK_GRAY))
        draw.text((right_x + 40, y + 140), "$XX.XX → $YY.YY", font=content_font, fill=hex_to_rgb(COSTCO_RED))
    
    filename = f"tablet_10_screenshot_{index + 1}.png"
    filepath = os.path.join(OUTPUT_DIR, filename)
    img.save(filepath, 'PNG')
    print(f"✅ Created: {filepath}")
    return filepath

if __name__ == "__main__":
    print("📱 Generating App Screenshots for Google Play Console...\n")
    
    print("📱 Phone Screenshots (1080×1920)...")
    for i in range(4):
        create_phone_screenshot(i)
    
    print("\n📱 7-inch Tablet Screenshots (1200×1920)...")
    for i in range(2):
        create_tablet_7_screenshot(i)
    
    print("\n📱 10-inch Tablet Screenshots (1600×2560)...")
    for i in range(2):
        create_tablet_10_screenshot(i)
    
    print(f"\n✅ All screenshots created in: {os.path.abspath(OUTPUT_DIR)}/")
    
    print("\n📋 Google Play Console Requirements:")
    print("   • Phone: 1080×1920 pixels (min 2, max 8 screenshots)")
    print("   • 7-inch tablet: 1200×1920 pixels (min 0, max 8 screenshots)")
    print("   • 10-inch tablet: 1600×2560 pixels (min 0, max 8 screenshots)")
    
    print("\n📸 Generated Screenshots:")
    print("   ✓ 4 phone screenshots (1080×1920)")
    print("   ✓ 2 seven-inch tablet screenshots (1200×1920)")
    print("   ✓ 2 ten-inch tablet screenshots (1600×2560)")
    
    print("\n📝 Upload to Google Play Console:")
    print("   1. Go to Google Play Console > Store Listing > Screenshots")
    print("   2. Add phone screenshots (required)")
    print("   3. Add 7-inch tablet screenshots (optional)")
    print("   4. Add 10-inch tablet screenshots (optional)")
    print("\n✨ Done!")
