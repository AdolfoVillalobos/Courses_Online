# Simple Private BlockChain

Here i developed in JS a simple private Blockchain.

Each Block in the Blockchain stores simple data (a string), it's hash and a timestamp.
The Blocks are linked by the hashes of the previous block.

I implemented a LevelDB structure for Blockchain persistence.

The Blockchain can add new blocks and validate them. The Blockchain can also validate that linked blocks have the appropriate hashes.
