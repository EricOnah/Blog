import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import _ from "lodash";
import { mongoose, connect, Schema, model } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const url = process.env.MONGODB_URI;
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(__dirname + "/public"));

// connect mongodb
try {
  main();
} catch (error) {
  console.log("Error: ", error);
}

async function main() {
  await connect(url);
  console.log("Connected to MongoDB");
}
// create schema and model

const postSchema = new Schema(
  {
    _id: Number,
    title: String,
    content: String,
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);
const Post = model("Post", postSchema);

const postsInDb = await Post.find({});

let counter = 0;
function generateId() {
  if (postsInDb.length === 0) {
    counter++;
    return counter;
  } else if (postsInDb.length > 0) {
    const maxId = _.maxBy(postsInDb, "id").id;
    counter = +maxId + 1; //using lodash to return the max id number in our blog database

    // let postIdArray = [];
    // postsInDb.forEach((post) => {
    //   postIdArray.push(post._id);
    // });

    // let maxId = Math.max(...postIdArray); //hard coding the max id number
    // counter = maxId + 1;
    return counter;
  }
}

if (postsInDb.length === 0) {
  const homeStartingContent = new Post({
    _id: generateId(),
    title: "Home",
    content:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis ratione officiis animi sequi quos reprehenderit quasi ex omnis maiores, assumenda molestiae, laudantium incidunt, obcaecati asperiores suscipit error rerum! Sapiente, minus.",
  });

  const aboutContent = new Post({
    _id: generateId(),
    title: "About",
    content:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis ratione officiis animi sequi quos reprehenderit quasi ex omnis maiores, assumenda molestiae, laudantium incidunt, obcaecati asperiores suscipit error rerum! Sapiente, minus.",
  });

  const contactContent = new Post({
    _id: generateId(),
    title: "Contact",
    content:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis ratione officiis animi sequi quos reprehenderit quasi ex omnis maiores, assumenda molestiae, laudantium incidunt, obcaecati asperiores suscipit error rerum! Sapiente, minus.",
  });

  Post.insertMany([homeStartingContent, aboutContent, contactContent]);
}

app.get("/", async (req, res) => {
  const posts = await Post.find({});
  res.render("home", { posts: posts });
});

app.get("/about", (req, res) => {
  const about = Post.findOne({ title: "About" }).exec();
  about.then((data) => {
    let aboutContent = data.content;
    let aboutTitle = data.title;
    res.render("about", { aboutTitle: aboutTitle, aboutContent: aboutContent });
  });
});

app.get("/posts/:post", async (req, res) => {
  const posts = await Post.find({});
  const postName = _.kebabCase(req.params.post).replace(/-/g, "");
  posts.forEach((post) => {
    const postTitle = post.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    const postBody = post.content;
    if (postTitle === postName) {
      res.render("post", { postTitle: post.title, postBody: postBody });
    }
  });
});

app.get("/contact", (req, res) => {
  const contact = Post.findOne({ title: "Contact" }).exec();
  contact.then((data) => {
    let contactContent = data.content;
    let contactTitle = data.title;
    res.render("contact", {
      contactTitle: contactTitle,
      contactContent: contactContent,
    });
  });
});
app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", async (req, res) => {
  const title = req.body.postTitle;
  const content = req.body.postBody;

  if (title) {
    const post = new Post({
      _id: generateId(),
      title: title,
      content: content,
    });
    await post.save();
    res.redirect("/");
  } else {
    console.log("Please enter a title.");
    res.redirect("/compose");
  }
});

app.post("/delete", (req, res) => {
  const postTitle = req.body.postTitle;
  Post.deleteOne({ title: postTitle }).exec();
  res.redirect("/");
});

app.get("/edit/:post", (req, res) => {
  const postTitle = req.params.post;
  const post = Post.findOne({ title: postTitle }).exec();
  post.then((data) => {
    let postContent = data.content;
    let postTitle = data.title;
    let postId = data._id;
    res.render("edit", {
      postTitle: postTitle,
      postContent: postContent,
      postId: postId,
    });
  });
});

app.post("/update", (req, res) => {
  const updatedTitle = req.body.postTitle;
  const updatedContent = req.body.postBody;
  const id = req.body.postId;
  async function update() {
    try {
      const filter = { _id: id };
      const options = { upsert: true };
      const newValues = {
        $set: { title: `${updatedTitle}`, content: `${updatedContent}` },
      };
      const result = await Post.updateOne(filter, newValues, options);
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  }
  update();
});

app.listen(port, () => console.log(`listening on ${port}`));
