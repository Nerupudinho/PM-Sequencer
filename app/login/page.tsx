"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleGoogleSignIn = async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:11',message:'Sign in attempt',data:{callbackUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H1'})}).catch(()=>{});
    // #endregion
    try {
      await signIn("google", { callbackUrl });
    } catch (error: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:16',message:'Sign in error',data:{error:error?.message,errorType:error?.name,stack:error?.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'H2'})}).catch(()=>{});
      // #endregion
      console.error("Sign in error:", error);
    }
  };

  // #region agent log
  if (typeof window !== 'undefined') {
    fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:26',message:'LoginForm render',data:{viewportWidth:window.innerWidth,viewportHeight:window.innerHeight,containerExists:true},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
  }
  // #endregion

  return (
    <div className="login-container">
      {/* Blurred radial gradient ellipse */}
      <div className="gradient-ellipse" />
      
      {/* Main content container */}
      <div className="login-content">
        {/* Product Monk branding */}
        <div className="product-monk-branding">
          <div className="product-monk-logo-wrapper">
            <Image 
              src="/product-monk-logo-removebg-preview.png" 
              alt="Product Monk" 
              width={150}
              height={150}
              className="product-monk-logo-image"
              priority
              onLoad={() => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:42',message:'Image loaded successfully',data:{src:'/product-monk-logo-removebg-preview.png'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
                // #endregion
              }}
              onError={(e) => {
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'page.tsx:48',message:'Image load error',data:{src:'/product-monk-logo-removebg-preview.png',error:e?.toString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
                // #endregion
              }}
              unoptimized
            />
          </div>
        </div>

        {/* Main heading */}
        <h1 className="login-heading">
          Level up your PM stack with AI in 60 minutes.
        </h1>

        {/* Sign in button */}
        <button
          onClick={handleGoogleSignIn}
          className="google-signin-button"
        >
          <svg
            className="google-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>

        {/* Reference text */}
        <p className="login-reference">
          Reference: "How I AI " podcast
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="login-container">
        <div className="login-content">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
