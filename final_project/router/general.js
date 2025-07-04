const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});


// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Task 10: Get book list using async-await
public_users.get('/async-books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 10: Get book list using Promise
public_users.get('/promise-books', (req, res) => {
  axios.get('http://localhost:5000/')
    .then(response => res.status(200).json(response.data))
    .catch(error => res.status(500).json({ message: "Error fetching books", error: error.message }));
});


// Task 2: Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 11: Get book by ISBN using async-await
public_users.get('/async-isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Book not found via async call", error: error.message });
  }
});

// Task 11: Get book by ISBN using Promise
public_users.get('/promise-isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => res.status(200).json(response.data))
    .catch(error => res.status(404).json({ message: "Book not found via promise call", error: error.message }));
});


// Task 3: Get books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();

  const result = Object.values(books).filter(book => 
    book.author.toLowerCase() === author
  );

  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 12: Get books by author using async-await
public_users.get('/async-author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const response = await axios.get('http://localhost:5000/');
    const result = Object.values(response.data).filter(book => 
      book.author.toLowerCase() === author
    );

    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 12: Get books by author using Promise
public_users.get('/promise-author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();

  axios.get('http://localhost:5000/')
    .then(response => {
      const result = Object.values(response.data).filter(book => 
        book.author.toLowerCase() === author
      );

      if (result.length > 0) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "No books found by this author" });
      }
    })
    .catch(error => res.status(500).json({ message: "Error fetching books", error: error.message }));
});


// Task 4: Get books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  const result = Object.values(books).filter(book => 
    book.title.toLowerCase() === title
  );

  if (result.length > 0) {
    return res.status(200).json(result[0]);
  } else {
    return res.status(404).json({ message: "Book not found by this title" });
  }
});

// Task 13: Get books by title using async-await
public_users.get('/async-title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const response = await axios.get('http://localhost:5000/');
    const result = Object.values(response.data).filter(book => 
      book.title.toLowerCase() === title
    );

    if (result.length > 0) {
      return res.status(200).json(result[0]);
    } else {
      return res.status(404).json({ message: "Book not found by this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Task 13: Get books by title using Promise
public_users.get('/promise-title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();

  axios.get('http://localhost:5000/')
    .then(response => {
      const result = Object.values(response.data).filter(book => 
        book.title.toLowerCase() === title
      );

      if (result.length > 0) {
        res.status(200).json(result[0]);
      } else {
        res.status(404).json({ message: "Book not found by this title" });
      }
    })
    .catch(error => res.status(500).json({ message: "Error fetching books", error: error.message }));
});


// Task 5: Get book review by ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
