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

    useEffect(
        () => {
            const fetchData = async () => setData(await fetchDataForTeams(teams));

            fetchData()
                .catch(console.error);
        },
        []
    );

    const [bestPick, setBestPick] = useState(0);
    const [bestSpeakerBot, setBestSpeakerBot] = useState(0);
    const [bestAmpBot, setBestAmpBot] = useState(0);
    
    if (data.length == 0) {
        return (
            <div className="flex flex-col items-center justify-center w-screen h-screen">
                <div className="grid grid-cols-5 w-5/6 h-1/5">
                    <div className="flex flex-col items-start justify-center">
                        <h1 className={`${rethinkSans.className} text-7xl text-blue-600 font-extrabold`}>picklist</h1>
                        <form className="w-[18rem] mt-3">
                            <label htmlFor="sortOrder" className="font-medium text-sm">Choose metric to sort by</label>
                            <select 
                                id="sortOrder" 
                                className="w-4/5 h-10 rounded-lg bg-white/10 outline outline-white/50 border-r-8 border-transparent text-white text-sm p-2.5 mt-1"
                                onChange={(event) => setSortOrder(event.target.value)}
                                defaultValue="Total EPA">
                                <optgroup className="bg-slate-800">
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
                <div className="w-5/6 h-1/2 mt-12">
                    <TableSkeleton fields={["Total EPA", "Total Notes in Auto", "Total Notes in Speaker", "Total Notes in Amp"]} rows={Math.min(teams.length, 8)}/>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen">
            <div className="grid grid-cols-5 w-5/6 h-1/5">
                <div className="flex flex-col items-start justify-center">
                    <h1 className={`${rethinkSans.className} text-7xl text-blue-600 font-extrabold`}>picklist</h1>
                    <form className="w-[18rem] mt-3">
                        <label htmlFor="sortOrder" className="font-medium text-sm">Choose metric to sort by</label>
                        <select 
                            id="sortOrder" 
                            className="w-4/5 h-10 rounded-lg bg-white/10 outline outline-white/50 border-r-8 border-transparent text-white text-sm p-2.5 mt-1"
                            onChange={(event) => setSortOrder(event.target.value)}
                            defaultValue="Total EPA">
                            <option>Total EPA</option>
                            <option>Total Notes in Auto</option>
                            <option>Total Notes in Speaker</option>
                            <option>Total Notes in Amp</option>
                        </select>
                    </form>
                </div>
                <div></div>
                <Summarizer bestPick={bestPick} bestSpeakerBot={bestSpeakerBot} bestAmpBot={bestAmpBot} />
            </div>
            <div className="w-5/6 h-1/2 mt-12">
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