'use client';

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { rethinkSans } from "@/app/ui/fonts";
import Table from "@/app/ui/event/table";
import { fetchDataForTeams } from "@/app/lib/data";
import { PicklistSchema2024 } from "@/app/lib/types";
import Summarizer from "@/app/ui/event/summarizer";
import { SummarizerSkeleton, TableSkeleton } from "@/app/ui/skeletons";

function EventPage() {
    const searchParams = useSearchParams();
    
    const [data, setData] = useState<PicklistSchema2024[]>([]);
    const [sortOrder, setSortOrder] = useState("Total EPA");

    const teams = searchParams
        .get("teams")!!
        .split("_")
        .map((value) => parseInt(value));

    const eventCode = searchParams.get("event");

    useEffect(
        () => {
            const fetchData = async () => setData(await fetchDataForTeams(teams, eventCode));

            fetchData()
                .catch(console.error);
        },
        []
    );

    const [bestPick, setBestPick] = useState({
        teamNumber: 0,
        totalEpa: 0,
        autoEpa: 0,
        teleopEpa: 0,
        totalNotesInAuto: 0,
        totalNotesInAmp: 0,
        totalNotesInSpeaker: 0
    } as PicklistSchema2024);
    const [bestSpeakerBot, setBestSpeakerBot] = useState(0);
    const [bestAmpBot, setBestAmpBot] = useState(0);
    
    if (data.length == 0) {
        return (
            <div className="flex flex-col items-center justify-start md:justify-center w-screen h-screen">
                <div className="flex flex-col items-center justify-center gap-4 md:flex-none md:grid md:grid-cols-5 w-4/5 md:w-5/6 h-2/5 md:h-1/5">
                    <div className="flex flex-col items-start justify-center">
                        <h1 className={`${rethinkSans.className} text-6xl md:text-7xl text-blue-500 font-extrabold`}>picklist</h1>
                        <form className="w-full md:w-[18rem] mt-3">
                            <label htmlFor="sortOrder" className="font-medium text-sm">Choose metric to sort by</label>
                            <select 
                                id="sortOrder" 
                                className="w-full h-10 rounded-md md:rounded-lg bg-white/10 outline outline-white/50 border-r-8 border-transparent text-white text-sm p-4 md:p-2.5 mt-1"
                                onChange={(event) => setSortOrder(event.target.value)}
                                defaultValue="Total EPA">
                                <optgroup>
                                    <option className="bg-slate-800">Total EPA</option>
                                    <option className="bg-slate-800">Total Notes in Auto</option>
                                    <option className="bg-slate-800">Total Notes in Speaker</option>
                                    <option className="bg-slate-800">Total Notes in Amp</option>
                                </optgroup>
                            </select>
                        </form>
                    </div>
                    <div></div>
                    <SummarizerSkeleton />
                </div>
                <div className="w-[95vw] md:w-5/6 h-1/2 mt-4 md:mt-12 ml-[5vw] md:ml-0">
                    <TableSkeleton fields={["Total EPA", "Total Notes in Auto", "Total Notes in Speaker", "Total Notes in Amp"]} rows={Math.min(teams.length, 9)}/>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-start md:justify-center w-screen h-screen">
            <div className="flex flex-col items-center justify-center gap-4 md:flex-none md:grid md:grid-cols-5 w-4/5 md:w-5/6 h-2/5 md:h-1/5">
                <div className="flex flex-col items-start justify-center">
                    <h1 className={`${rethinkSans.className} text-6xl md:text-7xl text-blue-500 font-extrabold`}>picklist</h1>
                    <form className="w-full md:w-[18rem] mt-3">
                        <label htmlFor="sortOrder" className="font-medium text-sm">Choose metric to sort by</label>
                        <select 
                            id="sortOrder" 
                            className="w-full h-10 rounded-md md:rounded-lg bg-white/10 outline :outline-white/50 border-r-8 border-transparent text-white text-sm p-5 md:p-2.5 mt-1"
                            onChange={(event) => setSortOrder(event.target.value)}
                            defaultValue="Total EPA">
                            <optgroup>
                                <option className="bg-slate-800">Total EPA</option>
                                <option className="bg-slate-800">Total Notes in Auto</option>
                                <option className="bg-slate-800">Total Notes in Speaker</option>
                                <option className="bg-slate-800">Total Notes in Amp</option>
                            </optgroup>
                        </select>
                    </form>
                </div>
                <div></div>
                <Summarizer bestPick={bestPick} bestSpeakerBot={bestSpeakerBot} bestAmpBot={bestAmpBot} />
            </div>
            <div className="w-[95vw] md:w-5/6 h-1/2 mt-4 md:mt-12 ml-[5vw] md:ml-0">
                <Table
                    data={data}
                    fields={["Total EPA", "Total Notes in Auto", "Total Notes in Speaker", "Total Notes in Amp"]}
                    sortOrder={sortOrder}
                    setBestPick={setBestPick} 
                    setBestSpeakerBot={setBestSpeakerBot}
                    setBestAmpBot={setBestAmpBot} />
            </div>
        </div>
    );
}

export default function Page() {
    return <Suspense>
        <EventPage />
    </Suspense>
}