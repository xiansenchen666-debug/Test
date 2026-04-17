import app from './backend/src/main.ts';

const port = Number(Deno.env.get('PORT') ?? 3000);

Deno.serve({ port }, app);
