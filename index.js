
const Web3 = require('web3');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({
credential: applicationDefault()
});

const db = getFirestore();
const web3 = new Web3('http://json-rpc.2mnk2ypckfrt988whmbu8lc8n.blockchainnodeengine.com?key=AIzaSyCj0UG5tcZCy8vPH9DreznhsKhrs6fBeDo');


async function getLatestBlockNumber() {
  try {
    const blockNumber = await web3.eth.getBlockNumber();
    console.log('Latest block number:', blockNumber);
    return blockNumber;
  } catch (error) {
    console.error('Error getting latest block number:', error);
    throw error;
  }
}




getLatestBlockNumber();