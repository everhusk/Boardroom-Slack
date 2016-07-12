// Connect to a public Ethereum node
var Web3 = require('web3');
var ethereum = new Web3(new Web3.providers.HttpProvider("https://eth3.augur.net")); // Augur.net 's public Ethereum node

// Setup Slack Bot
console.log("SLACK TOKEN: ",process.env.SLACK_TOKEN)
var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: process.env.SLACK_TOKEN
})
bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

// Handle a new slack channel adding the DAO-bot
controller.on('channel_joined', function() {
  // Send welcome message, usage details, etc.
  bot.startConversation('Hello, I am the almighty Slack-DAO. Please send 1000 gas to XXXX-XXXX-XXXX to get started');
});

// TODO: Replace when Ethereum Contract event on new payment
controller.hears(['paid'], 'message_recieved', function(bot,message) {
    askCompanyName = function(response, convo) {
      convo.ask('What is your company name?', function(response, convo) {
        convo.say('Awesome name!');
        askCompanyShares(response, convo);
        convo.next();
      });
    }
    askCompanyShares = function(response, convo) {
      convo.ask('How many shares would you like to allocate to this company', function(response, convo) {
        convo.say('Great! Setting up your company now!');
        // Create contract
      });
    }
    bot.startConversation(message, askCompanyName);
});

// Validate the channel has a positive balance (so I'm not wasting my money)
// 1) Call Redis with channel ID (returns balance)
// 2) Balance > estimate cost of transaction ? Continue : Return insufficient funds

// New User Interaction Flow
// 0) Validate channel has a positive balance - Success -> Start the flow , Fail -> Run welcome message;
// 1a) Ask for company name
// 1b) Ask for number of shares
// 2) Create a new DAO linked to the slack group ID, assign all shares to the host user ID
// 3) Post the result to the slack group. Success -> Post Transaction ID, Fail -> Error message

// New Proposal Interation Flow
// 0) Validate channel has a positive balance - Success -> Start the flow , Fail -> Run welcome message
// 1a) Ask for proposal text
// 1b) Ask for proposal shares
// 2) Call the DAO contract and run a new proposal
// 3) Post the result to the slack group. Success -> Post Transaction ID, Fail -> Error message

// New Vote Interation Flow
// 0) Validate channel has a positive balance - Success -> Start the flow , Fail -> Run welcome message
// 1) Call contract (vote,userID), return result


// Handle Ethereum Event - Quorum Reached (channelID,proposal,result)
// 1) Return result to channel
