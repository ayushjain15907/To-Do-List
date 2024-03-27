import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import session from "express-session";

const port = 3021;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));

app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
}));

let items = [];

app.get("/", (req, res) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const dte = today.getDate();
    const mnthIndex = today.getMonth();
    const year = today.getFullYear();
    const dayIndex = today.getDay();
    const formattedDate = `${dayNames[dayIndex]} ${dte} ${monthNames[mnthIndex]}, ${year}`;

    const checkboxState = req.session.checkboxState || {}; // key value pair will be made
    res.render("index.ejs", {
        year:year,
        Today: formattedDate,
        allItems: items,
        checkboxState: checkboxState
    });
});

app.post("/", (req, res) => {
    const newItm = req.body["newItem"];
    items.push(newItm);
    req.session.checkboxState = req.session.checkboxState || {};
    req.session.checkboxState[newItm] = false;
    res.redirect("/");
});

app.post('/toggleCheckbox', (req, res) => {
    const itemName = req.body.itemName;
    req.session.checkboxState[itemName] = !req.session.checkboxState[itemName];
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`listening on port ${port}.`);
});
