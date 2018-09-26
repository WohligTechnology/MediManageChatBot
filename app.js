var express = require('express');
var app = express();
global.mongoose = require('mongoose');
global.Schema = mongoose.Schema;
var bodyParser = require('body-parser');
global._ = require("lodash");
global.async = require("async");
global.request = require("request");
var Claims = require('./Claim');
var webhooks = require('./webhook');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

mongoose.connect('mongodb://localhost:27017/medimanage', {
    useNewUrlParser: true
}, function (err, data) {
    if (err) {
        console.log("Error while Connection-->", err);
    } else {
        console.log("Connected Successfully");
    }
});
app.post('/', (req, res) => {
    console.log(req.body.session)
    switch (req.body.queryResult.intent.displayName) {
        case "POLICY NUMBER":
            {
                webhooks.policyNumber(req.body, function (err, data) {
                    if (err) {
                        res.json({
                            "fulfillmentText": "There was some error from the system. Please notify the developers",
                        });
                    } else {
                        console.log("Data", data);
                        res.json({
                            "fulfillmentText": data,
                        });
                    }
                });
                break;
            }
        case "Claim Id":
            {
                webhooks.claimNumber(req.body, function (err, data) {
                    if (err) {
                        console.log("err-->", err);
                        res.json({
                            "fulfillmentText": err,
                        });
                    } else {
                        console.log("Data", data);
                        res.json({
                            "fulfillmentText": data,
                        });
                    }
                });
                break;
            }
        case "Status":
            {
                webhooks.status(req.body, function (err, data) {
                    if (err) {
                        res.json({
                            "fulfillmentText": "There was some error from the system. Please notify the developers",
                        });
                    } else {
                        console.log("Data", data);
                        res.json({
                            "fulfillmentText": data,
                        });
                    }
                });
                break;
            }
        case "Amount":
            {
                webhooks.amount(req.body, function (err, data) {
                    if (err) {
                        res.json({
                            "fulfillmentText": "There was some error from the system. Please notify the developers",
                        });
                    } else {
                        console.log("Data", data);
                        res.json({
                            "fulfillmentText": data,
                        });
                    }
                });
                break;
            }
        case "SingleAmount":
            {
                webhooks.getSingleAmount(req.body, function (err, data) {
                    if (err) {
                        res.json({
                            "fulfillmentText": "There was some error from the system. Please notify the developers",
                        });
                    } else {
                        console.log("Data", data);
                        res.json({
                            "fulfillmentText": data,
                        });
                    }
                });
                break;
            }
    }
});


app.listen(91);