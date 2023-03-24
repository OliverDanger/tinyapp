
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
    password: "turtle-duck"
  },
  000002: {
    id: 000002,
    email: "URLslayer9000@yahoo.ca",
    password: "turtle-goose"
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

const getUserByEmail = (email, database) => {
  for (const id in database) {
    if (email == database[id].email) {
      return database[id];
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

module.exports = {
  urlDatabase,
  users,
  generateRandomString,
  getUserByEmail,
  urlsForUser
}