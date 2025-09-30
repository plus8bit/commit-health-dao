# 💪 HealthCommit - Web3 Health Commitment dApp

A decentralized application (dApp) that helps you stay accountable to your health goals using blockchain technology and smart contracts.

## 🎯 Overview

HealthCommit allows users to commit to health goals by staking ETH. If you complete your goal within the deadline, you get your deposit back. If you fail, the funds automatically go to charity. Built on Ethereum with a beautiful, modern glassmorphism UI.

## ✨ Features

- **🔒 Smart Contract Commitments**: Stake ETH on your health goals
- **⏰ Live Countdown Timers**: Track time remaining for each goal
- **💰 Automatic Refunds**: Get your deposit back when you complete goals
- **🤝 Charity Support**: Failed goals automatically support charity
- **🎨 Beautiful UI**: Modern glassmorphism design with smooth animations
- **👛 Wallet Integration**: Connect via RainbowKit (MetaMask, WalletConnect, etc.)

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contracts**: Solidity 0.8.19
- **Web3**: Wagmi, Viem, RainbowKit
- **Animations**: Framer Motion
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd health-commitment-dapp

# Install dependencies
npm install

# Start development server
npm run dev
```

### Configuration

1. **Deploy Smart Contract**: 
   - Deploy `src/contracts/HealthCommitment.sol` to Sepolia testnet
   - Update `CONTRACT_ADDRESS` in `src/config/web3.ts`

2. **WalletConnect Project ID**:
   - Get a project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Update `projectId` in `src/config/web3.ts`

3. **Charity Address** (optional):
   - Update `CHARITY_ADDRESS` in `src/config/web3.ts` with your preferred charity wallet

## 📝 Smart Contract

The `HealthCommitment` contract includes:

- `commitGoal()`: Create a new health goal with ETH deposit
- `markCompleted()`: Mark your goal as completed
- `claimRefund()`: Claim your deposit back for completed goals
- `failGoal()`: Acknowledge failure and send funds to charity

### Contract Events

- `GoalCommitted`: Emitted when a new goal is created
- `GoalCompleted`: Emitted when a goal is marked complete
- `RefundClaimed`: Emitted when user claims their refund
- `GoalFailed`: Emitted when goal fails and funds go to charity

## 🎨 Design System

The app uses a custom design system with:

- **Dark theme** with glassmorphism effects
- **Purple-blue gradient** for primary actions
- **Green accents** for success states
- **Orange accents** for warnings
- **Smooth animations** using Framer Motion
- **Responsive layout** for all devices

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## ⚠️ Disclaimer

This is a demo application built for educational purposes. Always audit smart contracts before using them with real funds on mainnet.
