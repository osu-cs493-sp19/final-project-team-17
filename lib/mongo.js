/*
 * Module for working with a MongoDB connection.
 */

const { MongoClient } = require('mongodb');

const mongoHost = process.env.MONGO_HOST || "127.0.0.1";
const mongoPort = process.env.MONGO_PORT || 27017;
const mongoUser = process.env.MONGO_USER || "cs493final";
const mongoPassword = process.env.MONGO_PASSWORD || "cs493final";
const mongoDBName = process.env.MONGO_DATABASE || "final";

const mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDBName}`;

let db = null;

exports.connectToDB = function (callback) {
  MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, client) => {
    if (err) {
      throw err;
    }
    db = client.db(mongoDBName);
    callback();
  });
};

exports.getDBReference = function () {
  return db;
};
