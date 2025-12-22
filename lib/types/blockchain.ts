export interface BlockchainStatus {
  isConnected: boolean;
  nodeCount: number;
  activeNodes: number;
  lastHash: string;
  lastHashTime: Date;
  successRate: number;
  totalHashed: number;
  pendingTransactions: number;
  networkHealth: 'healthy' | 'degraded' | 'critical';
}

export interface BlockchainVerification {
  verified: boolean;
  hash: string;
  timestamp: Date;
  transactionId: string;
  blockNumber?: number;
  networkId: string;
  confirmations: number;
}

export interface BlockchainTransaction {
  id: string;
  documentId: string;
  documentTitle: string;
  hash: string;
  transactionId: string;
  blockNumber: number;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  gasUsed?: number;
}

export interface BlockchainNode {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'inactive' | 'error';
  lastPing: Date;
  responseTime: number;
  blockHeight: number;
}

export interface BlockchainCertificate {
  documentId: string;
  documentTitle: string;
  hash: string;
  transactionId: string;
  timestamp: Date;
  owner: string;
  qrCode: string;
}
