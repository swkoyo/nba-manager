# Running Locally

## Requirements
- Node
- [Bun](https://bun.sh/)
- [Turso CLI](https://docs.turso.tech/cli/introduction)

## Starting local turso DB
Run the command below to start a local database
```bash
turso dev --db-file local.db
```

## Setting up env
Copy the `.env.example` to a new file `.env.local`. Set the two values to:
- `TURSO_DATABASE_URL`="http://127.0.0.1:8080"
- `TURSO_AUTH_TOKEN`=""

## Run initial migrations and seed
```bash
// Run migration to create db tables
bun run ./src/lib/db/migration.ts

// Run seeder to populate db
bun run ./src/lib/db/seed.ts
```

## Start the app
```bash
// Start the nextjs app locally
npm run dev
```

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
