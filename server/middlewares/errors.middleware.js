export function errorHandler(error, req, res, next) {
    // print the error
    console.error(error);
    if (error.stack) console.error(error.stack);

    if (res.headersSent) return next(error);

    // send the error to client
    const status = error.status || 500;
    res.status(status);
    res.json({
        status,
        error: error.message,
        route: req.route?.path,
        methods: req.route?.methods
    });
}
