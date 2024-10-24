import { PicklistSchema2024 } from "@/app/lib/types";
import { rethinkSans } from "@/app/ui/fonts";

export default function Summarizer({ bestPick, bestSpeakerBot, bestAmpBot } : { bestPick: PicklistSchema2024, bestSpeakerBot: number, bestAmpBot: number }) {
    return (
        <div className="relative col-span-3 bg-slate-800 w-full md:w-auto h-[35%] md:h-3/4 self-center rounded-lg mb-1 md:mb-0">
            <div className="grid grid-cols-2 md:grid-cols-3 w-full h-full p-4 md:divide-x md:divide-gray-500/50">
                <div className="flex items-center justify-center">
                    <div className="flex flex-col items-start justify-center">
                        <h1 className={`${rethinkSans.className} antialiased font-extrabold text-lg xl:text-2xl`}>best pick</h1>
                        <h1 className={`${rethinkSans.className} antialiased font-extrabold text-5xl 2xl:text-6xl text-blue-500 -mt-1`}>{bestPick.teamNumber ? bestPick.teamNumber : "—"}</h1>
                    </div>
                </div>
                <div className="flex flex-col md:hidden items-center justify-center gap-1.5">
                    <div className="bg-blue-500 rounded-md w-5/6 py-0.5">
                        <p className={`${rethinkSans.className} antialiased font-bold text-[13px] text-[#0d111b] ml-5`}>{bestPick.autoEpa ? bestPick.autoEpa.toFixed(1): "—"} auto pts</p>
                    </div>
                    <div className="bg-blue-500 rounded-md w-5/6 py-0.5">
                        <p className={`${rethinkSans.className} antialiased font-bold text-[13px] text-[#0d111b] ml-5`}>{bestPick.teleopEpa ? bestPick.teleopEpa.toFixed(1) : "—"} teleop pts</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center justify-center">
                    <div className="flex flex-col items-start justify-center">
                        <h1 className={`${rethinkSans.className} antialiased font-extrabold text-lg xl:text-2xl`}>best speaker bot</h1>
                        <h1 className={`${rethinkSans.className} antialiased font-extrabold text-5xl 2xl:text-6xl text-blue-500 -mt-1`}>{bestSpeakerBot ? bestSpeakerBot : "—"}</h1>
                    </div>
                </div>
                <div className="hidden md:flex items-center justify-center">
                    <div className="flex flex-col items-start justify-center">
                        <h1 className={`${rethinkSans.className} antialiased font-extrabold text-lg xl:text-2xl`}>best amp bot</h1>
                        <h1 className={`${rethinkSans.className} antialiased font-extrabold text-5xl 2xl:text-6xl text-blue-500 -mt-1`}>{bestAmpBot ? bestAmpBot : "—"}</h1>
                    </div>
                </div>
            </div>
            <div className="absolute -inset-2 z-[-1] blur-md md:blur-lg rounded-md bg-gradient-to-tr from-[#EB2549] from-30% via-purple-500 to-70% to-blue-500"></div>
        </div>
    );
}