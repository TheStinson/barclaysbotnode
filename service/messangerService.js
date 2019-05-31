/**
 * Created by vsaini on 11/17/2017.
 */

var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://127.0.0.1:27017/hackathonDB';

module.exports = function () {


  /* Login*/

  this.login = function (req, res) {
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.loginOperation(req, db, function (docs) {
        db.close();
        res.send(docs);
      });
    });
  };

  this.loginOperation = function (req, db, callback) {
    var collection = db.collection('documents');
    collection.find({email: req.email}).toArray(function (err, docs) {
      var reply = {};
      if (docs.length != 0) {
        docs = docs[0];
        console.log("Password is::"+docs['password']);
        if (req.password == docs['password']) {
          reply['status'] = "success";
          reply['accountId'] = docs['_id'];
          reply['email'] = docs['email'];
          reply['first_name'] = docs['first_name'];
          reply['last_name'] = docs['last_name'];
          reply['ASID'] = docs['ASID'];
        } else {
          reply['status'] = "fail";
          reply['details'] = "Wrong Password";
        }

        if (err != null) {
          reply['status'] = "fail";
          reply['details'] = "Wrong email";
        }
      } else {
        reply['status'] = "fail";
        reply['details'] = "Wrong email";
      }

      callback(reply);
    });
  };

  /* Link Account*/

  this.linkAccount = function (accountId, req, res) {
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.linkAccountOperation(accountId, req, db, function (docs) {
        db.close();
        res.send(docs);
      });
    });
  };

  this.linkAccountOperation = function (accountId, req, db, callback) {
    var collection = db.collection('documents');
    collection.findOne({account_id: accountId}, function (err, docs) {
      console.log(accountId +"Found Account."+req.ASID+" ## "+req.secure_pin +" Docs: "+docs);
      console.log(req);
      docs['ASID'] = req.ASID;
      docs['secure_pin'] = req.secure_pin;
      //console.log(docs);
      collection.save(docs);
      var reply = {};
      reply['status'] = 'success';
      reply['accountId'] = docs['account_id'];
      reply['first_name'] = docs['first_name'];
      reply['last_name'] = docs['last_name'];
      callback(reply);
    });
  };


  /* Check ASID*/

  this.checkAsid = function (req, res) {
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.checkAsidOperation(req, db, function (docs) {
        db.close();
        res.send(docs);
      });
    });
  };

  this.checkAsidOperation = function (req, db, callback) {
    var collection = db.collection('documents');
    collection.find({ASID: req['ASID']}).toArray(function (err, docs) {
      var reply = {};
      if (docs.length != 0) {
        docs = docs[0];
        if (err == null) {
          reply['status'] = "fail";
          reply['details'] = "ASID does not exists.";
        } else {
          reply['status'] = "success";
          reply['accountId'] = docs['_id'];
          reply['email'] = docs['account_balance'];
          reply['first_name'] = docs['first_name'];
          reply['last_name'] = docs['last_name'];
          reply['account_balance'] = docs['account_balance'];
          reply['ASID'] = docs['ASID'];
        }
      } else {
        reply['status'] = "fail";
      }
    });
  };

  /* Messenger Login*/

  this.messengerLogin = function (req, res) {
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.messengerLoginOperation(req, db, function (docs) {
        db.close();
        res.send(docs);
      });
    });
  };

  this.messengerLoginOperation = function (req, db, callback) {
    var collection = db.collection('documents');
    collection.find({ASID: req['ASID']}).toArray(function (err, docs) {
      var reply = {};
      if (docs.length != 0) {
        docs = docs[0];
        if (req['secure_pin'] == docs['secure_pin']) {
          reply['status'] = "success";
          reply['accountId'] = docs['_id'];
          reply['email'] = docs['email'];
          reply['first_name'] = docs['first_name'];
          reply['last_name'] = docs['last_name'];
          reply['account_balance'] = docs['account_balance'];
          reply['ASID'] = docs['ASID'];

          var max = 0;
          var offer = null;

          if (!docs.hasOwnProperty('offers')) {
            docs['offers'] = {};
          }

          for (var index = 0; index < docs['offers'].length; index++) {
            if ((docs['offers'])[index].discount > max) {
              max = (docs['offers'])[index].discount;
              offer = (docs['offers'])[index];
            }
          }
          reply['offer'] = offer;

        } else {
          reply['status'] = "fail";
          reply['details'] = "Wrong Secure Pin";
        }

        if (err != null) {
          reply['status'] = "fail";
          reply['details'] = "Wrong ASID";
        }
      } else {
        reply['status'] = "fail";
        reply['details'] = "Wrong ASID";
      }

      callback(reply);
    });
  };

  /* Get Transactions*/

  this.getTransactions = function (asid, res) {
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.getTransactionsOperation(asid, db, function (docs) {
        db.close();
        res.send(docs);
      });
    });
  };

  this.getTransactionsOperation = function (asid, db, callback) {
    var collection = db.collection('documents');
    collection.find({ASID: asid}).toArray(function (err, docs) {
      console.log(docs);
      if (docs.length != 0) {
        callback(docs[0].transactions);
      } else {
        callback({});
      }
    });
  };

  /* Get Branch*/

  this.getBranch = function (asid, res) {
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.getBranchOperation(asid, db, function (docs) {
        db.close();
        res.send(docs);
      });
    });
  };

  this.getBranchOperation = function (asid, db, callback) {
    var collection = db.collection('documents');
    collection.find({ASID: asid}).toArray(function (err, docs) {
      if (docs.length != 0) {
        docs = docs[0];
        callback(docs.branch);
      } else {
        callback({});
      }
    });
  };

  /* Get Branch*/

  this.getSpecificOffer = function (asid, category, res) {
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.getSpecificOfferOperation(asid, category, db, function (docs) {
        db.close();
        res.send(docs);
      });
    });
  };

  this.getSpecificOfferOperation = function (asid, category, db, callback) {
    var collection = db.collection('documents');
    collection.find({ASID: asid}).toArray(function (err, docs) {
      console.log(docs);
      console.log(category);
      if (docs.length != 0) {
        docs = docs[0];
        var offer = {};
        for (var index = 0; index < docs['offers'].length; index++) {
          console.log((docs['offers'])[index].category);
          if ((docs['offers'])[index].category == category) {
            offer = (docs['offers'])[index];
            break;
          }
        }
        callback(offer);
      } else {
        callback({});
      }
    });
  };

  /* Get Account Detail via Email */
  
  this.getAccountDetailsViaEmail = function (email, res) {
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.getAccountDetailsOperationViaEmail(email, db, function (docs) {
        db.close();
        res.send(docs);
      });
    });
  };
  
  this.getAccountDetailsOperationViaEmail = function (emailParam, db, callback) {
    var collection = db.collection('documents');
    collection.find({email: emailParam}).toArray(function (err, docs) {
      if (docs.length != 0) {
        docs = docs[0];
        
        delete docs.password;
        if (docs.hasOwnProperty('offers')) {
          delete docs.offers;
        }
        if(docs.hasOwnProperty('charges_category')){
          delete docs.charges_category;
        }
        if(docs.hasOwnProperty('secure_pin')){
          delete docs.secure_pin;
        }
        if (docs.hasOwnProperty('applied_offer')) {
          delete docs.applied_offers;
        }
        callback(docs);
      } else {
        callback({});
      }
    });
  };


  /* Get Account Detail*/

  this.getAccountDetailsViaAsid = function (asid, res) {
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.getAccountDetailsOperationViaAsid(asid, db, function (docs) {
        db.close();
        res.send(docs);
      });
    });
  };

  this.getAccountDetailsOperationViaAsid = function (asid, db, callback) {
    var collection = db.collection('documents');
    collection.find({ASID: asid}).toArray(function (err, docs) {
      if (docs.length != 0) {
        docs = docs[0];
        delete docs.transactions;
        if (docs.hasOwnProperty('offers')) {
          delete docs.offers;
        }
        if (docs.hasOwnProperty('applied_offer')) {
          delete docs.applied_offers;
        }
        callback(docs);
      } else {
        callback({});
      }
    });
  };

  /* Get Account Transaction*/

  this.getTransactionsViaAsid = function (asid, res) {
    MongoClient.connect(url, function (err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
      this.getTransactionsViaAsidOperation(asid, db, function (docs) {
        db.close();
        res.send(docs);
      });
    });
  };

  this.getTransactionsViaAsidOperation = function (asid, db, callback) {
    var collection = db.collection('documents');
    console.log(asid);
    collection.find({ASID: asid}).toArray(function (err, docs) {
      if (docs.length != 0) {
        docs = docs[0];
        console.log(docs);
        var result = {};
        result['transactions'] = docs.transactions
        callback(result);
      } else {
        callback({});
      }
    });
  };


};
