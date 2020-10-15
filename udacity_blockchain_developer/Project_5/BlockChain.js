
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
          this.getBlockHeight()
            .then((blockHeight) => {
              newBlock.height = blockHeight + 1;
              newBlock.time = new Date().getTime().toString().slice(0, -3);
              newBlock.previousBlockHash = '';
              if (newBlock.height > 0) {
                this.getBlockByHeight(blockHeight)
                  .then((previousBlock) => {
                    newBlock.previousBlockHash = previousBlock.hash;
                    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                    this.bd.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString())
                      .then((response) => {
                        resolve(newBlock);
                      })
                      .catch((error) => {
                        reject(error);
                      });
                  })
                  .catch((error) => {
                    reject(error);
                  });
              } else {
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
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

    getBlockByHeight(height) {
        return new Promise((resolve, reject)=>{
            this.bd.getLevelDBDataByHeight(height)
            .then((response)=>{
                resolve(response);
            })
            .catch((error)=>{
                reject(error);
            })
        })
    }

    getBlockByHash(blockHash) {
        return new Promise((resolve, reject)=>{
            this.bd.getLevelDBDataByHash(blockHash)
            .then((response)=>{
                resolve(response);
            })
            .catch((error)=>{
                reject(error);
            })
        })
    }
    validateBlock(height) {
        // Add your code here
        return new Promise((resolve, reject)=>{
        this.getBlockByHeight(height).then((lastBlock)=>{
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
    validateChain() {
        return new Promise((resolve, reject)=>{
            const errorLog = [];
            this.getBlockHeight().then(async (blockHeight)=>{
                const allPromises = []
                for (let i = 0; i < blockHeight; i++) {
                    allPromises.push(this.validateBlock(i).then((valid)=>{
                        if (!valid){
                            errorLog.push(console.log("Invalid Block: "+i));
                        }
                    }))
                    this.getBlockByHeight(i).then((block)=>{
                        const truePreviousHash = block.hash;
                        this.getBlockByHeight(i+1).then((nextBlock)=>{
                            const actualPreviousHash = nextBlock.previousBlockHash;
                            if (truePreviousHash!=actualPreviousHash){
                                errorLog.push("Invalid hash link on ${i}");
                            }
                        }).catch((err)=>{reject(err)})
                    }).catch((err)=>{reject(err)})
                }
            await Promise.all(allPromises);
            resolve(errorLog);
        }).catch((err)=>{reject(err)})
        })
    }
}

module.exports.Blockchain = Blockchain;