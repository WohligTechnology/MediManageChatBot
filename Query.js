var schema = new Schema({
  CLAIMID: Number,
  QUERIED_DATE: String,
  QUERY_RECEIVED_DATE: String,
  QUERY_REMARKS: String
});
var Query = mongoose.model("Query", schema);

var model = {
  getAll: function(data, callback) {
    Query.find().exec(function(err, data) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, data);
      }
    });
  },
  getOneQuery: function(data, callback) {
    var CLAIMID = parseInt(data.queryResult.parameters.CLAIMID);
    console.log("Claim Id", CLAIMID);
    Query.findOne({
      CLAIMID: CLAIMID
    })
      .lean()
      .exec(function(err, resData) {
        if (err) {
          callback(err, null);
        } else if (_.isEmpty(resData)) {
          callback("Please provide valid Claim ID", null);
        } else {
          resData.session = data.session;
          callback(null, resData);
        }
      });
  }
};
module.exports = _.assign(model);
