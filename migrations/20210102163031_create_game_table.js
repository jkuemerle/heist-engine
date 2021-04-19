exports.up = function(knex) {
    return knex.schema.createTable('game', (table) => {
        table.increments('id');
        table.string('key');
        table.integer('players');
        table.string('state');
        table.string('currentAdmin');
        table.integer('optionid').unsigned();
        table.foreign('optionid').references('id').inTable('option');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('game');
};