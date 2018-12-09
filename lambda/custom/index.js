const Alexa = require('ask-sdk-core');

const showSucculent = handlerInput => {
  const succulentData = {
    row: '5',
    title: 'Hoya pubicalyx',
    body:
      'The Hoya Pubicalyx is a fast growing scrambling shrub which can form groups of blooms up to 4 inches across.',
    imageUrl:
      'https://drive.google.com/open?id=1EIzxzcl8J2-NTjatCA-Ht97obRgkd_q9',
    timestamp: '09/12/2018 15:06:51',
    cachedImageUrl:
      'https://succulent-of-the-day-dev-succulentoftheday-b89wdhezh0be.s3.amazonaws.com/images/1EIzxzcl8J2-NTjatCA-Ht97obRgkd_q9.jpg'
  };
  const result = handlerInput.responseBuilder
    .speak(succulentData.body)
    .addDirective({
      type: 'Alexa.Presentation.APL.RenderDocument',
      version: '1.0',
      document: require('./display-template.json'),
      datasources: { succulentData }
    })
    .withStandardCard(
      succulentData.title,
      succulentData.body,
      succulentData.cachedImageUrl
    )
    .getResponse();

  return result;
};

const ShowSucculentIntentHandler = {
  canHandle(handlerInput) {
    return (
      (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
        handlerInput.requestEnvelope.request.intent.name ===
          'ShowSucculentIntent') ||
      handlerInput.requestEnvelope.request.type === 'LaunchRequest'
    );
  },
  handle(handlerInput) {
    console.log(
      JSON.stringify({ message: 'Handling succulent request', handlerInput })
    );

    const result = showSucculent(handlerInput);

    console.log(JSON.stringify(result));

    return result;
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    const speechText = 'You can ask me to show you a succulent of the day!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(skillName, speechText)
      .getResponse();
  }
};

const skillName = 'Succulent of the Day';
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name ===
        'AMAZON.CancelIntent' ||
        handlerInput.requestEnvelope.request.intent.name ===
          'AMAZON.StopIntent')
    );
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(skillName, speechText)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${
        handlerInput.requestEnvelope.request.reason
      }`
    );

    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak("Sorry, I can't understand the command. Please say again.")
      .reprompt("Sorry, I can't understand the command. Please say again.")
      .getResponse();
  }
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    ShowSucculentIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
