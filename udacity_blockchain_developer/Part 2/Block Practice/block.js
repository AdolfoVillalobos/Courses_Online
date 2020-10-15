var SHA256 = require("crypto-js/sha256");


class Block {

	constructor(data){
		this.id = 0;
        this.nonce = 145444;
      	this.body = data;
      	this.hash = "";
    }

    generateHash(){
        let self = this;
        var promise = new Promise((resolve, reject) =>{
            self.hash = SHA256(JSON.stringify(self)).toString();

            resolve(self)
        });
        return promise
    }


}


module.exports.Block = Block;