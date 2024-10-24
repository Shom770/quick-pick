"use client";

import { ExclamationCircleIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function Alert({ color, message } : { color: "Error" | "Success", message: string }) {
    const [visible, setVisible] = useState(true);
    const [fadingOut, setFadingOut] = useState(false);

    const colorClasses = {
        Error: "text-red-400 border-1.5 border-red-500 bg-slate-800 md:bg-slate-800/75",
        Success: "text-green-400 border-1.5 border-green-700 bg-slate-800 md:bg-slate-800/75"
    }
    
    const iconToUse = {
        Error: <ExclamationCircleIcon className="text-red-400 flex-shrink-0 inline w-4 h-4 me-2" />,
        Success: <ShieldCheckIcon className="text-green-400 flex-shrink-0 inline w-4 h-4 me-2" />
    }

    useEffect(() => {
        // Start fading out 500ms before fully disappearing
        const timer = setTimeout(() => {
        setFadingOut(true);
        setTimeout(() => setVisible(false), 500); // 500ms for the fade-out effect
        }, 4500); // 4.5 seconds before starting to fade out

        return () => clearTimeout(timer); // Cleanup on unmount
    }, []);

    if (!visible) return null; 

    return (
        <div
            className={`fixed top-12 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-center py-4 w-[90vw] md:w-auto md:px-8 md:mb-4 text-sm border rounded-lg transition-opacity ease-in-out duration-500 ${
                fadingOut ? 'opacity-0' : 'opacity-100'
            } ${colorClasses[color]}`}
            role="alert"
            >
            {iconToUse[color]}
            <div className="break-words whitespace-normal">
                <span className="font-medium md:text-base">{color.charAt(0).toUpperCase() + color.slice(1)}</span>: {message}
            </div>
        </div>
    );
}