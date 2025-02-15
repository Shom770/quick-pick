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

export type Branches = "L1" | "L2" | "L3" | "L4"

export type SortOrder = "Total EPA" | "Total Coral in Auto" | "Total Coral on Selected Branch" | "Total Algae in Net" | "Endgame Points";

export const emptySchema: PicklistSchema2025 = {
    teamNumber: 0,
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