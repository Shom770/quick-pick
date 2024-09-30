import { PicklistSchema2024, SortOrder } from "@/app/lib/types";

export async function fetchDataForTeams(teams: number[]) {
    return await Promise.all(teams.map(async (team) => await fetchDataForTeam(team)));
}

export function sortDataByStat(data: PicklistSchema2024[], sortOrder: SortOrder) {
    const sortOrderToPropertyName: Record<SortOrder, keyof PicklistSchema2024> = {
        "Total EPA": "totalEpa",
        "Total Notes in Auto": "totalNotesInAuto",
        "Total Notes in Speaker": "totalNotesInSpeaker",
        "Total Notes in Amp": "totalNotesInAmp"
    }

    return data.sort((d1, d2) => d1[sortOrderToPropertyName[sortOrder]] - d2[sortOrderToPropertyName[sortOrder]]).reverse();
}

export async function fetchTeamsForEvent(eventCode: string): Promise<number[]> {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('X-TBA-Auth-Key', process.env.API_KEY as string);

    const eventData = await fetch(`https://www.thebluealliance.com/api/v3/event/${eventCode}/teams/simple`, {
        headers: requestHeaders
    })
        .then((response) => response.json());

    if (eventData["Error"]) {
        return [];
    }

    return eventData.map((team: Record<string, string | number>) => team["team_number"]);
}

async function fetchDataForTeam(team: number): Promise<PicklistSchema2024> {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Access-Control-Allow-Origin', 'https://quick-pick-psi.vercel.app');

    const teamData = await fetch(`https://api.statbotics.io/v3/team_year/${team}/2024`, {
        headers: requestHeaders
    })
        .then((response) => response.json());
    
        console.log(team);

    try {
        return {
            teamNumber: team,
            totalEpa: parseFloat(teamData["epa"]["breakdown"]["total_points"]["mean"]),
            totalNotesInAuto: parseFloat(teamData["epa"]["breakdown"]["auto_notes"]["mean"]),
            totalNotesInSpeaker: parseFloat(teamData["epa"]["breakdown"]["speaker_notes"]["mean"]),
            totalNotesInAmp: parseFloat(teamData["epa"]["breakdown"]["amp_notes"]["mean"])
        };
    } catch (_) {
        // No error from this year's game.
        return {
            teamNumber: team,
            totalEpa: 0,
            totalNotesInAuto: 0,
            totalNotesInAmp: 0,
            totalNotesInSpeaker: 0
        }
    }
}