import { desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { messages } from '@/lib/db/schema'
import { getSessionUser, unauthorized } from '@/lib/session'

const MAX_LENGTH = 1000

export async function GET() {
  const user = await getSessionUser()
  if (!user) return unauthorized()

  const rows = await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(100)
  return NextResponse.json({
    messages: rows.reverse().map((m) => ({
      id: m.id,
      authorName: m.authorName,
      body: m.body,
      createdAt: m.createdAt,
      isMine: m.userId === user.id,
    })),
  })
}

export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return unauthorized()

  const body = await req.json().catch(() => null)
  const text = typeof body?.body === 'string' ? body.body.trim() : ''
  if (!text || text.length > MAX_LENGTH) {
    return NextResponse.json({ error: `Message must be 1–${MAX_LENGTH} characters` }, { status: 400 })
  }

  await db.insert(messages).values({ userId: user.id, authorName: user.name, body: text })
  return NextResponse.json({ ok: true })
}
