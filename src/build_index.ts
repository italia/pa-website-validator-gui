import { app } from "electron";
import * as ejs from "ejs";
import path from "path";
import { writeFileSync } from "fs";

const __dirname = import.meta.dirname;
const saveDirname = app.getPath("userData");

//TODO: get this from crawler in node_modules
const data = {
  crawlerVersion: "1.0.0",
  guiVersion: "1.0.0",
  basePathCss: path.join(__dirname, "public/css/"),
  basePathJs: path.join(__dirname, "public/js/"),
  basePathImages: "public/images/",
  currentPage: "",
};

const templatePath = path.join("src/views", "index.ejs");

ejs.renderFile(templatePath, data, {}, (err, str) => {
  if (err) {
    console.error("Errore nel renderizzare il template EJS:", err);
    return;
  }

  const outputPathFile = path.join(saveDirname, "index.html");

  writeFileSync(outputPathFile, str);
});
