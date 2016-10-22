import express from 'express';
import bodyParser from 'body-parser';
import noobs from './routes/noobs';
import auth from './routes/auth';
import users from './routes/users';

const port = process.env.PORT || 3002;
const app = express();

app.get('/', (req, res) => {
  res.send("Hello World");
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api/noobs', noobs);
app.use('/api/auth', auth);
app.use('/api/users', users);

app.listen(port, (error) => {
  if (error) {
      console.log(error);
  } else {
    console.log(`Running noob board api on http://localhost:${port}`);
  }
});
