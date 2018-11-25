module.exports.handler = (event, something, callback) => {
  console.log(event);

  return JSON.stringify({ statusCode: 200 });
};
