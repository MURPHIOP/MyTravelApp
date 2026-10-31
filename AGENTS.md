<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:ecc-evolution-guardrails -->
# ECC Evolution Guardrails

All automated refactoring agents must comply with `ecc-evolution.json`:
- **src/lib/private_uploads/**: IMMUTABLE DATA STORE. Never delete, relocate, clean up, or modify vault files.
- **.env.local**: LOCKED SECRET STORE. Never overwrite, sanitize, or replace with mock keys.
- **Supabase migrations & contracts** (`supabase/migrations/**`, `verify_supabase.ts`, `src/lib/supabase.ts`): SCHEMA STABILITY LOCK. No destructive DDL, table drops, column drops, or unverified automated schema rewrites.
<!-- END:ecc-evolution-guardrails -->

