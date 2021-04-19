exports.up = function(knex) {
    return knex.schema.createTable('option', (table) => {
        table.increments('id');
        table.string('key');
        table.string('name');
        table.string('typeText');
        table.string('type1');
        table.string('type2');
        table.string('type3');
        table.string('type4');
        table.string('type5');
        table.string('type6');
        table.string('type1image');
        table.string('type2image');
        table.string('type3image');
        table.string('type4image');
        table.string('type5image');
        table.string('type6image');
        table.string('specialtyText');
        table.string('specialty1');
        table.string('specialty2');
        table.string('specialty3');
        table.string('specialty4');
        table.string('specialty5');
        table.string('specialty6');
        table.string('hatText');
        table.string('hat1');
        table.string('hat2');
        table.string('hat3');
        table.string('hat4');
        table.string('hat5');
        table.string('hat6');
        table.string('hat1image');
        table.string('hat2image');
        table.string('hat3image');
        table.string('hat4image');
        table.string('hat5image');
        table.string('hat6image');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('option');
};