export async function fetcher(url: string) {
    const res = await fetch(url);
    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
    }
    return res.json();
}
