import { S3 } from 'aws-sdk';
import moment from "moment"
import { config } from '../config/config';
import { getParam } from './parameterStoreManager'
import { getLogger } from "esi-integrations-library/dist/services/logger.service";

const log = getLogger("s3Manager", "info");

const s3 = new S3();

export class S3Manager {

    //Read data from S3
    async readDataFromS3(Bucket: string, Key: string): Promise<any> {
        try {
            const data = await s3.getObject({
                Bucket: Bucket,
                Key: Key,
            }).promise();
            return data.Body.toString('utf-8');
        }
        catch (error: any) {
            throw new Error(`Failed while reading data from S3: ${error}`)
        }
    }

    //Update the sequence number
    async updateSequenceNumber(s3Data: any) {
        try {
            const records = s3Data.split('\n');
            let i = 1;
            const updatedRecords = records.map((record: any) => {
                if (record.substring(0, 2) == '10') {
                    i = i + 1;
                }
                const updatedRecord = record.substring(0, 2) + String(i).padStart(7, '0') + record.substring(9);
                return updatedRecord;
            });

            const updatedContent = updatedRecords.join('\n');
            return updatedContent;
        }
        catch (error: any) {
            throw new Error(`Failed while updating the sequence number: ${error}`)
        }
    }

    //Add header and Trailer records
    async addHeaderandTrailer(event: any, newContent: any) {
        try {
            const putObjectParams = {
                Bucket: event.targetBucket,
                Key: event.targetFileKey,
                Body: newContent,
            };
            return await s3.putObject(putObjectParams).promise();
        }
        catch (error: any) {
            throw new Error(`Failed while adding header and trailer records: ${error}`)
        }
    }

    //Rename the File
    async renameFile(fileKey: string) {
        try {
            let filePathSegments: any = fileKey.split('/');
            log.info(`Parameter Name: ${config.parameterName}`);
            const targetFileName = await getParam(config.parameterName);
            log.info(`Retrieved value from ${config.parameterName}: ${targetFileName}`);
            filePathSegments[filePathSegments.length - 1] = targetFileName + '_' + moment().format("YYYYMMDD_HHmmss") + '.txt';
            fileKey = filePathSegments.join('/')
            return fileKey;
        }
        catch (error: any) {
            throw new Error(`Failed while renaming the file: ${error}`)
        }
    }
}