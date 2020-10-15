
const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    // Helper method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    generateGenesisBlock(){
        this.getBlockHeight()
        .then((response)=>{
            if (response==-1){
                this.addBlock(new Block.Block('Genesis block'))
                .then((response)=>{
                    console.info(response);
                })
                .catch((error)=>{
                    console.log(error)
                });
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    // Get block height, it is a helper method that return the height of the blockchain
    getBlockHeight() {
        return new Promise((resolve, reject) => {
            this.bd.getBlocksCount()
            .then((response) =>{
                resolve(response-1);
            })
            .catch((error) =>{
                reject(error)
            })
        })
    }

    // Add new block
    addBlock(block) {
        const newBlock = block;
        return new Promise((resolve, reject) => {
          // Block height
          this.getBlockHeight()
            .then((blockHeight) => {
              newBlock.height = blockHeight + 1;
              // UTC timestamp
              newBlock.time = new Date().getTime().toString().slice(0, -3);
              // previous block hash
              newBlock.previousBlockHash = '';
              if (newBlock.height > 0) {
                this.getBlock(blockHeight)
                  .then((previousBlock) => {
                    newBlock.previousBlockHash = previousBlock.hash;
                    // Block hash with SHA256 using block and converting to a string
                    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                    // Adding block object to chain
                    this.bd.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString())
                      .then((response) => {
                        resolve(response);
                      })
                      .catch((error) => {
                        reject(error);
                      });
                  })
                  .catch((error) => {
                    reject(error);
                  });
              } else {
                // Block hash with SHA256 using block and converting to a string
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                // Adding block object to chain
                this.bd.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString())
                  .then((response) => {
                    resolve(response);
                  })
                  .catch((error) => {
                    reject(error);
                  });
              }
            })
            .catch((error) => {
              reject(error);
            });
        });
      }
    // Get Block By Height
    getBlock(height) {
        return new Promise((resolve, reject)=>{
            this.bd.getLevelDBData(height)
            .then((response)=>{
                resolve(response);
            })
            .catch((error)=>{
                reject(error);
            })
        })
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        // Add your code here
        return new Promise((resolve, reject)=>{
        this.getBlock(height).then((lastBlock)=>{
            let block = lastBlock
            const blockHash = block.hash
            block.hash = "";
            const validHash =  SHA256(JSON.stringify(block)).toString();
            if (validHash==blockHash){
                resolve(true)
            } else{
                resolve(false);
            }
        }).catch((err)=>{reject(err)})
        })
    }

    // Validate Blockchain
    validateChain() {
        return new Promise((resolve, reject)=>{
            const errorLog = [];
            this.getBlockHeight().then(async (blockHeight)=>{
                const allPromises = []
                for (let i = 0; i < blockHeight; i++) {

                    // Validate Block Individually
                    allPromises.push(this.validateBlock(i).then((valid)=>{
                        if (!valid){
                            errorLog.push(console.log("Invalid Block: "+i));
                        }
                    }))

                    // Validate Block by Link
                    this.getBlock(i).then((block)=>{
                        const truePreviousHash = block.hash;
                        this.getBlock(i+1).then((nextBlock)=>{
                            const actualPreviousHash = nextBlock.previousBlockHash;
                            if (truePreviousHash!=actualPreviousHash){
                                errorLog.push("Invalid hash link on ${i}");
                            }

                        }).catch((err)=>{reject(err)})


                    }).catch((err)=>{reject(err)})

                }

            await Promise.all(allPromises);
            resolve(errorLog);

            }).catch((err)=>{
                reject(err)
            })
        })
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise( (resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err)});
        });
    }

}

module.exports.Blockchain = Blockchain;