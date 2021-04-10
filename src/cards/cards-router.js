const express = require("express");
const path = require("path");
const xss = require("xss");
const CardsService = require("./cards-service");
const cardsRouter = express.Router();
const cardStore = require("../store")
const jsonParser = express.json();

const serializeCard = (card) => ({
  id: card.id,
  title: xss(card.title),
  modified: card.modified,
  folder_id: card.folder_id,
  details: xss(card.details),
  favorited: card.favorited,
});

cardsRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    CardsService.getAllCards(knexInstance)
      .then((cards) => {
        res.json(cards.map(serializeCard));
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    // const { details, title, modified, folder_id, favorited } = req.body
    const { details, title, modified, folder_id} = req.body
    // const newCard = { details, title, modified, folder_id, favorited };
    const newCard = { details, title, modified, folder_id };
    //   for (const field of ['title', 'modified', 'folder_id', 'details', 'favorited']) {
        for (const field of ['title', 'modified', 'folder_id', 'details']) {
        if (!req.body[field]) {
          return res.status(400).send({
            error: { message: `'${field}' is required` }
          })
        }
      }
    CardsService.insertCard(req.app.get("db"), newCard)
      .then((card) => {
        res
          .status(201)
          .location(`/cards/${card.id}`)
          .json(serializeCard(card))
      })
      .catch(next)
  });

  cardsRouter
  .route("/:card_id")
  .all((req, res, next) => {
    const { card_id } = req.params;
    CardsService.getById(req.app.get("db"), card_id)
      .then((card) => {
        if (!card) {
          return res.status(404).json({
            error: { message: `Card Not Found` },
          });
        }
        res.card = card;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    console.log(res.card)
    res.json(serializeCard(res.card))
  })

  .delete((req, res, next) => {
    CardsService.deleteCard(req.app.get("db"), req.params.card_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, modified, folder_id, details, favorited } = req.body;
    const cardToUpdate = { title, modified, folder_id, details, favorited };
    const numberOfValues = Object.values(cardToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'title', 'folder_id', 'details', or 'favorited'`,
        },
      });
    }
    CardsService.updateCard(req.app.get("db"), req.params.card_id, cardToUpdate)
      .then((numRowsAffected) => {
        res.status(201)
        .location(`/cards/${cardToUpdate.id}`)
        .json(serializeCard(cardToUpdate))
      })
      .catch(next);
  });

  module.exports = cardsRouter;