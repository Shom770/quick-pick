'use client';

import TableRow from "@/app/ui/event/table-row";
import { sortDataByStat } from "@/app/lib/data";
import { Branches, PicklistSchema2024, PicklistSchema2025, SortOrder } from "@/app/lib/types";
import { useEffect, useState } from "react";
import { bestAlgaeBot, bestOverallPick, bestCoralBot } from "@/app/lib/utils";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export default function Table({
    data,
    fields,
    sortOrder,
    isStatic,
    timesSaved,
    picklistName,
    setAlertInfo,
    setBestPick,
    setBestCoralBot,
    setBestAlgaeBot
}: { 
    data: PicklistSchema2025[],
    fields: string[], 
    sortOrder: string,
    isStatic: boolean,
    timesSaved: number,
    picklistName?: string,
    setAlertInfo: (state: [string, string]) => void,
    setBestPick: (value: PicklistSchema2025) => void,
    setBestCoralBot: (value: number) => void,
    setBestAlgaeBot: (value: number) => void
}) {
    // Hacky solution to update the DragDropContext
    const [newKey, setNewKey] = useState(0);
    const [branch, setBranch] = useState<Branches>("L4");

    useEffect(() => {
        if (!isStatic) {
            setDraggedData(sortDataByStat(data, sortOrder as SortOrder, branch));
        }
        else {
            setDraggedData(data);
        }
        
        setNewKey(newKey + 1);
    }, [sortOrder]);

    const [activeTeams, setActiveTeams] = useState<number[]>(data.map(value => value.teamNumber));
    const [draggedData, setDraggedData] = useState<PicklistSchema2025[]>([]);

    useEffect(() => {
        setBestPick(bestOverallPick(draggedData, activeTeams));
        setBestCoralBot(bestCoralBot(draggedData, activeTeams));
        setBestAlgaeBot(bestAlgaeBot(draggedData, activeTeams));
    }, [newKey, draggedData, activeTeams]);

    // Save teams to picklist 
    useEffect(() => {
        const saveData = async () => {
            const payload = {
                name: picklistName,
                data: draggedData,
                static: true
            };

            const response = await fetch("/api/updatePicklist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setAlertInfo(["Success", "New picklist order saved successfully"]);
            }
        }
        
        if (timesSaved > 0) {
            saveData()
                .catch(e => console.error(e));
        }
            
    }, [timesSaved]);

    const addTeam = (team: number) => {
        setActiveTeams(prev => [...prev, team]);
    };

    const removeTeam = (team: number) => {
        setActiveTeams(prev => prev.filter(value => value !== team));
    };

    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const reorderedData = Array.from(draggedData);
        const [removed] = reorderedData.splice(result.source.index, 1);
        reorderedData.splice(result.destination.index, 0, removed);

        setDraggedData(reorderedData);
    };

    return (
        <div className="overflow-x-scroll md:overflow-x-clip min-h-1/2 md:min-h-3/5 overscroll-none">
            <div className="flex flex-row items-center justify-start gap-3 mx-auto w-[240vw] md:w-auto h-14 rounded-t-lg bg-transparent md:bg-gray-700/50 border-b border-gray-500 md:border-none mr-2 md:mr-0">
                <div className="relative w-4 h-4">
                    <input
                        type="checkbox"
                        className="appearance-none w-4 h-4 ml-4 bg-gray-500 bg-opacity-50 border-2 border-gray-500 rounded-sm focus:ring-0 checked:bg-red-400/25 checked:border-red-400/50"
                        disabled
                    />
                </div>
                <div className="flex flex-row items-center justify-between w-full ml-6 md:ml-16">
                    <div className="w-[35vw] md:w-1/6">
                        <p className="font-bold text-[12px] lg:text-[13px] xl:text-sm whitespace-nowrap ml-2 md:ml-0">Team Number</p>
                    </div>
                    {fields.map(name => (
                        <div key={name} className={`${name.includes('[Branch]') ? 'w-[40vw]' : 'w-[35vw]'} md:w-1/6 ml-4 md:ml-0`}>
                            {
                                name.includes("[Branch]") ? (
                                    <div className="flex flex-row w-3/5 md:w-full items-center gap-2">
                                        <p className="font-bold text-[12px] whitespace-nowrap lg:text-[13px] xl:text-sm px-2 md:px-0"><span className="hidden md:inline-block">Total</span> Coral on</p>
                                        <select 
                                            id="branchChooser" 
                                            className="w-[68px] h-9 md:h-10 rounded-md bg-white/10 outline outline-white/25 border-r-8 border-transparent text-white text-[13px] xl:text-sm font-bold p-1 md:p-2.5"
                                            onChange={(event) => setBranch(event.target.value as Branches)}
                                            defaultValue="L4">
                                            <optgroup>
                                                <option className="bg-slate-800">L1</option>
                                                <option className="bg-slate-800">L2</option>
                                                <option className="bg-slate-800">L3</option>
                                                <option className="bg-slate-800">L4</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                ) : (
                                    <p className="font-bold text-[12px] whitespace-nowrap lg:text-[13px] xl:text-sm px-2 md:px-0">{name}</p>
                                )
                            }
                        </div>
                    ))}
                </div>
            </div>
            <DragDropContext onDragEnd={handleOnDragEnd} key={newKey}>
                <Droppable droppableId="tableRows">
                    {(provided) => (
                        <div
                            className="w-[240vw] md:w-full h-[46vh] md:h-[51vh] overflow-y-auto"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {draggedData.map((datum, index) => (
                                <Draggable
                                    key={datum.teamNumber.toString()}
                                    draggableId={datum.teamNumber.toString()}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <TableRow
                                                key={datum.teamNumber}
                                                data={datum}
                                                selectedBranch={branch}
                                                addTeam={addTeam}
                                                removeTeam={removeTeam}
                                                currentlyActive={activeTeams.includes(datum.teamNumber)}
                                                isDragging={snapshot.isDragging}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}