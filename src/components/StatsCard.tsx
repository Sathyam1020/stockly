import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";

interface StatsCardProps {
    title: string;
    value: string;
    icon?: ReactNode;
    bgClass?: string;
    subValue?: string;
    loading?: boolean;
}

export default function StatsCard({
    title,
    value,
    icon,
    bgClass = "bg-blue-500",
    subValue,
    loading,
}: StatsCardProps) {
    const [loadingText, setLoadingText] = useState("Loading...");

    useEffect(() => {
        if (!loading) return;

        const timers: NodeJS.Timeout[] = [];

        // Timeline of updates
        timers.push(setTimeout(() => setLoadingText("Almost done..."), 3000));
        timers.push(setTimeout(() => setLoadingText("Just a moment..."), 5000));
        timers.push(setTimeout(() => setLoadingText("This is taking longer than expected..."), 8000));

        return () => {
            timers.forEach(clearTimeout);
        };
    }, [loading]);

    return (
        <div
            className={cn(
                "rounded-2xl p-6 text-white shadow-lg transition hover:scale-[1.015] duration-200",
                "dark:text-white relative overflow-hidden",
                loading ? "bg-gradient-to-r from-gray-400 to-gray-600" : bgClass
            )}
        >
            {icon && !loading && (
                <div className="absolute top-4 right-4 text-white/80">{icon}</div>
            )}

            <div className="text-sm font-medium mb-2 opacity-90">
                {loading ? (
                    <div className="h-4 w-full rounded animate-pulse">{loadingText}</div>
                ) : (
                    title
                )}
            </div>

            <div className="text-3xl font-bold">
                {loading ? (
                    <div className="h-8 w-32 bg-white/40 rounded animate-pulse" />
                ) : (
                    value
                )}
            </div>

            {subValue && (
                <div className="text-sm font-semibold mt-1 opacity-90">
                    {loading ? (
                        <div className="h-4 w-20 bg-white/30 rounded animate-pulse" />
                    ) : (
                        subValue
                    )}
                </div>
            )}
        </div>
    );
}
