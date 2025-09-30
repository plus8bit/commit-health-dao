# 🚀 Deployment Guide

## Step 1: Deploy Smart Contract

### Using Remix IDE (Recommended for beginners)

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file called `HealthCommitment.sol`
3. Copy the contract code from `src/contracts/HealthCommitment.sol`
4. Compile the contract (Solidity 0.8.19+)
5. Connect to Sepolia testnet via MetaMask
6. Deploy with constructor parameter: `charityAddress` (e.g., `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`)
7. Copy the deployed contract address

### Using Hardhat

```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Initialize Hardhat project
npx hardhat

# Create deploy script
# scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const charityAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
  
  const HealthCommitment = await ethers.getContractFactory("HealthCommitment");
  const contract = await HealthCommitment.deploy(charityAddress);
  
  await contract.deployed();
  
  console.log("HealthCommitment deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia
```

## Step 2: Update Frontend Configuration

1. Open `src/config/web3.ts`
2. Update `CONTRACT_ADDRESS` with your deployed contract address:
   ```typescript
   export const CONTRACT_ADDRESS = '0xYourContractAddress';
   ```

## Step 3: Get WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy your Project ID
4. Update in `src/config/web3.ts`:
   ```typescript
   projectId: 'YOUR_PROJECT_ID_HERE',
   ```

## Step 4: Test Locally

```bash
npm run dev
```

Visit `http://localhost:8080` and test:
- ✅ Wallet connection
- ✅ Create goal
- ✅ Mark completed
- ✅ Claim refund
- ✅ Fail goal

## Step 5: Deploy Frontend

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables (if needed)
vercel env add VITE_CONTRACT_ADDRESS production
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
"deploy": "gh-pages -d dist"

# Build and deploy
npm run build
npm run deploy
```

## 📋 Pre-Deployment Checklist

- [ ] Smart contract deployed to Sepolia
- [ ] Contract address updated in `web3.ts`
- [ ] WalletConnect Project ID configured
- [ ] Charity address set correctly
- [ ] Tested all functions locally
- [ ] Build successful (`npm run build`)
- [ ] No TypeScript errors
- [ ] All dependencies installed

## 🔐 Security Notes

- **Never** commit private keys to git
- Use environment variables for sensitive data
- Audit smart contracts before mainnet deployment
- Test thoroughly on testnet first
- Consider professional security audit for production

## 🌐 Network Configuration

### Sepolia Testnet (Current)
- Chain ID: 11155111
- RPC URL: `https://sepolia.infura.io/v3/YOUR_INFURA_KEY`
- Block Explorer: https://sepolia.etherscan.io/

### Mainnet (Production)
⚠️ **Warning**: Mainnet deployment requires:
- Professional security audit
- Thorough testing
- Legal compliance check
- Real ETH for transactions

To switch to mainnet:
1. Update chain in `src/config/web3.ts`:
   ```typescript
   import { mainnet } from 'wagmi/chains';
   chains: [mainnet]
   ```
2. Deploy contract to Ethereum mainnet
3. Update contract address

## 📱 Mobile Wallet Testing

Test with popular wallets:
- MetaMask Mobile
- Rainbow Wallet
- Trust Wallet
- Coinbase Wallet

Use WalletConnect QR code for mobile connection.

## 🐛 Troubleshooting

### Contract not found
- Verify contract address is correct
- Check you're on Sepolia testnet
- Ensure contract is deployed

### Transaction failing
- Check you have enough ETH for gas
- Verify goal parameters are valid
- Check goal hasn't expired

### Wallet connection issues
- Update MetaMask to latest version
- Clear browser cache
- Try different browser
- Check network is set to Sepolia

## 📞 Support

For issues:
1. Check console for errors
2. Verify network and contract address
3. Test on different browser
4. Check Sepolia testnet status

Happy deploying! 🚀
