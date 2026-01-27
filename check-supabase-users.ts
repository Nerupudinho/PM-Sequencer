// Quick script to check if users are in Supabase
// Load environment variables FIRST before importing prisma
import { config } from "dotenv"
config({ path: ".env.local" })
config({ path: ".env" })

import { prisma } from "@/lib/prisma"

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })
    
    console.log(`\n✅ Found ${users.length} user(s) in Supabase:\n`)
    users.forEach((user, i) => {
      console.log(`${i + 1}. ${user.email} (${user.name || 'No name'}) - Created: ${user.createdAt}`)
    })
    
    if (users.length === 0) {
      console.log("\n⚠️  No users found. This could mean:")
      console.log("   1. No one has signed in yet")
      console.log("   2. Database save is failing (check server logs)")
      console.log("   3. Database connection issue")
    }
  } catch (error) {
    console.error("❌ Error checking users:", error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
