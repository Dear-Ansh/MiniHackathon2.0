import React from 'react';
import { motion } from 'framer-motion';
import { TrustAnalysis } from '@/lib/scoring';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldCheck, Clock, ArrowRight, AlertTriangle, Search, Brain } from 'lucide-react';

interface Props {
  analysis: TrustAnalysis;
  userAction: string;
  onNewPayment: () => void;
}

export default function PaymentConfirmation({ analysis, userAction, onNewPayment }: Props) {
  const riskColor = analysis.riskLevel === 'low' ? 'text-trust' : analysis.riskLevel === 'medium' ? 'text-caution' : 'text-danger';

  const actionLabel: Record<string, string> = {
    test: 'User sent ₹1 test payment',
    verify: 'User requested recipient verification',
    cancel: 'User cancelled payment',
    continue: 'User continued despite warning',
    direct: 'Low-risk — payment proceeded directly',
  };

  const timeline = [
    { icon: Search, label: 'UPI ID analyzed', detail: analysis.upiId },
    { icon: Brain, label: 'AI trust assessment', detail: `Score: ${analysis.trustScore}/100` },
    ...(analysis.riskLevel !== 'low'
      ? [{ icon: AlertTriangle, label: 'Risk warning shown', detail: `Fraud probability: ${analysis.fraudProbability}%` }]
      : []),
    { icon: ArrowRight, label: actionLabel[userAction] || 'Payment action taken', detail: '' },
    { icon: CheckCircle2, label: 'Payment completed', detail: 'Protected by Paytm AI' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <Card>
        <CardContent className="flex flex-col items-center gap-4 pt-8 pb-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-trust/10"
          >
            <CheckCircle2 className="h-9 w-9 text-trust" />
          </motion.div>
          <h2 className="text-xl font-bold text-foreground">Payment Protected</h2>
          <p className="text-sm text-muted-foreground">Your transaction was screened by AI before completion</p>
        </CardContent>
      </Card>

      {/* Safety Summary */}
      <Card>
        <CardContent className="grid grid-cols-3 gap-4 pt-6 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Trust Score</p>
            <p className={`text-xl font-bold ${riskColor}`}>{analysis.trustScore}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Risk Level</p>
            <Badge variant={analysis.riskLevel === 'low' ? 'default' : analysis.riskLevel === 'high' ? 'destructive' : 'secondary'} className="mt-1 capitalize">
              {analysis.riskLevel}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">AI Verdict</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <ShieldCheck className={`h-4 w-4 ${riskColor}`} />
              <span className="text-sm font-medium">Screened</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decision Log */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Decision Log</h3>
          <div className="space-y-0">
            {timeline.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-start gap-3 relative pb-4"
              >
                {i < timeline.length - 1 && (
                  <div className="absolute left-[11px] top-6 h-full w-px bg-border" />
                )}
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent">
                  <step.icon className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{step.label}</p>
                  {step.detail && <p className="text-xs text-muted-foreground">{step.detail}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={onNewPayment} variant="outline" className="w-full" size="lg">
        Make Another Payment
      </Button>
    </motion.div>
  );
}
