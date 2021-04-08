const { makeFoldersArray } = require("./folders.fixtures");
const app = require("../src/app");
const FoldersService = require("../src/folders/folders-service");

describe("Folder Endpoints", () => {
  describe("GET /api/folders", () => {
    it(`responds with 200 and folder list`, () => {
      const foldersArray = makeFoldersArray();
      const getAllFolders = sinon
        .stub(FoldersService, "getAllFolders")
        .resolves(foldersArray);
      chai
        .request(app)
        .get("/api/folders")
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body).to.deep.equal(foldersArray);
          getAllFolders.restore();
        });
    });
  });
  describe("POST /api/folders", () => {
    it(`No title - responds with 400 and required error message`, () => {
      chai
        .request(app)
        .post("/api/folders")
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body).to.deep.equal({
            error: { message: `Missing 'title' in request body` },
          });
        });
    });
  });

  describe("POST /api/folders", () => {
    it(`responds with 201 and inserted folder`, () => {
      const reqBody = {
        title: "mockTitle",
      };
      const insertFolder = sinon
        .stub(FoldersService, "insertFolder")
        .resolves(reqBody);
      chai
        .request(app)
        .post("/api/folders")
        .send(reqBody)
        .end((err, res) => {
          res.should.have.status(201);
          expect(res.body).to.deep.equal(reqBody);
          insertFolder.restore();
        });
    });
  });
  describe("Get /:folder id", () => {
    it(`folder not found`, () => {
      const getById = sinon.stub(FoldersService, "getById").resolves(null);
      chai
        .request(app)
        .get("/api/folders/123")
        .end((err, res) => {
          res.should.have.status(404);
          expect(res.body.error.message).to.deep.equal("Folder Not Found");
          getById.restore();
        });
    });
    it(`folder found`, () => {
      const mockFolder = { title: "mockTitle" };
      const myGetById = sinon
        .stub(FoldersService, "getById")
        .resolves(mockFolder);
      chai
        .request(app)
        .get("/api/folders/123")
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.title).to.deep.equal("mockTitle");
          myGetById.restore();
        });
    });
    it(`folder deleted`, () => {
      const mockFolder = { title: "mockTitle" };
      const getById = sinon
        .stub(FoldersService, "getById")
        .resolves({ mockFolder });
      const deleteFolder = sinon
        .stub(FoldersService, "deleteFolder")
        .resolves({});
      chai
        .request(app)
        .delete("/api/folders/123")
        .end((err, res) => {
          res.should.have.status(204);
          deleteFolder.restore();
          getById.restore();
        });
    });
    it(`folder update - no title`, () => {
      const reqBody = {};
      const mockFolder = { title: "mockTitle" };
      const getById = sinon
        .stub(FoldersService, "getById")
        .resolves({ mockFolder });
      chai
        .request(app)
        .patch("/api/folders/123")
        .send(reqBody)
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.error.message).to.deep.equal(
            `Request body must contain 'title'`
          );
          getById.restore();
        });
    });
    it(`folder updated`, () => {
      const reqBody = {
        title: "mockTitle",
      };
      const mockFolder = { title: "mockTitle" };
      const getById = sinon
        .stub(FoldersService, "getById")
        .resolves({ mockFolder });
      const updateFolder = sinon
        .stub(FoldersService, "updateFolder")
        .resolves(reqBody);
      chai
        .request(app)
        .patch("/api/folders/123")
        .send(reqBody)
        .end((err, res) => {
          res.should.have.status(204);
          updateFolder.restore();
          getById.restore();
        });
    });
  });
});
