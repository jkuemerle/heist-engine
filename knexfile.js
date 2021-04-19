// Update with your config settings.

module.exports = {

    development: {
        client: 'sqlite3',
        connection: {
            filename: process.env.SQLITE_FILENAME
        }
    },

    staging: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },

    production: {
        client: 'mysql',
        connection: () => process.env.JAWSDB_URL
    },

};