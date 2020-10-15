const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChainClass = require("./BlockChain.js");
const StarValidation = require("../Project_5/starValidation.js/index.js")



class BlockController{

    constructor(app){
        this.app = app;
        this.blocks = BlockChainClass.Blockchain();
        this.validationUtils = StarValidation.StarValidation();
        this.getBlockByIndex();
        this.postNewStar();
    }


    // GET method
    getBlockByIndex(){
        this.app.get("/block/:index", (req, resp)=>{
            const block = this.blocks[req.params['index']]
            resp.send(JSON.stringify(block));
        })
    }

    // POST method
    postNewStar(){
        this.app.post("/block", (req, resp)=>{

            const address = req.body.walletAddress;
            const star = req.body.star;
            star.story = Buffer.from(req.body.star.story).toString('hex')

            const block = {
                'address':address,
                'star': star
            }

            let postBlock = new BlockClass.Block(block);
            this.blocks.addBlock(postBlock).then((success)=>{
                res.status(201).send(success)
            })
            .catch(() => {res.json({ error: 'There was an error generating a new block' })})

        })
    }

    postRequestValidation(){
        this.app.post("/requestValidation", (req, resp)=>{
            //resp.send("This is a POST");

            this.validationUtils.addRequestValidation(req);
            resp.send("This is a request validation. I return a Request Object")

        })
    }

    postSignatureValidationRequest(){
        this.app.post("/message-signature/validate", (req, resp)=>{
            //resp.send("This is a POST");
            resp.send("This is a request validation. I return a Request Object")

        })
    }


}

module.exports = (app) => { return new BlockController(app);}