import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import express from "express";
import { db_initialize_create, close_db } from "../src/db.js";
import itemRoutes from "../src/routes/items.js";
import authRoutes from "../src/routes/auth.js";

process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-jwt-secret";
process.env.PORT = process.env.PORT ?? 3000;

function buildApp() {
  const app = express();
  app.set("port", process.env.PORT);
  app.use(express.json());
  app.use("/items", itemRoutes);
  app.use("/auth", authRoutes);
  return app;
}

async function signupUser(app, email, password = "password123") {
  return request(app).post("/auth/signup").send({ email, password });
}

async function loginUser(app, email, password = "password123") {
  return request(app).post("/auth/login").send({ email, password });
}

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

async function createItem(app, token, payload) {
  return request(app).post("/items").set(authHeader(token)).send(payload);
}

describe("Items CRUD", () => {
  let app;
  let ownerToken;
  let ownerId;
  let otherToken;

    beforeAll(async () => {
        await db_initialize_create(":memory:");
        app = buildApp();

        const signupOwner = await signupUser(app, "owner@example.com");
        expect(signupOwner.status).toBe(201);
        ownerId = signupOwner.body.id;

        const loginOwner = await loginUser(app, "owner@example.com");
        expect(loginOwner.status).toBe(200);
        ownerToken = loginOwner.body.token;

        const signupOther = await signupUser(app, "other@example.com");
        expect(signupOther.status).toBe(201);

        const loginOther = await loginUser(app, "other@example.com");
        expect(loginOther.status).toBe(200);
        otherToken = loginOther.body.token;
    });

      describe("GET /items", () => {
        it("returns 200 with an array", async () => {
        const res = await request(app).get("/items");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        });

        it("includes newly created items in the list", async () => {
        await createItem(app, ownerToken, { name: "Listed Item" });

        const res = await request(app).get("/items");
        expect(res.status).toBe(200);
        expect(res.body.some((i) => i.name === "Listed Item")).toBe(true);
        });
      });

     describe("POST /items", () => {
        it("returns 401 when no Authorization header is provided", async () => {
        const res = await request(app).post("/items").send({ name: "Unauthorized" });
        expect(res.status).toBe(401);
        });

        it("returns 401 when the token is invalid", async () => {
        const res = await request(app)
            .post("/items")
            .set("Authorization", "Bearer not.a.valid.token")
            .send({ name: "Bad Token" });
        expect(res.status).toBe(401);
        });

        it("returns 400 when name is missing", async () => {
        const res = await createItem(app, ownerToken, {
            description: "No name field",
        });
        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
        });

        it("creates an item and returns 201 with the created object", async () => {
        const res = await createItem(app, ownerToken, {
            name: "My Item",
            description: "A fine item",
        });

        expect(res.status).toBe(201);
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toBe("My Item");
        expect(res.body.description).toBe("A fine item");
        expect(res.body.owner_user_id).toBe(ownerId);
        });

        it("creates an item without an optional description", async () => {
        const res = await createItem(app, ownerToken, {
            name: "No Description Item",
        });

        expect(res.status).toBe(201);
        expect(res.body.description).toBeNull();
        });
    });

      describe("GET /items/:id", () => {
    let itemId;

    beforeAll(async () => {
      const res = await createItem(app, ownerToken, { name: "New Item" });
      itemId = res.body.id;
    });

    it("returns 404 for a non-existent item", async () => {
      const res = await request(app).get("/items/99999");
      expect(res.status).toBe(404);
    });

    it("returns 200 with the correct item for a valid id", async () => {
      const res = await request(app).get(`/items/${itemId}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(itemId);
      expect(res.body.name).toBe("New Item");
    });
  });  

    describe("PUT /items/:id", () => {
    let itemId;

    beforeAll(async () => {
      const res = await createItem(app, ownerToken, {
        name: "Updatable Item",
        description: "Original desc",
      });
      itemId = res.body.id;
    });

    it("returns 401 when no Authorization header is provided", async () => {
      const res = await request(app)
        .put(`/items/${itemId}`)
        .send({ name: "New Name" });
      expect(res.status).toBe(401);
    });

    it("returns 400 when name is missing", async () => {
      const res = await request(app)
        .put(`/items/${itemId}`)
        .set(authHeader(ownerToken))
        .send({ description: "Name is missing" });
      expect(res.status).toBe(400);
    });

    it("returns 404 for a non-existent item", async () => {
      const res = await request(app)
        .put("/items/99999")
        .set(authHeader(ownerToken))
        .send({ name: "Ghost Update" });
      expect(res.status).toBe(404);
    });

    it("returns 403 when the authenticated user is not the owner", async () => {
      const res = await request(app)
        .put(`/items/${itemId}`)
        .set(authHeader(otherToken))
        .send({ name: "Hijacked Name" });
      expect(res.status).toBe(403);
    });

    it("updates the item and returns 204", async () => {
      const res = await request(app)
        .put(`/items/${itemId}`)
        .set(authHeader(ownerToken))
        .send({ name: "Updated Name", description: "Updated desc" });
      expect(res.status).toBe(204);
    });

    it("persists the updated values", async () => {
      const res = await request(app).get(`/items/${itemId}`);
      expect(res.body.name).toBe("Updated Name");
      expect(res.body.description).toBe("Updated desc");
    });
  });

    describe("DELETE /items/:id", () => {
    let itemId;

    beforeAll(async () => {
      const res = await createItem(app, ownerToken, { name: "Deletable Item" });
      itemId = res.body.id;
    });

    it("returns 401 when no Authorization header is provided", async () => {
      const res = await request(app).delete(`/items/${itemId}`);
      expect(res.status).toBe(401);
    });

    it("returns 404 for a non-existent item", async () => {
      const res = await request(app)
        .delete("/items/99999")
        .set(authHeader(ownerToken));
      expect(res.status).toBe(404);
    });

    it("returns 403 when the authenticated user is not the owner", async () => {
      const res = await request(app)
        .delete(`/items/${itemId}`)
        .set(authHeader(otherToken));
      expect(res.status).toBe(403);
    });

    it("deletes the item and returns 204", async () => {
      const res = await request(app)
        .delete(`/items/${itemId}`)
        .set(authHeader(ownerToken));
      expect(res.status).toBe(204);
    });

    it("item is no longer accessible after deletion", async () => {
      const res = await request(app).get(`/items/${itemId}`);
      expect(res.status).toBe(404);
    });
  });
    afterAll(() => {
        return close_db();
    });

});