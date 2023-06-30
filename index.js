
Your code is missing a few things to index all the smart contracts in the Ethereum blockchain. Here are the changes you need to make:

You need to change the indexContracts function to loop through all the transactions in the block, not just the first one. You can do this by changing the following line:
const transactions = block.transactions;
to:

const transactions = block.transactions.slice(0);
You need to change the contractExists function to check if the contract already exists in the Firestore database, not just in the local cache. You can do this by changing the following line:
const snapshot = await db.collection('contracts').doc(contractAddress).get();
to:

const snapshot = await db.collection('contracts').doc(contractAddress).get();
const exists = snapshot.exists && snapshot.data.address === contractAddress;
You need to change the indexAllBlocks function to start from the genesis block, not from block number 0. You can do this by changing the following line:
let blockNumber = 0;
to:

let blockNumber = web3.eth.blockNumber;
Once you have made these changes, your code should be able to index all the smart contracts in the Ethereum blockchain.

Here is the complete code with the changes I have mentioned:

const Web3 = require('web3');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({
credential: applicationDefault()
});

const db = getFirestore();
const web3 = new Web3('http://json-rpc.2mnk2ypckfrt988whmbu8lc8n.blockchainnodeengine.com?key=gjgjg');

async function contractExists(contractAddress) {
const snapshot = await db.collection('contracts').doc(contractAddress).get();
const exists = snapshot.exists && snapshot.data.address === contractAddress;
return exists;
}

async function indexContracts(blockNumber) {
try {
const block = await web3.eth.getBlock(blockNumber, true);
const transactions = block.transactions.slice(0);

for (let i = 0; i < transactions.length; i++) {
  const transaction = transactions[i];

  if (transaction.to === null) {
    const contractAddress = transaction.creates;

    const exists = await contractExists(contractAddress);
    if (exists) {
      console.log('Contract already exists:', contractAddress);
      console.log('-------------------------');
      continue;
    }

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


const latestBlockNumber;

async function indexAllBlocks() {
  console.log('Start indexing blocks...');
  console.log('-------------------------');

  try {
    let blockNumber = web3.eth.blockNumber;

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