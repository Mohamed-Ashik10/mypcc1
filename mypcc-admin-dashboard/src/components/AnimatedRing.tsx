"use client"

import { useState, useEffect } from "react"

interface AnimatedRingProps {
    numBars?: number
    colorFrom?: string
    colorTo?: string
    shadowColor?: string
}

export function AnimatedRing({
    numBars = 50,
    colorFrom = "from-orange-400",
    colorTo = "to-orange-600",
    shadowColor = "shadow-[0_0_15px_rgba(251,146,60,0.8)]"
}: AnimatedRingProps) {
    const [activeBars, setActiveBars] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveBars((prev) => (prev + 1) % numBars)
        }, 100)
        return () => clearInterval(interval)
    }, [numBars])

    return (
        <div className="absolute inset-0 animate-[spin_20s_linear_infinite] scale-[0.8] sm:scale-100 flex items-center justify-center">
            {[...Array(numBars)].map((_, i) => {
                const isActive = (activeBars >= i && activeBars < i + 8) || (activeBars + numBars < i + 8)
                return (
                    <div
                        key={i}
                        className={`absolute w-[4px] sm:w-[6px] h-[20px] sm:h-[30px] rounded-full left-1/2 -ml-[2px] sm:-ml-[3px] transition-all duration-300 ${isActive
                            ? `bg-gradient-to-b ${colorFrom} ${colorTo} ${shadowColor} scale-y-110`
                            : "bg-slate-700 opacity-30"
                            }`}
                        style={{
                            transformOrigin: 'center 50%',
                            transform: `rotate(${(360 / numBars) * i}deg) translateY(-140px) sm:translateY(-170px)`
                        }}
                    />
                )
            })}
        </div>
    )
}
