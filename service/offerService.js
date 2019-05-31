/**
 * Created by vsaini on 11/17/2017.
 */

var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://127.0.0.1:27017/hackathonDB';


/* engine parameters*/

var min_discount = 5;
var var_discount = 5;

var min_fee = 100;
var var_fee = 100;

module.exports = function () {

  this.startOfferEngine = function (res) {
    // Connection URL

    var result = null;
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.getAllAccounts(db, function (accounts) {

        this.generateOffers(accounts, db);

        db.close();
        res.send("{}");
      });
    });
  };


  this.getAllAccounts = function (db, callback) {
    var collection = db.collection('documents');
    collection.find({}).toArray(function (err, docs) {
      //console.log("Accounts Fetched");
      //console.dir(docs);
      callback(docs);
    });
  };


  this.generateOffers = function (accounts, db) {
    console.log("Offer Generation Started.")
    for (var index = 0; index < accounts.length; index++) {
      //console.log("\n\n Account Number " + index + "  Processing Started.");

      var offers = [];
      var prod_count = 0;


      getCustomerValue(accounts, index, function (accounts, index, category_count, min, max, pc) {

        for (key in category_count) {
          var offer = {};
          offer['offer_id'] = Math.floor(Math.random() * (100000000 - 10000000 + 1)) + 10000000;
          offer['category'] = key;
          offer['discount'] = (min_discount + var_discount * ((max - category_count[key]) / (max - min + 1))).toFixed(2);
          offer['fees'] = (min_fee + var_fee * ((max - category_count[key]) / (max - min + 1))).toFixed(2);
          offers.push(offer);
          prod_count = pc;
        }
      });

      (accounts[index])['offers'] = offers;

      if (prod_count > 3 || accounts[index].transactions.length > 100 || accounts[index].credit_score > 700) {
        saveGeneratedOffers(accounts[index], db);
      }

    }
  };

  function getCustomerValue(accounts, index, callback) {
    var customerValue = null;
    var max = 0;
    var min = 1000000;
    var category_count = {};
    var prod_count = 0;
    for (var trans_index = 0; trans_index < accounts[index].transactions.length; trans_index++) {
      //console.log(accounts[index].transactions[trans_index].transaction_id);

      if (category_count.hasOwnProperty(accounts[index].transactions[trans_index].category)) {
        category_count[accounts[index].transactions[trans_index].category] += 1;
      } else {
        category_count[accounts[index].transactions[trans_index].category] = 1;
      }
    }

    for (key in category_count) {
      if (category_count[key] > max) {
        max = category_count[key];

      }
      if (category_count[key] < min) {
        min = category_count[key];

      }
    }

    for (key in accounts[index].bank_product[0]) {
      if ((accounts[index].bank_product[0])[key]) {
        prod_count++;
      }
    }


    callback(accounts, index, category_count, min, max, prod_count);
  }


  this.saveGeneratedOffers = function (account, db) {
    var collection = db.collection('documents');
    collection.save(account);
  };
};
