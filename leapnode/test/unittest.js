var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:8000");

describe("SAMPLE unit test",function(){

  // #1 should return home page
  it("should return home page",function(done){
    // calling home page
    server
    .get("/")
    .expect("Content-type",/text/)
    .expect(function(err,res){
        return false;      
    })
    .expect(200, done);
  });

});
