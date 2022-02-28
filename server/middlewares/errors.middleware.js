export function errorHandler(error, req, res, next) {
    // set default status as 500
    error.status = error.status || 500;

    // print internel server errors
    if (error.status === 500) console.error(error.stack);

    // hand control over to express's inbuilt errorHandler, if headers are sent
    if (res.headersSent) return next(error);

    // otherwise, send the error to client
    res.status(error.status);
    res.json({
        error: {
            status: error.status,
            name: error.name,
            message: error.message
        }
    });
}
