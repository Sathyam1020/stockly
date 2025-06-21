'use client';

import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

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

const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7f50',
    '#00C49F', '#FFBB28', '#0088FE', '#FF8042'
];

export default function SectorSummary({
    data,
    loading,
}: {
    data: Stock[];
    loading: boolean;
}) {
    const [showAll, setShowAll] = useState(false);
    const [activeTab, setActiveTab] = useState<'summary' | 'pie'>('summary');

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
    const pieData = entries.map(([sector, summary]) => ({
        name: sector,
        value: summary.investment,
    }));

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const visibleEntries = showAll || !isMobile ? entries : entries.slice(0, 4);

    return (
        <div className="mb-10">
            <div className="rounded-2xl bg-gray-100 dark:bg-[#1f1f1f] border border-gray-200 dark:border-zinc-700 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        Sector Summary
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('summary')}
                            className={`px-3 py-1 text-sm rounded-md transition ${activeTab === 'summary'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-300 dark:bg-zinc-700 text-gray-800 dark:text-gray-200'
                                }`}
                        >
                            Summary
                        </button>
                        <button
                            onClick={() => setActiveTab('pie')}
                            className={`px-3 py-1 text-sm rounded-md transition ${activeTab === 'pie'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-300 dark:bg-zinc-700 text-gray-800 dark:text-gray-200'
                                }`}
                        >
                            Pie Chart
                        </button>
                    </div>
                </div>

                {activeTab === 'summary' ? (
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
                                                {summary.count}{' '}
                                                {summary.count === 1 ? 'company' : 'companies'}
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
                                                    className={`font-semibold ml-1 ${isGain ? 'text-green-600' : 'text-red-500'
                                                        }`}
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
                ) : (
                    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
                        {loading ? (
                            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                                Loading Pie Chart...
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius="80%"
                                        dataKey="value"
                                        label={false}
                                        labelLine={false}
                                    >
                                        {pieData.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            borderColor: '#ccc',
                                            color: '#000',
                                        }}
                                        wrapperStyle={{
                                            borderRadius: '6px',
                                            fontSize: '0.875rem',
                                        }}
                                        formatter={(value: number, name: string) => [
                                            `₹${value.toLocaleString()}`,
                                            name,
                                        ]}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        align="center"
                                        iconType="circle"
                                        wrapperStyle={{
                                            color: 'inherit',
                                            fontSize: '12px',
                                            paddingTop: '8px',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                )}

                {entries.length > 4 && activeTab === 'summary' && (
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
