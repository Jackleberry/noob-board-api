import express  from 'express';
import database from '../database/mongo';

const router = express.Router({ mergeParams: true });

const fetchNoobs = (name, res) => {
  database.fetchNoobs(name, (docs) => {
    res.send(docs);
  })
};

router.get('/', (req, res) => fetchNoobs(null, res));

router.route('/:noob')
  .get((req, res) => fetchNoobs(req.params.noob, res))
  .post((req, res) => database.insertNoob(req.params.noob, () => fetchNoobs(null, res)))
  .delete((req, res) => database.deleteNoob(req.params.noob, () => fetchNoobs(null, res)));

router.post('/:noob/noob', (req, res) => {
  database.incrementNoobPoints(req.params.noob, (doc) => fetchNoobs(req.params.noob, res))
});

router.post('/:noob/assassin', (req, res) => {
  database.incrementAssassinPoints(req.params.noob, (doc) => fetchNoobs(req.params.noob, res))
});

export default router;
