import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import _ from "lodash";

const app = express();
app.set("view engine", "ejs");
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(__dirname + "/public"));

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
    if (postTitle === postName) {
      console.log("match found");
    } else {
      let trimTest = "test 1";
      console.log(postName, "This is the trim test " + trimTest);
    }
  });
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
