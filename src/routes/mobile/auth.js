import express  from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';
import User from '../../models/user';

const router = express.Router({ mergeParams: true });

router.post('/', (req, res) => {
  const { identifier, password } = req.body;
  User.query({
    where: { username: identifier},
    orWhere: { email: identifier }
  }).fetch().then(user => {
    if (user) {
      if (bcrypt.compareSync(password, user.get("password_digest"))) {
        const token = jwt.sign({
          id: user.get("id"),
          username: user.get("username"),
          email: user.get("email")
        }, config.jwtSecret);
        res.json({
          id: user.get("id"),
          username: user.get("username"),
          email: user.get("email"),
          token
        });
      } else {
        res.status(401).json({ errors: ["Invalid Credentials"] });
      }
    } else {
      res.status(401).json({ errors: ["Invalid Credentials"] })
    }
  });
});

router.post('/facebook', (req, res) => {
  const { id: facebookUserId, email, name } = req.body;
  User.query({
    where: { facebookUserId },
  }).fetch().then(user => {
    if (user) {
      signAndRespond(res, user.get("id"), facebookUserId, user.get("username"), email, name);
    } else {
      User.forge({
        facebookUserId,
        email,
        name
      }, {
        hasTimestamps: true
      }).save().then(user => {
        if (user) {
          signAndRespond(res, user.get("id"), facebookUserId, user.get("username"), email, name);
        } else {
          res.status(401).json({ errors: ["Invalid Credentials"] })
        }
      });
    }
  });
});

function signAndRespond(res, id, facebookUserId, username, email, name) {
  const token = jwt.sign({
    id,
    facebookUserId
  }, config.jwtSecret);
  res.json({ id, facebookUserId, username, email, token, name });
}

export default router;
