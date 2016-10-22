import express  from 'express';
import bcrypt from 'bcryptjs';
import commonValidations from '../validation/users';
import User from '../models/user';
import isEmpty from 'lodash/isEmpty';

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
        .then(user => res.json({ success: true }))
        .catch(err => res.status(500).json({ error: err }));
    } else {
      res.status(400).json(errors);
    }
  });
});

export default router;
