import express from 'express';

const app = express();

// Imposta EJS come motore di template
app.set('view engine', 'ejs');

// Configura la cartella 'public' per servire file statici come CSS
app.use(express.static('public'));

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

// Avvio del server
app.listen(3000, (res) => {
  console.log('Server in ascolto sulla porta 3000', 'http://localhost:3000/');
});
