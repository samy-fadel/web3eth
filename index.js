const Web3 = require('web3');
//const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: 'YOUR_FIRESTORE_DATABASE_URL'
// });

// Initialize Firestore
//const db = admin.firestore();
//comments
console.log("line 13");
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
console.log("line 15");
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
console.log("line 17");

initializeApp({
  credential: applicationDefault()
});
console.log("line 22");
const db = getFirestore();
console.log("line 24");

// Connect to an Ethereum node
const web3 = new Web3('http://json-rpc.2mnk2ypckfrt988whmbu8lc8n.blockchainnodeengine.com?key=AIzaSyCj0UG5tcZCy8vPH9DreznhsKhrs6fBeDo');


// Define the starting and ending block numbers to index
const startBlock = 0;
const endBlock = 'latest';

// Function to check if a contract already exists in Firestore
async function contractExists(contractAddress) {
  console.log(contractAddress);
  const snapshot = await db.collection('contracts').doc(contractAddress).get();
  return snapshot.exists;
}

// Function to retrieve contract information for a specific block
async function indexContracts(blockNumber) {
  try {
    const block = await web3.eth.getBlock(blockNumber, true);
    const transactions = block.transactions;

    // Loop through all transactions in the block
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];

      // Check if the transaction created a new contract
      if (transaction.to === null) {
        const contractAddress = transaction.creates;
        
        // Check if contract already exists in Firestore
        const exists = await contractExists(contractAddress);
        if (exists) {
          console.log('Contract already exists:', contractAddress);
          console.log('-------------------------');
          continue;
        }
        
        const contract = await web3.eth.getCode(contractAddress);

        // Store contract information in Firestore
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

// Loop through the specified block range and index contracts
async function indexAllContracts() {
  console.log("indexAllContracts");
  const latestBlockNumber = await web3.eth.getBlockNumber();

  console.log('Start indexing contracts...');
  console.log('-------------------------');

  for (let blockNumber = startBlock; blockNumber <= endBlock; blockNumber++) {
    await indexContracts(blockNumber);
  }

  console.log('-------------------------');
  console.log('Finished indexing contracts.');
}

// Start the indexing process
indexAllContracts();
