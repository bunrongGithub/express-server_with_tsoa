import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import validateRequest from "../middlewares/validate-input";  // Adjust the path as necessary

describe('validateRequest Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = {};
    next = jest.fn();  // Mock the next function
  });

  it('should call next with no arguments if validation passes', () => {
    // Define a schema
    const schema = Joi.object({
      name: Joi.string().required().messages({
        "string.base":
          "name bust be a string",
        "any.required": "name are require",
        "any.only": "Invalid name"
      }),
      age: Joi.number().required().messages({
        "string.base":
          "age bust be a number or greeter than 1",
        "any.required": "age are require",
        "any.only": "Invalid name"
      })
    });

    // Set valid request body
    req.body = { name: 'John', age: 0 };

    // Call the middleware
    const middleware = validateRequest(schema);
    middleware(req as Request, res as Response, next);

    // Assert that next was called with no arguments (indicating success)
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with an error if validation fails', () => {
    // Define a schema
    const schema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().required()
    });

    // Set invalid request body (missing 'age')
    req.body = { name: 'John' };

    // Call the middleware
    const middleware = validateRequest(schema);
    middleware(req as Request, res as Response, next);

    // Assert that next was called with an error
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('"age" is required')  // Joi validation error message
    }));
  });

  it('should return the correct validation error message', () => {
    // Define a schema
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });

    // Set invalid request body (invalid email)
    req.body = { email: 'invalid-email' };

    // Call the middleware
    const middleware = validateRequest(schema);
    middleware(req as Request, res as Response, next);

    // Assert that next was called with a validation error
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('"email" must be a valid email')
    }));
  });
});
