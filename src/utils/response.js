const sendSuccess = (res, message, data = null, statusCode = 200) => {
  const body = { success: true, message };
  if (data !== null) {
    body.data = data;
  }
  return res.status(statusCode).json(body);
};

const sendPaginated = (res, message, data, pagination) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

module.exports = { sendSuccess, sendPaginated };
