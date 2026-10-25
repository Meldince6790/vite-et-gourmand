const TECHNICAL_ERROR_PATTERN =
  /ER_[A-Z0-9_]+|SQLSTATE|ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOENT|EADDRINUSE|EACCES|mongodb|mongoose|Duplicate entry|Unknown column|Incorrect |syntax error|PROTOCOL_|Handshake|Access denied for user|getaddrinfo|RESEND_API_KEY|API key|smtp |TypeError|ReferenceError|Cannot read propert|at Object\.|at Module\.|at async |ValidationError|CastError|MongoServerError/i;

// Codes d'erreur émis par le pilote mysql2 / MariaDB (ER_*, WARN_*) ou par la
// couche réseau / pool (PROTOCOL_*, ECONN*, ETIMEDOUT…).
const TECHNICAL_ERROR_CODE_PATTERN =
  /^(ER_|WARN_|PROTOCOL_|ECONN|ETIMEDOUT|ENOTFOUND|EAI_|EPIPE|EHOSTUNREACH)/;

function isTechnicalErrorMessage(message) {
  if (!message || typeof message !== "string") {
    return true;
  }

  return TECHNICAL_ERROR_PATTERN.test(message);
}

/**
 * Détecte de façon structurelle une erreur du pilote SQL (mysql2 / MariaDB),
 * indépendamment du texte du message : `sqlState`, `sqlMessage` ou `code` ER_*.
 * Les erreurs métier levées par l'application n'ont aucune de ces propriétés.
 */
function isSqlDriverError(error) {
  if (!error || typeof error !== "object") {
    return false;
  }

  if (error.sqlState || error.sqlMessage) {
    return true;
  }

  return (
    typeof error.code === "string" &&
    TECHNICAL_ERROR_CODE_PATTERN.test(error.code)
  );
}

function isTechnicalError(error) {
  return isSqlDriverError(error) || isTechnicalErrorMessage(error?.message);
}

function toClientErrorMessage(error, defaultMessage) {
  if (isTechnicalError(error)) {
    return defaultMessage;
  }

  return error.message;
}

module.exports = {
  isSqlDriverError,
  isTechnicalError,
  isTechnicalErrorMessage,
  toClientErrorMessage,
};
