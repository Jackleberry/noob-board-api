import express  from 'express';
import database from '../database/mongo';

const router = express.Router({ mergeParams: true });

const fetchNoobs = (id, res) => {
  database.fetchNoobs(id, (docs) => {
    res.send(docs);
  })
};

const fetchNoob = (id, res) => {
  database.fetchNoobs(id, (docs) => {
    if (docs.length > 0) {
      res.send(docs[0]);
    } else {
      res.status(404).json(`Could not find noob with id: ${id}`);
    }
  })
};

router.route('/')
  .get((req, res) => fetchNoobs(null, res))
  .post((req, res) => database.insertNoob(req.body.noob, () => fetchNoobs(null, res)));

router.route('/:id')
  .get((req, res) => fetchNoob(req.params.id, res))
  .delete((req, res) => database.deleteNoob(req.params.id, () => fetchNoobs(null, res)));

router.post('/:id/noob/increment', (req, res) => {
  database.incrementNoobPoints(req.params.id, (doc) => fetchNoob(req.params.id, res))
});

router.post('/:id/assassin/increment', (req, res) => {
  database.incrementAssassinPoints(req.params.id, (doc) => fetchNoob(req.params.id, res))
});

router.post('/:id/noob/decrement', (req, res) => {
  database.decrementNoobPoints(req.params.id, (doc) => fetchNoob(req.params.id, res))
});

router.post('/:id/assassin/decrement', (req, res) => {
  database.decrementAssassinPoints(req.params.id, (doc) => fetchNoob(req.params.id, res))
});

export default router;
