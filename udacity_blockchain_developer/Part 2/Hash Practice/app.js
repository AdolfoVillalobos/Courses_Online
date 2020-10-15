var SHA256 = require("crypto-js/sha256");
var msg = 'Blockchain';

const dataObject = {
	id: 1,
  	body: "With Object Works too",
  	time: new Date().getTime().toString().slice(0,-3)
};



function generateHash(obj) {
	return SHA256(obj)
}

console.log(`SHA256 Hash: ${generateHash(msg)}`);
console.log(`SHA256 Hash: ${generateHash(dataObject)}`);