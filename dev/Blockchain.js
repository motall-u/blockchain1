const mongoose= require('mongoose');

const blockchain_db= require('./blockchain_db');
const data= new blockchain_db();

const sha256=require('js-sha256');

 //Constructor function
 function Blockchain(){
 	this.chain=[]; //Store the chain all block
 	this.pendingTransactions=[];// Record all transactions:transactions en cours

 	//Creating the genesis block: The First
 	this.createNewBlock(100,'0','0'); //Default values
 } 

//Creating blockchain method for new block
Blockchain.prototype.createNewBlock= function(nonce,previousBlockHash, hash){
	 const newBlock={
	 	index:this.chain.length +1,
	 	timestamp:Date.now(),
	 	transactions:data.pendingTransactions, //Only pendingTransactions for block
	 	nonce: nonce,
	 	hash:hash,
	 	previousBlockHash: previousBlockHash 
	 };

	 // console.log('zzzzzzzzzzzzzzzzzzzzzzzzd')
	 // console.log(data.pendingTransactions);
	 // console.log('zzzzzzzzzzzzzzzzzzzzzzzz')


	 const t=data.chain.length-1;
	 data.chain.push(newBlock)
	 data.pendingTransactions=[];

	 this.pendingTransactions=[];
	 this.chain.push(newBlock); 
	 return newBlock;
}

//Get last block function
Blockchain.prototype.getLastBlock= function(){
	return this.chain[this.chain.length-1];
}

//Create new transaction
Blockchain.prototype.createNewTransaction= function(amount,sender,recipient){
	const newTransaction={
		amount:amount,
		sender:sender,
		recipient:recipient
	};
	//We record this transaction into pendingTransactions(all transactions)

	this.pendingTransactions.push(newTransaction);
	data.pendingTransactions.push(newTransaction);
	
	data.save()
	return this.getLastBlock()['index']+1;
}


///sha256 method
Blockchain.prototype.hashBlock=function(previousBlockHash,currentBlockData, nonce){
	//Transform input to string
	const dataAsString= previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	//Calculate the hash value
	const hash=sha256(dataAsString);
	return hash;

}

//ProofOfWork method
Blockchain.prototype.proofOfWork=function(previousBlockHash,currentBlockData){
	let nonce =0;
	let hash=this.hashBlock(previousBlockHash,currentBlockData,nonce);
	while(hash.substring(0,4)!='0000'){
		nonce++;
		hash=this.hashBlock(previousBlockHash,currentBlockData,nonce);
	}
	return nonce;
}




module.exports = Blockchain;