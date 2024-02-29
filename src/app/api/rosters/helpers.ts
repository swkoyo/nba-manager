import { FullRoster } from '@/lib/types';
import { DetailedRoster } from './types';

export function serializerRoster(data: DetailedRoster[]): FullRoster[] {
    const rosters: Record<number, FullRoster> = {};
    const res: FullRoster[] = [];

    for (const d of data) {
        if (!rosters[d.rosterID]) {
            rosters[d.rosterID] = {
                rosterID: d.rosterID,
                year: d.year,
                teamID: d.teamID,
                playoffRoundID: d.playoffRoundID,
                team: {
                    teamID: d.teamID,
                    name: d.teamName,
                    city: d.teamCity,
                    state: d.teamState,
                },
                /* eslint-disable */
                playoffRound:
                    d.playoffRoundID && d.playoffRoundName
                        ? {
                              playoffRoundID: d.playoffRoundID,
                              name: d.playoffRoundName,
                          }
                        : null,
                /* eslint-enable */
                players: [],
            };
        }
        rosters[d.rosterID].players.push({
            playerID: d.playerID,
            firstName: d.playerFirstName,
            lastName: d.playerLastName,
        });
    }

    for (const rosterID in rosters) {
        res.push(rosters[rosterID]);
    }

    return res;
}
