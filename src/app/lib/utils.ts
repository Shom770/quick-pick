import { emptySchema, PicklistSchema2026 } from "@/app/lib/types";

export function bestOverallPick(data: PicklistSchema2026[], activeTeams: number[]) {
    const calculatedBestPick = data
        .filter((datum) => activeTeams.includes(datum["teamNumber"]))[0];

    return calculatedBestPick ? calculatedBestPick : emptySchema
}

export function bestAutoBot(data: PicklistSchema2026[], activeTeams: number[]) {
    return data
        .filter((datum) => activeTeams.includes(datum["teamNumber"]))
        .sort((d1, d2) => (d1["autoFuel"] - d2["autoFuel"]) || (d1["totalEpa"] - d2["totalEpa"]))
        .reverse()[0]?.teamNumber || 0;
}

export function bestTeleopBot(data: PicklistSchema2026[], activeTeams: number[]) {
    return data
        .filter((datum) => activeTeams.includes(datum["teamNumber"]))
        .sort((d1, d2) => (d1["teleopAndEndgameFuel"] - d2["teleopAndEndgameFuel"]) || (d1["totalEpa"] - d2["totalEpa"]))
        .reverse()[0]?.teamNumber || 0;
}

export function chunked(arr: any[], size: number) {
    return Array.from({ length: Math.ceil(arr.length / size) },
        (_, index) =>
            arr.slice(index * size, (index + 1) * size)
    );
}
