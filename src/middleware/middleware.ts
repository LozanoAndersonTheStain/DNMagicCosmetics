import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Solo aplicar middleware a rutas de checkout
  if (request.nextUrl.pathname.startsWith('/checkout')) {
    // Verificar si hay items en el carrito desde las cookies o sessionStorage
    // Como no podemos acceder a sessionStorage en el middleware, usaremos una cookie
    const cartItems = request.cookies.get('cart-items');
    
    if (!cartItems || cartItems.value === '[]' || cartItems.value === '') {
      return NextResponse.redirect(new URL('/products', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout/:path*']
};