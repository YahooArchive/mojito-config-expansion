/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint nomen: true, plusplus: true */
/*global YUI */

YUI.add('addon-rs-config-expansion', function (Y, NAME) {
    'use strict';

    var FIRST_OBJECT_KEY_REGEXP = /^\s*([a-z0-9_\-]+)(?:\s+>)?/i;

    function processConfigurationObject(obj) {
        var i, l, key, m, s, k, o;

        if (Y.Lang.isArray(obj)) {

            for (i = 0, l = obj.length; i < l; i++) {
                processConfigurationObject(obj[i]);
            }

        } else if (Y.Lang.isObject(obj)) {

            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (key.indexOf(' > ') !== -1) {

                        s = key;
                        o = obj;

                        for (;;) {
                            m = s.match(FIRST_OBJECT_KEY_REGEXP);

                            if (!m) {
                                Y.log('Invalid composite key: "' + s + '"', 'error', NAME);
                                break;
                            }

                            k = m[1];
                            s = Y.Lang.trim(s.substr(m[0].length));

                            if (!s.length) {
                                o[k] = obj[key];
                                o = o[k];
                                processConfigurationObject(o);
                                break;
                            }

                            o[k] = {};
                            o = o[k];
                        }

                        delete obj[key];

                    } else {
                        processConfigurationObject(obj[key]);
                    }
                }
            }
        }
    }

    function RSAddon() {
        RSAddon.superclass.constructor.apply(this, arguments);
    }

    RSAddon.NS = 'config-expansion';

    Y.extend(RSAddon, Y.Plugin.Base, {

        initializer: function (config) {
            var store = config.host;

            this._cache = {};

            Y.Do.before(this.beforeReadConfig, store.config, 'readConfigSimple', this);
            Y.Do.after(this.afterReadConfig, store.config, 'readConfigSimple', this);
        },

        beforeReadConfig: function (fullpath) {
            var obj = this._cache[fullpath];
            if (obj) {
                return new Y.Do.Halt(null, obj);
            }
        },

        afterReadConfig: function (fullpath) {
            var obj = Y.Do.currentRetVal;
            if (obj) {
                processConfigurationObject(obj);
                this._cache[fullpath] = obj;
                return new Y.Do.AlterReturn(null, obj);
            }
        }
    });

    Y.namespace('mojito.addons.rs')[RSAddon.NS] = RSAddon;

}, '0.0.1', {
    requires: [
        'plugin',
        'event-custom-base',
        'oop'
    ]
});
