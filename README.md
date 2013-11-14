Mojito Config Expansion plugin
==============================

Build Status
------------

[![Build Status](https://travis-ci.org/yahoo/mojito-config-expansion.png)](https://travis-ci.org/yahoo/mojito-config-expansion)

Usage
-----

This package contains a Mojito resource store add-on that allows you to write
the following in your configuration files:

```json
"specs > frame > config > child > config > section > article > config > truncation_length": 180
```

Instead of:

```json
"specs": {
    "frame": {
        "config": {
            "child": {
                "config": {
                    "section": {
                        "article": {
                            "config": {
                                "truncation_length": 180
                            }
                        }
                    }
                }
            }
        }
    }
}
```

Note: the above is a real life example that clearly demonstrates how maintaining
configuration can become painful in a complex Mojito application.

To use this resource store add-on, simply require the `mojito-config-expansion`
npm package in your application.
