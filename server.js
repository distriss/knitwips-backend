const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");

const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const patternRoutes = require("./routes/patterns");
const counterRoutes = require("./routes/counters");
const noteRoutes = require("./routes/notes");

require("dotenv").config({ path: "./config/.env" });
require("./config/passport")(passport);

// Connect to Database
connectDB();

// Body Parsing
app.use(express.urlencoded({ extended: true })); // enables parsing of form entries
app.use(express.json());

app.use(logger("dev"));

app.use(methodOverride("_method")); // if requests have _method query parameter - override it

app.use(cors({
    origin: 'http://localhost:3000' // production: process.env.CORS_ORIGIN 
}));

// Sessions Setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    store: MongoStore.create({
        mongoUrl: process.env.DB_STRING,      
    }),
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash error messages
app.use(flash());

// Listening for Routes
app.use("/", mainRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/pattern", patternRoutes);
app.use("/counter", counterRoutes);
app.use("/notes", noteRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
});