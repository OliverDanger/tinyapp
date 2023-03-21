const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = () => {
  const possibleChars = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
  let outputBuffer = [];
  for (let i = 0; i < 6; i++) {
    const charIndex = Math.floor(Math.random() * possibleChars.length);
    outputBuffer.push(possibleChars[charIndex]);
  }
  console.log(outputBuffer)
  outputBuffer = outputBuffer.join('');
  return outputBuffer;
};
 
//_______________________________________________________________________________________

app.get("/", (req, res) => {
  res.send("<html><body>Hello World!<h1> How did you get here? </h1></body></html>\n");
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.post('/urls', (req, res) => {
  const n = generateRandomString()
  urlDatabase[n] = req.body.longURL;
  res.send("Ok")
})

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/help', (req, res) => {
  const someStuff = { greeting: 'Howdy partner!' };
  res.render('urls_help', someStuff);
});

app.get('/urls/:id', (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render('urls_show', templateVars);
});

//_______________________________________________________________________________________
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});