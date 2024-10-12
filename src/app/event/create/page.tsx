'use client';

import { MagnifyingGlassIcon, HashtagIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { rethinkSans } from "@/app/ui/fonts";
import Link from "next/link";
import { useEffect, useState } from "react";
import TeamPill from "@/app/ui/event/team-pill";
import teams from "@/app/data/teams.json";
import { State, fetchEvent } from "@/app/lib/actions";
import { useFormState } from "react-dom";
import { chunked } from "@/app/lib/utils";
import { MEDIUM_SCREEN_SIZE, LARGE_SCREEN_SIZE, SMALL_SCREEN_SIZE } from "@/app/lib/constants";


export default function Page() {
    const onTeamNumberEntered = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const parsedTeamNumber = parseInt(teamNumberEntered);

        if (
            event.key == 'Enter'
            && !Number.isNaN(parsedTeamNumber) 
            // && teamsInEvent.indexOf(parsedTeamNumber) == -1
            && parsedTeamNumber.toString() in teams
        ) {
            setTeams([...teamsInEvent, parseInt(teamNumberEntered)]);
            setTeamNumber('');
        }
    };


    // Tracking width + height for chunking purposes
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0
      });
    
      // Effect to add a resize event listener on mount, and clean up on unmount
      useEffect(() => {
        // Handler to call on window resize
        const handleResize = () => {
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
          });
        };
    
        // Add event listener
        window.addEventListener('resize', handleResize);
    
        // Call handler right away to ensure state is correct at first render
        handleResize();
    
        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
      }, []); // Empty array ensures the effect is only run on mount and unmount
    

    const [teamNumberEntered, setTeamNumber] = useState('');
    const [teamsInEvent, setTeams] = useState<number[]>([]);
    const teamsInEventStringified = teamsInEvent.map((value) => [value.toString(), true]);

    let chunkSize = 6;

    if (MEDIUM_SCREEN_SIZE <= windowSize.width && windowSize.width < LARGE_SCREEN_SIZE) {
        chunkSize = 3;
    }
    else if (windowSize.width < MEDIUM_SCREEN_SIZE) {
        chunkSize = 1;
    }

    const chunkedTeams = chunked(teamNumberEntered ? teamsInEventStringified.concat([[teamNumberEntered, false]]) : teamsInEventStringified, chunkSize);

    const initialState: State = { errors: [] }
    const [state, formAction] = useFormState(fetchEvent, initialState);

    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <div className="flex flex-col w-5/6 md:w-3/4 h-[87.5vh] gap-4">
                <div className="inline-block flex-col items-start justify-center border-b border-[#929292]/50 w-auto basis-1/5">
                    <h1 className={`${rethinkSans.className} antialiased text-[51px] md:text-6xl text-blue-600 font-extrabold`}>create an event</h1>
                    <div className="w-full md:w-[25rem] h-16">
                        <p className="md:mt-3 mb-1">Search an event code</p>
                        <form action={formAction}>
                            <div className="relative flex flex-row gap-2 w-full h-10">
                                <div className="relative flex flex-1 shrink-0">
                                    <input 
                                        name="eventCode"
                                        className="block rounded-md bg-transparent border border-blue-500/75 placeholder-gray-500 text-sm text-white w-full pl-10 focus:outline-none" 
                                        placeholder="Event code" />
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                                </div>
                                <button
                                    key="createEvent"
                                    type="submit"
                                    className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-600 hover:bg-blue-500 text-[#0d111b]"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="py-2 mb-1 md:m-none">
                        { state.errors && 
                            <p className="text-red-400 text-sm">{state.errors[0]}</p>
                        }
                    </div>
                </div>
                <div className="flex flex-col items-start justify-start w-full basis-4/5 gap-2">
                    <div className="inline-block w-full md:w-auto">
                        <p>Or, select teams to create an event for</p>
                        <p className="text-xs text-gray-400 -mt-1">Press enter to add a new team</p>
                        <div className="flex flex-col gap-2 w-full h-24 mt-2">
                            <div className="w-full h-10">
                                <div className="relative flex flex-1 shrink-0 h-10">
                                    <input
                                        className="block rounded-md bg-transparent border border-blue-500/75 placeholder-gray-500 text-sm text-white w-full pl-8 focus:outline-none" 
                                        value={teamNumberEntered}
                                        placeholder="Team Number"
                                        onChange={(event) => setTeamNumber(event.target.value)}
                                        onKeyDown={onTeamNumberEntered}
                                    />
                                    <HashtagIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 w-4 h-4" />
                                </div>
                            </div>
                            <Link
                                key="createEvent"
                                href={`/event?teams=${teamsInEvent.join('_')}`}
                                className="flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-[#0d111b]"
                            >
                                <strong>Create Event</strong>
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center justify-center my-4 w-full h-[50vh] rounded-xl bg-slate-800">
                        <div className="w-full h-full px-2 py-8">
                            <div className="flex flex-col items-center justify-start w-full h-full overflow-y-auto gap-7">
                                {
                                    chunkedTeams.map((subList) => 
                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 w-full">
                                            {
                                                subList.map(([teamNumber, isInList]) => {
                                                        if (isInList) {
                                                            return (
                                                                <button key={teamNumber} onClick={(_) => setTeams(teamsInEvent.filter((value) => value != parseInt(teamNumber)))} className="mx-auto w-full md:w-40 h-14">
                                                                    <TeamPill key={teamNumber} teamNumber={parseInt(teamNumber)} teamName={teams[teamNumber as keyof typeof teams]} />
                                                                </button>
                                                            );
                                                        }
                                                        else {
                                                            return (
                                                                <div className="flex items-center justify-center mx-auto w-full md:w-40 h-14 bg-blue-600/[0.1] border-2 border-blue-600/50 border-dashed rounded-2xl">
                                                                    <h1 className={`${rethinkSans.className} font-extrabold text-xl text-white/75`}>{teamNumberEntered}</h1>
                                                                </div> 
                                                            )
                                                        }
                                                    }
                                                )
                                            }
                                        </div>
                                    )
                                }
                                {/* {
                                    teamsInEvent.map((teamNumber) => 
                                        <button key={teamNumber} onClick={(_) => setTeams(teamsInEvent.filter((value) => value != teamNumber))}>
                                            <TeamPill key={teamNumber} teamNumber={teamNumber} teamName={teams[teamNumber.toString() as keyof typeof teams]} />
                                        </button>
                                    )
                                }
                                {
                                    teamNumberEntered && (
                                        <div className="flex items-center justify-center w-full md:w-40 h-14 bg-blue-600/[0.1] border-2 border-blue-600/50 border-dashed rounded-2xl">
                                            <h1 className={`${rethinkSans.className} font-extrabold text-xl text-white/75`}>{teamNumberEntered}</h1>
                                        </div> 
                                    )
                                } */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}