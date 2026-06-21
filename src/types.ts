/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Agent {
  id: string;
  name: string;
  role: string;
  skills: string[];
  revenueEarned: number; // in CSPR
  trustScore: number; // 0 to 100
  uptime: number; // percentage
  historicalAccuracy: number; // percentage
  successfulTransactions: number;
  peerReviewsCount: number;
  description: string;
  isVerified: boolean;
  isFeatured: boolean;
  badges: string[];
  status: "idle" | "collaborating" | "processing" | "executing";
  currentTask?: string;
  walletAddress: string;
}

export interface TaskWorkflow {
  id: string;
  title: string;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  assignedAgents: string[];
  steps: {
    id: string;
    description: string;
    status: "pending" | "running" | "completed";
    agentId: string;
    actionType: "query" | "calculate" | "sign" | "verify" | "payment" | "debate";
    costCspr: number;
  }[];
}

export interface DefiPosition {
  id: string;
  name: string;
  poolType: "Staking" | "LiquidityPool" | "Lending" | "TreasuryYield";
  apy: number;
  allocatedAmount: number; // in CSPR
  status: "active" | "optimizing" | "paused";
  riskScore: "Low" | "Medium" | "High";
  performanceHistory: number[]; // simple arrays for light visuals
}

export interface RwaAsset {
  id: string;
  name: string;
  category: "Carbon Credits" | "Commodities" | "Real Estate" | "Invoices" | "Supply Chain";
  valuationUsd: number;
  originCountry: string;
  isAttested: boolean;
  confidenceScore: number; // percentage
  riskScore: number; // percentage
  attestationHash?: string;
  provider: string;
  lastUpdated: string;
  detailedAudit?: string;
  coordinates?: { lat: number; lng: number };
}

export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  amountCspr: number;
  status: "Active Debate" | "Passed" | "Rejected" | "Executed";
  votesFor: number;
  votesAgainst: number;
  swarmDebate: {
    agentId: string;
    agentName: string;
    role: "Risk" | "Treasury" | "Economic" | "Legal" | "Community";
    stance: "support" | "object" | "neutral";
    comment: string;
    timestamp: string;
  }[];
  verdictRecommendation?: string;
}

export interface ComplianceCredential {
  id: string;
  subjectAddress: string;
  verificationLevel: "KYC_Tier_1" | "KYC_Tier_2" | "AML_Pass" | "Sanction_Clear";
  issuedAt: string;
  expiresAt: string;
  cryptographicSignature: string;
  score: number; // AML compliance score
  status: "Valid" | "Expired" | "Revoked";
  documentType: string;
}

export interface MicropaymentStream {
  id: string;
  fromAgentId: string;
  fromAgentName: string;
  toAgentId: string;
  toAgentName: string;
  purpose: string;
  amountCspr: number;
  timestamp: string;
  status: "streaming" | "settled";
  currency: "CSPR" | "x402-CSPR";
  txHash: string;
}
