'use strict';

var request = require('request');
var _ = require('underscore');
var url = require('url');

var InfluxRequest = module.exports = function InfluxRequest(options) {
  this.options = options;
};

InfluxRequest.prototype.write = function (payload, callback) {

  var params = this.baseRequestParams('POST', '/write');
  if (params instanceof Error) return callback(params);

  payload.database = this.options.database;
  params.body = JSON.stringify(payload);

  request(params, callback);
};


InfluxRequest.prototype.query = function (query, callback) {

  var params = this.baseRequestParams('GET', '/query');
  if (params instanceof Error) return callback(params);

  params.qs.q = query;
  params.qs.db = this.options.database;

  request(params, callback);
};


InfluxRequest.prototype.baseRequestParams = function (method, path) {

  if (!this.options.host) {
    return new Error('No host available');
  }
  if (!this.options.database) {
    return new Error('No database configured');
  }

  var requestParams = {
    uri: url.format({
      protocol: 'http:',
      hostname: this.options.host,
      port: this.options.port
    }) + path,
    json: true,
    method: method
  };

  if (this.options.username) {
    requestParams.qs = {
      u: this.options.username,
      p: this.options.password
    };
  }

  _.extend(requestParams, this.options.requestOptions || {});

  return requestParams;
};
