import express from "express";
import { nanoid } from "nanoid";

export const flavorsRouter = express.Router();
const DELAY = 2000;

// get flavor list
flavorsRouter.get("/", async (req, res) => {
  const { flavors } = req.app.db.data;

  setTimeout(() => {
    res.send(flavors);
  }, DELAY);
});

// get flavor by ID
flavorsRouter.get("/:id", async (req, res) => {
  const { flavors } = req.app.db.data;
  const flavorFound = flavors.find((flavor) => flavor.id === req.params.id);

  setTimeout(() => {
    if (flavorFound === undefined) res.sendStatus(404);
    res.send(flavorFound);
  }, DELAY);
});

// create flavor
flavorsRouter.post("/", async (req, res) => {
  const { flavors } = req.app.db.data;

  try {
    const flavor = {
      id: nanoid(),
      ingredients: req.body.ingredients,
      name: req.body.flavor,
    };

    flavors.push(flavor);
    await req.app.db.write();

    setTimeout(() => {
      res.send(flavor);
    }, DELAY);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// update flavor item by ID
flavorsRouter.patch("/:id", async (req, res) => {
  const { flavors } = req.app.db.data;

  try {
    let flavorUpdated = null;
    const flavorsUpdated = flavors.map((flavor) => {
      if (flavor.id === req.params.id) {
        flavorUpdated = {
          ...flavor,
          ingredients: req.body.ingredients,
          name: req.body.flavor,
        };

        return flavorUpdated;
      } else {
        return flavor;
      }
    });

    req.app.db.data = { flavors: flavorsUpdated };
    await req.app.db.write();

    setTimeout(() => {
      res.send(flavorUpdated);
    }, DELAY);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// delete flavor item by ID
flavorsRouter.delete("/:id", async (req, res) => {
  const { flavors } = req.app.db.data;
  const flavorsFiltered = flavors.filter(
    (flavor) => flavor.id !== req.params.id
  );

  req.app.db.data = { flavors: flavorsFiltered };
  await req.app.db.write();

  setTimeout(() => {
    res.sendStatus(200);
  }, DELAY);
});
