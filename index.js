require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.use(bodyParser.json());

const { TextServiceClient } =
  require("@google-ai/generativelanguage").v1beta2;

const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/text-bison-001";
const API_KEY = process.env.API_KEY;

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

// const prompt = "Repeat after me: one, two,";
app.post('/api', (req, res) => {
    const prompt = req.body.prompt;
    client
  .generateText({
    model: MODEL_NAME,
    prompt: {
      text: prompt,
    },
  })
  .then((result) => {
    const answer = result[0].candidates[0].output;
    console.log(JSON.stringify(answer, null, 2));
    res.json(answer);
  }).catch((err) => {
    console.log(err.details);
    res.json(err.details);
  });
})

app.listen('8000', console.log("RUNNING ON PORT 8000"));