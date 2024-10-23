"use client";

import { PicklistSchema2024 } from "@/app/lib/types";
import { rethinkSans } from "@/app/ui/fonts";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { FormEvent, useState } from "react";

export default function SaveModal({ data, setModalStatus } : { data: PicklistSchema2024[], setModalStatus: (state: boolean) => void }) {
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

        try {
            const response = await fetch("/api/savePicklist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to save picklist");
            }

            // Handle successful response (e.g., close modal, show success message)
            setModalStatus(false);
            alert("Picklist saved successfully!");
        } catch (error) {
            console.error(error);
            alert("An error occurred while saving the picklist.");
        }
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[6px]">
            <div className="relative flex flex-col items-center justify-center w-1/3 h-1/3 bg-slate-800/75 backdrop-blur-2xl rounded-xl border-2 border-blue-600/50 gap-4">
                <div className="w-5/6">
                    <h1 className={`${rethinkSans.className} antialiased font-extrabold text-blue-600 text-4xl`}>Save picklist?</h1>
                </div>
                <form className="w-5/6" onSubmit={handleSubmit}>
                    <label htmlFor="picklistName" className="text-sm">Enter picklist name (no spaces)</label>
                    <input 
                        name="picklistName" 
                        className="w-full h-12 rounded-md bg-slate-800 mt-1 border border-slate-600 px-4 focus:outline-none"
                        placeholder="Picklist name" 
                        onChange={(event) => setPicklistName(event.target.value)} />
                    <button type="submit" className="flex flex-row items-center justify-center gap-2 w-full h-12 rounded-md bg-blue-600 hover:bg-blue-500 mt-4 font-extrabold text-[#0d111b] text-lg">
                        <p>Save Picklist</p>
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </form>
                <button className="absolute w-8 h-8 right-4 top-4" onClick={() => setModalStatus(false)}>
                    <XMarkIcon className="w-8 h-8 text-slate-400 hover:text-slate-200" />
                </button>
            </div>
        </div>
    )
}