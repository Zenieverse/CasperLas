/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { ShieldAlert, AlertCircle, AlertTriangle, Zap } from "lucide-react";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
  pulse: number;
  activity: string;
}

interface Link {
  source: string;
  target: string;
  activityLevel: number; // 0 to 1
  color: string;
}

interface NetworkGraphProps {
  activeAgentId?: string | null;
  onSelectAgent?: (id: string) => void;
}

export default function NetworkGraph({ activeAgentId, onSelectAgent }: NetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 350 });
  const [anomalyMode, setAnomalyMode] = useState<boolean>(true);

  // Initialize network layout
  useEffect(() => {
    const initialNodes: Node[] = [
      { id: "a-risk", label: "Risk Guardian", x: 180, y: 100, size: 22, color: "#00CD59", pulse: 0, activity: "Monitoring Yield Pools" },
      { id: "a-treasury", label: "Yield Oracle", x: 120, y: 220, size: 24, color: "#00CD59", pulse: 0, activity: "Analyzing APY Indexes" },
      { id: "a-economic", label: "Macro Forecaster", x: 300, y: 250, size: 20, color: "#3B82F6", pulse: 0, activity: "Calibrating x402 flow rates" },
      { id: "a-legal", label: "Lex Casper Juris", x: 420, y: 120, size: 18, color: "#10B981", pulse: 0, activity: "Auditing compliance signatures" },
      { id: "a-community", label: "Vibe Sentinel", x: 480, y: 220, size: 16, color: "#F59E0B", pulse: 0, activity: "Ingesting Telegram polls" },
      { id: "a-rwa-expert", label: "RWA Oracle", x: 300, y: 80, size: 22, color: "#EC4899", pulse: 0, activity: "Attesting Carbon Credits" },
    ];

    const initialLinks: Link[] = [
      { source: "a-treasury", target: "a-risk", activityLevel: 0.8, color: "rgba(0, 205, 89, 0.4)" },
      { source: "a-risk", target: "a-rwa-expert", activityLevel: 0.5, color: "rgba(236, 72, 153, 0.4)" },
      { source: "a-treasury", target: "a-economic", activityLevel: 0.9, color: "rgba(59, 130, 246, 0.4)" },
      { source: "a-economic", target: "a-legal", activityLevel: 0.4, color: "rgba(16, 185, 129, 0.4)" },
      { source: "a-legal", target: "a-community", activityLevel: 0.3, color: "rgba(245, 158, 11, 0.4)" },
      { source: "a-rwa-expert", target: "a-legal", activityLevel: 0.7, color: "rgba(16, 185, 129, 0.4)" },
    ];

    setNodes(initialNodes);
    setLinks(initialLinks);
  }, []);

  // Handle Resize beautifully using ResizeObserver pattern
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.max(width, 300),
          height: Math.max(height, 280),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Update canvas state via requestAnimationFrame loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    const draw = () => {
      frame++;
      ctx.clearRect(0,0, dimensions.width, dimensions.height);

      // Deep space grid backdrop
      ctx.strokeStyle = "rgba(0, 205, 89, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < dimensions.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, dimensions.height);
        ctx.stroke();
      }
      for (let y = 0; y < dimensions.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.width, y);
        ctx.stroke();
      }

      // Render links
      links.forEach((link) => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        if (!sourceNode || !targetNode) return;

        const isAnomalousLink = anomalyMode && 
          ((link.source === "a-economic" && link.target === "a-treasury") || 
           (link.source === "a-treasury" && link.target === "a-economic") ||
           (link.source === "a-legal" && link.target === "a-community") ||
           (link.source === "a-community" && link.target === "a-legal"));

        if (isAnomalousLink) {
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.35 + Math.sin(frame * 0.12) * 0.15})`;
          ctx.lineWidth = 2.2;
          ctx.setLineDash([4, 4]); // Dashed/erratic communication lines
        } else {
          ctx.strokeStyle = link.color;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([]); // clear solid lines
        }

        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.stroke();
        ctx.setLineDash([]); // restore default

        // Animated signal packet along the link
        const flowSpeed = isAnomalousLink ? 1.6 : 0.5; // payment bursts / floods flow super fast!
        const flowPercent = ((frame * flowSpeed) % 100) / 100;
        const packetX = sourceNode.x + (targetNode.x - sourceNode.x) * flowPercent;
        const packetY = sourceNode.y + (targetNode.y - sourceNode.y) * flowPercent;

        ctx.fillStyle = isAnomalousLink ? "#EF4444" : "#00CD59";
        ctx.shadowColor = isAnomalousLink ? "#EF4444" : "#00CD59";
        ctx.shadowBlur = isAnomalousLink ? 12 : 8;
        ctx.beginPath();
        ctx.arc(packetX, packetY, isAnomalousLink ? 4.5 : 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // Render nodes
      nodes.forEach((node) => {
        const isSelected = activeAgentId === node.id || selectedNode === node.id;
        const isAnomalous = anomalyMode && (node.id === "a-economic" || node.id === "a-community");
        const pulseRatio = Math.sin(frame * 0.06 + (node.id === "a-risk" ? 1 : 2)) * 6;

        // Draw halo for active configuration / anomalous configuration
        if (isAnomalous) {
          ctx.strokeStyle = "rgba(239, 68, 68, 0.6)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          // pulsating red ring with higher intensity
          const anomalyPulse = Math.sin(frame * 0.12) * 8 + 14;
          ctx.arc(node.x, node.y, node.size + anomalyPulse, 0, Math.PI * 2);
          ctx.stroke();

          // Outer alarm flare
          ctx.fillStyle = "rgba(239, 68, 68, 0.08)";
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size + anomalyPulse - 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (isSelected) {
          ctx.strokeStyle = "rgba(0, 205, 89, 0.4)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size + 10 + pulseRatio, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Pulse boundary
        if (isAnomalous) {
          ctx.fillStyle = "rgba(239, 68, 68, 0.1)";
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size + (Math.sin(frame * 0.1) * 4), 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = isSelected ? "rgba(0, 205, 89, 0.08)" : "rgba(255, 255, 255, 0.02)";
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size + pulseRatio, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node center
        const grad = ctx.createRadialGradient(node.x, node.y, 2, node.x, node.y, node.size);
        grad.addColorStop(0, "#ffffff");
        if (isAnomalous) {
          grad.addColorStop(0.5, "#EF4444"); // Red alarm node color
        } else {
          grad.addColorStop(0.5, node.color);
        }
        grad.addColorStop(1, "#0A0D10");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();

        // Outline node
        ctx.strokeStyle = isAnomalous ? "#EF4444" : (isSelected ? "#00CD59" : "rgba(255, 255, 255, 0.15)");
        ctx.lineWidth = isAnomalous ? 2.5 : (isSelected ? 2 : 1);
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.stroke();

        // Draw caution icon indicator
        if (isAnomalous) {
          ctx.fillStyle = "#EF4444";
          ctx.beginPath();
          // Small warning dot on top-right of node
          ctx.arc(node.x + node.size - 2, node.y - node.size + 2, 5, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(node.x + node.size - 2, node.y - node.size + 2, 5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = isAnomalous ? "#F87171" : (isSelected ? "#ffffff" : "#A1A1AA");
        ctx.font = "bold 11px Inter, system-ui";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + node.size + 15);

        // Subtext activity if active / anomalous
        if (isAnomalous) {
          ctx.fillStyle = "#EF4444";
          ctx.font = "bold 9px 'JetBrains Mono', monospace";
          ctx.fillText("⚠️ ANOMALY ACTIVE", node.x, node.y - node.size - 8);
        } else if (isSelected) {
          ctx.fillStyle = "#00CD59";
          ctx.font = "9px 'JetBrains Mono', monospace";
          ctx.fillText(node.activity, node.x, node.y - node.size - 8);
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [nodes, links, activeAgentId, selectedNode, dimensions]);

  // Click on canvas to select node
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    let clickedNodeId: string | null = null;
    for (const node of nodes) {
      const dist = Math.hypot(node.x - clickX, node.y - clickY);
      if (dist <= node.size + 15) {
        clickedNodeId = node.id;
        break;
      }
    }

    setSelectedNode(clickedNodeId);
    if (clickedNodeId && onSelectAgent) {
      onSelectAgent(clickedNodeId);
    }
  };

  return (
    <div id="canvas-container" ref={containerRef} className="relative w-full h-[320px] bg-black/90 rounded-xl border border-zinc-800/80 overflow-hidden cursor-crosshair">
      <div className="absolute top-2 left-3 z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur px-2.5 py-1 rounded border border-zinc-800">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
          <span className="text-[10px] font-mono text-zinc-400">CASPER AGENT TELEMETRY NET</span>
        </div>
      </div>

      {/* ANOMALY SCANNER CONTROL INTERACTIVE BUTTON */}
      <div className="absolute top-2 right-3 z-30 flex gap-2">
        <button
          onClick={() => setAnomalyMode(!anomalyMode)}
          className={`px-2.5 py-1 text-[9px] font-mono font-bold tracking-tight border rounded-md transition-all active:scale-95 flex items-center gap-1.5 ${
            anomalyMode 
              ? "bg-red-500/10 text-red-500 border-red-500/40 shadow-lg shadow-red-500/5 animate-pulse cursor-pointer pointer-events-auto" 
              : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 cursor-pointer pointer-events-auto"
          }`}
          title="Toggle Anomaly Detection Overlay"
        >
          <ShieldAlert className="w-3 h-3 shrink-0 text-red-400" />
          <span>ANOMALY SCANNER: {anomalyMode ? "ACTIVE (2)" : "OFF"}</span>
        </button>
      </div>

      {/* CORE ANOMALY INTELLIGENCE GLASS CARD OVERLAY */}
      {anomalyMode && (
        <div className="absolute bottom-2 left-3 z-20 bg-zinc-950/95 border border-red-500/25 p-2 rounded-lg max-w-[260px] backdrop-blur shadow-2xl animate-fade-in text-[8.5px] font-mono pointer-events-auto">
          <div className="flex items-center gap-1.5 text-red-400 font-bold border-b border-red-950/40 pb-1 mb-1.5">
            <AlertCircle className="w-3 h-3 animate-pulse shrink-0" />
            <span className="tracking-wider uppercase text-[8.5px]">ANOMALY FEED</span>
          </div>
          <div className="space-y-1.5 max-h-[140px] overflow-y-auto scrollbar-none">
            <div 
              className="p-1 rounded bg-red-950/20 border border-red-900/30 hover:border-red-500/50 transition-colors cursor-pointer"
              onClick={() => {
                setSelectedNode("a-economic");
                if (onSelectAgent) onSelectAgent("a-economic");
              }}
            >
              <div className="flex justify-between font-bold text-red-300">
                <span>[a-economic] Burst Rate</span>
                <span className="text-red-500 text-[7px] animate-pulse">BURST</span>
              </div>
              <p className="text-zinc-400 mt-0.5 leading-tight">Quant Macro issuing heavy x402 stream bursts to Chronos. (42.5 CSPR/sec, +1,400% surge).</p>
            </div>
            
            <div 
              className="p-1 rounded bg-red-950/20 border border-red-900/30 hover:border-red-500/50 transition-colors cursor-pointer"
              onClick={() => {
                setSelectedNode("a-community");
                if (onSelectAgent) onSelectAgent("a-community");
              }}
            >
              <div className="flex justify-between font-bold text-red-300">
                <span>[a-community] redun_comm</span>
                <span className="text-red-400 text-[7px] animate-pulse">ERRATIC</span>
              </div>
              <p className="text-zinc-400 mt-0.5 leading-tight">Vibe Sentinel registering erratic telemetry flood of sentiment indexing queries from unverified gateways.</p>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-2 right-3 z-10 pointer-events-none text-right">
        <p className="text-[9px] font-mono text-zinc-500">Nodes: 6 Online | CSPR-MCP Active</p>
      </div>

      <canvas
        id="network-interactive-canvas"
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleCanvasClick}
        className="block"
      />
    </div>
  );
}
