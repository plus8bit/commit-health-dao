import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Heart, Plus, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GoalCard } from '@/components/GoalCard';
import { CONTRACT_ADDRESS, CONTRACT_ABI, CHARITY_ADDRESS } from '@/config/web3';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Goal {
  user: string;
  description: string;
  depositAmount: bigint;
  startTime: bigint;
  durationInDays: bigint;
  completed: boolean;
  refunded: boolean;
  failed: boolean;
}

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [deposit, setDeposit] = useState('');
  const [activeGoals, setActiveGoals] = useState<(Goal & { id: number })[]>([]);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  // Fetch user goals
  const { data: userGoalIds, refetch: refetchGoalIds } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getUserGoals',
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (!isConnected) {
      navigate('/');
    }
  }, [isConnected, navigate]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Transaction confirmed!');
      refetchGoalIds();
      setDescription('');
      setDuration('');
      setDeposit('');
    }
  }, [isSuccess, refetchGoalIds]);

  // Fetch individual goal details
  useEffect(() => {
    const fetchGoals = async () => {
      if (!userGoalIds || !Array.isArray(userGoalIds)) return;

      const goals: (Goal & { id: number })[] = [];
      for (const goalId of userGoalIds) {
        // Would need to fetch each goal individually here
        // For now, we'll show a simplified version
      }
      setActiveGoals(goals);
    };

    fetchGoals();
  }, [userGoalIds]);

  const handleCommitGoal = () => {
    if (!description || !duration || !deposit) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'commitGoal',
        args: [description, BigInt(duration)],
        value: parseEther(deposit),
      } as any);
      toast.info('Transaction submitted...');
    } catch (error) {
      console.error(error);
      toast.error('Transaction failed');
    }
  };

  const handleMarkCompleted = (goalId: number) => {
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'markCompleted',
      args: [BigInt(goalId)],
    } as any);
    toast.info('Marking goal as completed...');
  };

  const handleClaimRefund = (goalId: number) => {
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'claimRefund',
      args: [BigInt(goalId)],
    } as any);
    toast.info('Claiming refund...');
  };

  const handleFailGoal = (goalId: number) => {
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'failGoal',
      args: [BigInt(goalId)],
    } as any);
    toast.info('Failing goal...');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold gradient-text">HealthCommit</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/history')}
              className="gap-2"
            >
              <History className="w-4 h-4" />
              History
            </Button>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-8"
        >
          {/* Create Goal Section */}
          <div className="glass-card rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Create New Goal</h2>
                <p className="text-sm text-muted-foreground">
                  Set a health commitment and stake ETH
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="description">Goal Description</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Run 30 km in 10 days"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] bg-background/50"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="10"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deposit">Deposit Amount (ETH)</Label>
                  <Input
                    id="deposit"
                    type="number"
                    step="0.01"
                    placeholder="0.1"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleCommitGoal}
              disabled={isPending}
              className="w-full gradient-primary hover:opacity-90 transition-opacity text-lg py-6"
            >
              {isPending ? 'Committing...' : 'Commit Goal'}
            </Button>
          </div>

          {/* Charity Info */}
          <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground">Charity Address</h3>
              <p className="text-sm font-mono mt-1">{CHARITY_ADDRESS}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Failed goals support charity</p>
              <p className="text-lg font-bold gradient-text">🤝</p>
            </div>
          </div>

          {/* Active Goals */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your Active Goals</h2>
            <AnimatePresence mode="popLayout">
              {activeGoals.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-2xl p-12 text-center"
                >
                  <p className="text-muted-foreground">No active goals yet. Create your first goal above! 🎯</p>
                </motion.div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {activeGoals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goalId={goal.id}
                      description={goal.description}
                      depositAmount={goal.depositAmount}
                      startTime={goal.startTime}
                      durationInDays={goal.durationInDays}
                      completed={goal.completed}
                      refunded={goal.refunded}
                      failed={goal.failed}
                      onMarkCompleted={() => handleMarkCompleted(goal.id)}
                      onClaimRefund={() => handleClaimRefund(goal.id)}
                      onFailGoal={() => handleFailGoal(goal.id)}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
