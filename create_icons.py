import os
import zlib
import struct
import math

def create_png(width, height, get_pixel_func):
    """Génère un fichier PNG valide uniquement avec la bibliothèque standard Python (struct + zlib)."""
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
    # Dessine une icône de cible / pin de géolocalisation moderne
    # Centre et rayon
    cx, cy = (w - 1) / 2.0, (h - 1) / 2.0
    dx = x - cx
    dy = y - cy
    dist = math.sqrt(dx * dx + dy * dy)
    
    max_r = min(w, h) / 2.0
    
    # Fond circulaire bleu dégradé
    if dist <= max_r - 0.5:
        # Bleu cyan moderne
        bg_r, bg_g, bg_b = 14, 165, 233 # #0ea5e9
        
        # Anneau blanc extérieur (radar)
        ring_r = max_r * 0.65
        if abs(dist - ring_r) < max(1.0, max_r * 0.12):
            return (255, 255, 255, 240)
            
        # Point central blanc
        dot_r = max_r * 0.28
        if dist <= dot_r:
            return (255, 255, 255, 255)
            
        # 4 repères cardinaux (viseur)
        if (abs(dx) < max(1.0, max_r * 0.1) and dist < max_r * 0.85) or \
           (abs(dy) < max(1.0, max_r * 0.1) and dist < max_r * 0.85):
            if dist > dot_r * 1.3:
                return (255, 255, 255, 210)
                
        # Lissage des bords
        alpha = 255
        if dist > max_r - 1.5:
            alpha = int(255 * (max_r - 0.5 - dist))
            alpha = max(0, min(255, alpha))
        return (bg_r, bg_g, bg_b, alpha)
    else:
        return (0, 0, 0, 0)

icons_dir = r"D:\Edge-extensions\geo-history-tracker\icons"
os.makedirs(icons_dir, exist_ok=True)

sizes = [16, 32, 48, 128]
for size in sizes:
    png_bytes = create_png(size, size, draw_geo_icon)
    out_path = os.path.join(icons_dir, f"icon{size}.png")
    with open(out_path, "wb") as f:
        f.write(png_bytes)
    print(f"Généré: {out_path} ({len(png_bytes)} octets)")
