
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.string('facebookUserId').after('password_digest');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('facebookUserId');
  });
};
