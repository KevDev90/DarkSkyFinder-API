const knex = require("knex");
const { makeCardsArray } = require("./cards.fixtures");
const { makeFoldersArray } = require("./folders.fixtures");
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

  before("cleanup", () => db("darksky_cards").delete());

  afterEach("cleanup", () => db("darksky_cards").delete());

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
        return (
          supertest(app)
            .get(`/api/cards/123`)
            //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
            .expect(404, {
              error: { message: `card Not Found` },
            })
        );
      });
    });
    context("Given there are cards in the database", () => {
      const testCards = makeCardsArray();
      const testFolders = makeFoldersArray();

      beforeEach("insert folders", () => {
        return db.into("darksky_folders").insert(testFolders);
      });

      beforeEach("insert card", () => {
        return db.into("darksky_cards").insert(testCards);
      });

      it("responds with 200 and the specified card", () => {
        const cardId = 2;
        const expectedCard = testCards[cardId - 1];
        return (
          supertest(app)
            .get(`/api/cards/${cardId}`)
            //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
            .expect(200, expectedCard)
        );
      });
    });
  });

  // These are the POST tests

  describe("POST /api/cards", () => {
    it(`responds with 400 missing 'title' if not supplied`, () => {
      const newCardMissingTitle = {
        // title: 'test-title',
        modified: "2021-03-01T14:07:31.292Z",
        folder_id: 2,
        details: "this is some test content",
        favorited: false,
      };
      return (
        supertest(app)
          .post(`/api/cards`)
          .send(newCardMissingTitle)
          //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(400, {
            error: { message: `'title' is required` },
          })
      );
    });

    it(`responds with 400 missing 'folder_id' if not supplied`, () => {
      const newCardMissingFolder = {
        title: "test-title",
        modified: "2021-03-01T14:07:31.292Z",
        //folder_id: 2,
        details: "this is some test content",
        favorited: false,
      };
      return (
        supertest(app)
          .post(`/api/cards`)
          .send(newCardMissingFolder)
          //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(400, {
            error: { message: `'folder_id' is required` },
          })
      );
    });

    it(`responds with 400 missing 'details' if not supplied`, () => {
      const newCardMissingDetails = {
        title: "test-title",
        modified: "2021-03-01T14:07:31.292Z",
        folder_id: 2,
        //details: "this is some test content",
        favorited: "Single",
      };
      return (
        supertest(app)
          .post(`/api/cards`)
          .send(newCardMissingDetails)
          //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(400, {
            error: { message: `'details' is required` },
          })
      );
    });
    it(`responds with 400 missing 'favorited' if not supplied`, () => {
      const newCardMissingFavorite = {
        title: "test-title",
        modified: "2021-03-01T14:07:31.292Z",
        folder_id: 2,
        details: "this is some test content",
        // favorited: "Single"
      };
      return (
        supertest(app)
          .post(`/api/cards`)
          .send(newCardMissingFavorite)
          //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(400, {
            error: { message: `'favorited' is required` },
          })
      );
    });
  });

  describe("DELETE /api/cards/:id", () => {
    context(`Given no cards`, () => {
      it(`responds 404 when card doesn't exist`, () => {
        return supertest(app)
          .delete(`/api/cards/123`)
          //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            error: { message: `Card Not Found` },
          });
      });
    });

    context("Given there are cards in the database", () => {
        const testCards = makeCardsArray();

        const testFolders = makeFoldersArray();

        beforeEach("insert folders", () => {
          return db.into("darksky_folders").insert(testFolders);
        });
        beforeEach("insert cards", () => {
          return db.into("darksky_cards").insert(testCards);
        });

    
        it("removes the folder by ID from the store", () => {
          const idToRemove = 2;
          const expectedCards = testCards.filter((nt) => nt.id !== idToRemove);
          return supertest(app)
            .get(`/api/cards/${cardId}`)
            .delete(`/api/cards/${idToRemove}`)
            //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
            .expect(204)
            .then(() =>
              supertest(app)
                .get(`/api/cards`)
                //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
                .expect(expectedCards)
            );
        });
      });
    });

    describe(`PATCH /api/cards/:card_id`, () => {
        context(`Given no cards`, () => {
          it(`responds with 404`, () => {
            const cardId = 123456;
            return supertest(app)
              .patch(`/api/cards/${cardId}`)
              //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
              .expect(404, { error: { message: `Card Not Found` } });
          });
        });
        context("Given there are cards in the database", () => {
          const testCards = makeCardsArray();
          const testFolders = makeFoldersArray();


          beforeEach("insert folders", () => {
            return db.into("darksy_folders").insert(testFolders);
          });
          beforeEach("insert cards", () => {
            return db.into("darksy_cards").insert(testCards);
          });

          it("responds with 204 and updates the card", () => {
            const idToUpdate = 2;
            const updateCard = {
              title: "updated card title",
              folder_id: 1,
              details: "this is some updated test content",
              favorited: true,
            };
            const expectedCard = {
              ...testCards[idToUpdate - 1],
              ...updateCard,
            };
            return supertest(app)
              .patch(`/api/cards/${idToUpdate}`)
              .send(updateCard)
              //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
              .expect(204)
              .then((res) =>
                supertest(app)
                  .get(`/api/cards/${idToUpdate}`)
                  //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
                  .expect(expectedCard)
              );
          });

          it(`responds with 400 when no required fields supplied`, () => {
            const idToUpdate = 2;
            return supertest(app)
              .patch(`/api/cards/${idToUpdate}`)
              //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
              .send({ irrelevantField: "foo" })
              .expect(400, {
                error: {
                  message: `Request body must contain either 'title', 'folder_id', 'details', or 'favorited'`,
                },
              });
          });

          it(`responds with 204 when updating only a subset of fields`, () => {
            const idToUpdate = 2;
            const updateCard = {
                title: "Just updated card title",
              };
            const expectedCard = {
              ...testCards[idToUpdate - 1],
              ...updateCard,
            };

            return supertest(app)
              .patch(`/api/cards/${idToUpdate}`)
              .send({
                ...updateCard,
                fieldToIgnore: "should not be in GET response",
              })
              //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
              .expect(204)
              .then((res) =>
                supertest(app)
                  .get(`/api/cards/${idToUpdate}`)
                  //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
                  .expect(expectedCard)
              );
          });
        });
      });
  });