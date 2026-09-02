"use client";

import React, { useEffect, useMemo, useState } from "react";

type GraphNode = {
  id: string;
  type?: string;
  amount?: number | string;
};

type GraphEdge = {
  source: string;
  target: string;
  relationship?: string;
};

type GraphData = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

const NODE_COLORS: Record<string, { bg: string; border: string; accent: string }> = {
  invoice: { bg: "#eff6ff", border: "#bfdbfe", accent: "#2563eb" },
  settlement: { bg: "#faf5ff", border: "#e9d5ff", accent: "#9333ea" },
  bank: { bg: "#f0fdf4", border: "#bbf7d0", accent: "#16a34a" },
  ledger: { bg: "#fff7ed", border: "#fed7aa", accent: "#ea580c" },
};

const FALLBACK_NODE_COLORS = {
  bg: "#f8fafc",
  border: "#cbd5e1",
  accent: "#475569",
};

function getNodeStyle(type?: string) {
  return NODE_COLORS[type?.toLowerCase() ?? ""] ?? FALLBACK_NODE_COLORS;
}

function formatAmount(amount?: number | string) {
  if (amount === undefined || amount === null || amount === "") return null;
  const numeric = Number(amount);
  if (!Number.isNaN(numeric)) {
    return `₹${numeric.toLocaleString("en-IN")}`;
  }
  return `₹${amount}`;
}

function FinancialGraphCanvas({ graphData }: { graphData: GraphData }) {
  const width = 1000;
  const height = 520;
  const nodeWidth = 190;
  const nodeHeight = 96;

  const positions = useMemo(() => {
    const nodes = graphData.nodes ?? [];
    const columns = Math.max(1, Math.ceil(Math.sqrt(nodes.length)));
    const rows = Math.max(1, Math.ceil(nodes.length / columns));
    const xGap = (width - nodeWidth - 80) / Math.max(1, columns - 1);
    const yGap = (height - nodeHeight - 80) / Math.max(1, rows - 1);

    return new Map(
      nodes.map((node, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        return [
          node.id,
          {
            x: 40 + column * xGap,
            y: 40 + row * yGap,
          },
        ];
      }),
    );
  }, [graphData.nodes]);

  const nodeById = useMemo(
    () => new Map((graphData.nodes ?? []).map((node) => [node.id, node])),
    [graphData.nodes],
  );

  return (
    <div className="relative w-full overflow-auto rounded-xl border border-slate-200 bg-slate-50/70">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block min-w-[760px] w-full h-[600px]"
        role="img"
        aria-label="Financial knowledge graph"
      >
        <defs>
          <pattern id="financial-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e2e8f0" strokeWidth="1" />
          </pattern>
          <marker
            id="financial-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
        </defs>

        <rect width={width} height={height} fill="url(#financial-grid)" />

        {(graphData.edges ?? []).map((edge, index) => {
          const source = positions.get(edge.source);
          const target = positions.get(edge.target);
          if (!source || !target) return null;

          const x1 = source.x + nodeWidth / 2;
          const y1 = source.y + nodeHeight / 2;
          const x2 = target.x + nodeWidth / 2;
          const y2 = target.y + nodeHeight / 2;
          const curve = Math.max(35, Math.abs(x2 - x1) * 0.18);
          const direction = x2 >= x1 ? 1 : -1;
          const labelX = (x1 + x2) / 2;
          const labelY = (y1 + y2) / 2 - 8;

          return (
            <g key={`${edge.source}-${edge.target}-${index}`}>
              <path
                d={`M ${x1} ${y1} C ${x1 + curve * direction} ${y1}, ${x2 - curve * direction} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                markerEnd="url(#financial-arrow)"
              />
              {edge.relationship && (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#64748b"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                >
                  {edge.relationship}
                </text>
              )}
            </g>
          );
        })}

        {(graphData.nodes ?? []).map((node) => {
          const position = positions.get(node.id);
          if (!position) return null;
          const style = getNodeStyle(node.type);
          const amount = formatAmount(node.amount);

          return (
            <g key={node.id} transform={`translate(${position.x}, ${position.y})`}>
              <rect
                width={nodeWidth}
                height={nodeHeight}
                rx="12"
                fill={style.bg}
                stroke={style.border}
                strokeWidth="2"
              />
              <rect width="5" height={nodeHeight} rx="2.5" fill={style.accent} />
              <text
                x="20"
                y="29"
                fontSize="14"
                fontWeight="700"
                fill="#0f172a"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              >
                {node.id}
              </text>
              <text
                x="20"
                y="51"
                fontSize="11"
                fill="#64748b"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              >
                {(node.type ?? "record").toUpperCase()}
              </text>
              {amount && (
                <text
                  x="20"
                  y="76"
                  fontSize="13"
                  fontWeight="600"
                  fill="#0f172a"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                >
                  {amount}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function FinancialGraph() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchGraph = async () => {
      try {
        const res = await fetch("/api/demo/graph", { method: "POST" });
        if (!res.ok) throw new Error(`Graph request failed: ${res.status}`);
        const data = (await res.json()) as GraphData;
        if (!cancelled) setGraphData(data);
      } catch (err) {
        console.error("Failed to fetch graph", err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchGraph();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="text-sm font-mono text-gray-500 animate-pulse p-12 text-center">
        Computing Financial Graph...
      </div>
    );
  }

  if (error || !graphData) {
    return (
      <div className="text-sm font-mono text-gray-500 p-12 text-center">
        Unable to load financial graph.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-2">Financial Knowledge Graph</h3>
      <p className="text-sm text-gray-500 mb-6">
        Interactive view of linked invoices, settlements, banks, and ledger records.
      </p>

      <FinancialGraphCanvas graphData={graphData} />

      <div className="mt-6 p-4 bg-gray-50 border rounded-lg text-sm text-gray-600">
        <span className="font-bold text-gray-900">Graph Properties:</span>{" "}
        {graphData.nodes.length} nodes, {graphData.edges.length} relationships
      </div>
    </div>
  );
}
