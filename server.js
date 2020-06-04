const express = require("express");
const db = require("./database.js");

const server = express();

//install middleware to allow express
server.use(express.json());

//USERS
server.get("/", (req, res) => {
  const users = db.getUsers();

  if (users) {
    res.json(users);
  } else {
    res.status(500).json({
      errorMessage: "The users information could not be retrieved.",
    });
  }
});

//USERS BY ID
server.get("/users/:id", (req, res) => {
  const userByID = req.params.id;
  const user = db.getUserById(userByID);

  if (user) {
    res.json(user);
  } else if (!user) {
    res.status(404).json({
      message: "The user with the specified ID does not exist.",
    });
  } else {
    res.status(500).json({
      errorMessage: "The user information could not be retrieved.",
    });
  }
});

//ADDING NEW USER
server.post("/users", (req, res) => {
  if (!req.body.name || !req.body.bio) {
    return res.status(400).json({
      errorMessage: "Please provide name and bio for the user.",
    });
  }

  const newUser = db.createUser({
    name: req.body.name,
    bio: req.body.bio,
  });

  if (newUser) {
    res.status(201).json(newUser);
  } else {
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database",
    });
  }
});

//UPDATE USER
server.put("/users/:id", (req, res) => {
  const user = db.getUserById(req.params.id);

  // can't update a user that doesn't exist, so check first
  if (user) {
    const updatedUser = db.updateUser(user.id, {
      // we whitelist values here instead of passing req.body directly,
      // so we know exactly what's allowed to be updated and what's not.
      name: req.body.name || user.name,
    });

    res.json(updatedUser);
  } else {
    res.status(404).json({
      message: "User not found",
    });
  }
});

//DELETE USER
server.delete("/users/:id", (req, res) => {
  const user = db.getUserById(req.params.id);

  if (user) {
    try {
      db.deleteUser(user.id);
      res.status(204).end();
    } catch {
      res.status(500).json({
        errorMessage: "The user could not be removed",
      });
    }
  } else {
    res.status(404).json({
      message: "The user with the specified ID does not exist.",
    });
  }
});

server.listen(7777, () => {
  console.log("server is listening on port 7777");
});
