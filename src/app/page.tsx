import { CalendarIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import Link from "next/link";
import Image from "next/image";
import { rethinkSans } from "@/app/ui/fonts";

export default function Home() {
  return (
    <div className="relative flex flex-grow flex-col md:flex-row items-center justify-start md:justify-center w-screen h-screen gap-8 overflow-hidden">
      <div className="h-[50vh] md:hidden mt-12 z-0">
        <Image src="/hero-phone.png" width={400} height={500} quality={100} alt="Phone version of quickpick's picklist page and event page." style={
          {
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0) 70%)',
            maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0) 70%)',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat'
          }
        } />
      </div>
      <div className="basis-1/5 -mt-6 md:mt-0 z-10">
        <h1 className={`${rethinkSans.className} text-6xl md:text-7xl font-extrabold text-blue-600 whitespace-nowrap`}>quick, pick!</h1>
        <div className="max-w-[19rem] md:max-w-[22.5rem]">
          <p className="text-white text-md leading-tight mt-3">
            A simple tool to help you during alliance selection using Statbotics data.
          </p>
          <Link
            key="Choose an Event"
            href="/event/create"
            className="flex flex-row gap-3 items-center justify-center w-full rounded-lg px-3 py-2 bg-blue-600 text-[#0d111b] text-lg font-bold mt-6 hover:bg-blue-500"
          > 
            <PaperAirplaneIcon className="w-5 h-5" />
            <p>Choose an Event</p>
          </Link>
          {/* <Link
            key="View Upcoming Events"
            href="/event/upcoming"
            className="flex flex-row gap-3 items-center justify-center w-full rounded-lg px-3 py-2 bg-blue-500 text-[#0d111b] text-lg font-bold mt-3 hover:bg-blue-400"
          > 
            <CalendarIcon className="w-5 h-5" />
            <p>View Upcoming Events</p>
          </Link> */}
        </div>
      </div>
      <div className="hidden md:flex items-center justify-center z-0">
        <Image src="/hero-desktop.png" width={722} height={764} quality={100} alt="Desktop version of quickpick's picklist page and event page." />
      </div>
    </div>
  );
}
