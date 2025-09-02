/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Configuración de imágenes optimizada para iOS
  images: {
    domains: ['localhost', 'dnmagiccosmetics.com'],
    formats: ['image/webp', 'image/avif'], // Formatos modernos que iOS soporta bien
    // Tamaños específicos para dispositivos iOS
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Calidad optimizada para iOS
    // quality: 85,
  },

  // ✅ Configuración experimental para mejor rendimiento en iOS
  experimental: {
    optimizeCss: true, // Optimizar CSS para Safari
    scrollRestoration: true, // Mejorar comportamiento de scroll en iOS
  },

  // ✅ Configuración de compilación para iOS Safari
  compiler: {
    // Remover console.logs en producción para mejor rendimiento en iOS
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // ✅ Headers específicos para compatibilidad con iOS Safari
  async headers() {
    return [
      {
        // Aplicar a todas las rutas
        source: '/(.*)',
        headers: [
          // Prevenir problemas de MIME en iOS
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Seguridad para iOS WebViews
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Protección XSS para Safari iOS
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Cache optimizado para iOS Safari
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          // Permitir instalación como PWA en iOS
          {
            key: 'X-Apple-Touch-Icon',
            value: '/apple-touch-icon.png',
          },
        ],
      },
      // Headers específicos para archivos estáticos
      {
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Headers para el manifest PWA
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ];
  },

  // ✅ Configuración de PWA para iOS
  async rewrites() {
    return [
      // Rewrite para apple-touch-icon si no existe
      {
        source: '/apple-touch-icon.png',
        destination: '/icon-192x192.png',
      },
      {
        source: '/apple-touch-icon-precomposed.png',
        destination: '/icon-192x192.png',
      },
    ];
  },

  // ✅ Configuración de redirects para iOS Safari
  async redirects() {
    return [
      // Redirect para mejorar SEO en dispositivos móviles
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // ✅ Configuración de Webpack para iOS
  webpack: (config, { dev, isServer }) => {
    // Optimizaciones específicas para iOS Safari
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Chunk específico para iOS optimizations
          ios: {
            name: 'ios-polyfills',
            test: /[\\/]node_modules[\\/](@babel|core-js|regenerator-runtime)/,
            chunks: 'all',
            priority: 20,
          },
        },
      };
    }

    // Resolver alias para mejor compatibilidad
    config.resolve.alias = {
      ...config.resolve.alias,
      // Polyfills para iOS Safari si es necesario
      'intersection-observer$': 'intersection-observer/intersection-observer.js',
    };

    return config;
  },

  // ✅ Variables de entorno para iOS
  env: {
    // Flag para detectar si necesitamos optimizaciones iOS
    NEXT_PUBLIC_IOS_OPTIMIZED: 'true',
  },

  // ✅ Configuración de output para mejor compatibilidad con iOS
  output: 'standalone', // Mejor para deployments y iOS WebViews

  // ✅ Configuración de TypeScript
  typescript: {
    // Durante el build, no fallar por errores de tipos en desarrollo
    ignoreBuildErrors: false,
  },

  // ✅ Configuración de ESLint
  eslint: {
    // Durante el build, no fallar por warnings de ESLint
    ignoreDuringBuilds: false,
  },

  // ✅ Configuración para mejor soporte de dispositivos táctiles
  trailingSlash: false, // iOS Safari prefiere URLs sin trailing slash

  // ✅ Configuración de compresión para iOS
  compress: true, // Habilitar compresión gzip que iOS Safari maneja bien

  // ✅ Configuración de dominio para cookies (si usas autenticación)
  serverRuntimeConfig: {
    // Solo disponible en el servidor
  },
  publicRuntimeConfig: {
    // Disponible tanto en servidor como cliente
    staticFolder: '/assets',
  },
};

export default nextConfig;