"use client"

import { useEffect, useRef } from "react"

export function VantaBackground() {
    return (
        <div className="fixed inset-0 -z-10 bg-[#fdfaf5] overflow-hidden">
            {/* Elegant static gradients inspired by Canticle theme */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6e1799]/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#b8935a]/5 rounded-full blur-[150px]" />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#6e1799]/3 rounded-full blur-[100px]" />
            
            {/* Noise overlay matching project style */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none" 
                 style={{ backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/dIijAAAACHRSTlMAERIYIikwOYm/TjUAAAJKSURBVDjLxdDNTsMwEAbgSVPEStw4caqE+AAgHoGExCUSFwsSt+AJuHHoVHFpE/w0fo9fG6dp1V+0k2jG3/yZZ5K1Wm/y+T+T3/R/e/xP/S3+i/8uP5Z18/S4fX0+vT7vX2+Pj7uH29PLl6Ojz8+z29v33e08f1k2m3V3n3f3y1mW/e1yXV2fr8vlsu2O6/Z0ud1259vT7bZu21132+1ut9tt/X3b13Xf5/W6P293Wfc1n+f5vG67LsvyvFzW/bxerz+vx/f9fF+vz++363q+n+f59fn9fT6fX6/X1/V6XZ/P5/Xn6/X78/P18/Pz9/Pz+/n5/fj4/vb2/vHx/u/v/vH2/u72/u31/u3z/u/x/u/x/u7v/u3t/urq/ujo/unp/ufn/uTk/uXl/uLi/uXk/uPi/uDk/t/j/t7j/t7h/t3i/t3i/t3j/t3j/t/g/t/e/tzc/tvb/tra/tnZ/tnY/tnX/tmX/tqW/tpV/tpV/tqU/tqT/AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9AL9A/")` }} 
            />
        </div>
    )
}
