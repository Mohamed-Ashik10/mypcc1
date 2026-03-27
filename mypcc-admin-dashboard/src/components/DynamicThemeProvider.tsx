"use client";
import { useEffect, useState } from "react";

export function DynamicThemeProvider({ initialStyles }: { initialStyles: string }) {
    const [styles, setStyles] = useState(initialStyles);

    useEffect(() => {
        const handleThemeUpdate = (event: any) => {
            if (event.detail && event.detail.styles) {
                setStyles(event.detail.styles);
            }
        };

        window.addEventListener("system-theme-updated", handleThemeUpdate);
        return () => window.removeEventListener("system-theme-updated", handleThemeUpdate);
    }, []);

    return <style dangerouslySetInnerHTML={{ __html: `:root { ${styles} }` }} />;
}
