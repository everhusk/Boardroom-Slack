// Connect to a public Ethereum node
var Web3 = require('web3');
var ethereum = new Web3(new Web3.providers.HttpProvider("https://eth3.augur.net")); // Augur.net 's public Ethereum node

// Setup Slack Bot
var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: process.env.SLACK_TOKEN
})
bot.startRTM(function(err,bot,payload) {
  if (err) {
    console.log("Error",err);
    throw new Error('Could not connect to Slack');
  }
});

// Handle a new slack channel adding the DAO-bot
controller.on('bot_channel_join', function(bot,message) {
  // Send welcome message, usage details, etc.
  bot.say({
    text:'Hello, I am the almighty Slack-DAO. Please send 1000 gas to XXXX-XXXX-XXXX to get started',
    channel:message.channel
  });
});

// Handle new company
// TODO: Replace when Ethereum Contract event on new payment
controller.hears('paid', ['direct_message','direct_mention','mention'], function(bot,message) {
    askCompanyName = function(response, convo) {
      convo.ask('What is your company name?', function(response, convo) {
        convo.say('Awesome name!');
        askCompanyShares(response, convo);
        convo.next();
      });
    }
    askCompanyShares = function(response, convo) {
      var channel = response.channel;
      convo.ask('How many shares would you like to allocate to this company?', function(response, convo) {
        convo.say('Great! Setting up your company now...');
        convo.next();
        // Create contract
      });
      convo.on('end',function(convo) {
        if (convo.status=='completed') {
          // Extract the user's responses
          var res = convo.extractResponses();
          var values = [];
          for (var key in res){
            values.push(res[key]);
          };
          // Save the results
          var companyName = values[0];
          var companyShares = values[1];
          bot.say({
            text:'Setup your company named "'+companyName+'" with '+companyShares+' shares available. Verfied transaction at www.ether.scan.io/link-to-transaction.',
            channel:channel
          });
        } else {
          // something happened that caused the conversation to stop prematurely
          bot.say({
            text:'There was an issue setting up your account. Please try again.',
            channel:channel
          });
        }

      });
    }
    bot.startConversation(message, askCompanyName);
});

// Handle new proposals
controller.hears('proposal', ['direct_message','direct_mention','mention'], function(bot,message) {
    askProposal = function(response, convo) {
      convo.ask('What is your Proposal?', function(response, convo) {
        askVotingTime(response, convo);
        convo.next();
      });
    }
    askVotingTime = function(response, convo) {
      var channel = response.channel;
      convo.ask('Got it. How long do people have to vote?', function(response, convo) {
        convo.say('Setting up your proposal now...');
        convo.next();
        // Create contract
      });
      convo.on('end',function(convo) {
        if (convo.status=='completed') {
          // Extract the user's responses
          var res = convo.extractResponses();
          var values = [];
          for (var key in res){
            values.push(res[key]);
          };
          // Save the results
          var proposal = values[0];
          var timeLimit = values[1];
          bot.say({
            text:'New proposal: '+proposal+'. Verfied transaction at www.ether.scan.io/link-to-transaction. Voting ends in '+timeLimit+'. Please direct message me your vote (yes or no), the proposal ID is 1234567.',
            channel:channel
          });
        } else {
          // something happened that caused the conversation to stop prematurely
          bot.say({
            text:'There was an issue setting up your proposal. Please try again.',
            channel:channel
          });
        }

      });
    }
    bot.startConversation(message, askCompanyName);
});
