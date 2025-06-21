'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  Pause,
  PieChart,
  Play,
  RefreshCcw,
  TrendingUp,
} from 'lucide-react';

import PortfolioTable from '@/components/PortfolioTable';
import SectorSummary from '@/components/SectorSummary';
import StatsCard from '@/components/StatsCard';
import { ModeToggle } from '@/components/ThemeToggle';
import { fetchPrice } from '@/lib/useBatchPrices';
import { MOCK_STOCKS } from './constants/stock';

const REFRESH_INTERVALS = [
  { label: '15 seconds', value: 15000 },
  { label: '30 seconds', value: 30000 },
  { label: '1 minute', value: 60000 },
];

export default function PortfolioPage() {
  const [portfolio] = useState(MOCK_STOCKS);

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(15000);
  const [manualRefreshTrigger, setManualRefreshTrigger] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: livePrices, isLoading } = useQuery({
    queryKey: ['stock-prices', manualRefreshTrigger],
    queryFn: async () => {
      const prices = await Promise.all(
        portfolio.map(async (stock) => {
          const result = await fetchPrice(stock.symbol);
          return { symbol: stock.symbol, price: result.price };
        })
      );
      setLastUpdated(new Date());
      return prices;
    },
    refetchInterval: autoRefresh ? refreshInterval : false,
  });
  console.log("Live Prices:", livePrices);

  const totalInvestment = portfolio.reduce(
    (sum, stock) => sum + stock.purchasePrice * stock.quantity,
    0
  );

  const enrichedPortfolio = portfolio.map((stock) => {
    const live = livePrices?.find((p) => p.symbol === stock.symbol);
    const cmp = live?.price ?? 0;
    const investment = stock.purchasePrice * stock.quantity;
    const presentValue = cmp * stock.quantity;
    const gainLoss = presentValue - investment;
    const portfolioPercent = (investment / totalInvestment) * 100;
    const peRatio = (Math.random() * (40 - 10) + 10).toFixed(2);
    const latestEarnings = `₹${(Math.random() * (50 - 10) + 10).toFixed(2)}`;

    return {
      ...stock,
      cmp,
      investment,
      presentValue,
      gainLoss,
      portfolioPercent,
      peRatio,
      latestEarnings,
    };
  });
  console.log("Enriched Portfolio:", enrichedPortfolio);

  const currentValue = enrichedPortfolio.reduce(
    (sum, stock) => sum + stock.presentValue,
    0
  );
  // const currentValue = -800 
  const gainLoss = enrichedPortfolio.reduce(
    (sum, stock) => sum + stock.gainLoss,
    0
  );
  const gainLossPercent = (gainLoss / totalInvestment) * 100 || 0;

  const handleManualRefresh = () => setManualRefreshTrigger(Date.now());
  const formattedTime = format(lastUpdated, 'p');

  return (
    <div className="max-w-7xl mx-auto py-6 px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            Your Portfolio 
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Last updated: {formattedTime}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ModeToggle />

          <Button
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-2"
          >
            {autoRefresh ? <Pause size={16} /> : <Play size={16} />}
            Auto Refresh: {autoRefresh ? 'ON' : 'OFF'}
          </Button>

          <DropdownMenu
            onOpenChange={(open) => setDropdownOpen(open)}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                disabled={!autoRefresh}
                className="flex items-center gap-2"
              >
                {
                  REFRESH_INTERVALS.find((r) => r.value === refreshInterval)
                    ?.label
                }
                {dropdownOpen ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {REFRESH_INTERVALS.map((r) => (
                <DropdownMenuItem
                  key={r.value}
                  onSelect={() => setRefreshInterval(r.value)}
                >
                  {r.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {!autoRefresh && (
            <Button onClick={handleManualRefresh}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          )}
        </div>
      </div>

      <div className=" mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-8">
        <StatsCard
          title="Total Investment"
          value={`₹${totalInvestment.toLocaleString()}`}
          icon={<DollarSign size={20} />}
          bgClass="bg-gradient-to-r from-blue-500 to-blue-600"
          loading={isLoading}
        />

        <StatsCard
          title="Current Value"
          value={`₹${currentValue.toLocaleString()}`}
          icon={<PieChart size={20} />}
          bgClass={
            currentValue < totalInvestment
              ? "bg-gradient-to-r from-red-500 to-red-700"
              : "bg-gradient-to-r from-green-400 to-green-600"
          }
          loading={isLoading}
        />

        <StatsCard
          title="Total P&L"
          value={`₹${gainLoss.toLocaleString()}`}
          subValue={`${gainLossPercent.toFixed(2)}%`}
          icon={<TrendingUp size={20} />}
          bgClass={
            gainLoss < 0
              ? "bg-gradient-to-r from-red-500 to-rose-700"
              : "bg-gradient-to-r from-green-500 to-emerald-600"
          }
          loading={isLoading}
        />
      </div>
      <SectorSummary data={enrichedPortfolio} loading={isLoading}/>
      <PortfolioTable data={enrichedPortfolio} loading={isLoading}/>
    </div>
  );
}
