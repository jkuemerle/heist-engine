exports.up = function(knex) {
    return knex.schema.createTable('player', (table) => {
        table.increments('id');
        table.string('key');
        table.integer('gameid').unsigned().notNullable();
        table.string('playerName');
        table.string('characterName');
        table.string('hat');
        table.string('type');
        table.string('specialty');
        table.string('bear');
        table.string('criminal');
        table.string('description');
        table.string('pictureImage');
        table.string('hatImage');
        table.string('claimCode');
        table.foreign('gameid').references('id').inTable('game');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('player');
};