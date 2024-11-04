import * as ejs from 'ejs'
import path from 'path';
import {writeFileSync} from 'fs'

//TODO: get this from crawler in node_modules 
const data = {
    crawlerVersion: '1.0.0',
    publicPath: "public/",
    currentPage: ''
};

// rebuild html when page changes
//   function loadPage(page) {
//     const filePath = path.join('views', `index.ejs`);
//     data.currentPage = page;
//     ejs.renderFile(filePath, data, {}, (err, str) => {
//         if (err) {
//             console.error("Error rendering EJS:", err);
//             return;
//         }
//         const outputPath = path.join('./', 'index.html');
//         fs.writeFile(outputPath, str, (err) => {
//           if (err) {
//             console.error('Errore nel salvare il file HTML:', err);
//           } else {
//             console.log('File HTML generato con successo:', outputPath);
//             mainWindow.loadFile('index.html');
//           }
//         });
    
//     });
//   }
  

const templatePath = path.join('src/views', 'index.ejs');

ejs.renderFile(templatePath, data, {}, (err, str) => {
    if (err) {
      console.error('Errore nel renderizzare il template EJS:', err);
      return;
    }
    const outputPath = path.join('./dist', 'index.html');

    writeFileSync(outputPath, str)
});
