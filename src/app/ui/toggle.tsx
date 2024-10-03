'use client';

import { useState } from "react";

export default function Toggle() {
    const [enabled, setEnabled] = useState(false);

    return (
        <div
            className={`${
            enabled ? "bg-[#0d111b]" : "bg-blue-600/25"
            } relative inline-flex items-center justify-center mt-1 h-8 w-16 cursor-pointer rounded-full transition-colors duration-300 ease-in-out border border-white/50`}
            onClick={() => setEnabled(!enabled)}
        >
            <div className="relative flex w-5/6 h-full items-center">
            <span
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                    enabled ? "translate-x-8" : "translate-x-0"
                }`}
                ></span>
            </div>
        </div>
    )
}