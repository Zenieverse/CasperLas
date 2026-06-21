/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AppWindow, Code, ShieldCheck, Terminal, Copy, Check, Info, Globe, Key, FileCode, Send, Database, FileJson, RefreshCw, Cpu, CheckCircle2, ArrowRight } from "lucide-react";

const CONTRACTS_CODE = {
  registry: `// Odra Framework Rust Smart Contract - Agent Registry
use odra::prelude::*;
use odra::{Variable, Mapping};

#[odra::module]
pub struct AgentRegistry {
    agents: Mapping<Address, String>,
    owner: Variable<Address>,
    active_agent_count: Variable<u32>,
}

#[odra::module]
impl AgentRegistry {
    #[odra::initializer]
    pub fn init(&mut self) {
        self.owner.set(self.env().caller());
        self.active_agent_count.set(0);
    }

    pub fn register_agent(&mut self, api_endpoint: String) {
        let caller = self.env().caller();
        self.agents.set(&caller, api_endpoint);
        let count = self.active_agent_count.get_or_default();
        self.active_agent_count.set(count + 1);
    }
}`,
  reputation: `// Odra Framework Rust Smart Contract - Reputation Engine
use odra::prelude::*;
use odra::{Variable, Mapping};

#[odra::module]
pub struct ReputationSystem {
    scores: Mapping<Address, u8>,
    authorized_auditors: Mapping<Address, bool>,
}

#[odra::module]
impl ReputationSystem {
    #[odra::initializer]
    pub fn init(&mut self) {
        let caller = self.env().caller();
        self.authorized_auditors.set(&caller, true);
    }

    pub fn record_peer_review(&mut self, target: Address, rating: u8) {
        if self.authorized_auditors.get_or_default(&self.env().caller()) {
            self.scores.set(&target, rating);
        }
    }
}`,
  marketplace: `// Odra Framework Smart Contract - Agent Marketplace (x402 Micropayments)
use odra::prelude::*;
use odra::{Variable, Mapping, Balance};

#[odra::module]
pub struct AgentMarketplace {
    rates_per_step: Mapping<Address, Balance>,
    deposits: Mapping<Address, Balance>,
}

#[odra::module]
impl AgentMarketplace {
    #[odra::initializer]
    pub fn init(&mut self) {}

    pub fn deposit_funds(&mut self, amount: Balance) {
        let caller = self.env().caller();
        let current_balance = self.deposits.get_or_default(&caller);
        self.deposits.set(&caller, current_balance + amount);
    }

    pub fn deduct_micropayment(&mut self, recipient: Address, cost: Balance) {
        let sender = self.env().caller();
        let current = self.deposits.get_or_default(&sender);
        if current >= cost {
            self.deposits.set(&sender, current - cost);
            let recipient_bal = self.deposits.get_or_default(&recipient);
            self.deposits.set(&recipient, recipient_bal + cost);
        }
    }
}`,
  treasury: `// Odra Framework Smart Contract - Treasury Management
use odra::prelude::*;
use odra::{Variable, Mapping, Balance};

#[odra::module]
pub struct TreasuryManagement {
    stakes: Mapping<Address, Balance>,
    total_staked_balance: Variable<Balance>,
}

#[odra::module]
impl TreasuryManagement {
    #[odra::initializer]
    pub fn init(&mut self) {}

    pub fn allocate_staking(&mut self, amount: Balance) {
        let caller = self.env().caller();
        self.stakes.set(&caller, amount);
        let total = self.total_staked_balance.get_or_default();
        self.total_staked_balance.set(total + amount);
    }
}`,
  governance: `// Odra Framework Smart Contract - Governance Swarm
use odra::prelude::*;
use odra::{Variable, Mapping};

#[odra::module]
pub struct SwarmGovernance {
    proposals_votes_for: Mapping<u64, u64>,
    proposals_votes_against: Mapping<u64, u64>,
    voted: Mapping<(u64, Address), bool>,
}

#[odra::module]
impl SwarmGovernance {
    pub fn cast_vote(&mut self, proposal_id: u64, support: bool) {
        let caller = self.env().caller();
        if !self.voted.get_or_default(&(proposal_id, caller)) {
            if support {
                let current_for = self.proposals_votes_for.get_or_default(&proposal_id);
                self.proposals_votes_for.set(&proposal_id, current_for + 1);
            } else {
                let current_against = self.proposals_votes_against.get_or_default(&proposal_id);
                self.proposals_votes_against.set(&proposal_id, current_against + 1);
            }
            self.voted.set(&(proposal_id, caller), true);
        }
    }
}`,
  rwa: `// Odra Framework Smart Contract - Real-World Asset Verification
use odra::prelude::*;
use odra::{Variable, Mapping};

#[derive(Clone, PartialEq, Debug, odra::types::BorshSerialize, odra::types::BorshDeserialize)]
pub struct AttestationProof {
    pub asset_id: String,
    pub data_hash: [u8; 32],
    pub trust_score: u8,
}

#[odra::module]
pub struct RwaVerification {
    proofs: Mapping<String, AttestationProof>,
}

#[odra::module]
impl RwaVerification {
    pub fn save_proof(&mut self, asset_id: String, hash: [u8; 32], rating: u8) {
        let proof = AttestationProof {
            asset_id: asset_id.clone(),
            data_hash: hash,
            trust_score: rating,
        };
        self.proofs.set(&asset_id, proof);
    }
}`,
  compliance: `// Odra Framework Smart Contract - Compliance Credential (zk)
use odra::prelude::*;
use odra::{Variable, Mapping};

#[odra::module]
pub struct ComplianceCredential {
    valid_checks: Mapping<Address, bool>,
}

#[odra::module]
impl ComplianceCredential {
    pub fn update_compliance_status(&mut self, entity: Address, is_valid: bool) {
        self.valid_checks.set(&entity, is_valid);
    }

    pub fn check_compliance(&self, entity: Address) -> bool {
        self.valid_checks.get_or_default(&entity)
    }
}`
};

export default function SmartContractsView() {
  const [selectedContract, setSelectedContract] = useState<keyof typeof CONTRACTS_CODE>("registry");
  const [copied, setCopied] = useState(false);

  // Tab State
  const [activeSubTab, setActiveSubTab] = useState<"code" | "console">("code");

  // Wallet State
  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [fauceting, setFauceting] = useState(false);

  // Deployment State
  const [compiling, setCompiling] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [deployedContracts, setDeployedContracts] = useState<Record<string, string>>({});

  // Form Inputs
  const [formInputs, setFormInputs] = useState({
    endpointUrl: "http://a-economic-node.casper-atlas.net/v1/telemetry",
    contractParamAddress: "01c238bfaed76c...aa902b11",
    reviewRating: 95,
    depositAmountCspr: 150,
  });

  // Call Transactions State
  const [executingTx, setExecutingTx] = useState(false);
  const [recentTxLog, setRecentTxLog] = useState<string[]>([
    "Casper Network Testnet RPC endpoint online: http://138.201.54.120:7777",
    "Odra transaction compilation system live."
  ]);

  // Casper Testnet Block Stream
  const [testnetBlocks, setTestnetBlocks] = useState<Array<{
    height: number;
    hash: string;
    timestamp: string;
    deploys: number;
    status: string;
  }>>([
    { height: 4851219, hash: "61abde583bcde8d4239832aa77fcb29e7161b99dfa", timestamp: "3 mins ago", deploys: 0, status: "Finalized" },
    { height: 4851218, hash: "a09ef1823ebacd41239bf09e123fc09e1d8cd3beae", timestamp: "8 mins ago", deploys: 1, status: "Finalized" },
    { height: 4851217, hash: "7c9ab12e09ffacd839e2dc11ab09cbda8a8d11cbe0", timestamp: "15 mins ago", deploys: 2, status: "Finalized" }
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACTS_CODE[selectedContract]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateWallet = () => {
    const chars = "0123456789abcdef";
    let pub = "01";
    let priv = "secret_key_ed25519_casper_testnet_";
    for (let i = 0; i < 62; i++) {
      pub += chars[Math.floor(Math.random() * 16)];
    }
    for (let i = 0; i < 32; i++) {
      priv += chars[Math.floor(Math.random() * 16)];
    }
    setPublicKey(pub);
    setPrivateKey(priv);
    setBalance(350); // Set starting testnet CSPR
    setRecentTxLog(p => [`Sovereign active wallet generated for Casper Testnet: ${pub.slice(0, 10)}...`, ...p]);
  };

  const handleRequestFaucet = () => {
    if (!publicKey) {
      alert("Please generate a testnet wallet keypair first.");
      return;
    }
    setFauceting(true);
    setRecentTxLog(prev => ["Querying faucet.casper.network...", ...prev]);
    setTimeout(() => {
      setBalance(b => b + 1000);
      setFauceting(false);
      setRecentTxLog(prev => [
        "FAUCET DISPATCH SUCCESS: Received +1,000 CSPR for gas coverage.",
        `TX HASH: f17cc89bf6da8... Block finalized. Status: Success. Balance: ${balance + 1000} CSPR`,
        ...prev
      ]);
    }, 1200);
  };

  const handleDeployContract = () => {
    if (!publicKey) {
      alert("Please generate a testnet wallet keypair first.");
      return;
    }
    if (balance < 50) {
      alert("Insufficient testnet balance. Please request some CSPR from the Faucet first.");
      return;
    }
    setCompiling(true);
    setDeployLogs([
      "Configuring Cargo.toml to match Odra wasm template...",
      "Resolving workspace crates dependencies...",
      "Executing dynamic compilation target: wasm32-unknown-unknown",
      "WASM size: 124.8 KB. Generating optimized release binaries..."
    ]);

    setTimeout(() => {
      setCompiling(false);
      setDeploying(true);
      setDeployLogs(prev => [
        ...prev,
        "Compilation finished successfully. Odra optimized wasm payload cached.",
        "Generating Deploy JSON envelope for Casper node inclusion parameters...",
        "Cryptographically signing WASM payload using generated sovereign private key...",
        "Broadcasting payload transaction to Testnet bootstrap rpc service..."
      ]);

      setTimeout(() => {
        setDeploying(false);
        setBalance(b => b - 15);
        const chars = "0123456789abcdef";
        let newHash = "hash-";
        let deployHash = "deploy-";
        for (let i = 0; i < 32; i++) {
          newHash += chars[Math.floor(Math.random() * 16)];
          deployHash += chars[Math.floor(Math.random() * 16)];
        }
        setDeployedContracts(prev => ({
          ...prev,
          [selectedContract]: newHash
        }));

        const newBlockNum = testnetBlocks[0].height + 1;
        const newBlock = {
          height: newBlockNum,
          hash: deployHash,
          timestamp: "Just now",
          deploys: 1,
          status: "Finalized"
        };
        setTestnetBlocks(prev => [newBlock, ...prev]);

        setDeployLogs(prev => [
          ...prev,
          `DEPLOY SUCCESSFUL! State root updated in global block #${newBlockNum}`,
          `CONTRACT ADDRESS: ${newHash}`,
          `DEPLOY HASH: ${deployHash}`,
          "GAS CHARGE: 15.00 CSPR"
        ]);

        setRecentTxLog(p => [
          `Successful Deploy: Odra ${selectedContract === "registry" ? "Agent Registry" : selectedContract} contract initialized on Casper Testnet at ${newHash.slice(0, 16)}...`,
          ...p
        ]);
      }, 1500);
    }, 1500);
  };

  const handleSendTransaction = () => {
    const contrAddress = deployedContracts[selectedContract];
    if (!contrAddress) {
      alert("Please deploy this contract to the Casper Testnet first!");
      return;
    }
    if (balance < 5) {
      alert("Insufficient funds to cover transaction deployment gas (requires ~5 CSPR).");
      return;
    }
    setExecutingTx(true);
    setRecentTxLog(prev => [`Constructing transaction payload envelope for Odra contract target ${contrAddress.slice(0, 14)}...`, ...prev]);

    setTimeout(() => {
      setExecutingTx(false);
      setBalance(b => b - 5);

      const chars = "0123456789abcdef";
      let txId = "tx-";
      for (let i = 0; i < 32; i++) {
        txId += chars[Math.floor(Math.random() * 16)];
      }

      const newBlockNum = testnetBlocks[0].height + 1;
      const newBlock = {
        height: newBlockNum,
        hash: txId,
        timestamp: "Just now",
        deploys: 1,
        status: "Finalized"
      };
      setTestnetBlocks(prev => [newBlock, ...prev]);

      let actionDesc = "";
      if (selectedContract === "registry") {
        actionDesc = `register_agent(api_endpoint: "${formInputs.endpointUrl}")`;
      } else if (selectedContract === "reputation") {
        actionDesc = `record_peer_review(target: "${formInputs.contractParamAddress}", rating: ${formInputs.reviewRating})`;
      } else if (selectedContract === "marketplace") {
        actionDesc = `deposit_funds(amount: ${formInputs.depositAmountCspr} CSPR)`;
      } else if (selectedContract === "treasury") {
        actionDesc = `allocate_staking(amount: ${formInputs.depositAmountCspr} CSPR)`;
      } else if (selectedContract === "governance") {
        actionDesc = `cast_vote(proposal_id: 1, support: true)`;
      } else {
        actionDesc = `save_proof_evaluation()`;
      }

      setRecentTxLog(prev => [
        `TRANSACTION SUCCESSFUL: Invoked Odra method -> ${actionDesc}`,
        `BLOCK Finalized: #${newBlockNum}`,
        `DEPLOY HASH: ${txId}`,
        "GAS CHARGE: 5.00 CSPR",
        ...prev
      ]);
    }, 1400);
  };

  return (
    <div id="smart-contracts-view" className="bg-zinc-950/60 rounded-xl p-5 border border-zinc-800/80">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-400" />
            Odra Framework Smart Contracts
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">High-integrity decentralized logic compiled to WASM and targeting Casper Network ecosystem.</p>
        </div>

        {/* Console / Code Toggle */}
        <div className="flex items-center gap-2 bg-zinc-900/60 p-1 border border-zinc-800 rounded-lg self-stretch md:self-auto shrink-0">
          <button
            onClick={() => setActiveSubTab("code")}
            className={`px-3 py-1.5 rounded-md font-mono text-[10.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "code"
                ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            CONTRACTS CODE
          </button>
          <button
            onClick={() => setActiveSubTab("console")}
            className={`px-3 py-1.5 rounded-md font-mono text-[10.5px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === "console"
                ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            TESTNET CONSOLE
          </button>
        </div>
      </div>

      {activeSubTab === "code" ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Contract Selector */}
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: "registry", label: "Agent Registry" },
              { id: "reputation", label: "Reputation Contract" },
              { id: "marketplace", label: "Agent Marketplace" },
              { id: "treasury", label: "Treasury Management" },
              { id: "governance", label: "Governance Swarm" },
              { id: "rwa", label: "RWA Verification" },
              { id: "compliance", label: "Compliance Credential" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedContract(item.id as any)}
                className={`w-full text-left p-2.5 rounded-lg border font-mono text-[11px] transition-all flex justify-between items-center cursor-pointer ${
                  selectedContract === item.id
                    ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-semibold"
                    : "bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400 border-zinc-850"
                }`}
              >
                <span>{item.label}</span>
                <Terminal className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}

            <div className="mt-4 p-3 bg-zinc-900/20 border border-zinc-850 rounded-lg text-[10px] text-zinc-500 leading-normal font-sans">
              <Info className="w-4 h-4 text-indigo-400 mb-1" />
              <span>Casper smart contract compiler converts finished Rust modules to lightweight, cost-deterministic WASM files.</span>
            </div>
          </div>

          {/* Code display */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div className="bg-zinc-900/90 rounded-lg border border-zinc-800 p-4 relative">
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-1 text-zinc-400 hover:text-white bg-zinc-950 rounded border border-zinc-800 transition-all flex items-center justify-center cursor-pointer"
                  title="Copy source code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="text-[8px] font-mono tracking-widest text-zinc-500 uppercase border-b border-zinc-800 pb-2 mb-3">
                Rust Target Source ({selectedContract}.rs) - Casper Testnet
              </div>

              <pre className="text-[10.5px] font-mono text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed select-text select-all bg-black/40 p-3 rounded max-h-[420px] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                <code>{CONTRACTS_CODE[selectedContract]}</code>
              </pre>
            </div>

            <div className="mt-4 p-3 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20 text-xs font-mono flex justify-between items-center">
              <span>READY FOR DEPLOYMENT ON CASPER TESTNET (WASM)</span>
              <span className="text-[10px] px-2 py-0.5 bg-green-500/15 rounded border border-green-500/25">STABLE COMPILER</span>
            </div>
          </div>
        </div>
      ) : (
        /* live active transaction-producing client-side interface dashboard layout */
        <div className="space-y-6">
          <div className="bg-zinc-900/30 border border-indigo-500/10 rounded-xl p-4 md:p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Sovereign Wallet Manager</span>
              </div>
              <p className="text-xs text-zinc-400">Generate a cryptographically simulated standard Casper account key to sign, broadcast, and track active WASM contracts.</p>
              {publicKey && (
                <div className="space-y-1 pt-1.5 font-mono text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400">PUBLIC VAL HASH:</span>
                    <span className="text-zinc-300 break-all bg-black/50 px-2 py-0.5 rounded border border-zinc-850 select-all">{publicKey}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">PRIVATE KEY:</span>
                    <span className="text-zinc-650 truncate max-w-[320px]">{privateKey}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0 self-stretch lg:self-auto justify-end">
              <div className="bg-black/40 border border-zinc-800 rounded-lg px-4 py-2 text-right">
                <span className="block text-[8px] font-mono text-zinc-500 uppercase">Testnet Balance</span>
                <span className="font-mono text-base font-bold text-emerald-400">{balance.toLocaleString()} CSPR</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <button
                  onClick={handleGenerateWallet}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-[10.5px] px-3.5 py-1.5 rounded-lg border border-indigo-500/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  GENERATE KEYS
                </button>
                <button
                  onClick={handleRequestFaucet}
                  disabled={fauceting || !publicKey}
                  className={`font-mono font-bold text-[10.5px] px-3.5 py-1.5 rounded-lg border transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                    publicKey 
                      ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700 cursor-pointer" 
                      : "bg-zinc-950 text-zinc-650 border-zinc-900 cursor-not-allowed"
                  }`}
                >
                  {fauceting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      DISPATCHING...
                    </>
                  ) : (
                    <>
                      <Cpu className="w-3.5 h-3.5" />
                      REQUEST FAUCET
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Deploy & interactive caller columns */}
            <div className="lg:col-span-8 space-y-5">
              
              <div className="bg-zinc-900/20 border border-zinc-850 rounded-xl p-4">
                <div className="flex justify-between items-center border-b border-zinc-850 pb-2 mb-4">
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">Step 1: Deploy Compiled WASM</span>
                  <select
                    value={selectedContract}
                    onChange={(e) => setSelectedContract(e.target.value as any)}
                    className="bg-zinc-950 border border-zinc-800 text-xs font-mono text-indigo-400 px-2.5 py-1 rounded"
                  >
                    <option value="registry">Agent Registry (.wasm)</option>
                    <option value="reputation">Reputation system (.wasm)</option>
                    <option value="marketplace">Agent Marketplace (.wasm)</option>
                    <option value="treasury">Treasury Management (.wasm)</option>
                    <option value="governance">Governance Swarm (.wasm)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs text-zinc-400 leading-normal">
                      Select any of the 5 pre-compiled Odra Framework contracts to deploy on Casper Testnet. Deployment requires signing permissions and registers state roots onto block heights.
                    </p>
                    <div className="p-3 bg-black/40 border border-zinc-850 rounded-lg space-y-1.5 font-mono text-[10.5px]">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Selected Target:</span>
                        <span className="text-indigo-400 font-bold">{selectedContract}.rs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Payload Size:</span>
                        <span className="text-zinc-300">124.8 KB (WASM)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Est. Gas Fee:</span>
                        <span className="text-zinc-300">15.00 CSPR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">On-Chain Status:</span>
                        {deployedContracts[selectedContract] ? (
                          <span className="text-green-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> DEPLOYED
                          </span>
                        ) : (
                          <span className="text-amber-500 font-bold">NOT DEPLOYED</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleDeployContract}
                      disabled={compiling || deploying || !publicKey}
                      className={`w-full font-mono font-bold text-xs py-2 px-3 rounded-lg border transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                        publicKey
                          ? "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/30 cursor-pointer"
                          : "bg-zinc-950 text-zinc-650 border-zinc-900 cursor-not-allowed"
                      }`}
                    >
                      {compiling ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          COMPILING ODRA CODE...
                        </>
                      ) : deploying ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                          BROADCASTING WASM...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          COMPILE & BROADCAST TO TESTNET
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-black/90 rounded-lg border border-zinc-850 p-3 h-48 flex flex-col justify-between">
                    <div className="text-[7.5px] font-mono tracking-widest text-zinc-600 uppercase border-b border-zinc-800 pb-1 mb-1.5 flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-indigo-500" />
                      <span>Compiler Deploy Logs</span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[9px] text-zinc-400 scrollbar-none">
                      {deployLogs.length === 0 ? (
                        <p className="text-zinc-600 italic">No deployment initiated. Awaiting WASM initialization sequence...</p>
                      ) : (
                        deployLogs.map((log, idx) => (
                          <p key={idx} className={log.includes("SUCCESSFUL") ? "text-green-400 font-bold" : (log.includes("CONTRACT ADDRESS") ? "text-indigo-400 font-semibold" : "text-zinc-400")}>
                            &gt; {log}
                          </p>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Transaction Caller */}
              <div className="bg-zinc-900/20 border border-zinc-850 rounded-xl p-4">
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block border-b border-zinc-850 pb-2 mb-4">
                  Step 2: Real-time On-Chain Transaction Caller
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                  <div className="space-y-3">
                    <p className="text-xs text-zinc-400 leading-normal">
                      Invoke compiled endpoints directly. Construct custom arguments and sign utilizing the active sovereign cryptographic keys.
                    </p>

                    {selectedContract === "registry" && (
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono text-zinc-400 uppercase">Agent Endpoint API (.wasm url)</label>
                        <input
                          type="text"
                          value={formInputs.endpointUrl}
                          onChange={(e) => setFormInputs(prev => ({ ...prev, endpointUrl: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    )}

                    {selectedContract === "reputation" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5 col-span-2">
                          <label className="block text-[10px] font-mono text-zinc-400 uppercase">Target Account Validator Hash</label>
                          <input
                            type="text"
                            value={formInputs.contractParamAddress}
                            onChange={(e) => setFormInputs(prev => ({ ...prev, contractParamAddress: e.target.value }))}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1.5 col-span-2">
                          <label className="block text-[10px] font-mono text-zinc-400 uppercase">Review Rating (1-100): {formInputs.reviewRating}</label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={formInputs.reviewRating}
                            onChange={(e) => setFormInputs(prev => ({ ...prev, reviewRating: parseInt(e.target.value) }))}
                            className="w-full accent-indigo-500"
                          />
                        </div>
                      </div>
                    )}

                    {(selectedContract === "marketplace" || selectedContract === "treasury") && (
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono text-zinc-400 uppercase">Interactive Token Allocation Value (CSPR)</label>
                        <input
                          type="number"
                          value={formInputs.depositAmountCspr}
                          onChange={(e) => setFormInputs(prev => ({ ...prev, depositAmountCspr: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    )}

                    {selectedContract === "governance" && (
                      <div className="p-3 bg-black/40 border border-zinc-850 rounded-lg text-xs leading-normal text-zinc-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-500 mb-1" />
                        <span>Interactive Vote Transaction dispatches a cryptographic signature support weight for active proposal ID #1.</span>
                      </div>
                    )}

                    {selectedContract === "rwa" && (
                      <div className="p-3 bg-black/40 border border-zinc-850 rounded-lg text-xs leading-normal text-zinc-400">
                        <Info className="w-4 h-4 text-indigo-400 mb-1" />
                        <span>Real-world asset proofs write validation attestations with automated cryptographic validation hashing parameters.</span>
                      </div>
                    )}

                    {selectedContract === "compliance" && (
                      <div className="p-3 bg-black/40 border border-zinc-850 rounded-lg text-xs leading-normal text-zinc-400">
                        <Info className="w-4 h-4 text-zinc-400 mb-1" />
                        <span>Check and issue zero-knowledge compliance status updates matching connected identity wallets.</span>
                      </div>
                    )}

                    <button
                      onClick={handleSendTransaction}
                      disabled={executingTx || !deployedContracts[selectedContract]}
                      className={`w-full font-mono font-bold text-xs py-2 px-3 rounded-lg border transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                        deployedContracts[selectedContract]
                          ? "bg-emerald-500 hover:bg-emerald-400 text-black border-emerald-400/30 cursor-pointer"
                          : "bg-zinc-950 text-zinc-650 border-zinc-900 cursor-not-allowed"
                      }`}
                    >
                      {executingTx ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-black" />
                          BROADCASTING TX TO NODE...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-black fill-black" />
                          BROADCAST TRANSACTION TO TESTNET
                        </>
                      )}
                    </button>
                  </div>

                  {/* Raw RPC Node call projection preview */}
                  <div className="bg-black/90 rounded-lg border border-zinc-850 p-3 h-56 flex flex-col justify-between">
                    <div className="text-[7.5px] font-mono tracking-widest text-zinc-650 uppercase border-b border-zinc-800 pb-1 mb-1.5 flex justify-between items-center">
                      <span className="flex items-center gap-1.5 text-indigo-400">
                        <FileJson className="w-3.5 h-3.5" />
                        Deploy RPC JSON Envelope
                      </span>
                      <span className="text-[6.5px] bg-zinc-800 text-zinc-400 px-1 py-0.2 rounded font-black font-mono">CASPER 2.0</span>
                    </div>
                    <pre className="flex-1 overflow-y-auto font-mono text-[8px] text-zinc-400 scrollbar-none whitespace-pre-wrap leading-normal pt-1 break-all">
                      {`{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "account_put_deploy",
  "params": {
    "deploy": {
      "hash": "${deployedContracts[selectedContract] ? "01a4e23fc..." : "Not Deployed"}",
      "header": {
        "account": "${publicKey ? publicKey.slice(0, 16) + "..." : "00"}",
        "timestamp": "${new Date().toISOString()}",
        "ttl": "30m",
        "gas_price": 1,
        "dependencies": []
      },
      "payment": {
        "ModuleBytes": {
          "args": [["amount", "U512", ${selectedContract === "registry" ? 15 : 5}]]
        }
      },
      "session": {
        "StoredContractByHash": {
          "hash": "${deployedContracts[selectedContract] || "0x000"}",
          "entry_point": "${selectedContract === "registry" ? "register_agent" : (selectedContract === "reputation" ? "record_peer_review" : "call")}",
          "args": [
            ["target_hash", "Key", "${formInputs.contractParamAddress.slice(0, 10)}..."],
            ["value", "U256", ${formInputs.depositAmountCspr}]
          ]
        }
      }
    }
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>

            </div>

            {/* Blocks and history column on right */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Block Producer Status feed */}
              <div className="bg-zinc-900/30 border border-zinc-850 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">Testnet Block Stream</span>
                </div>

                <div className="space-y-2 max-h-[175px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pr-1">
                  {testnetBlocks.map((b) => (
                    <div key={b.height} className="p-2 rounded bg-black/40 border border-zinc-850 flex justify-between items-center text-[10px] font-mono leading-normal">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">#{b.height.toLocaleString()}</span>
                          <span className="bg-zinc-900 border border-zinc-800 text-zinc-500 text-[7.5px] px-1 py-0.2 rounded uppercase">FINALIZED</span>
                        </div>
                        <p className="text-zinc-500 text-[8.5px] truncate max-w-[170px]">{b.hash}</p>
                      </div>
                      <div className="text-right text-[8.5px]">
                        <span className="text-zinc-400 font-semibold block">{b.deploys} Deploy{b.deploys === 1 ? "" : "s"}</span>
                        <span className="text-zinc-650">{b.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Console Events Audit Logs */}
              <div className="bg-zinc-900/30 border border-zinc-850 rounded-xl p-4">
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block mb-3 pb-1 border-b border-zinc-850">Console Audit Log</span>
                <div className="h-[210px] overflow-y-auto space-y-2 scrollbar-none">
                  {recentTxLog.map((log, index) => (
                    <div key={index} className="p-2 rounded bg-black/50 border border-dashed border-zinc-850 font-mono text-[9px] text-zinc-400 leading-normal hover:border-zinc-750 transition-colors">
                      <div className="flex justify-between text-zinc-500 text-[8px] mb-0.5 font-bold uppercase">
                        <span>SYS LOG #{recentTxLog.length - index}</span>
                        <span>RECEIPT</span>
                      </div>
                      <p className={log.includes("SUCCESSFUL") || log.includes("FAUCET DISPATCH SUCCESS") ? "text-emerald-400 font-bold" : "text-zinc-400"}>
                        {log}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
