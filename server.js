/**
 * Created by vsaini on 11/17/2017.
 */

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/*
 * mongodb command to start the database mongod --dbpath=/data --port 27017
 *
 * */


/*services*/
require('./service/userService.js')();
require('./service/offerService.js')();
require('./service/messangerService.js')();

app.use("/",express.static(__dirname +'/dist'));

// viewed at http://localhost:3000
app.get('/', function(req,res) {
  res.sendFile(path.join(__dirname +'/dist/index.html'));
});
app.listen(process.env.PORT, process.env.IP, function () {
    console.log('React app listening on port '+process.env.PORT);
    console.log(process.env.IP);
    //mongodbTest();
    //startOfferEngine();
});

/*
*  Offer Endpoints
* */


app.get('/generateoffer', function (req, res) {
  startOfferEngine(res);
});

app.get('/clearoffer', function (req, res) {
  clearOffer(res);
});


/*
*   Account Endpoints
* */

app.get('/account/all', function (req, res) {
  getAllAccount(res);
});

app.get('/account/:accountId', function (req, res) {
    console.log('request received');
    console.log(req.params.accountId);
    getAccountDetails(req.params.accountId, res);
});

app.get('/account/:accountId/offers', function (req, res) {
    console.log('Offer request received');
    console.log(req.params.accountId);
    getAccountOfferDetails(req.params.accountId, res);
});

app.post('/account/transact/:accountId', function (req, res) {
    console.log('Transaction Request Received');
    console.log(req.params.accountId);
    console.log(req);
    performTransaction(req.params.accountId, req.body, res);
});


app.get('/transactions/:accountId', function (req, res) {
  console.log('Transaction fetch request received.');
  console.log(req.params.accountId);
  getTransactionsForBank(req.params.accountId,res);
});


/*
*   Offer Endpoints
* */

app.post('/account/accept/offer/:accountId', function (req, res) {
    console.log('Offer Accept Request Received');
    console.log(req.body.offer_id);
    acceptOfferByAccountId(req.params.accountId,req.body.offer_id, res);
});



/*
*   Messenger Endpoints
* */

app.post('/login', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-  Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  console.log('Login Request Received');
  login(req.body, res);
});

app.post('/checkasid', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-  Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  console.log('Check ASID Request Received');
  checkAsid(req.body, res);
});

app.post('/account/link/:accountId', function (req, res) {
    console.log('Account Link Request Received'+req);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-  Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    linkAccount(req.params.accountId, req.body, res);
});

app.post('/messengerlogin', function (req, res) {
  console.log('Messanger Login Request Received');
  messengerLogin(req.body, res);
});


app.get('/transactions/:asid', function (req, res) {
  console.log('Transaction fetch request received.');
  console.log(req.params.asid);
  getTransactions(req.params.asid,res);
});

app.get('/branch/:asid', function (req, res) {
  console.log('Transaction fetch request received.');
  getBranch(req.params.asid,res);
});

app.get('/offer/:asid/:category', function (req, res) {
  console.log('Transaction fetch request received.');
  getSpecificOffer(req.params.asid,req.params.category,res);
});

app.get('/account/details/:asid', function (req, res) {
  console.log('Transaction fetch request received.');
  getAccountDetailsViaAsid(req.params.asid,res);
});

app.get('/account/detailsViaEmail/:email', function (req, res) {
  console.log('Transaction fetch request received.');
  getAccountDetailsViaEmail(req.params.email,res);
});

app.get('/account/transactions/:asid', function (req, res) {
  console.log('Transaction fetch request received.');
  console.log(req.params.asid);
  getTransactionsViaAsid(req.params.asid,res);
});

