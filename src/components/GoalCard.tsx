import { motion } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatEther } from 'viem';
import { useEffect, useState } from 'react';

interface GoalCardProps {
  goalId: number;
  description: string;
  depositAmount: bigint;
  startTime: bigint;
  durationInDays: bigint;
  completed: boolean;
  refunded: boolean;
  failed: boolean;
  onMarkCompleted?: () => void;
  onClaimRefund?: () => void;
  onFailGoal?: () => void;
}

const getGoalEmoji = (description: string) => {
  const lower = description.toLowerCase();
  if (lower.includes('run') || lower.includes('walk') || lower.includes('jog')) return '⚡';
  if (lower.includes('eat') || lower.includes('nutrition') || lower.includes('diet')) return '🥗';
  if (lower.includes('meditat') || lower.includes('yoga') || lower.includes('mindful')) return '🧘‍♂️';
  if (lower.includes('gym') || lower.includes('workout') || lower.includes('exercise')) return '💪';
  if (lower.includes('sleep') || lower.includes('rest')) return '😴';
  if (lower.includes('water') || lower.includes('hydrat')) return '💧';
  return '🎯';
};

const formatTimeRemaining = (seconds: number) => {
  if (seconds <= 0) return 'Expired';
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
};

export function GoalCard({
  goalId,
  description,
  depositAmount,
  startTime,
  durationInDays,
  completed,
  refunded,
  failed,
  onMarkCompleted,
  onClaimRefund,
  onFailGoal,
}: GoalCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = Math.floor(Date.now() / 1000);
      const endTime = Number(startTime) + Number(durationInDays) * 86400;
      const remaining = endTime - now;
      setTimeRemaining(Math.max(0, remaining));
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [startTime, durationInDays]);

  const isExpired = timeRemaining <= 0;
  const canMarkCompleted = !completed && !failed && !refunded && !isExpired;
  const canClaimRefund = completed && !refunded && !failed;
  const canFail = !completed && !failed && !refunded && isExpired;

  const getStatusBadge = () => {
    if (refunded) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/20 border border-success/30">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className="text-sm font-medium text-success-foreground">Refunded ✅</span>
        </div>
      );
    }
    if (failed) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/20 border border-destructive/30">
          <XCircle className="w-4 h-4 text-destructive" />
          <span className="text-sm font-medium text-destructive-foreground">Failed ❌</span>
        </div>
      );
    }
    if (completed) {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/20 border border-success/30">
          <Sparkles className="w-4 h-4 text-success" />
          <span className="text-sm font-medium text-success-foreground">Completed ✨</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/20 border border-warning/30">
        <Clock className="w-4 h-4 text-warning" />
        <span className="text-sm font-medium text-warning-foreground">Pending ⏳</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card rounded-2xl p-6 space-y-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{getGoalEmoji(description)}</div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Goal #{goalId}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Deposit</p>
          <p className="text-lg font-bold gradient-text">{formatEther(depositAmount)} ETH</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Duration</p>
          <p className="text-lg font-bold text-foreground">{durationInDays.toString()} days</p>
        </div>
      </div>

      {!refunded && !failed && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/30">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">
            {isExpired ? 'Expired' : `${formatTimeRemaining(timeRemaining)} remaining`}
          </span>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        {canMarkCompleted && (
          <Button
            onClick={onMarkCompleted}
            className="flex-1 gradient-primary hover:opacity-90 transition-opacity"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark Completed
          </Button>
        )}
        {canClaimRefund && (
          <Button
            onClick={onClaimRefund}
            variant="outline"
            className="flex-1 border-success text-success hover:bg-success/10"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Claim Refund
          </Button>
        )}
        {canFail && (
          <Button
            onClick={onFailGoal}
            variant="outline"
            className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Fail Goal
          </Button>
        )}
      </div>
    </motion.div>
  );
}
