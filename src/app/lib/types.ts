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

export type SortOrder = "Total EPA" | "Total Notes in Auto" | "Total Notes in Speaker" | "Total Notes in Amp";