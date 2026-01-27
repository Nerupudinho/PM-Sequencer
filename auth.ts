import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// #region agent log
const logConfig = () => {
  const hasSecret = !!process.env.NEXTAUTH_SECRET;
  const hasUrl = !!process.env.NEXTAUTH_URL;
  const hasClientId = !!process.env.GOOGLE_CLIENT_ID;
  const hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;
  fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.ts:7',message:'NextAuth config check',data:{hasSecret,hasUrl,hasClientId,hasClientSecret,url:process.env.NEXTAUTH_URL},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H4'})}).catch(()=>{});
};
if (typeof window === 'undefined') logConfig();
// #endregion

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  // Note: useSecureCookies is automatically determined by NextAuth based on URL scheme
  // For OAuth + PKCE to work, HTTPS is required (use ngrok for local development)
  // Debug logging enabled for production (critical for first 48h troubleshooting)
  debug: process.env.NODE_ENV === "production",
  logger: {
    error(code, metadata) {
      console.error("[NextAuth Error]", code, metadata)
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // #region agent log
  // Log NextAuth config on initialization
  // #endregion
  callbacks: {
    async session({ session, token }: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.ts:28',message:'Session callback called',data:{hasSession:!!session,hasToken:!!token,hasTokenSub:!!token?.sub,userEmail:session?.user?.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
      // #endregion
      if (session?.user && token?.sub) {
        session.user.id = token.sub
      }
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.ts:32',message:'Session callback returning',data:{sessionUserId:session?.user?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
      // #endregion
      return session
    },
    async jwt({ token, user, account }: any) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.ts:45',message:'JWT callback entry',data:{hasUser:!!user,hasAccount:!!account,provider:account?.provider,userEmail:user?.email,accountType:account?.type,userId:user?.id,userName:user?.name,hasToken:!!token},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      if (user) {
        token.sub = user.id
      }
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7d91f934-abb2-4e7e-b1bc-8e03f03a5c22',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.ts:49',message:'JWT callback exit',data:{hasTokenSub:!!token?.sub},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      return token
    },
  },
  pages: {
    signIn: "/login",
  },
})
