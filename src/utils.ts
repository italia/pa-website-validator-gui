
import { readFileSync } from 'fs';

const getDataFromJSONReport = (reportPath: string) => {

    const jsonString = readFileSync(reportPath, 'utf8');
    let jsonData: any = '';
    try {
        jsonData  = JSON.parse(jsonString);

    } catch (error) {
        console.error('Error reading or parsing the JSON file:', error);
      }

      let failedAudits: string[] = [];
      let generalResult = 0;
      Object.keys(jsonData.audits).forEach(key => {
          if(jsonData.audits[key].specificScore === 0){
              generalResult = 0;
              failedAudits.push(key);
          }else if(jsonData.audits[key].specificScore === -1){
              generalResult = -1;
              failedAudits.push(key);
          }
      })

    return {
          generalResult,
          failedAudits
    }
}

const cleanLog = (log: string) : string => {
    return log
} 

export {getDataFromJSONReport}