import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Достаем роль из куки
  const userRole = request.cookies.get('userRole')?.value;

  // Если пользователь лезет в админку
  if (pathname.startsWith('/hard-stuff')) {
    // Если роли нет или это не админ
    if (userRole !== 'admin') {
      // Делаем редирект на 404 или главную
      // rewrite оставит URL старым, но покажет контент другой страницы
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }

  return NextResponse.next();
}

// Настраиваем, на какие пути реагирует мидлвар
export const config = {
  matcher: [
    /*
     * Защищаем все пути, начинающиеся с /hard-stuff
     */
    '/hard-stuff/:path*',
  ],
};