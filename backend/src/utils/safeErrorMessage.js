const TECHNICAL_ERROR_PATTERN =
  /ER_[A-Z0-9_]+|SQLSTATE|ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOENT|EADDRINUSE|EACCES|mongodb|mongoose|Duplicate entry|Unknown column|Incorrect |syntax error|PROTOCOL_|Handshake|Access denied for user|getaddrinfo|RESEND_API_KEY|API key|smtp |at Object\.|at Module\.|at async |ValidationError|CastError|MongoServerError/i;

function isTechnicalErrorMessage(message) {
  if (!message || typeof message !== "string") {
    return true;
  }

  return TECHNICAL_ERROR_PATTERN.test(message);
}

function toClientErrorMessage(error, defaultMessage) {
  const message = error?.message;

  if (!message || isTechnicalErrorMessage(message)) {
    return defaultMessage;
  }

  return message;
}

module.exports = {
  isTechnicalErrorMessage,
  toClientErrorMessage,
};
