'use server';

import { redirect as nextRedirect } from 'next/navigation';

// NOTE: Citation
// Date: 03/18/2024
// This function is based on the documentation for the next/navigation library.
// It's used to redirect the user to a different page.
// Source: https://nextjs.org/docs/api-reference/next/navigation/redirect

export async function redirect(path: string) {
    nextRedirect(path);
}
