const knex = require("knex");
const { makeCardsArray } = require("./cards.fixtures");
const app = require("../src/app");
const store = require("../src/store");
const supertest = require("supertest");

describe("Cards Endpoints", () => {
  let cardsCopy, db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => db("darksky_cards").truncate());

  afterEach("cleanup", () => db("darksky_cards").truncate());

  beforeEach("copy the cards", () => {
    cardsCopy = store.cards.slice();
  });

  afterEach("restore the cards", () => {
    store.cards = cardsCopy;
  });

  describe("GET /api/cards", () => {
    context(`Given no cards`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/cards")
          //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(200, []);
      });
    });
  });

  describe("GET /api/cards/:id", () => {
    context(`Given no cards`, () => {
      it(`responds 404 when card doesn't exist`, () => {
        return supertest(app)
          .get(`/api/cards/123`)
          //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            error: { message: `Card Not Found` },
          });
      });
    });
    context("Given there are cards in the database", () => {
        const testCards = makeCardsArray();

        beforeEach("insert card", () => {
          return db.into("darksky_cards").insert(testCards);
        });

        it("responds with 200 and the specified card", () => {
          const cardId = 2;
          const expectedCard = testCards[cardId - 1];
          return supertest(app)
            .get(`/api/cards/${cardId}`)
            //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
            .expect(200, expectedCard);
        });
      });
    });




});