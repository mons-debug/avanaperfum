import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const SUPPORTED_LOCALES = ['en', 'fr'];
const DEFAULT_LOCALE = 'fr';

// Get the preferred locale from cookies or accept-language header
function getLocale(request: NextRequest): string {
  // Check for the NEXT_LOCALE cookie first
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }

  // Then try to get locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const locales = acceptLanguage
      .split(',')
      .map(item => {
        const locale = item.split(';')[0].trim();
        // Get just the language code, e.g., 'en' from 'en-US'
        return locale.split('-')[0];
      });

    // Find the first locale that is supported
    const matchedLocale = locales.find(locale => 
      SUPPORTED_LOCALES.includes(locale)
    );

    if (matchedLocale) {
      return matchedLocale;
    }
  }

  // Default to English if no match
  return DEFAULT_LOCALE;
}

export async function middleware(request: NextRequest) {
  // Get the locale to use for this request
  const locale = getLocale(request);
  
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  // Add the locale to the headers for use in the app
  requestHeaders.set('x-locale', locale);
  
  // For API routes, we just need to set the header
  if (request.nextUrl.pathname.startsWith('/api/') && !request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  // Handle admin-login pages separately - they're standalone
  if (request.nextUrl.pathname === '/admin-login' || 
      request.nextUrl.pathname.includes('admin-login')) {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    
    // Set locale cookie
    response.cookies.set('NEXT_LOCALE', locale, { 
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/' 
    });
    
    return response;
  }
  
  // Check if we need to handle admin route protection
  if (request.nextUrl.pathname.startsWith('/admin') || 
      request.nextUrl.pathname.includes('(admin)')) {
    
    // Verify the token for all other admin routes
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // If no token or user is not an admin, redirect to login
    if (!token || token.role !== 'admin') {
      const url = new URL('/admin-login', request.url);
      // Pass the original destination as a query param to redirect after login
      url.searchParams.set('callbackUrl', request.url);
      
      return NextResponse.redirect(url);
    }
  }

  // Create a response for all other routes
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set/update the NEXT_LOCALE cookie for future requests
  response.cookies.set('NEXT_LOCALE', locale, { 
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/' 
  });

  return response;
}

export const config = {
  matcher: [
    // Skip static files but include all admin routes and API routes
    '/((?!_next/static|_next/image|favicon.ico|images|public).*)',
    '/admin/:path*',
    '/api/:path*'
  ],
}; 