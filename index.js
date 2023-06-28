const Web3 = require('web3');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({
  credential: applicationDefault()
});

const startBlock = 0; // Define and assign a value to startBlock
const db = getFirestore();
const web3 = new Web3('http://json-rpc.2mnk2ypckfrt988whmbu8lc8n.blockchainnodeengine.com?key=AIzaSyCj0UG5tcZCy8vPH9DreznhsKhrs6fBeDo');

async function contractExists(contractAddress) {
  const snapshot = await db.collection('contracts').doc(contractAddress).get();
  return snapshot.exists;
}

async function indexContracts(blockNumber) {
  try {
    const block = await web3.eth.getBlock(blockNumber, true);
    const transactions = block.transactions;

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

async function indexAllContracts() {
  const latestBlockNumber = await web3.eth.getBlockNumber();

  console.log('Start indexing contracts...');
  console.log('-------------------------');

  for (let blockNumber = startBlock; blockNumber <= latestBlockNumber; blockNumber++) {
    console.log('Indexing block number:', blockNumber);
    await indexContracts(blockNumber);
  }

  console.log('-------------------------');
  console.log('Finished indexing contracts.');
}

indexAllContracts();