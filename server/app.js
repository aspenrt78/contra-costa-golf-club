"use strict";

require("./config");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const coursesRoutes = require("./routes/courses");
const roundsRoutes = require("./routes/rounds");
const tournamentsRoutes = require("./routes/tournaments");
const greeniesRoutes = require("./routes/greenies");
const pointsRoutes = require("./routes/points");

const app = express();

// Enable pre-flight across-the-board
app.options("*", cors());

// Only allow these domains to make requests
app.use(
  cors({
    origin: [
      "https://ccgc.vercel.app",
      "https://ccgc.app",
      "http://localhost:3000",
      "https://www.ccgc.app",
    ],
  })
);

// Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

// Prefixes for API endpoints
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/courses", coursesRoutes);
app.use("/rounds", roundsRoutes);
app.use("/tournaments", tournamentsRoutes);
app.use("/greenies", greeniesRoutes);
app.use("/points", pointsRoutes);

/** Display some welcome json for the root endpoint */
app.get("/", (req, res) => {
  return res.json({
    message: "Welcome to the Contra Costa Golf Club API!",
    github: "https://github.com/MattPereira/contra-costa-golf-club",
    linkedIn: "https://www.linkedin.com/in/-matt-pereira-/",
    sampleEndpoints: ["/courses", "/rounds", "/tournaments", "/greenies"],
  });
});

/** So server logs dont throw error looking for /favicon.ico when I visit with browser */
app.get("/favicon.ico", (req, res) => res.status(204));

/** Handle 404 errors -- if an endpoint that doesnt exist gets requested */
app.use(function (req, res, next) {
  console.log("THIS ENDPOINT DOES NOT EXIST");
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;

// server/app.js (or index.js)
const teamsRouter = require('./routes/teams');
// ...
app.use('/api/teams', teamsRouter);
