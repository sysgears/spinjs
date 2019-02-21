// tslint:disable
module.exports = function() {
  this.callback(this.query.error, JSON.stringify(this.query.result));
};
