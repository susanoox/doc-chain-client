interface Env {
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_BLOCKCHAIN_NETWORK: string;
  NEXT_PUBLIC_BLOCKCHAIN_ENABLED: string;
  NEXT_PUBLIC_AI_ENABLED: string;
  NEXT_PUBLIC_MAX_FILE_SIZE: string;
  NEXT_PUBLIC_ENABLE_MFA: string;
  NEXT_PUBLIC_ENABLE_ENCRYPTION: string;
  NEXT_PUBLIC_APP_NAME: string;
  NEXT_PUBLIC_APP_URL: string;
}

function getEnvVar(key: keyof Env, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}

function getBooleanEnvVar(key: keyof Env, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value === 'true' || value === '1';
}

function getNumberEnvVar(key: keyof Env, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const num = parseInt(value, 10);
  return isNaN(num) ? defaultValue : num;
}

export const env = {
  // API
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3000/api'),
  
  // Blockchain
  blockchainNetwork: getEnvVar('NEXT_PUBLIC_BLOCKCHAIN_NETWORK', 'testnet'),
  blockchainEnabled: getBooleanEnvVar('NEXT_PUBLIC_BLOCKCHAIN_ENABLED', true),
  
  // AI
  aiEnabled: getBooleanEnvVar('NEXT_PUBLIC_AI_ENABLED', true),
  
  // File Upload
  maxFileSize: getNumberEnvVar('NEXT_PUBLIC_MAX_FILE_SIZE', 104857600), // 100MB
  
  // Features
  enableMFA: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_MFA', true),
  enableEncryption: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_ENCRYPTION', true),
  
  // App
  appName: getEnvVar('NEXT_PUBLIC_APP_NAME', 'DocChain'),
  appUrl: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

export type AppEnv = typeof env;
