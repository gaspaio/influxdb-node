'use strict';

var _   = require('underscore'),
    url = require('url');

var InfluxRequest = require('./lib/InfluxRequest.js');

var InfluxDB = module.exports.InfluxDB = function (options) {
  this.options = _.extend({
    host: 'localhost',
    port: 8086,
    username: 'root',
    password: 'root',
    requestOptions: {}
  }, options || {});
  this.request = new InfluxRequest(options);

  return this;
};


InfluxDB.prototype.query = function(query, callback) {
  if ('undefined' === typeof query) {
    return;
  }
  this.request.query(query, this._parseCallback(callback));
};


InfluxDB.prototype.write = function(payload, callback) {
  if ('undefined' === typeof payload) {
    return;
  }

  this.request.write(payload, this._parseCallback(callback));
};


InfluxDB.prototype._parseCallback = function(callback) {
  return function(err, res, body) {
    if ('undefined' === typeof callback) return;
    if (err) return callback(err);
    if (res.statusCode < 200 || res.statusCode >= 300) {
      return callback(new Error(body));
    }
    return callback(null, res);
  };
};
