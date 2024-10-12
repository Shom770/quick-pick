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
        <div className="peer flex flex-col md:flex-row items-start md:items-center justify-center w-full h-full bg-blue-600 rounded-lg md:rounded-2xl transition hover:translate-y-1 hover:bg-red-400/75">
            <h1 className={`${rethinkSans.className} font-extrabold text-xl text-white peer-hover:text-[#0d111b] ml-5 md:${paddingOfTeamNumber}`}>{teamNumber}</h1>
            <div className={`flex items-center justify-center w-auto md:${widthOfDiv} md:h-1/2 md:ml-2`}>
                <p className="text-xs md:text-[0.55rem] text-white peer-hover:text-[#0d111b] text-wrap text-left ml-5 -mt-1 md:m-0">{teamName}</p>
            </div>
        </div>
    )
}