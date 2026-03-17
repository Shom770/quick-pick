'use client';

import clsx from 'clsx';
import { memo, useState, useEffect, useRef } from "react";
import { PicklistSchema2026 } from "@/app/lib/types";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { rethinkSans } from "@/app/ui/fonts";

// Fixed-width cells for the scrollable custom-columns layout.
// CHECKBOX_W / STD_W / CUST_W must match the constants in table.tsx exactly.
const CHECKBOX_W  = "w-12 flex-shrink-0 flex items-center";
const STD_W_CELL  = "w-56 flex-shrink-0 flex items-center pl-4";
const CUST_W_CELL = "w-64 flex-shrink-0 flex items-center pl-4";

// Maps standard column display names → their value in filteredData
const STANDARD_FIELDS_SET = new Set(["Total EPA", "Auto Fuel", "Teleop Fuel", "Total Tower Points"]);

const TableRow = memo(function TableRow({
    data,
    note,
    onNoteChange,
    columnOrder,
    customData,
    hasCustom,
    addTeam,
    removeTeam,
    currentlyActive,
    isDragging
}: {
    data: PicklistSchema2026,
    note: string,
    onNoteChange: (note: string) => void,
    columnOrder: string[],
    customData: Record<string, string>,
    hasCustom: boolean,
    addTeam: (team: number) => void,
    removeTeam: (team: number) => void,
    currentlyActive: boolean,
    isDragging: boolean
}) {
    const [isActive, setActive] = [currentlyActive, (value: boolean) => {
        if (value) addTeam(data["teamNumber"]);
        else removeTeam(data["teamNumber"]);
    }];

    const [noteOpen, setNoteOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                setNoteOpen(false);
            }
        };
        if (noteOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [noteOpen]);

    const filteredData: Record<string, string> = {
        "totalEpa": data.totalEpa.toFixed(2),
        "autoFuel": data.autoFuel.toFixed(2),
        "teleopAndEndgameFuel": data.teleopAndEndgameFuel.toFixed(2),
        "totalTowerPoints": data.totalTowerPoints.toFixed(2)
    };

    // Lookup from standard display name → filteredData key
    const standardValueMap: Record<string, string> = {
        "Total EPA": filteredData.totalEpa,
        "Auto Fuel": filteredData.autoFuel,
        "Teleop Fuel": filteredData.teleopAndEndgameFuel,
        "Total Tower Points": filteredData.totalTowerPoints,
    };

    const notesPopover = noteOpen && (
        <div
            ref={popoverRef}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute z-20 top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl overflow-hidden"
        >
            <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5 border-b border-white/10">
                <p className={`${rethinkSans.className} text-[11px] font-bold text-gray-400 uppercase tracking-widest`}>
                    Team {data.teamNumber}
                </p>
                {note && (
                    <button
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onNoteChange(''); }}
                        className="text-[10px] text-gray-600 hover:text-red-400 transition-colors"
                    >
                        clear
                    </button>
                )}
            </div>
            <textarea
                autoFocus
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                placeholder="Type a note..."
                rows={3}
                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none resize-none px-3 py-2.5"
            />
        </div>
    );

    const noteButton = (
        <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setNoteOpen(v => !v); }}
            className={clsx(
                "flex-shrink-0 p-0.5 rounded transition-colors",
                note ? "text-blue-400 hover:text-blue-300" : "text-gray-600 hover:text-gray-400"
            )}
            title={note || "Add note"}
        >
            <PencilSquareIcon className="w-3.5 h-3.5" />
        </button>
    );

    const checkbox = (
        <div className="relative w-4 h-4 flex-shrink-0">
            <input
                type="checkbox"
                checked={!currentlyActive}
                className="peer appearance-none w-4 h-4 ml-4 bg-gray-500 bg-opacity-50 border-2 border-gray-500 rounded-sm cursor-pointer focus:ring-0 checked:bg-red-400/25 checked:border-red-400/50"
                onChange={(event) => setActive(!event.target.checked)} />
            <svg
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none hidden peer-checked:block stroke-red-400 ml-[18px] mb-0.5 outline-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
    );

    if (hasCustom) {
        // Pure fixed-width cell layout — columns rendered in columnOrder
        return (
            <div className={`flex flex-row items-center h-14 border-b border-gray-500/50 overscroll-none ${isDragging ? 'bg-blue-600/20 border-[1.5px] border-b-[1.5px] border-blue-600 rounded-md' : ''}`}>
                {/* Checkbox */}
                <div className={CHECKBOX_W}>
                    {checkbox}
                </div>
                {/* Team number */}
                <div className={`relative gap-2 ${STD_W_CELL}`}>
                    <p className={clsx("text-sm lg:text-base", { "text-gray-500": !isActive })} suppressHydrationWarning>{data.teamNumber}</p>
                    {noteButton}
                    {notesPopover}
                </div>
                {/* All data columns in user-defined order */}
                {columnOrder.map(col => {
                    const isStandard = STANDARD_FIELDS_SET.has(col);
                    const value = isStandard ? standardValueMap[col] : (customData[col] ?? '—');
                    return (
                        <div key={col} className={isStandard ? STD_W_CELL : CUST_W_CELL}>
                            <p className={clsx("text-sm lg:text-base truncate", { "text-gray-500": !isActive })} suppressHydrationWarning>
                                {value}
                            </p>
                        </div>
                    );
                })}
            </div>
        );
    }

    // Original percentage layout — untouched
    return (
        <div className={`flex flex-row items-center justify-start gap-3 mx-auto w-[240vw] md:w-full h-14 border-b border-gray-500/50 mr-2 md:mr-0 overscroll-none ${isDragging ? 'bg-blue-600/20 border-[1.5px] border-b-[1.5px] border-blue-600 rounded-md' : ''}`}>
            {checkbox}
            <div className="flex flex-row items-center justify-between w-full ml-6 md:ml-16">
                <div className="relative flex items-center gap-2 w-[35vw] md:w-1/4 border-l border-gray-500/50 h-14 md:border-none md:h-auto">
                    <p className={clsx("text-lg md:text-sm lg:text-base ml-4 md:ml-0", { "text-gray-500": !isActive })} suppressHydrationWarning>{data.teamNumber}</p>
                    {noteButton}
                    {notesPopover}
                </div>
                {Object.entries(filteredData).map(([name, value]) => (
                    <div key={name + data.teamNumber} className="flex items-center w-[35vw] md:w-1/4 h-14 border-l border-gray-500/50 md:h-auto md:border-none">
                        <p className={clsx("text-lg md:text-sm lg:text-base ml-4 md:ml-0 px-2 md:px-0", { "text-gray-500": !isActive })} suppressHydrationWarning>{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default TableRow;
