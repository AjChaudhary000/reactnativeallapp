const success_response = (data) => ({
  status: true,
  ...data,
});
const failed_response = (message) => ({
  status: false,
  message,
});

module.exports = { success_response, failed_response };
