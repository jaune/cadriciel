function buildHttpError(status, http_message) {
  return function (detail) {
    this.status = status;
    var message = http_message;
    if (detail) {
      message += '\r\n'+detail;
    }
    this.message = message;
    this.stack = (new Error()).stack;
  };
}

module.exports = {
  
  'Error400' : buildHttpError(400, '400 Bad Request'),
  'Error401' : buildHttpError(401, '401 Unauthorized'),
  'Error403' : buildHttpError(403, '403 Forbidden'),
  'Error404' : buildHttpError(404, '404 Not Found'),
  'Error405' : buildHttpError(405, '405 Method Not Allowed'),
  'Error500' : buildHttpError(500, '500 Internal Server Error'),
  'Error503' : buildHttpError(503, '503 Service Unavailable')
  
};
