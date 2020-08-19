//#!/usr/bin/env node

let storage = require('./storage');

let SMALLARTISTS = [
    {
        label: 'Die kleine Schnecke Monika Häuschen',
        id: '7oP5DXnOMb2Wbe5Yt1aDi9',
        filter: function (album) {
            var reName = /^\d{1,2}\:/g
            return reName.test(album.name);
        },
        map: function (album) {
            var reIndex = /^\d{1,2}\:/;
            album._index = parseInt((album.name.match(reIndex)[0]), 10);
            return album;
        }
    }, {
        label: 'Der kleine Hui Buh',
        id: '5uXwgEQqIIIMsyi0LlRZDn',
        filter: function (album) {
            var reName = /^\d{1,3}\//g
            return reName.test(album.name);
        },
        map: function (album) {
            var reIndex = /^\d{1,3}/;
            album._index = parseInt((album.name.match(reIndex)[0]), 10);
            return album;
        }
    }, {
        label: 'Xanti',
        id: '3yZuyjKLxn8RH5dOuGd4eC',
        filter: function (album) {
            return album.name.indexOf('Folge') === 0;
        },
        map: function (album) {
            var reIndex = /^Folge\s\d{1,2}/g;
            album._index = parseInt((album.name.match(reIndex)[0]).replace('Folge ', ''), 10);
            return album;
        }
    }, {
        label: 'Bibi Blocksberg',
        id: '3t2iKODSDyzoDJw7AsD99u',
        filter: function (album) {
            return album.name.indexOf('Folge') === 0;
        },
        map: function (album) {
            var reIndex = /^Folge\s\d{1,3}/g;
            album._index = parseInt((album.name.match(reIndex)[0]).replace('Folge ', ''), 10);
            return album;
        }
    }, {
        label: 'Bibi & Tina',
        id: '2x8vG4f0HYXzMEo3xNsoiI',
        filter: function (album) {
            return album.name.indexOf('Folge') > -1;
        },
        map: function (album) {
            var reIndex = /^Folge\s\d{1,3}/g;
            album._index = parseInt((album.name.match(reIndex)[0]).replace('Folge ', ''), 10);
            return album;
        }
    }
];

let ARTISTS = [
    {
        label: 'Point Whitmark',
        id: '39cu39Rn69BTbnblNDijGN',
        filter: function (album) {
            var reName = /^\d{1,3}\//g
            return reName.test(album.name);
        },
        map: function (album) {
            var reIndex = /^\d{1,3}/;
            // why groups dont work here
            album._index = parseInt((album.name.match(reIndex)[0]), 10);
            return album;
        }
    }, {
        label: 'Die drei ???',
        id: '3meJIgRw7YleJrmbpbJK6S',
        filter: function (album) {
            var reName = /^\d{1,3}\//g
            return reName.test(album.name);
        },
        map: function (album) {
            var reIndex = /^\d{1,3}/;
            // why groups dont work here
            album._index = parseInt((album.name.match(reIndex)[0]), 10);
            return album;
        }
    }
];

module.exports = {
    list: function () {
        //return SMALLARTISTS;
        return ARTISTS;
    },

    fetch: function () {
        let calls = this.list().map(function (artist) {
            return storage.get(artist).then(function(data) {
                    artist.albums = data.albums;
                    return artist;
                },
                function(err) {
                    console.error(err);
                }
            );
        });

        return Promise.all(calls);
    }
}

