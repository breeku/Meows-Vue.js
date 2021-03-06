const express = require("express");
const cors = require("cors");
const monk = require("monk");
const Filter = require("bad-words");
const rateLimit = require("express-rate-limit");
const admin = require("firebase-admin");
let serviceAccount = require("./servicekey/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ""
});

const app = express();

const db = monk(process.env.MONGOVUE || 'localhost:27017/meows')
//const db = monk("localhost:27017/meows");
const meows = db.get("meows");
const filter = new Filter();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({});
});

app.get("/meows", (req, res) => {
  meows.find().then(meows => {
    res.json(meows);
  });
});

let isValidMeow = meow => {
  return (
    meow.name &&
    meow.name.toString().trim() !== "" &&
    meow.content &&
    meow.content.toString().trim() !== ""
  );
};

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
  })
);

app.post("/meows", (req, res) => {
    let userToken = req.body.userToken
  admin
    .auth()
    .verifyIdToken(userToken)
    .then(function(decodedToken) {
      let uid = decodedToken.uid;
      if (req.body.markedforRemoval == true) {
        let id = req.body.id
        meows.findOneAndDelete(id).then((result) => {
          res.json(result)
        })
      } else {
      if (isValidMeow(req.body)) {
        if (req.body.editPost == true) {
          let id = req.body.id
          const editmeow = {
            name: filter.clean(req.body.name.toString()),
            content:  filter.clean(req.body.content.toString()),
          };
          meows.update(id, {$set: editmeow}).then(editedMeow => {
            res.json(editedMeow);
        })
      } else {
        const meow = {
          name: filter.clean(req.body.name.toString()),
          content: filter.clean(req.body.content.toString()),
          email: filter.clean(req.body.email.toString()),
          uid: uid,
          created: new Date()
        };
        meows.insert(meow).then(createdMeow => {
          res.json(createdMeow);
        });
    }
      } else {
        console.log("Invalid post submitted");
        res.status(422);
        res.json({
          message: 'Invalid post submitted',
          solution: 'Check that your submit had name and content.'
        });
      }
    }
    }).catch(function(error) {
        console.log('Invalid token')
        res.json({
            message: 'Invalid token',
            error: error
        })
    })
});

app.listen(5000, () => {
  console.log("Listening on http://localhost:5000");
});
