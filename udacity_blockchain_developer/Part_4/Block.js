class Block{
    constructor(data){
        this.hash = '';
        this.body = data;
        this.height = 0;
        this.time = new Date().getTime().toString().slice(0,-3);
    }
}

module.exports.Block = Block;