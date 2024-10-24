"use client";

import { PicklistSchema2024 } from "@/app/lib/types";
import { rethinkSans } from "@/app/ui/fonts";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { redirect, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SaveModal({
    data, 
    setModalStatus, 
    setAlertInfo 
} : { 
    data: PicklistSchema2024[], 
    setModalStatus: (state: boolean) => void, 
    setAlertInfo: (state: [string, string]) => void
}) {
    const router = useRouter();
    const [picklistName, setPicklistName] = useState("");

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!picklistName) {
            alert("Please enter a picklist name.");
            return;
        }

        const payload = {
            picklistName,
            data
        };

        const response = await fetch("/api/savePicklist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
        });
        const content = await response.json();

        if (!response.ok) {
            setAlertInfo(["Error", content["message"]]);
        }
        else {
            router.push(`/event/${picklistName}`);
        }
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[6px]">
            <div className="relative flex flex-col items-center justify-center w-5/6 md:w-1/3 h-1/3 bg-slate-800/80 md:bg-slate-800/75 backdrop-blur-[60px] md:backdrop-blur-2xl rounded-xl border-2 border-blue-600/50 gap-4">
                <div className="w-5/6">
                    <h1 className={`${rethinkSans.className} antialiased font-extrabold text-blue-600 text-3xl md:text-4xl`}>Save picklist?</h1>
                </div>
                <form className="w-5/6" onSubmit={handleSubmit}>
                    <label htmlFor="picklistName" className="text-xs md:text-sm">Enter picklist name (no spaces)</label>
                    <input 
                        name="picklistName" 
                        className="w-full h-12 rounded-md bg-slate-800 mt-1 border border-slate-600 px-4 focus:outline-none text-sm md:text-base"
                        placeholder="Picklist name" 
                        onChange={(event) => setPicklistName(event.target.value)} />
                    <button type="submit" className="flex flex-row items-center justify-center gap-2 w-full h-12 rounded-md bg-blue-600 hover:bg-blue-500 mt-4 font-extrabold text-[#0d111b] text-base md:text-lg">
                        <p>Save Picklist</p>
                        <PaperAirplaneIcon className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </form>
                <button className="absolute w-8 h-8 right-4 top-4" onClick={() => setModalStatus(false)}>
                    <XMarkIcon className="w-7 h-7 md:w-8 md:h-8 text-slate-400 hover:text-slate-200" />
                </button>
            </div>
        </div>
    )
}