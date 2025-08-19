var express = require('express');
var router = express.Router();
var userModel = require("../models/userModel");
var blogModel = require("../models/blogModel");
var bcrypt = require('bcryptjs');
const multer  = require('multer');
const path = require('path');
var jwt = require('jsonwebtoken');
const { GoogleGenAI } = require("@google/genai");
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const secret = process.env.JWT_SECRET || "dev_secret";

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/signUp", async (req, res) => {
  let { username, name, email, password } = req.body;
  let emailCon = await userModel.findOne({ email: email });
  if (emailCon) {
    return res.json({
      success: false,
      msg: "Email already exists"
    });
  }
  else {
    bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) throw err;

        let user = await userModel.create({
          username: username,
          name: name,
          email: email,
          password: hash,
        });

        return res.json({
          success: true,
          msg: "User created successfully",
        })
      });
    });
  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email: email });
  if (!user) {
    return res.json({
      success: false,
      msg: "User not found"
    });
  }
  else {
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        let token = jwt.sign({ userId: user._id }, secret);
        return res.json({
          success: true,
          msg: "User logged in successfully",
          token: token
        })
      }
      else{
        return res.json({
          success: false,
          msg: "Invalid password"
        })
      }
    })
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extName = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extName);
  }
})

const upload = multer({ storage: storage });

router.post("/uploadBlog", upload.single('image'), async (req, res) => {
  try {
    let {token, title, desc, content} = req.body;
    // Decode the token to get the user ID
    let decoded = jwt.verify(token, secret);
    let user = await userModel.findOne({ _id: decoded.userId });
    
    if (!user) {
      return res.json({
        success: false,
        msg: "User not found"
      });
    }
    
    // Retrieve the file name from the uploaded file
    const imageName = req.file ? req.file.filename : null;

    // Create a new blog entry
    let blog = await blogModel.create({
      title: title,
      content: content,
      image: imageName, // Use the image name here
      desc: desc,
      user: user._id
    });

    // Respond with success
    return res.json({
      success: true,
      msg: "Blog created successfully",
      blog: blog
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      msg: "An error occurred"
    });
  }
});

router.post("/getBlogs", async (req, res) => {
  let {token} = req.body;
  let decoded = jwt.verify(token, secret);
  let user = await userModel.findOne({ _id: decoded.userId });
  if (!user) {
    return res.json({
      success: false,
      msg: "User not found"
    });
  }
  else{
    let blogs = await blogModel.find({});
    return res.json({
      success: true,
      msg: "Blogs featched successfully",
      blogs: blogs
    })
  }
});

router.post("/getBlog", async (req, res) => {
  let {token, blogId} = req.body;
  let decoded = jwt.verify(token, secret);
  let user = await userModel.findOne({ _id: decoded.userId });
  if (!user) {
    return res.json({
      success: false,
      msg: "User not found"
    });
  }
  else{
    let blog = await blogModel.findOne({_id: blogId});
    return res.json({
      success: true,
      msg: "Blog featched successfully",
      blog: blog
    })
  }
});



router.post("/summarize", async (req, res) => {
  try {
    const { content } = req.body;
    const prompt = `Summarize the following blog post:\n\n${content}`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
    });

    // response.text is a string (property), not a function
    res.json({ success: true, summary: response.text });
  } catch (error) {
    console.error("Error summarizing:", error);
    res.status(500).json({ success: false, msg: "Error summarizing content." });
  }
});


router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    const fullPrompt =
      `Generate a blog post about "${prompt}". ` +
      `Format it using HTML tags like <h3> for headings and <p> for paragraphs.`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: fullPrompt,
    });

    res.json({ success: true, content: response.text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ success: false, msg: "Error generating content." });
  }
});


module.exports = router;