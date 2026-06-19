const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            status: "error",
            message: "Acceso denegado: se requieren permisos de administración",
        });
    }
    next();
};

module.exports = { isAdmin };