import { errorTypes } from "../../utils/errors.js";
import {
  handleCastErrorDB,
  handleValidationErrorDB,
  handleDuplicateFieldsDB,
} from "../../utils/errorHandlers.js";

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || "error";

  if (err.name === errorTypes.CastError) {
    error = handleCastErrorDB(err);
  } else if (err.name === errorTypes.ValidationError) {
    error = handleValidationErrorDB(err);
  } else if (err.code === 11000) {
    error = handleDuplicateFieldsDB(err);
  }

  res.status(error.statusCode).json({
    success: false,
    status: error.status,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
