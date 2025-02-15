import { PicklistSchema2025 } from "@/app/lib/types";

export function bestOverallPick(data: PicklistSchema2025[], activeTeams: number[]) {
    const calculatedBestPick = data
        .filter((datum) => activeTeams.includes(datum["teamNumber"]))[0];

    return calculatedBestPick ? calculatedBestPick : {
        teamNumber: 0,
        totalEpa: 0,
        autoEpa: 0,
        teleopEpa: 0,
        totalCoral: 0,
        totalAlgae: 0,
        coralL1: 0,
        coralL2: 0,
        coralL3: 0,
        coralL4: 0,
        totalAlgaeInNet: 0,
        endgamePoints: 0
    } as PicklistSchema2025
}

export function bestCoralBot(data: PicklistSchema2025[], activeTeams: number[]) {
    return data
        .filter((datum) => activeTeams.includes(datum["teamNumber"]))
        .sort((d1, d2) => (d1["totalCoral"] - d2["totalCoral"]) || (d1["totalEpa"] - d2["totalEpa"]))
        .reverse()[0]?.teamNumber || 0;
}

export function bestAlgaeBot(data: PicklistSchema2025[], activeTeams: number[]) {
    return data
        .filter((datum) => activeTeams.includes(datum["teamNumber"]))
        .sort((d1, d2) => (d1["totalAlgae"] - d2["totalAlgae"])  || (d1["totalEpa"] - d2["totalEpa"]))
        .reverse()[0]?.teamNumber || 0;
}

export function chunked(arr: any[], size: number) {
    return Array.from({ length: Math.ceil(arr.length / size) },
        (_, index) =>
            arr.slice(index * size, (index + 1) * size)
    );
}