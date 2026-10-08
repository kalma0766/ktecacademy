import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
