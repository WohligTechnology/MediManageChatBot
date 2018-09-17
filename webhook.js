var Log = require('./Log');
module.exports = {
    policyNumber: function (body, callback) {
        Log.policyNumber(body, function (err, res) {
            callback(null, "Hi " + res.EMPLOYEE_NAME + ", how can I help you?");
        })
    },
    status: function (body, callback) {
        Log.policyStatus(body, function (err, res) {
            callback(null, res);
        })
    },
    amount: function (body, callback) {
        Log.policyAmount(body, function (err, res) {
            callback(null, res);
        })
    }
}