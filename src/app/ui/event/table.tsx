'use client';

import TableRow from "@/app/ui/event/table-row";
import { sortDataByStat } from "@/app/lib/data";
import { CustomColumns, Notes, PicklistSchema2026, SortOrder } from "@/app/lib/types";
import { useEffect, useState } from "react";
import { bestAutoBot, bestOverallPick, bestTeleopBot } from "@/app/lib/utils";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

// Fixed column widths for the scrollable custom-columns layout.
// These pixel values must stay in sync with table-row.tsx.
const CHECKBOX_W = "w-12 flex-shrink-0";
const STD_W      = "w-56 flex-shrink-0 pl-4";
const CUST_W     = "w-64 flex-shrink-0 pl-4";

export default function Table({
    data,
    fields,
    sortOrder,
    isStatic,
    timesSaved,
    picklistName,
    notes,
    updateNote,
    customColumns,
    setAlertInfo,
    setBestPick,
    setBestAutoBot,
    setBestTeleopBot
}: {
    data: PicklistSchema2026[],
    fields: string[],
    sortOrder: string,
    isStatic: boolean,
    timesSaved: number,
    picklistName?: string,
    notes: Notes,
    updateNote: (team: number, note: string) => void,
    customColumns: CustomColumns | null,
    setAlertInfo: (state: [string, string]) => void,
    setBestPick: (value: PicklistSchema2026) => void,
    setBestAutoBot: (value: number) => void,
    setBestTeleopBot: (value: number) => void
}) {
    const [newKey, setNewKey] = useState(0);
    const hasCustom = (customColumns?.headers.length ?? 0) > 0;

    useEffect(() => {
        if (!isStatic) {
            const isCustomSort = customColumns?.headers.includes(sortOrder);
            if (isCustomSort && customColumns) {
                const sorted = [...data].sort((a, b) => {
                    const aRaw = customColumns.data[a.teamNumber.toString()]?.[sortOrder] ?? '';
                    const bRaw = customColumns.data[b.teamNumber.toString()]?.[sortOrder] ?? '';
                    const aNum = parseFloat(aRaw);
                    const bNum = parseFloat(bRaw);
                    // numeric sort if both values are numbers, otherwise alphabetical
                    if (!isNaN(aNum) && !isNaN(bNum)) return bNum - aNum;
                    return bRaw.localeCompare(aRaw);
                });
                setDraggedData(sorted);
            } else {
                setDraggedData(sortDataByStat(data, sortOrder as SortOrder));
            }
        } else {
            setDraggedData(data);
        }
        setNewKey(newKey + 1);
    }, [sortOrder, customColumns]);

    const [activeTeams, setActiveTeams] = useState<number[]>(data.map(v => v.teamNumber));
    const [draggedData, setDraggedData] = useState<PicklistSchema2026[]>([]);

    useEffect(() => {
        setBestPick(bestOverallPick(draggedData, activeTeams));
        setBestAutoBot(bestAutoBot(draggedData, activeTeams));
        setBestTeleopBot(bestTeleopBot(draggedData, activeTeams));
    }, [newKey, draggedData, activeTeams]);

    useEffect(() => {
        const saveData = async () => {
            const payload = { name: picklistName, data: draggedData, static: true };
            const response = await fetch("/api/updatePicklist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (response.ok) setAlertInfo(["Success", "New picklist notes & order saved successfully"]);
        };
        if (timesSaved > 0) saveData().catch(console.error);
    }, [timesSaved]);

    const addTeam    = (team: number) => setActiveTeams(prev => [...prev, team]);
    const removeTeam = (team: number) => setActiveTeams(prev => prev.filter(v => v !== team));

    const handleOnDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(draggedData);
        const [removed] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, removed);
        setDraggedData(items);
    };

    // Full ordered list of all displayed columns when in custom mode.
    // Falls back to standard-then-custom if no columnOrder was saved.
    // Also migrates any old column names saved before a rename.
    const RENAMES: Record<string, string> = { "Teleop + Endgame Fuel": "Teleop Fuel" };
    const columnOrder = hasCustom
        ? (customColumns!.columnOrder ?? [...fields, ...customColumns!.headers])
            .map(col => RENAMES[col] ?? col)
        : [];

    const rows = draggedData.map((datum, index) => (
        <Draggable key={datum.teamNumber.toString()} draggableId={datum.teamNumber.toString()} index={index}>
            {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <TableRow
                        data={datum}
                        note={notes[datum.teamNumber] ?? ""}
                        onNoteChange={(note) => updateNote(datum.teamNumber, note)}
                        columnOrder={columnOrder}
                        customData={customColumns?.data[datum.teamNumber.toString()] ?? {}}
                        hasCustom={hasCustom}
                        addTeam={addTeam}
                        removeTeam={removeTeam}
                        currentlyActive={activeTeams.includes(datum.teamNumber)}
                        isDragging={snapshot.isDragging}
                    />
                </div>
            )}
        </Draggable>
    ));

    // ── Custom-columns layout ─────────────────────────────────────────────────
    // Single overflow-auto container (both axes). The min-w-max inner wrapper
    // forces the header to be exactly as wide as the row content, so columns
    // always align. sticky top-0 on the header pins it during vertical scroll.
    if (hasCustom) {
        return (
            <div className="overflow-auto h-[calc(46vh+3.5rem)] md:h-[calc(51vh+3.5rem)] overscroll-none rounded-xl">
                <div className="min-w-max">
                    {/* Sticky header — columns rendered in columnOrder */}
                    <div className="sticky top-0 z-10 flex flex-row items-center h-14 bg-transparent md:bg-gray-700/50 border-b border-gray-500 md:border-none">
                        <div className={CHECKBOX_W} />
                        <div className={STD_W}>
                            <p className="font-bold text-[12px] lg:text-[13px] xl:text-sm whitespace-nowrap">Team Number</p>
                        </div>
                        {columnOrder.map(col => {
                            const isStandard = fields.includes(col);
                            return (
                                <div key={col} className={isStandard ? STD_W : CUST_W}>
                                    <p className={`font-bold text-[12px] whitespace-nowrap lg:text-[13px] xl:text-sm ${!isStandard ? 'text-blue-400' : ''}`}>{col}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Data rows */}
                    <DragDropContext onDragEnd={handleOnDragEnd} key={newKey}>
                        <Droppable droppableId="tableRows">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {rows}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        );
    }

    // ── Standard layout (no custom columns) ───────────────────────────────────
    // Original structure — completely unchanged.
    return (
        <div className="overflow-x-scroll md:overflow-x-clip min-h-1/2 md:min-h-3/5 overscroll-none rounded-xl">
            <div className="flex flex-row items-center justify-start gap-3 mx-auto w-[240vw] md:w-full h-14 rounded-t-lg bg-transparent md:bg-gray-700/50 border-b border-gray-500 md:border-none mr-2 md:mr-0">
                <div className="relative w-4 h-4 flex-shrink-0">
                    <input type="checkbox" className="appearance-none w-4 h-4 ml-4 bg-gray-500 bg-opacity-50 border-2 border-gray-500 rounded-sm focus:ring-0" disabled />
                </div>
                <div className="flex flex-row items-center justify-between w-full ml-6 md:ml-16">
                    <div className="w-[35vw] md:w-1/4">
                        <p className="font-bold text-[12px] lg:text-[13px] xl:text-sm whitespace-nowrap ml-2 md:ml-0">Team Number</p>
                    </div>
                    {fields.map(name => (
                        <div key={name} className="w-[35vw] md:w-1/4 ml-4 md:ml-0">
                            <p className="font-bold text-[12px] whitespace-nowrap lg:text-[13px] xl:text-sm px-2 md:px-0">{name}</p>
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
                            {rows}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}
