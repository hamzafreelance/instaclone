const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const multerStorage = require("../config/multer");
const fs = require("fs");

const app = express();

const router = express.Router();

const User = require("../models/User");
const Post = require("../models/Post");
const Followers = require("../models/Followers");
const Following = require("../models/Following");

const keys = require("../config/keys");

const validateRegister = require("../validations/register");
const validateLogin = require("../validations/login");

router.get("/", (req, res) => {
  User.find()
    .populate("posts")
    .then(users => {
      res.send({ users: users });
    });
  return false;
  /*Post.find().populate('user').then(posts => {
        res.send({posts: posts});
    });
    return false;
    User.find().then(users => {
        res.send({users: users});
    });
   
    return false;*/
  new User({
    name: "New User",
    email: "newuser@123.com",
    password: "password"
  })
    .save()
    .then(user => {
      new Post({
        user: user._id,
        title: "new user post",
        type: "image",
        path: "new/post/path"
      })
        .save()
        .then(post => {
          User.findOne({ _id: post.user }).then(user => {
            user.posts.unshift(post._id);
            user.save().then(user => {
              res
                .status(200)
                .send({ message: "User and Post created", user: user });
            });
          });
        });
    });
  return false;
  /*Post.find().populate('user').then(posts => {
        res.send({users: users});
    });
    return false;
    User.find().populate('posts').then(users => {
        res.send({users: users});
    });*/
});
var upload = multer({ dest: "uploads/" });
router.post("/register", upload.single("picture"), (req, res) => {
  //res.send({file: req.file, body: req.body});
  const { errors, isValid } = validateRegister(req.body);
  if (!isValid) {
    res.status(400).send({ error: true, errors });
    return false;
  }
  const { name, email, password } = req.body;

  User.findOne({ email: email }).then(user => {
    if (user) {
      res
        .status(400)
        .send({ error: true, errors: { email: "Email already exists." } });
    }
  });
  var userId = "";
  bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(password, salt).then(hashedPassword => {
      new User({
        name,
        email,
        password: hashedPassword
      })
        .save()
        .then(user => {
          userId = user._id;
          jwt.sign(
            { id: user._id, name: user.name, email: user.email },
            keys.SECRET_KEY,
            { expiresIn: 3600 },
            (err, token) => {
              if (token) {
                var tmpPath = req.file.path;

                /** The original name of the uploaded file
                      stored in the variable "originalname". **/
                if (req.file !== undefined) {
                  let destPath =
                    "./uploads/" + userId + "/" + req.file.originalname;
                  if (!fs.existsSync("./uploads/" + userId)) {
                    fs.mkdirSync("./uploads/" + userId + "/");
                  }
                  user.picture = userId + "/" + req.file.originalname;
                  user.save();
                  /** A better way to copy the uploaded file. **/
                  var src = fs.createReadStream(tmpPath);
                  var dest = fs.createWriteStream(destPath);

                  src.pipe(dest);
                  fs.unlink("./uploads/" + req.file.filename, () => {
                    console.log("deleted");
                  });
                  src.on("end", function() {
                    console.log("complete");
                  });
                  src.on("error", function(err) {
                    console.log("error");
                  });
                }

                res.send({
                  error: false,
                  message: "User registered successfully.",
                  token: token,
                  name: user.name,
                  id: user._id,
                  email: user.email,
                  following: user.following,
                  followers: user.followers
                });
              }
            }
          );
        });
    });
  });

  /*var storage = multerStorage("./uploads/"+userId, "new-file-1.png");
  var upload = multer({ storage: storage }).single("picture");
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    
  });*/
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLogin(req.body);

  if (!isValid) {
    res.status(400).send({ error: true, errors });
  }

  const { email, password } = req.body;

  User.findOne({ email }).then(user => {
    if (!user)
      res.status(400).send({ error: true, message: "Invalid credentials." });

    bcrypt.compare(password, user.password).then(valid => {
      if (!valid) {
        res.status(400).send({ error: true, message: "Invalid Credentials" });
      }
      jwt.sign(
        { id: user._id, email, password },
        keys.SECRET_KEY,
        { expiresIn: 3600 },
        (err, token) => {
          //res.status(400).send({ error: true, message: "Invalid credentials." });
          //return false;
          if (err) {
            res
              .status(400)
              .send({ error: true, message: "Could not generate token." });
          }
          res
            .status(200)
            .send({
              error: false,
              message: "User logged in.",
              token: token,
              name: user.name,
              email: user.email,
              id: user._id,
              following: user.following,
              followers: user.followers
            });
        }
      );
    });
  });
});

router.get(
  "/follow/:userId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ _id: req.params.userId }).then(userToFollow => {
      //res.send({message: 'not found'});
      if (!userToFollow)
        res.status().send({ error: true, message: "User not found." });

      User.findOne({ _id: req.user._id }).then(user => {
        if (user) {
          if (user.following.indexOf(req.params.userId) !== -1) {
            res.send({ message: "Already following" });
          }
          //res.send({following: user.following});
          user.following.unshift(userToFollow._id);
          user.save().then(user => {
            res.status(200).send({ message: "User followed.", following: user.following });
          });
        }
      });
    });
  }
);

router.get(
  "/followers",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let userId = req.user._id;
    User.findOne({ _id: req.user._id }).then(user => {
      res.send({ followers: user.followers });
    });
  }
);

router.get(
  "/following",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let userId = req.user._id;
    User.findOne({ _id: req.user._id }).then(user => {
      res.send({ following: user.following });
    });
    return false;
    Following.find({ user: userId }).then(user => {
      if (!user) res.send({ following: [], message: "" });

      res.send({ following: user, message: "Following." });
    });
  }
);

router.get("/all", (req, res) => {
  User.find().then(users => res.send({ users }));
});

router.get(
  "/get/:userId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let userId = req.params.userId;
    let user = User.findOne({ _id: userId }).then(user => {
      if (user) res.status(200).send({ user });
      else res.status(400).send({ message: "User not found." });
    });
  }
);

module.exports = router;
