/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GovernanceProposal, Agent } from "../types";
import { Scale, Heart, AlertCircle, HelpCircle, Check, ThumbsUp, ThumbsDown, User, Play, Clock } from "lucide-react";

interface GovernanceProps {
  proposals: GovernanceProposal[];
  agents: Agent[];
  isAnalysisLoading: boolean;
  onVoteProposal: (id: string, stance: "for" | "against") => void;
  onTriggerSwarmDebate: (id: string) => void;
  onNewProposal: (title: string, description: string, budget: number) => void;
  debateResponses: Record<string, string>;
}

export default function Governance({
  proposals,
  agents,
  isAnalysisLoading,
  onVoteProposal,
  onTriggerSwarmDebate,
  onNewProposal,
  debateResponses
}: GovernanceProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const b = parseFloat(newBudget);
    if (newTitle && newDesc && !isNaN(b)) {
      onNewProposal(newTitle, newDesc, b);
      setNewTitle("");
      setNewDesc("");
      setNewBudget("");
      setShowSubmitModal(false);
    }
  };

  return (
    <div id="governance-swarm-module" className="bg-zinc-950/60 rounded-xl p-5 border border-zinc-800/80">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-500" />
            Decentralized Governance Swarm
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Let specialized autonomous agents debate risk exposure, treasury health, and compliance frameworks to reach consensus.</p>
        </div>

        <button
          onClick={() => setShowSubmitModal(!showSubmitModal)}
          className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs px-3.5 py-1.5 rounded transition-all font-mono self-start"
        >
          {showSubmitModal ? "CLOSE SUBMIT PANEL" : "SUBMIT NEW PROPOSAL"}
        </button>
      </div>

      {showSubmitModal && (
        <form onSubmit={handleSubmit} className="mb-6 bg-zinc-900/90 border border-zinc-800 rounded-lg p-4 space-y-3.5 max-w-xl">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">Create On-Chain Governance Proposal</h4>
          
          <div className="space-y-1">
            <label className="block text-[10px] text-zinc-500 uppercase font-mono">Proposal Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Treasury Investment #105: Anchor Liquid Staking"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-zinc-950 text-xs text-white border border-zinc-800 px-3 py-2 rounded focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] text-zinc-400 uppercase font-mono">Target Budget Allocation (CSPR)</label>
            <input
              type="number"
              required
              placeholder="e.g., 250000"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="w-full bg-zinc-950 text-xs text-white border border-zinc-800 px-3 py-2 rounded focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] text-zinc-400 uppercase font-mono">Execution Details</label>
            <textarea
              required
              placeholder="Formulate the execution criteria that agents will scan during on-chain debate..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={3}
              className="w-full bg-zinc-950 text-xs text-white border border-zinc-800 px-3 py-2 rounded focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs px-4 py-2 rounded transition-all font-mono"
          >
            TRANSMIT TO CASPER REGISTRY
          </button>
        </form>
      )}

      {/* Main Governance Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Proposals List */}
        <div className="lg:col-span-1 space-y-3.5">
          {proposals.map((prop) => (
            <div key={prop.id} className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-850 hover:border-zinc-750 transition-all">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[9px] font-mono text-zinc-500">PROP ID: {prop.id}</span>
                <span className={`text-[8px] font-mono px-2 py-0.5 rounded ${
                  prop.status === "Active Debate" 
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/15" 
                    : "bg-green-500/10 text-green-400 border border-green-550/15"
                }`}>
                  {prop.status}
                </span>
              </div>

              <h3 className="text-xs font-semibold text-white tracking-tight leading-relaxed">{prop.title}</h3>
              <p className="text-[10px] text-emerald-400 font-mono mt-1 mb-3">Allocating: {prop.amountCspr.toLocaleString()} CSPR</p>

              {/* Vote Indicators */}
              <div className="grid grid-cols-2 gap-3 p-2 bg-zinc-950 rounded border border-zinc-850 text-center font-mono">
                <div>
                  <span className="block text-[8px] text-zinc-500">VOTES FOR</span>
                  <span className="text-[10px] text-emerald-500 font-semibold">{(prop.votesFor).toLocaleString()}</span>
                </div>
                <div>
                  <span className="block text-[8px] text-zinc-500">VOTES AGAINST</span>
                  <span className="text-[10px] text-red-500">{(prop.votesAgainst).toLocaleString()}</span>
                </div>
              </div>

              {/* Human voting override */}
              <div className="flex gap-2.5 mt-3.5 pt-3.5 border-t border-zinc-850 justify-between items-center">
                <span className="text-[9.5px] text-zinc-500 font-mono">VOTE AS VALIDATOR:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onVoteProposal(prop.id, "for")}
                    className="p-1 px-2.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 text-[9px] font-mono font-bold rounded border border-green-500/20 transition-all flex items-center gap-1"
                  >
                    <ThumbsUp className="w-2.5 h-2.5" /> FOR
                  </button>
                  <button
                    onClick={() => onVoteProposal(prop.id, "against")}
                    className="p-1 px-2.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-[9px] font-mono font-bold rounded border border-red-500/20 transition-all flex items-center gap-1"
                  >
                    <ThumbsDown className="w-2.5 h-2.5" /> AGAINST
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Proposal Debate Arena */}
        <div className="lg:col-span-2 bg-zinc-900/90 p-4 rounded-xl border border-zinc-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-zinc-805 text-amber-500">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Consensus Debate Arena</h4>
                  <p className="text-[9.5px] font-mono text-zinc-500">Sovereign multi-agent simulation for on-chain Odra compliance verification.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
                <span className="text-[9px] text-zinc-500 font-mono">DEBATE LOOP ACTIVE</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mb-4 bg-zinc-950/80 p-3.5 rounded border border-zinc-850 font-mono">
              <span className="text-zinc-500 block text-[9px] uppercase tracking-wide mb-1 flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> Executive Order Proposal Text</span>
              {proposals[0]?.description}
            </p>

            {/* Simulated Consensus Speech Bubbles */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {proposals[0]?.swarmDebate.map((chat, idx) => (
                <div key={idx} className="flex gap-2.5 items-start p-2.5 bg-zinc-950/40 rounded border border-zinc-850">
                  <div className={`p-1.5 rounded-lg text-white font-mono text-[10px] font-bold ${
                    chat.role === "Risk" 
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : chat.role === "Treasury"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : chat.role === "Economic"
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : chat.role === "Legal"
                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {chat.role[0]}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[10px] font-bold text-white font-mono">{chat.agentName} <span className="text-[8px] text-zinc-500 font-normal font-sans">({chat.role} Agent)</span></span>
                      <span className={`text-[8px] font-mono font-semibold uppercase ${
                        chat.stance === "support" 
                          ? "text-emerald-400" 
                          : chat.stance === "object"
                          ? "text-red-400"
                          : "text-zinc-500"
                      }`}>{chat.stance}</span>
                    </div>
                    <p className="text-[10.5px] text-zinc-400 font-sans italic leading-relaxed">"{chat.comment}"</p>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Custom debate response */}
            {debateResponses[proposals[0]?.id] && (
              <div className="mt-4 p-3 bg-zinc-950 rounded border border-amber-500/20 text-zinc-300 text-[10.5px] font-mono leading-relaxed max-h-[140px] overflow-y-auto">
                <span className="text-[8px] text-amber-400 block font-bold mb-1">DECISION REASONING INTEGRATED BY REASONING ENGINE (GEMINI-3.5-FLASH)</span>
                {debateResponses[proposals[0]?.id]}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-805 flex justify-between items-center">
            <p className="text-[9px] text-zinc-500 font-mono">Consensus State: Pass (4 Support, 1 Obstruct, 0 Abstain)</p>
            <button
              onClick={() => onTriggerSwarmDebate(proposals[0]?.id)}
              disabled={isAnalysisLoading}
              className="bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-650 text-black font-semibold text-xs px-4 py-2 rounded font-mono transition-all flex items-center gap-1"
            >
              <Play className="w-3 h-3 fill-black" /> TRIGGER AI SWARM DEBATE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
