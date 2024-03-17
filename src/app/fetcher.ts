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
