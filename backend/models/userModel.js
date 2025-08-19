var mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blogApp";
mongoose.connect(mongoUri);

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  isAdmin:{
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;