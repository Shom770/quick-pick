import { PicklistSchema2025, SortOrder } from "@/app/lib/types";

export async function fetchDataForTeams(teams: number[], eventCode: string | null) {
    return await Promise.all(teams.map(async (team) => await fetchDataForTeam(team, eventCode)));
}

export function sortDataByStat(data: PicklistSchema2025[], sortOrder: SortOrder, selectedBranch: string) {
    const sortOrderToPropertyName: Record<SortOrder, keyof PicklistSchema2025> = {
        "Total EPA": "totalEpa",
        "Total Coral in Auto": "totalCoralInAuto",
        "Total Coral on Selected Branch": ("coral" + selectedBranch as "coralL1" | "coralL2" | "coralL3" | "coralL4"),
        "Total Algae in Net": "totalAlgaeInNet",
        "Endgame Points": "endgamePoints"
    }

    return data.sort((d1, d2) => d1[sortOrderToPropertyName[sortOrder]] - d2[sortOrderToPropertyName[sortOrder]]).reverse();
}

export async function isEventInSeason(eventCode: string): Promise<boolean> {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('X-TBA-Auth-Key', process.env.API_KEY as string);

    const eventData = await fetch(`https://www.thebluealliance.com/api/v3/event/${eventCode}/simple`, {
        headers: requestHeaders
    })
        .then((response) => response.json());

    if (eventData["Error"]) {
        return false;
    }

    return 0 <= eventData["event_type"] && eventData["event_type"] <= 5;
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

async function fetchDataForTeam(team: number, eventCode: string | null): Promise<PicklistSchema2025> {
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Access-Control-Allow-Origin', 'https://quick-pick-psi.vercel.app');

    let teamData: Record<string, any>;

    if (!eventCode) {
        teamData = await fetch(`https://api.statbotics.io/v3/team_year/${team}/2025`, {
            headers: requestHeaders
        })
            .then((response) => response.json());
    }
    else {
        teamData = await fetch(`https://api.statbotics.io/v3/team_event/${team}/${eventCode}`, {
            headers: requestHeaders
        })
            .then((response) => response.json());
    }

    try {
        return {
            teamNumber: team,
            totalEpa: parseFloat(teamData["epa"]["breakdown"]["total_points"]), // todo: gonna have to switch to mean when calculations start
            autoEpa: parseFloat(teamData["epa"]["breakdown"]["auto_points"]),
            teleopEpa: parseFloat(teamData["epa"]["breakdown"]["teleop_points"]),
            totalCoralInAuto: parseFloat(teamData["epa"]["breakdown"]["auto_coral"]),
            coralL1: parseFloat(teamData["epa"]["breakdown"]["coral_l1"]),
            coralL2: parseFloat(teamData["epa"]["breakdown"]["coral_l2"]),
            coralL3: parseFloat(teamData["epa"]["breakdown"]["coral_l3"]),
            coralL4: parseFloat(teamData["epa"]["breakdown"]["coral_l4"]),
            totalAlgaeInNet: parseFloat(teamData["epa"]["breakdown"]["net_algae"]),
            endgamePoints: parseFloat(teamData["epa"]["breakdown"]["barge_points"])
        };
    } catch (_) {
        // No error from this year's game.
        return {
            teamNumber: team,
            totalEpa: 0,
            autoEpa: 0,
            teleopEpa: 0,
            totalCoralInAuto: 0,
            coralL1: 0,
            coralL2: 0,
            coralL3: 0,
            coralL4: 0,
            totalAlgaeInNet: 0,
            endgamePoints: 0
        }
    }
}