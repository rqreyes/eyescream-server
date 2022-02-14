import express from "express";
import { nanoid } from "nanoid";

export const booksRouter = express.Router();
const DELAY = 2000;

// get book list
booksRouter.get("/", async (req, res) => {
  const { books } = req.app.db.data;

  setTimeout(() => {
    res.send(books);
  }, DELAY);
});

// get book by ID
booksRouter.get("/:id", async (req, res) => {
  const { books } = req.app.db.data;
  const bookFound = books.find((book) => book.id === req.params.id);

  setTimeout(() => {
    if (bookFound === undefined) res.sendStatus(404);
    res.send(bookFound);
  }, DELAY);
});

// create book
booksRouter.post("/", async (req, res) => {
  const { books } = req.app.db.data;

  try {
    const book = {
      author: req.body.author,
      id: nanoid(),
      title: req.body.title,
    };

    books.push(book);
    await req.app.db.write();

    setTimeout(() => {
      res.send(book);
    }, DELAY);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// update book by ID
booksRouter.patch("/:id", async (req, res) => {
  const { books } = req.app.db.data;

  try {
    let bookUpdated = null;
    const booksUpdated = books.map((book) => {
      if (book.id === req.params.id) {
        bookUpdated = {
          ...book,
          author: req.body.author,
          title: req.body.title,
        };

        return bookUpdated;
      } else {
        return book;
      }
    });

    req.app.db.data = { books: booksUpdated };
    await req.app.db.write();

    setTimeout(() => {
      res.send(bookUpdated);
    }, DELAY);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// delete book by ID
booksRouter.delete("/:id", async (req, res) => {
  const { books } = req.app.db.data;
  const booksFiltered = books.filter((book) => book.id !== req.params.id);

  req.app.db.data = { books: booksFiltered };
  await req.app.db.write();

  setTimeout(() => {
    res.sendStatus(200);
  }, DELAY);
});
