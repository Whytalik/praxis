export const handleCastErrorDB = (err) => ({
  message: `Invalid ${err.path}: ${err.value}`,
  statusCode: 400,
});

export const handleValidationErrorDB = (err) => ({
  message: Object.values(err.errors)
    .map((e) => e.message)
    .join(". "),
  statusCode: 400,
});

export const handleDuplicateFieldsDB = (err) => ({
  message: `Duplicate field value: ${Object.keys(err.keyValue).join(
    ", "
  )}. Please use another value`,
  statusCode: 400,
});
