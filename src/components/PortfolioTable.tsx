'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ChevronDown, FilterIcon, SquareActivity } from 'lucide-react';
import { useState } from 'react';

export type Stock = {
    stockName: string;
    symbol: string;
    purchasePrice: number;
    quantity: number;
    cmp: number;
    investment: number;
    presentValue: number;
    gainLoss: number;
    portfolioPercent: number;
    exchange: string;
    peRatio: string;
    latestEarnings: string;
    sector: string;
};

export default function PortfolioTable({ data, loading }: { data: Stock[], loading: boolean }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSector, setSelectedSector] = useState('All Sectors');

    const sectors = Array.from(new Set(data.map(stock => stock.sector)));
    const filteredData = data.filter(stock => {
        const matchesSearch = stock.stockName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSector = selectedSector === 'All Sectors' || stock.sector === selectedSector;
        return matchesSearch && matchesSector;
    });

    return (
        <div className="w-full mt-6 rounded-2xl bg-gray-100 dark:bg-[#1f1f1f] border border-gray-200 dark:border-zinc-700 p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                <SquareActivity className="w-8 h-8 text-primary" />
                Holdings
                <span className="text-lg font-normal text-gray-500 dark:text-gray-400">
                    ({filteredData.length} stocks)
                </span>
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <Input
                    placeholder="Search by stock name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="whitespace-nowrap">
                            <FilterIcon /> {selectedSector} <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setSelectedSector('All Sectors')}>
                            All Sectors
                        </DropdownMenuItem>
                        {sectors.map((sector) => (
                            <DropdownMenuItem key={sector} onSelect={() => setSelectedSector(sector)}>
                                {sector}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-zinc-800">
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3">Exchange</th>
                            <th className="px-4 py-3">Purchase Price</th>
                            <th className="px-4 py-3">Investment</th>
                            <th className="px-4 py-3">Portfolio %</th>
                            <th className="px-4 py-3">CMP</th>
                            <th className="px-4 py-3">Present Value</th>
                            <th className="px-4 py-3">Gain/Loss</th>
                            <th className="px-4 py-3">P/E</th>
                            <th className="px-4 py-3">Earnings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: filteredData.length }).map((_, index) => (
                                <tr key={index} className="border-b animate-pulse">
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <td key={i} className="px-4 py-4">
                                            <div className="h-4 w-full bg-gray-300 dark:bg-zinc-700 rounded" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={10}>
                                    <div className="text-center text-muted-foreground py-10 text-sm dark:text-zinc-400">
                                        No stock found.
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((stock) => (
                                <tr
                                    key={stock.symbol}
                                    className="border-b hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all"
                                >
                                    <td className="px-4 py-4">
                                        <div className="font-medium text-base mb-1">{stock.stockName}</div>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                                Qty: {stock.quantity}
                                            </span>
                                            <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                {stock.sector}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">{stock.exchange}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">₹{stock.purchasePrice}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">₹{stock.investment.toFixed(2)}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">{stock.portfolioPercent.toFixed(2)}%</td>
                                    <td className="px-4 py-4 whitespace-nowrap">₹{stock.cmp}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">₹{stock.presentValue.toFixed(2)}</td>
                                    <td
                                        className={`px-4 py-4 whitespace-nowrap font-medium ${stock.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}
                                    >
                                        ₹{stock.gainLoss.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">{stock.peRatio}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">{stock.latestEarnings}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}