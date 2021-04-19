require('dotenv').config({ path: 'variables.env' });

const TEST_ENV = (process.env.HEIST_ENVIRONMENT && (process.env.HEIST_ENVIRONMENT === "DEV") || (process.env.HEIST_ENVIRONMENT === "LOCAL")) ? true : false;
const LOCAL_ENV = (process.env.HEIST_ENVIRONMENT && process.env.HEIST_ENVIRONMENT === "LOCAL") ? true : false;
const SEED_DATA = process.env.SEED_DATA;

const express = require("express");
const app = express();
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const dbconfig = require('./knexfile');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

var knex;
var envConfig;
if (LOCAL_ENV) {
    console.log("running as local");
    knex = require('knex')(dbconfig.development);
    envConfig = 'development';
} else {
    console.log("running non-local");
    knex = requestAnimationFrame('knex')(dbconfig.production);
    envConfig = 'production';
}

knex.migrate.latest(envConfig).then(() => {
    if (SEED_DATA) {
        return knex.seed.run();
    }
}).then(() => {
    console.log('Migration and/or seed completed.');
});

const du = require('./dataUtil');

const serverPort = process.env.PORT ? process.env.PORT : 4001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(serverPort, () => console.log(`app listening on port ${serverPort}!`))
app.use(express.static('public'));

app.get('/api/options', (req, res) => {
    du.getOptions(knex).then(result => {
        res.json(result);
        res.end();
    });
});

app.post('/api/newgame', (req, res) => {
    var players = parseInt(req.body.players);
    var optionkey = req.body.key;
    if (!players || !Number.isInteger(players) || players < 1 || players > 4) {
        res.status(400).send("Invalid players value.");
        res.end();
    } else {
        du.newGame(knex, players, optionkey).then((result) => {
            if (!result) {
                res.status(404);
            } else {
                res.json(result);
            }
            res.end();
        });
    }
});

app.post('/api/join', (req, res) => {
    du.joinGame(knex, req.body.key).then((result) => {
        if (result.success) {
            res.json({ key: result.playerKey, claimCode: result.claimCode });
            res.end();
        } else {
            res.status(404);
            res.end();
        }
    })
});

app.patch('/api/game', (req, res) => {
    var claim = req.body.claim;
    if (claim) {
        du.claimGame(knex, claim).then(result => {
            if (result && result.success) {
                res.json(result);
            } else {
                res.status(404);
            }
            res.end();
        });
    } else {
        res.status(404);
        res.end();
    }
});

app.get('/api/game', (req, res) => {
    var key = req.query.key;
    if (key) {
        du.getGame(knex, key).then(result => {
            if (result) {
                res.json(result);
            } else {
                res.status(404);
            }
            res.end();
        });
    } else {
        res.status(404);
        res.end();
    }
});

app.get('/api/player', (req, res) => {
    var key = req.query.key;
    if (key) {
        du.getPlayer(knex, key).then(result => {
            if (result) {
                res.json(result);
            } else {
                res.status(404);
            }
            res.end();
        });
    } else {
        res.status(404);
        res.end();
    }
});

app.patch('/api/player', (req, res) => {
    var claim = req.body.claim;
    if (claim) {
        du.claimPlayer(knex, claim).then(result => {
            if (result && result.success) {
                res.json(result);
            } else {
                res.status(404);
            }
            res.end();
        })
    } else {
        res.status(404);
        res.end();
    }
});

app.post('/api/player', (req, res) => {
    // var data = {
    //     claimCode: req.body.claim,
    //     playerName: req.body.playerName,
    //     characterName: req.body.characterName,
    //     description: req.body.description
    // };
    var data = req.body;
    if (data && data.claim) {
        du.updatePlayer(knex, data).then(result => {
            res.json(result);
            res.end();
        });
    } else {
        res.status(404);
        res.end();
    }
});

app.post('/api/bear', (req, res) => {
    var claimCode = req.body.claimCode;
    var advantage = req.body.advantage;
    if (!claimCode) {
        res.status(404);
        res.end();
    } else {
        du.checkStat(knex, claimCode, 'bear', advantage).then(result => {
            res.json(result);
            res.end();
        });
    }
});

app.post('/api/criminal', (req, res) => {
    var claimCode = req.body.claimCode;
    var advantage = req.body.advantage;
    if (!claimCode) {
        res.status(404);
        res.end();
    } else {
        du.checkStat(knex, claimCode, 'criminal', advantage).then(result => {
            res.json(result);
            res.end();
        });
    }
});