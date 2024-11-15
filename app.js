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

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(port, () => console.log(`listening on ${port}`));
