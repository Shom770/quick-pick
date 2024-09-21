import { useState } from "react";
import { rethinkSans } from "@/app/ui/fonts";

export default function TeamPill({ teamNumber, teamName }: { teamNumber: number, teamName: string }) {
    return (
        <div className="flex flex-row items-center justify-center w-40 h-14 bg-blue-600 rounded-2xl">
            <h1 className={`${rethinkSans.className} font-extrabold text-xl text-white ml-2`}>{teamNumber}</h1>
            <div className="flex items-center justify-center w-1/2 h-1/2 ml-2">
                <p className="text-[0.55rem] text-white text-wrap">{teamName}</p>
            </div>
        </div>
    )
}