import express  from 'express';
import bcrypt from 'bcryptjs';
import commonValidations from '../../validation/users';
import User from '../../models/user';
import isEmpty from 'lodash/isEmpty';
import jwt from 'jsonwebtoken';
import config from '../../config';

const router = express.Router({ mergeParams: true });

const validateInput = (data, otherValidations) => {
  const { errors } = otherValidations(data);

  return User.query({
    where: { username: data.username },
    orWhere: { email: data.email}
  }).fetch().then(user => {
    if (user) {
      if (user.get('username') == data.username) {
        errors.username = "There is a user with this username.";
      }
      if (user.get('email') == data.email) {
        errors.email = "There is a user with this email.";
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    }
  });
};

router.post('/', (req, res) => {
  console.log("Signing up user.");
  validateInput(req.body.user, commonValidations).then(({errors, isValid}) => {
    if (isValid) {
      const { username, email, password } = req.body.user;
      const password_digest = bcrypt.hashSync(password, 10);

      User.forge({
        username,
        email,
        password_digest
      }, {
        hasTimestamps: true
      }).save()
        .then(user => {
          const token = jwt.sign({
            id: user.get("id"),
            username: user.get("username"),
            email: user.get("email")
          }, config.jwtSecret);
          console.log("Returning success data: ", {
            id: user.get("id"),
            username: user.get("username"),
            email: user.get("email"),
            token
          });
          res.json({
            id: user.get("id"),
            username: user.get("username"),
            email: user.get("email"),
            token
          });
        })
        .catch(err => {
          console.log("oh dear failures: ", err);
          res.status(500).json({ error: err });
        });
    } else {
      console.log("Returning data: ", Object.keys(errors).map(key => errors[key]));
      res.status(400).json({ errors: Object.keys(errors).map(key => errors[key]) });
    }
  });
});

export default router;
