Date.prototype.addDays = function(days) {
  return new Date(this.valueOf() + days * 864e5);
};

Date.prototype.customFormat = function() {
  return this.toLocaleDateString()
    .split("/")
    .map(i => i.substr(-2, 2).padStart(2, "0"))
    .join("/");
};
