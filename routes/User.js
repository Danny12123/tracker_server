const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");


const multer = require("multer");
const { initializeApp } = require("firebase/app");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
const config = require("../config/FirebaseConfig")

//Initialize a firebase application
initializeApp(config.firebaseConfig);
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });


//User Profile
router.post("/user_profile", upload.single("user_profile"), async (req, res) => {
    try {
        const storageRef = ref(
            storage,
            `user profile/${req.file.originalname + " " + Date.now()}`
        );
        const metadata = {
            contentType: req.file.mimetype,
        };
        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(
            storageRef,
            req.file.buffer,
            metadata
        );
        const downloadURL = await getDownloadURL(snapshot.ref);
        res.status(200).send(downloadURL)
    } catch (error) {
        res.status(500).send(error)
    }
});



//REGISTER
router.post("/signup", async (req, res) => {
    try {
        let userEmail = await User.findOne({ email: req.body.email });
        if (userEmail) return res.status(409).send({ message: "User with given email already Exist!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        const user = await newUser.save();
        res.status(200).send({ message: "User has been created" });
    } catch (err) {
        res.status(500).send(err.message);
    }

})


router.post("/signin", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).send({ message: "User not found" });

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        !validPassword && res.status(400).send({ message: "Wrong password" });
        res.status(200).send(user);
    } catch (err) {
        res.status(500).json(err)
    }
})

//updateUser
router.put("/updateUser/:id", async(req, res)=> {
  if (req.body.userId === req.params.id) {
    if(req.body.password) {
     try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).send({ message: "Account has been updated", user:user });
      } catch (err) {
        return res.status(500).json(err);
      }
    }
  }else {
    return res
      .status(403)
      .send({ message: "You can update only your account" });
  }
});


router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    res.status(200).json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;