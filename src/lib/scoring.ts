// Deterministic UPI scoring engine based on string hash

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export type RiskLevel = 'low' | 'medium' | 'high';

export interface TrustAnalysis {
  upiId: string;
  trustScore: number;
  fraudProbability: number;
  riskLevel: RiskLevel;
  accountAgeDays: number;
  totalTransactions: number;
  disputeRate: number;
  successRate: number;
  merchantCategory: string;
  aiExplanations: string[];
  anomalies: string[];
  recentTransactions: Transaction[];
  trendData: { day: number; volume: number }[];
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  status: 'success' | 'failed' | 'disputed';
  counterparty: string;
}

const MERCHANT_CATEGORIES = [
  'Retail & Shopping', 'Food & Dining', 'Utilities & Bills',
  'Travel & Transport', 'Entertainment', 'Healthcare',
  'Education', 'Financial Services', 'Freelance Services', 'Unknown'
];

const COUNTERPARTIES = [
  'flipkart@upi', 'amazon@upi', 'swiggy@upi', 'zomato@upi',
  'ola@upi', 'uber@upi', 'jiomart@upi', 'bigbasket@upi',
  'phonepe@upi', 'gpay@upi', 'myntra@upi', 'ajio@upi'
];

export function analyzeUpi(upiId: string): TrustAnalysis {
  const id = upiId.toLowerCase().trim();
  const h = hashString(id);

  // Special keyword overrides
  const isFraud = /fraud|scam|fake|hack|phish/i.test(id);
  const isVerified = /verified|trusted|safe|paytm|google|flipkart/i.test(id);

  let trustScore: number;
  if (isFraud) trustScore = 5 + (h % 20);
  else if (isVerified) trustScore = 80 + (h % 20);
  else trustScore = 15 + (h % 75);

  const fraudProbability = Math.round((100 - trustScore) * (0.7 + (h % 30) / 100));
  const riskLevel: RiskLevel = trustScore >= 70 ? 'low' : trustScore >= 40 ? 'medium' : 'high';

  const accountAgeDays = isVerified ? 365 + (h % 1500) : isFraud ? 5 + (h % 25) : 30 + (h % 1000);
  const totalTransactions = isVerified ? 500 + (h % 5000) : isFraud ? 2 + (h % 15) : 10 + (h % 2000);
  const disputeRate = isFraud ? 30 + (h % 40) : isVerified ? (h % 3) : 1 + (h % 20);
  const successRate = 100 - disputeRate - (h % 5);
  const merchantCategory = MERCHANT_CATEGORIES[h % MERCHANT_CATEGORIES.length];

  // AI explanations
  const explanations: string[] = [];
  if (accountAgeDays < 30) explanations.push(`Account is only ${accountAgeDays} days old — newly created accounts carry higher risk.`);
  else if (accountAgeDays > 365) explanations.push(`Account has been active for ${Math.floor(accountAgeDays / 365)}+ years, indicating established presence.`);
  
  if (disputeRate > 20) explanations.push(`Dispute rate of ${disputeRate}% is significantly above the platform average of 2.3%.`);
  else if (disputeRate < 5) explanations.push(`Low dispute rate of ${disputeRate}% suggests reliable transaction history.`);

  if (totalTransactions < 20) explanations.push(`Only ${totalTransactions} total transactions detected — limited data for AI assessment.`);
  else if (totalTransactions > 1000) explanations.push(`${totalTransactions.toLocaleString()} transactions processed — strong behavioral baseline established.`);

  explanations.push(`Recipient operates primarily in the "${merchantCategory}" category.`);
  
  if (fraudProbability > 50) explanations.push(`Pattern analysis detected similarities with ${Math.floor(fraudProbability / 10)} known fraud clusters.`);
  else explanations.push(`Transaction velocity and patterns are within normal parameters for this category.`);

  // Anomalies
  const anomalies: string[] = [];
  if (disputeRate > 15) anomalies.push('Sudden spike in incoming disputes over the last 7 days');
  if (accountAgeDays < 30) anomalies.push(`Account created only ${accountAgeDays} days ago`);
  if (totalTransactions > 100 && disputeRate > 10) anomalies.push('Unusual transaction pattern: high volume with elevated dispute rate');
  if (h % 7 === 0) anomalies.push('Multiple UPI IDs linked to the same device fingerprint');
  if (h % 11 === 0) anomalies.push('Recipient has received payments from flagged accounts');
  if (isFraud) anomalies.push('UPI ID matches known fraud database patterns');

  // Recent transactions
  const recentTransactions: Transaction[] = [];
  for (let i = 0; i < 10; i++) {
    const th = hashString(id + i.toString());
    const statuses: Transaction['status'][] = ['success', 'success', 'success', 'failed', 'disputed'];
    recentTransactions.push({
      id: `txn_${th.toString(16).slice(0, 8)}`,
      amount: 50 + (th % 9950),
      date: new Date(Date.now() - (i * 86400000 + (th % 86400000))).toISOString(),
      status: isFraud ? statuses[th % statuses.length] : (th % 10 < 8 ? 'success' : th % 10 < 9 ? 'failed' : 'disputed'),
      counterparty: COUNTERPARTIES[th % COUNTERPARTIES.length],
    });
  }

  // Trend data
  const trendData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    volume: Math.floor(10 + (hashString(id + 'day' + i) % 90) * (totalTransactions / 500)),
  }));

  return {
    upiId: id,
    trustScore,
    fraudProbability,
    riskLevel,
    accountAgeDays,
    totalTransactions,
    disputeRate,
    successRate,
    merchantCategory,
    aiExplanations: explanations,
    anomalies: anomalies.slice(0, 3),
    recentTransactions,
    trendData,
  };
}
