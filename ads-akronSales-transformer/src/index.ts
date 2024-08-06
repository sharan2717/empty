import { getLogger } from "esi-integrations-library/dist/services/logger.service";
import { S3Manager } from "./utils/s3Manager";
import { HeaderTrailerGenerator } from "./services/header-trailer-generator";

const log = getLogger("index", "info");

export const handler = async (event: any) => {
  try {
    log.info(`Input file parameters from source: ${JSON.stringify(event)}`);

    const s3Manager = new S3Manager();
    const headerTrailerGenerator = new HeaderTrailerGenerator();

    const s3Data: any = await s3Manager.readDataFromS3(event.sourceBucket,
      event.sourceFileKey);

    let newContent = await headerTrailerGenerator.addHeaderTrailerRecords(s3Data);

    event.targetFileKey = await s3Manager.renameFile(event.targetFileKey);

    // Add header and trailer to the file
    const targetFileInfo = await s3Manager.addHeaderandTrailer(event, newContent);
    log.info(`Target file info: ${JSON.stringify(targetFileInfo)}`);

    const s3params: any = {
      "s3Params": {
        "sourceFileInfo": {
          "sourceBucket": event.sourceBucket,
          "sourceFileKey": event.sourceFileKey
        },
        "targetFileInfo": {
          "targetBucket": event.targetBucket,
          "targetFileKey": event.targetFileKey
        },
        "errorFileInfo": {
          "errorBucket": event.errorBucket,
          "errorFileKey": event.errorFileKey,
        }
      }
    }
    log.info(`File parameters post transformation: ${JSON.stringify(s3params)}`);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: s3params
    };
  } catch (error: any) {
    log.error(`Progressive Akron files transformer error: ${error}`);
    return {
      body: error?.message,
      headers: { "Content-Type": "application/json" },
      statusCode: error?.status || 500
    }
  }
};

