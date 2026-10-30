interface IndiaMapWatermarkProps {
  className?: string;
  activeState?: string;
  showNodes?: boolean;
  showGrid?: boolean;
}

export function IndiaMapWatermark({
  className = '',
  activeState = 'MN',
  showNodes = true,
  showGrid = true,
}: IndiaMapWatermarkProps) {
  const isMnActive = activeState === 'MN';
  return (
    <div className={`india-map-watermark-container ${className}`} aria-hidden="true">
      <svg
        className="india-map-svg"
        viewBox="0 0 760 840"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle civic glow */}
          <filter id="india-node-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <linearGradient id="arc-gradient-delhi-imphal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ec9c55" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="arc-gradient-ne" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec9c55" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.6" />
          </linearGradient>

          <radialGradient id="manipur-radial-ping" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ec9c55" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#ec9c55" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ec9c55" stopOpacity="0" />
          </radialGradient>

          {/* National civic tricolor micro-gradient for telemetry accent */}
          <linearGradient id="civic-tricolor-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff9933" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#138808" />
          </linearGradient>
        </defs>

        {/* Survey & Geodetic Latitude/Longitude Grid Lines */}
        {showGrid && (
          <g className="india-grid-lines" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="0.8" strokeDasharray="3 4">
            {/* Latitude parallels */}
            <line x1="50" y1="120" x2="710" y2="120" /> {/* ~36° N */}
            <line x1="50" y1="230" x2="710" y2="230" /> {/* ~28° N (Delhi parallel) */}
            <line x1="50" y1="330" x2="710" y2="330" /> {/* ~23.5° N (Tropic of Cancer) */}
            <line x1="50" y1="460" x2="710" y2="460" /> {/* ~18° N */}
            <line x1="50" y1="600" x2="710" y2="600" /> {/* ~12° N */}
            <line x1="50" y1="720" x2="710" y2="720" /> {/* ~8° N (Kanyakumari) */}

            {/* Longitude meridians */}
            <line x1="140" y1="60" x2="140" y2="760" /> {/* ~70° E */}
            <line x1="260" y1="60" x2="260" y2="760" /> {/* ~77° E (Delhi meridian) */}
            <line x1="390" y1="60" x2="390" y2="760" /> {/* ~84° E */}
            <line x1="510" y1="60" x2="510" y2="760" /> {/* ~90° E (Bengal/Assam) */}
            <line x1="615" y1="60" x2="615" y2="760" /> {/* ~94° E (Manipur meridian) */}

            {/* Coordinate labels in subtle monospace */}
            <text x="55" y="226" fill="rgba(255, 255, 255, 0.22)" fontSize="8.5" fontFamily="var(--mono)">28° N · DELHI</text>
            <text x="55" y="326" fill="rgba(255, 255, 255, 0.22)" fontSize="8.5" fontFamily="var(--mono)">23.5° N · CANCER</text>
            <text x="55" y="716" fill="rgba(255, 255, 255, 0.22)" fontSize="8.5" fontFamily="var(--mono)">8° N · EQUATORIAL ARCH</text>

            <text x="264" y="80" fill="rgba(255, 255, 255, 0.22)" fontSize="8.5" fontFamily="var(--mono)">77° E</text>
            <text x="514" y="80" fill="rgba(255, 255, 255, 0.22)" fontSize="8.5" fontFamily="var(--mono)">90° E</text>
            <text x="619" y="80" fill="rgba(255, 255, 255, 0.35)" fontSize="8.5" fontFamily="var(--mono)" fontWeight="700">94° E · IMPHAL</text>
          </g>
        )}

        {/* ========================================================
            REPUBLIC OF INDIA GEODETIC OUTLINE (High Precision SVG)
            Standard Survey of India Boundary projection
           ======================================================== */}
        <g className="india-boundary-group">
          {/* Main Subcontinent Outline */}
          <path
            className="india-mainland-fill"
            d="M 235 55
               C 245 42, 270 38, 290 42
               C 310 46, 325 58, 335 75
               C 345 92, 338 115, 330 128
               C 322 140, 312 155, 305 168
               C 298 180, 275 195, 258 205
               C 240 215, 215 220, 195 235
               C 175 250, 155 270, 142 295
               C 130 320, 115 348, 118 375
               C 120 400, 145 412, 168 418
               C 190 424, 205 408, 215 398
               C 225 388, 240 375, 255 365
               C 268 355, 280 348, 298 348
               C 315 348, 332 355, 348 368
               C 362 380, 380 405, 395 428
               C 410 450, 422 475, 430 500
               C 438 525, 432 555, 420 580
               C 408 605, 385 635, 360 660
               C 335 685, 310 705, 290 725
               C 285 730, 278 732, 275 725
               C 270 710, 260 680, 252 650
               C 244 620, 235 580, 228 540
               C 220 500, 210 460, 202 430
               C 195 405, 178 375, 165 355
               C 152 335, 145 315, 150 290
               C 155 265, 172 245, 190 225
               C 208 205, 220 185, 222 160
               C 224 135, 218 110, 222 85
               Z"
            fill="rgba(255, 255, 255, 0.03)"
            stroke="rgba(147, 197, 253, 0.22)"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />

          {/* East Coast / Bengal Delta to Siliguri Corridor */}
          <path
            className="india-east-bengal"
            d="M 298 348
               C 320 340, 350 330, 380 320
               C 410 310, 435 295, 455 282
               C 470 272, 482 265, 492 260"
            fill="none"
            stroke="rgba(147, 197, 253, 0.28)"
            strokeWidth="1.4"
            strokeDasharray="none"
          />

          {/* ========================================================
              NORTHEAST INDIA REGION (Seven Sisters Focus)
              Assam, Meghalaya, Arunachal, Nagaland, Manipur, Tripura, Mizoram
             ======================================================== */}
          {/* Siliguri Gateway through Brahmaputra Valley & Hills */}
          <path
            className="northeast-regional-boundary"
            d="M 492 260
               C 505 252, 525 240, 550 230
               C 575 220, 610 205, 635 210
               C 660 215, 680 230, 685 248
               C 690 265, 675 285, 660 300
               C 645 315, 630 335, 618 360
               C 605 385, 595 405, 580 415
               C 565 425, 550 415, 545 395
               C 540 375, 532 355, 520 340
               C 508 325, 495 310, 490 295
               C 485 280, 488 268, 492 260 Z"
            fill="rgba(56, 189, 248, 0.05)"
            stroke="rgba(147, 197, 253, 0.35)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* MANIPUR SPECIFIC HIGHLIGHT POLYGON (Imphal Basin & Surrounding Hills) */}
          <path
            className="manipur-state-highlight"
            d="M 598 318
               C 606 312, 618 315, 622 324
               C 626 333, 624 345, 620 354
               C 616 363, 608 370, 600 368
               C 592 366, 588 355, 588 344
               C 588 333, 592 322, 598 318 Z"
            fill="rgba(236, 156, 85, 0.22)"
            stroke="#ec9c55"
            strokeWidth="2.2"
            filter="url(#india-node-glow)"
          />

          {/* Islands: Andaman & Nicobar */}
          <g className="andaman-nicobar" stroke="rgba(147, 197, 253, 0.3)" strokeWidth="1.2" fill="rgba(255,255,255,0.06)">
            <ellipse cx="585" cy="620" rx="3.5" ry="12" transform="rotate(15 585 620)" />
            <ellipse cx="594" cy="655" rx="3" ry="9" transform="rotate(12 594 655)" />
            <ellipse cx="602" cy="695" rx="4" ry="14" transform="rotate(10 602 695)" />
          </g>

          {/* Islands: Lakshadweep */}
          <g className="lakshadweep" stroke="rgba(147, 197, 253, 0.25)" strokeWidth="1" fill="rgba(255,255,255,0.05)">
            <circle cx="185" cy="630" r="3" />
            <circle cx="192" cy="655" r="2.5" />
            <circle cx="200" cy="680" r="3" />
          </g>
        </g>

        {/* ========================================================
            NATIONAL TELEMETRY & DATA INTERCONNECT NETWORK
            Showing National GePNIC / CPPP backbone connecting to Manipur & NE
           ======================================================== */}
        {showNodes && (
          <g className="telemetry-network-layer">
            {/* Primary Highway: New Delhi (National CPPP HQ) -> Imphal (Manipur CHEIRAP Pilot) */}
            <path
              className="telemetry-arc-primary"
              d="M 270 230 Q 430 200 605 340"
              fill="none"
              stroke="url(#arc-gradient-delhi-imphal)"
              strokeWidth="2"
              strokeDasharray="6 4"
            >
              <animate attributeName="stroke-dashoffset" from="100" to="0" dur="8s" repeatCount="indefinite" />
            </path>

            {/* Regional Fanout from Imphal to Northeast Sister States */}
            {/* Imphal -> Guwahati / Assam */}
            <path
              d="M 605 340 Q 560 300 535 270"
              fill="none"
              stroke="url(#arc-gradient-ne)"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />
            {/* Imphal -> Shillong / Meghalaya */}
            <path
              d="M 605 340 Q 565 320 530 305"
              fill="none"
              stroke="url(#arc-gradient-ne)"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />
            {/* Imphal -> Kohima / Nagaland */}
            <path
              d="M 605 340 Q 610 310 612 285"
              fill="none"
              stroke="url(#arc-gradient-ne)"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />
            {/* Imphal -> Agartala / Tripura */}
            <path
              d="M 605 340 Q 560 360 528 368"
              fill="none"
              stroke="url(#arc-gradient-ne)"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />
            {/* Imphal -> Aizawl / Mizoram */}
            <path
              d="M 605 340 Q 590 380 580 395"
              fill="none"
              stroke="url(#arc-gradient-ne)"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />

            {/* --- NODE: NEW DELHI (CPPP / National GePNIC Node) --- */}
            <g className="telemetry-node delhi-node" transform="translate(270, 230)">
              <circle r="7" fill="rgba(147, 197, 253, 0.2)" />
              <circle r="3.5" fill="#93c5fd" />
              <text x="-8" y="-12" fill="#dbeafe" fontSize="9" fontFamily="var(--mono)" fontWeight="700">
                CPPP / NEW DELHI
              </text>
              <text x="-8" y="-3" fill="rgba(219, 234, 254, 0.65)" fontSize="7" fontFamily="var(--mono)">
                28.61° N · GePNIC Standard
              </text>
            </g>

            {/* --- NODE: GUWAHATI / ASSAM (AS) --- */}
            <g className="telemetry-node as-node" transform="translate(535, 270)">
              <circle r="3" fill="#38bdf8" opacity="0.8" />
              <text x="6" y="3" fill="#bae6fd" fontSize="7.5" fontFamily="var(--mono)">AS · Assam</text>
            </g>

            {/* --- NODE: SHILLONG / MEGHALAYA (ML) --- */}
            <g className="telemetry-node ml-node" transform="translate(530, 305)">
              <circle r="3" fill="#38bdf8" opacity="0.8" />
              <text x="-32" y="3" fill="#bae6fd" fontSize="7.5" fontFamily="var(--mono)">ML · Meghalaya</text>
            </g>

            {/* --- NODE: KOHIMA / NAGALAND (NL) --- */}
            <g className="telemetry-node nl-node" transform="translate(612, 285)">
              <circle r="3" fill="#38bdf8" opacity="0.8" />
              <text x="6" y="3" fill="#bae6fd" fontSize="7.5" fontFamily="var(--mono)">NL · Nagaland</text>
            </g>

            {/* --- NODE: AGARTALA / TRIPURA (TR) --- */}
            <g className="telemetry-node tr-node" transform="translate(528, 368)">
              <circle r="3" fill="#38bdf8" opacity="0.8" />
              <text x="-34" y="3" fill="#bae6fd" fontSize="7.5" fontFamily="var(--mono)">TR · Tripura</text>
            </g>

            {/* --- NODE: AIZAWL / MIZORAM (MZ) --- */}
            <g className="telemetry-node mz-node" transform="translate(580, 395)">
              <circle r="3" fill="#38bdf8" opacity="0.8" />
              <text x="6" y="3" fill="#bae6fd" fontSize="7.5" fontFamily="var(--mono)">MZ · Mizoram</text>
            </g>

            {/* --- ACTIVE NODE: IMPHAL / MANIPUR (MN PILOT) --- */}
            <g className={`telemetry-node manipur-active-node ${isMnActive ? 'node-highlighted' : ''}`} transform="translate(605, 340)">
              {/* Radar Ping Ripples */}
              <circle r="22" fill="url(#manipur-radial-ping)" className="radar-ripple-one" />
              <circle r="12" fill="none" stroke="#ec9c55" strokeWidth="1" opacity="0.6" className="radar-ripple-two" />
              <circle r="6" fill="#ec9c55" filter="url(#india-node-glow)" />
              <circle r="2.5" fill="#ffffff" />

              {/* Monospace Active Focus Tag */}
              <g transform="translate(14, -8)">
                <rect x="0" y="0" width="105" height="26" rx="4" fill="rgba(15, 30, 54, 0.88)" stroke="#ec9c55" strokeWidth="0.9" />
                <text x="7" y="11" fill="#ec9c55" fontSize="8" fontFamily="var(--mono)" fontWeight="800">
                  MANIPUR · ACTIVE
                </text>
                <text x="7" y="21" fill="#e2e8f0" fontSize="7" fontFamily="var(--mono)">
                  24.81° N, 93.93° E · 92 TENDERS
                </text>
              </g>
            </g>
          </g>
        )}

        {/* Civic Sovereignty / Open Public Data Footnote */}
        <g transform="translate(50, 800)">
          <rect x="0" y="0" width="180" height="2.5" fill="url(#civic-tricolor-gradient)" rx="1.2" />
          <text x="0" y="18" fill="rgba(255, 255, 255, 0.45)" fontSize="8.5" fontFamily="var(--mono)" letterSpacing="0.06em">
            NATIONAL e-PROCUREMENT AUDIT MATRIX · OCDS
          </text>
        </g>
      </svg>
    </div>
  );
}
