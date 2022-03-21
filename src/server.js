import express from "express"
import res from "express/lib/response";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));

const port = 3000;
const handleListen = () => console.log(`Listening on http://localhost:${port}`);
app.listen(port, handleListen);