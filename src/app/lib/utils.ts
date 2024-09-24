import { PicklistSchema2024, SortOrder } from "@/app/lib/types";

export function bestOverallPick(data: PicklistSchema2024[], activeTeams: number[], sortOrder: SortOrder) {
    const sortOrderToPropertyName: Record<SortOrder, keyof PicklistSchema2024> = {
        "Total EPA": "totalEpa",
        "Total Notes in Auto": "totalNotesInAuto",
        "Total Notes in Speaker": "totalNotesInSpeaker",
        "Total Notes in Amp": "totalNotesInAmp"
    }
    
    return data
        .filter((datum) => activeTeams.includes(datum["teamNumber"]))
        .sort((d1, d2) => (d1[sortOrderToPropertyName[sortOrder]] - d2[sortOrderToPropertyName[sortOrder]]) || (d1["totalEpa"] - d2["totalEpa"]))
        .reverse()[0]?.teamNumber || 0;
}

export function bestSpeakerBot(data: PicklistSchema2024[], activeTeams: number[]) {
    return data
        .filter((datum) => activeTeams.includes(datum["teamNumber"]))
        .sort((d1, d2) => (d1["totalNotesInSpeaker"] - d2["totalNotesInSpeaker"]) || (d1["totalEpa"] - d2["totalEpa"]))
        .reverse()[0]?.teamNumber || 0;
}

export function bestAmpBot(data: PicklistSchema2024[], activeTeams: number[]) {
    return data
        .filter((datum) => activeTeams.includes(datum["teamNumber"]))
        .sort((d1, d2) => (d1["totalNotesInAmp"] - d2["totalNotesInAmp"])  || (d1["totalEpa"] - d2["totalEpa"]))
        .reverse()[0]?.teamNumber || 0;
}