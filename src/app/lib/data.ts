import { PicklistSchema2024, SortOrder } from "@/app/lib/types";
function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  

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

async function fetchDataForTeam(team: number): Promise<PicklistSchema2024> {
    const teamData = await fetch(`https://api.statbotics.io/v3/team_year/${team}/2024`)
        .then((response) => response.json());

    return {
        teamNumber: team,
        totalEpa: parseFloat(teamData["epa"]["breakdown"]["total_points"]["mean"]),
        totalNotesInAuto: parseFloat(teamData["epa"]["breakdown"]["auto_notes"]["mean"]),
        totalNotesInSpeaker: parseFloat(teamData["epa"]["breakdown"]["speaker_notes"]["mean"]),
        totalNotesInAmp: parseFloat(teamData["epa"]["breakdown"]["amp_notes"]["mean"])
    };
}