//#!/usr/bin/env node

(function () {

    'use strict';

    require('dotenv').config()

    let supportsColor = require('supports-color');
    let _ = require('lodash');
    let spotify = require('./spotify');
    let artists = require('./artists');
    let server = require('./server');
    let storage = require('./storage');

    artists.fetch().then(function () {
        spotify.fetchAlbums(artists.list()[1]);
    });

    artists.fetch().then(function () {
        spotify.fetch(artists.list()).then(function () {
            server.serve(artists.list(), pickRandomAlbums);
        })
    });

    function pickRandomAlbums(artists, limit=3) {
        var list = artists.map(function (artist) {
            // Dirty
            return artist.albums;
        });
        let selection = _.shuffle(_.flatten(list)).slice(0, limit)
        return _.orderBy(selection, ['_index'],['asc']);
    }

}());
