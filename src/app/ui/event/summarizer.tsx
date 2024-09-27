import { rethinkSans } from "@/app/ui/fonts";

export default function Summarizer({ bestPick, bestSpeakerBot, bestAmpBot } : { bestPick: number, bestSpeakerBot: number, bestAmpBot: number }) {
    return (
        <div className="relative col-span-3 bg-slate-800 h-3/4 self-center rounded-lg">
            <div className="grid grid-cols-3 w-full h-full p-4 divide-x divide-gray-500/50">
                <div className="flex items-center justify-center">
                    <div className="flex flex-col items-start justify-center">
                        <h1 className={`${rethinkSans.className} antialiased font-extrabold text-xl lg:text-2xl`}>best pick</h1>
                        <h1 className={`${rethinkSans.className} antialiased font-extrabold text-4xl lg:text-6xl text-blue-600 -mt-1`}>{bestPick ? bestPick : "—"}</h1>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <div className="flex flex-col items-start justify-center">
                        <h1 className={`${rethinkSans.className} antialiased font-extrabold text-xl lg:text-2xl`}>best speaker bot</h1>
                        <h1 className={`${rethinkSans.className} antialiased font-extrabold text-4xl lg:text-6xl text-blue-600 -mt-1`}>{bestSpeakerBot ? bestSpeakerBot : "—"}</h1>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <div className="flex flex-col items-start justify-center">
                        <h1 className={`${rethinkSans.className} antialiased font-extrabold text-xl lg:text-2xl`}>best amp bot</h1>
                        <h1 className={`${rethinkSans.className} antialiased font-extrabold text-4xl lg:text-6xl text-blue-600 -mt-1`}>{bestAmpBot ? bestAmpBot : "—"}</h1>
                    </div>
                </div>
            </div>
            <div className="absolute -inset-2 z-[-1] blur-lg rounded-md bg-gradient-to-tr from-[#EB2549] from-30% via-purple-500 to-70% to-blue-600"></div>
        </div>
    );
}