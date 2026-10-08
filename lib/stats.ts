import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { examAttempts, messages, weekCompletions } from '@/lib/db/schema'
import { QUARTERS, VALID_WEEK_KEYS, XP_PER_EXAM, XP_PER_WEEK } from '@/lib/course'

const dayKey = (d: Date) => d.toISOString().slice(0, 10)

function computeStreak(days: Set<string>) {
  const cursor = new Date()
  if (!days.has(dayKey(cursor))) cursor.setUTCDate(cursor.getUTCDate() - 1)
  let streak = 0
  while (days.has(dayKey(cursor))) {
    streak++
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }
  return streak
}

export async function getUserStats(userId: string) {
  const [completions, attempts, posts] = await Promise.all([
    db.select().from(weekCompletions).where(eq(weekCompletions.userId, userId)),
    db.select().from(examAttempts).where(eq(examAttempts.userId, userId)).orderBy(desc(examAttempts.createdAt)),
    db
      .select({ createdAt: messages.createdAt })
      .from(messages)
      .where(eq(messages.userId, userId)),
  ])

  const completedWeeks = completions.filter((c) => VALID_WEEK_KEYS.has(c.weekKey)).map((c) => c.weekKey)
  const passedExamIds = [...new Set(attempts.filter((a) => a.passed).map((a) => a.examId))].sort()

  const bestByExam: Record<number, { score: number; total: number; passed: boolean }> = {}
  for (const a of attempts) {
    const prev = bestByExam[a.examId]
    if (!prev || a.score > prev.score) bestByExam[a.examId] = { score: a.score, total: a.total, passed: a.passed }
  }

  const activeDays = new Set<string>([
    ...completions.map((c) => dayKey(c.createdAt)),
    ...attempts.map((a) => dayKey(a.createdAt)),
    ...posts.map((p) => dayKey(p.createdAt)),
  ])

  const weekTitle = new Map(QUARTERS.flatMap((q) => q.weeks.map((w) => [w.key, `Q${q.id} Week ${w.number}: ${w.title}`])))
  const activity = [
    ...completions
      .filter((c) => weekTitle.has(c.weekKey))
      .map((c) => ({ type: 'week', text: `Completed ${weekTitle.get(c.weekKey)}`, at: c.createdAt })),
    ...attempts.map((a) => ({
      type: a.passed ? 'exam-pass' : 'exam-fail',
      text: `${a.passed ? 'Passed' : 'Attempted'} Q${a.examId} Exam (${a.score}/${a.total})`,
      at: a.createdAt,
    })),
  ]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, 8)

  return {
    completedWeeks,
    passedExamIds,
    bestByExam,
    xp: completedWeeks.length * XP_PER_WEEK + passedExamIds.length * XP_PER_EXAM,
    daysActive: activeDays.size,
    streak: computeStreak(activeDays),
    activity,
  }
}
