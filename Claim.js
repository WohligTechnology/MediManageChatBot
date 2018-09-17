// var Log = require('./Log');
var schema = new Schema({
    POLICYHOLDERNAME: String,
    POLICY_NUMBER: Number,
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
    SETTLEDAMOUNT: Number

});
var Claim = mongoose.model('Claim', schema);

var model = {
    getAll: function (data, callback) {
        Claim.find().exec(function (err, data) {
            if (err) {
                callback(err, null)
            } else {
                callback(null, data)
            }
        });
    },
    getOnePolicy: function (data, callback) {
        console.log("In Claims", data);
        var POLICY_NUMBER = parseInt(data.queryResult.parameters.POLICY_NUMBER);
        Claim.findOne({
            POLICY_NUMBER: POLICY_NUMBER
        }).lean().exec(function (err, resData) {
            if (err) {
                callback(err, null);
            } else {
                resData.session = data.session;
                callback(null, resData);
            }
        });
    }
};
module.exports = _.assign(model);