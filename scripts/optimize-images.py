import os
import glob
from PIL import Image

def optimize_image(filepath, max_dimension=1600, quality=82):
    try:
        orig_size = os.path.getsize(filepath)
        filename = os.path.basename(filepath)
        
        # Don't touch pdfs or non-images
        if not filepath.lower().endswith(('.png', '.jpg', '.jpeg')):
            return

        with Image.open(filepath) as img:
            # Handle RGBA / transparency
            has_alpha = img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info)
            
            # Calculate new dimensions
            width, height = img.size
            if max(width, height) > max_dimension:
                ratio = max_dimension / max(width, height)
                new_width = int(width * ratio)
                new_height = int(height * ratio)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # 1. Save optimized WebP version
            webp_path = os.path.splitext(filepath)[0] + '.webp'
            img.save(webp_path, 'WEBP', quality=quality, method=6)
            webp_size = os.path.getsize(webp_path)
            
            # 2. Overwrite / optimize the original PNG/JPG file so existing URLs stay blazing fast
            if filepath.lower().endswith('.png'):
                # Optimize PNG
                if not has_alpha:
                    rgb_img = img.convert('RGB')
                    rgb_img.save(filepath, 'PNG', optimize=True)
                else:
                    img.save(filepath, 'PNG', optimize=True)
            elif filepath.lower().endswith(('.jpg', '.jpeg')):
                img.save(filepath, 'JPEG', quality=quality, optimize=True)
                
            new_size = os.path.getsize(filepath)
            print(f"✅ {filename}: {orig_size / (1024*1024):.2f} MB -> PNG: {new_size / 1024:.1f} KB | WebP: {webp_size / 1024:.1f} KB (Saved {((orig_size - new_size)/orig_size)*100:.1f}%)")
    except Exception as e:
        print(f"❌ Error optimizing {filepath}: {e}")

def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'public'))
    print(f"Starting image optimization in {base_dir}...\n")
    
    # Specific targeted dimension limits
    specific_limits = {
        'logo.png': 400,
        'hero.png': 1400,
        'telugu-book-cover.png': 800,
        'english-book-cover.png': 800,
        'speech.png': 1200,
    }
    
    for root, _, files in os.walk(base_dir):
        for file in files:
            filepath = os.path.join(root, file)
            if file.lower().endswith(('.png', '.jpg', '.jpeg')) and not file.endswith('.webp'):
                max_dim = specific_limits.get(file, 1400)
                optimize_image(filepath, max_dimension=max_dim, quality=80)

if __name__ == '__main__':
    main()
