import mongoose from "mongoose";
import dotenv from "dotenv";
import configs from "../config";
import request from "supertest";
import app from "../app";
dotenv.config();

describe('Basic API Test', () => {
  describe('connect to mongo', () => {
    beforeAll(async () => {
      await mongoose.connect(configs.mongodbUrl);
    });

    afterAll(async () => {
      await mongoose.connection.close();
    });

    // Add at least one test here
    it('should connect to MongoDB successfully', () => {
      expect(mongoose.connection.readyState).toBe(1); // 1 means connected
    });
  });
  describe("GET /v1/items",()=>{
    it("should retrieve all product items", async () =>{
      const response = await request(app).get("/v1/items").expect(200);
      expect(response.body).toBe("success");
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toBe(6)
    })
  })
});
