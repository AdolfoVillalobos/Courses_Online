const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChainClass = require("./BlockChain.js");
const StarValidation = require("./StarValidation.js")
const { check, validationResult } = require('express-validator');



class BlockController{

    constructor(app){
        this.app = app;
        this.blocks = new BlockChainClass.Blockchain();
        this.validationUtils = new StarValidation.StarValidation();
        this.postRequestValidation();
        this.postSignatureValidationRequest();
        this.postNewStar();
    }

    getBlockByIndex(){
        this.app.get("/block/:index", (req, resp)=>{
            const block = this.blocks[req.params['index']]
            resp.send(JSON.stringify(block));
        })
    }

    postNewStar(){
        this.app.post("/block", [
            check('address')
            .not()
            .isEmpty()
        ], (req, resp)=>{

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
              return res.status(422).json({ errors: errors.array() })
            }

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
        this.app.post("/requestValidation", [
            check('address')
            .not()
            .isEmpty()
        ], async (req, resp)=>{
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
              return res.status(422).json({ errors: errors.array() })
            }

            req.requestTimeStamp = this.getCurrentTime()
            let response = await this.validationUtils.addRequestValidation(req)
            .then((response)=>{
                return response
            })
            .catch((err)=>{
                return {'error':err};
            });
            resp.json(response);
        })
    }

    postSignatureValidationRequest(){
        this.app.post("/message-signature/validate", [
            check('address')
            .not()
            .isEmpty(),
            check('signature')
            .not()
            .isEmpty()
        ],async (req, resp)=>{
            //resp.send("This is a POST");
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
              return res.status(422).json({ errors: errors.array() })
            }

            req.requestTimeStamp = this.getCurrentTime()
            let response = await this.validationUtils.validateRequestByWallet(req)
            .then((response)=>{
                return response
            })
            .catch((err)=>{
                return {'error':err}
            })

            resp.json(response)
        })
    }

    getCurrentTime(){
        return new Date().getTime().toString().slice(0,-3)
    }
}

module.exports = (app) => { return new BlockController(app);}