const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 8001;

connectToMongoDB(
  "mongodb+srv://faa2:u18cps1005@cluster0.shw6lom.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
).then(() => console.log("Mongodb connected"));

app.use(express.json());

app.use("/url", urlRoute);

app.all("*", () => {
  throw new Error("routes not found");
});

app.post("/", async (req, res) => {
  res.status(200).json({
    message: "hello world",
  });
  const shortId = req.params.shortId;
  const url = req.body.url;
  console.log(req.body);
  console.log(url);
  console.log(shortId);
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
