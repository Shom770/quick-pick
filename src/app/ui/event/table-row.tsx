'use client';

import clsx from 'clsx';
import { useState, memo } from "react";
import { PicklistSchema2025 } from "@/app/lib/types";

const TableRow = memo(function TableRow({
    data, 
    selectedBranch,
    addTeam, 
    removeTeam,
    currentlyActive,
    isDragging
}: { 
    data: PicklistSchema2025, 
    selectedBranch: string,
    addTeam: (team: number) => void, 
    removeTeam: (team: number) => void,
    currentlyActive: boolean,
    isDragging: boolean
}) { 
    const [isActive, setActive] = useState(currentlyActive);

    const changeActiveness = (value: boolean) => {
        setActive(value);

        if (value) {
            addTeam(data["teamNumber"])
        }
        else {
            removeTeam(data["teamNumber"])
        }
    }

    const isDisabled = () => {
        return !isActive || data["teamNumber"]
    }

    const branchKey = `coral${selectedBranch}`

    const filteredData = {
        "teamNumber": data.teamNumber.toFixed(2),
        "totalEpa": data.totalEpa.toFixed(2),
        "autoEpa": data.autoEpa.toFixed(2),
        "teleopEpa": data.teleopEpa.toFixed(2),
        "totalCoralInAuto": data.totalCoralInAuto.toFixed(2),
        "coralOnBranch": data[branchKey as "coralL1" | "coralL2" | "coralL3" | "coralL4"].toFixed(2),
        "totalAlgaeInNet": data.totalAlgaeInNet.toFixed(2),
        "endgamePoints": data.endgamePoints.toFixed(2)
    }

    console.log(filteredData)

    return (
        <div key={data["teamNumber"]} className={`flex flex-row items-center justify-start gap-3 mx-auto w-[240vw] overflow-visible md:w-full h-14 border-b border-gray-500/50 mr-2 md:mr-0 overscroll-none ${isDragging ? 'bg-blue-600/20 border-[1.5px] border-b-[1.5px] border-blue-600 rounded-md' : ''}`}>
            <div className="relative w-4 h-4">
                <input 
                    type="checkbox" 
                    checked={!currentlyActive}
                    className="peer appearance-none w-4 h-4 ml-4 bg-gray-500 bg-opacity-50 border-2 border-gray-500 rounded-sm cursor-pointer focus:ring-0 checked:bg-red-400/25 checked:border-red-400/50" 
                    onChange={(event) => changeActiveness(!event.target.checked)}/>
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
            <div className="flex flex-row items-center justify-between w-full ml-6 md:ml-16">
                <div key={data.teamNumber} className="flex items-center w-[35vw] md:w-1/6 border-l border-gray-500/50 h-14 md:border-none md:h-auto">
                    <p className={clsx("text-lg md:text-sm lg:text-base ml-4 md:ml-0" , { "text-gray-500" : !isActive })} suppressHydrationWarning>{data.teamNumber}</p>
                </div>
                { Object.entries(filteredData).filter(([property, _]) => !(["teamNumber", "autoEpa", "teleopEpa"].includes(property))).map(([name, value]) => (
                      <div key={name + data.teamNumber} className={`flex items-center ${name == "coralOnBranch" ? 'w-[40vw]' : 'w-[35vw]'} md:w-1/6 h-14 border-l border-gray-500/50 md:h-auto md:border-none`}>
                          <p className={clsx("text-lg md:text-sm lg:text-base ml-4 md:ml-0 px-2 md:px-0", { "text-gray-500" : !isActive })} suppressHydrationWarning>{value}</p>
                      </div>
                    )
                  )
                }
            </div>
        </div>
    );
});

export default TableRow;