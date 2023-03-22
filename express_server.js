const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080

app.use(cookieParser())
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

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
  outputBuffer = outputBuffer.join('');
  return outputBuffer;
};

//_______________________________________________________________________________________
//home
app.get("/", (req, res) => {
  res.send("<html><body>Hello World!<h1> How did you get here? </h1></body></html>\n");
});

//joke page
app.get('/help', (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],
    greeting: 'HI!'
  };
  res.render('urls_help', templateVars);
});

//login a user
app.post('/login', (req, res) => {
  const username = req.body.username;
  res.cookie('username', username, { httpOnly: false });
  res.redirect('/urls')
});

//logout a user
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls')
})

//index
app.get('/urls', (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase
  };
  res.render('urls_index', templateVars);
});

//visit add new url page
app.get('/urls/new', (req, res) => {
  const templateVars = { 
    username: req.cookies["username"]
  };
  res.render('urls_new', templateVars);
});

//post a new url
app.post('/urls', (req, res) => {
  const n = generateRandomString();
  urlDatabase[n] = req.body.longURL;
  res.redirect('/urls/' + n);
});

//return json url database
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});
//redirect to longURL
app.get('/u/:id', (req, res) => {
  console.log('destination', urlDatabase[req.params.id]);
  const destination = "http://" + urlDatabase[req.params.id];
  res.redirect(302, destination);
});
//show url details
app.get('/urls/:id', (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
   };
  res.render('urls_show', templateVars);
});
//edit url
app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.editURL;
  res.redirect('/urls/');
});
//delete a url from the database
app.post('/urls/:id/delete', (req, res) => {
  const id = (req.params.id);
  delete urlDatabase[id];
  res.redirect('/urls');
});
//add new url to database, redirect to that url's page
app.post('/urls', (req, res) => {
  const n = generateRandomString();
  urlDatabase[n] = req.body.longURL;
  res.redirect('/urls/:id' + n);
});

//_______________________________________________________________________________________
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});