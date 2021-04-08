const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");

chai.use(chaiHttp);

global.chai = chai;
global.expect = chai.expect;
global.sinon = sinon;
