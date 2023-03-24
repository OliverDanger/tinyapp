const { assert } = require('chai');

const {
  getUserByEmail
} = require('../helpers')

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('#getUsersByEmail', () => {
  it('should return a user with a matching email', () => {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(user.id , expectedUserID);
  })
  it('should return undefined if there is no matching email', () => {
    const user = getUserByEmail("bad@example.com", testUsers)
    const expectedOutput = undefined;
    assert.equal(user , expectedOutput);
  })
})