const sendResponseData = (res,statusCode, success, message, data = {}) => {
    return res.status(statusCode).json({
      success,
      message,
      data: { ...data }
    });
  };
  
  const sendResponse = (res,statusCode,success, message) => {
    return res.status(statusCode).json({
      success,
      message,
    });
  };

module.exports={
    sendResponse,
    sendResponseData
}