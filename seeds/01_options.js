exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('option').del()
        .then(function() {
            // Inserts seed entries
            return knex('option').insert([{
                    id: 1,
                    key: '0000001',
                    name: 'Honey Heist',
                    typeText: 'Bear',
                    type1: 'Grizzly (Terrify)',
                    type2: 'Polar (Swim)',
                    type3: 'Panda (Eat bamboo)',
                    type4: 'Black (Climb)',
                    type5: 'Sun (Sense Honey)',
                    type6: 'Honey Badger (Carnage)',
                    specialtyText: 'Role',
                    specialty1: 'Muscle',
                    specialty2: 'Brains',
                    specialty3: 'Driver',
                    specialty4: 'Hacker',
                    specialty5: 'Thief',
                    specialty6: 'Face',
                    hatText: 'Hat',
                    hat1: 'Top',
                    hat2: 'Bowler',
                    hat3: 'Cowboy',
                    hat4: 'Fez',
                    hat5: 'Crown',
                    hat6: 'Trilby'
                },
                {
                    id: 2,
                    key: '0000002',
                    name: 'Hogwarts Heist',
                    typeText: 'Troll',
                    type1: 'Mountain',
                    type2: 'River',
                    type3: 'Ice',
                    type4: 'Forest',
                    type5: 'Junkyard',
                    type6: 'Yeti',
                    specialtyText: 'Specialty',
                    specialty1: 'Weightlifter',
                    specialty2: 'Security',
                    specialty3: 'Spellcaster',
                    specialty4: 'Cleaner',
                    specialty5: 'Lifeguard',
                    specialty6: 'Bridge Keeper',
                    hatText: 'Hat',
                    hat1: 'Top',
                    hat2: 'Cowboy',
                    hat3: 'Fez',
                    hat4: 'Crown',
                    hat5: 'Witch/Wizard',
                    hat6: 'Pom-Pom'
                }
            ]);
        });
};