import { PicklistSchema2024, SortOrder } from "@/app/lib/types";
function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  

export function fetchDataForTeams(teams: number[]) {
    const ls : PicklistSchema2024[] = [];

    teams.forEach((value) => {
        ls.push({
            teamNumber: value,
            totalEpa: randomIntFromInterval(300, 600) / 10.0,
            totalNotesInAuto: randomIntFromInterval(10, 40) / 10.0,
            totalNotesInSpeaker: randomIntFromInterval(30, 80) / 10.0,
            totalNotesInAmp: randomIntFromInterval(0, 80) / 10.0
        })
    })

    return ls;
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