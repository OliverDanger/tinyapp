const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080

app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": { 
    longURL :"http://www.lighthouselabs.ca",
    userID: 000001
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: 000002
  }
};

const users = {
  000001: {
    id: 000001,
    email: "URLslayer3000@yahoo.ca",
    password: "turle-duck"
  },
  000002: {
    id: 000002,
    email: "URLslayer9000@yahoo.ca",
    password: "turle-goose"
  }
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

const isMatchingEmail = (email) => {
  for (const id in users) {
    if (email == users[id].email) {
      return users[id];
    }
  }
  return null;
};

const urlsForUser = (id) => {
  let outputBuffer = {}
  for (const itemID in urlDatabase) {
    if (urlDatabase[itemID].userID == id) {
      outputBuffer[itemID] = urlDatabase[itemID];
    }
  }
  return outputBuffer;
}



//_______________________________________________________________________________________
//home
app.get("/", (req, res) => {
  res.send("<html><body>Hello World!<h1> How did you get here? </h1></body></html>\n");
});

//joke page
app.get('/help', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    greeting: 'HI!'
  };
  res.render('urls_help', templateVars);
});



//go to register page
app.get('/register', (req, res) => {
  if (req.cookies.user_id) {
    res.redirect("/urls");
    return;
  }
  res.render('urls_register');
});
//attempt to register a user
app.post('/register', (req, res) => {
  console.log(req.body);
  const { id, email, password } = req.body;

  //is email already in users
  if (isMatchingEmail(email)) {
    res.status(400).redirect('/login')
    return;
  }
  //email and password filled in
  if (email.length === 0 || password.length === 0) {
    res.status(400).redirect('/register')
    return;
  }

  const newID = generateRandomString();

  users[newID] = {
    id: newID,
    email: email,
    password: password
  };
  res.cookie('user_id', newID, { httpOnly: false });
  console.log(users);
  res.redirect("/urls");
});
//go to login pagee
app.get("/login", (req, res) => {
  if (req.cookies.user_id) {
    res.redirect("/urls");
    return;
  }
  res.render('urls_login')
})
//attempt a login
app.post("/login", (req, res) => {

  const { email, password } = req.body;
  const trueUser = isMatchingEmail(email)

  if (!trueUser) {
    res.status(403).redirect('/login')
    return;
  }

  if( password != trueUser.password ) {
    res.status(403).redirect('/login')
    return;
  }

  res.cookie('user_id', trueUser.id, { httpOnly: false });
  console.log('logged in as', email)
  res.redirect('/urls');


})

//logout a user
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

//index
app.get('/urls', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id],
    urls: urlsForUser(req.cookies.user_id)
  };
  res.render('urls_index', templateVars);
});

//visit add new url page
app.get('/urls/new', (req, res) => {
  if (!req.cookies.user_id) {
    res.redirect("/login");
    return;
  }
  const templateVars = {
    user: users[req.cookies.user_id],
  };
  res.render('urls_new', templateVars);
});

//post a new url
app.post('/urls', (req, res) => {
  const n = generateRandomString();
  urlDatabase[n] = {
    longURL: req.body.longURL,
    userID: req.cookies.user_id
  }
  res.redirect('/urls/' + n);
});

//return json url database
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});
//redirect to longURL
app.get('/u/:id', (req, res) => {
  console.log('destination', urlDatabase[req.params.id]);
  
  if (!urlDatabase[req.params.id]) {
    res.status(404).redirect('/urls')
  }

  const destination = "http://" + urlDatabase[req.params.id].longURL;
  res.redirect(302, destination);
});
//show url details
app.get('/urls/:id', (req, res) => {
  const author = urlDatabase[req.params.id].userID;
  if (req.cookies.user_id != author) {
    res.redirect(403, "/login");
    return;
  }
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.cookies.user_id],
  };
  res.render('urls_show', templateVars);
});
//edit url
app.post('/urls/:id', (req, res) => {
  const author = urlDatabase[req.params.id].userID;
  if (req.cookies.user_id != author) {
    res.redirect(403, "/login");
    return;
  }
  urlDatabase[req.params.id] = {
    longURL: req.body.editURL,
    userID: req.cookies.user_id
  }
  res.redirect('/urls/' + req.params.id);
});
//delete a url from the database
app.post('/urls/:id/delete', (req, res) => {
  const author = urlDatabase[req.params.id].userID;
  if (req.cookies.user_id != author) {
    res.redirect(403, "/login");
    return;
  }
  const id = (req.params.id);
  delete urlDatabase[id];
  res.redirect('/urls');
});
//add new url to database, redirect to that url's page
app.post('/urls', (req, res) => {
  const n = generateRandomString();
  urlDatabase[n] = {
    longURL: req.body.longURL,
    userID: req.cookies('user_id')
  }
  res.redirect('/urls/:id' + n);
});

//old version of user:
// //login a user
// app.post('/login', (req, res) => {
//   const username = req.body.username;
//   res.cookie('user_id', username, { httpOnly: false });
//   res.redirect('/urls');
// });



//_______________________________________________________________________________________
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});