import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, Search, Brain, FileCheck } from 'lucide-react';

const STEPS = [
  { label: 'Fetching transaction signals…', icon: Search },
  { label: 'Running AI fraud checks…', icon: Brain },
  { label: 'Generating trust decision…', icon: FileCheck },
];

interface Props {
  onComplete: () => void;
}

export default function AnalysisLoader({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current < STEPS.length) {
      const t = setTimeout(() => setCurrent(c => c + 1), 1500);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(onComplete, 500);
      return () => clearTimeout(t);
    }
  }, [current, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center gap-8 py-20"
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full bg-primary/20"
        />
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>

      <div className="w-full max-w-sm space-y-4">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = i < current;
          const active = i === current;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: i <= current ? 1 : 0.3, x: 0 }}
              transition={{ delay: i * 0.2, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              {done ? (
                <CheckCircle2 className="h-5 w-5 text-trust" />
              ) : (
                <Icon className={`h-5 w-5 ${active ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
              )}
              <span className={`text-sm font-medium ${done ? 'text-trust' : active ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
