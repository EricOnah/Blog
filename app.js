import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import _ from "lodash";
import { mongoose, connect, Schema, model } from "mongoose";
// import { mongoose, connect, model, Schema } from "mongoose";
// import dotenv from "dotenv";
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
// configure dotenv

try {
  main();
} catch (error) {
  console.log("Error: ", error);
}

async function main() {
  await connect(url);
  console.log("Connected to MongoDB");
}

const homeStartingContent =
  " Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis ratione officiis animi sequi quos reprehenderit quasi ex omnis maiores, assumenda molestiae, laudantium incidunt, obcaecati asperiores suscipit error rerum! Sapiente, minus.";

const aboutContent =
  " Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis ratione officiis animi sequi quos reprehenderit quasi ex omnis maiores, assumenda molestiae, laudantium incidunt, obcaecati asperiores suscipit error rerum! ipsum dolor sit amet consectetur adipisicing elit. Reiciendis ratione officiis animi sequi quos reprehenderit quasi ex omnis maiores, assumenda molestiae, laudantium incidunt, obcaecati asperiores suscipit error rerum! Sapiente, minus.";
const contactContent =
  " Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis ratione officiis animi sequi quos reprehenderit quasi ex omnis maiores, assumenda molestiae, laudantium incidunt, obcaecati asperiores suscipit error rerum! ipsum dolor sit amet consectetur adipisicing elit. Reiciendis ratione officiis animi sequi quos reprehenderit quasi ex omnis maiores, assumenda molestiae, laudantium incidunt, obcaecati asperiores suscipit error rerum! Sapiente, minus.";
const posts = [];
app.get("/", (req, res) => {
  res.render("home", {
    homeStartingContent: homeStartingContent,
    posts: posts,
  });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/posts/:post", (req, res) => {
  const postName = _.kebabCase(req.params.post).replace(/-/g, "");
  posts.forEach((post) => {
    // const postTitle = _.kebabCase(post.title).replace(/-/g, "");
    const postTitle = post.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    const postBody = post.body;
    if (postTitle === postName) {
      res.render("post", { postTitle: post.title, postBody: postBody });
      return;
    } else {
      console.log("Error");
    }
  });
  // res.render("post");
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});
app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  let post = {};
  post.title = req.body.postTitle;
  post.body = req.body.postBody;
  posts.push(post);
  res.redirect("/");
});

app.listen(port, () => console.log(`listening on ${port}`));
