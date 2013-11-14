/*jslint node: true, nomen: true, stupid: true */
/*global YUI: true, YUITest: true */

YUI.add('addon-rs-hotswap-yui-tests', function (Y, NAME) {
    'use strict';

    //-- Mock resource store --------------------------------------------------

    function MockRS() {
        MockRS.superclass.constructor.apply(this, arguments);
    }

    MockRS.NAME = 'MockResourceStore';
    MockRS.ATTRS = {};

    Y.extend(MockRS, Y.Base);

    //-- Mock resource store config addon -------------------------------------

    function MockConfigAddon() {
        MockConfigAddon.superclass.constructor.apply(this, arguments);
    }

    MockConfigAddon.NAME = 'MockConfigAddon';
    MockConfigAddon.NS = 'config';
    MockConfigAddon.ATTRS = {};

    Y.extend(MockConfigAddon, Y.Base, {

        readConfigSimple: function () {
            return {

                'a0 > b0': {
                    'c0 > text': 'foobar'
                },

                'a1': {
                    'b1': {
                        'c1': {
                            'text': 'foobar'
                        }
                    }
                },

                '    a2 >    b2  >  c2    ': {
                    'text': 'foobar'
                },

                'a3': {
                    'b3': {
                        'c3': {
                            'text': 'foobar'
                        }
                    }
                },

                'a4 > b4 > c4 > text': 'foobar',

                'array': [{
                    'a5': {
                        'b5 > c5 > text': 'foobar'
                    }
                }]
            };
        }
    });

    //-- Unit tests for the config expansion resource store addon -------------

    var libpath = require('path'),
        A = YUITest.Assert,
        suite = new YUITest.TestSuite(NAME),
        moduleName = 'addon-rs-config-expansion',
        modules = {},
        store;

    modules[moduleName] = {
        requires: ['plugin', 'event-custom-base', 'oop'],
        fullpath: libpath.join(__dirname, '../addons/rs/config-expansion.server.js')
    };

    Y.applyConfig({
        modules: modules
    });

    Y.use(moduleName);

    suite.add(new YUITest.TestCase({

        name: 'hotswap yui rs addon tests',

        setUp: function () {
            store = new MockRS();
            store.plug(MockConfigAddon);
            store.plug(Y.mojito.addons.rs['config-expansion']);
        },

        tearDown: function () {
            store = null;
        },

        'Composite keys should be expanded correctly by the config resource store add-on': function () {
            var config = store.config.readConfigSimple(),
                stringified = require('util').inspect(config, { depth: null });

            A.areSame("{ a1: { b1: { c1: { text: 'foobar' } } },\n" +
                "  a3: { b3: { c3: { text: 'foobar' } } },\n" +
                "  array: [ { a5: { b5: { c5: { text: 'foobar' } } } } ],\n" +
                "  a0: { b0: { c0: { text: 'foobar' } } },\n" +
                "  a2: { b2: { c2: { text: 'foobar' } } },\n" +
                "  a4: { b4: { c4: { text: 'foobar' } } } }", stringified);
        }
    }));

    YUITest.TestRunner.add(suite);

}, '1.0.0', {
    requires: [
        'base',
        'oop'
    ]
});