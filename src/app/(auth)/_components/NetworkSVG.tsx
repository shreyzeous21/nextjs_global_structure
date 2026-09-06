"use client";

export default function NetworkSVG() {
  const nodes = [
    { cx: 80, cy: 60 },
    { cx: 200, cy: 40 },
    { cx: 320, cy: 80 },
    { cx: 450, cy: 50 },
    { cx: 530, cy: 90 },
    { cx: 60, cy: 180 },
    { cx: 170, cy: 200 },
    { cx: 290, cy: 180 },
    { cx: 400, cy: 210 },
    { cx: 520, cy: 180 },
    { cx: 100, cy: 300 },
    { cx: 230, cy: 320 },
    { cx: 350, cy: 290 },
    { cx: 470, cy: 310 },
    { cx: 560, cy: 280 },
    { cx: 150, cy: 130 },
    { cx: 380, cy: 140 },
    { cx: 260, cy: 250 },
  ];

  const connections: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [0, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
    [5, 10],
    [10, 11],
    [11, 12],
    [12, 13],
    [13, 14],
    [1, 15],
    [2, 16],
    [6, 17],
    [11, 17],
    [15, 6],
    [16, 8],
    [17, 12],
    [0, 15],
    [3, 16],
    [10, 11],
    [8, 13],
  ];

  const curveOffsets = [
    20, -20, -20, -20, 20, -20, -20, -20, 20, -20,
    -20, 20, -20, 20, 20, 20, 20, 20, 20, 20,
    20, 20, 20, -20, 20,
  ];

  const paths = connections.map(([from, to], i) => {
    const n1 = nodes[from];
    const n2 = nodes[to];
    const mx = (n1.cx + n2.cx) / 2;
    const my = (n1.cy + n2.cy) / 2 + curveOffsets[i];
    return `M ${n1.cx} ${n1.cy} Q ${mx} ${my} ${n2.cx} ${n2.cy}`;
  });

  return (
    <svg viewBox="0 0 600 400" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00D2FF" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#3A86FF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.3" />
        </linearGradient>

        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="particleGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {paths.map((d, i) => (
        <path
          key={`path-${i}`}
          d={d}
          fill="none"
          stroke="url(#pathGrad)"
          strokeWidth="1.5"
          opacity="0.5"
        />
      ))}

      {paths.map((d, i) => (
        <circle
          key={`particle-${i}`}
          r="2.5"
          fill="#00D2FF"
          filter="url(#particleGlow)"
          opacity="0.9"
        >
          <animateMotion
            dur={`${3 + (i % 4)}s`}
            repeatCount="indefinite"
            begin={`${(i * 0.3) % 3}s`}
            path={d}
          />
        </circle>
      ))}

      {nodes.map((node, i) => (
        <g key={`node-${i}`}>
          <circle
            cx={node.cx}
            cy={node.cy}
            r="12"
            fill="url(#glow)"
            opacity="0.4"
          >
            <animate
              attributeName="r"
              values="10;16;10"
              dur="2s"
              repeatCount="indefinite"
              begin={`${(i * 0.2) % 2}s`}
            />
            <animate
              attributeName="opacity"
              values="0.3;0.6;0.3"
              dur="2s"
              repeatCount="indefinite"
              begin={`${(i * 0.2) % 2}s`}
            />
          </circle>
          <circle
            cx={node.cx}
            cy={node.cy}
            r="5"
            fill="#00D2FF"
            filter="url(#nodeGlow)"
            opacity="0.9"
          >
            <animate
              attributeName="r"
              values="4;6;4"
              dur="2s"
              repeatCount="indefinite"
              begin={`${(i * 0.2) % 2}s`}
            />
          </circle>
          <circle
            cx={node.cx}
            cy={node.cy}
            r="2"
            fill="#FFFFFF"
            opacity="0.8"
          />
        </g>
      ))}
    </svg>
  );
}
