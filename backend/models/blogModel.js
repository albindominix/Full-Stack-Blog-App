var mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blogApp";
mongoose.connect(mongoUri);

const blogSchema = new mongoose.Schema({
  title: String,
  desc: String,
  image: String,
  content: String,
  date: {
    type: Date,
    default: Date.now,
  }
});

const blogModel = mongoose.model("blog", blogSchema);

module.exports = blogModel;