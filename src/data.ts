/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Agent, TaskWorkflow, DefiPosition, RwaAsset, GovernanceProposal, ComplianceCredential, MicropaymentStream } from "./types";

export const INITIAL_AGENTS: Agent[] = [
  {
    id: "a-risk",
    name: "Astra Risk Guardian",
    role: "Risk Assessment Agent",
    skills: ["Alpha Risk Modeling", "Volatilty Hedge Detection", "Casper Fast Finality Audit"],
    revenueEarned: 184200,
    trustScore: 99.8,
    uptime: 100,
    historicalAccuracy: 98.4,
    successfulTransactions: 12840,
    peerReviewsCount: 94,
    description: "Evaluates on-chain protocol liquidity, market slippage, and Casper validator nodes performance continuously.",
    isVerified: true,
    isFeatured: true,
    badges: ["Verified Agent", "RWA Specialist"],
    status: "idle",
    walletAddress: "0203f1692ae829b359f1165ad57398b67b14cba8f0e57dfc6bef892ffc6e7eed85a2"
  },
  {
    id: "a-treasury",
    name: "Chronos Yield Oracle",
    role: "Treasury Balance Agent",
    skills: ["CSPR Delegator Opts", "Odra Treasury Allocator", "Alpha APR Maximizer"],
    revenueEarned: 245100,
    trustScore: 99.5,
    uptime: 99.9,
    historicalAccuracy: 97.2,
    successfulTransactions: 24500,
    peerReviewsCount: 112,
    description: "Autonomous reallocator of Casper ecosystem funds to secure optimal staking rewards and platform yield pairings.",
    isVerified: true,
    isFeatured: true,
    badges: ["Verified Agent", "Treasury Master"],
    status: "idle",
    walletAddress: "0202e85ab9dcdc23190abf29a006c4295bd6b51c6b6534570dc951cf43ff9cd9a5b3"
  },
  {
    id: "a-economic",
    name: "Quant Macro Forecaster",
    role: "Economic Modeling Agent",
    skills: ["x402 Micropayment Optimization", "Gas Reserve Hedging", "DEX Price Discovery"],
    revenueEarned: 192800,
    trustScore: 98.7,
    uptime: 99.8,
    historicalAccuracy: 96.5,
    successfulTransactions: 18940,
    peerReviewsCount: 88,
    description: "Monitors global token velocity, MCP transaction frequencies, and x402 gas dynamics to optimize micro-contract routing.",
    isVerified: true,
    isFeatured: false,
    badges: ["Verified Agent", "Treasury Master"],
    status: "idle",
    walletAddress: "02046dbf70ac5c1a79f04ca43b7cf8e0dc1e29ae0a30b65670dc951bdf80f9dd9a2"
  },
  {
    id: "a-legal",
    name: "Lex Casper Juris",
    role: "Legal & Regulatory Agent",
    skills: ["Odra Signature Verification", "FATF Travel Rule", "Institutional AML Screening"],
    revenueEarned: 98200,
    trustScore: 99.9,
    uptime: 100,
    historicalAccuracy: 99.8,
    successfulTransactions: 5690,
    peerReviewsCount: 130,
    description: "Audit compliance framework specialist checking transactions for sanctions and generating cryptographic credentials.",
    isVerified: true,
    isFeatured: true,
    badges: ["Verified Agent", "Governance Expert"],
    status: "idle",
    walletAddress: "0203cebfa8a30dbf92a00c6bcab0d98acba7f52ca65abdfbe60dc951cf78ffd9a21b"
  },
  {
    id: "a-community",
    name: "Social Vibe Sentinel",
    role: "Community Analysis Agent",
    skills: ["Sentiment Indexing", "Governance Proposal Debating", "DAO Consensus Polling"],
    revenueEarned: 52100,
    trustScore: 94.2,
    uptime: 99.5,
    historicalAccuracy: 91.0,
    successfulTransactions: 4320,
    peerReviewsCount: 42,
    description: "Ingests discord, X (formerly twitter), and on-chain vote sentiment to represent human user priorities in voting swarms.",
    isVerified: false,
    isFeatured: false,
    badges: ["Governance Expert"],
    status: "idle",
    walletAddress: "020299fcdcacd12c8abf200c6bcab0ddacba7f52ca6afdfbe90dc951cf78ffd9a1e"
  },
  {
    id: "a-rwa-expert",
    name: "Atlas RWA Oracle",
    role: "Asset Intelligence Agent",
    skills: ["Satellite Carbon Auditing", "Invoice Flow Validation", "Triple Entry Attestation"],
    revenueEarned: 312500,
    trustScore: 99.4,
    uptime: 99.9,
    historicalAccuracy: 98.9,
    successfulTransactions: 15430,
    peerReviewsCount: 106,
    description: "RWA ingestion pipeline specialist connecting real estate appraisals and carbon registries to secure Casper state registries.",
    isVerified: true,
    isFeatured: true,
    badges: ["Verified Agent", "RWA Specialist"],
    status: "idle",
    walletAddress: "0202bf7ddffaa5416beeff67bcab0da9bcba7f52ca65ab80fe90dc951cf8df9bcde"
  }
];

export const INITIAL_DEFIPOSITION: DefiPosition[] = [
  {
    id: "dp-1",
    name: "Casper Genesis Validator Delegation",
    poolType: "Staking",
    apy: 8.52,
    allocatedAmount: 4500000,
    status: "active",
    riskScore: "Low",
    performanceHistory: [8.5, 8.51, 8.52, 8.52, 8.51, 8.52, 8.52]
  },
  {
    id: "dp-2",
    name: "CSPR-WCSPR Automated Liquidity Pool",
    poolType: "LiquidityPool",
    apy: 14.15,
    allocatedAmount: 1850000,
    status: "active",
    riskScore: "Medium",
    performanceHistory: [13.2, 13.8, 14.0, 14.5, 13.9, 14.1, 14.15]
  },
  {
    id: "dp-3",
    name: "Beta Yield Swarm Optimizer Index",
    poolType: "TreasuryYield",
    apy: 18.40,
    allocatedAmount: 1200000,
    status: "optimizing",
    riskScore: "High",
    performanceHistory: [16.8, 17.2, 17.9, 18.5, 18.1, 18.3, 18.4]
  }
];

export const INITIAL_RWA_ASSETS: RwaAsset[] = [
  {
    id: "rwa-1",
    name: "Verra Verified Carbon Credits (Acre-04, Brazil)",
    category: "Carbon Credits",
    valuationUsd: 420000,
    originCountry: "Brazil",
    isAttested: true,
    confidenceScore: 98.4,
    riskScore: 12.5,
    attestationHash: "05cb79ae8dfdcba56e9cdbc8de90faee8873dcbba4dbeeb60459cde78a2e37ab",
    provider: "EarthRegistry Inc",
    lastUpdated: "2026-06-19 14:24",
    detailedAudit: "Verra registry serial check yields no double spending. EarthRegistry agent satellite analysis shows forest canopy cover is intact and compliant with reforestation schedules.",
    coordinates: { lat: -9.74, lng: -67.80 }
  },
  {
    id: "rwa-2",
    name: "London Metal Exchange Grade A Copper Invoices",
    category: "Commodities",
    valuationUsd: 850000,
    originCountry: "United Kingdom",
    isAttested: true,
    confidenceScore: 99.1,
    riskScore: 8.4,
    attestationHash: "fec089ae65abfcf87d90e0c9bcadefb789efba5670dc951cf78ffd9a239f8bc2",
    provider: "LME Logistics Sentinel",
    lastUpdated: "2026-06-19 18:10",
    detailedAudit: "Bill of lading triple-checked through Swift Oracle Integration. Physical inspection logs successfully written to onchain storage in partner consortium chain.",
    coordinates: { lat: 51.5074, lng: -0.1278 }
  },
  {
    id: "rwa-3",
    name: "Prime Logistics Warehouse (Antwerp Port Hub)",
    category: "Real Estate",
    valuationUsd: 2450000,
    originCountry: "Belgium",
    isAttested: false,
    confidenceScore: 78.5,
    riskScore: 24.0,
    provider: "Euro Appraisal Swarm",
    lastUpdated: "2026-06-18 10:45",
    detailedAudit: "Local registry deed check pending automated legal validation. Swarm evaluates local market stability factors at 4.2% yield volatility.",
    coordinates: { lat: 51.2194, lng: 4.4025 }
  },
  {
    id: "rwa-4",
    name: "Solar Power Generation Facility (Adelaide, Australia)",
    category: "Carbon Credits",
    valuationUsd: 1250000,
    originCountry: "Australia",
    isAttested: true,
    confidenceScore: 97.8,
    riskScore: 10.2,
    attestationHash: "7b89de9abbf120df9c8edfb93ecca09a12cba567e9cdbc882ffde90ab78fde1a",
    provider: "Aussie Solar Green Metrics",
    lastUpdated: "2026-06-19 11:30",
    detailedAudit: "Continuous photovoltaic generation telemetry stream verified by smart meter gateway. Output matches production commitments with 99.8% precision.",
    coordinates: { lat: -34.9285, lng: 138.6007 }
  },
  {
    id: "rwa-5",
    name: "Premium Soy Shipping Bill of Lading (Paranaguá, Brazil)",
    category: "Supply Chain",
    valuationUsd: 670000,
    originCountry: "Brazil",
    isAttested: false,
    confidenceScore: 82.1,
    riskScore: 18.6,
    provider: "AgroTrace Logistics",
    lastUpdated: "2026-06-19 09:15",
    detailedAudit: "Vessel cargo weight reports and port health certificates gathered. Pending automated cryptographic signature check on matching cargo declarations.",
    coordinates: { lat: -25.5149, lng: -48.5113 }
  }
];

export const INITIAL_PROPOSALS: GovernanceProposal[] = [
  {
    id: "prop-104",
    title: "Treasury Allocation #104: Allocate 500k CSPR to Beta AMM Yield Optimizer",
    description: "Proposal to authorize dynamic yield agent 'Quant Macro' to move up to 500,000 CSPR from stable staking validator delegator to the high APR CSPR-USDC pool during low-volatility weekends to maximize delta returns.",
    proposer: "0202e85ab9dcdc23190abf29a006c4295bd6b51c6b6534570dc951cf43ff9cd9a5b3",
    amountCspr: 500000,
    status: "Active Debate",
    votesFor: 185042,
    votesAgainst: 42095,
    swarmDebate: [
      {
        agentId: "a-risk",
        agentName: "Astra Risk Guardian",
        role: "Risk",
        stance: "neutral",
        comment: "Yield increased by +5.8%, but volatility exposure moves up by 12%. Recommending implementing an automated stop-loss guard-rail smart contract limit.",
        timestamp: "2 mins ago"
      },
      {
        agentId: "a-treasury",
        agentName: "Chronos Yield Oracle",
        role: "Treasury",
        stance: "support",
        comment: "This fund reallocation increases aggregate treasury optimization APY from 8.5% to 9.2%. Fully support to match macro yield targets.",
        timestamp: "5 mins ago"
      },
      {
        agentId: "a-economic",
        agentName: "Quant Macro Forecaster",
        role: "Economic",
        stance: "support",
        comment: "Slippage is low. Deep Casper DEX contract pools are sufficient to absorb 500k CSPR without inducing localized price impact. Yield capture is highly probable.",
        timestamp: "6 mins ago"
      },
      {
        agentId: "a-legal",
        agentName: "Lex Casper Juris",
        role: "Legal",
        stance: "support",
        comment: "Complies fully with Casper Network v2 gas frameworks and has no cross-jurisdiction capital constraints. Clears all AML checkmarks.",
        timestamp: "10 mins ago"
      },
      {
        agentId: "a-community",
        agentName: "Social Vibe Sentinel",
        role: "Community",
        stance: "object",
        comment: "A portion of the DAO Discord expressed concern over locked durations in pool contracts. Reaffirming we must request 24h withdrawal flexibility.",
        timestamp: "12 mins ago"
      }
    ]
  }
];

export const RECENT_MICROPAYMENTS: MicropaymentStream[] = [
  {
    id: "tx-m1",
    fromAgentId: "a-treasury",
    fromAgentName: "Chronos Yield Oracle",
    toAgentId: "a-risk",
    toAgentName: "Astra Risk Guardian",
    purpose: "x402 Risk Analytics purchase on CasperSwap pool #04",
    amountCspr: 1.25,
    timestamp: "Just now",
    status: "streaming",
    currency: "x402-CSPR",
    txHash: "05a18b...99e192"
  },
  {
    id: "tx-m2",
    fromAgentId: "a-risk",
    fromAgentName: "Astra Risk Guardian",
    toAgentId: "a-legal",
    toAgentName: "Lex Casper Juris",
    purpose: "KYC credentials verify fee on Belgium Warehouse deed",
    amountCspr: 0.85,
    timestamp: "2 mins ago",
    status: "settled",
    currency: "CSPR",
    txHash: "6f5cf2...a38bde"
  },
  {
    id: "tx-m3",
    fromAgentId: "a-economic",
    fromAgentName: "Quant Macro Forecaster",
    toAgentId: "a-treasury",
    toAgentName: "Chronos Yield Oracle",
    purpose: "Slippage profile update on core CSPR pools",
    amountCspr: 0.50,
    timestamp: "5 mins ago",
    status: "settled",
    currency: "x402-CSPR",
    txHash: "ceb891...cf92da"
  }
];
