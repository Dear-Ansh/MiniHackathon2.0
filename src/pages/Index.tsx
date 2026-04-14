import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';
import AnalysisLoader from '@/components/AnalysisLoader';
import TrustDecision from '@/components/TrustDecision';
import RiskWarningModal from '@/components/RiskWarningModal';
import PaymentConfirmation from '@/components/PaymentConfirmation';
import { analyzeUpi, TrustAnalysis } from '@/lib/scoring';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight } from 'lucide-react';

type Screen = 'home' | 'loading' | 'decision' | 'confirmation';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [upiId, setUpiId] = useState('');
  const [analysis, setAnalysis] = useState<TrustAnalysis | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [userAction, setUserAction] = useState('direct');

  const handleAnalyze = () => {
    if (!upiId.trim()) return;
    setAnalysis(analyzeUpi(upiId));
    setScreen('loading');
  };

  const handleLoadingComplete = useCallback(() => {
    setScreen('decision');
  }, []);

  const handleProceed = () => {
    if (analysis && analysis.riskLevel !== 'low') {
      setShowWarning(true);
    } else {
      setUserAction('direct');
      setScreen('confirmation');
    }
  };

  const handleWarningAction = (action: string) => {
    setShowWarning(false);
    setUserAction(action);
    if (action === 'cancel') {
      setScreen('home');
    } else {
      setScreen('confirmation');
    }
  };

  const handleNewPayment = () => {
    setUpiId('');
    setAnalysis(null);
    setShowWarning(false);
    setUserAction('direct');
    setScreen('home');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-xl px-4 py-8">
        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-8 py-16"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  UPI Blue Tick
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Know who you're paying before you pay
                </p>
              </div>
              <div className="w-full max-w-sm space-y-3">
                <Input
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="Enter UPI ID (e.g. name@upi)"
                  className="h-12 text-center text-base"
                  onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                />
                <Button onClick={handleAnalyze} className="w-full h-12 text-base gap-2" disabled={!upiId.trim()}>
                  Analyze & Pay <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground max-w-xs text-center">
                Try "fraud@upi" for high risk, "verified@paytm" for low risk, or any UPI ID for varied results.
              </p>
            </motion.div>
          )}

          {screen === 'loading' && (
            <motion.div key="loading" exit={{ opacity: 0 }}>
              <AnalysisLoader onComplete={handleLoadingComplete} />
            </motion.div>
          )}

          {screen === 'decision' && analysis && (
            <motion.div key="decision" exit={{ opacity: 0 }}>
              <TrustDecision analysis={analysis} onProceed={handleProceed} />
            </motion.div>
          )}

          {screen === 'confirmation' && analysis && (
            <motion.div key="confirmation" exit={{ opacity: 0 }}>
              <PaymentConfirmation analysis={analysis} userAction={userAction} onNewPayment={handleNewPayment} />
            </motion.div>
          )}
        </AnimatePresence>

        {analysis && (
          <RiskWarningModal analysis={analysis} open={showWarning} onAction={handleWarningAction} />
        )}
      </main>
    </div>
  );
};

export default Index;
