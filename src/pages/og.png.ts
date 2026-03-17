import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import path from "node:path";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  // Load fonts
  const monoFontPath = path.resolve("node_modules/@fontsource/jetbrains-mono");
  let monoFont: ArrayBuffer;
  try {
    monoFont = fs.readFileSync(
      path.join(monoFontPath, "files/jetbrains-mono-latin-500-normal.woff"),
    ).buffer as ArrayBuffer;
  } catch {
    // Fallback: fetch from Google Fonts
    const res = await fetch(
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=swap",
    );
    const css = await res.text();
    const urlMatch = css.match(/url\(([^)]+)\)/);
    if (!urlMatch) throw new Error("Could not fetch font");
    const fontRes = await fetch(urlMatch[1]);
    monoFont = await fontRes.arrayBuffer();
  }

  // Load icon as base64
  const iconPath = path.resolve("public/images/prowl-icon.png");
  const iconBuffer = fs.readFileSync(iconPath);
  const iconBase64 = `data:image/png;base64,${iconBuffer.toString("base64")}`;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1221",
          padding: "60px 80px",
          gap: "24px",
        },
        children: [
          // Main content row
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "48px",
                flex: 1,
              },
              children: [
                // Left: large icon
                {
                  type: "img",
                  props: {
                    src: iconBase64,
                    width: 280,
                    height: 280,
                    style: {
                      borderRadius: "62px",
                    },
                  },
                },
                // Right: text stack
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "80px",
                            fontWeight: 700,
                            fontFamily: "JetBrains Mono",
                            color: "#e8edf5",
                            lineHeight: 1,
                          },
                          children: "Prowl",
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "30px",
                            fontWeight: 500,
                            fontFamily: "JetBrains Mono",
                            color: "#5ae4c0",
                            lineHeight: 1.4,
                          },
                          children: "Quiet paws. Sharp claws.",
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "24px",
                            color: "#8899b4",
                            lineHeight: 1.5,
                            marginTop: "4px",
                          },
                          children:
                            "A native macOS terminal environment,",
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "24px",
                            color: "#8899b4",
                            lineHeight: 1.5,
                            marginTop: "-8px",
                          },
                          children:
                            "sharpened for coding agents.",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          // Bottom: URL
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                fontFamily: "JetBrains Mono",
                fontSize: "20px",
                color: "#8899b4",
              },
              children: "prowl.onev.cat",
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "JetBrains Mono",
          data: monoFont,
          weight: 500,
          style: "normal",
        },
      ],
    },
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
  });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: { "Content-Type": "image/png" },
  });
};
