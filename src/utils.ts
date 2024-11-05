
import { readFileSync } from 'fs';

const getDataFromJSONReport = (reportPath: string, reportName: string) => {

    const jsonString = readFileSync(reportPath, 'utf8');
    try {
        const jsonData: any = JSON.parse(jsonString);

        console.log(`Name: ${reportName}`);
      
        
      } catch (error) {
        console.error('Error reading or parsing the JSON file:', error);
      }
      

    return {

    }
}

const cleanLog = (log: string) : string => {
    return log
} 

export {getDataFromJSONReport}