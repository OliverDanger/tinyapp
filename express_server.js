const express = require("express");
const cookieSession = require("cookie-session")
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs')
const {
  urlDatabase,
  users,
  generateRandomString,
  getUserByEmail,
  urlsForUser
} = require('./helpers')


const app = express();
const PORT = 8080; // default port 8080

app.use(cookieSession({
  name: 'session',
  keys: ['URLslayer3000'],
}))
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



//_____________________________________________________________________________________
//home
app.get("/", (req, res) => {
  res.send("<html><body>Hello World!<h1> How did you get here? </h1></body></html>\n");
});

//joke page
app.get('/help', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    greeting: 'HI!'
  };
  res.render('urls_help', templateVars);
});



//go to register page
app.get('/register', (req, res) => {
  if (req.session.user_id) {
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
  if (getUserByEmail(email, users)) {
    res.status(400).redirect('/login')
    return;
  }
  //is email and password filled in
  if (email.length === 0 || password.length === 0) {
    res.status(400).redirect('/register')
    return;
  }

  const newID = generateRandomString();

  users[newID] = {
    id: newID,
    email: email,
    password: bcrypt.hashSync(password, 10)
  };
  req.session.user_id = newID;
  console.log(users);
  res.redirect("/urls");
});
//go to login pagee
app.get("/login", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
    return;
  }
  res.render('urls_login')
})
//attempt a login
app.post("/login", (req, res) => {

  const { email, password } = req.body;
  const trueUser = getUserByEmail(email, users)

  if (!trueUser) {
    res.status(403).redirect('/login')
    return;
  }

  
  if (!bcrypt.compareSync(password, trueUser.password)) {
    res.status(403).redirect('/login')
    return;
  }

  req.session.user_id = trueUser.id;
  console.log('logged in as', email, password)
  res.redirect('/urls');


})

//logout a user
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

//index
app.get('/urls', (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    urls: urlsForUser(req.session.user_id)
  };
  res.render('urls_index', templateVars);
});

//visit add new url page
app.get('/urls/new', (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
    return;
  }
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render('urls_new', templateVars);
});

//post a new url
app.post('/urls', (req, res) => {
  const n = generateRandomString();
  urlDatabase[n] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
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
  if (req.session.user_id != author) {
    res.redirect(403, "/login");
    return;
  }
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.session.user_id],
  };
  res.render('urls_show', templateVars);
});
//edit url
app.post('/urls/:id', (req, res) => {
  const author = urlDatabase[req.params.id].userID;
  if (req.session.user_id != author) {
    res.redirect(403, "/login");
    return;
  }
  urlDatabase[req.params.id] = {
    longURL: req.body.editURL,
    userID: req.session.user_id
  }
  res.redirect('/urls/' + req.params.id);
});
//delete a url from the database
app.post('/urls/:id/delete', (req, res) => {
  const author = urlDatabase[req.params.id].userID;
  if (req.session.user_id != author) {
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
    userID: req.session.user_id
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