'use client';

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { rethinkSans } from "@/app/ui/fonts";
import Link from "next/link";
import { useState } from "react";
import TeamPill from "@/app/ui/event/team-pill";

export default function Page() {
    const onTeamNumberEntered = ((event: React.KeyboardEvent<HTMLInputElement>) => {
        const parsedTeamNumber = parseInt(teamNumberEntered);

        if (event.key == 'Enter' && !Number.isNaN(parsedTeamNumber) && teamsInEvent.indexOf(parsedTeamNumber) == -1) {
            setTeams([...teamsInEvent, parseInt(teamNumberEntered)]);
            setTeamNumber('');
        }
    });

    const [teamNumberEntered, setTeamNumber] = useState('');
    const [teamsInEvent, setTeams] = useState<number[]>([449, 4099, 5804, 2363, 10005, 449, 449, 4099, 5804, 2363, 10005, 449, 449, 4099, 5804, 2363, 10005, 449, 449, 4099, 5804, 2363, 10005, 449, 449, 4099, 5804, 2363, 10005, 449, 449, 4099, 5804, 2363, 10005]);

    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <div className="flex flex-col w-2/3 h-5/6 gap-2">
                <div className="inline-block flex-col items-start justify-center border-b border-[#929292]/50 w-auto basis-1/5">
                    <h1 className={`${rethinkSans.className} antialiased text-6xl text-blue-600 font-extrabold`}>create an event</h1>
                    <div className="w-[25rem] h-full">
                        <p className="mt-3 mb-1">Search an event code</p>
                        <div className="relative flex flex-row gap-2 w-full h-10">
                            <div className="relative flex flex-1 shrink-0">
                                <input className="block rounded-md bg-transparent border border-blue-500/75 placeholder-gray-500 text-sm text-white w-full pl-10 focus:outline-none" placeholder="Event code" />
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                            </div>
                            <Link
                                key="createEvent"
                                href={`/event/2024chcmp`}
                                className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-600 hover:bg-blue-500 text-[#0d111b]"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-start justify-start w-full basis-4/5 gap-2">
                    <p className="mt-3">Or, select teams to create an event for</p>
                    <div className="w-[18rem] h-10">
                        <div className="relative flex flex-1 shrink-0 w-full h-full">
                            <input 
                                className="block rounded-md bg-transparent border border-blue-500/75 placeholder-gray-500 text-sm text-white w-full h-full pl-10 focus:outline-none" 
                                value={teamNumberEntered}
                                placeholder="Team Number"
                                onChange={(event) => setTeamNumber(event.target.value)}
                                onKeyDown={onTeamNumberEntered}
                            />
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-center justify-center my-4 w-full h-[52.5vh] rounded-xl bg-slate-800">
                        <div className="grid grid-cols-3 lg:grid-cols-6 w-full h-full p-12 gap-4 overflow-y-auto">
                            {
                                teamsInEvent.map((value) => 
                                    <TeamPill key={value} teamNumber={value} teamName="The Blair Robot Project" />
                                )
                            }
                            {
                                teamNumberEntered && (
                                    <div className="flex items-center justify-center w-40 h-14 bg-blue-600/[0.1] border-2 border-blue-600/50 border-dashed rounded-2xl">
                                        <h1 className={`${rethinkSans.className} font-extrabold text-xl text-white/75`}>{teamNumberEntered}</h1>
                                    </div> 
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}