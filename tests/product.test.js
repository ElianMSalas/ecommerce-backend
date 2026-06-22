const request = require("supertest");
const jwt = require("jsonwebtoken");

// Mockeamos el modelo de productos y la conexión a la BD.
jest.mock("../src/models/product.model");
jest.mock("../src/config/db", () => ({
    query: jest.fn(),
    connect: jest.fn(),
    on: jest.fn(),
}));

const {
    getProducts,
    countProducts,
    findProductById,
    createProduct,
} = require("../src/models/product.model");
const app = require("../src/app");

// Tokens firmados con el mismo secreto de test (ver tests/setup.js)
const adminToken = jwt.sign({ id: 1, role: "admin" }, process.env.JWT_SECRET);
const customerToken = jwt.sign({ id: 2, role: "customer" }, process.env.JWT_SECRET);

describe("GET /api/products", () => {
    it("lista productos con su paginación", async () => {
        getProducts.mockResolvedValue([
            { id: 1, name: "Teclado", price: "29.99", stock: 10 },
        ]);
        countProducts.mockResolvedValue(1);

        const res = await request(app).get("/api/products");

        expect(res.status).toBe(200);
        expect(res.body.products).toHaveLength(1);
        expect(res.body.pagination.totalPages).toBe(1);
    });
});

describe("GET /api/products/:id", () => {
    it("devuelve el producto cuando existe", async () => {
        findProductById.mockResolvedValue({ id: 1, name: "Teclado", price: "29.99" });

        const res = await request(app).get("/api/products/1");

        expect(res.status).toBe(200);
        expect(res.body.product.id).toBe(1);
    });

    it("devuelve 404 cuando el producto no existe", async () => {
        findProductById.mockResolvedValue(undefined);

        const res = await request(app).get("/api/products/999");

        expect(res.status).toBe(404);
        expect(res.body.status).toBe("error");
    });
});

describe("POST /api/products (protección por rol)", () => {
    const validProduct = { name: "Mouse", price: 19.99, stock: 5 };

    it("rechaza la petición sin token con 401", async () => {
        const res = await request(app).post("/api/products").send(validProduct);

        expect(res.status).toBe(401);
    });

    it("rechaza a un usuario customer con 403", async () => {
        const res = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${customerToken}`)
            .send(validProduct);

        expect(res.status).toBe(403);
        expect(createProduct).not.toHaveBeenCalled();
    });

    it("permite a un admin crear un producto y devuelve 201", async () => {
        createProduct.mockResolvedValue({ id: 1, ...validProduct });

        const res = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(validProduct);

        expect(res.status).toBe(201);
        expect(res.body.product.name).toBe("Mouse");
    });

    it("rechaza un producto sin precio con 400", async () => {
        const res = await request(app)
            .post("/api/products")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "Sin precio" });

        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
    });
});