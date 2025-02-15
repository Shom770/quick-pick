import clsx from "clsx";

// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-slate-600/40 before:to-transparent';

export function SummarizerSkeleton() {
    return (
        <div className={`${shimmer} relative overflow-hidden col-span-3 bg-slate-800 w-full md:w-auto h-[35%] md:h-3/4 self-center rounded-lg mb-1 md:mb-0`}>
            <div className="grid grid-cols-2 md:grid-cols-3 w-full h-full p-4 md:divide-x md:divide-gray-500/50">
                <div className="flex items-center justify-center">
                    <div className="flex flex-col items-start justify-center gap-3">
                        <div className="rounded-lg h-5 w-20 xl:h-5 xl:w-30 bg-slate-700"></div>
                        <div className="rounded-lg h-10 w-28 xl:h-12 xl:w-36 bg-slate-700"></div>
                    </div>
                </div>
                <div className="flex flex-col md:hidden items-center justify-center gap-1.5">
                    <div className="bg-slate-700 rounded-md w-5/6 h-6"></div>
                    <div className="bg-slate-700 rounded-md w-5/6 h-6"></div>
                </div>
                <div className="hidden md:flex items-center justify-center">
                    <div className="flex flex-col items-start justify-center gap-3">
                        <div className="rounded-lg h-5 w-32 xl:h-5 xl:w-30 bg-slate-700"></div>
                        <div className="rounded-lg h-10 w-28 xl:h-12 xl:w-36 bg-slate-700"></div>
                    </div>
                </div>
                <div className="hidden md:flex items-center justify-center">
                    <div className="flex flex-col items-start justify-center gap-3">
                        <div className="rounded-lg h-5 w-28 xl:h-5 xl:w-30 bg-slate-700"></div>
                        <div className="rounded-lg h-10 w-28 xl:h-12 xl:w-36 bg-slate-700"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function TableRowSkeleton({ fields, rowNumber } : { fields: string[], rowNumber: number }) {
    return (
        <div key={rowNumber} className="flex flex-row items-center justify-start gap-3 mx-auto w-[215vw] overflow-hidden md:w-full h-14 border-b border-gray-500/50 mr-2 md:mr-0">
            <div className="relative w-4 h-4">
                <input type="checkbox" className="appearance-none w-4 h-4 ml-4 bg-gray-500 bg-opacity-50 border-2 border-gray-500 rounded-sm focus:ring-0 checked:bg-red-400/25 checked:border-red-400/50" disabled />
            </div>
            <div className="flex flex-row items-center justify-between w-full ml-6 md:ml-16">
                { fields.map((value) => (
                        <div key={`row${value}`} className="flex items-center w-[35vw] md:w-1/6 h-14 border-l border-gray-500/50 md:h-auto md:border-none">
                            <div key={`${rowNumber}${value}`} className="bg-slate-700/50 rounded-lg h-6 w-3/5 md:w-1/4 ml-4 md:ml-0 px-2 md:px-0"></div>
                        </div>
                    )
                  )
                }
            </div>
        </div>
    )
}

export function TableSkeleton({ fields, rows = 9 } : { fields: string[], rows?: number }) {
    return (
        <div className="overflow-x-hidden min-h-1/2 md:min-h-3/5">
            <div className="flex flex-row items-center justify-start gap-3 mx-auto w-[215vw] md:w-full h-14 rounded-t-lg bg-transparent md:bg-gray-700/50 border-b border-gray-500 md:border-none mr-2 md:mr-0">
                <div className="relative w-4 h-4">
                    <input type="checkbox" className="appearance-none w-4 h-4 ml-4 bg-gray-500 bg-opacity-50 border-2 border-gray-500 rounded-sm focus:ring-0 checked:bg-red-400/25 checked:border-red-400/50" disabled />
                </div>
                <div className="flex flex-row items-center justify-between w-full ml-6 md:ml-16">
                    <div className="w-[35vw] md:w-1/6">
                        <p className="font-bold text-[13px] ml-2 xl:text-sm whitespace-nowrap">Team Number</p>
                    </div>
                    {
                        fields.map(
                            (name) => (
                                <div key={name}className={`${name.includes('Selected Branch') ? 'w-[40vw]' : 'w-[35vw]'} md:w-1/6 ml-4 md:ml-0`}>
                                    {
                                        name.includes("Selected Branch") ? (
                                            <div className="flex flex-row w-3/5 md:w-full items-center gap-2">
                                                <p className="font-bold text-[12px] whitespace-nowrap lg:text-[13px] xl:text-sm px-2 md:px-0"><span className="hidden md:inline-block">Total</span> Coral on</p>
                                                <select 
                                                    id="branchChooser" 
                                                    className="w-[68px] h-9 md:h-10 rounded-md bg-white/10 outline outline-white/25 border-r-8 border-transparent text-white text-[13px] xl:text-sm font-bold p-1 md:p-2.5"
                                                    defaultValue="L4"
                                                    disabled>
                                                    <optgroup>
                                                        <option className="bg-slate-800">L1</option>
                                                        <option className="bg-slate-800">L2</option>
                                                        <option className="bg-slate-800">L3</option>
                                                        <option className="bg-slate-800">L4</option>
                                                    </optgroup>
                                                </select>
                                            </div>
                                        ) : (
                                            <p className="font-bold text-[12px] whitespace-nowrap lg:text-[13px] xl:text-sm px-2 md:px-0">{name}</p>
                                        )
                                    }
                                </div>
                            )
                        )
                    }
                </div>
            </div>
            <div className={clsx(`${shimmer} relative overflow-hidden w-full h-[46vh] md:h-auto overflow-y-auto`, { 'h-[51vh]' : rows >= 9 } )}>
                { 
                    Array.from({length: rows}, (_, key) => key).map((rowNumber) => 
                        <TableRowSkeleton key={`row${rowNumber}`} rowNumber={rowNumber} fields={["Team Number", ...fields]} />
                    )
                }
            </div>
        </div>
    );
}