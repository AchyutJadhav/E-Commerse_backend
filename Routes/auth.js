const router = require("express").Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register

router.post("/register", async (req, res) => {
  // const salt = await bcrypt.genSalt(10);
  // const hashPass = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    // console.log(user)
    if (!user) {
      res.status(401).json("invalid cridential");
    } else {
      const password = user.password;

      if (password !== req.body.password) {
        res.status(401).json("invalid cridential");
      } else {
        const accessToken = jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          process.env.JWT_SEC,
          { expiresIn: "3d" }
        );
        const { pass, ...others } = user._doc;
        
        res.status(200).json({ ...others, accessToken });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
