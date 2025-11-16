import dotenv from 'dotenv';

dotenv.config();

const getEnvVar = (key: string): string => {
    const value = process.env[key];
    if(!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}
export const baseUrl = getEnvVar('BASE_URL');
export const inventoryUrl = getEnvVar('INVENTORY_URL');
export const users = {
  standard: {
    username: getEnvVar('STANDARD_U'),
    password: getEnvVar('STANDARD_P'),
    storageFile: 'storageState-standard.json'
  },
  lockedOut: {
    username: getEnvVar('LOCKOUT_U'), 
    password: getEnvVar('LOCKOUT_P'),
    storageFile: 'storageState-lockedout.json'
  },
  problem: {
    username: getEnvVar('PROBLEM_U'),
    password: getEnvVar('PROBLEM_P'),
    storageFile: 'storageState-problem.json'
  },
  performance: {
    username: getEnvVar('PERFORMANCE_U'),
    password: getEnvVar('PERFORMANCE_P'),
    storageFile: 'storageState-performance.json'
  },
  error: {
    username: getEnvVar('ERROR_U'),
    password: getEnvVar('ERROR_P'),
    storageFile: 'storageState-error.json'
  },
  visual: {
    username: getEnvVar('VISUAL_U'),
    password: getEnvVar('VISUAL_P'),
    storageFile: 'storageState-visual.json'
  }
};