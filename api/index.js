const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailder = require("nodemailer");

const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken");

mongoose
  .connect(
    "mongodb+srv://palsatyajit986:Jitu%401234@cluster0.l0olqxr.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("connected to the Db");
  })
  .catch((err) => {
    console.log("Error in connecting to db ");
  });

app.listen(port, () => {
  console.log("server is running on " + port);
});

const User = require("./models/user");
const Post = require("./models/post");

// api endpoints

// register user

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email has already been registered" });
    }

    // create a new user

    const newUser = new User({ name, email, password });

    // generate and store the verification token

    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // save the user to the db
    await newUser.save();

    // Send the verification email to the user

    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(200).json({
      message: "Registration successful , plz check email for verification",
    });
  } catch (error) {
    console.log("error registering the user", error);
    res.status(500).json({ message: "error registering the user" });
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  // create a nodemailer transporter
  const transporter = nodemailder.createTransport({
    service: "gmail",
    auth: {
      user: "palsatyajit986@gmail.com",
      pass: "kwfj kfda qoyj jflv",
    },
  });

  const mailOptions = {
    from: "threads.com",
    to: email,
    subject: "Email Verification",
    text: `Please click on the following link to verify your email http://localhost:3000/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error Sending the email", error);
  }
};

app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("Error Getting the token ", error);
    res.status(500).json({ message: "Email verification has failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid User" });
    }

    if (user.password !== password) {
      return res.status(404).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

// api to access all the users except the logged in user

app.get("/user/:userId", (req, res) => {
  try {
    const loggedInUserId = req.params.userId;
    console.log("reached here ");

    User.find({ _id: { $ne: loggedInUserId } })
      .then((users) => {
        console.log(users);
        res.status(200).json(users);
      })
      .catch((error) => {
        console.log("Error:", error);
        res.status(500).json("error");
      });
  } catch (error) {
    res.status(500).json({ message: "error fetching the users" });
  }
});

// api to follow a user

app.post("/follow", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;
  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { followers: currentUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error in following a user " });
  }
});

// api to unfollow a user

app.post("/users/unfollow", async (req, res) => {
  const { loggedInUserId, targetUserId } = req.body;

  try {
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedInUserId },
    });
    res.status(200).json({ message: "Unfollowed Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in unfollowing the user" });
  }
});

// api to create a new post

app.post("/create-post", async (req, res) => {
    try {
      const { content, userId } = req.body;
  
      const newPostData = {
        user: userId,
      };
  
      if (content) {
        newPostData.content = content;
      }
  
      const newPost = new Post(newPostData);

  
      await newPost.save();
  
      res.status(200).json({ message: "Post saved successfully" });
    } catch (error) {
      res.status(500).json({ message: "post creation failed" });
    }
  });

// api to like a post

app.put("/post/:postId/:userId/like", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;



    const post = await Post.findById(postId).populate("user", "name");

    console.log(post, "hi")

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(400).json({ message: "Post not found" });
    }

    updatedPost.user = post.user;

    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An Error occured while liking" });
  }
});

// api to dislike a post

app.put("/post/:postId/:userId/dislike", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const post = await Post.findById(postId).populate("user", "name");

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(400).json({ message: "Post not found" });
    }

    updatedPost.user = post.user;

    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An Error occured while liking" });
  }
});

// api to get all the posts

app.get("/get-posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });
    
    res.status(200).json(posts)

  } catch (error) {
    res.status(500).json({ message: "An error occured while getting posts" });
  }
});

// api to populate the profile page

app.get("/profile/:userId" , async(req, res) => {
    try {
        const userId = req.params.userId ;

        const user = await User.findById(userId) ;
        
         if(!user) {
            return res.status(404).json({message : "User not found"}) ;
         }

         return res.status(200).json({user})

    } catch (error) {
         res.status(500).json({message : "Error while getting the profile"}) ;

    }
})
