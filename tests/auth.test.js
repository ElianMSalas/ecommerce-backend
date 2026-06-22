const request = require("supertest");

jest.mock("../src/models/user.model");
jest.mock("../src/config/db", () => ({
    query: jest.fn(),
    connect: jest.fn(),
    on: jest.fn(),
}));

const bcrypt = require("bcrypt");
const { findUserByEmail, createUser } = require("../src/models/user.model");
const app = require("../src/app");

describe("POST /api/auth/register", () => {
    it("registra un usuario nuevo y devuelve 201 sin exponer la contraseña", async () => {
        findUserByEmail.mockResolvedValue(undefined);
        createUser.mockResolvedValue({
            id: 1,
            name: "Ana",
            surname: "Perez",
            email: "ana@example.com",
            role: "customer",
        });

        const res = await request(app).post("/api/auth/register").send({
            name: "Ana",
            surname: "Perez",
            email: "ana@example.com",
            password: "secret123",
        });

        expect(res.status).toBe(201);
        expect(res.body.status).toBe("ok");
        expect(res.body.user).not.toHaveProperty("password");
        expect(createUser).toHaveBeenCalledTimes(1);
    });

    it("rechaza un email ya registrado con 409", async () => {
        findUserByEmail.mockResolvedValue({ id:1, email: "ana@example.com" });

        const res = await request(app).post("/api/auth/register").send({
            name: "Ana",
            surname: "Perez",
            email: "ana@example.com",
            password: "secret123",
        });

        expect(res.status).toBe(409);
        expect(res.body.status).toBe("error");
        expect(createUser).not.toHaveBeenCalled();
    });

    it("rechaza datos inválidos con 400 y lista de errores", async () => {
        const res = await request(app).post("/api/auth/register").send({
            name: "A",
            email: "no-es-email",
            password: "123",
        });

        expect(res.status).toBe(400);
        expect(res.body.errors).toBeDefined();
        expect(Array.isArray(res.body.errors)).toBe(true);
    });

    describe("POST /api/auth/login", () => {
        it("inicia sesión con credenciales válidas y devuelve un token", async () => {
            const hashed = await bcrypt.hash("secret123", 10);
            findUserByEmail.mockResolvedValue({
                id: 1,
                name: "Ana",
                email: "ana@example.com",
                role: "customer",
                password: hashed,
            });

            const res = await request(app).post("/api/auth/login").send({
                email: "ana@example.com",
                password: "secret123",
            });

            expect(res.status).toBe(200);
            expect(res.body.token).toBeDefined();
            expect(res.body.user).not.toHaveProperty("password");
        });

        it("rechaza un email inexistente con 401", async () => {
            findUserByEmail.mockResolvedValue(undefined);

            const res = await request(app).post("/api/auth/login").send({
                email: "noexiste@example.com",
                password: "whatever123",
            });

            expect(res.status).toBe(401);
            expect(res.body.status).toBe("error");
        });

        it("rechaza una constraseña incorrecta con 401", async () => {
            const hashed = await bcrypt.hash("la_correcta", 10);
            findUserByEmail.mockResolvedValue({
                id: 1,
                email: "ana@example.com",
                role: "customer",
                password: hashed,
            });

            const res = await request(app).post("/api/auth/login").send({
                email: "ana@example.com",
                password: "incorrecta",
            });

            expect(res.status).toBe(401);
            expect(res.body.status).toBe("error");
        });
    });
})