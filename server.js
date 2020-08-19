//#!/usr/bin/env node

(function () {

    'use strict';

    const debug = require('debug')('server')
    require('dotenv').config()

    module.exports = {
        serve: function (artists, pickRandomAlbums) {
            const express = require('express')
            const app = express()
            const port = process.env.PORT || 80

            app.set('view engine', 'ejs');

            app.get('/', (req, res) => {
                res.render('index', {
                    albums: pickRandomAlbums(artists)
                });
            })

            app.get('/fetch', (req, res) => {

            })

            app.listen(port, () => {
                debug(`Listening at http://localhost:${port}`)
            })
        }

    }

}());
