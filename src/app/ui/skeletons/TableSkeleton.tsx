export default function TableSkeleton({ fields } : { fields: string[] }) {
    return (
        <div className="h-[55vh] overflow-y-auto">
            <div className="flex flex-row items-center justify-start gap-3 mx-auto w-full h-10 rounded-t-lg bg-gray-700/50">
                <div className="relative w-4 h-4">
                    <input type="checkbox" className="peer appearance-none w-4 h-4 ml-4 bg-gray-500 bg-opacity-50 border-2 border-gray-500 rounded-sm focus:ring-0 checked:bg-red-400/25 checked:border-red-400/50" disabled />
                </div>
                <div className="flex flex-row items-center justify-between w-full ml-12">
                    <div className="w-1/6">
                        <p className="font-bold text-sm">Team Number</p>
                    </div>
                    {
                        fields.map(
                            (_) => (
                                <div className="w-1/6 bg-gray-500 py-2 rounded-lg" />
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}