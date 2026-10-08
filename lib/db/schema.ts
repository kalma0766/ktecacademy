import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

export const weekCompletions = pgTable('week_completions', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  weekKey: text('weekKey').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const examAttempts = pgTable('exam_attempts', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  examId: integer('examId').notNull(),
  score: integer('score').notNull(),
  total: integer('total').notNull(),
  passed: boolean('passed').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  authorName: text('authorName').notNull(),
  body: text('body').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
