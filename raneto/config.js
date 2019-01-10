'use strict';

var path = require('path');
var fs = require('fs');
var uuid = require('uuid');

var config = {

    // Site title. Appears in page banner.

    site_title: 'Web App Builder Workshop',


    // Controls page title and description in page meta information.

    home_meta: {
        title: 'Web App Builder Workshop',
        description: 'Workshop'
    },


    // List of variables available for interpolation in content. Where a
    // user supplied config.js exists, entries from it will be appended
    // to these.

    variables: [
      {
          name: 'web_console_url',
          content: ((process.env.CLUSTER_SUBDOMAIN === undefined)
            ? '' : process.env.CLUSTER_SUBDOMAIN.replace('apps', 'master'))
      }
    ],

   
};

var config_file;

// Check for alternate locations for content.

if (fs.existsSync('/opt/app-root/src/workshop/content')) {
    config.content_dir = '/opt/app-root/src/workshop/content';
    config_file = '/opt/app-root/src/workshop/config.js';
}
else if (fs.existsSync('/opt/app-root/src/raneto/content')) {
    config.content_dir = '/opt/app-root/src/raneto/content';
    config_file = '/opt/app-root/src/raneto/config.js';
}
else if (fs.existsSync('/opt/app-root/workshop/content')) {
    config.content_dir = '/opt/app-root/workshop/content';
    config_file = '/opt/app-root/workshop/config.js';
}
else if (fs.existsSync('/opt/app-root/raneto/content')) {
    config.content_dir = '/opt/app-root/raneto/content';
    config_file = '/opt/app-root/raneto/config.js';
}

// If a config.js is supplied with alternate content, merge it with the
// configuration above.

if (config_file && fs.existsSync(config_file)) {
    var config_overrides = require(config_file);
    for (var key1 in config_overrides) {
        var value1 = config_overrides[key1];
        if (value1.constructor == Array) {
            config[key1].concat(value1);
        }
        else if (value1.constructor == Object) {
            for (var key2 in value1) {
                config[key1][key2] = value1[key2];
            }
        }
        else {
            config[key1] = value1;
        }
    }
}

module.exports = config;