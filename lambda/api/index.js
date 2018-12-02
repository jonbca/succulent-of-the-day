module.exports.handler = async (event) => {
  console.log("Event received", event);
  return JSON.stringify({responseCode: "200"});
};
