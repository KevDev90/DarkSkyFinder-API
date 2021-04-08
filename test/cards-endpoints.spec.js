const { makeCardsArray } = require("./cards.fixtures");
const app = require("../src/app");
const CardsService = require("../src/cards/cards-service");

describe("Cards Endpoints", () => {
  describe("GET /api/cards", () => {
    it(`responds with 200 and card list`, () => {
      const cardsArray = makeCardsArray();
      const getAllCards = sinon
        .stub(CardsService, "getAllCards")
        .resolves(cardsArray);
      chai
        .request(app)
        .get("/api/cards")
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.deep.equal(cardsArray);
          getAllCards.restore();
        });
    });
  });
  describe("POST /api/cards", () => {
    it(`No title - responds with 400 and required error message`, () => {
      chai
        .request(app)
        .post("/api/cards")
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body).to.deep.equal({
            error: { message: `'title' is required` },
          });
        });
      it(`No modified - responds with 400 and required error message`, () => {
        chai
          .request(app)
          .post("/api/cards")
          .send({
            title: "mockTitle",
          })
          .end((err, res) => {
            res.should.have.status(400);
            expect(res.body).to.deep.equal({
              error: { message: `'modified' is required` },
            });
          });
      });
      it(`No folder_id - responds with 400 and required error message`, () => {
        chai
          .request(app)
          .post("/api/cards")
          .send({
            title: "mockTitle",
            modified: "mockModified",
          })
          .end((err, res) => {
            res.should.have.status(400);
            expect(res.body).to.deep.equal({
              error: { message: `'folder_id' is required` },
            });
          });
      });
      it(`No details - responds with 400 and required error message`, () => {
        chai
          .request(app)
          .post("/api/cards")
          .send({
            title: "mockTitle",
            modified: "mockModified",
            folder_id: "mockFolder",
          })
          .end((err, res) => {
            res.should.have.status(400);
            expect(res.body).to.deep.equal({
              error: { message: `'details' is required` },
            });
          });
      });
      it(`No favorited - responds with 400 and required error message`, () => {
        chai
          .request(app)
          .post("/api/cards")
          .send({
            title: "mockTitle",
            modified: "mockModified",
            folder_id: "mockFolder",
            details: "mockDetails",
          })
          .end((err, res) => {
            res.should.have.status(400);
            expect(res.body).to.deep.equal({
              error: { message: `'favorited' is required` },
            });
          });
      });
    });
  });

  describe("POST /api/cards", () => {
    it(`responds with 201 and inserted card`, () => {
      const reqBody = {
        title: "mockTitle",
        modified: "mockModified",
        folder_id: "mockFolder",
        details: "mockDetails",
        favorited: "mockFav",
      };
      const insertCard = sinon
        .stub(CardsService, "insertCard")
        .resolves(reqBody);
      chai
        .request(app)
        .post("/api/cards")
        .send(reqBody)
        .end((err, res) => {
          res.should.have.status(201);
          expect(res.body).to.deep.equal(reqBody);
          insertCard.restore();
        });
    });
  });
  describe("Get /:card id", () => {
    it(`card not found`, () => {
      const getById = sinon.stub(CardsService, "getById").resolves(null);
      chai
        .request(app)
        .get("/api/cards/123")
        .end((err, res) => {
          res.should.have.status(404);
          expect(res.body.error.message).to.deep.equal(`Card Not Found`);
          getById.restore();
        });
    });
    it(`card found`, () => {
      const mockCard = { title: "mockTitle" };
      const getById = sinon.stub(CardsService, "getById").resolves(mockCard);
      chai
        .request(app)
        .get("/api/cards/123")
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.title).to.deep.equal("mockTitle");
          getById.restore();
        });
    });
    it(`card deleted`, () => {
      const mockCard = { title: "mockTitle" };
      const getById = sinon
        .stub(CardsService, "getById")
        .resolves({ mockCard });
      const deleteCard = sinon.stub(CardsService, "deleteCard").resolves({});
      chai
        .request(app)
        .delete("/api/cards/123")
        .end((err, res) => {
          res.should.have.status(204);
          deleteCard.restore();
          getById.restore();
        });
    });
    it(`card update - empty req body`, () => {
      const reqBody = {};
      const mockCard = { title: "mockTitle" };
      const getById = sinon
        .stub(CardsService, "getById")
        .resolves({ mockCard });
      const updateCard = sinon
        .stub(CardsService, "updateCard")
        .resolves(reqBody);
      chai
        .request(app)
        .patch("/api/cards/123")
        .send(reqBody)
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.error.message).to.deep.equal(
            `Request body must contain either 'title', 'folder_id', 'details', or 'favorited'`
          );
          updateCard.restore();
          getById.restore();
        });
    });

    it(`card updated`, () => {
      const reqBody = {
        title: "mockTitle",
        modified: "mockModified",
        folder_id: "mockFolder",
        details: "mockDetails",
        favorited: "mockFav",
      };
      const mockCard = { title: "mockTitle" };
      const getById = sinon
        .stub(CardsService, "getById")
        .resolves({ mockCard });
      const updateCard = sinon
        .stub(CardsService, "updateCard")
        .resolves(reqBody);
      chai
        .request(app)
        .patch("/api/cards/123")
        .send(reqBody)
        .end((err, res) => {
          res.should.have.status(201);
          expect(res.body).to.deep.equal(reqBody);
          updateCard.restore();
          getById.restore();
        });
    });
  });
});
