import { handlers } from "@/auth"
import { NextRequest } from "next/server"

// Force Node.js runtime (not Edge) to ensure cookies work properly
export const runtime = 'nodejs'

// #region agent log
const logRequest = (method: string, url: string, searchParams: URLSearchParams) => {
  fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:5',message:'Auth route handler called',data:{method,url,pathname:new URL(url).pathname,searchParams:Object.fromEntries(searchParams),hasCode:searchParams.has('code'),hasError:searchParams.has('error')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
};
// #endregion

export const { GET, POST } = {
  GET: async (req: NextRequest) => {
    // #region agent log
    const url = new URL(req.url);
    logRequest('GET', req.url, url.searchParams);
    console.log('[AUTH DEBUG] GET request:', url.pathname, 'params:', Object.fromEntries(url.searchParams));
    // Log cookies for PKCE debugging - capture actual cookie names
    const cookieHeader = req.headers.get('cookie');
    const hasCookies = !!cookieHeader;
    const cookieCount = cookieHeader ? cookieHeader.split(';').length : 0;
    const cookieNames = cookieHeader ? cookieHeader.split(';').map(c => c.trim().split('=')[0]) : [];
    const hasPkceCookie = cookieHeader?.includes('pkce') || cookieHeader?.includes('code_verifier') || false;
    const pkceCookieNames = cookieNames.filter(name => name.toLowerCase().includes('pkce') || name.toLowerCase().includes('code_verifier'));
    fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:10',message:'Cookie check for PKCE',data:{pathname:url.pathname,hasCookies,cookieCount,cookieNames,hasPkceCookie,pkceCookieNames,isCallback:url.pathname.includes('/callback/')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H6'})}).catch(()=>{});
    // #endregion
    try {
      const response = await handlers.GET(req);
      // #region agent log
      const location = response.headers.get('location');
      const isRedirect = response.status >= 300 && response.status < 400;
      console.log('[AUTH DEBUG] GET response:', response.status, 'isRedirect:', isRedirect, 'location:', location);
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:17',message:'GET handler response',data:{status:response.status,statusText:response.statusText,url:req.url,isRedirect,location},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      return response;
    } catch (error) {
      // #region agent log
      console.error('[AUTH DEBUG] GET error:', error);
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:24',message:'GET handler error',data:{error:error instanceof Error ? error.message : String(error),url:req.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H2'})}).catch(()=>{});
      // #endregion
      throw error;
    }
  },
  POST: async (req: NextRequest) => {
    // #region agent log
    const url = new URL(req.url);
    logRequest('POST', req.url, url.searchParams);
    console.log('[AUTH DEBUG] POST request:', url.pathname, 'params:', Object.fromEntries(url.searchParams));
    // #endregion
    try {
      const response = await handlers.POST(req);
      // #region agent log
      const locationHeader = response.headers.get('location');
      const isRedirect = response.status >= 300 && response.status < 400;
      // Log Set-Cookie headers to see what cookies are being set
      const setCookieHeaders = response.headers.getSetCookie();
      const cookieNames = setCookieHeaders.map(cookie => cookie.split(';')[0].split('=')[0]);
      const pkceCookies = setCookieHeaders.filter(cookie => cookie.toLowerCase().includes('pkce') || cookie.toLowerCase().includes('code_verifier'));
      // Extract redirect_uri from the location header if it's a Google OAuth URL
      let redirectUri = null;
      if (locationHeader && locationHeader.includes('accounts.google.com')) {
        try {
          const url = new URL(locationHeader);
          redirectUri = url.searchParams.get('redirect_uri');
          console.log('[AUTH DEBUG] POST response:', response.status, 'isRedirect:', isRedirect);
          console.log('[AUTH DEBUG] Google OAuth URL:', locationHeader);
          console.log('[AUTH DEBUG] Redirect URI being sent to Google:', redirectUri);
          console.log('[AUTH DEBUG] NEXTAUTH_URL from env:', process.env.NEXTAUTH_URL);
          console.log('[AUTH DEBUG] Set-Cookie headers:', setCookieHeaders.length, 'cookies:', cookieNames);
          console.log('[AUTH DEBUG] PKCE cookies being set:', pkceCookies.length);
          if (pkceCookies.length > 0) {
            console.log('[AUTH DEBUG] PKCE cookie full value:', pkceCookies[0]);
            // Log cookie attributes to debug why it's not being sent back
            const cookieStr = pkceCookies[0];
            const hasSecure = cookieStr.toLowerCase().includes('secure');
            const hasSameSite = cookieStr.toLowerCase().includes('samesite');
            const sameSiteValue = cookieStr.match(/samesite=([^;]+)/i)?.[1] || 'none';
            const hasHttpOnly = cookieStr.toLowerCase().includes('httponly');
            const pathMatch = cookieStr.match(/path=([^;]+)/i);
            const pathValue = pathMatch ? pathMatch[1] : '/';
            console.log('[AUTH DEBUG] PKCE cookie attributes:', { hasSecure, hasSameSite, sameSiteValue, hasHttpOnly, pathValue });
            fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:66',message:'PKCE cookie attributes',data:{hasSecure,hasSameSite,sameSiteValue,hasHttpOnly,pathValue,cookieStr},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H7'})}).catch(()=>{});
          }
        } catch (e) {
          console.error('[AUTH DEBUG] Error parsing location header:', e);
        }
      } else {
        console.log('[AUTH DEBUG] POST response:', response.status, 'isRedirect:', isRedirect, 'location:', locationHeader);
      }
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:34',message:'POST handler response',data:{status:response.status,statusText:response.statusText,url:req.url,isRedirect,location:locationHeader,redirectUri,nextAuthUrl:process.env.NEXTAUTH_URL,setCookieCount:setCookieHeaders.length,cookieNames,pkceCookieCount:pkceCookies.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      return response;
    } catch (error) {
      // #region agent log
      console.error('[AUTH DEBUG] POST error:', error);
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:40',message:'POST handler error',data:{error:error instanceof Error ? error.message : String(error),url:req.url},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H2'})}).catch(()=>{});
      // #endregion
      throw error;
    }
  },
}
