'use strict';
const Alexa = require('alexa-sdk');
var http = require('http');


//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
const APP_ID = undefined;

const SKILL_NAME = 'Secure Transport';
const GET_FACT_MESSAGE = "Here's your version: ";
const HELP_MESSAGE = 'You can say give me the version, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const data = [
    'Earth is the only planet not named after a god.',
];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetVersionIntent');
    },
    'GetVersionIntent': function () {
        var options = {
            host: 'api.open-notify.org',
            port:'80',
            method: 'GET',
            path: '/astros.json',
        };
        
        var req = http.request(options, res => {
            res.setEncoding('utf8');
            var returnData = "";
            
            res.on('data', chunk => {
                returnData = returnData + chunk;
            });
            
            res.on('end', () => {
                var result = JSON.parse(returnData);
                
                //callback(result);
                this.response.speak('here is something interesting: ' + result.people.length + ' people are currently in space');
                this.emit(':responseReady');
            });
        });
        req.end();
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
