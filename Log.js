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
  session: String,
  ROOM_FEES_REQ: Number,
  PROFESSIONALFEES_REQ: Number,
  INVESTIGATION_CHARGES_REQ: Number,
  PHARMACY_CHARGES_REQ: Number,
  OT_CHARGES_REQ: Number,
  OTHER_CHARGES_REQ: Number,
  ROOM_FEES_PAID: Number,
  PROFESSIONALFEES_PAID: Number,
  INVESTIGATION_CHARGES_PAID: Number,
  PHARMACY_CHARGES_PAID: Number,
  OT_CHARGES_PAID: Number,
  OTHER_CHARGES_PAID: Number,
  ROOMRENT_DED_REMARKS: String,
  PFEES_DED_REMARKS: String,
  INV_DED_REMARKS: String,
  PHARMACY_DED_REMARKS: String,
  OT_DED_REMARKS: String,
  OTHERS_DED_REMARKS: String,
  QUERIED_DATE: String,
  QUERY_RECEIVED_DATE: String,
  QUERY_REMARKS: String
});
var Claim = require("./Claim");
var Breakup = require("./Breakup");
var Query = require("./Query");
var Log = mongoose.model("Log", schema);
var model = {
  policyNumber: function(data, callback) {
    Log.findOne({
      session: data.session
    }).exec(function(err, resData) {
      if (err || _.isEmpty(resData)) {
        Claim.getOnePolicy(data, function(err, data) {
          if (err) {
            callback(err, null);
          } else {
            delete data._id;
            var log = new Log(data);
            log.save(function(err, res) {
              callback(err, res);
            });
          }
        });
      } else {
        if (data.queryResult.parameters.POLICY_NUMBER) {
          console.log(
            "data.queryResult.parameters.POLICY_NUMBER, resData.POLICY_NUMBER",
            data,
            resData
          );
          if (
            data.queryResult.parameters.POLICY_NUMBER == resData.POLICY_NUMBER
          ) {
            callback(null, resData);
          } else {
            Claim.getOnePolicy(data, function(err, data) {
              if (err) {
                callback(err, null);
              } else {
                Log.remove({
                  session: data.session
                })
                  .lean()
                  .exec(function(err, resData2) {
                    delete data._id;
                    var log = new Log(data);
                    log.save(function(err, res) {
                      callback(err, res);
                    });
                  });
              }
            });
          }
        } else {
          callback(null, resData);
        }
      }
    });
  },
  claimNumber: function(data, callback) {
    Log.findOne({
      session: data.session
    }).exec(function(err, resData) {
      if (err || _.isEmpty(resData)) {
        async.parallel(
          {
            getClaim: function(callback) {
              Claim.getOneClaim(data, function(err, data) {
                if (err) {
                  callback(err, null);
                } else {
                  delete data._id;
                  callback(err, data);
                }
              });
            },
            getBreakup: function(callback) {
              Breakup.getOneBreakup(data, function(err, data) {
                if (err) {
                  callback(err, null);
                } else {
                  delete data._id;
                  callback(err, data);
                }
              });
            },
            getQuery: function(callback) {
              Query.getOneQuery(data, function(err, data) {
                if (err) {
                  console.log("In Here For Error");
                  callback(err, null);
                } else {
                  delete data._id;
                  callback(err, data);
                }
              });
            }
          },
          function(err, data2) {
            if (
              _.isEmpty(data2.getBreakup) &&
              _.isEmpty(data2.getClaim) &&
              _.isEmpty(data2.getQuery)
            ) {
              callback(err, null);
            } else {
              // console.log("Data 2-->", data2);
              var data = _.assign(
                data2.getBreakup,
                data2.getClaim,
                data2.getQuery
              );
              var log = new Log(data);
              log.save(function(err, res) {
                callback(err, res);
              });
            }
          }
        );
      } else {
        if (data.queryResult.parameters.CLAIMID) {
          if (data.queryResult.parameters.CLAIMID == resData.CLAIMID) {
            callback(null, resData);
          } else {
            async.parallel(
              {
                getClaim: function(callback) {
                  Claim.getOneClaim(data, function(err, data) {
                    if (err) {
                      callback(err, null);
                    } else {
                      delete data._id;
                      callback(err, data);
                    }
                  });
                },
                getBreakup: function(callback) {
                  Breakup.getOneBreakup(data, function(err, data) {
                    if (err) {
                      callback(err, null);
                    } else {
                      delete data._id;
                      callback(err, data);
                    }
                  });
                },
                getQuery: function(callback) {
                  Query.getOneQuery(data, function(err, data) {
                    if (err) {
                      callback(err, null);
                    } else {
                      delete data._id;
                      callback(err, data);
                    }
                  });
                }
              },
              function(err, data2) {
                if (err) {
                  callback(err, null);
                } else {
                  var data3 = _.assign(
                    data2.getBreakup,
                    data2.getClaim,
                    data2.getQuery
                  );
                  Log.remove({
                    session: data.session
                  })
                    .lean()
                    .exec(function(err, resData2) {
                      var log = new Log(data3);
                      log.save(function(err, res) {
                        callback(err, res);
                      });
                    });
                }
              }
            );
          }
        } else {
          callback(null, resData);
        }
      }
    });
  },
  policyStatus: function(data, callback) {
    Log.findOne({
      session: data.session
    }).exec(function(err, resData) {
      if (err || _.isEmpty(resData)) {
        callback(null, "Please  provide Claim Id");
      } else {
        callback(null, "Your policy is " + resData.STATUS);
      }
    });
  },
  saveData: function(data, callback) {
    Log.save(data).exec(function(err, resData) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, resData);
      }
    });
  },
  policyAmount: function(data, callback) {
    Log.findOne({
      session: data.session
    }).exec(function(err, resData) {
      if (err || _.isEmpty(resData)) {
        callback(null, "Please  provide Claim Id");
      } else {
        callback(
          null,
          "Deductions are as follows:\nTotal Requested Amount : " +
            resData.TOTALAUTHREQUESTEDAMOUNT +
            "\nTotal Approved Amount : " +
            resData.TOTALAUTHAPPROVEDAMOUNT +
            "\nAmount Deducted : " +
            resData.AMOUNTDEDUCTED
        );
      }
    });
  },
  getSingleAmount: function(data, callback) {
    Log.findOne({
      session: data.session
    }).exec(function(err, resData) {
      if (err || _.isEmpty(resData)) {
        callback(null, "Please  provide Claim Id");
      } else {
        var MiddleData = "";
        switch (data.queryResult.parameters.Amount) {
          case "SETTLEDAMOUNT": {
            MiddleData = "Setteled Amount";
            break;
          }
          case "TOTALAMOUNTAPPROVED": {
            MiddleData = "Total Amount Approved";
            break;
          }
          case "AMOUNTDEDUCTED": {
            MiddleData = "Amount Deducted";
            break;
          }
          case "AMOUNTCLAIMED": {
            MiddleData = "Amount Claimed";
            break;
          }
          case "TOTALAUTHAPPROVEDAMOUNT": {
            MiddleData = "Total Auth Approved Amount";
            break;
          }
          case "TOTALAUTHREQUESTEDAMOUNT": {
            console.log("..In Here-->");
            MiddleData = "Total Auth Requested Amount";
            break;
          }
        }
        callback(
          null,

          "Your " +
            MiddleData +
            " Amount is : " +
            resData[data.queryResult.parameters.Amount]
        );
      }
    });
  },
  claimBreakup: function(data, callback) {
    Log.findOne({
      session: data.session
    }).exec(function(err, resData) {
      if (err || _.isEmpty(resData)) {
        callback(null, "Please  provide Claim Id");
      } else {
        callback(
          null,
          "Claim Break Up are as follows:\nRoom Fees : " +
            resData.ROOM_FEES_REQ +
            "\nProfessional Fees : " +
            resData.PROFESSIONALFEES_REQ +
            "\nInvestigation Charges : " +
            resData.INVESTIGATION_CHARGES_REQ +
            "\n Pharmacy Charges : " +
            resData.PHARMACY_CHARGES_REQ +
            "\nOT Charges : " +
            resData.OT_CHARGES_REQ +
            "\nOther Charges : " +
            resData.OTHER_CHARGES_REQ +
            "\nRoom Fees Paid : " +
            resData.ROOM_FEES_PAID +
            "\nProfessional Fees Paid : " +
            resData.PROFESSIONALFEES_PAID +
            "\nInvestigation Charges Paid : " +
            resData.INVESTIGATION_CHARGES_PAID +
            "\nPharmacy Charges Paid : " +
            resData.PHARMACY_CHARGES_PAID +
            "\nOT Charges Paid : " +
            resData.OT_CHARGES_PAID +
            "\nOther Charges Paid : " +
            resData.OTHER_CHARGES_PAID
        );
      }
    });
  },
  query: function(data, callback) {
    Log.findOne({
      session: data.session
    }).exec(function(err, resData) {
      if (err || _.isEmpty(resData)) {
        callback(null, "Please  provide Claim Id");
      } else {
        resData.QUERIED_DATE = resData.QUERIED_DATE
          ? resData.QUERIED_DATE
          : "NA";
        resData.QUERY_RECEIVED_DATE = resData.QUERY_RECEIVED_DATE
          ? resData.QUERY_RECEIVED_DATE
          : "NA";
        resData.QUERY_REMARKS = resData.QUERY_REMARKS
          ? resData.QUERY_REMARKS
          : "NA";
        callback(
          null,
          "Query details are as follows:\nQUERIED DATE : " +
            resData.QUERIED_DATE +
            "\nQuery_Received date : " +
            resData.QUERY_RECEIVED_DATE +
            "\nRemark : " +
            resData.QUERY_REMARKS
        );
      }
    });
  },
  remark: function(data, callback) {
    Log.findOne({
      session: data.session
    }).exec(function(err, resData) {
      if (err || _.isEmpty(resData)) {
        callback(null, "Please provide Claim Id");
      } else {
        resData.ROOMRENT_DED_REMARKS = resData.ROOMRENT_DED_REMARKS
          ? resData.ROOMRENT_DED_REMARKS
          : "NA";
        resData.PFEES_DED_REMARKS = resData.PFEES_DED_REMARKS
          ? resData.PFEES_DED_REMARKS
          : "NA";
        resData.INV_DED_REMARKS = resData.INV_DED_REMARKS
          ? resData.INV_DED_REMARKS
          : "NA";
        resData.PHARMACY_DED_REMARKS = resData.PHARMACY_DED_REMARKS
          ? resData.PHARMACY_DED_REMARKS
          : "NA";
        resData.OT_DED_REMARKS = resData.OT_DED_REMARKS
          ? resData.OT_DED_REMARKS
          : "NA";
        resData.OTHERS_DED_REMARKS = resData.OTHERS_DED_REMARKS
          ? resData.OTHERS_DED_REMARKS
          : "NA";
        callback(
          null,
          "Remarks are as follows:\nROOMRENT DEDUCTION REMARKS : " +
            resData.ROOMRENT_DED_REMARKS +
            "\nPFEES DEDUCTION REMARKS : " +
            resData.PFEES_DED_REMARKS +
            "\nINVOICE DEDUCTION REMARKS : " +
            resData.INV_DED_REMARKS +
            "PHARMACY DEDUCTION REMARKS : " +
            resData.PHARMACY_DED_REMARKS +
            "\nOT DEDUCTION REMARKS : " +
            resData.OT_DED_REMARKS +
            "\nOTHERS DEDUCTION REMARKS : " +
            resData.OTHERS_DED_REMARKS
        );
      }
    });
  }
};
module.exports = _.assign(model);
