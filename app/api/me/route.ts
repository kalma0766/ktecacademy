import { NextResponse } from 'next/server'
import { publicCourse } from '@/lib/course'
import { getSessionUser, unauthorized } from '@/lib/session'
import { getUserStats } from '@/lib/stats'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return unauthorized()

  const stats = await getUserStats(user.id)
  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
    stats,
    course: publicCourse(),
  })
}
