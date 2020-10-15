const TimeoutRequestsWindowTime = 30*60*1000;
const defaultWindow = TimeoutRequestsWindowTime/1000;
const level = require('level');
let db = level('./stardata');
const bitcoinMessage = require('bitcoinjs-message');

class StarValidation{;
    constructor(){
        this.mempool = [];
    }

    async validateRequestByWallet(req){


        return new Promise((resolve, reject) =>{
            db.get(req.body.address, (err, value)=>{
                if (value == undefined) {
                    return reject('Undefined address')
                } else if (err){
                    return reject(err);
                } else {
                    // The request had already been submitted.
                    value = JSON.parse(value)

                    if(value.messageSignature=='valid'){
                        return resolve({
                            registerStar: true,
                            status: value
                        })
                    } else{
                        let isValid = false;

                        if(this.isExpired(req)){
                            value.validationWindow=0;
                            value.messageSignature = 'Validation expired';
                        }
                        else{
                            value.validationWindow = defaultWindow-(this.getCurrentTime()-value.requestTimeStamp);
                            try{
                                isValid = bitcoinMessage.verify(value.message, req.body.address, signature)
                            } catch(error){
                                isValid = false
                            }
                            value.messageSignature = isValid ? 'valid' : 'invalid'
                        }

                        db.put(req.body.address, JSON.stringify(value));
                        return resolve({
                            registerStar:  !this.isExpired(value.requestTimeStamp) && isValid,
                            status:value
                        })
                    }
                }
            })
        })
    }

    async addRequestValidation(req){

        return new Promise((resolve, reject) =>{
            db.get(req.body.address, (err, value)=>{
                if (value == undefined) {
                    console.log("Address available")
                    if (this.isExpired(req)){
                        return reject("Request has expired. Send again");
                    } else{
                        let data = this.serializeData(req.body.address);
                        return resolve(this.saveRequestStarValidation(req.body.address, data))
                    }

                } else if (err){
                    return reject(err);
                } else {
                    // The request had already been submitted.
                    value = JSON.parse(value)
                    if (this.isExpired(req)){
                        console.log("Request has already been submitted. No time left. Address no longer available")
                        return resolve(this.saveRequestStarValidation(req.body.address, value));
                    } else {
                        // We update time left:

                        value.validationWindow = defaultWindow-(this.getCurrentTime()-value.requestTimeStamp);
                        console.log("Request has already been submitted. Time left updated to "+value.validationWindow)
                        return resolve(this.saveRequestStarValidation(req.body.address, value));
                    }
                }
            })
        })
    }

    getCurrentTime(){
        return new Date().getTime().toString().slice(0,-3)
    }

    isExpired(req){
        return this.getCurrentTime()-req.requestTimeStamp > defaultWindow
    }

    saveRequestStarValidation(address, data){
        db.put(address, JSON.stringify(data));
        return data
    }

    serializeData(address){
        const data = {
            address: address,
            message: `${address}:${this.getCurrentTime()}:starRegistry`,
            requestTimeStamp: this.getCurrentTime(),
            validationWindow: defaultWindow
        }
        return data
    }


}

module.exports.StarValidation = StarValidation;