'use client';

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { rethinkSans } from "@/app/ui/fonts";
import Table from "@/app/ui/event/table";
import { fetchDataForTeams } from "@/app/lib/data";
import { emptySchema, PicklistSchema2025 } from "@/app/lib/types";
import Summarizer from "@/app/ui/event/summarizer";
import { SummarizerSkeleton, TableSkeleton } from "@/app/ui/skeletons";
import SaveModal from "@/app/ui/event/save-modal";
import clsx from "clsx";
import Alert from "@/app/ui/alert";

function EventPage({ picklist_id } : { picklist_id?: string }) {
    const searchParams = useSearchParams();
    
    const [data, setData] = useState<PicklistSchema2025[]>([]);
    const [isStatic, setStatic] = useState(false);
    const [sortOrder, setSortOrder] = useState("Total EPA");

    const [isModalOpen, setModalStatus] = useState(false);
    const [[alertType, alertMessage], setAlertInfo] = useState(["", ""]);

    // Hacky way to get child component to save the current order of the picklist
    const [timesSaved, setTimesSaved] = useState(0);

    let teams: number[] = [];
    
    useEffect(
        () => {
            if (!picklist_id) {
                teams = searchParams!!
                    .get("teams")!!
                    .split("_")
                    .map((value) => parseInt(value));

                const eventCode = searchParams!!.get("event");

                // Create function to set data
                const fetchData = async () => setData(await fetchDataForTeams(teams, eventCode));

                fetchData()
                    .catch(console.error);
            }
            else {
                const fetchData = async () => {
                    const response = await fetch(`/api/getPicklist?name=${picklist_id}`)
                    const content = await response.json();
                    
                    if (!response.ok) {
                        setAlertInfo(["Error", content["message"]])
                    }
                    else {
                        setData(content["data"]);
                    }

                    setStatic(content["static"] || false);
                }
                
                fetchData()
                    .catch(console.error);
            }
        },
        [teams, picklist_id]  // Unnecessary, but needed to satisfy linter
    );

    const [bestPick, setBestPick] = useState(emptySchema);
    const [bestCoralBot, setBestCoralBot] = useState(0);
    const [bestAlgaeBot, setBestAlgaeBot] = useState(0);
    
    if (data.length == 0) {
        return (
            <div className="flex flex-col items-center justify-start md:justify-center w-screen max-h-screen h-auto md:h-screen overflow-y-hidden">
                {alertMessage && <Alert color={alertType as "Error" | "Success"} message={alertMessage} />}
                <div className="flex flex-col items-center justify-center gap-3 md:gap-4 md:flex-none md:grid md:grid-cols-5 w-4/5 md:w-5/6 h-2/5 md:h-1/5 -mt-1">
                    <div className="flex flex-col items-start justify-center">
                        <h1 className={`${rethinkSans.className} text-[56px] md:text-7xl text-blue-500 font-extrabold`}>picklist</h1>
                        <form className="w-full md:w-[18rem] md:mt-2">
                            <label htmlFor="sortOrder" className="font-medium text-sm">Choose metric to sort by</label>
                            <select 
                                id="sortOrder" 
                                className={clsx(
                                  `w-full h-10 rounded-md md:rounded-lg bg-white/10 outline outline-white/50 border-r-8 border-transparent text-white text-sm p-4 md:p-2.5 mt-1`,
                                  isStatic ? "disabled" : ""
                                )}
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
                        <button 
                            className="text-sm text-gray-500 underline font-medium mt-2 md:mt-3 bg-transparent"
                            disabled>
                            {picklist_id ? "Update picklist order?" : "Save picklist?"}
                        </button>
                    </div>
                    <div></div>
                    <SummarizerSkeleton />
                </div>
                <div className="w-[95vw] md:w-5/6 h-[42%] md:h-1/2 mt-5 md:mt-12 ml-[5vw] md:ml-0">
                    <TableSkeleton fields={["Total EPA", "Total Coral in Auto", "Total Coral on Selected Branch", "Total Algae in Net", "Endgame Points"]} rows={Math.min(teams.length > 0 ? teams.length : 9, 9)}/>
                </div>
            </div>
        )
    }

    return (
        <div className="relative flex flex-col items-center justify-start md:justify-center w-screen max-h-screen h-auto md:h-screen overflow-y-hidden">
            {alertMessage && <Alert color={alertType as "Error" | "Success"} message={alertMessage} />}
            <div className="flex flex-col items-center justify-center gap-3 md:gap-4 md:flex-none md:grid md:grid-cols-5 w-4/5 md:w-5/6 h-2/5 md:h-1/5 -mt-1">
                <div className="flex flex-col items-start justify-center">
                    <h1 className={`${rethinkSans.className} text-[56px] md:text-7xl text-blue-500 font-extrabold`}>picklist</h1>
                    <form className="w-full md:w-[18rem] md:mt-2">
                        <label htmlFor="sortOrder" className="font-medium text-sm">Choose metric to sort by</label>
                        <select 
                            id="sortOrder" 
                            className={clsx(
                                `w-full h-10 rounded-md md:rounded-lg bg-white/10 outline outline-white/50 border-r-8 border-transparent text-white text-sm p-4 md:p-2.5 mt-1`,
                                isStatic ? "bg-white/5 outline outline-white/25 text-gray-500/[0.95]" : ""
                            )}
                            onChange={(event) => setSortOrder(event.target.value)}
                            defaultValue="Total EPA"
                            disabled={isStatic}>
                            <optgroup>
                                <option className="bg-slate-800">Total EPA</option>
                                <option className="bg-slate-800">Total Coral in Auto</option>
                                <option className="bg-slate-800">Total Coral on Selected Branch</option>
                                <option className="bg-slate-800">Total Algae in Net</option>
                                <option className="bg-slate-800">Endgame Points</option>
                            </optgroup>
                        </select>
                    </form>
                    <button 
                        className="text-sm text-blue-500 underline font-medium mt-2 md:mt-3 hover:text-blue-400 bg-transparent"
                        onClick={() => picklist_id ? setTimesSaved(timesSaved + 1) : setModalStatus(true) }>
                        {picklist_id ? "Update picklist order?" : "Save picklist?"}
                    </button>
                </div>
                <div></div>
                <Summarizer bestPick={bestPick} bestCoralBot={bestCoralBot} bestAlgaeBot={bestAlgaeBot} />
            </div>
            <div className="w-[95vw] md:w-5/6 h-[42%] md:h-1/2 mt-5 md:mt-12 ml-[5vw] md:ml-0">
                <Table
                    data={data}
                    fields={["Total EPA", "Total Coral in Auto", "Total Coral on [Branch]", "Total Algae in Net", "Endgame Points"]}
                    sortOrder={sortOrder}
                    isStatic={isStatic}
                    timesSaved={timesSaved}
                    picklistName={picklist_id}
                    setAlertInfo={setAlertInfo}
                    setBestPick={setBestPick} 
                    setBestCoralBot={setBestCoralBot}
                    setBestAlgaeBot={setBestAlgaeBot} />
            </div>
            <div className={isModalOpen ? '' : 'hidden'}>
                <SaveModal data={data} setModalStatus={setModalStatus} setAlertInfo={setAlertInfo}/>
            </div>
        </div>
    );
}

export default function Page({ params } : { params: { picklist_id: string }}) {
    return <Suspense>
        <EventPage picklist_id={params.picklist_id ? params.picklist_id[0] : undefined} />
    </Suspense>
}