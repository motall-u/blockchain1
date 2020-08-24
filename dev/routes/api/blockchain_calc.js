const express =require('express');
const router= express.Router();
const blockchain_data=require('../../blockchain_data');
const Blockchain=require('../../Blockchain');

const app =express();

 
//Creation of new Blockchain
const bitcoin = new Blockchain();//premier block deja initialiser


// //Get all data
// router.get('/',(req,res)=>{
// 	res.json(blockchain_data);
// });

//Create transaction
router.post('/',(req,res)=>{
	const newTransactions={
		amount: req.body.amount,
		sender:req.body.sender,
		recipient:req.body.recipient
	}
		
	if (newTransactions.amount !=='' && newTransactions.sender !== '' && newTransactions.recipient !== '') {
		blockchain_data.pendingTransactions.push(newTransactions);
		bitcoin.createNewTransaction(newTransactions.amount,newTransactions.sender,newTransactions.recipient);
		console.log(bitcoin);

	}else{
		return res.status(400).json({msg:'Transaction impossible'});
	}
	// res.json(members);
	res.redirect('/'); 

});


//Test read
const MongoClient = require('mongodb').MongoClient;

var db;

MongoClient.connect('mongodb://127.0.0.1', (err, client) => {
  if (err) return console.log(err)
  db = client.db('my_database') // whatever your database name is
  app.listen(1024, () => {
    console.log('listening on 1024')
  })
})



//Create new block
router.get('/newblock',(req,res)=>{
	  db.collection('blockchain_dbs').find().toArray(function(err, results) {
	  const t=results.length-1;
	  const t_chain= results[t].chain.length-1;
	  var blockchain_data= results;
	  //res.render('index',{results1:results[t].pendingTransactions, results2:results[t].chain})

	//ProofOfWork return nonce
	//previousBlockHash,currentBlockData
	var previousBlockHash_b=results[t].chain[t_chain].hash;
	console.log('ooooooooooooooooooo')
	console.log(previousBlockHash_b);
	console.log('ooooooooooooooooooo')



	var currentBlockData_b=results[t].pendingTransactions;
	//Nonce value
	var nonce_value = bitcoin.proofOfWork(previousBlockHash_b, currentBlockData_b );
	//HAshblock calcul
	//previousBlockHash,currentBlockData, nonce
	var hash_ =bitcoin.hashBlock(previousBlockHash_b,currentBlockData_b, nonce_value);
	//createNewBlock function
	//nonce,previousBlockHash, hash
	//bitcoin.createNewBlock()
	
	bitcoin.createNewBlock(nonce_value,previousBlockHash_b,hash_);
	res.redirect('/');
})
});




module.exports=bitcoin;
module.exports=router;
