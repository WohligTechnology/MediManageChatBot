var Log = require("./Log");
module.exports = {
  policyNumber: function(body, callback) {
    Log.policyNumber(body, function(err, res) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, "Hi " + res.CLAIMANT_NAME + ", how can I help you?");
      }
    });
  },
  claimNumber: function(body, callback) {
    Log.claimNumber(body, function(err, res) {
      if (err) {
        callback(err, null);
      } else {
        callback(
          null,
          "Hi " +
            res.CLAIMANT_NAME +
            " your claim status is " +
            res.STATUS +
            ", how can I help you?"
        );
      }
    });
  },
  claimBreakup: function(body, callback) {
    Log.claimBreakup(body, callback);
  },
  query: function(body, callback) {
    Log.query(body, callback);
  },
  status: function(body, callback) {
    Log.policyStatus(body, function(err, res) {
      callback(null, res);
    });
  },
  amount: function(body, callback) {
    Log.policyAmount(body, function(err, res) {
      callback(null, res);
    });
  },
  getSingleAmount: function(body, callback) {
    Log.getSingleAmount(body, function(err, res) {
      callback(null, res);
    });
  }
};
