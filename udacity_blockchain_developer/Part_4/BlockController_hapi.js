const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');


class BlockController {


    constructor(server) {
        this.server = server;
        this.blocks = [];
        this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.server.route({
            method: 'GET',
            path: '/api/block/{index}',
            handler: (request, h) => {
                const block = this.blocks[request.params['index']];
                return (JSON.stringify(block))
            }
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.server.route({
            method: 'POST',
            path: '/api/block',
            handler: (request, h) => {

            let postBlock = new BlockClass.Block(request.payload['data']);
            postBlock.height = this.blocks.length;
            postBlock.hash = SHA256(JSON.stringify(postBlock)).toString();
            this.blocks.push(postBlock);
            return (JSON.stringify(postBlock));
            }
        });
    }

    initializeMockData() {
        if(this.blocks.length === 0){
            for (let index = 0; index < 10; index++) {
                let blockAux = new BlockClass.Block(`Test Data #${index}`);
                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                this.blocks.push(blockAux);
            }
        }
    }


}

/**
 * Exporting the BlockController class
 * @param {*} server 
 */
module.exports = (server) => { return new BlockController(server);}