var schema = new Schema({
    POLICYHOLDERNAME: String,
    POLICY_NUMBER: String,
    EMPLOYEE_NAME: String,
    CLAIMANT_NAME: String,
    RELATION: String,
    DOA: Date,
    DOD: Date,
    HOSPITAL_NAME: String,
    HOSPITAL_CITY: String,
    CLAIMID: String,
    EMPLOYEE_PHONE_NO: String,
    STATUS: String,
    INTIMATION_DATE: Date,
    TOTALAUTHREQUESTEDAMOUNT: Number,
    TOTALAUTHAPPROVEDAMOUNT: Number,
    AMOUNTCLAIMED: Number,
    AMOUNTDEDUCTED: Number,
    TOTALAMOUNTAPPROVED: Number,
    SETTLEDAMOUNT: Number,
    session: String
});
var Claim = require('./Claim');
var Log = mongoose.model('Log', schema);
var model = {
    policyNumber: function (data, callback) {
        Log.findOne({
            "session": data.session
        }).exec(function (err, resData) {
            if (err || _.isEmpty(resData)) {
                Claim.getOnePolicy(data, function (err, data) {
                    if (err) {
                        callback(err, null)
                    } else {
                        delete data._id;
                        var log = new Log(data);
                        log.save(function (err, res) {
                            callback(err, res);
                        })
                    }
                });
            } else {
                if (data.queryResult.parameters.POLICY_NUMBER) {
                    console.log("data.queryResult.parameters.POLICY_NUMBER, resData.POLICY_NUMBER", data, resData);
                    if (data.queryResult.parameters.POLICY_NUMBER == resData.POLICY_NUMBER) {
                        callback(null, resData);
                    } else {
                        Claim.getOnePolicy(data, function (err, data) {
                            if (err) {
                                callback(err, null)
                            } else {
                                Log.remove({
                                    session: data.session
                                }).lean().exec(function (err, resData2) {
                                    delete data._id;
                                    var log = new Log(data);
                                    log.save(function (err, res) {
                                        callback(err, res);
                                    })
                                })

                            }
                        });
                    }
                } else {
                    callback(null, resData);
                }
            }
        });
    },
    claimNumber: function (data, callback) {
        Log.findOne({
            "session": data.session
        }).exec(function (err, resData) {
            if (err || _.isEmpty(resData)) {
                Claim.getOneClaim(data, function (err, data) {
                    if (err) {
                        callback(err, null)
                    } else {
                        delete data._id;
                        var log = new Log(data);
                        log.save(function (err, res) {
                            callback(err, res);
                        })
                    }
                });
            } else {
                if (data.queryResult.parameters.CLAIMID) {
                    if (data.queryResult.parameters.CLAIMID == resData.CLAIMID) {
                        callback(null, resData);
                    } else {
                        Claim.getOneClaim(data, function (err, data) {
                            if (err) {
                                callback(err, null)
                            } else {
                                Log.remove({
                                    session: data.session
                                }).lean().exec(function (err, resData2) {
                                    delete data._id;
                                    var log = new Log(data);
                                    log.save(function (err, res) {
                                        callback(err, res);
                                    })
                                })

                            }
                        });
                    }
                } else {
                    callback(null, resData);
                }
            }
        });
    },
    policyStatus: function (data, callback) {
        Log.findOne({
            "session": data.session
        }).exec(function (err, resData) {
            if (err || _.isEmpty(resData)) {
                callback(null, "Please provide one of the detail \nPolicy Number\nCompany Name and Employee ID\nGood Health Id\nClaim Id");
            } else {
                callback(null, "Your policy is " + resData.STATUS);
            }
        });
    },
    saveData: function (data, callback) {
        Log.save(data).exec(function (err, resData) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, resData);
            }
        })
    },
    policyAmount: function (data, callback) {
        Log.findOne({
            "session": data.session
        }).exec(function (err, resData) {
            if (err || _.isEmpty(resData)) {
                callback(null, "Please provide one of the detail \nPolicy Number\nCompany Name and Employee ID\nGood Health Id\nClaim Id");
            } else {
                callback(null, "Deductions are as follows:\nTotal Requested Amount : " + resData.TOTALAUTHREQUESTEDAMOUNT + "\nTotal Approved Amount : " + resData.TOTALAUTHAPPROVEDAMOUNT + "\nAmount Deducted : " + resData.AMOUNTDEDUCTED);
            }
        });
    },
    getSingleAmount: function (data, callback) {
        Log.findOne({
            "session": data.session
        }).exec(function (err, resData) {
            if (err || _.isEmpty(resData)) {
                callback(null, "Please provide one of the detail \nPolicy Number\nCompany Name and Employee ID\nGood Health Id\nClaim Id");
            } else {
                var MiddleData = "";
                switch (data.queryResult.parameters.Amount) {
                    case "SETTLEDAMOUNT":
                        {
                            MiddleData = "Setteled Amount";
                            break
                        }
                    case "TOTALAMOUNTAPPROVED":
                        {
                            MiddleData = "Total Amount Approved";
                            break
                        }
                    case "AMOUNTDEDUCTED":
                        {
                            MiddleData = "Amount Deducted";
                            break
                        }
                    case "AMOUNTCLAIMED":
                        {
                            MiddleData = "Amount Claimed";
                            break
                        }
                    case "TOTALAUTHAPPROVEDAMOUNT":
                        {
                            MiddleData = "Total Auth Approved Amount";
                            break
                        }
                    case "TOTALAUTHREQUESTEDAMOUNT":
                        {
                            console.log("..In Here-->")
                            MiddleData = "Total Auth Requested Amount";
                            break
                        }
                }
                callback(null, "Your " + MiddleData + " Amount is : " + resData[data.queryResult.parameters.Amount]);
            }
        });
    },
};
module.exports = _.assign(model);