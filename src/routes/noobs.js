import express  from 'express';
import database from '../database/mongo';

const router = express.Router({ mergeParams: true });

const fetchNoobs = (id, res) => {
  database.fetchNoobs(id, (docs) => {
    res.send(docs);
  })
};

router.route('/')
  .get((req, res) => fetchNoobs(null, res))
  .post((req, res) => database.insertNoob(req.body.noob, () => fetchNoobs(null, res)));

router.route('/:id')
  .get((req, res) => fetchNoobs(req.params.id, res))
  .delete((req, res) => database.deleteNoob(req.params.id, () => fetchNoobs(null, res)));

router.post('/:id/noob', (req, res) => {
  database.incrementNoobPoints(req.params.id, (doc) => fetchNoobs(req.params.id, res))
});

router.post('/:id/assassin', (req, res) => {
  database.incrementAssassinPoints(req.params.id, (doc) => fetchNoobs(req.params.id, res))
});

export default router;
