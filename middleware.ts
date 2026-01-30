import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

export async function middleware(request: NextRequest) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:6',message:'Middleware called',data:{pathname:request.nextUrl.pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
  // #endregion
  const session = await auth()
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:9',message:'Session check result',data:{hasSession:!!session,userEmail:session?.user?.email,pathname:request.nextUrl.pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
  // #endregion

  if (!session) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:13',message:'Redirecting to login',data:{pathname:request.nextUrl.pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
    // #endregion
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:20',message:'Allowing request through',data:{pathname:request.nextUrl.pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
  // #endregion
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js routes)
     * - login (login page)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)",
  ],
}
