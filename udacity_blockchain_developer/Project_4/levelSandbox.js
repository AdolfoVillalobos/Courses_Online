/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBDataByHeight(key){
        let self = this;
        return new Promise(function(resolve, reject) {
            self.db.get(key, (err, value) => {
                if(err){
                    if (err.type == 'NotFoundError'){
                        resolve(undefined);
                    } else{
                        console.log('Block '+key+' get failed', err)
                        reject(err)
                    }
                } else {
                    resolve(value);
                }
            })
        });
    }

    getLevelDBDataByHash(hash) {
        let self = this;
        let block = null;
        return new Promise(function(resolve, reject){
            self.db.createReadStream()
            .on('data', function (data) {
                if(data.hash === hash){
                    block = data;
                }
            })
            .on('error', function (err) {
                reject(err)
            })
            .on('close', function () {
                resolve(block);
            });
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        return new Promise((resolve, reject) => {
          this.db.put(key, value, (err) => {
            if (err) {
              reject(`Block ${key} submission failed`);
            } else {
              resolve(`Block added with key ${key} and value ${value}`);
            }
          });
        });
    }


    // Method that return the height
    getBlocksCount() {
        let self = this;
        return new Promise(function(resolve, reject){
           let i = 0
           self.db.createReadStream()
           .on('data', ()=>{
               i+=1
               console.log(i);
           }).on('error', (err) => {
               reject(err);
           }).on('close', ()=>{
               resolve(i);
           })
        });
    }
}

module.exports.LevelSandbox = LevelSandbox;