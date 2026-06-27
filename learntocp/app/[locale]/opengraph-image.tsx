import { ImageResponse } from "next/og";
import { getHomeMessages } from "@/translations";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "LearnToCP - Competitive Programming Lectures";

// Pre-define a simple SVG dot pattern as a data URI to avoid CSS mask issues
const dotPattern = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMTI0LCAxNTgsIDI0OCwgMC4zKSIvPjwvc3ZnPg==`;

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { tagline } = getHomeMessages(locale);

  // NOTE: If your icon is just an SVG, it is vastly safer and more performant
  // to import it as a React component or define it directly in the file 
  // rather than using fs.readFile in a Next.js route handler.
  
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#00131b",
          color: "#e8f1f8",
          fontFamily: "sans-serif",
          // Satori safe dot-pattern background
          backgroundImage: `url("${dotPattern}")`,
          backgroundRepeat: "repeat",
        }}
      >
        {/* Safe Radial Gradient Overlay using absolute positioning */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(12,36,56,0.8) 0%, #00131b 100%)",
            display: "flex", // Satori requires display: flex on almost everything
          }}
        />

        {/* Foreground Content */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px",
          }}
        >
          
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <svg
              width="200px" // Resized to fit your header constraints nicely
              height="200px"
              viewBox="0 0 800 800"
              version="1.1"
              id="svg1"
              xmlSpace="preserve"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "flex" }} // Satori requires explicit display styles on SVGs
            >
              <defs id="defs1">
                <rect x="1850" y="646" width="1200" height="1082" id="rect33" />
              </defs>
              <g id="layer2" style={{   }}>
                <rect
                  style={{
                    opacity: 1,
                    fill: "#7d9ff8",
                    fillOpacity: 1,
                    stroke: "#7d9ff8",
                    strokeWidth: 30.4263,
                    strokeDasharray: "none",
                    strokeOpacity: 1,
                  }}
                  id="rect19"
                  width="112.60303"
                  height="14.552986"
                  x="304.06885"
                  y="510.16724"
                  ry="1.9328172"
                  rx="0.18642883"
                />
                <rect
                  style={{
                    fill: "#7d9ff8",
                    fillOpacity: 1,
                    stroke: "#7d9ff8",
                    strokeWidth: 32.1279,
                    strokeDasharray: "none",
                    strokeOpacity: 1,
                  }}
                  id="rect19-2"
                  width="151.26045"
                  height="12.425078"
                  x="-163.53212"
                  y="513.00037"
                  ry="1.6502048"
                  rx="0.25043118"
                  transform="rotate(-35.135776)"
                />
                <rect
                  style={{
                    fill: "#7d9ff8",
                    fillOpacity: 1,
                    stroke: "#7d9ff8",
                    strokeWidth: 34.7585,
                    strokeDasharray: "none",
                    strokeOpacity: 1,
                  }}
                  id="rect19-2-7"
                  width="163.68887"
                  height="13.438848"
                  x="359.43005"
                  y="14.075096"
                  ry="1.7848462"
                  rx="0.27100807"
                  transform="matrix(0.57884583,0.815437,-0.81455129,0.58009154,0,0)"
                />
                <path
                  id="rect4"
                  style={{
                    opacity: 1,
                    fill: "none",
                    stroke: "#7d9ff8",
                    strokeWidth: 35,
                    strokeDasharray: "none",
                    strokeOpacity: 1,
                  }}
                  d="m 671.21516,547.53935 v 52.1312 c 0,33.83147 -27.23616,61.06763 -61.06763,61.06763 H 126.16518 c -33.831469,0 -61.067633,-27.23616 -61.067633,-61.06763 V 220.46322 c 0,-33.83147 27.236164,-61.06763 61.067633,-61.06763 v 0 h 251.82287"
                />
                <path
                  style={{
                    opacity: 1,
                    fill: "#50fa7b",
                    fillOpacity: 1,
                    stroke: "#50fa7b",
                    strokeWidth: 20.0029,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "none",
                    strokeOpacity: 1,
                  }}
                  d="M 658.49747,522.5408 505.19404,521.79535"
                  id="path23"
                />
                <path
                  style={{
                    opacity: 1,
                    fill: "#50fa7b",
                    fillOpacity: 1,
                    stroke: "#50fa7b",
                    strokeWidth: 20,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "none",
                    strokeOpacity: 1,
                  }}
                  d="m 598.92587,482.78157 39.6875,37.04166"
                  id="path25"
                />
                <path
                  style={{
                    opacity: 1,
                    fill: "#50fa7b",
                    fillOpacity: 1,
                    stroke: "#50fa7b",
                    strokeWidth: 20,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "none",
                    strokeOpacity: 1,
                  }}
                  d="m 598.3967,426.16074 -0.52916,57.14999"
                  id="path26"
                />
                <path
                  style={{
                    fill: "#50fa7b",
                    fillOpacity: 1,
                    stroke: "#50fa7b",
                    strokeWidth: 20,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "none",
                    strokeOpacity: 1,
                  }}
                  d="m 566.77357,484.13332 -39.6875,37.04166"
                  id="path25-2"
                />
                <path
                  style={{
                    fill: "#50fa7b",
                    fillOpacity: 1,
                    stroke: "#50fa7b",
                    strokeWidth: 20,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "none",
                    strokeOpacity: 1,
                  }}
                  d="m 567.30274,427.51249 0.52916,57.14999"
                  id="path26-7"
                />
                <path
                  id="path28"
                  style={{
                    opacity: 1,
                    fill: "none",
                    fillOpacity: 1,
                    stroke: "#50fa7b",
                    strokeWidth: 20,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "none",
                    strokeOpacity: 1,
                  }}
                  d="M 705.60183,290.5523 A 121.9818,141.06485 0 0 1 585.3225,425.99229 121.9818,141.06485 0 0 1 461.83141,290.5523"
                />
                <path
                  style={{
                    opacity: 1,
                    fill: "#50fa7b",
                    fillOpacity: 1,
                    stroke: "#50fa7b",
                    strokeWidth: 20,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "none",
                    strokeOpacity: 1,
                  }}
                  d="m 461.9359,292.81074 2.11667,-156.63333 m -2.31774,58.21133 h -65.10685 v 0"
                  id="path30"
                />
                <path
                  style={{
                    opacity: 1,
                    fill: "#50fa7b",
                    fillOpacity: 1,
                    stroke: "#50fa7b",
                    strokeWidth: 19.4688,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "none",
                    strokeOpacity: 1,
                  }}
                  d="M 704.25679,135.82982 H 465.5757"
                  id="path31"
                />
                <path
                  style={{
                    opacity: 1,
                    fill: "none",
                    fillOpacity: 1,
                    stroke: "#50fa7b",
                    strokeWidth: 20,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "none",
                    strokeOpacity: 1,
                  }}
                  id="path33"
                  d="m 394.16787,195.8232 c -0.46228,4.41154 -0.73932,8.8448 -0.82118,13.28003 -0.0317,1.71599 -0.0246,3.43247 -0.037,5.14871 0.0259,10.64842 0.0744,21.31682 1.0862,31.92729 0.18822,1.97366 0.44619,3.94004 0.66926,5.91005 0.76478,6.48704 2.25213,12.89336 4.65839,18.97365 1.4279,3.60812 1.87473,4.25896 3.6527,7.6907 3.50012,6.22515 7.69035,12.07056 12.53678,17.32095 0.97713,1.05858 2.00689,2.06735 3.01032,3.10103 4.60161,4.45703 9.57244,8.55429 14.96986,12.01713 0.94552,0.60661 1.92173,1.16398 2.88259,1.74599 4.22931,2.54624 8.60742,4.90212 13.30944,6.45395 1.67994,0.55446 2.09462,0.61489 3.75248,1.00174 2.06444,0.40987 4.16068,0.59934 6.26276,0.61309 0.17884,-0.0151 0.35767,-0.0304 0.5365,-0.0456 0,0 -3.18352,-2.27758 -3.18352,-2.27758 v 0 c -0.16865,0.0103 -0.33729,0.0206 -0.50594,0.0308 -2.03311,8e-5 -4.06503,-0.15859 -6.05985,-0.56925 -2.00316,-0.46834 -3.9414,-1.01578 -5.85984,-1.77268 -3.64384,-1.43759 -1.3725,-0.66021 -5.16265,-2.34966 -0.0611,-0.0272 0.0842,0.10409 0.12623,0.15613 -0.96885,-0.57872 -1.95358,-1.13162 -2.90653,-1.73619 -5.44576,-3.4548 -10.47533,-7.53981 -15.12133,-12.00402 -1.00669,-1.02896 -2.04068,-2.03189 -3.02009,-3.08684 -4.84867,-5.22266 -9.04216,-11.04436 -12.55268,-17.24132 -1.8265,-3.48093 -2.20869,-4.00453 -3.69504,-7.6632 -2.47496,-6.09229 -4.07146,-12.50083 -4.92013,-19.0176 -0.24152,-1.97508 -0.52258,-3.94573 -0.72454,-5.92525 -1.07783,-10.56537 -1.18261,-21.20311 -0.92572,-31.81087 0.22373,-6.02146 0.37936,-12.0915 1.49778,-18.02921 z" />
                <path
                  style={{
                    fill: "#50fa7b",
                    fillOpacity: 1,
                    stroke: "#50fa7b",
                    strokeWidth: 20,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "none",
                    strokeOpacity: 1,
                  }}
                  d="m 705.80075,292.68915 -2.11667,-156.63333 m 2.31774,58.21133 h 65.10685 v 0"
                  id="path30-1"
                />
                <path
                  style={{
                    fill: "none",
                    fillOpacity: 1,
                    stroke: "#50fa7b",
                    strokeWidth: 20,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "none",
                    strokeOpacity: 1,
                  }}
                  id="path33-2"
                  d="m 775.43967,196.44996 c 0.46228,4.41154 0.73932,8.8448 0.82118,13.28003 0.0317,1.71599 0.0246,3.43247 0.037,5.14871 -0.0259,10.64842 -0.0744,21.31682 -1.0862,31.92729 -0.18822,1.97366 -0.44619,3.94004 -0.66926,5.91005 -0.76478,6.48704 -2.25213,12.89336 -4.65839,18.97365 -1.4279,3.60812 -1.87473,4.25896 -3.6527,7.6907 -3.50012,6.22515 -7.69035,12.07056 -12.53678,17.32095 -0.97713,1.05858 -2.00689,2.06735 -3.01032,3.10103 -4.60161,4.45703 -9.57244,8.55429 -14.96986,12.01713 -0.94552,0.60661 -1.92173,1.16398 -2.88259,1.74599 -4.22931,2.54624 -8.60742,4.90212 -13.30944,6.45395 -1.67994,0.55446 -2.09462,0.61489 -3.75248,1.00174 -2.06444,0.40987 -4.16068,0.59934 -6.26276,0.61309 -0.17884,-0.0151 -0.35767,-0.0304 -0.5365,-0.0456 0,0 3.18352,-2.27758 3.18352,-2.27758 v 0 c 0.16865,0.0103 0.33729,0.0206 0.50594,0.0308 2.03311,8e-5 4.06503,-0.15859 6.05985,-0.56925 -2.00316,-0.46834 -3.9414,-1.01578 -5.85984,-1.77268 -3.64384,-1.43759 -1.3725,-0.66021 -5.16265,-2.34966 -0.0611,-0.0272 -0.0842,0.10409 -0.12623,0.15613 0.96885,-0.57872 1.95358,-1.13162 2.90653,-1.73619 5.44576,-3.4548 10.47533,-7.53981 15.12133,-12.00402 1.00669,-1.02896 2.04068,-2.03189 3.02009,-3.08684 4.84867,-5.22266 9.04216,-11.04436 12.55268,-17.24132 1.8265,-3.48093 2.20869,-4.00453 3.69504,-7.6632 2.47496,-6.09229 4.07146,-12.50083 4.92013,-19.0176 v 0 c -0.24152,-1.97508 -0.52258,-3.94573 -0.72454,-5.92525 -1.07783,-10.56537 -1.18261,-21.20311 -0.92572,-31.81087 -0.22373,-6.02146 -0.37936,-12.0915 -1.49778,-18.02921 z" />
                <path
                  d="m 2212.3049,1381.8247 h -48.8282 q -58.2682,0 -94.7266,-32.5521 -36.1328,-32.2265 -36.1328,-93.4245 v -48.5026 q 0,-55.0131 -27.0183,-85.9376 -27.0182,-31.25 -82.6823,-31.25 h -16.6016 v -50.7812 h 16.6016 q 55.6641,0 82.6823,-30.9245 27.0183,-31.25006 27.0183,-86.2631 v -48.50263 q 0,-61.19795 36.1328,-93.42453 36.4584,-32.5521 94.7266,-32.5521 h 48.8282 v 44.9219 h -37.1094 q -44.2709,0 -64.4532,20.50782 -19.8568,20.50783 -19.8568,66.08077 v 56.96617 q 0,45.24742 -25.0651,76.1719 -25.0651,30.599 -69.6615,48.5026 v 7.8125 q 44.5964,17.9037 69.6615,48.8282 25.0651,30.599 25.0651,75.8464 v 56.9662 q 0,45.5729 19.8568,66.0807 20.1823,20.5078 64.4532,20.5078 h 37.1094 z m 427.7345,-291.6668 h -16.6015 q -55.6641,0 -82.6824,31.25 -27.0182,30.9245 -27.0182,85.9376 v 48.5026 q 0,61.198 -36.4584,93.4245 -36.1328,32.5521 -94.401,32.5521 h -48.8282 v -44.9219 h 37.1094 q 44.2709,0 64.1276,-20.5078 20.1823,-20.5078 20.1823,-66.0807 v -56.9662 q 0,-45.2474 25.0651,-75.8464 25.0652,-30.9245 69.6615,-48.8282 v -7.8125 q -44.5963,-17.9036 -69.6615,-48.5026 -25.0651,-30.92448 -25.0651,-76.1719 v -56.96617 q 0,-45.57294 -20.1823,-66.08077 -19.8567,-20.50782 -64.1276,-20.50782 h -37.1094 v -44.9219 h 48.8282 q 58.2682,0 94.401,32.5521 36.4584,32.22658 36.4584,93.42453 v 48.50263 q 0,55.01304 27.0182,86.2631 27.0183,30.9245 82.6824,30.9245 h 16.6015 z"
                  id="text33"
                  style={{
                    fontSize: "666.667px",
                    whiteSpace: "pre",
                    fill: "#50fa7b",
                    stroke: "#50fa7b",
                    strokeWidth: 37.7953,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                  }}
                  transform="matrix(0.23505432,0,0,0.26546463,49.571382,-10.281803)"
                  aria-label="{}"
                />
              </g>
            </svg>
            <div
              style={{
                display: "flex",
                fontSize: 124,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-0.05em",
              }}
            >
              <span style={{ color: "#7c9ef8" }}>Learn</span>
              <span style={{ color: "#a5b8fc" }}>ToCP</span>
            </div>
          </div>

          {/* Middle Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{
                fontSize: "60px",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-2px",
                maxWidth: "900px",
              }}
            >
              {tagline}
            </div>

            <div
              style={{
                fontSize: "34px",
                color: "#9fb4c7",
                maxWidth: "920px",
              }}
            >
              Lectures · Problem sets · Interactive roadmap
            </div>
          </div>

          {/* Bottom Section */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
            }}
          >
            {["100% FREE", "algorithms", "data structures", "C++"].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  color: "#7c9ef8",
                  backgroundColor: "#0c2438",
                  border: "1px solid #1f3a52",
                  borderRadius: "999px",
                  padding: "10px 24px",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}