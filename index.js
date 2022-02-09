const express = require('express');
const app = express();
const fs = require('fs')
const lightwallet = require("eth-lightwallet");
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port,()=>{
    console.log(port+' ing');
})

//lightwallet 모듈을 사용하여 랜덤한 니모닉 코드를 얻습니다.
app.post('/newMnemonic', async(req,res) => {  
  
    let mnemonic;
    try{
        mnemonic = lightwallet.keystore.generateRandomSeed();   //지갑의 12단어의 seed구문을 생성시켜주는 이더리움 자체 코드 함수 
        res.json({mnemonic})
    }catch(err){
        console.log(err);
    }
 
 });


 // 니모닉 코드와 패스워드를 이용해 keystore와 address를 생성합니다.
app.post('/newWallet', async(req, res) => {
    
    
    
    let password = req.body.password;
     let mnemonic = req.body.mnemonic;
  
     console.log(password);
     console.log(mnemonic);  
     
 
   
     
     try{
       lightwallet.keystore.createVault({
           password : password,
           seedPhrase : mnemonic,
           hdPathString : "m/0'/0'/0'"
       },function(err,ks){
  
        
          ks.keyFromPassword(password, function (err,pwDerivedKey){
                ks.generateNewAddress(pwDerivedKey,1)
  
                let address = (ks.getAddresses()).toString();
                let keystore = ks.serialize();
  
                fs.writeFile('wallet.json',keystore,function(err,data){
                   if(err){
                       res.json({code : 999, message: '실패'})
                   }else{
                       res.json({code:1,message:'성공!'})
                   }
                })   
           });
       });
  
     }catch(exception){
          console.log("NewWallet ===>>>"+exception);
     }
  
  });

