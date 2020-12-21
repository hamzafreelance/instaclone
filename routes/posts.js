const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const fs = require("fs");

const Post = require("../models/Post");
const postValidator = require("../validations/post");

router.get(
  "/:offSet",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.find({ user: req.user._id })
    .skip(parseInt(req.params.offSet))
      .limit(8)
      .then(posts => {
        res.send(posts);
      });
    //res.send({ message: "Posts route" });
  }
);
var upload = multer({ dest: "./uploads" });
router.post(
  "/create",
  [passport.authenticate("jwt", { session: false }), upload.single("file")],
  (req, res) => {
    const { errors, isValid } = postValidator(req.body, req.file);

    if (!isValid) {
      res.status(400).send({ error: true, message: errors });
    }
    const { title, description } = req.body;
    let userId = req.user._id;
    let path = "";
    let type = "";
    if (req.file !== undefined) {
      var tmpPath = req.file.path;
      let destPath = "./uploads/" + userId + "/" + req.file.originalname;
      if (!fs.existsSync("./uploads/" + userId)) {
        fs.mkdirSync("./uploads/" + userId + "/");
      }
      path = destPath;
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
    var ext = path.substr(path.lastIndexOf(".") + 1);
    if (ext == "mp4") {
      type = "video";
    } else {
      type = "image";
    }
    new Post({
      user: req.user._id,
      title,
      description,
      type,
      path
    })
      .save()
      .then(post => {
        if (post) {
          res.send({ error: false, message: "Post created successfully." });
        }
      })
      .catch(err => res.send({ error: true, message: err.message }));
    res
      .status(200)
      .send({ error: false, message: "Post created successfully." });
  }
);

router.patch(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = postValidator(req.body);

    if (!isValid) {
      res.status(400).send({ error: true, message: errors });
    }
    Post.findOne({ _id: req.params.postId }).then(post => {
      if (!post) {
        res.status(400).send({ error: true, message: "Post not found." });
      }

      const { title, description, type, path } = req.body;

      Post.findOneAndUpdate(
        { _id: req.params.postId },
        { title, description, type, path },
        {
          new: true
        }
      ).then(post => {
        res.send({ error: false, message: "Post updated successfully." });
      });
    });
  }
);

router.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let id = req.params.postId;
    if (!id) {
      res.status().send({ error: true, message: "ID missing." });
    }

    Post.deleteOne({ _id: id }).then(deleted => {
      if (deleted) {
        res
          .status(200)
          .send({ error: false, message: "Post deleted successdully." });
      } else {
        res
          .status(400)
          .send({ error: true, message: "Could not delete post." });
      }
    });
  }
);

router.get("/detail/:postId", (req, res) => {
  let postId = req.params.postId;

  Post.find({_id: postId}).then(post => {
    if(!post)
      res.status(404).send({message: 'Post not found'});

    res.status(200).send({post: post, message: 'Post detail found'});
  });
});

module.exports = router;
