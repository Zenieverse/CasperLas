/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  INITIAL_AGENTS, 
  INITIAL_DEFIPOSITION, 
  INITIAL_RWA_ASSETS, 
  INITIAL_PROPOSALS, 
  RECENT_MICROPAYMENTS 
} from "./data";
import { Agent, TaskWorkflow, DefiPosition, RwaAsset, GovernanceProposal, ComplianceCredential, MicropaymentStream } from "./types";

import Marketplace from "./components/Marketplace";
import CommandCenter from "./components/CommandCenter";
import DefiAutopilot from "./components/DefiAutopilot";
import RwaNetwork from "./components/RwaNetwork";
import Governance from "./components/Governance";
import Compliance from "./components/Compliance";
import ReputationSystem from "./components/ReputationSystem";
import SmartContractsView from "./components/SmartContractsView";

import { 
  Coins, 
  ShieldAlert, 
  Compass, 
  Cpu, 
  Globe, 
  Lock, 
  Settings, 
  Award, 
  Scale, 
  RefreshCw, 
  Workflow, 
  Play, 
  Zap, 
  Sparkles,
  Layers,
  Search,
  UserCheck
} from "lucide-react";

export default function App() {
  // Global State
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [defiPositions, setDefiPositions] = useState<DefiPosition[]>(INITIAL_DEFIPOSITION);
  const [rwaAssets, setRwaAssets] = useState<RwaAsset[]>(INITIAL_RWA_ASSETS);
  const [proposals, setProposals] = useState<GovernanceProposal[]>(INITIAL_PROPOSALS);
  const [micropayments, setMicropayments] = useState<MicropaymentStream[]>(RECENT_MICROPAYMENTS);
  const [credentials, setCredentials] = useState<ComplianceCredential[]>([
    {
      id: "cred-1",
      subjectAddress: "0203f1692ae829b359f1165a...",
      verificationLevel: "AML_Pass",
      issuedAt: "2026-06-19 12:00",
      expiresAt: "2027-06-19 12:00",
      cryptographicSignature: "6a89cde99cb18de921...df01",
      score: 98,
      status: "Valid",
      documentType: "Entity Registry Lookup"
    },
    {
      id: "cred-2",
      subjectAddress: "0202e85ab9dcdc23190abf2...",
      verificationLevel: "KYC_Tier_2",
      issuedAt: "2026-06-18 15:30",
      expiresAt: "2027-06-18 15:30",
      cryptographicSignature: "8faee99d21cdefbc812...05a2",
      score: 95,
      status: "Valid",
      documentType: "Government Passport State"
    }
  ]);

  // Command Center Workflows State
  const [workflows, setWorkflows] = useState<TaskWorkflow[]>([
    {
      id: "wf-yield-opt",
      title: "Optimizing Portfolio Yield Reallocation",
      status: "pending",
      progress: 0,
      assignedAgents: ["a-treasury", "a-risk", "a-economic"],
      steps: [
        { id: "s1", description: "Audit DeFi pool liquidity depth", status: "pending", agentId: "a-risk", actionType: "query", costCspr: 0.2 },
        { id: "s2", description: "Simulate slip tolerance margins", status: "pending", agentId: "a-economic", actionType: "calculate", costCspr: 0.15 },
        { id: "s3", description: "Confirm legal sanity metrics", status: "pending", agentId: "a-legal", actionType: "verify", costCspr: 0.1 },
        { id: "s4", description: "Broadcast Odra delegation transaction", status: "pending", agentId: "a-treasury", actionType: "sign", costCspr: 0.5 }
      ]
    }
  ]);

  // Interactions & AI Reasoning State
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>("a-risk");
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [defiAnalysisText, setDefiAnalysisText] = useState("");
  const [rwaAnalysisText, setRwaAnalysisText] = useState("");
  const [debateResponses, setDebateResponses] = useState<Record<string, string>>({});

  // Automated Simulation Scenario State Machine
  const [demoStep, setDemoStep] = useState<"idle" | "wallet_connected" | "treasury_created" | "agent_launched" | "risk_purchased" | "debate_progress" | "executing_allocation" | "completed">("idle");
  const [demoLogs, setDemoLogs] = useState<string[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletBalance, setWalletBalance] = useState("10,000.00 CSPR");

  // Tab State
  const [currentTab, setCurrentTab] = useState<"dashboard" | "marketplace" | "defi" | "rwa" | "governance" | "compliance" | "contracts" | "reputation">("dashboard");

  // Execute server-side Gemini analyze engine call
  const callGeminiAnalyze = async (moduleType: string, contextObj: any, promptPhrase: string) => {
    setIsAnalysisLoading(true);
    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleType,
          context: contextObj,
          prompt: promptPhrase
        })
      });
      const data = await response.json();
      if (data.text) {
        return data.text;
      }
      return "Unable to parse AI response. Try again.";
    } catch (e) {
      console.error(e);
      return "Gemini API gateway connection error. Utilizing default sovereign system model.";
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  // Run Yield optimization evaluation
  const handleRunDefiAnalysis = async () => {
    const context = {
      positions: defiPositions,
      agents: agents.slice(0, 3)
    };
    const text = await callGeminiAnalyze(
      "defi",
      context,
      "Analyze the current APY positions under management and recommend a dynamic staking optimization path on Casper. Deliver specific numbers."
    );
    setDefiAnalysisText(text);

    // Dynamic fee charge
    const feeStream: MicropaymentStream = {
      id: `tx-m-${Date.now()}`,
      fromAgentId: "a-treasury",
      fromAgentName: "Chronos Yield Oracle",
      toAgentId: "a-economic",
      toAgentName: "Quant Macro Forecaster",
      purpose: "x402 query optimization feedback on staking",
      amountCspr: 0.50,
      timestamp: "Just now",
      status: "settled",
      currency: "x402-CSPR",
      txHash: Math.random().toString(16).substr(2, 16)
    };
    setMicropayments(prev => [feeStream, ...prev]);
  };

  // Run RWA Geospatial / appraisal validation agent
  const handleRunRwaAnalysis = async (assetId: string) => {
    const asset = rwaAssets.find(a => a.id === assetId) || rwaAssets[0];
    const text = await callGeminiAnalyze(
      "rwa",
      asset,
      `Evaluate risk profiles, physical land registry matching, and satellite green metrics on asset: ${asset.name}. Frame a compliance risk score.`
    );
    setRwaAnalysisText(text);
  };

  // Simulate on-chain governance debate swarm from different perspectives
  const handleTriggerSwarmDebate = async (proposalId: string) => {
    const prop = proposals.find(p => p.id === proposalId);
    if (!prop) return;

    const context = {
      proposal: prop,
      debateAgents: agents
    };

    const text = await callGeminiAnalyze(
      "governance",
      context,
      `Run a simulated governance debate between a Risk Agent, Treasury Agent, and Legal Agent over proposal: "${prop.title}". Provide a final recommendation.`
    );

    setDebateResponses(prev => ({
      ...prev,
      [proposalId]: text
    }));
  };

  // Vote Proposal manually (representing validator delegator vote)
  const handleVoteProposal = (id: string, stance: "for" | "against") => {
    setProposals(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          votesFor: stance === "for" ? p.votesFor + 12400 : p.votesFor,
          votesAgainst: stance === "against" ? p.votesAgainst + 12400 : p.votesAgainst
        };
      }
      return p;
    }));

    setDemoLogs(prev => [`Validator cast on-chain vote ${stance.toUpperCase()} on Proposal ${id}.`, ...prev]);
  };

  // Submit on-chain proposal
  const handleNewProposal = (title: string, description: string, amount: number) => {
    const newProp: GovernanceProposal = {
      id: `prop-${Math.floor(Math.random() * 900) + 100}`,
      title,
      description,
      proposer: "0202e85ab9dcdc23190abf29a006c4295bd6b51c...",
      amountCspr: amount,
      status: "Active Debate",
      votesFor: 0,
      votesAgainst: 0,
      swarmDebate: [
        { agentId: "a-risk", agentName: "Astra Risk Guardian", role: "Risk", stance: "neutral", comment: "Analyzing asset structure. Will complete audit in 2 epochs.", timestamp: "Just now" }
      ]
    };

    setProposals(prev => [newProp, ...prev]);
    setDemoLogs(prev => [`New proposal '${title}' submitted to Swarm governance.`, ...prev]);
  };

  // Issue compliance credentials
  const handleIssueCredential = (level: string, subjectName: string) => {
    const newCred: ComplianceCredential = {
      id: `cred-${Date.now().toString().slice(-4)}`,
      subjectAddress: subjectName.slice(0, 24) + "...",
      verificationLevel: level as any,
      issuedAt: "2026-06-19 19:24",
      expiresAt: "2027-06-19 19:24",
      cryptographicSignature: Math.random().toString(16).substr(2, 32),
      score: Math.floor(Math.random() * 15) + 85,
      status: "Valid",
      documentType: "Automated Screen"
    };

    setCredentials(prev => [newCred, ...prev]);
    setDemoLogs(prev => [`Credential ${level} issued dynamically to identity ${subjectName.substring(0, 12)}...`, ...prev]);
  };

  // Recuriting / Execute custom agent micro-task through x402 payment
  const handleExecuteAgentTask = (agent: Agent, taskName: string, cost: number) => {
    // Deduct cost and save to transaction logger
    const newTx: MicropaymentStream = {
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      fromAgentId: "a-custom-user",
      fromAgentName: "User Delegated Wallet",
      toAgentId: agent.id,
      toAgentName: agent.name,
      purpose: `${taskName} execution service fee`,
      amountCspr: cost,
      timestamp: "Just now",
      status: "settled",
      currency: "x402-CSPR",
      txHash: Math.random().toString(16).substr(2, 24)
    };

    setMicropayments(prev => [newTx, ...prev]);

    // Reward reputation incrementally
    setAgents(prev => prev.map(a => {
      if (a.id === agent.id) {
        return {
          ...a,
          revenueEarned: a.revenueEarned + cost,
          trustScore: Math.min(100, parseFloat((a.trustScore + 0.1).toFixed(2))),
          successfulTransactions: a.successfulTransactions + 1,
          status: "processing"
        };
      }
      return a;
    }));

    setDemoLogs(prev => [`Dispatched micropayment stream of ${cost} CSPR to agent '${agent.name}'.`, ...prev]);

    setTimeout(() => {
      setAgents(prev => prev.map(a => {
        if (a.id === agent.id) {
          return { ...a, status: "idle" };
        }
        return a;
      }));
    }, 2000);
  };

  // Run complete interactive demo workflow automatically
  const handleTriggerCommandCenterWorkflow = (workflowId: string) => {
    // 1. Reset steps and progress of the workflow, and set status to "running"
    setWorkflows(prev => prev.map(wf => {
      if (wf.id === workflowId) {
        return {
          ...wf,
          status: "running",
          progress: 0,
          steps: wf.steps.map(step => ({ ...step, status: "pending" as const }))
        };
      }
      return wf;
    }));

    setDemoLogs(prev => ["Deploying active swarm optimizer nodes to yield contracts...", ...prev]);

    // 2. Sequential steps with local index state
    let stepIdx = 0;
    const wfInterval = setInterval(() => {
      const currentStepToProcess = stepIdx;

      if (currentStepToProcess >= 4) {
        clearInterval(wfInterval);
        setWorkflows(prev => prev.map(wf => {
          if (wf.id === workflowId) {
            return { ...wf, status: "completed", progress: 100 };
          }
          return wf;
        }));
        setDemoLogs(prev => ["Yield optimizer workflow task fully resolved. Dynamic staked state saved on Casper chain.", ...prev]);
        return;
      }

      // Safe side-effect execution outside of the setWorkflows state updater callback!
      const targetWorkflow = workflows.find(wf => wf.id === workflowId);
      if (targetWorkflow) {
        const associatedStep = targetWorkflow.steps[currentStepToProcess];
        if (associatedStep) {
          const matchingAgent = agents.find(a => a.id === associatedStep.agentId);
          if (matchingAgent) {
            setSelectedAgentId(matchingAgent.id);

            const payment: MicropaymentStream = {
              id: `wf-tx-${Date.now()}-${currentStepToProcess}-${Math.random().toString(36).substring(2, 9)}`,
              fromAgentId: "a-treasury",
              fromAgentName: "Chronos Yield Oracle",
              toAgentId: matchingAgent.id,
              toAgentName: matchingAgent.name,
              purpose: associatedStep.description,
              amountCspr: associatedStep.costCspr,
              timestamp: "Just now",
              status: "settled",
              currency: "x402-CSPR",
              txHash: Math.random().toString(16).substr(2, 16)
            };
            setMicropayments(px => [payment, ...px]);
            setDemoLogs(l => [
              `[Swarm Task] Agent ${matchingAgent.name} resolved step: "${associatedStep.description}" (Micropayment: ${associatedStep.costCspr} CSPR)`,
              ...l
            ]);
          }
        }
      }

      setWorkflows(prev => prev.map(wf => {
        if (wf.id === workflowId) {
          const copiedSteps = wf.steps.map((st, i) => {
            if (i === currentStepToProcess) {
              return { ...st, status: "completed" as const };
            }
            return st;
          });
          const newProgress = Math.min(100, Math.floor(((currentStepToProcess + 1) / copiedSteps.length) * 100));

          return {
            ...wf,
            progress: newProgress,
            steps: copiedSteps,
            status: newProgress === 100 ? ("completed" as const) : ("running" as const)
          };
        }
        return wf;
      }));

      stepIdx++;
    }, 2000);
  };

  // Attest asset on chain (WASM generation)
  const handleAttestAsset = (assetId: string) => {
    setRwaAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        return {
          ...a,
          isAttested: true,
          attestationHash: "0x" + Math.random().toString(16).substr(2, 64),
          confidenceScore: 99.8
        };
      }
      return a;
    }));

    setDemoLogs(prev => [`Real-World Asset attested on Casper Testnet. Cryptographic proof-of-state generated successfully.`, ...prev]);
  };

  // Fully Automated Agent Swarm Scenario Loop
  const runSwarmScenarioStep = () => {
    switch (demoStep) {
      case "idle":
        setDemoStep("wallet_connected");
        setWalletConnected(true);
        setDemoLogs(prev => ["User connected sovereign CSPR.click Delegator wallet.", "Active balance synced from Testnet node.", ...prev]);
        break;
      case "wallet_connected":
        setDemoStep("treasury_created");
        setDemoLogs(prev => ["Instantiated Decentralized treasury wallet pool.", "Assigned Odra framework controller address.", ...prev]);
        break;
      case "treasury_created":
        setDemoStep("agent_launched");
        setAgents(prev => prev.map(a => a.id === "a-treasury" ? { ...a, status: "collaborating", currentTask: "Monitoring yield vectors" } : a));
        setSelectedAgentId("a-treasury");
        setDemoLogs(prev => ["Yield Optimizer Agent autonomous execution logic active.", "Monitoring Casper Delegator rewards...", ...prev]);
        break;
      case "agent_launched":
        setDemoStep("risk_purchased");
        // Trigger x402 Micropayment flow from Chronos Yield to Astra Risk
        const streamTx: MicropaymentStream = {
          id: `demo-tx-${Date.now()}`,
          fromAgentId: "a-treasury",
          fromAgentName: "Chronos Yield Oracle",
          toAgentId: "a-risk",
          toAgentName: "Astra Risk Guardian",
          purpose: "DeFi delta volatility hazard matrix purchase",
          amountCspr: 1.5,
          timestamp: "Just now",
          status: "streaming",
          currency: "x402-CSPR",
          txHash: "05cb79ae8dfdc..."
        };
        setMicropayments(prev => [streamTx, ...prev]);
        setAgents(prev => prev.map(a => {
          if (a.id === "a-risk") return { ...a, status: "collaborating", currentTask: "Calculating pool risk coefficient" };
          return a;
        }));
        setSelectedAgentId("a-risk");
        setDemoLogs(prev => ["Yield Agent initialized x402 micropayment connection.", "Purchased volatility metrics from Risk Agent.", ...prev]);
        break;
      case "risk_purchased":
        setDemoStep("debate_progress");
        setDemoLogs(prev => ["Specialized agents joined consensus arena debate.", "Formulating legal safety matrix on Odra module...", ...prev]);
        // Auto triggering debate text on Gov
        handleTriggerSwarmDebate("prop-104");
        break;
      case "debate_progress":
        setDemoStep("executing_allocation");
        setDemoLogs(prev => ["Swarm consensus achieved.", "Smart contract executed atomic treasury rebalancing.", ...prev]);
        // Move funds in DeFi
        setDefiPositions(prev => prev.map(p => {
          if (p.id === "dp-3") return { ...p, allocatedAmount: p.allocatedAmount + 150000, status: "active" };
          return p;
        }));
        setWalletBalance("9,848.50 CSPR");
        break;
      case "executing_allocation":
        setDemoStep("completed");
        setDemoLogs(prev => ["Treasury allocation updated in Casper Block #4851221.", "Reputation indices logged in Odra Registry contract.", ...prev]);
        break;
      case "completed":
        // Reset everything
        setDemoStep("idle");
        setWalletConnected(false);
        setWalletBalance("10,000.00 CSPR");
        setDemoLogs([]);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col antialiased selection:bg-emerald-500/25 selection:text-emerald-300">
      
      {/* Top Banner & Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-mono tracking-widest font-black animate-pulse flex items-center gap-1">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>CASPER ATLAS</span>
            </div>
            
            <div className="hidden sm:block">
              <span className="bg-zinc-800 font-mono text-[9px] px-2 py-0.5 rounded text-zinc-400 uppercase tracking-widest border border-zinc-700/60">
                Agent OS (V1.0)
              </span>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Decentralized Autonomous Financial Orchestrator</p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-center font-mono">
            <div className="px-2.5 py-1 bg-zinc-900/60 rounded border border-zinc-850">
              <span className="block text-[8px] text-zinc-500">ACTIVE INSTANCES</span>
              <span className="text-[10.5px] font-bold text-white">1,422 Agents</span>
            </div>
            <div className="px-2.5 py-1 bg-zinc-900/60 rounded border border-zinc-850">
              <span className="block text-[8px] text-zinc-500">x402 TRANSACTIONS</span>
              <span className="text-[10.5px] font-bold text-emerald-400">489,512 CSPR</span>
            </div>
            <div className="px-2.5 py-1 bg-zinc-900/60 rounded border border-zinc-850">
              <span className="block text-[8px] text-zinc-500">ASSETS MANAGED</span>
              <span className="text-[10.5px] font-bold text-white">$14.85M USD</span>
            </div>
            <div className="px-2.5 py-1 bg-zinc-900/60 rounded border border-zinc-850">
              <span className="block text-[8px] text-zinc-500">CASPER TESTNET STATE</span>
              <span className="text-[10.5px] font-bold text-emerald-400 flex items-center gap-1 justify-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                SYNCED
              </span>
            </div>
          </div>

          {/* Wallet connection indicator */}
          <div className="flex items-center gap-2.5">
            {walletConnected ? (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-lg text-xs font-mono text-emerald-400">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{walletBalance}</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  setWalletConnected(true);
                  setDemoLogs(prev => ["User manually connected wallet.", ...prev]);
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs py-1.5 px-3.5 rounded-lg transition-colors font-mono"
              >
                CONNECT WALLET
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Primary Interaction Interface */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">

        {/* Swarm Live Demo Simulator Dashboard */}
        <section id="swarm-live-demo-scenario" className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 rounded-2xl p-5 border border-amber-500/25 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] select-none pointer-events-none">
            <Coins className="w-72 h-72" />
          </div>

          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-zinc-800 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-500 text-black font-mono font-black text-[9px] px-2 py-0.5 rounded tracking-widest uppercase">DEMO ARENA</span>
                <h2 className="text-sm font-bold text-white tracking-wide font-mono">Interactive Automated Scenario Sandbox</h2>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">Observe complete multi-agent communication, micropayment pipelines, and autonomous execution pipelines on Casper block-state.</p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={runSwarmScenarioStep}
                className="bg-amber-500 hover:bg-amber-400 text-black font-black text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 font-mono shadow-md shadow-amber-500/10 transition-transform hover:scale-[1.01]"
              >
                <Zap className="w-4 h-4 fill-black" />
                {demoStep === "idle" && "STEP 1: CONNECT WALLET"}
                {demoStep === "wallet_connected" && "STEP 2: CREATE DEFI TREASURY"}
                {demoStep === "treasury_created" && "STEP 3: LAUNCH YIELD AGENT"}
                {demoStep === "agent_launched" && "STEP 4: INITIATE RWA / RISK ANALYSIS"}
                {demoStep === "risk_purchased" && "STEP 5: RUN SWARM DEBATE CONGREGATION"}
                {demoStep === "debate_progress" && "STEP 6: EXECUTE AUTONOMOUS ALLOCATION"}
                {demoStep === "executing_allocation" && "STEP 7: RECORD REPUTATION CHANGES"}
                {demoStep === "completed" && "RESET SCENARIO DEMO"}
              </button>
            </div>
          </div>

          {/* Scenario Step Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Steps visual state map */}
            <div className="md:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono text-[9.5px]">
              {[
                { name: "Soverign Wallets", status: walletConnected ? "syncing" : "inactive", desc: "User connects credentials & sets budget limits" },
                { name: "Active Agent Swarm", status: demoStep !== "idle" && demoStep !== "wallet_connected" && demoStep !== "treasury_created" ? "syncing" : "inactive", desc: "Launch yield and asset assessment models" },
                { name: "x402 Micropayments", status: demoStep === "risk_purchased" || demoStep === "debate_progress" || demoStep === "executing_allocation" || demoStep === "completed" ? "syncing" : "inactive", desc: "Dynamic fees streaming live to data pools" },
                { name: "Consensus Finality", status: demoStep === "completed" ? "syncing" : "inactive", desc: "Attestation hashes stored on Casper network" }
              ].map((step, idx) => (
                <div key={idx} className={`p-3 rounded-lg border flex flex-col justify-between h-24 ${
                  step.status === "syncing"
                    ? "bg-green-500/5 border-green-500/30 text-green-300"
                    : "bg-zinc-950/40 border-zinc-850/60 text-zinc-500"
                }`}>
                  <div className="flex justify-between items-start">
                    <span className="font-bold uppercase text-[9px]">{step.name}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${step.status === "syncing" ? "bg-green-400 animate-ping" : "bg-zinc-800"}`}></span>
                  </div>
                  <p className="text-[9px] leading-snug">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Event Console Logs */}
            <div className="bg-black/90 p-3 rounded-lg border border-zinc-850 text-[10.5px] font-mono text-zinc-400 h-24 overflow-y-auto">
              <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-black border-b border-zinc-800 pb-1 mb-1.5">Consensus Core Output</p>
              {demoLogs.length === 0 ? (
                <p className="text-[9.5px] italic text-zinc-600">Awaiting demo execution loop...</p>
              ) : (
                <div className="space-y-1.5">
                  {demoLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-1 items-start leading-tight">
                      <span className="text-amber-500">❯</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Global Hub Navigation Category Slots */}
        <div className="flex flex-wrap gap-2.5 font-mono text-xs border-b border-zinc-800/60 pb-3">
          {[
            { id: "dashboard", label: "COMMAND CENTER", icon: Cpu },
            { id: "marketplace", label: "AGENT MARKETPLACE", icon: UserCheck },
            { id: "defi", label: "DEFI AUTOPILOT", icon: Coins },
            { id: "rwa", label: "RWA STATE", icon: Globe },
            { id: "governance", label: "GOVERNANCE SWARM", icon: Scale },
            { id: "compliance", label: "COMPLIANCE VAULT", icon: Lock },
            { id: "reputation", label: "REPUTATION MATRIX", icon: Award },
            { id: "contracts", label: "ODRA SMART CONTRACTS", icon: Layers }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-[10.5px] font-bold tracking-tight transition-all ${
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 font-black uppercase" 
                    : "bg-zinc-900/40 text-zinc-400 hover:text-white border-zinc-850 hover:border-zinc-700"
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Interactive Workspace Area */}
        <section id="interactive-workspace-routing" className="space-y-6">

          {currentTab === "dashboard" && (
            <CommandCenter 
              agents={agents}
              workflows={workflows}
              micropayments={micropayments}
              onTriggerWorkflow={handleTriggerCommandCenterWorkflow}
              selectedAgentId={selectedAgentId}
              onSelectAgentId={(id) => {
                setSelectedAgentId(id);
                const matchingAgent = agents.find(a => a.id === id);
                if (matchingAgent) {
                  setDemoLogs(prev => [`Selected matching active agent '${matchingAgent.name}' to observe telemetry channels.`, ...prev]);
                }
              }}
            />
          )}

          {currentTab === "marketplace" && (
            <Marketplace 
              agents={agents}
              onSelectAgent={(agent) => {
                setSelectedAgentId(agent.id);
                setDemoLogs(prev => [`Inspecting agent capabilities: '${agent.name}'. ready for service dispatch.`, ...prev]);
              }}
              selectedAgentId={selectedAgentId}
              onExecuteAgentTask={handleExecuteAgentTask}
            />
          )}

          {currentTab === "defi" && (
            <DefiAutopilot 
              positions={defiPositions}
              agents={agents}
              isSimulating={demoStep !== "executing_allocation"}
              onUpdateAllocation={(id, amt) => {
                setDefiPositions(prev => prev.map(p => p.id === id ? { ...p, allocatedAmount: amt } : p));
                setDemoLogs(prev => [`Adjusted DeFi stake index allocation of pool ${id} to ${amt.toLocaleString()} CSPR.`, ...prev]);
              }}
              onRunOptimizationAnalysis={handleRunDefiAnalysis}
              analysisText={defiAnalysisText}
              isAnalysisLoading={isAnalysisLoading}
            />
          )}

          {currentTab === "rwa" && (
            <RwaNetwork 
              assets={rwaAssets}
              agents={agents}
              isAnalysisLoading={isAnalysisLoading}
              onAttestAsset={handleAttestAsset}
              onAnalyzeAsset={(id) => {
                handleRunRwaAnalysis(id);
                const matchingAsset = rwaAssets.find(a => a.id === id);
                if (matchingAsset) {
                  setDemoLogs(prev => [`Initiated RWA verification check on ${matchingAsset.name}.`, ...prev]);
                }
              }}
              selectedAssetAnalysis={rwaAnalysisText}
            />
          )}

          {currentTab === "governance" && (
            <Governance 
              proposals={proposals}
              agents={agents}
              isAnalysisLoading={isAnalysisLoading}
              onVoteProposal={handleVoteProposal}
              onTriggerSwarmDebate={(id) => {
                const matchingProp = proposals.find(p => p.id === id);
                if (matchingProp) {
                  setDemoLogs(prev => [`Triggered automated multi-agent consensus debate on: ${matchingProp.title}`, ...prev]);
                }
                handleTriggerSwarmDebate(id);
              }}
              onNewProposal={handleNewProposal}
              debateResponses={debateResponses}
            />
          )}

          {currentTab === "compliance" && (
            <Compliance 
              credentials={credentials}
              onIssueCredential={handleIssueCredential}
            />
          )}

          {currentTab === "contracts" && (
            <SmartContractsView />
          )}

          {currentTab === "reputation" && (
            <ReputationSystem agents={agents} />
          )}

        </section>

      </main>

      {/* Footer Branding section */}
      <footer className="border-t border-zinc-900 mt-auto bg-zinc-950/70 p-6 text-center font-mono text-[10px] text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>Casper Atlas © 2026. Constructed utilizing the Odra Rust framework, CSPR.click SDK models and x402 Micropayment standards.</p>
          <div className="flex gap-4">
            <span className="hover:text-zinc-300 transition-colors cursor-pointer">Security Audited</span>
            <span className="hover:text-zinc-300 transition-colors cursor-pointer">Enterprise SLA</span>
            <span className="hover:text-zinc-300 transition-colors cursor-pointer font-bold text-emerald-400">Casper Trust Layer Secured</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
