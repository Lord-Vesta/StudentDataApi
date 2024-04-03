const express = require("express");
const fs = require("fs");
// const bodyParser = require("body-parser");
const app = express();
app.use(express.json());

let data = JSON.parse(fs.readFileSync("./data.json"));

// creating a server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// get request
app.get("/data/listData", (req, res) => {
  res.status(200);
  res.json({
    status: "fetched",
    data: data,
  });
});

// post request
app.post("/data/addData", (req, res) => {
  // console.log(req.body);
  let newId = data[data.length - 1].id + 1;

  let newData = Object.assign({ id: newId }, req.body);

  data.push(newData);
  fs.writeFile("./data.json", JSON.stringify(data), (err) => {
    res.status(201);
    res.json({
      status: "created",
      data: newData,
    });
  });
});

// put request
app.put("/data/editData/:id", (req, res) => {
  let existingData = data;
  let studId = req.params.id;

  if (isNaN(studId) || studId < 1 || studId > data.length) {
    res.status(404);
    res.json({ error: "invalid Id number" });
  }
  {
    let NewStudId = parseInt(studId);
    existingData[studId - 1] = req.body;
    existingData[studId - 1] = Object.assign(
      { id: NewStudId },
      existingData[studId - 1]
    );
    let stringifyData = JSON.stringify(existingData);
    fs.writeFile("./data.json", stringifyData, () => {
      res.status(200).json({
        status: "editted",
        data: existingData[studId - 1],
      });
    });
  }
});
