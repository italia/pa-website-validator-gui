import express from 'express';

const app = express();

// Imposta EJS come motore di template
app.set('view engine', 'ejs');

// Configura la cartella 'public' per servire file statici come CSS
app.use(express.static('public'));

// Route
app.get('/', (req, res) => {
  //   const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  const data = {
    publicPath: '',
    crawlerVersion: '1.0.0',
  };
  res.render('index', data);
});

// Avvio del server
app.listen(3000, () => {
  console.log('Server in ascolto sulla porta 3000', 'http://localhost:3000/');
});
