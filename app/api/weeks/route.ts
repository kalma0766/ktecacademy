import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { weekCompletions } from '@/lib/db/schema'
import { VALID_WEEK_KEYS } from '@/lib/course'
import { getSessionUser, unauthorized } from '@/lib/session'

export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return unauthorized()

  const body = await req.json().catch(() => null)
  const weekKey = typeof body?.weekKey === 'string' ? body.weekKey : ''
  const done = body?.done === true
  if (!VALID_WEEK_KEYS.has(weekKey)) {
    return NextResponse.json({ error: 'Invalid week' }, { status: 400 })
  }

  const scope = and(eq(weekCompletions.userId, user.id), eq(weekCompletions.weekKey, weekKey))
  if (done) {
    const existing = await db.select({ id: weekCompletions.id }).from(weekCompletions).where(scope).limit(1)
    if (existing.length === 0) await db.insert(weekCompletions).values({ userId: user.id, weekKey })
  } else {
    await db.delete(weekCompletions).where(scope)
  }

  return NextResponse.json({ ok: true })
}
