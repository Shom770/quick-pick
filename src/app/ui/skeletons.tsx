import clsx from "clsx";

// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-slate-600/40 before:to-transparent';

export function SummarizerSkeleton() {
    return (
        <div className={`${shimmer} relative overflow-hidden col-span-3 bg-slate-800 h-3/4 self-center rounded-lg`}>
            <div className="relative grid grid-cols-3 w-full h-full divide-x divide-gray-500/50">
                <div className="flex items-center justify-center">
                    <div className="flex flex-col items-start justify-center gap-3">
                        <div className="rounded-lg h-5 w-20 xl:h-5 xl:w-30 bg-slate-700"></div>
                        <div className="rounded-lg h-10 w-28 xl:h-12 xl:w-36 bg-slate-700"></div>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <div className="flex flex-col items-start justify-center gap-3">
                        <div className="rounded-lg h-5 w-32 xl:h-5 xl:w-30 bg-slate-700"></div>
                        <div className="rounded-lg h-10 w-28 xl:h-12 xl:w-36 bg-slate-700"></div>
                    </div>
                </div>
                <div className="flex items-center justify-center">
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
        <div key={rowNumber} className="flex flex-row items-center justify-start gap-3 mx-auto w-full h-14 border-b border-gray-500/50">
            <div className="relative w-4 h-4">
                <input type="checkbox" className="appearance-none w-4 h-4 ml-4 bg-gray-500 bg-opacity-50 border-2 border-gray-500 rounded-sm focus:ring-0 checked:bg-red-400/25 checked:border-red-400/50" disabled />
            </div>
            <div className="flex flex-row items-center justify-between w-full ml-16">
                { fields.map((value) => (
                        <div key={`row${value}`} className="w-1/6">
                            <div key={`${rowNumber}${value}`} className="bg-slate-700/50 rounded-lg h-6 w-1/2"></div>
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
        <div className="h-3/5">
            <div className="flex flex-row items-center justify-start gap-3 mx-auto w-full h-10 rounded-t-lg bg-gray-700/50">
                <div className="relative w-4 h-4">
                    <input type="checkbox" className="appearance-none w-4 h-4 ml-4 bg-gray-500 bg-opacity-50 border-2 border-gray-500 rounded-sm focus:ring-0 checked:bg-red-400/25 checked:border-red-400/50" disabled />
                </div>
                <div className="flex flex-row items-center justify-between w-full ml-16">
                    <div className="w-1/6">
                        <p className="font-bold text-[13px] xl:text-sm whitespace-nowrap">Team Number</p>
                    </div>
                    {
                        fields.map(
                            (name) => (
                                <div key={name}className="w-1/6">
                                    <p className="font-bold text-[13px] xl:text-sm mr-16 whitespace-nowrap">{name}</p> 
                                </div>
                            )
                        )
                    }
                </div>
            </div>
            <div className={clsx(`${shimmer} relative overflow-hidden w-full h-auto overflow-y-auto`, { 'h-[51vh]' : rows >= 8 } )}>
                { 
                    Array.from({length: rows}, (_, key) => key).map((rowNumber) => 
                        <TableRowSkeleton key={`row${rowNumber}`} rowNumber={rowNumber} fields={["Team Number", ...fields]} />
                    )
                }
            </div>
        </div>
    );
}