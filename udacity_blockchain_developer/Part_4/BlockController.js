const SHA256 = require('crypto-js/sha256')
const BlockClass = require("./Block.js");


class BlockController{

    constructor(app){
        this.app = app;
        this.blocks = [];
        this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }


    // GET method
    getBlockByIndex(){
        this.app.get("/api/block/:index", (req, resp)=>{
            const block = this.blocks[req.params['index']]
            resp.send(JSON.stringify(block));
        })
    }

    // POST method
    postNewBlock(){
        this.app.post("/api/block", (req, resp)=>{
            //resp.send("This is a POST");
            let postBlock = new BlockClass.Block(req.body['data']);
            postBlock.height = this.blocks.length;
            postBlock.hash = SHA256(JSON.stringify(postBlock)).toString();
            this.blocks.push(postBlock);
            resp.send(JSON.stringify(postBlock));

        })
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

module.exports = (app) => { return new BlockController(app);}