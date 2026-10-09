import os
import sys
import zipfile
import zlib
import struct
import math

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ICONS_DIR = os.path.join(BASE_DIR, "icons")
DIST_DIR = os.path.join(BASE_DIR, "dist")

def create_png(width, height, get_pixel_func):
    """Génère un fichier PNG valide uniquement avec la bibliothèque standard Python."""
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # Type de filtre (0 = None)
        for x in range(width):
            r, g, b, a = get_pixel_func(x, y, width, height)
            raw_data.extend([r, g, b, a])
            
    compressed = zlib.compress(bytes(raw_data), level=9)
    
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
        
    header = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)) # 8-bit RGBA
    idat = chunk(b'IDAT', compressed)
    iend = chunk(b'IEND', b'')
    return header + ihdr + idat + iend

def draw_geo_icon(x, y, w, h):
    cx, cy = (w - 1) / 2.0, (h - 1) / 2.0
    dx = x - cx
    dy = y - cy
    dist = math.sqrt(dx * dx + dy * dy)
    max_r = min(w, h) / 2.0
    
    if dist <= max_r - 0.5:
        bg_r, bg_g, bg_b = 14, 165, 233 # Cyan / Bleu moderne
        
        # Anneau radar blanc
        ring_r = max_r * 0.65
        if abs(dist - ring_r) < max(1.0, max_r * 0.12):
            return (255, 255, 255, 240)
            
        # Point central blanc
        dot_r = max_r * 0.28
        if dist <= dot_r:
            return (255, 255, 255, 255)
            
        # Viseur / axes cardinaux
        if (abs(dx) < max(1.0, max_r * 0.1) and dist < max_r * 0.85) or \
           (abs(dy) < max(1.0, max_r * 0.1) and dist < max_r * 0.85):
            if dist > dot_r * 1.3:
                return (255, 255, 255, 210)
                
        # Anti-aliasing bordure
        alpha = 255
        if dist > max_r - 1.5:
            alpha = int(255 * (max_r - 0.5 - dist))
            alpha = max(0, min(255, alpha))
        return (bg_r, bg_g, bg_b, alpha)
    else:
        return (0, 0, 0, 0)

def generate_icons():
    print("🎨 Génération des icônes PNG officielles...")
    os.makedirs(ICONS_DIR, exist_ok=True)
    sizes = [16, 32, 48, 128]
    for size in sizes:
        png_bytes = create_png(size, size, draw_geo_icon)
        out_path = os.path.join(ICONS_DIR, f"icon{size}.png")
        with open(out_path, "wb") as f:
            f.write(png_bytes)
        print(f"   [OK] {os.path.basename(out_path)} ({size}x{size})")

def build_zip():
    print("\n📦 Création du package Store (Edge Add-ons & Chrome Web Store)...")
    os.makedirs(DIST_DIR, exist_ok=True)
    zip_name = "GeoHistory-v1.0.0.zip"
    zip_path = os.path.join(DIST_DIR, zip_name)

    # Fichiers stricts à embarquer dans le package de publication
    files_to_pack = [
        "manifest.json",
        "background.js",
        "content.js",
        "injected.js",
        "popup.html",
        "popup.js",
        "popup.css",
        os.path.join("icons", "icon16.png"),
        os.path.join("icons", "icon32.png"),
        os.path.join("icons", "icon48.png"),
        os.path.join("icons", "icon128.png"),
    ]

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for rel_path in files_to_pack:
            full_path = os.path.join(BASE_DIR, rel_path)
            if os.path.exists(full_path):
                # Utiliser des slashes pour la compatibilité interne du zip
                arc_name = rel_path.replace("\\", "/")
                zf.write(full_path, arc_name)
                print(f"   + Ajouté : {arc_name}")
            else:
                print(f"   ⚠️ Attention, fichier introuvable : {rel_path}")

    zip_size_kb = os.path.getsize(zip_path) / 1024
    print(f"\n✅ Package généré avec succès !")
    print(f"📁 Fichier : {zip_path}")
    print(f"⚖️ Poids : {zip_size_kb:.1f} Ko")
    print("🚀 Prêt à être téléversé sur Microsoft Partner Center et Chrome Web Store !")

if __name__ == "__main__":
    generate_icons()
    build_zip()
