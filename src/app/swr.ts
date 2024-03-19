import useSWR from 'swr';
import { fetcher } from './fetcher';
import {
    AvailableData,
    FullRoster,
    Player,
    PlayoffRound,
    Team,
} from '@/lib/types';

// NOTE: Citation
// Date: 03/18/2024
// All functions on this page are based on the documentation for the SWR library.
// This library is a React Hooks library for remote data fetching.
// These functions allow me to fetch data from a reusable hook and cache results.
// Source: https://swr.vercel.app/docs/data-fetching

export function useAllTeams({
    showName,
    showCity,
    showState,
    searchVal,
}: {
    showName: boolean;
    showCity: boolean;
    showState: boolean;
    searchVal: string;
}) {
    const { data, isLoading, error, mutate } = useSWR<Team[], any, string>(
        '/api/teams',
        async (url) => {
            const params: string[] = [];
            if (showName) {
                params.push('name');
            }
            if (showCity) {
                params.push('city');
            }
            if (showState) {
                params.push('state');
            }
            url += `?filter=${params.join(',')}`;
            if (searchVal) {
                url += `&search=${searchVal}`;
            }
            const res = await fetch(url);
            if (!res.ok) {
                const { message } = await res.json();
                throw new Error(message);
            }
            return res.json();
        }
    );

    return {
        data,
        isLoading,
        error,
        mutate,
    };
}

export function useAllPlayers({
    showFirstName,
    showLastName,
    searchVal,
}: {
    showFirstName: boolean;
    showLastName: boolean;
    searchVal: string;
}) {
    const { data, isLoading, error, mutate } = useSWR<Player[], any, string>(
        '/api/players',
        async (url) => {
            const params: string[] = [];
            if (showFirstName) {
                params.push('firstName');
            }
            if (showLastName) {
                params.push('lastName');
            }
            url += `?filter=${params.join(',')}`;
            if (searchVal) {
                url += `&search=${searchVal}`;
            }
            const res = await fetch(url);
            if (!res.ok) {
                const { message } = await res.json();
                throw new Error(message);
            }
            return res.json();
        }
    );

    return {
        data,
        isLoading,
        error,
        mutate,
    };
}

export function useAllPlayoffRounds({
    showName,
    searchVal,
}: {
    showName: boolean;
    searchVal: string;
}) {
    const { data, isLoading, error, mutate } = useSWR<
        PlayoffRound[],
        any,
        string
    >('/api/playoffRounds', async (url) => {
        const params: string[] = [];
        if (showName) {
            params.push('name');
        }
        url += `?filter=${params.join(',')}`;
        if (searchVal) {
            url += `&search=${searchVal}`;
        }
        const res = await fetch(url);
        if (!res.ok) {
            const { message } = await res.json();
            throw new Error(message);
        }
        return res.json();
    });

    return { data, isLoading, error, mutate };
}

export function useAllRosters({
    showYear,
    showTeam,
    showPlayoffRound,
    showPlayers,
    searchVal,
}: {
    showYear: boolean;
    showTeam: boolean;
    showPlayoffRound: boolean;
    showPlayers: boolean;
    searchVal: string;
}) {
    const { data, isLoading, error, mutate } = useSWR<
        FullRoster[],
        any,
        string
    >(
        '/api/rosters',
        async (url) => {
            const params: string[] = [];
            if (showYear) {
                params.push('year');
            }
            if (showTeam) {
                params.push('team');
            }
            if (showPlayoffRound) {
                params.push('playoffRound');
            }
            if (showPlayers) {
                params.push('players');
            }
            url += `?filter=${params.join(',')}`;
            if (searchVal) {
                url += `&search=${searchVal}`;
            }
            const res = await fetch(url);
            if (!res.ok) {
                const { message } = await res.json();
                throw new Error(message);
            }
            return res.json();
        },
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateOnMount: false,
        }
    );

    return {
        data,
        isLoading,
        error,
        mutate,
    };
}

export function usePlayer(id: number) {
    const { data, error, isLoading, mutate } = useSWR<Player>(
        `/api/players/${id}`,
        fetcher
    );

    return {
        data,
        error,
        isLoading,
        mutate,
    };
}

export function useTeam(id: number) {
    const { data, error, isLoading, mutate } = useSWR<Team>(
        `/api/teams/${id}`,
        fetcher
    );

    return {
        data,
        error,
        isLoading,
        mutate,
    };
}

export function useRoster(id: number) {
    const { data, error, isLoading, mutate } = useSWR<FullRoster>(
        `/api/rosters/${id}`,
        fetcher
    );

    return {
        data,
        error,
        isLoading,
        mutate,
    };
}

export function usePlayoffRound(id: number) {
    const { data, error, isLoading, mutate } = useSWR<PlayoffRound>(
        `/api/playoffRounds/${id}`,
        fetcher
    );

    return {
        data,
        error,
        isLoading,
        mutate,
    };
}

export function useAvailable() {
    const { data, error, isLoading, mutate } = useSWR<AvailableData>(
        '/api/available',
        fetcher,
        { revalidateOnMount: true }
    );

    return {
        data,
        error,
        isLoading,
        mutate,
    };
}
