import express from 'express';
import path from 'path'
const __dirname = import.meta.dirname;
const app = express();

// Imposta EJS come motore di template

app.set('view engine', 'ejs');
// Set the views directory
console.log( path.join(__dirname, 'views'))
app.set('views', path.join(__dirname, 'views'));

// Configura la cartella 'public' per servire file statici come CSS
app.use(express.static('dist/public/'));

// Route
const data = {
  publicPath: '',
  crawlerVersion: '1.0.0',
  currentPage: '',
};
app.get(['/', "/home"], (req, res) => {
  data.currentPage = ""
  res.render('index', data);
});
app.get('/history', (req, res) => {
  data.currentPage = "history"
  res.render('index', data);
});
app.get('/report', (req, res) => {
  data.currentPage = "report"
  res.render('index', data);
});

app.listen(3000, () => {
  console.log('Server in ascolto sulla porta 3000', 'http://localhost:3000/');
});
