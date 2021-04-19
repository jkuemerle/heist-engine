exports.initDatabase = (conn) => {
    gameTable(conn);
    playerTable(conn);
};

function gameTable(conn) {
    conn.schema.createTable('game', (table) => {
        table.increments('id');
        table.string('key');
        table.integer('players');
        table.string('state');
        table.string('currentAdmin');
    });
};

function playerTable(conn) {
    conn.schema.createTable('player', (table) => {
        table.increments('id');
        table.string('key');
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
    });
}