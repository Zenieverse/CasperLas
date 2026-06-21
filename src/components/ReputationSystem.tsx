/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Agent } from "../types";
import { 
  Award, 
  ShieldCheck, 
  Heart, 
  User, 
  Check, 
  Flame, 
  Trophy, 
  Star, 
  PlusCircle, 
  ThumbsUp, 
  Compass, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  Download
} from "lucide-react";

interface ReputationProps {
  agents: Agent[];
  onEndorse?: (agentId: string, rating: number, comment: string) => void;
}

interface PeerAuditReview {
  id: string;
  agentName: string;
  endorser: string;
  score: number;
  badge: string;
  comment: string;
  blockHash: string;
  timestamp: string;
}

export default function ReputationSystem({ agents, onEndorse }: ReputationProps) {
  // Sort by Trust Score for Leaderboard
  const trustedAgents = [...agents].sort((a, b) => b.trustScore - a.trustScore);
  // Sort by Revenue for top earning
  const topEarningAgents = [...agents].sort((a, b) => b.revenueEarned - a.revenueEarned);

  // Form states
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || "");
  const [selectedBadge, setSelectedBadge] = useState<string>("Verified Agent");
  const [endorserAddress, setEndorserAddress] = useState<string>("0202e85ab9dcdc23190abf29a006c4295bd6b51c...");
  const [reputationRating, setReputationRating] = useState<number>(98);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [lastTxHash, setLastTxHash] = useState<string>("");

  // Local state of recent endorsements to display dynamically in the sidebar
  const [endorsementsList, setEndorsementsList] = useState<PeerAuditReview[]>([
    {
      id: "rev-1",
      agentName: "Astra Risk Guardian",
      endorser: "0203a98befdcbb459a90de09fcba...",
      score: 99,
      badge: "Verified Agent",
      comment: "Risk coverage metric algorithms passed standard multi-epoch volatility checks with zero error.",
      blockHash: "05cb79ae8dfdcba56e9cdbc8de90faee8873dcbba4dbeeb60459cde78a2e37ab",
      timestamp: "10 mins ago"
    },
    {
      id: "rev-2",
      agentName: "EarthRegistry Sentinel",
      endorser: "0202fd98bebbca5239e0da9bcae9...",
      score: 97,
      badge: "RWA Specialist",
      comment: "Successfully resolved carbon offset telemetry validation schedules off Amazon forest data.",
      blockHash: "fec089ae65abfcf87d90e0c9bcadefb789efba5670dc951cf78ffd9a239f8bc2",
      timestamp: "1 hour ago"
    }
  ]);

  const handleRegisterEndorsement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentId) return;

    setIsSubmitting(true);
    const targetAgent = agents.find(a => a.id === selectedAgentId);
    if (!targetAgent) {
      setIsSubmitting(false);
      return;
    }

    // Generate random mock transaction hash for Casper Network
    const mockHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    
    setTimeout(() => {
      const newReview: PeerAuditReview = {
        id: `rev-${Date.now()}`,
        agentName: targetAgent.name,
        endorser: endorserAddress.substring(0, 24) + "...",
        score: reputationRating,
        badge: selectedBadge,
        comment: comment || `Dynamic peer evaluation endorsed with index score ${reputationRating}%.`,
        blockHash: mockHash,
        timestamp: "Just now"
      };

      setEndorsementsList(prev => [newReview, ...prev]);
      setLastTxHash(mockHash);
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setComment("");

      // Trigger callback if defined
      if (onEndorse) {
        onEndorse(selectedAgentId, reputationRating, comment);
      }

      setTimeout(() => setShowSuccessToast(false), 5000);
    }, 1500);
  };

  const handleDownloadCSV = () => {
    const lines: string[] = [];

    // Header 1: Agent Performance Metrics
    lines.push("=== AGENT PERFORMANCE METRICS ===");
    lines.push("Agent ID,Name,Role,Trust Score (%),Uptime (%),Historical Accuracy (%),Successful Transactions,Revenue Earned (CSPR),Wallet Address");
    
    agents.forEach(agent => {
      const row = [
        agent.id,
        `"${(agent.name || "").replace(/"/g, '""')}"`,
        `"${(agent.role || "").replace(/"/g, '""')}"`,
        agent.trustScore,
        agent.uptime,
        agent.historicalAccuracy,
        agent.successfulTransactions,
        agent.revenueEarned,
        agent.walletAddress
      ].join(",");
      lines.push(row);
    });

    lines.push(""); // empty spacing spacer

    // Header 2: Trust history / peer certifications
    lines.push("=== CRYPTOGRAPHIC REPUTATION TRUST HISTORY & ATTESTATIONS ===");
    lines.push("Attestation ID,Target Agent Name,Certified Badge,Validator Score (%),Comments & Certifications,Block Hash,Timestamp,Endorser Address");
    
    endorsementsList.forEach(item => {
      const row = [
        item.id,
        `"${(item.agentName || "").replace(/"/g, '""')}"`,
        `"${(item.badge || "").replace(/"/g, '""')}"`,
        item.score,
        `"${(item.comment || "").replace(/"/g, '""')}"`,
        item.blockHash,
        `"${(item.timestamp || "").replace(/"/g, '""')}"`,
        item.endorser
      ].join(",");
      lines.push(row);
    });

    const csvContent = lines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `casper_agent_reputation_matrix_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="reputation-module" className="bg-zinc-950/60 rounded-xl p-5 border border-zinc-800/80">
      
      {/* Module header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500 animate-pulse" />
            Universal Agent Reputation Registry
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Proof-of-Reputation indexes calculated off validator stats, peer certifications, and historical settlement accuracy.
          </p>
        </div>
        <button
          onClick={handleDownloadCSV}
          id="reputation-download-csv-btn"
          className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-lg px-3 py-1.5 font-mono text-[11px] font-bold tracking-tight transition-all active:scale-95 flex items-center gap-2 shadow-lg cursor-pointer self-start md:self-auto shrink-0"
          title="Download Reputation Dataset CSV"
        >
          <Download className="w-3.5 h-3.5 text-pink-500" />
          <span>DOWNLOAD DATASET (CSV)</span>
        </button>
      </div>

      {/* Leaderboards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        
        {/* Most Trusted Leaderboard */}
        <div className="bg-zinc-900/40 p-4 border border-zinc-850 rounded-xl">
          <h3 className="text-xs font-semibold uppercase font-mono tracking-wider text-zinc-350 mb-3 flex items-center gap-1.5 border-b border-zinc-805 pb-2">
            <Star className="w-4 h-4 text-emerald-400" /> TOP RATED TRUST LEADERS
          </h3>
          <div className="space-y-2.5">
            {trustedAgents.slice(0, 3).map((agent, index) => (
              <div key={agent.id} className="flex justify-between items-center bg-zinc-900/60 p-3 rounded-lg border border-zinc-850 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold font-mono text-zinc-500">#{index + 1}</span>
                  <div>
                    <h4 className="text-xs font-medium text-white">{agent.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-mono italic leading-none mt-0.5">{agent.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 font-mono">{agent.trustScore}%</span>
                  <div className="text-[8px] text-zinc-500 uppercase tracking-wide font-mono">REPUTATION SCORE</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highest Earning Leaderboard */}
        <div className="bg-zinc-900/40 p-4 border border-zinc-850 rounded-xl">
          <h3 className="text-xs font-semibold uppercase font-mono tracking-wider text-zinc-350 mb-3 flex items-center gap-1.5 border-b border-zinc-805 pb-2">
            <Flame className="w-4 h-4 text-amber-500" /> TOP REVENUE EARNING SWARMS
          </h3>
          <div className="space-y-2.5">
            {topEarningAgents.slice(0, 3).map((agent, index) => (
              <div key={agent.id} className="flex justify-between items-center bg-zinc-900/60 p-3 rounded-lg border border-zinc-850 hover:border-amber-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold font-mono text-zinc-500">#{index + 1}</span>
                  <div>
                    <h4 className="text-xs font-medium text-white">{agent.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-mono italic leading-none mt-0.5">{agent.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400 font-mono">{(agent.revenueEarned).toLocaleString()} CSPR</span>
                  <div className="text-[8px] text-zinc-500 uppercase tracking-wide font-mono">REVENUE EARNED</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Peer-Endorsements & Onchain Logger Interactivity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        
        {/* Certificate Endorsement Form */}
        <div className="lg:col-span-1 bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl">
          <h3 className="text-xs font-semibold uppercase font-mono tracking-wider text-zinc-300 mb-2 pb-2 border-b border-zinc-805 flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-pink-500" /> Endorse Agent Core
          </h3>
          <p className="text-[10px] text-zinc-400 mb-3 leading-normal font-sans">
            Write cryptographic peer evaluations directly on the Casper reputation smart contract WASM.
          </p>

          <form onSubmit={handleRegisterEndorsement} className="space-y-3 font-mono text-[10.5px]">
            <div>
              <label className="block text-[8px] text-zinc-500 uppercase mb-1">Target Agent to Certify</label>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1.5 text-zinc-300 outline-none focus:border-pink-500"
              >
                {agents.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[8px] text-zinc-500 uppercase mb-1">Certificate Badge</label>
                <select
                  value={selectedBadge}
                  onChange={(e) => setSelectedBadge(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 outline-none focus:border-pink-500"
                >
                  <option value="Verified Agent">Verified Agent</option>
                  <option value="Governance Expert">Governance Expert</option>
                  <option value="RWA Specialist">RWA Specialist</option>
                  <option value="Treasury Master">Treasury Master</option>
                </select>
              </div>
              <div>
                <label className="block text-[8px] text-zinc-500 uppercase mb-1">Rating Score ({reputationRating}%)</label>
                <input 
                  type="range"
                  min="50"
                  max="100"
                  value={reputationRating}
                  onChange={(e) => setReputationRating(Number(e.target.value))}
                  className="w-full accent-pink-500 mt-2.5 cursor-pointer bg-zinc-850 h-1 rounded-lg appearance-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[8px] text-zinc-500 uppercase mb-1">Signed Validator Origin Address</label>
              <input
                type="text"
                disabled
                value={endorserAddress}
                className="w-full bg-zinc-950/70 border border-zinc-850 rounded px-2 py-1.5 text-zinc-500 select-all font-mono text-[9.5px] cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[8px] text-zinc-500 uppercase mb-1">Add Audit Comments & Proofs</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ex: Multi-chain arbitrage transactions verified successfully."
                rows={2}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-300 outline-none focus:border-pink-500 resize-none font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 rounded font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                isSubmitting
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-600/10"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping"></span>
                  <span>RECORDING ON CASPER...</span>
                </>
              ) : (
                <>
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>PUBLISH ATTESTATION (WASM)</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Attestation Logs Feed */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-zinc-805 pb-2 mb-3">
              <h3 className="text-xs font-semibold uppercase font-mono tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-pink-400 animate-spin" /> LIVE REPUTATION INDEX ATTESTATION LOGS
              </h3>
              <span className="bg-zinc-800 text-[8px] px-1.5 py-0.5 font-mono text-zinc-400 border border-zinc-700/60 rounded">
                CASPER TESTNET FEED
              </span>
            </div>

            {showSuccessToast && (
              <div className="mb-3 px-3 py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] rounded-lg font-mono flex flex-col gap-1 animate-fade-in">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>REPUTATION DEED SUCCESSFULLY COMMITTED</span>
                </div>
                <span className="text-[8px] text-emerald-500 truncate block select-all">TX HASH: {lastTxHash}</span>
              </div>
            )}

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {endorsementsList.map((item, index) => (
                <div key={item.id || index} className="p-3 bg-zinc-950 rounded-lg border border-zinc-850 hover:border-zinc-800 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 mb-2 font-mono text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-pink-500/10 text-pink-400 px-1.5 py-0.5 rounded border border-pink-500/15 font-bold text-[8.5px] uppercase">
                        {item.badge}
                      </span>
                      <span className="text-white font-semibold">{item.agentName}</span>
                    </div>

                    <div className="text-zinc-500 text-[9px] flex items-center gap-1">
                      <span>{item.timestamp}</span>
                      <span>&bull;</span>
                      <span className="text-emerald-400 font-bold">Passed (Score: {item.score}%)</span>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-zinc-400 leading-relaxed italic">{item.comment}</p>
                  
                  <div className="mt-2 pt-1.5 border-t border-zinc-900 flex justify-between items-center font-mono text-[8px] text-zinc-500 select-all">
                    <span>ENDORSER: {item.endorser}</span>
                    <span className="truncate max-w-[150px] text-right">HASH: {item.blockHash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-2.5 bg-yellow-500/5 text-yellow-500/80 rounded border border-yellow-550/15 text-[9.5px] font-mono leading-tight">
            <span>Warning: Endorsement fraud or manipulation of trust rating vectors is penalized by automated slash of delegated staking rewards inside Odra marketplace policies.</span>
          </div>
        </div>

      </div>

      {/* Economic Badge Allocations footer stats */}
      <div className="bg-zinc-900/20 rounded-xl p-4 border border-zinc-850">
        <h3 className="text-xs font-semibold text-zinc-300 font-mono uppercase mb-3 tracking-wide">
          Economic Badge Allocations (Verified Odra Assertions)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { tag: "Verified Agent", color: "border-green-500/30 bg-green-500/5 text-green-400", desc: "Successfully resolved 1,000+ consensus micro-transactions without conflict." },
            { tag: "Governance Expert", color: "border-amber-500/30 bg-amber-500/5 text-amber-400", desc: "Submitted 50+ compliance-approved onchain votes in the Consensus Arena." },
            { tag: "RWA Specialist", color: "border-pink-500/30 bg-pink-500/5 text-pink-400", desc: "Secured physical audits for Green Carbon validation or real estate deeds." },
            { tag: "Treasury Master", color: "border-blue-500/30 bg-blue-500/5 text-blue-400", desc: "Delivered >15% APY yield optimizations dynamically across staking protocols." }
          ].map((bdg, idx) => (
            <div key={idx} className={`p-3 rounded-lg border text-center ${bdg.color} flex flex-col items-center justify-between`}>
              <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center mb-1.5">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-[10.5px] font-bold tracking-tight font-mono mb-1">{bdg.tag}</span>
              <p className="text-[9px] text-zinc-500 leading-normal font-sans">{bdg.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
