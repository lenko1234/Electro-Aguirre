#!/bin/bash

# Script para optimizar imágenes del sitio web
# Requiere: imagemagick (convert) o webp tools

echo "🖼️  Optimizador de Imágenes - Electro Aguirre"
echo "=============================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si imagemagick está instalado
if ! command -v convert &> /dev/null; then
    echo -e "${RED}❌ ImageMagick no está instalado${NC}"
    echo "Instalar con: sudo apt-get install imagemagick"
    exit 1
fi

cd "$(dirname "$0")/assets"

echo "📁 Directorio de trabajo: $(pwd)"
echo ""

# Función para optimizar JPEG
optimize_jpeg() {
    local input=$1
    local output=$2
    local quality=${3:-80}
    
    echo -e "${YELLOW}Optimizando:${NC} $input"
    
    # Obtener tamaño original
    original_size=$(stat -f%z "$input" 2>/dev/null || stat -c%s "$input" 2>/dev/null)
    
    # Optimizar
    convert "$input" -quality $quality -strip "$output"
    
    # Obtener tamaño nuevo
    new_size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
    
    # Calcular reducción
    reduction=$(echo "scale=1; 100 - ($new_size * 100 / $original_size)" | bc)
    
    echo -e "${GREEN}✓ Completado${NC}"
    echo "  Original: $(numfmt --to=iec $original_size 2>/dev/null || echo "$original_size bytes")"
    echo "  Nuevo: $(numfmt --to=iec $new_size 2>/dev/null || echo "$new_size bytes")"
    echo "  Reducción: ${reduction}%"
    echo ""
}

# Función para convertir a WebP
convert_to_webp() {
    local input=$1
    local output="${input%.*}.webp"
    
    if command -v cwebp &> /dev/null; then
        echo -e "${YELLOW}Convirtiendo a WebP:${NC} $input"
        cwebp -q 80 "$input" -o "$output"
        echo -e "${GREEN}✓ Creado:${NC} $output"
        echo ""
    else
        echo -e "${YELLOW}⚠️  cwebp no disponible, usando ImageMagick${NC}"
        convert "$input" -quality 80 "$output"
        echo -e "${GREEN}✓ Creado:${NC} $output"
        echo ""
    fi
}

echo "🎯 OPTIMIZACIONES RECOMENDADAS:"
echo ""

# 1. Logo principal (CRÍTICO - 1.4MB!)
echo "1️⃣  Logo principal (PRIORIDAD MÁXIMA)"
echo "   Archivo: WhatsApp Image 2025-12-03 at 10.11.05 AM (1).jpeg"
echo "   Tamaño actual: 1.4MB"
echo "   Objetivo: ~150KB"
echo ""

if [ -f "WhatsApp Image 2025-12-03 at 10.11.05 AM (1).jpeg" ]; then
    read -p "¿Optimizar logo principal? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        # Crear backup
        cp "WhatsApp Image 2025-12-03 at 10.11.05 AM (1).jpeg" "WhatsApp Image 2025-12-03 at 10.11.05 AM (1).jpeg.backup"
        
        # Optimizar con calidad 75 para mayor compresión
        optimize_jpeg "WhatsApp Image 2025-12-03 at 10.11.05 AM (1).jpeg" "logo_optimizado.jpg" 75
        
        # También crear versión WebP
        convert_to_webp "WhatsApp Image 2025-12-03 at 10.11.05 AM (1).jpeg"
        
        echo -e "${GREEN}💡 Sugerencia:${NC} Reemplaza las referencias en HTML:"
        echo "   De: assets/WhatsApp Image 2025-12-03 at 10.11.05 AM (1).jpeg"
        echo "   A:  assets/logo_optimizado.jpg"
        echo ""
    fi
fi

# 2. Fachada
echo "2️⃣  Fachada (272KB → ~80KB)"
if [ -f "fachada_electro_aguirre.jpeg" ]; then
    read -p "¿Optimizar fachada? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        optimize_jpeg "fachada_electro_aguirre.jpeg" "fachada_electro_aguirre_optimized.jpg" 80
    fi
fi

# 3. Pilares
echo "3️⃣  Imágenes de pilares"
for img in pilares*.jpeg; do
    if [ -f "$img" ]; then
        read -p "¿Optimizar $img? (s/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            optimize_jpeg "$img" "${img%.jpeg}_optimized.jpg" 80
        fi
    fi
done

# 4. Eliminar hero_bg.png
echo ""
echo "4️⃣  Archivo sin usar"
if [ -f "hero_bg.png" ]; then
    echo -e "${YELLOW}⚠️  hero_bg.png (4.6MB) no se usa en el sitio${NC}"
    read -p "¿Eliminar? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        mv "hero_bg.png" "hero_bg.png.backup"
        echo -e "${GREEN}✓ Movido a hero_bg.png.backup${NC}"
    fi
fi

echo ""
echo "=============================================="
echo -e "${GREEN}✅ Proceso completado${NC}"
echo ""
echo "📝 PRÓXIMOS PASOS:"
echo "1. Revisar las imágenes optimizadas"
echo "2. Si están bien, actualizar referencias en HTML"
echo "3. Eliminar archivos .backup si todo funciona"
echo "4. Ejecutar PageSpeed Insights para validar mejoras"
echo ""
