export function errorHandler(error, req, res, next) {
    if (res.headersSent) return next(error);

    const status = error.status || 500;
    res.status(status);
    res.json({
        route: req.route.path,
        methods: req.route.methods,
        error: error.message
    });
}
