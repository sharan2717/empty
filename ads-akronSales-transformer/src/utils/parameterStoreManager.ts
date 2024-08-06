import awsParamStore from 'aws-param-store';
import { config } from '../config/config';
import { getLogger } from "esi-integrations-library/dist/services/logger.service";

const log = getLogger("get-aws-params", "info");

export const getParam = async (path: string) => {
    try {
        return (await awsParamStore.getParameter(path, { region: config.aws.region })).Value;
    }
    catch (error: any) {
        log.error(`Failed to read the parameter: ${path}`)
        return {
            statusCode: error.status,
            headers: { "Content-Type": "application/json" },
            body: {
                "status": false,
                "error": error
            }
        }
    }
}

