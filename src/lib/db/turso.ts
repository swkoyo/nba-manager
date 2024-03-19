import { createClient } from '@libsql/client';

// NOTE: Citation
// Date: 03/18/2024
// This function is based on the documentation for Turso
// Turso is the cloud database used in this project
// It is based on the libsql library. The libsql client is used to create a new client for the Turso database.
// Source: https://docs.turso.tech/sdk/ts/quickstart

export const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
});
