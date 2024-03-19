// NOTE: Citation
// Date: 03/18/2024
// All functions on this page are based on the documentation for the SWR library.
// These functions abstract the use of the fetch package
// The main reason for these abstractions is to standardize error handling and return types when fetching data
// Source: https://swr.vercel.app/docs/data-fetching

export async function fetcher(url: string) {
    const res = await fetch(url);
    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
    }
    return res.json();
}

export async function poster(url: string, data: any) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
    }
    return res.json();
}

export async function putter(url: string, data: any) {
    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
    }
    return res.json();
}

export async function deleter(url: string) {
    const res = await fetch(url, {
        method: 'DELETE',
    });
    if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
    }
    return res.json();
}
