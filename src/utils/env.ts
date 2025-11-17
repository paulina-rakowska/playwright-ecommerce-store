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
export const user = {
    username: getEnvVar('USER'),
    password: getEnvVar('PASSWORD'),
    storageFile: getEnvVar('STORAGE_FILE')
};