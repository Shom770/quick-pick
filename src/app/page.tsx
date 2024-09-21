import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import Link from "next/link";
import Image from "next/image";
import { rethinkSans } from "@/app/ui/fonts";

export default function Home() {
  return (
    <div className="flex flex-grow flex-row items-center justify-center w-screen h-screen gap-8">
      <div className="basis-1/5">
        <h1 className={`${rethinkSans.className} text-7xl font-extrabold text-blue-600 whitespace-nowrap`}>quick, pick!</h1>
        <div className="max-w-[22.5rem]">
          <p className="text-white text-md leading-tight mt-3">
            A simple tool to help you during alliance selection using Statbotics data.
          </p>
          <Link
            key="Choose an Event"
            href="/event/create"
            className="flex flex-row gap-2 items-center justify-center w-full rounded-lg px-3 py-2 bg-blue-600 text-[#0d111b] text-lg font-bold mt-6 hover:bg-blue-500"
          > 
            <p>Choose an Event</p>
            <PaperAirplaneIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Image src="/hero-desktop.png" width={722} height={764} quality={100} alt="Desktop version of quickpick's picklist page and event page." />
      </div>
    </div>
  );
}
