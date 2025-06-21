import { useState } from 'react';

type Stock = {
    sector: string;
    investment: number;
    presentValue: number;
    gainLoss: number;
};

type Summary = {
    investment: number;
    presentValue: number;
    gainLoss: number;
    count: number;
};

export default function SectorSummary({ data, loading }: { data: Stock[], loading: boolean }) {
    const [showAll, setShowAll] = useState(false);

    const grouped = data.reduce((acc, stock) => {
        if (!acc[stock.sector]) {
            acc[stock.sector] = {
                investment: 0,
                presentValue: 0,
                gainLoss: 0,
                count: 0,
            };
        }
        acc[stock.sector].investment += stock.investment;
        acc[stock.sector].presentValue += stock.presentValue;
        acc[stock.sector].gainLoss += stock.gainLoss;
        acc[stock.sector].count += 1;
        return acc;
    }, {} as Record<string, Summary>);

    const entries = Object.entries(grouped);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const visibleEntries =
        showAll || !isMobile ? entries : entries.slice(0, 4);

    return (
        <div className="mb-10">
            <div className="rounded-2xl bg-gray-100 dark:bg-[#1f1f1f] border border-gray-200 dark:border-zinc-700 p-6 shadow-sm">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Sector Summary
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading
                        ? Array.from({ length: visibleEntries.length }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-xl p-5 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 shadow-md animate-pulse space-y-3"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="h-5 w-32 bg-gray-300 dark:bg-zinc-700 rounded" />
                                    <div className="h-4 w-16 bg-gray-300 dark:bg-zinc-700 rounded" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-40 bg-gray-200 dark:bg-zinc-800 rounded" />
                                    <div className="h-4 w-44 bg-gray-200 dark:bg-zinc-800 rounded" />
                                    <div className="h-4 w-36 bg-gray-200 dark:bg-zinc-800 rounded" />
                                </div>
                            </div>
                        ))
                        : visibleEntries.map(([sector, summary]) => {
                            const isGain = summary.gainLoss >= 0;
                            return (
                                <div
                                    key={sector}
                                    className="rounded-xl p-5 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {sector}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {summary.count} {summary.count === 1 ? 'company' : 'companies'}
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                                        <div>
                                            <span className="font-medium">Investment:</span>{' '}
                                            ₹{summary.investment.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </div>
                                        <div>
                                            <span className="font-medium">Present Value:</span>{' '}
                                            ₹{summary.presentValue.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </div>
                                        <div>
                                            <span className="font-medium">
                                                {isGain ? 'Gain' : 'Loss'}:
                                            </span>{' '}
                                            <span
                                                className={`font-semibold ml-1 ${isGain ? 'text-green-600' : 'text-red-500'}`}
                                            >
                                                ₹{Math.abs(summary.gainLoss).toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                </div>

                {entries.length > 4 && (
                    <div className="mt-4 text-center block md:hidden">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline transition"
                        >
                            {showAll ? 'Show Less' : 'Show More'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
