
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
    throw error; // or return a default value: e.g., return 0;
  }
}


async function indexContracts(blockNumber) {
try {
const block = await web3.eth.getBlock(blockNumber, true);
const transactions = block.transactions.slice(0);

for (let i = 0; i < transactions.length; i++) {
  const transaction = transactions[i];

  if (transaction.to === null) {
    const contractAddress = transaction.creates;

  

    const contract = await web3.eth.getCode(contractAddress);

    await db.collection('contracts').doc(contractAddress).set({
      address: contractAddress,
      code: contract
    });

    console.log('Contract Address:', contractAddress);
    console.log('Contract Code:', contract);
    console.log('-------------------------');
  }
}
} catch (error) {
console.error('Error indexing contracts:', error);
}
}

async function indexAllBlocks() {
  console.log('Start indexing blocks...');
  console.log('-------------------------');

  try {
    //let blockNumber = web3.eth.blockNumber;
    //console.log(blockNumber);
    let blockNumber = 0;
    let latestBlockNumber = await getLatestBlockNumber();
    console.log('latestBlockNumber: ', latestBlockNumber);


    while (blockNumber <= latestBlockNumber) {
      console.log('Indexing block number:', blockNumber);
      await indexContracts(blockNumber);
      blockNumber++;
    }

    console.log('-------------------------');
    console.log('Finished indexing blocks.');
  } catch (error) {
    console.error('Error indexing blocks:', error);
  }
}


indexAllBlocks();