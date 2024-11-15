import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

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

app.get("/", (req, res) => {
  res.render("home", { homeStartingContent: homeStartingContent });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.listen(port, () => console.log(`listening on ${port}`));
