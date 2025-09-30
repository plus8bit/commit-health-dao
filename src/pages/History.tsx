import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Heart, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function History() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
    }
  }, [isConnected, navigate]);

  // Mock data - would be fetched from contract in production
  const historyItems = [
    {
      id: 1,
      description: 'Run 30 km in 10 days',
      deposit: '0.1',
      status: 'refunded',
      date: '2024-01-15',
    },
    {
      id: 2,
      description: 'Meditate daily for 7 days',
      deposit: '0.05',
      status: 'charity',
      date: '2024-01-08',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold gradient-text">HealthCommit</span>
            </div>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Goal History</h1>
            <p className="text-muted-foreground">Track your past commitments and results</p>
          </div>

          <div className="space-y-4">
            {historyItems.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <p className="text-muted-foreground">No history yet. Complete some goals first! 📊</p>
              </div>
            ) : (
              historyItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{item.description}</h3>
                        {item.status === 'refunded' ? (
                          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-success/20 border border-success/30">
                            <TrendingUp className="w-4 h-4 text-success" />
                            <span className="text-xs font-medium text-success-foreground">
                              Refunded
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-warning/20 border border-warning/30">
                            <TrendingDown className="w-4 h-4 text-warning" />
                            <span className="text-xs font-medium text-warning-foreground">
                              Sent to Charity
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Completed on {item.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Deposit</p>
                      <p className="text-xl font-bold gradient-text">{item.deposit} ETH</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
