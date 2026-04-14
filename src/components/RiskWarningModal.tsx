import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrustAnalysis } from '@/lib/scoring';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert, Send, UserCheck, X, ArrowRight } from 'lucide-react';

interface Props {
  analysis: TrustAnalysis;
  open: boolean;
  onAction: (action: string) => void;
}

const ACTIONS = [
  { id: 'test', icon: Send, label: 'Send ₹1 test payment', desc: 'Verify the recipient with a micro-transaction first' },
  { id: 'verify', icon: UserCheck, label: 'Request verification', desc: 'Ask recipient to verify their identity' },
  { id: 'cancel', icon: X, label: 'Cancel payment', desc: 'Go back and don\'t send money' },
  { id: 'continue', icon: ArrowRight, label: 'Continue anyway', desc: 'Proceed at your own risk', muted: true },
];

export default function RiskWarningModal({ analysis, open, onAction }: Props) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="border-danger/30 shadow-2xl">
            <CardContent className="space-y-5 pt-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
                  <ShieldAlert className="h-6 w-6 text-danger" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Payment Risk Detected</h2>
                <p className="text-sm text-muted-foreground">
                  Trust score is <span className="font-semibold text-foreground">{analysis.trustScore}/100</span> with{' '}
                  <span className="font-semibold text-danger">{analysis.fraudProbability}%</span> fraud probability.
                </p>
              </div>

              <div className="space-y-2">
                {ACTIONS.map(a => (
                  <button
                    key={a.id}
                    onClick={() => onAction(a.id)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent ${
                      a.muted ? 'border-border text-muted-foreground' : 'border-border text-foreground'
                    }`}
                  >
                    <a.icon className={`h-5 w-5 shrink-0 ${a.muted ? 'text-muted-foreground' : 'text-primary'}`} />
                    <div>
                      <p className="text-sm font-medium">{a.label}</p>
                      <p className="text-xs text-muted-foreground">{a.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
