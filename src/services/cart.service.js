const {
    findCartByUserId,
    createCart,
    getCartItems,
    findCartItem,
    addCartItem,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
} = require("../models/cart.model");

const { findProductById } = require("../models/product.model");

const getOrCreateCart = async (userId) => {
    let cart = await findCartByUserId(userId);
    if (!cart) {
        cart = await createCart(userId);
    }
    return cart;
};

const getCart = async (userId) => {
    const cart = await getOrCreateCart(userId);
    const items = await getCartItems(cart.id);
    const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);
    return { cartId: cart.id, items, total };
};

const addToCart = async (userId, productId, quantity) => {
    const product = await findProductById(productId);
    if (!product) {
        const error = new Error("Producto no encontrado");
        error.statusCode = 404;
        throw error;
    }

    const cart = await getOrCreateCart(userId);
    const existingItem = await findCartItem(cart.id, productId);

    const newQuantity = (existingItem ? existingItem.quantity : 0) + quantity;

    if (newQuantity > product.stock) {
        const error = new Error(`Stock insuficiente. Disponible: ${product.stock}`);
        error.statusCode = 400;
        throw error;
    }

    if (existingItem) {
        return await updateCartItemQuantity(existingItem.id, newQuantity);
    }
    return await addCartItem(cart.id, productId, quantity);
};

const updateItem = async (userId, itemId, quantity) => {
    const cart = await getOrCreateCart(userId);
    const items = await getCartItems(cart.id);
    const item = items.find((it) => it.id === Number(itemId));

    if (!item) {
        const error = new Error("Item no encontrado en el carrito");
        error.statusCode = 404;
        throw error;
    }
    if (quantity > item.stock) {
        const error = new Error(`Stock insuficiente. Disponible: ${item.stock}`);
        error.statusCode = 400;
        throw error;
    }
    return await updateCartItemQuantity(itemId, quantity);
};

const removeItem = async (userId, itemId) => {
    const cart = await getOrCreateCart(userId);
    const deleted = await removeCartItem(itemId, cart.id);
    if (!deleted) {
        const error = new Error("Item no encontrado en el carrito");
        error.statusCode = 404;
        throw error;
    }
    return deleted;
};

const emptyCart = async (userId) => {
    const cart = await getOrCreateCart(userId);
    await clearCart(cart.id);
};

module.exports = { getCart, addToCart, updateItem, removeItem, emptyCart };