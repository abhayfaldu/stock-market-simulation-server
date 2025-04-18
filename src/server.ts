import app from './app';
import config from './config/config';

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/items', (req, res) => {
  res.json({ message: 'Items fetched successfully' });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
