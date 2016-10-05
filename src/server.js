import express from 'express';
import noobs from './routes/noobs';

const port = 3002;
const app = express();

app.use('/noobs', noobs);

app.listen(port, (error) => {
  if (error) {
      console.log(error);
  } else {
    console.log(`Running noob board api on http://localhost:${port}`);
  }
});
