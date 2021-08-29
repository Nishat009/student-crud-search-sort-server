const express = require("express");
const app = express();
//  const ObjectID = require('mongodb').ObjectID;
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { MongoClient } = require("mongodb");
const ObjectID = require("mongodb").ObjectId;
// const MongoClient = require('mongodb').MongoClient;
require("dotenv").config();
const PORT = process.env.PORT || 5000;
app.use(cors());
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ktoki.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const studentsCollection = client.db("student").collection("students");

  //   add student
  app.post("/addStudent", (req, res) => {
    const newStudent = req.body;
    studentsCollection.insertOne(newStudent).then((result) => {
      res.send(result.insertCount > 0);
    });
  });

  app.get("/students", (req, res) => {
    studentsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //   delete student
  app.delete("/deleteStudents/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    studentsCollection.deleteOne({ _id: id }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });

  //   update student
  app.get("/updateS/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    studentsCollection.find({ _id: id }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });
  app.patch("/updateStudent/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    studentsCollection
      .updateOne(
        { _id: id },
        {
          $set: {
            name: req.body.name,
            sId: req.body.sId,
            reg: req.body.reg,
            imageURL: req.body.imageURL,
          },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });
  console.log("SUCCESSFULLY DONE");
});

app.get("/", (req, res) => {
  res.send("hello from db it's working");
});

app.listen(PORT);
