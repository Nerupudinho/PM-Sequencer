import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Test database connectivity
    await prisma.user.findFirst()
    return Response.json({ ok: true, database: "connected" })
  } catch (error) {
    console.error("[Health Check] Database connection failed:", error)
    return Response.json(
      { ok: false, database: "disconnected", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 503 }
    )
  }
}
