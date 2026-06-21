# 🌌 Casper Atlas aka CasperLas

> **The Decentralized Operating System for the Agent Economy on the Casper Network.**
>
> https://casperlas-764082783379.us-west1.run.app
>
> Configure, orchestrate, and deploy autonomous multi-agent swarm networks running with micro-payments, proof-of-state verification, and robust on-chain WebAssembly logic.

---

## 🚀 Key Modules & Capabilities

Casper Atlas binds secure blockchain economics with autonomous intelligent swarms using custom WebAssembly microarchitectures:

1. **🛰️ Swarm Command Center**
   - Live interactive visual topology of interconnected active agents (`Chronos`, `Risk Shield`, `Sovereign Oracle`, `Vibe Sentinel`).
   - Real-time automated scenario sandbox loops simulating multi-agent interactions, payments, and consensus logs.
   - Interactive **Yield System Optimizer** triggering sequential pool audits, margin simulations, and Odra consensus signing.

2. **📊 Cryptographic Reputation Matrix**
   - **Proof-of-Reputation (PoR)** verification tracker displaying validator stats, uptime, and dynamic trust metrics.
   - Live **Download Dataset (CSV)** function to instantly download performance vectors and peer-reviewed endorsement hashes for offline analytical processing.
   - Attestation and badge issuance verification powered by standard cryptographic keys.

3. **🧪 WebAssembly Smart Contracts Console**
   - Inspect battle-tested **Odra Framework Rust smart contracts** (Registry, Reputation, Marketplace, Treasury, Governance).
   - Generates sovereign active ed25519 Casper keypairs inside the browser to sign and authorize real-time testnet deploys.
   - Dispatch funds requested from the testnet faucet and compile/deploy optimized `.wasm` bytecode to live testnets in a sandboxed simulator.
   - Real-time **RPC JSON Request Encoder** to visualize precisely formed Casper node protocol parameters.

4. **💼 Autonomous DeFi Autopilot**
   - Watch agents executing algorithmic liquidity reallocations and stake pools telemetry.
   - Adjust target allocation parameters with automated slippage configurations and risk shields.

---

## 🛠️ Technology Stack

- **Frontend & App Engine**: React 19, Vite, TypeScript, and Tailwind CSS (v4).
- **Smooth Animations**: High-fidelity motion transitions imported from `motion/react`.
- **Rust Smart Contracts**: Designed in the **Odra Framework** targeting Casper VM execution environments.
- **Backend Services**: Express.js server configuring custom production-grade bundling via `esbuild`.

---

## 📖 Smart Contracts Architecture (Odra Framework)

This repository contains fully-documented Rust contracts optimized for the Casper virtual machine. The templates can be copied directly from the dashboard:

* **Agent Registry (`registry.rs`)**: On-chain storage registering endpoints, payment requirements, and capabilities for discovering agents.
* **Reputation Tracker (`reputation.rs`)**: Tracks cryptographically signed peer reviews, score ratings (1-100), and issues dynamic reputation badges.
* **Marketplace Hub (`marketplace.rs`)**: Secures automated trustless token custody and schedules microsecond payload execution payouts.

---

## 📥 Local Installation & Development

### 1. Prerequisites
Ensure you have the following installed locally on your system:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Rust** & **cargo-odra** toolchain (for smart contract work)

### 2. Clone the Repository
```bash
git clone https://github.com/casper-atlas/casper-atlas-platform.git
cd casper-atlas-platform
```

### 3. Install NPM Dependencies
```bash
npm install
```

### 4. Setup Environment Parameters
Create a `.env` file in the root directory:
```env
# .env Configuration Example
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 5. Start the Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000` with hot-reloading active.

### 6. Build and Bundle for Production
The platform is fully optimized for Cloud Run container hosting:
```bash
npm run build
npm start
```
This compiles the clientside static bundles and builds a standalone CommonJS backend bundle output to `dist/server.cjs` via `esbuild`.

---

## 📂 Code & Schema Structure

- `/src/components/NetworkGraph.tsx` - Canvas-based live interactive swarm network and security anomaly event log.
- `/src/components/ReputationSystem.tsx` - Cryptographic reputation ledger tracker and CSV export.
- `/src/components/SmartContractsView.tsx` - Rust compilation view, private key generator, and live RPC caller simulator dashboard.
- `/src/components/CommandCenter.tsx` - Orchestrator system interface with custom scenario sandbox and yield triggers.
- `/server.ts` - Node Express server proxying telemetry queries and compiling build-stage paths.

---

## 🔒 Security & On-Chain Integrity
This repository enforces high cryptographic constraints:
- Public/Private key pairs simulate authentic Ed25519 signatures.
- Deterministic gas limit formulas based on custom Odra smart contract schemas.
- Complete separation of server secrets ensuring confidential API validation remaining private on endpoints.

Licensed under the **MIT Open Source License**. Pull requests and community contributions to advance the Casper Agent Economy of scale are highly welcome!
