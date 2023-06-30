
const Web3 = require('web3');


// Connect to an Ethereum node
const web3 = new Web3('json-rpc.2mnk2ypckfrt988whmbu8lc8n.blockchainnodeengine.com?key=AIzaSyCj0UG5tcZCy8vPH9DreznhsKhrs6fBeDo');

web3.eth.getBlock('latest')
  .then(transaction => {
    console.log('Transaction details:');
    console.log('Hash:', transaction);
  })
  .catch(error => {
    console.error('Error retrieving transaction details:', error);
  });