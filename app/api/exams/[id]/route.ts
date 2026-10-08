import { and, eq, inArray } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { examAttempts, weekCompletions } from '@/lib/db/schema'
import { EXAM_QUESTIONS, PASS_PERCENT, QUARTERS } from '@/lib/course'
import { getSessionUser, unauthorized } from '@/lib/session'

type Ctx = { params: Promise<{ id: string }> }

async function requireUnlocked(userId: string, examId: number) {
  const quarter = QUARTERS.find((q) => q.id === examId)
  if (!quarter) return 'Exam not found'
  const keys = quarter.weeks.map((w) => w.key)
  const done = await db
    .select({ weekKey: weekCompletions.weekKey })
    .from(weekCompletions)
    .where(and(eq(weekCompletions.userId, userId), inArray(weekCompletions.weekKey, keys)))
  const unique = new Set(done.map((d) => d.weekKey))
  if (unique.size < keys.length) return `Complete all ${keys.length} weeks of Quarter ${examId} first`
  return null
}

export async function GET(_req: Request, { params }: Ctx) {
  const user = await getSessionUser()
  if (!user) return unauthorized()
  const examId = Number((await params).id)

  const lockReason = await requireUnlocked(user.id, examId)
  if (lockReason) return NextResponse.json({ error: lockReason }, { status: 403 })

  const questions = EXAM_QUESTIONS[examId].map((q, i) => ({ index: i, prompt: q.prompt, options: q.options }))
  return NextResponse.json({ examId, questions })
}

export async function POST(req: Request, { params }: Ctx) {
  const user = await getSessionUser()
  if (!user) return unauthorized()
  const examId = Number((await params).id)

  const lockReason = await requireUnlocked(user.id, examId)
  if (lockReason) return NextResponse.json({ error: lockReason }, { status: 403 })

  const body = await req.json().catch(() => null)
  const answers: unknown[] = Array.isArray(body?.answers) ? body.answers : []
  const questions = EXAM_QUESTIONS[examId]
  const score = questions.reduce((sum, q, i) => (answers[i] === q.answer ? sum + 1 : sum), 0)
  const total = questions.length
  const passed = (score / total) * 100 >= PASS_PERCENT

  await db.insert(examAttempts).values({ userId: user.id, examId, score, total, passed })
  return NextResponse.json({ score, total, passed })
}
