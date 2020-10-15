/* ===== Executable Test ==================================
|  Use this file to test your project.
|  =========================================================*/

const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');

let myBlockChain = new BlockChain.Blockchain();

setTimeout(function () {
	console.log("Waiting...")
}, 10000);

/******************************************
 ** Function for Create Tests Blocks   ****
 ******************************************/


(function theLoop(i) {
    setTimeout(() => {
      const blockTest = new Block.Block(`Test Block - ${(i + 1)}`);
      // Be careful this only will work if your method 'addBlock' in the Blockchain.js file return a Promise
      myBlockChain.addBlock(blockTest)
        .then((result) => {
          console.log(result);
          if (i + 1 < 10) {
            theLoop(i + 1);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 10000);
  }(0));


