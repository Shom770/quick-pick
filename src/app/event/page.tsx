'use client';

import { useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import { rethinkSans } from "@/app/ui/fonts";
import Table from "@/app/ui/event/table";
import { fetchDataForTeams } from "@/app/lib/data";
import { PicklistSchema2024 } from "../lib/types";

export default function Page() {
    const searchParams = useSearchParams();
    
    const [data, setData] = useState<PicklistSchema2024[]>([]);
    const [sortOrder, setSortOrder] = useState("Total EPA");

    useEffect(
        () => { 
            const fetchedData = fetchDataForTeams([4099, 1727, 1731, 1629, 401, 2363]);
            setData(fetchedData);
        }, 
        []
    );

    const [bestPick, setBestPick] = useState(0);
    const [bestSpeakerBot, setBestSpeakerBot] = useState(0);
    const [bestAmpBot, setBestAmpBot] = useState(0);

    const teams = searchParams
        .get("teams")!!
        .split("_")
        .map((value) => parseInt(value));
    
    if (data.length == 0) {
        return <div></div>;
    }

    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen">
            <div className="grid grid-cols-5 w-4/5 h-1/5">
                <div className="flex flex-col items-start justify-center">
                    <h1 className={`${rethinkSans.className} text-7xl text-blue-600 font-extrabold`}>picklist</h1>
                    <form className="mt-3">
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
                <div className="relative col-span-3 bg-slate-800 h-3/4 self-center rounded-lg">
                    <div className="grid grid-cols-3 w-full h-full p-4 divide-x divide-gray-500/50">
                        <div className="flex items-center justify-center">
                            <div className="flex flex-col items-start justify-center">
                                <h1 className={`${rethinkSans.className} antialiased font-extrabold text-2xl`}>best pick</h1>
                                <h1 className={`${rethinkSans.className} antialiased font-extrabold text-6xl text-blue-600 -mt-1`}>{bestPick ? bestPick : "—"}</h1>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="flex flex-col items-start justify-center">
                                <h1 className={`${rethinkSans.className} antialiased font-extrabold text-2xl`}>best speaker bot</h1>
                                <h1 className={`${rethinkSans.className} antialiased font-extrabold text-6xl text-blue-600 -mt-1`}>{bestSpeakerBot ? bestSpeakerBot : "—"}</h1>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="flex flex-col items-start justify-center">
                                <h1 className={`${rethinkSans.className} antialiased font-extrabold text-2xl`}>best amp bot</h1>
                                <h1 className={`${rethinkSans.className} antialiased font-extrabold text-6xl text-blue-600 -mt-1`}>{bestAmpBot ? bestAmpBot : "—"}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -inset-2 z-[-1] blur-lg rounded-md bg-gradient-to-tr from-[#EB2549] from-30% via-purple-500 to-70% to-blue-600"></div>
                </div>
            </div>
            <div className="w-4/5 h-1/2 mt-12">
                <Suspense fallback={<div />}>
                    <Table
                        data={data}
                        fields={["Total EPA", "Total Notes in Auto", "Total Notes in Speaker", "Total Notes in Amp"]}
                        sortOrder={sortOrder}
                        setBestPick={setBestPick} 
                        setBestSpeakerBot={setBestSpeakerBot}
                        setBestAmpBot={setBestAmpBot} />
                </Suspense>
            </div>
        </div>
    )
}