/** Small, transparent stationery illustrations; no raster downloads or animation loop. */
export function InvitationStepArtwork({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 160 180" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient
          id={`paper-${step}`}
          x1="20"
          y1="20"
          x2="130"
          y2="160"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fffdf9" />
          <stop offset="1" stopColor="#e9ded0" />
        </linearGradient>
        <linearGradient
          id={`ink-${step}`}
          x1="45"
          y1="25"
          x2="110"
          y2="150"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#bc6b79" />
          <stop offset="1" stopColor="#833447" />
        </linearGradient>
      </defs>
      {step === 0 ? (
        <>
          <g transform="rotate(-16 70 90)">
            <rect x="17" y="38" width="77" height="112" rx="3" fill="#e9dcd6" />
            <path d="M26 48H85V140H26Z" stroke="#b99794" strokeWidth=".6" />
            <path
              d="M44 77Q55 55 66 77M44 78Q55 100 66 78"
              stroke="#a87e7d"
              strokeWidth=".7"
            />
          </g>
          <g transform="rotate(15 94 90)">
            <rect x="67" y="29" width="73" height="120" rx="3" fill="#e2e4d9" />
            <path d="M76 41H131V137H76Z" stroke="#939d83" strokeWidth=".6" />
            <path
              d="M101 62Q82 72 101 83Q120 72 101 62ZM101 83V102"
              stroke="#84916f"
              strokeWidth=".9"
            />
          </g>
          <g transform="rotate(-4 80 90)">
            <rect
              x="42"
              y="20"
              width="78"
              height="134"
              rx="3"
              fill={`url(#paper-${step})`}
            />
            <path d="M50 29H112V145H50Z" stroke="#b49770" strokeWidth=".6" />
            <path d="M81 41L84 47L81 53L78 47Z" fill="#b49770" />
            <text
              x="81"
              y="79"
              textAnchor="middle"
              fill="#795650"
              fontFamily="Georgia, serif"
              fontSize="22"
              fontStyle="italic"
            >
              A
            </text>
            <text
              x="81"
              y="96"
              textAnchor="middle"
              fill="#b49770"
              fontFamily="Georgia, serif"
              fontSize="12"
            >
              &amp;
            </text>
            <text
              x="81"
              y="118"
              textAnchor="middle"
              fill="#795650"
              fontFamily="Georgia, serif"
              fontSize="22"
              fontStyle="italic"
            >
              M
            </text>
            <path d="M68 132H94" stroke="#b49770" strokeWidth=".6" />
          </g>
        </>
      ) : step === 1 ? (
        <>
          <g transform="rotate(-7 78 90)">
            <rect
              x="27"
              y="22"
              width="99"
              height="136"
              rx="3"
              fill={`url(#paper-${step})`}
            />
            <path d="M36 31H117V149H36Z" stroke="#b49770" strokeWidth=".6" />
            <path d="M63 49H90M69 53H84" stroke="#b49770" strokeWidth=".7" />
            <text
              x="77"
              y="78"
              textAnchor="middle"
              fill="#943b50"
              fontFamily="Georgia, serif"
              fontSize="19"
              fontStyle="italic"
            >
              Ali
            </text>
            <text
              x="77"
              y="92"
              textAnchor="middle"
              fill="#b49770"
              fontFamily="Georgia, serif"
              fontSize="12"
            >
              &amp;
            </text>
            <text
              x="77"
              y="112"
              textAnchor="middle"
              fill="#943b50"
              fontFamily="Georgia, serif"
              fontSize="19"
              fontStyle="italic"
            >
              Malika
            </text>
            <path d="M51 125H103M61 132H93" stroke="#c2aa91" strokeWidth=".7" />
          </g>
          <g transform="rotate(29 122 102)">
            <path d="M119 43H125V141L122 153L119 141Z" fill="#ab8b62" />
            <path d="M119 50H125V136H119Z" fill={`url(#ink-${step})`} />
            <path
              d="M122 50V136M119 55H125M119 132H125"
              stroke="#dbc1a0"
              strokeWidth=".7"
            />
            <path d="M121 149L122 153L123 149" fill="#66514c" />
          </g>
        </>
      ) : (
        <>
          <path d="M20 87L80 45L140 87V151H20Z" fill="#e8d9ca" />
          <g transform="rotate(7 81 87)">
            <rect x="49" y="20" width="66" height="124" rx="9" fill="#66534c" />
            <rect
              x="52"
              y="23"
              width="60"
              height="118"
              rx="7"
              fill={`url(#paper-${step})`}
            />
            <path d="M70 24H94L92 28H72Z" fill="#66534c" />
            <path d="M63 41H101V117H63Z" stroke="#b49770" strokeWidth=".6" />
            <text
              x="82"
              y="70"
              textAnchor="middle"
              fill="#943b50"
              fontFamily="Georgia, serif"
              fontSize="19"
              fontStyle="italic"
            >
              A
            </text>
            <text
              x="82"
              y="84"
              textAnchor="middle"
              fill="#b49770"
              fontFamily="Georgia, serif"
              fontSize="11"
            >
              &amp;
            </text>
            <text
              x="82"
              y="103"
              textAnchor="middle"
              fill="#943b50"
              fontFamily="Georgia, serif"
              fontSize="19"
              fontStyle="italic"
            >
              M
            </text>
            <path
              d="M72 129H92"
              stroke="#aa8d76"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
          <path d="M20 87L80 125L140 87V151H20Z" fill="#eee2d5" />
          <path
            d="M20 151L65 113M140 151L95 113"
            stroke="#d9c5b2"
            strokeWidth=".7"
          />
          <circle cx="81" cy="124" r="9" fill={`url(#ink-${step})`} />
          <path
            d="M78 124L83 121L85 124L80 127M78 121L76 123L79 126M83 127L86 125L83 122"
            stroke="#f4e5de"
            strokeWidth=".8"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
