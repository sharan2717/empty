import { getLogger } from "esi-integrations-library/dist/services/logger.service";
import { S3Manager } from "../utils/s3Manager";

const log = getLogger("header-trailer-generator", "info");

let amtArr: any[] = [];

export class HeaderTrailerGenerator {

  async serialNumber(s3Data: any) {
    const records = s3Data.split('\n');
    return records.length + 2;
  }

  //Get Return Values
  async getReturnValues(s3Data: any) {
    let trailerReturnValues: any, tranAmt: number, tranCD: any,
      tranCDArr1 = ['202', '201'],
      tranCDArr2 = ['601', '602'],
      tranCDArr3 = ['852', '452'],
      salesCnt: number = 0, salesAmt: number = 0,
      returnCnt: number = 0, returnAmt: number = 0,
      paymentCnt: number = 0, paymentAmt: number = 0;

    try {
      const records = s3Data.split('\n');
      records.forEach((record: any) => {
        if (record.substring(0, 2) == '10') {
          amtArr.push(record)
        }
      });

      amtArr.map((x: any) => {
          tranCD = x.substring(27, 30);
          tranAmt = +x.substring(30, 39);
      });

      if (tranCDArr1.includes(tranCD)) {
        salesCnt++;
        salesAmt += tranAmt;
      }
      else if (tranCDArr2.includes(tranCD)) {
        returnCnt++;
        returnAmt += tranAmt;
      }
      else if (tranCDArr3.includes(tranCD)) {
        paymentCnt++;
        paymentAmt += tranAmt;
      }
      else {
        log.info(`Invalid Transaction Code : ${tranCD}`);
      }

      // Format counts and amounts
      const salesCntStr = salesCnt.toString().padStart(9, '0');
      const salesAmtStr = salesAmt.toString().padStart(13, '0');
      const returnCntStr = returnCnt.toString().padStart(9, '0');
      const returnAmtStr = returnAmt.toString().padStart(13, '0');
      const paymentCntStr = paymentCnt.toString().padStart(9, '0');
      const paymentAmtStr = paymentAmt.toString().padStart(13, '0');
      const downPmtAmtStr = '0'.padStart(13, '0');
      const downPmtCntStr = '0'.padStart(9, '0');

      // Concatenate all values
      trailerReturnValues = `${salesAmtStr}${salesCntStr}${returnAmtStr}
      ${returnCntStr}${downPmtAmtStr}${downPmtCntStr}${paymentAmtStr}${paymentCntStr}`;
    } catch (error) {
      log.error(`Error in getReturnValues: ${error}`);
      // Handle any errors and set default values
      trailerReturnValues = '0'.padStart(9, '0') + '0'.padStart(13, '0') +
        '0'.padStart(9, '0') + '0'.padStart(13, '0') +
        '0'.padStart(9, '0') + '0'.padStart(13, '0');
    }
    log.info(`trailerReturnValues : ${JSON.stringify(trailerReturnValues)}`);
    return trailerReturnValues;
  }

  async getSysDateInYYYYMMDD() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  async addHeaderTrailerRecords(s3Data: any) {
    const s3Manager = new S3Manager();

    const adsDallasHeaderRecord = '01' + '0000001' + '0'.repeat(18) + 'SIGNET AKRON'.padEnd(28, ' ') +
      this.getSysDateInYYYYMMDD() + '002.66';

    log.info(`ADS Dallas Header Record : ${adsDallasHeaderRecord}`)

    const serialNumber = await this.serialNumber(s3Data);
    log.info(`Serial Number : ${serialNumber}`);

    const transactionCount = serialNumber - 2;
    log.info(`Transaction Count : ${transactionCount}`);

    const returnValues = await this.getReturnValues(s3Data)

    const adsDallasTrailerRecord = '99' + String(serialNumber).padStart(7, '0') +
    '9'.repeat(18) + returnValues;

    log.info(`ADS Dallas Trailer Record : ${adsDallasTrailerRecord}`);

    const updatedContent = await s3Manager.updateSequenceNumber(s3Data);

    const newContent = adsDallasHeaderRecord + '\n' + updatedContent + '\n' + adsDallasTrailerRecord;

    return newContent;

  }

}