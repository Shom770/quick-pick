import { PicklistSchema2024 } from "@/app/lib/types";

export function bestOverallPick(data: PicklistSchema2024[], activeTeams: number[]) {
    return data
        .filter((datum) => activeTeams.includes(datum["teamNumber"]))[0]?.teamNumber || 0
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

export function chunked(arr: any[], size: number) {
    return Array.from({ length: Math.ceil(arr.length / size) },
        (_, index) =>
            arr.slice(index * size, (index + 1) * size)
    );
}