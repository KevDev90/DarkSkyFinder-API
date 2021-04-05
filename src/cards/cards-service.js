const CardsService = {
    getAllCards(knex) {
      return knex.select("*").from("darksky_cards");
    },
    insertCard(knex, newCard) {
      return knex
         .insert(newCard)
         .into('darksky_cards')
         .returning('*')
         .then(rows => {
           console.log(rows)
          return rows[0]
        })
    },
    getById(knex, id) {
      return knex.from("darksky_cards").select("*").where("id", id).first();
    },
    deleteCard(knex, id) {
      return knex("darksky_cards").where({ id }).delete();
    },
    updateCard(knex, id, newCardFields) {
      return knex("darksky_cards").where({ id }).update(newCardFields);
    },
  };

  module.exports = CardsService;