export function errorHandler(error, req, res, next) {
    if (res.headersSent) return next(error);

    if (error.stack) console.error(error.stack);

    const status = error.status || 500;
    res.status(status);
    res.json({
        status,
        error: error.message,
        route: req.route?.path,
        methods: req.route?.methods
    });

    
}
