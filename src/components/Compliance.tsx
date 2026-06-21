/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ComplianceCredential } from "../types";
import { ShieldAlert, Fingerprint, Search, Lock, UserCheck, AlertTriangle, ArrowRight, ShieldCheck, Check } from "lucide-react";

interface ComplianceProps {
  credentials: ComplianceCredential[];
  onIssueCredential: (level: string, subjectName: string) => void;
}

export default function Compliance({ credentials, onIssueCredential }: ComplianceProps) {
  const [subjectInput, setSubjectInput] = useState("");
  const [levelInput, setLevelInput] = useState<"KYC_Tier_1" | "KYC_Tier_2" | "AML_Pass" | "Sanction_Clear">("KYC_Tier_1");
  const [searchQuery, setSearchQuery] = useState("");

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (subjectInput) {
      onIssueCredential(levelInput, subjectInput);
      setSubjectInput("");
    }
  };

  const filteredCredentials = credentials.filter(
    c => c.subjectAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
         c.verificationLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="compliance-module" className="bg-zinc-950/60 rounded-xl p-5 border border-zinc-800/80">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-emerald-400" />
            Compliance &amp; Verification Vault
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Continuous on-chain sanctions screening, KYC compliance scoring, and zero-knowledge privacy assertions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Issue Credential Form */}
        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 flex flex-col justify-between">
          <form onSubmit={handleIssue} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">Issue Secure AML/KYC Assertion</h3>
            
            <div className="space-y-1">
              <label className="block text-[9px] text-zinc-500 uppercase font-mono">Agent Identity / Wallet (CSPR Public Key)</label>
              <input
                type="text"
                required
                placeholder="e.g., 0203f1692ae829b359f1165a..."
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                className="w-full bg-zinc-950 text-xs text-white border border-zinc-800 px-3 py-2 rounded focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] text-zinc-500 uppercase font-mono">Verification Standard Level</label>
              <select
                value={levelInput}
                onChange={(e) => setLevelInput(e.target.value as any)}
                className="w-full bg-zinc-950 text-xs text-white border border-zinc-800 px-3 py-2 rounded focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="KYC_Tier_1">KYC Tier 1 (Self Attested Entity)</option>
                <option value="KYC_Tier_2">KYC Tier 2 (Government Verified Passport State)</option>
                <option value="AML_Pass">AML Pass Screening (Transaction Chain Approved)</option>
                <option value="Sanction_Clear">Sanctions Cleared (Continuous Match Check)</option>
              </select>
            </div>

            <div className="p-3 bg-zinc-950 rounded border border-zinc-900 flex items-start gap-2 text-[10px] text-zinc-400 leading-relaxed font-sans">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Compliant with FATF Travel Rule guidelines. Verification records are encrypted using zk-Proof techniques to maintain sovereign agent financial anonymity.</span>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs py-2 rounded transition-all font-mono"
            >
              GENERATE CRYPTOGRAPHIC CREDENTIAL
            </button>
          </form>
        </div>

        {/* Issued Credentials Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search compliance logs by address / standard..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/40 text-xs text-white pl-9 pr-4 py-2 rounded border border-zinc-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl overflow-hidden">
            <div className="grid grid-cols-4 gap-2 bg-zinc-950/80 p-2.5 text-[9px] uppercase tracking-wider font-semibold font-mono text-zinc-500 border-b border-zinc-855">
              <span>Verified Entity Address</span>
              <span>Verification Level</span>
              <span>Audit Compliance Score</span>
              <span className="text-right">Issued Status</span>
            </div>

            <div className="divide-y divide-zinc-850 max-h-[220px] overflow-y-auto">
              {filteredCredentials.map((cred) => (
                <div key={cred.id} className="grid grid-cols-4 gap-2 p-2.5 text-xs font-mono text-zinc-400 hover:bg-zinc-900/30 items-center">
                  <span className="truncate select-all" title={cred.subjectAddress}>{cred.subjectAddress}</span>
                  <span className="text-[10px] font-bold text-teal-400">{cred.verificationLevel}</span>
                  <span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${cred.score > 90 ? "bg-emerald-500" : "bg-amber-500"}`}
                          style={{ width: `${cred.score}%` }}
                        />
                      </div>
                      <span className="text-[9.5px]">{cred.score}%</span>
                    </div>
                  </span>
                  <span className="text-right flex items-center justify-end gap-1 font-semibold text-emerald-400 text-[10px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {cred.status}
                  </span>
                </div>
              ))}

              {filteredCredentials.length === 0 && (
                <div className="text-center py-6 text-zinc-500 text-xs font-mono">No matching crypto credentials in Registry.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
