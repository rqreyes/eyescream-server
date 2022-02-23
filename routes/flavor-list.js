import express from "express";
import { nanoid } from "nanoid";

export const flavorListRouter = express.Router();
const DELAY = 2000;

// get flavor list
flavorListRouter.get("/", async (req, res) => {
  const { flavorList } = req.app.db.data;

  setTimeout(() => {
    res.send(flavorList);
  }, DELAY);
});

// get flavor by ID
flavorListRouter.get("/:id", async (req, res) => {
  const { flavorList } = req.app.db.data;
  const flavorFound = flavorList.find(
    (flavorItem) => flavorItem.id === req.params.id
  );

  setTimeout(() => {
    if (flavorFound === undefined) res.sendStatus(404);
    res.send(flavorFound);
  }, DELAY);
});

// create flavor
flavorListRouter.post("/", async (req, res) => {
  const { flavorList } = req.app.db.data;

  try {
    const flavorItem = {
      id: nanoid(),
      ingredients: req.body.ingredients,
      name: req.body.flavor,
    };

    flavorList.push(flavorItem);
    await req.app.db.write();

    setTimeout(() => {
      res.send(flavorItem);
    }, DELAY);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// update flavor item by ID
flavorListRouter.patch("/:id", async (req, res) => {
  const { flavorList } = req.app.db.data;

  try {
    let flavorUpdated = null;
    const flavorListUpdated = flavorList.map((flavorItem) => {
      if (flavorItem.id === req.params.id) {
        flavorUpdated = {
          ...flavorItem,
          ingredients: req.body.ingredients,
          name: req.body.flavor,
        };

        return flavorUpdated;
      } else {
        return flavorItem;
      }
    });

    req.app.db.data = { flavorList: flavorListUpdated };
    await req.app.db.write();

    setTimeout(() => {
      res.send(flavorUpdated);
    }, DELAY);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// delete flavor item by ID
flavorListRouter.delete("/:id", async (req, res) => {
  const { flavorList } = req.app.db.data;
  const flavorListFiltered = flavorList.filter(
    (flavorItem) => flavorItem.id !== req.params.id
  );

  req.app.db.data = { flavorList: flavorListFiltered };
  await req.app.db.write();

  setTimeout(() => {
    res.sendStatus(200);
  }, DELAY);
});
