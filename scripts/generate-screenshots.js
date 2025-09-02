const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateScreenshots() {
  console.log('🚀 Generando screenshots para D&N Magic Cosmetics...');

  const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');
  
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Screenshot desktop - representando tu tienda
  const desktopSvg = `
    <svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
      <!-- Fondo -->
      <rect width="1920" height="1080" fill="#ffffff"/>
      
      <!-- Header -->
      <rect x="0" y="0" width="1920" height="80" fill="#ec4899"/>
      <text x="960" y="45" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">D&amp;N Magic Cosmetics</text>
      
      <!-- Hero Section -->
      <rect x="100" y="120" width="1720" height="400" rx="12" fill="#fdf2f8"/>
      <text x="960" y="280" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#ec4899" text-anchor="middle">Resalta tu Belleza Natural</text>
      <text x="960" y="340" font-family="Arial, sans-serif" font-size="24" fill="#6b7280" text-anchor="middle">Productos de belleza de alta calidad para ti</text>
      <rect x="860" y="380" width="200" height="50" rx="25" fill="#ec4899"/>
      <text x="960" y="410" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">Ver Productos</text>
      
      <!-- Products Grid -->
      <text x="100" y="580" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#374151">Productos Destacados</text>
      
      <!-- Producto 1 -->
      <rect x="100" y="620" width="280" height="380" rx="12" fill="#f9fafb" stroke="#e5e7eb" stroke-width="2"/>
      <rect x="120" y="640" width="240" height="240" rx="8" fill="#ec4899"/>
      <text x="240" y="665" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">D&amp;N</text>
      <text x="240" y="690" font-family="Arial, sans-serif" font-size="14" fill="#ffffff" text-anchor="middle">MAGIC</text>
      <text x="240" y="920" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#374151" text-anchor="middle">Labial Mate Premium</text>
      <text x="240" y="945" font-family="Arial, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle">Larga duracion</text>
      <text x="240" y="975" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#ec4899" text-anchor="middle">$49.900</text>
      
      <!-- Producto 2 -->
      <rect x="420" y="620" width="280" height="380" rx="12" fill="#f9fafb" stroke="#e5e7eb" stroke-width="2"/>
      <rect x="440" y="640" width="240" height="240" rx="8" fill="#ec4899"/>
      <text x="560" y="665" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">D&amp;N</text>
      <text x="560" y="690" font-family="Arial, sans-serif" font-size="14" fill="#ffffff" text-anchor="middle">MAGIC</text>
      <text x="560" y="920" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#374151" text-anchor="middle">Base Liquida HD</text>
      <text x="560" y="945" font-family="Arial, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle">Cobertura total</text>
      <text x="560" y="975" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#ec4899" text-anchor="middle">$89.900</text>
      
      <!-- Producto 3 -->
      <rect x="740" y="620" width="280" height="380" rx="12" fill="#f9fafb" stroke="#e5e7eb" stroke-width="2"/>
      <rect x="760" y="640" width="240" height="240" rx="8" fill="#ec4899"/>
      <text x="880" y="665" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">D&amp;N</text>
      <text x="880" y="690" font-family="Arial, sans-serif" font-size="14" fill="#ffffff" text-anchor="middle">MAGIC</text>
      <text x="880" y="920" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#374151" text-anchor="middle">Paleta de Sombras</text>
      <text x="880" y="945" font-family="Arial, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle">12 tonos</text>
      <text x="880" y="975" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#ec4899" text-anchor="middle">$69.900</text>
      
      <!-- Producto 4 -->
      <rect x="1060" y="620" width="280" height="380" rx="12" fill="#f9fafb" stroke="#e5e7eb" stroke-width="2"/>
      <rect x="1080" y="640" width="240" height="240" rx="8" fill="#ec4899"/>
      <text x="1200" y="665" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">D&amp;N</text>
      <text x="1200" y="690" font-family="Arial, sans-serif" font-size="14" fill="#ffffff" text-anchor="middle">MAGIC</text>
      <text x="1200" y="920" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#374151" text-anchor="middle">Mascara de Pestanas</text>
      <text x="1200" y="945" font-family="Arial, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle">Volumen extremo</text>
      <text x="1200" y="975" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#ec4899" text-anchor="middle">$39.900</text>
    </svg>
  `;

  // Screenshot mobile
  const mobileSvg = `
    <svg width="390" height="844" xmlns="http://www.w3.org/2000/svg">
      <!-- Fondo -->
      <rect width="390" height="844" fill="#ffffff"/>
      
      <!-- Header -->
      <rect x="0" y="0" width="390" height="60" fill="#ec4899"/>
      <text x="195" y="35" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">D&amp;N Magic</text>
      
      <!-- Search -->
      <rect x="20" y="80" width="350" height="40" rx="20" fill="#f3f4f6" stroke="#e5e7eb" stroke-width="1"/>
      <text x="35" y="102" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">Buscar productos...</text>
      
      <!-- Categories -->
      <text x="20" y="150" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#374151">Categorias</text>
      <rect x="20" y="160" width="80" height="80" rx="40" fill="#fdf2f8" stroke="#ec4899" stroke-width="2"/>
      <text x="60" y="205" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#ec4899" text-anchor="middle">Labiales</text>
      
      <rect x="110" y="160" width="80" height="80" rx="40" fill="#fdf2f8" stroke="#ec4899" stroke-width="2"/>
      <text x="150" y="205" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#ec4899" text-anchor="middle">Bases</text>
      
      <rect x="200" y="160" width="80" height="80" rx="40" fill="#fdf2f8" stroke="#ec4899" stroke-width="2"/>
      <text x="240" y="205" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#ec4899" text-anchor="middle">Sombras</text>
      
      <rect x="290" y="160" width="80" height="80" rx="40" fill="#fdf2f8" stroke="#ec4899" stroke-width="2"/>
      <text x="330" y="205" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#ec4899" text-anchor="middle">Mascaras</text>
      
      <!-- Products -->
      <text x="20" y="280" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#374151">Productos Destacados</text>
      
      <!-- Producto movil 1 -->
      <rect x="20" y="300" width="170" height="220" rx="8" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1"/>
      <rect x="30" y="310" width="150" height="150" rx="6" fill="#ec4899"/>
      <text x="105" y="335" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">D&amp;N</text>
      <text x="105" y="355" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">MAGIC</text>
      <text x="105" y="485" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#374151" text-anchor="middle">Labial Mate</text>
      <text x="105" y="505" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ec4899" text-anchor="middle">$49.900</text>
      
      <!-- Producto movil 2 -->
      <rect x="200" y="300" width="170" height="220" rx="8" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1"/>
      <rect x="210" y="310" width="150" height="150" rx="6" fill="#ec4899"/>
      <text x="285" y="335" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">D&amp;N</text>
      <text x="285" y="355" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">MAGIC</text>
      <text x="285" y="485" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#374151" text-anchor="middle">Base HD</text>
      <text x="285" y="505" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ec4899" text-anchor="middle">$89.900</text>
      
      <!-- Producto movil 3 -->
      <rect x="20" y="540" width="170" height="220" rx="8" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1"/>
      <rect x="30" y="550" width="150" height="150" rx="6" fill="#ec4899"/>
      <text x="105" y="575" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">D&amp;N</text>
      <text x="105" y="595" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">MAGIC</text>
      <text x="105" y="725" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#374151" text-anchor="middle">Sombras</text>
      <text x="105" y="745" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ec4899" text-anchor="middle">$69.900</text>
      
      <!-- Producto movil 4 -->
      <rect x="200" y="540" width="170" height="220" rx="8" fill="#f9fafb" stroke="#e5e7eb" stroke-width="1"/>
      <rect x="210" y="550" width="150" height="150" rx="6" fill="#ec4899"/>
      <text x="285" y="575" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">D&amp;N</text>
      <text x="285" y="595" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" text-anchor="middle">MAGIC</text>
      <text x="285" y="725" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#374151" text-anchor="middle">Mascara</text>
      <text x="285" y="745" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ec4899" text-anchor="middle">$39.900</text>
      
      <!-- Bottom Tab Bar -->
      <rect x="0" y="784" width="390" height="60" fill="#ffffff" stroke="#e5e7eb" stroke-width="1"/>
      <circle cx="78" cy="814" r="8" fill="#ec4899"/>
      <text x="78" y="835" font-family="Arial, sans-serif" font-size="10" fill="#ec4899" text-anchor="middle">Inicio</text>
      <circle cx="156" cy="814" r="8" fill="#d1d5db"/>
      <text x="156" y="835" font-family="Arial, sans-serif" font-size="10" fill="#6b7280" text-anchor="middle">Productos</text>
      <circle cx="234" cy="814" r="8" fill="#d1d5db"/>
      <text x="234" y="835" font-family="Arial, sans-serif" font-size="10" fill="#6b7280" text-anchor="middle">Carrito</text>
      <circle cx="312" cy="814" r="8" fill="#d1d5db"/>
      <text x="312" y="835" font-family="Arial, sans-serif" font-size="10" fill="#6b7280" text-anchor="middle">Perfil</text>
    </svg>
  `;

  try {
    // Generar screenshots
    await sharp(Buffer.from(desktopSvg))
      .png()
      .toFile(path.join(screenshotsDir, 'desktop-home.png'));
    console.log('✅ Generado: desktop-home.png');

    await sharp(Buffer.from(mobileSvg))
      .png()
      .toFile(path.join(screenshotsDir, 'mobile-products.png'));
    console.log('✅ Generado: mobile-products.png');

    console.log('✅ ¡Screenshots generados exitosamente!');
  } catch (error) {
    console.error('❌ Error generando screenshots:', error);
  }
}

generateScreenshots().catch(console.error);