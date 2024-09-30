'use client';

import clsx from 'clsx';
import { useState } from "react";
import { PicklistSchema2024 } from "@/app/lib/types";

export default function TableRow({ data, addTeam, removeTeam } : { data: PicklistSchema2024, addTeam: (team: number) => void, removeTeam: (team: number) => void }) { 
    const [isActive, setActive] = useState(true);

    const changeActiveness = (value: boolean) => {
        setActive(value);

        if (value) {
            addTeam(data["teamNumber"])
        }
        else {
            removeTeam(data["teamNumber"])
        }
    }

    return (
        <div key={data["teamNumber"]} className="flex flex-row items-center justify-start gap-3 mx-auto w-full h-14 border-b border-gray-500/50">
            <div className="relative w-4 h-4">
                <input 
                    type="checkbox" 
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
            <div className="flex flex-row items-center justify-between w-full ml-16">
                { Object.entries(data).map(([_, value]) => (
                      <div key={value} className="w-1/6">
                          <p className={clsx("text-sm lg:text-base", { "text-gray-500" : !isActive })} suppressHydrationWarning>{value}</p>
                      </div>
                    )
                  )
                }
            </div>
        </div>
    )
}