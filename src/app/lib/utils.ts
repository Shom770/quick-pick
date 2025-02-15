import { emptySchema, PicklistSchema2025 } from "@/app/lib/types";

export function bestOverallPick(data: PicklistSchema2025[], activeTeams: number[]) {
    const calculatedBestPick = data
        .filter((datum) => activeTeams.includes(datum["teamNumber"]))[0];

    return calculatedBestPick ? calculatedBestPick : emptySchema
}

export function bestCoralBot(data: PicklistSchema2025[], activeTeams: number[]) {
    return data
        .filter((datum) => activeTeams.includes(datum["teamNumber"]))
        .sort((d1, d2) => ((d1["coralL1"] + d1["coralL2"] + d1["coralL3"] + d1["coralL4"]) - (d2["coralL1"] + d2["coralL2"] + d2["coralL3"] + d2["coralL4"])) || (d1["totalEpa"] - d2["totalEpa"]))
        .reverse()[0]?.teamNumber || 0;
}

export function bestAlgaeBot(data: PicklistSchema2025[], activeTeams: number[]) {
    return data
        .filter((datum) => activeTeams.includes(datum["teamNumber"]))
        .sort((d1, d2) => (d1["totalAlgaeInNet"] - d2["totalAlgaeInNet"])  || (d1["totalEpa"] - d2["totalEpa"]))
        .reverse()[0]?.teamNumber || 0;
}

export function chunked(arr: any[], size: number) {
    return Array.from({ length: Math.ceil(arr.length / size) },
        (_, index) =>
            arr.slice(index * size, (index + 1) * size)
    );
}