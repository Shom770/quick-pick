import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { rethinkSans } from "@/app/ui/fonts";
import Link from "next/link";

export default function Page() {
    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <div className="flex flex-col w-4/5 h-5/6 gap-2">
                <div className="inline-block flex-col items-start justify-center border-b border-[#929292]/50 w-auto basis-1/5">
                    <h1 className={`${rethinkSans.className} antialiased text-6xl text-blue-600 font-extrabold`}>create an event</h1>
                    <div className="w-[25rem] h-full">
                        <p className="mt-3 mb-1">Search an event code</p>
                        <div className="relative flex flex-row gap-2 w-full h-10">
                            <div className="relative flex flex-1 shrink-0">
                                <input className="block rounded-md bg-transparent border border-blue-500/75 placeholder-gray-500 text-sm text-white w-full pl-10 focus:outline-none" placeholder="Event code" />
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                            </div>
                            <Link
                                key="createEvent"
                                href={`/event/2024chcmp`}
                                className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-600 hover:bg-blue-500 text-[#0d111b]"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}