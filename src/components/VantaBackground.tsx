"use client"

import React, { useEffect, useRef, useState } from 'react'
// @ts-ignore
import * as THREE from 'three'
// @ts-ignore
import HALO from 'vanta/dist/vanta.halo.min'

export const VantaBackground = () => {
    const [vantaEffect, setVantaEffect] = useState<any>(null)
    const vantaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!vantaEffect && vantaRef.current) {
            setVantaEffect(
                HALO({
                    el: vantaRef.current,
                    THREE: THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    backgroundColor: 0x131a43,
                    baseColor: 0x001a59,
                    size: 1.00,
                    amplitudeFactor: 1.00,
                    xOffset: 0.00,
                    yOffset: 0.00
                })
            )
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy()
        }
    }, [vantaEffect])

    return (
        <div
            ref={vantaRef}
            className="fixed inset-0 -z-10 w-full h-full"
            style={{ filter: 'brightness(0.7)' }} // Subtle darkening for better content readability
        />
    )
}
