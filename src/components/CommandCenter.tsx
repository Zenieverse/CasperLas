/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Agent, TaskWorkflow, MicropaymentStream } from "../types";
import NetworkGraph from "./NetworkGraph";
import { Activity, Play, CheckCircle2, ChevronRight, Settings, Radio, HelpCircle, ArrowRightLeft } from "lucide-react";

interface CommandCenterProps {
  agents: Agent[];
  workflows: TaskWorkflow[];
  micropayments: MicropaymentStream[];
  onTriggerWorkflow: (workflowId: string) => void;
  selectedAgentId?: string | null;
  onSelectAgentId: (id: string) => void;
}

export default function CommandCenter({
  agents,
  workflows,
  micropayments,
  onTriggerWorkflow,
  selectedAgentId,
  onSelectAgentId
}: CommandCenterProps) {
  const [activeTab, setActiveTab] = useState<"graph" | "logs">("graph");
  const [tickerMsg, setTickerMsg] = useState("Agent orchestration channels operational. Syncing Casper block state #4851219...");

  const yieldWorkflow = workflows.find(wf => wf.id === "wf-yield-opt");
  const isRunning = yieldWorkflow?.status === "running";

  // Rotate simulated network state messages
  useEffect(() => {
    const messages = [
      "Securing RWA carbon credentials validator attestations on Belgium Node.",
      "Astra Risk agent purchased high APY risk slippage modeling via x402 stream.",
      "Smart contract registered in Casper Testnet: odra_agent_registry.wasm",
      "Consensus swarm triggered debate on proposal #104: APPROVED.",
      "Wallet CSPR.click balance active: 10,000 CSPR registered."
    ];
    let idx = 0;
    const interval = setInterval(() => {
      setTickerMsg(messages[idx]);
      idx = (idx + 1) % messages.length;
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="command-center-module" className="bg-zinc-950/60 rounded-xl p-5 border border-zinc-800/80">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            Casper Autonomic Command Center
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Observe live interaction feeds and state synchronization tunnels between deployed Casper Agents.</p>
        </div>

        <div className="flex bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-[10px] font-mono">
          <button
            onClick={() => setActiveTab("graph")}
            className={`px-3 py-1 rounded transition-colors ${activeTab === "graph" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            LIVE GRAPH
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-3 py-1 rounded transition-colors ${activeTab === "logs" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            LEDGER LOGS
          </button>
        </div>
      </div>

      {/* Real-time Ticker */}
      <div className="bg-zinc-900/90 border border-zinc-850 px-3 py-2 rounded-lg mb-5 flex items-center gap-2.5 font-mono text-[10px]">
        <span className="bg-emerald-400/10 text-emerald-400 px-1.5 py-0.5 rounded text-[8px] tracking-widest font-black uppercase">FEED</span>
        <span className="text-zinc-300 truncate tracking-wide animate-fade-in">{tickerMsg}</span>
      </div>

      {/* Main Orchestration Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Graph display */}
        <div className="xl:col-span-2">
          {activeTab === "graph" ? (
            <NetworkGraph activeAgentId={selectedAgentId} onSelectAgent={onSelectAgentId} />
          ) : (
            <div className="bg-zinc-900/80 rounded-xl p-4 border border-zinc-800/80 h-[320px] overflow-y-auto font-mono text-[10.5px]">
              <div className="border-b border-zinc-800 pb-2 mb-3 flex justify-between items-center text-zinc-500">
                <span>CASPER MICRO-TRANSACTION EVENTS</span>
                <span className="text-[9px]">x402 STATE</span>
              </div>
              <div className="space-y-3">
                {micropayments.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-start hover:bg-zinc-900 p-1.5 rounded transition-colors border-l-2 border-emerald-500">
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-emerald-400 font-semibold">{tx.fromAgentName}</span>
                        <ChevronRight className="w-3 h-3 text-zinc-600" />
                        <span className="text-blue-400">{tx.toAgentName}</span>
                      </div>
                      <p className="text-zinc-400 mt-0.5 text-[9.5px]">{tx.purpose}</p>
                      <p className="text-zinc-600 text-[8.5px]">Hash: {tx.txHash}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 font-medium">{tx.amountCspr} CSPR</span>
                      <p className="text-zinc-500 text-[8px]">{tx.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Workflow task state list */}
        <div className="bg-zinc-900/40 rounded-xl p-4 border border-zinc-800/80 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">Agent Workflows</h3>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="space-y-3.5">
              {workflows.map((wf) => (
                <div key={wf.id} className="p-3 bg-zinc-900/95 rounded-lg border border-zinc-850">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-xs font-medium text-white">{wf.title}</h4>
                      <p className="text-[9px] text-zinc-500 font-mono">ID: {wf.id}</p>
                    </div>
                    <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${
                      wf.status === "completed" 
                        ? "bg-green-500/10 text-green-400 border-green-500/20" 
                        : wf.status === "running"
                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse"
                        : "bg-zinc-800 text-zinc-500 border-zinc-750"
                    }`}>
                      {wf.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden mb-2.5">
                    <div 
                      className="bg-emerald-400 h-full transition-all duration-500"
                      style={{ width: `${wf.progress}%` }}
                    />
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-1.5">
                    {wf.steps.map((step) => (
                      <div key={step.id} className="flex justify-between items-center text-[9px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className={`w-3 h-3 ${step.status === "completed" ? "text-emerald-400" : "text-zinc-650"}`} />
                          {step.description}
                        </span>
                        <span className="text-zinc-600">{step.costCspr} CSPR</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-805">
            <button
              onClick={() => !isRunning && onTriggerWorkflow("wf-yield-opt")}
              disabled={isRunning}
              className={`w-full font-semibold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 font-mono active:scale-[0.98] ${
                isRunning
                  ? "bg-zinc-900 border border-emerald-500/30 text-emerald-400 cursor-not-allowed cursor-default select-none animate-pulse"
                  : "bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer"
              }`}
            >
              {isRunning ? (
                <>
                  <span className="animate-spin h-3.5 w-3.5 border-2 border-emerald-400 border-t-transparent rounded-full mr-1 shrink-0" />
                  OPTIMIZER ACTIVE ({yieldWorkflow?.progress || 0}%)
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-black shrink-0" />
                  LAUNCH YIELD SYSTEM OPTIMIZER
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
