'use server';

import { revalidateTag as nextRevalidateTag } from 'next/cache';
import { redirect as nextRedirect } from 'next/navigation';

export async function revalidateTag(tag: string) {
    nextRevalidateTag(tag);
}

export async function redirect(path: string) {
    nextRedirect(path);
}
