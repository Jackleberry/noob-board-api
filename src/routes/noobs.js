import express  from 'express';
import database from '../database/mongo';

const router = express.Router({ mergeParams: true });

router.get('/', (req, res) => {
  database.fetchNoobs(null, (docs) => {
    res.send(docs);
  });
});

router.route('/:noob')
  .get((req, res) => {
    database.fetchNoobs(req.params.noob, (docs) => {
      res.send(docs);
    })
  })
  .post((req, res) => {
    database.insertNoob(req.params.noob, () => database.fetchNoobs(null, (docs) => {
      res.send(docs);
    }));
  });

export default router;
