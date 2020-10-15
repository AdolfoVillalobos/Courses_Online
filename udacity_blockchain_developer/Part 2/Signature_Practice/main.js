const bitcoinMessage = require('bitcoinjs-message');


// Verify a Bitcoin message
const myAddress = 'bc1qrlsrynxqgfk86tnfrdvdqwllwvtydnmcmu5r6c'
const message = 'Hey'
const signature = 'H5wGGfuFxvZDX6dDR2cfOhu+sqewUhG8iWZngtc7PtfLIo5tCRE1ka9Oma2gDqI39gya98+P9jb9sXvhFOAWaNY='

console.log(bitcoinMessage.verify(message,myAddress,signature));