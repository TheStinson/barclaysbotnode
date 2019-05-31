/**
 * Created by vsaini on 11/17/2017.
 */

var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://127.0.0.1:27017/hackathonDB';

module.exports = function () {

  this.mongodbTest = function () {

    console.log("call AYA");
    // Connection URL

    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.insertDocuments(db, function () {
        db.close();
      });
    });
  };


  this.insertDocuments = function (db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    collection.insertMany([
      {a: 1}, {a: 2}, {a: 3}
    ], function (err, result) {
      console.log("Inserted 3 documents into the document collection");
      callback(result);
    });
  };

  this.getAllAccount = function (res) {
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.getAllAccountOperation(db, function (docs) {
        db.close();
        res.send(docs);
      });
    });
  }

  this.getAllAccountOperation = function (db, callback) {
    var collection = db.collection('documents');
    collection.find({}).toArray(function (err, docs) {
      callback(docs);
    });
  };

  this.getAccountDetails = function (accoundId, res) {
    // Connection URL

    var result = null;
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.getAccountDetailsOperation(db, accoundId, function (docs) {
        db.close();
        console.log(docs);
        res.send(docs);
      });
    });
  };

  this.getAccountOfferDetails = function (accoundId, res) {
    // Connection URL

    var result = null;
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.getAccountDetailsOperation(db, accoundId, function (docs) {
        db.close();
        res.send(docs.offers);
      });
    });
  };


  this.getAccountDetailsOperation = function (db, accountId, callback) {
    var collection = db.collection('documents');
    collection.findOne({_id: accountId}, function (err, docs) {
      console.log("Found the following records");
      callback(docs);
    });
  };

  this.performTransaction = function (accoundId, req, res) {
    // Connection URL

    var result = null;
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.transactionOperation(db, req, accoundId, function (docs) {
        db.close();
        res.send(docs);
      });
    });
  };

  this.transactionOperation = function (db, req, accountId, callback) {
    var collection = db.collection('documents');
    var account = null;
    console.log(accountId);
    collection.findOne({_id: accountId}, function (err, docs) {
      //console.log("Found the following records");
      //console.log(docs);
      account = docs;
      /*console.log(((account.charges_category[0])[req.category]).fees);*/
      account.account_balance = account.account_balance - req.amount - (req.amount * account.fees / 100);
      var transaction = {
        "transaction_id": "b4cbe1d7-52c9-4b35-8ef2-3f76d7" + Math.floor((Math.random() * 1000000) + 100000),
        "category": req.category,
        "transaction_date": new Date(),
        "transaction_amount": req.amount,
        "fee_perct": account.fees,
        "fee_amount": req.amount * account.fees / 100
      };

      (account.transactions).push(transaction);

      var discount = 0;
      for (var index = 0; index < account['applied_offers'].length; index++) {
        if (((account['applied_offers'])[index])['category'] == req.category) {
          discount = ((account['applied_offers'])[index]).discount;
          break;
        }
      }

      if(discount!=0){
        account.account_balance += req.amount * discount / 100;
        var cashbackTransaction = {
          "transaction_id": "b4cbe1d7-52c9-4b35-8ef2-3f76d7" + Math.floor((Math.random() * 1000000) + 100000),
          "category": "CashBack",
          "transaction_date": new Date(),
          "transaction_amount": req.amount * discount / 100,
          "fee_perct": account.fees,
          "fee_amount": req.amount * account.fees / 100
        };
      (account.transactions).push(cashbackTransaction);
      }


      collection.save(account);
      callback(transaction);
    });


  };


  this.clearOffer = function (res) {
    // Connection URL
    var result = null;
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.clearOfferOperation(db, function (docs) {
        db.close();
        res.send(docs);
      });
    });
  };

  this.clearOfferOperation = function (db, callback) {
    var collection = db.collection('documents');
    collection.find({}).toArray(function (err, docs) {
      accounts = docs;
      for (var index = 0; index < accounts.length; index++) {
        (accounts[index])['offer'] = {};
        delete (accounts[index])['offers'];
        delete (accounts[index])['applied_offers'];
        collection.save(accounts[index]);
      }
      callback(accounts);
    });

  };



  this.getTransactionsForBank = function (accountId, res) {
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.getTransactionsOperationForBank(accountId, db, function (docs) {
        db.close();
        res.send(docs);
      });
    });
  };

  this.getTransactionsOperationForBank = function (accountId, db, callback) {
    var collection = db.collection('documents');
    console.log(">>"+accountId);
    collection.findOne({_id: accountId},function (err, docs) {
      console.log(docs);
        callback(docs.transactions);
    });
  };




  this.acceptOfferByAccountId = function (accoundId, offer_id, res) {
    // Connection URL
    var result = null;
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.acceptOfferByAccountIdOperation(db, accoundId, offer_id, function (docs) {
        db.close();
        res.send(docs);
      });
    });
  };

  this.acceptOfferByAccountIdOperation = function (db, accountId, offer_id, callback) {
    var collection = db.collection('documents');
    var account = null;
    console.log(accountId);
    console.log(offer_id);
    collection.findOne({_id: accountId}, function (err, docs) {
      var account = docs;
      if(err!=null){
        callback({"status":'fail'})
      }
      if(!account.hasOwnProperty('offers')){
        account['offers'] = [];
      }
      console.log(account['offers'].length);
      for (var index = 0; index < account.offers.length; index++) {
        console.log(account.offers[index].offer_id);
        if(account.offers[index].offer_id === offer_id) {
          console.log("MAtched");
          if (account.hasOwnProperty('applied_offers')) {
            account['applied_offers'].push(account.offers[index]);
          }
          else {
            account['applied_offers'] = [];
            account['applied_offers'].push(account.offers[index]);
          }
          account.account_balance -=  (account.offers[index]).fees;
          account.offers.splice(index, 1);
          break;
        }
      }
      collection.save(account);
      callback(account['applied_offers']);
    });
  };
};
