const express = require("express");
const { Card } = require("inspector");
const path = require("path");
const xss = require("xss");
const CardsService = require("./cards-service");
const cardsRouter = express.Router();
const cardStore = require("../store")
const jsonParser = express.json();

const serializeCard = (card) => ({
  id: card.id,
  title: card.title,
  modified: card.modified,
  folder_id: card.folder_id,
  details: card.details,
  favorited: card.favorited,
});

cardsRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    CardsService.getAllCards(knexInstance)
      .then((cards) => {
        res.json(card.map(serializeCard));
      })
      .catch(next);
  })

  cardsRouter
  .route("/:card_id")
  .all((req, res, next) => {
    const { card_id } = req.params;
    console.log("card_id", note_id);
    console.log();
    CardsService.getById(req.app.get("db"), card_id)
      .then((card) => {
        if (!card) {
          return res.status(404).json({
            error: { message: `card Not Found` },
          });
        }
        res.card = card;
        next();
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { title, modified, folder_id, details, favorited } = req.body
    const newCard = { title, modified, folder_id, details, favorited };

    for (const [key, value] of Object.entries(newCard))
      if (value == null)
        return res.status(400).json({
          error: { message: `'${key}' is required` },
        });
    CardService.insertCard(req.app.get("db"), newCard)
      .then((card) => {
        res
          .status(201)
          .location(`/cards/${card.id}`)
          .json(serializeCard(card))
      })
      .catch(next)
  });


  module.exports = cardsRouter;