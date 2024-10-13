'use client';

import TableRow from "@/app/ui/event/table-row";
import { sortDataByStat } from "@/app/lib/data";
import { PicklistSchema2024, SortOrder } from "@/app/lib/types";
import { useEffect, useState } from "react";
import { bestAmpBot, bestOverallPick, bestSpeakerBot } from "@/app/lib/utils";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export default function Table({
    data,
    fields,
    sortOrder,
    setBestPick,
    setBestSpeakerBot,
    setBestAmpBot
}: { 
    data: PicklistSchema2024[],
    fields: string[], 
    sortOrder: string ,
    setBestPick: (value: PicklistSchema2024) => void,
    setBestSpeakerBot: (value: number) => void,
    setBestAmpBot: (value: number) => void
}) {
    // Hacky solution to update the DragDropContext
    const [newKey, setNewKey] = useState(0);

    useEffect(() => {
        setDraggedData(sortDataByStat(data, sortOrder as SortOrder));
        setNewKey(newKey + 1);
    }, [sortOrder]);

    const [activeTeams, setActiveTeams] = useState<number[]>(data.map(value => value.teamNumber));
    const [draggedData, setDraggedData] = useState<PicklistSchema2024[]>([]);

    useEffect(() => {
        setBestPick(bestOverallPick(draggedData, activeTeams));
        setBestSpeakerBot(bestSpeakerBot(draggedData, activeTeams));
        setBestAmpBot(bestAmpBot(draggedData, activeTeams));
    }, [newKey, draggedData, activeTeams]);

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
        <div className="overflow-x-scroll md:overflow-x-clip min-h-1/2 md:min-h-3/5">
            <div className="flex flex-row items-center justify-start gap-3 mx-auto w-[215vw] md:w-auto h-10 rounded-t-lg bg-transparent md:bg-gray-700/50 border-b border-gray-500 md:border-none mr-2 md:mr-0">
                <div className="relative w-4 h-4">
                    <input
                        type="checkbox"
                        className="appearance-none w-4 h-4 ml-4 bg-gray-500 bg-opacity-50 border-2 border-gray-500 rounded-sm focus:ring-0 checked:bg-red-400/25 checked:border-red-400/50"
                        disabled
                    />
                </div>
                <div className="flex flex-row items-center justify-between w-full ml-6 md:ml-16">
                    <div className="w-[35vw] md:w-1/6">
                        <p className="font-bold text-[13px] lg:text-[13px] xl:text-sm whitespace-nowrap ml-2 md:ml-0">Team Number</p>
                    </div>
                    {fields.map(name => (
                        <div key={name} className="w-[35vw] md:w-1/6 ml-4 md:ml-0">
                            <p className="font-bold text-[13px] whitespace-nowrap lg:text-[13px] xl:text-sm px-2 md:px-0">{name}</p>
                        </div>
                    ))}
                </div>
            </div>
            <DragDropContext onDragEnd={handleOnDragEnd} key={newKey}>
                <Droppable droppableId="tableRows">
                    {(provided) => (
                        <div
                            className="w-[215vw] md:w-full h-[51vh] overflow-y-auto"
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