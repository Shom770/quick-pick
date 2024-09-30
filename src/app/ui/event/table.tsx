'use client';

import TableRow from "@/app/ui/event/table-row";
import { sortDataByStat } from "@/app/lib/data";
import { PicklistSchema2024, SortOrder } from "@/app/lib/types";
import { useMemo, useState } from "react";
import { bestAmpBot, bestOverallPick, bestSpeakerBot } from "@/app/lib/utils";
import clsx from 'clsx';
  
  
export default function Table(
    { 
        data,
        fields, 
        sortOrder,
        setBestPick, 
        setBestSpeakerBot, 
        setBestAmpBot 
    } : { 
        data: PicklistSchema2024[],
        fields: string[], 
        sortOrder: string ,
        setBestPick: (value: number) => void,
        setBestSpeakerBot: (value: number) => void,
        setBestAmpBot: (value: number) => void
    }
) {
    const sortedData = useMemo(() => sortDataByStat(data, sortOrder as SortOrder), [data, sortOrder]);
    const [activeTeams, setActiveTeams] = useState(data.map((value) => value["teamNumber"]));

    setBestPick(bestOverallPick(data, activeTeams, sortOrder as SortOrder));
    setBestSpeakerBot(bestSpeakerBot(data, activeTeams));
    setBestAmpBot(bestAmpBot(data, activeTeams));

    const addTeam = (team: number) => {
        setActiveTeams([...activeTeams, team])
    }

    const removeTeam = (team: number) => {
        setActiveTeams(activeTeams.filter((value) => value != team))
    }

    return (
        <div className="h-3/5">
            <div className="flex flex-row items-center justify-start gap-3 mx-auto w-full h-10 rounded-t-lg bg-gray-700/50">
                <div className="relative w-4 h-4">
                    <input type="checkbox" className="appearance-none w-4 h-4 ml-4 bg-gray-500 bg-opacity-50 border-2 border-gray-500 rounded-sm focus:ring-0 checked:bg-red-400/25 checked:border-red-400/50" disabled />
                </div>
                <div className="flex flex-row items-center justify-between w-full ml-16">
                    <div className="w-1/6">
                        <p className="font-bold text-xs lg:text-[13px] xl:text-sm whitespace-nowrap">Team Number</p>
                    </div>
                    {
                        fields.map(
                            (name) => (
                                <div key={name}className="w-1/6">
                                    <p className="font-bold text-xs lg:text-[13px] xl:text-sm mr-16 whitespace-nowrap">{name}</p> 
                                </div>
                            )
                        )
                    }
                </div>
            </div>
            <div className="w-full h-[50vh] overflow-y-auto">
                { 
                    sortedData.map((datum) => 
                        <TableRow key={datum["teamNumber"]} data={datum} addTeam={addTeam} removeTeam={removeTeam} />
                    )
                }
            </div>
        </div>
    );
}