import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateInput(data) {
  let errors = {};

  console.log(data);

  if (Validator.isNull(data.username)) {
    errors.username = 'Username is a required field';
  }

  if (Validator.isNull(data.email)) {
    errors.email = 'Email is a required field';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isNull(data.password)) {
    errors.password = 'Password is a required field';
  }

  if (Validator.isNull(data.passwordConfirmation)) {
    errors.passwordConfirmation = 'Confirm Password is a required field';
  }

  if (!Validator.equals(data.password, data.passwordConfirmation)) {
    errors.passwordConfirmation = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
