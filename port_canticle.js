const fs = require('fs');
const path = require('path');

const previewPath = path.join(__dirname, 'public/canticle_preview.html');
const logicPath = path.join(__dirname, 'public/canticle_logic.js');
const pagePath = path.join(__dirname, 'src/app/page.tsx');

let content = fs.readFileSync(previewPath, 'utf-8');

// Find the script tag
const scriptStart = content.indexOf('<script>');
const scriptEnd = content.lastIndexOf('</script>');

if (scriptStart !== -1 && scriptEnd !== -1) {
    let scriptContent = content.substring(scriptStart + 8, scriptEnd).trim();

    fs.writeFileSync(logicPath, scriptContent);

    let htmlContent = content.substring(0, scriptStart) + content.substring(scriptEnd + 9);

    const styleStart = htmlContent.indexOf('<style>');
    const styleEnd = htmlContent.indexOf('</style>');
    let styleContent = '';
    if (styleStart !== -1 && styleEnd !== -1) {
        styleContent = htmlContent.substring(styleStart, styleEnd + 8);
    }

    let bodyRegex = /<body[^>]*>([\s\S]*)<\/body>/i;
    let match = htmlContent.match(bodyRegex);
    let bodyContent = match ? match[1].trim() : htmlContent;

    // Wire up buttons
    bodyContent = bodyContent.replace(/<button class="nav-sign">Sign In<\/button>/g, '<button class="nav-sign" onclick="window.location.href=\'/auth/login\'">Sign In</button>');
    bodyContent = bodyContent.replace(/<button class="nav-join">Join Free<\/button>/g, '<button class="nav-join" onclick="window.location.href=\'/auth/login\'">Join Free</button>');

    const htmlStringLiteral = JSON.stringify(styleContent + '\n' + bodyContent);

    const pageContent = `"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Load external logic script on mount
    const script = document.createElement("script");
    script.src = "/canticle_logic.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: ${htmlStringLiteral} }} />
    </>
  );
}
`;

    fs.writeFileSync(pagePath, pageContent);
    console.log("Successfully ported canticle_preview.html to src/app/page.tsx");
} else {
    console.error("Could not find script block");
}
