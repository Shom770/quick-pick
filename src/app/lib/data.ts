import { PicklistSchema2026, SortOrder } from "@/app/lib/types";

export async function fetchDataForTeams(teams: number[], eventCode: string | null) {
    return await Promise.all(teams.map(async (team) => await fetchDataForTeam(team, eventCode)));
}

export function sortDataByStat(data: PicklistSchema2026[], sortOrder: SortOrder) {
    const sortOrderToPropertyName: Record<SortOrder, keyof PicklistSchema2026> = {
        "Total EPA": "totalEpa",
        "Auto Fuel": "autoFuel",
        "Teleop + Endgame Fuel": "teleopAndEndgameFuel",
        "Total Tower Points": "totalTowerPoints"
    }

    return data.sort((d1, d2) => d1[sortOrderToPropertyName[sortOrder]] - d2[sortOrderToPropertyName[sortOrder]]).reverse();
}

export async function isEventInSeason(eventCode: string): Promise<boolean> {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('X-TBA-Auth-Key', process.env.API_KEY as string);

    try {
        const eventData = await fetch(
            `https://www.thebluealliance.com/api/v3/event/${eventCode}/simple`,
            { headers: requestHeaders, cache: 'no-store' }
        ).then((response) => response.json());

        if (eventData["Error"]) {
            return false;
        }

        return 0 <= eventData["event_type"] && eventData["event_type"] <= 5;
    } catch {
        return false;
    }
}

export async function fetchTeamsForEvent(eventCode: string): Promise<number[]> {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('X-TBA-Auth-Key', process.env.API_KEY as string);

    try {
        const eventData = await fetch(
            `https://www.thebluealliance.com/api/v3/event/${eventCode}/teams/simple`,
            { headers: requestHeaders, cache: 'no-store' }
        ).then((response) => response.json());

        if (!Array.isArray(eventData)) {
            return [];
        }

        return eventData.map((team: Record<string, any>) => Number(team["team_number"]));
    } catch {
        return [];
    }
}

async function fetchDataForTeam(team: number, eventCode: string | null): Promise<PicklistSchema2026> {
    let teamData: Record<string, any>;

    if (!eventCode) {
        teamData = await fetch(`https://api.statbotics.io/v3/team_year/${team}/2026`, { cache: 'no-store' })
            .then((response) => response.json());
    }
    else {
        teamData = await fetch(`https://api.statbotics.io/v3/team_event/${team}/${eventCode}`, { cache: 'no-store' })
            .then((response) => response.json());
    }

    try {
        const bd = teamData["epa"]["breakdown"];
        return {
            teamNumber: team,
            totalEpa: parseFloat(bd["total_points"]),
            autoEpa: parseFloat(bd["auto_points"]),
            teleopEpa: parseFloat(bd["teleop_points"]),
            autoFuel: parseFloat(bd["auto_fuel"]),
            teleopAndEndgameFuel: parseFloat(bd["teleop_fuel"]) + parseFloat(bd["endgame_fuel"]),
            totalTowerPoints: parseFloat(bd["auto_tower"]) + parseFloat(bd["endgame_tower"])
        };
    } catch (_) {
        return {
            teamNumber: team,
            totalEpa: 0,
            autoEpa: 0,
            teleopEpa: 0,
            autoFuel: 0,
            teleopAndEndgameFuel: 0,
            totalTowerPoints: 0
        }
    }
}
