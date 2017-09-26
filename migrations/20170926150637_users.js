
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(t) {
    t.increments('id')
    t.varchar('first_name', 255).notNullable().defaultTo("")
    t.varchar('last_name', 255).notNullable().defaultTo("")
    t.varchar('email', 255).notNullable()
    t.string('hashed_password', 60).notNullable()
    t.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
};
