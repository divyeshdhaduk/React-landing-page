function prepareSuccessResponse(data, message,totalRecords) {
  return {
    success: true,
     data: data ,
    message: message,
    meta: {
      total: totalRecords
  }
  };
}

function prepareErrorResponse(message) {
  return {
    success: false,
    message: message,
  };
}

module.exports = {
  prepareSuccessResponse,
  prepareErrorResponse,
};