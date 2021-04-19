const { v4: uuidv4 } = require('uuid');
const hri = require('human-readable-ids').hri;
const sqlite3 = require('sqlite3');
const random = require('random');

exports.getOptions = (knex) => {
    return knex('option').select('key', 'name').then(result => {
        return result;
    });
};

exports.newGame = (knex, players, optionKey) => {
    key = hri.random();
    adminClaim = uuidv4();
    return knex('option').select('id', 'key').where({ key: optionKey }).then(optresult => {
        if (!optresult || optresult.length != 1) {
            return null;
        }
        return knex('game').insert({ key: key, players: players, state: 'New', currentAdmin: adminClaim, optionid: optresult[0].id }).then(() => {
            console.log('created: ' + key);
            return { key: key, adminClaim: adminClaim };
        })

    })
};

exports.joinGame = (knex, key) => {
    var game;
    return new Promise((resolve, reject) => {
        knex('game').where({ key: key }).select('id', 'key', 'currentAdmin', 'players', 'optionid').then((result) => {
            game = result;
        }).then(() => {
            if (!game || game.length != 1) {
                resolve({ success: false });
                return { success: false };
            } else {
                knex('player').select('id', 'type', 'specialty', 'hat').where({ gameid: game[0].id }).then(players => {
                    console.log(players);
                    if (players.length < game[0].players) {
                        var stuff = uniqueBear(players);
                        var player = {
                            key: hri.random(), //uuidv4(),
                            hat: stuff.hat, //random.int(1, 6),
                            type: stuff.type, //random.int(1, 6),
                            specialty: stuff.specialty, //random.int(1, 6),
                            bear: 3,
                            criminal: 3,
                            claimCode: uuidv4(),
                            gameid: game[0].id
                        };
                        knex('player').insert(player).then(() => {
                            ret = { success: true, playerKey: player.key, claimCode: player.claimCode };
                            resolve(ret);
                            return ret;
                        })
                    } else {
                        resolve({ success: false });
                        return { success: false };
                    }
                });
            }
        });
    });
};

function uniqueBear(players) {
    var ret = {
        hat: random.int(1, 6),
        type: random.int(1, 6),
        specialty: random.int(1, 6),

    };
    var curtypes = players.map((item) => {
        return parseInt(item.type);
    });
    var curspecs = players.map((item) => {
        return parseInt(item.specialty);
    });
    var curhats = players.map((item) => {
        return parseInt(item.hat);
    });
    if (players.count > 6) {
        return ret;
    } else {
        while (curtypes.indexOf(ret.type) != -1) {
            ret.type = random.int(1, 6);
        }
        while (curspecs.indexOf(ret.specialty) != -1) {
            ret.specialty = random.int(1, 6);
        }
        while (curhats.indexOf(ret.hat) != -1) {
            ret.hat = random.int(1, 6);
        }
    }
    return ret;
}

exports.getGame = (knex, key) => {
    var game = null;
    var ret = {};
    return new Promise((resolve, reject) => {
        knex('game').where({ key: key }).select('id', 'key', 'players', 'state', 'optionid').first().then((gresult) => {
            if (!gresult || !gresult.id) {
                resolve(null);
                return null;
            }
            game = gresult;
            ret.key = game.key;
            ret.state = game.state;
            knex('player').where({ gameid: game.id })
                .select('key', 'playerName', 'characterName', 'hat', 'type', 'specialty', 'bear', 'criminal', 'description',
                    'pictureImage', 'hatImage').then(players => {
                    ret.players = [];
                    for (var i = 0; i < players.length; i++) {
                        ret.players.push(players[i]);
                    }
                    if (!game.optionid) {
                        ret.options = defaultOptions();
                    } else {
                        knex('option').where({ id: game.optionid }).select().then(opts => {
                            if (opts.length != 1) {
                                ret.options = defaultOptions();
                            } else {
                                opt = opts[0];
                                ret.options = {
                                    type: { text: opt.typeText, options: [{ key: 1, value: opt.type1 }, { key: 2, value: opt.type2 }, { key: 3, value: opt.type3 }, { key: 4, value: opt.type4 }, { key: 5, value: opt.type5 }, { key: 6, value: opt.type6 }] },
                                    specialty: { text: opt.specialtyText, options: [{ key: 1, value: opt.specialty1 }, { key: 2, value: opt.specialty2 }, { key: 3, value: opt.specialty3 }, { key: 4, value: opt.specialty4 }, { key: 5, value: opt.specialty5 }, { key: 6, value: opt.specialty6 }] },
                                    hat: { text: opt.hatText, options: [{ key: 1, value: opt.hat1 }, { key: 2, value: opt.hat2 }, { key: 3, value: opt.hat3 }, { key: 4, value: opt.hat4 }, { key: 5, value: opt.hat5 }, { key: 6, value: opt.hat6 }] }
                                };
                            }
                            resolve(ret);
                            return ret;
                        })
                    }
                });
        });
    });
};

function defaultOptions() {
    return {
        type: { text: "Type", options: [{ key: 1, value: "Type-1" }, { key: 2, value: "Type-2" }, { key: 3, value: "Type-3" }, { key: 4, value: "Type-4" }, { key: 5, value: "Type-5" }, { key: 6, value: "Type-6" }] },
        specialty: { text: "Specialty", options: [{ key: 1, value: "Spec-1" }, { key: 2, value: "Spec-2" }, { key: 3, value: "Spec-3" }, { key: 4, value: "Spec-4" }, { key: 5, value: "Spec-5" }, { key: 6, value: "Spec-6" }] },
        hat: { text: "Hat", options: [{ key: 1, value: "Hat-1" }, { key: 2, value: "Hat-2" }, { key: 3, value: "Hat-3" }, { key: 4, value: "Hat-4" }, { key: 5, value: "Hat-5" }, { key: 6, value: "Hat-6" }] }
    }
};

exports.claimGame = (knex, claim) => {
    // verify claim code, generate new claim code and return player
    var game = null;
    return new Promise((resolve, reject) => {
        knex('game').select('id', 'key', 'currentAdmin').where({ currentAdmin: claim }).then(result => {
            if (!result || result.length != 1) {
                resolve({ success: false });
                return { success: false };
            }
            game = result[0];
            game.currentAdmin = uuidv4();
            knex('game').where({ id: game.id }).update({ currentAdmin: game.currentAdmin }).then(update => {
                var ret = { success: true, key: game.key, currentAdmin: game.currentAdmin };
                resolve(ret);
                return ret;
            });

        });
    });
}

exports.getPlayer = (knex, key) => {
    return knex('player').select('key', 'playerName', 'characterName', 'hat', 'type', 'specialty', 'bear', 'criminal', 'description', 'pictureImage', 'hatImage')
        .where({ key: key }).first().then((result) => {
            if (!result) {
                //resolve(null);
                return null;
            } else {
                //resolve(result);
                return result;
            }
        });
};

exports.claimPlayer = (knex, claim) => {
    // verify claim code, generate new claim code and return player
    var player = null;
    return new Promise((resolve, reject) => {
        knex('player').select('id', 'key', 'claimCode').where({ claimCode: claim }).then(result => {
            if (!result || result.length != 1) {
                resolve({ success: false });
                return { success: false };
            }
            player = result[0];
            player.claimCode = uuidv4();
            knex('player').where({ id: player.id }).update({ claimCode: player.claimCode }).then(update => {
                var ret = { success: true, playerKey: player.key, claimCode: player.claimCode };
                resolve(ret);
                return ret;
            });

        });
    });
}

exports.updatePlayer = (knex, data) => {
    var xformed = {
        claimCode: data.claim,
        playerName: data.playerName,
        characterName: data.characterName,
        description: data.description
    };
    return knex('player').where({ claimCode: xformed.claimCode }).update(xformed).then(update => {
        var ret = null;
        if (update) {
            ret = { success: true };
        } else {
            ret = { success: false };
        }
        return ret;
    });

};

exports.checkStat = (knex, claimCode, stat, advantage) => {
    var player = null;
    var game = null;
    var adv = advantage;
    return new Promise((resolve, reject) => {
        knex('player').select('id', 'key', 'gameid', 'bear', 'criminal').where({ claimCode: claimCode }).first().then((result) => {
            if (!result) {
                resolve(null);
                return null;
            } else {
                player = result;
                knex('game').select('id', 'key', 'players', 'state').where({ id: player.gameid }).first().then((gresult) => {
                    if (!gresult) {
                        resolve(null);
                        return null;
                    }
                    game = gresult;
                    if (game.state == "Ended") {
                        resolve(null);
                        return null;
                    }
                    var roll1 = random.int(1, 6);
                    var roll2 = random.int(1, 6);
                    var bestRoll = roll1
                    if (adv && roll2 < roll1) {
                        bestRoll = roll2;
                    }
                    var newBear = null;
                    var newCriminal = null;
                    var success = false;
                    var statValue = stat.toLowerCase() == "bear" ? parseInt(result.bear) : parseInt(result.criminal);
                    var gameState = 'Active';
                    if (bestRoll <= statValue) { // parseInt(result.bear)) {
                        // success, bear point to criminal
                        if (parseInt(result.bear) > 0) {
                            newBear = parseInt(result.bear) - 1;
                            newCriminal = parseInt(result.criminal) + 1;
                            success = true;
                        } else {
                            newBear = parseInt(result.bear);
                            newCriminal = parseInt(result.criminal);
                            success = false;
                        }
                    } else {
                        // fail, criminal point to bear
                        if (result.bear < 6) {
                            newBear = parseInt(result.bear) + 1;
                            newCriminal = parseInt(result.criminal) - 1;
                        } else {
                            newBear = parseInt(result.bear);
                            newCriminal = parseInt(result.criminal);
                        }
                        success = false;
                    }
                    if (newBear < 1 || newBear > 5 || newCriminal < 1 || newCriminal > 5) {
                        gameState = "Ended";
                    }
                    knex('game').where({ id: game.id }).update({ state: gameState }).then(gupdate => {
                        knex('player').where({ id: result.id }).update({ bear: newBear, criminal: newCriminal }).then((update) => {
                            var res = { success: success, bear: newBear, criminal: newCriminal, roll1: roll1 };
                            if (adv) {
                                res.roll2 = roll2;
                            }
                            resolve(res);
                            return res;
                        });
                    });
                });
            }
        });
    });
};