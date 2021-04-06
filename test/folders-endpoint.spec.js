const knex = require("knex");
const { makeFoldersArray } = require("./folders.fixtures");
const app = require("../src/app");
const store = require("../src/store");
const supertest = require("supertest");


describe("Folders Endpoints", () => {
  let foldersCopy, db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());


  before("cleanup", () => db("darksky_folders").delete());

  afterEach("cleanup", () => db("darksky_folders").delete());

  beforeEach("copy the folders", () => {
    foldersCopy = store.folders.slice();
  });

  afterEach("restore the folders", () => {
    store.folders = foldersCopy;
  });

  describe("GET /api/folders", () => {
    context(`Given no folders`, () => {
      it(`responds with 200 and an empty list`, () => {
        return (
          supertest(app)
            .get("/api/folders")
            //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
            .expect(200, [])
        );
      });
    });
  });
  describe("GET /api/folders/:id", () => {
    context(`Given no folders`, () => {
      it(`responds 404 when folder doesn't exist`, () => {
        return (
          supertest(app)
            .get(`/api/folders/123`)
            //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
            .expect(404, {
              error: { message: `Folder Not Found` },
            })
        );
      });
    });
    context("Given there are folders in the database", () => {
      const testFolders = makeFoldersArray();

      beforeEach("insert folder", () => {
        return db.into("darksky_folders").insert(testFolders);
      });

      it("responds with 200 and the specified folder", () => {
        const folderId = 2;
        const expectedFolder = testFolders[folderId - 1];
        return (
          supertest(app)
            .get(`/api/folders/${folderId}`)
            //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
            .expect(200, expectedFolder)
        );
      });
    });
  });

  describe("DELETE /api/folders/:id", () => {
    context(`Given no folders`, () => {
      it(`responds 404 when folder doesn't exist`, () => {
        return supertest(app)
          .delete(`/api/folders/123`)
          //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            error: { message: `Folder Not Found` },
          });
      });
    });

    context("Given there are folders in the database", () => {
      const testFolders = makeFoldersArray();

      beforeEach("insert folders", () => {
        return db.into("darksky_folders").insert(testFolders);
      });

      it("removes the folder by ID from the store", () => {
        const idToRemove = 2;
        const expectedFolders = testFolders.filter((nt) => nt.id !== idToRemove);
        return supertest(app)
          .delete(`/api/folders/${idToRemove}`)
          //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then(() =>
            supertest(app)
              .get(`/api/folders`)
              //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedFolders)
          );
      });
    });
  });

  describe("POST /api/folders", () => {
    it(`responds with 400 missing 'title' if not supplied`, () => {
      const newFolderMissingTitle = {
        // title: 'test-title',
      };
      return supertest(app)
        .post(`/api/folders`)
        .send(newFolderMissingTitle)
        //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .expect(400, {
          error: { message: `Missing 'title' in request body` },
        });
    });


    it("creates a folder, responding with 201 and the new folder", () => {
      const newFolder = {
        title: "test-title",
      };
      return supertest(app)
        .post(`/api/folders`)
        .send(newFolder)
        //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).to.eql(newFolder.title);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/folders/${res.body.id}`);
        })
        .then((res) =>
          supertest(app)
            .get(`/api/folders/${res.body.id}`)
            //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
            .expect(res.body)
        );
    });
  });


  describe(`PATCH /api/folders/:folder_id`, () => {
    context(`Given no folders`, () => {
      it(`responds with 404`, () => {
        const folderId = 123456;
        return supertest(app)
          .patch(`/api/folders/${folderId}`)
          //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: `Folder Not Found` } });
      });
    });
    context("Given there are folders in the database", () => {
      const testFolders = makeFoldersArray();

      beforeEach("insert folders", () => {
        return db.into("darksky_folders").insert(testFolders);
      });

      it("responds with 204 and updates the folder", () => {
        const idToUpdate = 2;
        const updateFolder = {
          title: "updated folder title",
        };
        const expectedFolder = {
          ...testFolders[idToUpdate - 1],
          ...updateFolder,
        };
        return supertest(app)
          .patch(`/api/folders/${idToUpdate}`)
          .send(updateFolder)
          //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/folders/${idToUpdate}`)
              //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedFolder)
          );
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/folders/${idToUpdate}`)
          //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .send({ irrelevantField: "foo" })
          .expect(400, {
            error: {
              message: `Request body must contain 'title'`,
            },
          });
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateFolder = {
          title: "updated folder title",
        };
        const expectedFolder = {
          ...testFolders[idToUpdate - 1],
          ...updateFolder,
        };

        return supertest(app)
          .patch(`/api/folders/${idToUpdate}`)
          .send({
            ...updateFolder,
            fieldToIgnore: "should not be in GET response",
          })
          //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/folders/${idToUpdate}`)
              //.set("Authorization", `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedFolder)
          );
      });
    });
  });
});