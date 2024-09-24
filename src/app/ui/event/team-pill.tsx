import { rethinkSans } from "@/app/ui/fonts";

export default function TeamPill({ teamNumber, teamName }: { teamNumber: number, teamName: string }) {
    const teamNameSplitByWords = teamName.split(/\s+/);
    const widthOfDiv = (teamNameSplitByWords.length <= 2) ? "w-1/4" : "w-1/2";
    const paddingOfTeamNumber = (
        teamNumber.toString().length == 1 
        || (teamName.length >= 15 && teamNameSplitByWords.length <= 2)
        || (teamNumber.toString().length == 3 && teamNameSplitByWords.length <= 2)
    ) ? "mr-2" : "ml-2"

    return (
        <div className="peer flex flex-row items-center justify-center w-40 h-14 bg-blue-600 rounded-2xl transition hover:translate-y-1 hover:bg-red-400/75">
            <h1 className={`${rethinkSans.className} font-extrabold text-xl text-white peer-hover:text-[#0d111b] ${paddingOfTeamNumber}`}>{teamNumber}</h1>
            <div className={`flex items-center justify-center ${widthOfDiv} h-1/2 ml-2`}>
                <p className="text-[0.55rem] text-white peer-hover:text-[#0d111b] text-wrap text-left">{teamName}</p>
            </div>
        </div>
    )
}