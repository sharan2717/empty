import * as dotenv from 'dotenv';
dotenv.config();

const common = {
    parameterName: process.env.PARAMETER_NAME,
    interfaceKey: process.env.INTERFACE_KEY,
    processorBatchName: 'ProgressiveAkronSales',
    checksumAlgorithm: 'SHA256',
    objectLockMode: 'GOVERNANCE',
    objectLock: '30',
    aws: {
        region: process.env.AWS_CURRENT_REGION || "us-east-2"
    }
};

const development = {
    name: process.env.NAME,
};

const test = {};

const stage = {};

const production = {};

// Define environmnets into a Map
const configMap = new Map();
configMap.set('development', development);
configMap.set('test', test);
configMap.set('stage', stage);
configMap.set('production', production);

// Get current environment and get environment specific configurations
// Choose development as default if no environment is defined
const env = process.env.NODE_ENV
    ? process.env.NODE_ENV
    : 'development';
const envConfig = configMap.get(env);

// Merge the common and environment specific configurations
export const config = { ...common, ...envConfig };

