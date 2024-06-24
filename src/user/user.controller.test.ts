import { Request, Response } from "express";
import { getUserById } from "./user.controller";

const mockUser = { id: 1, name: "John Doe" };

test("getUserById should return the user with the specified id", async () => {
  const mockRequest = {
    params: {
      id: "1",
    },
  } as Partial<Request> as Request;

  const mockResponse = {
    json: jest.fn(),
  } as Partial<Response> as Response;

  await getUserById(mockRequest, mockResponse);

  expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
});
