/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Agent } from "../types";
import { Shield, Sparkles, Award, TrendingUp, Search, Pocket, UserCheck, AlertCircle } from "lucide-react";

interface MarketplaceProps {
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
  selectedAgentId?: string | null;
  onExecuteAgentTask?: (agent: Agent, taskName: string, cost: number) => void;
}

export default function Marketplace({ agents, onSelectAgent, selectedAgentId, onExecuteAgentTask }: MarketplaceProps) {
  const [search, setSearch] = useState("");
  const [filterBadge, setFilterBadge] = useState<string | null>(null);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(search.toLowerCase()) || 
                          agent.description.toLowerCase().includes(search.toLowerCase()) ||
                          agent.role.toLowerCase().includes(search.toLowerCase());
    const matchesBadge = !filterBadge || agent.badges.includes(filterBadge);
    return matchesSearch && matchesBadge;
  });

  return (
    <div id="marketplace-component" className="bg-zinc-950/60 rounded-xl p-5 border border-zinc-800/80">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-400" />
            Casper Agent Marketplace
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Scale decentralized compute by delegating mission-critical tasks to sovereign AI agents.</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {["All", "Verified Agent", "Governance Expert", "RWA Specialist", "Treasury Master"].map((badge) => (
            <button
              key={badge}
              onClick={() => setFilterBadge(badge === "All" ? null : badge)}
              className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all ${
                (badge === "All" && !filterBadge) || filterBadge === badge
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {badge}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Search agent capabilities, workflows, contract modules..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900/90 text-xs text-white pl-9 pr-4 py-2.5 rounded-lg border border-zinc-850 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredAgents.map((agent) => {
          const isSelected = selectedAgentId === agent.id;
          return (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent)}
              className={`group relative p-4 rounded-xl transition-all cursor-pointer border ${
                isSelected 
                  ? "bg-zinc-900 border-green-500 shadow-lg shadow-green-500/5" 
                  : "bg-zinc-900/45 hover:bg-zinc-900/80 border-zinc-850 hover:border-zinc-700"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-zinc-800/80 text-green-400 group-hover:scale-105 transition-transform">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-medium text-white">{agent.name}</h3>
                      {agent.isVerified && (
                        <span className="bg-green-500/10 text-green-400 text-[8px] font-mono px-1 rounded border border-green-500/20">
                          VERIFIED
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-400 font-mono">{agent.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold text-green-400 font-mono">
                    {agent.trustScore}%
                  </div>
                  <div className="text-[9px] text-zinc-500 font-mono">Reputation Score</div>
                </div>
              </div>

              <p className="text-xs text-zinc-400 mt-2.5 mb-3.5 line-clamp-2">
                {agent.description}
              </p>

              {/* Badges/Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {agent.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="bg-zinc-950 text-zinc-400 font-mono text-[9px] px-2 py-0.5 rounded border border-zinc-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Stats Block */}
              <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-zinc-950/80 border border-zinc-850 text-center font-mono">
                <div>
                  <span className="block text-[8px] text-zinc-500">REVENUE EARNED</span>
                  <span className="text-[10px] font-medium text-white text-emerald-400">
                    {agent.revenueEarned.toLocaleString()} CSPR
                  </span>
                </div>
                <div>
                  <span className="block text-[8px] text-zinc-500">UPTIME RANGE</span>
                  <span className="text-[10px] font-medium text-white">{agent.uptime}%</span>
                </div>
                <div>
                  <span className="block text-[8px] text-zinc-500">JOBS COMPLETED</span>
                  <span className="text-[10px] font-medium text-white">{agent.successfulTransactions}</span>
                </div>
              </div>

              {/* Actions */}
              {onExecuteAgentTask && (
                <div className="mt-4 pt-3 border-t border-zinc-850 flex justify-between items-center gap-2">
                  <span className="text-[9px] font-mono text-zinc-500 flex items-center gap-1">
                    <Pocket className="w-3 h-3" />
                     Stream rate: {(agent.revenueEarned > 200000 ? 0.95 : 0.45)} CSPR / service
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const serviceVal = agent.revenueEarned > 200000 ? 0.95 : 0.45;
                      onExecuteAgentTask(agent, `Autonomous audit check`, serviceVal);
                    }}
                    className="bg-green-500 hover:bg-green-400 text-black font-semibold text-[10px] px-2.5 py-1 rounded transition-colors font-mono"
                  >
                    RECRUIT AGENT
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filteredAgents.length === 0 && (
          <div className="col-span-2 text-center py-8 bg-zinc-900/10 rounded border border-dashed border-zinc-800">
            <AlertCircle className="w-6 h-6 text-zinc-500 mx-auto mb-2" />
            <p className="text-zinc-500 text-xs font-mono">No matching Casper Agents found in Marketplace.</p>
          </div>
        )}
      </div>
    </div>
  );
}
