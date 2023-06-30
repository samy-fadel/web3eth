
const Web3 = require('web3');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({
credential: applicationDefault()
});

const db = getFirestore();
const web3 = new Web3('http://json-rpc.2mnk2ypckfrt988whmbu8lc8n.blockchainnodeengine.com?key=AIzaSyCj0UG5tcZCy8vPH9DreznhsKhrs6fBeDo');





web3.eth.getBlockNumber()
  .then(blockNumber => {
    console.log('blockNumber is :', blockNumber);
  })
  .catch(error => {
    console.error('Error retrieving transaction details:', error);
  });


