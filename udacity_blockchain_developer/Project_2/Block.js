class Block {
	constructor(data){
        this.hash = "";
        this.time = "";
        this.body = data;
        this.previousBlockHash = "";
        this.height = 0;
	}
}

module.exports.Block = Block;