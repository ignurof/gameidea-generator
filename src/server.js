// Required dependency
const express = require("express");
const svelteViewEngine = require("svelte-view-engine");
const config = require("../config.js");

const ideagenerator = require("./ideagenerator.js");

// Application
let app = express();
const PORT = 3001;

// View Engine declarations
let engine = svelteViewEngine(config.svelteViewEngine);
let { dir, type, buildDir } = config.svelteViewEngine;

// View Engine setup
app.engine(type, engine.render);
app.set("view engine", type);
app.set("views", dir);
// Change this to fit your static content (Images, etc.)
app.use("/assets", express.static(buildDir));

// Auto-parse JSON for res.json
app.use(express.json());

// Render the response with props before responding
app.get("/", async(req, res, next) => {
    res.render("index", {
        // Props here
    });
});

app.get("/generate", async(req, res, next) => {
    let myIdeas = await ideagenerator.GenerateIdea();

    res.json(myIdeas);
});

app.listen(PORT, () => {
    console.log("Server listening on port: " + PORT);
});