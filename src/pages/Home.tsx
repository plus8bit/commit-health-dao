import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Target, TrendingUp, Shield } from 'lucide-react';

export default function Home() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  if (isConnected) {
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold gradient-text">HealthCommit</span>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center pt-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold">
                <span className="gradient-text">Stay Healthy,</span>
                <br />
                <span className="text-foreground">Stay Committed</span> 💪
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Put your money where your health is. Commit to your fitness goals with smart
                contracts. Complete them and get your deposit back, or funds go to charity.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex justify-center"
            >
              <ConnectButton.Custom>
                {({ account, chain, openConnectModal, mounted }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <Button
                              onClick={openConnectModal}
                              size="lg"
                              className="text-lg px-8 py-6 gradient-primary hover:opacity-90 transition-opacity shadow-lg shadow-primary/50"
                            >
                              Connect Wallet & Start
                            </Button>
                          );
                        }
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-12"
            >
              <div className="glass-card rounded-2xl p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Set Goals</h3>
                <p className="text-sm text-muted-foreground">
                  Create health commitments with deadlines and stake ETH
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your goals with live countdown timers
                </p>
              </div>

              <div className="glass-card rounded-2xl p-6 space-y-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Win or Give</h3>
                <p className="text-sm text-muted-foreground">
                  Complete goals for refunds or support charity automatically
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by Ethereum Smart Contracts • Deployed on Sepolia Testnet</p>
        </div>
      </footer>
    </div>
  );
}
