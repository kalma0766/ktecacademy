import { sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { VALID_WEEK_KEYS, XP_PER_EXAM, XP_PER_WEEK } from '@/lib/course'
import { getSessionUser, unauthorized } from '@/lib/session'

type Row = { id: string; name: string; weeks: number; exams: number }

export async function GET() {
  const me = await getSessionUser()
  if (!me) return unauthorized()

  const validKeys = [...VALID_WEEK_KEYS]
  const result = await db.execute<Row>(sql`
    SELECT u.id, u.name,
      (SELECT COUNT(DISTINCT w."weekKey")::int FROM week_completions w
         WHERE w."userId" = u.id AND w."weekKey" = ANY(${validKeys})) AS weeks,
      (SELECT COUNT(DISTINCT e."examId")::int FROM exam_attempts e
         WHERE e."userId" = u.id AND e.passed) AS exams
    FROM "user" u
  `)

  const rows = result.rows
    .map((r) => ({
      name: r.name,
      isMe: r.id === me.id,
      weeks: r.weeks,
      exams: r.exams,
      xp: r.weeks * XP_PER_WEEK + r.exams * XP_PER_EXAM,
    }))
    .sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name))
    .slice(0, 50)

  return NextResponse.json({ rows })
}
