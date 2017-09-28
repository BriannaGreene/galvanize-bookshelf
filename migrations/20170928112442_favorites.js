
exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', function(t) {
    t.increments()
    t.integer('user_id').notNullable().references('id').inTable('users').onDelete('cascade')
    t.integer('book_id').notNullable().references('id').inTable('books').onDelete('cascade')
    t.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('favorites')
};
