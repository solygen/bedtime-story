//#!/usr/bin/env node

    'use strict';

    let SpotifyWebApi = require('spotify-web-api-node');
    let _ = require('lodash');
    let storage = require('./storage');
    let prettyMilliseconds = require('pretty-ms');
    var debug = require('debug')('http');

    var spotifyApi = new SpotifyWebApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    });

    var expired = true

    // init
    module.exports = {

        init: function()  {

            if (!expired) return Promise.resolve(spotifyApi);

            // Retrieve an access token.
            return spotifyApi.clientCredentialsGrant().then(
                function(data) {
                    debug('access token', data.body['access_token'].slice(0, 16) + '...');
                    debug('expires in', data.body['expires_in']);
                    spotifyApi.setAccessToken(data.body['access_token']);
                    expired = false;
                    return spotifyApi;
                },
                function(err) {
                    debug('Something went wrong when retrieving an access token', err);
                }
            );
        },

        fetchAlbums: function (artist) {
            return this.init().then(function (spotifyApi) {

                    if (!(artist.albums || []).length) return Promise.resolve();

                    // TODO: dirty
                    let calls = artist.albums.map(function (album) {
                        if (album._duration) return;

                        return spotifyApi.getAlbumTracks(album.id, { limit: 50, offset : 0 }).then(function (data) {
                            let tracks = data.body.items;
                            debug('getAlbumTracks: ', tracks.length);
                            let duration = _.reduce(tracks, function(sum, track) {
                                return sum + track.duration_ms;
                              }, 0);

                            album._duration_ms = duration;
                            album._duration = prettyMilliseconds(duration, { secondsDecimalDigits: 0, unitCount: 2 });

                            return storage.save(artist);
                        });
                    });

                    return Promise.all(calls).then(function() {
                            //storage.save(artist);
                            return artist;
                        },
                        function(err) {
                            console.error(err);
                        }
                    );
                });

        },

        fetch: function (list) {
            return this.init().then(function (spotifyApi) {

                let calls = list.map(function (artist) {

                    if ((artist.albums || []).length) return Promise.resolve(artist);

                    // TODO: dirty
                    var calls = [
                        spotifyApi.getArtistAlbums(artist.id, { limit: 50, offset : 0 }),
                        spotifyApi.getArtistAlbums(artist.id, { limit: 50, offset : 50 }),
                        spotifyApi.getArtistAlbums(artist.id, { limit: 50, offset : 100 }),
                        spotifyApi.getArtistAlbums(artist.id, { limit: 50, offset : 150 }),
                        spotifyApi.getArtistAlbums(artist.id, { limit: 50, offset : 200 }),
                        spotifyApi.getArtistAlbums(artist.id, { limit: 50, offset : 250 })
                    ];

                    return Promise.all(calls).then(function(list) {
                            debug('getArtistAlbums:', list.length);
                            // pick albums
                            var items = _.map(list, function (data) { return data.body.items; });
                            // join
                            items = [].concat.apply([], items);
                            // set
                            artist.albums = _.chain(items).filter(artist.filter).map(artist.map).value();
                            storage.save(artist);
                            return artist;
                        },
                        function(err) {
                            console.error(err);
                        }
                    );
                });

                return Promise.all(calls);
            });
        }
    };

