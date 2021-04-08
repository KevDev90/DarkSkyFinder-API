const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const app = require("../src/app");
const should = chai.should();
const expect = chai.expect;

describe("App", () => {
  it('GET / responds with 200 containing "Hello, world!"', () => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.text).to.deep.equal("Hello, world!");
      });
  });
});
