
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.string('name').after('password_digest');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('name');
  });
};
