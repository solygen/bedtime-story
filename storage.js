//#!/usr/bin/eenv node

    const jsonfile = require('jsonfile');
    const fs = require('fs');
    const debug = require('debug')('storage')


    function save(artist) {
        const file = __dirname + '/tmp/' + artist.id + '.json';

        jsonfile.writeFile(file, artist, { spaces: 2 })
            .then(res => {
                console.log('Write complete')
            })
            .catch(error => console.error(error))
    }

    function read(artist) {
        const file = __dirname + '/tmp/' + artist.id + '.json';

        if (!fs.existsSync(file)) return Promise.resolve(artist);
        return jsonfile.readFile(file)
            .catch(error => console.error(error))
    }

    module.exports = {
        list: function () {

        },

        set: function () {

        },

        save: function (artist) {
            if (!artist) return console.log(artist);
            debug('save', artist.label);
            save(artist)
        },

        update: function () {

        },

        get: function (artist) {
            debug('read', artist.label);
            return read(artist);
        }
    }

