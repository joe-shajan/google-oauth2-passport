import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import passport from "passport";
import cookieSession from "cookie-session";
import "./passport.js";
import { connect } from "./db.js";
import jwt from "jsonwebtoken";
import { User } from "./userModel.js";

const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: ["flicker-docs"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());
connect();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.get("/auth/login/success", async (req, res) => {
  if (req.user) {
    let existingUser = await User.findOne({ id: req.user.id });

    if (!existingUser) {
      return res.status(403).json({ error: true, message: "Not Authorized" });
    }

    jwt.sign(
      { user: existingUser },
      "secretKey",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          return res.json({
            token: null,
          });
        }

        res.status(200).json({
          error: false,
          message: "Successfully Loged In",
          user: existingUser,
          token,
        });
      }
    );
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

app.get("/auth/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

app.get("/auth/google", passport.authenticate("google", ["profile", "email"]));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/auth/login/failed",
  })
);

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res) => {
//     jwt.sign(
//       { user: req.user },
//       "secretKey",
//       { expiresIn: "1h" },
//       (err, token) => {
//         if (err) {
//           return res.json({
//             token: null,
//           });
//         }
//         res.json({
//           token,
//         });
//       }
//     );
//   }
// );

app.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listenting on port ${port}...`));
