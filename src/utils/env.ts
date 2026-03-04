import dotenv from "dotenv";

dotenv.config();

const getEnvVar = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};
export const baseUrl = getEnvVar("BASE_URL");
export const inventoryUrl = getEnvVar("INVENTORY_URL");
export const productDetailsUrl = getEnvVar("PRODUCT_DETAILS_URL");
export const cartUrl = getEnvVar("CART_URL");
export const checkoutStepOneUrl = getEnvVar("CHECKOUT_STEP_ONE_URL");
export const checkoutStepTwoUrl = getEnvVar("CHECKOUT_STEP_TWO_URL");
export const checkoutCompleteUrl = getEnvVar("CHECKOUT_COMPLETE_URL");
export const user = {
    username: getEnvVar("USER"),
    password: getEnvVar("PASSWORD"),
    storageFile: getEnvVar("STORAGE_FILE")
};
