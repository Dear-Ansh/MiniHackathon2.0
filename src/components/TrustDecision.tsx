import React from 'react';
import { motion } from 'framer-motion';
import { TrustAnalysis } from '@/lib/scoring';
import TrustGauge from './TrustGauge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShieldCheck, ShieldAlert, ShieldX, AlertTriangle, Brain, Activity, TrendingUp, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Props {
  analysis: TrustAnalysis;
  onProceed: () => void;
}

export default function TrustDecision({ analysis, onProceed }: Props) {
  const { trustScore, fraudProbability, riskLevel, aiExplanations, anomalies, recentTransactions, trendData, disputeRate, successRate, accountAgeDays, totalTransactions, merchantCategory } = analysis;

  const riskColor = riskLevel === 'low' ? 'text-trust' : riskLevel === 'medium' ? 'text-caution' : 'text-danger';
  const RiskIcon = riskLevel === 'low' ? ShieldCheck : riskLevel === 'medium' ? ShieldAlert : ShieldX;
  const badgeLabel = riskLevel === 'low' ? '✓ Blue Tick Verified' : riskLevel === 'medium' ? '⚠ Caution' : '✗ High Risk';
  const badgeVariant = riskLevel === 'low' ? 'default' as const : riskLevel === 'high' ? 'destructive' as const : 'secondary' as const;

  const pieData = [
    { name: 'Success', value: successRate },
    { name: 'Disputes', value: disputeRate },
    { name: 'Other', value: Math.max(0, 100 - successRate - disputeRate) },
  ];
  const PIE_COLORS = ['hsl(var(--trust))', 'hsl(var(--danger))', 'hsl(var(--border))'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Score + Metrics */}
      <Card>
        <CardContent className="flex flex-col items-center gap-6 pt-6 sm:flex-row sm:justify-around">
          <TrustGauge score={trustScore} />
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-1 sm:text-left">
            <div>
              <p className="text-xs text-muted-foreground">Fraud Probability</p>
              <p className={`text-2xl font-bold ${riskColor}`}>{fraudProbability}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Risk Level</p>
              <div className={`flex items-center gap-1 ${riskColor}`}>
                <RiskIcon className="h-5 w-5" />
                <span className="text-lg font-semibold capitalize">{riskLevel}</span>
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Badge variant={badgeVariant} className="text-sm px-3 py-1">{badgeLabel}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Explanation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Brain className="h-4 w-4 text-primary" /> AI Explanation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {aiExplanations.map((e, i) => (
            <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="text-sm text-muted-foreground leading-relaxed">
              • {e}
            </motion.p>
          ))}
        </CardContent>
      </Card>

      {/* Anomalies */}
      {anomalies.length > 0 && (
        <Card className="border-caution/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-caution">
              <AlertTriangle className="h-4 w-4" /> Behavioral Anomalies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {anomalies.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-caution" />
                <span className="text-muted-foreground">{a}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Analytics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-primary" /> Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            {/* Trust Progress */}
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Trust Level</p>
              <Progress value={trustScore} className="h-2" />
              <p className="mt-1 text-xs text-muted-foreground">{trustScore}/100</p>
            </div>

            {/* Trend */}
            <div>
              <p className="mb-1 text-xs text-muted-foreground">30-Day Trend</p>
              <ResponsiveContainer width="100%" height={50}>
                <LineChart data={trendData}>
                  <Line type="monotone" dataKey="volume" stroke="hsl(var(--primary))" strokeWidth={1.5} dot={false} />
                  <XAxis hide /><YAxis hide />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie */}
            <div className="flex items-center gap-2">
              <ResponsiveContainer width={60} height={60}>
                <PieChart>
                  <Pie data={pieData} innerRadius={18} outerRadius={28} dataKey="value" strokeWidth={0}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p><span className="inline-block h-2 w-2 rounded-full bg-trust mr-1" />Success {successRate}%</p>
                <p><span className="inline-block h-2 w-2 rounded-full bg-danger mr-1" />Disputes {disputeRate}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-primary" /> Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-60">
            <div className="space-y-2">
              {recentTransactions.map(tx => {
                const StatusIcon = tx.status === 'success' ? CheckCircle2 : tx.status === 'failed' ? XCircle : AlertCircle;
                const statusColor = tx.status === 'success' ? 'text-trust' : tx.status === 'failed' ? 'text-danger' : 'text-caution';
                return (
                  <div key={tx.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                      <span className="text-muted-foreground">{tx.counterparty}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">₹{tx.amount.toLocaleString()}</span>
                      <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Button onClick={onProceed} className="w-full" size="lg">
        Proceed to Pay
      </Button>
    </motion.div>
  );
}
