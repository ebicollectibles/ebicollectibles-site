// Shared by `npm run db:migrate:dev` and `npm run db:migrate:prod` — each
// just calls this with a different envFile/label, so which database gets
// migrated is never ambiguous or dependent on whatever DATABASE_URL happens
// to already be set in the terminal. See README-DEPLOY.md "Database" section
// for how to create .env.dev / .env.prod once.
import { config } from 'dotenv'
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

const target = process.argv[2] // 'dev' or 'prod'
const envFile = `.env.${target}`
const label = target.toUpperCase()

if (!existsSync(envFile)) {
  console.error(
    `\n${envFile} not found.\n\n` +
      `Create it once (in the project root, next to package.json) with your ${label} database's\n` +
      `connection string, and nothing else:\n\n` +
      `  DATABASE_URL=postgres://...\n\n` +
      `This file is git-ignored — it never gets committed or pushed anywhere.\n`,
  )
  process.exit(1)
}

config({ path: envFile })

if (!process.env.DATABASE_URL) {
  console.error(`${envFile} exists but has no DATABASE_URL line in it.`)
  process.exit(1)
}

const host = new URL(process.env.DATABASE_URL).host

if (target === 'prod') {
  console.log(`\n⚠️  This will migrate PRODUCTION: ${host}\n`)
  const rl = readline.createInterface({ input: stdin, output: stdout })
  const answer = await rl.question('Type "yes" to continue: ')
  rl.close()
  if (answer.trim().toLowerCase() !== 'yes') {
    console.log('Cancelled — nothing was migrated.')
    process.exit(0)
  }
} else {
  console.log(`\nMigrating DEV: ${host}\n`)
}

const result = spawnSync('npx', ['drizzle-kit', 'migrate'], { stdio: 'inherit', env: process.env, shell: true })
process.exit(result.status ?? 1)
