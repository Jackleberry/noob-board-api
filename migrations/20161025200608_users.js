
exports.up = function(knex, Promise) {
  return knex.schema
    .raw('ALTER TABLE users ALTER COLUMN username DROP NOT NULL')
    .raw('ALTER TABLE users ALTER COLUMN email DROP NOT NULL')
    .raw('ALTER TABLE users ALTER COLUMN password_digest DROP NOT NULL')
    .raw('ALTER TABLE users DROP CONSTRAINT users_username_unique')
    .raw('ALTER TABLE users DROP CONSTRAINT users_email_unique')
    .raw('ALTER TABLE users DROP CONSTRAINT users_password_digest_unique');
};

exports.down = function(knex, Promise) {
  return knex.schema
    .raw('ALTER TABLE users ALTER COLUMN username SET NOT NULL')
    .raw('ALTER TABLE users ALTER COLUMN email SET NOT NULL')
    .raw('ALTER TABLE users ALTER COLUMN password_digest SET NOT NULL')
    .raw('ALTER TABLE users ADD CONSTRAINT users_username_unique UNIQUE (username)')
    .raw('ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email)')
    .raw('ALTER TABLE users ADD CONSTRAINT users_password_digest_unique UNIQUE (password_digest)');
};
