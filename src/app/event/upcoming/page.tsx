import { rethinkSans } from "@/app/ui/fonts";

export default function Page() {
    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <div className="flex flex-col w-5/6 md:w-3/4 h-screen md:h-[87.5vh] gap-4">
                <h1 className={`${rethinkSans.className} antialiased text-[12.3vw] md:text-6xl text-blue-600 font-extrabold`}>upcoming events</h1>
            </div>
        </div>
    )
}