exports.handler = async (event, context) => {
  event.Records.forEach(record => {
    const { body } = record;
    const content = JSON.parse(body);
  });

  return {};
};
