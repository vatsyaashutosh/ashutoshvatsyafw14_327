const mongoose = require("mongoose");

module.exports = () => {
  return mongoose.connect("mongodb+srv://vatsyaashutosh:ashutosh123@cluster0.p1pcz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
};
