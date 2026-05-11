export function errorHandler(error, _req, res, _next) {
  if (error.name === "ZodError") {
    return res.status(422).json({
      error: {
        message: "Validation failed",
        details: error.errors
      }
    });
  }

  const status = error.status ?? 500;
  res.status(status).json({
    error: {
      message: status === 500 ? "Internal server error" : error.message,
      details: error.details
    }
  });
}
