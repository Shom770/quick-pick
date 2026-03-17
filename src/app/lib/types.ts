type BasePicklistSchema = {
    teamNumber: number,
    totalEpa: number,
    autoEpa: number,
    teleopEpa: number
}

export type PicklistSchema2024 = BasePicklistSchema & {
    totalNotesInAuto: number
    totalNotesInSpeaker: number
    totalNotesInAmp: number
}

export type PicklistSchema2025 = BasePicklistSchema & {
    totalCoralInAuto: number,
    coralL1: number,
    coralL2: number,
    coralL3: number,
    coralL4: number,
    totalAlgaeInNet: number,
    endgamePoints: number
}

export type PicklistSchema2026 = BasePicklistSchema & {
    autoFuel: number,
    teleopAndEndgameFuel: number,
    totalTowerPoints: number
}

export type Notes = Record<number, string>

export type CustomColumns = {
    headers: string[],
    data: Record<string, Record<string, string>>,
    columnOrder?: string[]  // full ordered list of all displayed columns (standard + custom)
}

export type SortOrder =
    "Total EPA" |
    "Auto Fuel" |
    "Teleop Fuel" |
    "Total Tower Points";

export const emptySchema: PicklistSchema2026 = {
    teamNumber: 0,
    totalEpa: 0,
    autoEpa: 0,
    teleopEpa: 0,
    autoFuel: 0,
    teleopAndEndgameFuel: 0,
    totalTowerPoints: 0
}
