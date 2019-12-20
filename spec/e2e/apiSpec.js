'use strict';
var request = require('request');
var dbSession = require('../../src/backend/dbSession.js');
var Server = require('../../src/backend/server.js').Server;
var resetDatabase = require('../resetDatabase.js');
var async = require('async');

describe('The API', function () {

    var server;
    beforeEach(function (done) {
        server = Server('8081');
        server.listen(function (err) {
            resetDatabase(dbSession, function () {
                done(err);
            });
        });
    });

    afterEach(function (done) {
        server.close(function () {
            resetDatabase(dbSession, function () {
                done();
            });
        });
    });

    it('just works', function () {
        expect(true).toBe(true);
    });

    it('should create a new keyword when receiving a POST request at /api/keywords/', function (done) {
        var expected = {
            "_items": [
                {'id': 1, 'value': 'Aubergine', 'categoryID': 1},
                {'id': 2, 'value': 'Onion', 'categoryID': 1}
            ]
        };
        var body = {
            'value': 'Onion',
            'categoryID': 1
        };

        async.series(
            [
                function (callback) {
                    dbSession.insert(
                        'category',
                        {'name': 'Vegetable'},
                        function (err) {
                            callback(err)
                        })
                },
                function (callback) {
                    dbSession.insert(
                        'keyword',
                        {'value': 'Aubergine', 'categoryID': 1},
                        function (err) {
                            callback(err)
                        });
                }
            ],

            function (err, results) {
                if (err) throw(err);
                request.post(
                    {
                        'url': 'http://localhost:8081/api/keywords/',
                        'body': body,
                        'json': true
                    },
                    function (err, res, body) {
                        if (err) throw(err);
                        expect(res.statusCode).toBe(200);
                        request.get(
                            {
                                'url': 'http://localhost:8081/api/keywords/',
                                'json': true
                            },
                            function (err, res, body) {
                                expect(res.statusCode).toBe(200);
                                expect(body).toEqual(expected);
                                done();
                            }
                        );
                    }
                );
            }
        );
    });
});