/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DefiPosition, Agent } from "../types";
import { TrendingUp, Award, Play, ShieldAlert, ArrowUpRight, HelpCircle, RefreshCw } from "lucide-react";

interface DefiAutopilotProps {
  positions: DefiPosition[];
  agents: Agent[];
  isSimulating: boolean;
  onUpdateAllocation: (id: string, amount: number) => void;
  onRunOptimizationAnalysis: (context: string) => void;
  analysisText: string;
  isAnalysisLoading: boolean;
}

export default function DefiAutopilot({
  positions,
  agents,
  isSimulating,
  onUpdateAllocation,
  onRunOptimizationAnalysis,
  analysisText,
  isAnalysisLoading
}: DefiAutopilotProps) {
  const [allocationMode, setAllocationMode] = useState<"live" | "simulation">("simulation");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState("");

  const handleSave = (id: string) => {
    const rawVal = parseFloat(inputVal);
    if (!isNaN(rawVal) && rawVal >= 0) {
      onUpdateAllocation(id, rawVal);
    }
    setEditingId(null);
  };

  return (
    <div id="defi-autopilot-module" className="bg-zinc-950/60 rounded-xl p-5 border border-zinc-800/80">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            DeFi Autopilot Swarm
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Let yield-maximizing agents dynamically stake CSPR and provision liquid pairings across Casper AMMs.</p>
        </div>

        <div className="flex bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-[10px] font-mono">
          <button
            onClick={() => setAllocationMode("simulation")}
            className={`px-3 py-1 rounded transition-colors ${allocationMode === "simulation" ? "bg-amber-500/10 text-amber-400 border border-amber-500/10" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            SIMULATOR MODE
          </button>
          <button
            onClick={() => setAllocationMode("live")}
            className={`px-3 py-1 rounded transition-colors ${allocationMode === "live" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            LIVE TESTNET (MCP)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Positions Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {positions.map((pos) => (
              <div key={pos.id} className="p-3.5 rounded-lg bg-zinc-900/90 border border-zinc-850">
                <div className="flex justify-between items-start">
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                    pos.riskScore === "Low" 
                      ? "bg-green-500/10 text-green-400 border border-green-500/15"
                      : pos.riskScore === "Medium"
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/15"
                      : "bg-red-500/10 text-red-500 border border-red-500/15"
                  }`}>
                    {pos.riskScore} Risk
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 font-mono">+{pos.apy}% APY</span>
                </div>

                <h3 className="text-xs font-semibold text-white mt-2.5 truncate">{pos.name}</h3>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{pos.poolType}</p>

                <div className="mt-4 pt-3 border-t border-zinc-850">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="block text-[8px] text-zinc-500">ALLOCATION</span>
                      {editingId === pos.id ? (
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="number"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            className="w-16 bg-zinc-950 text-xs text-white border border-zinc-800 px-1 py-0.5 rounded font-mono"
                          />
                          <button
                            onClick={() => handleSave(pos.id)}
                            className="bg-green-500 text-black px-1.5 py-0.5 rounded text-[9px] font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-medium text-zinc-300 font-mono">
                          {pos.allocatedAmount.toLocaleString()} CSPR
                        </span>
                      )}
                    </div>
                    {editingId !== pos.id && (
                      <button
                        onClick={() => {
                          setEditingId(pos.id);
                          setInputVal(pos.allocatedAmount.toString());
                        }}
                        className="text-[9px] font-mono text-zinc-500 hover:text-white border border-zinc-800 px-1.5 py-0.5 rounded transition-all"
                      >
                        Adjust
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Small Allocation Graph Sim */}
          <div className="bg-zinc-900/40 p-4 border border-zinc-850 rounded-xl">
            <h4 className="text-xs font-semibold font-mono text-zinc-400 uppercase tracking-wide mb-3 flex items-center justify-between">
              <span>Historical Aggregated APY Performance (Last 7 Epochs)</span>
              <span className="text-[9px] text-zinc-500 lowercase font-normal">updated via CSPR.cloud oracle</span>
            </h4>
            <div className="h-16 flex items-end justify-between px-2 gap-1 mb-1 bg-zinc-950/40 rounded p-1 border border-zinc-900">
              {[8.1, 8.4, 9.2, 10.8, 12.1, 12.8, 13.62].map((apy, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-emerald-500/80 hover:bg-emerald-400 transition-colors rounded-t"
                    style={{ height: `${(apy / 15) * 50}px` }}
                  ></div>
                  <span className="text-[8px] font-mono text-zinc-500 mt-1">E-{7-idx}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500 mt-2 font-mono">Aggregated Swarm Score: <span className="text-emerald-400">13.62% APY Average</span> across all nodes, hedges and compliance pools.</p>
          </div>
        </div>

        {/* AI Agent Optimizer Terminal / x402 Micropayments */}
        <div className="bg-zinc-900/90 rounded-xl p-4 border border-zinc-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
              <span className="text-xs font-semibold uppercase font-mono tracking-wider text-zinc-300">Swarm Intelligence Tool</span>
              <RefreshCw className={`w-3.5 h-3.5 text-green-400 ${isAnalysisLoading ? "animate-spin" : ""}`} />
            </div>

            <div className="bg-black/90 p-3 h-[180px] rounded border border-zinc-850 font-mono text-[10px] text-zinc-400 overflow-y-auto overflow-x-hidden leading-relaxed scrollbar-thin">
              {isAnalysisLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-2">
                  <span className="animate-ping w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Executing macro-yield computation thread (paying 0.50 CSPR x402 fee)...</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{analysisText || `// CASPER AUTONOMOUX COGNITION CORE
// Status: Awaiting launch execution
// Cost: 0.50 CSPR per call

To run real-time market analysis and yield modeling backed by Gemini-3.5-flash processing: Click 'REQUEST SWARM EVAL' below. `}</div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => onRunOptimizationAnalysis("defi")}
              disabled={isAnalysisLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1 font-mono"
            >
              REQUEST SWARM EVAL (0.50 CSPR via x402)
            </button>
            <p className="text-[9px] text-zinc-500 text-center mt-1.5 font-mono">Signed autonomously using your delegated wallet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
