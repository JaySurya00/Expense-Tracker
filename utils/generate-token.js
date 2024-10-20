const jwt= require('jsonwebtoken');

const generateToken= (payload)=>{
    try{
    const token= jwt.sign(payload, process.env.JWT_SECRET);
    return token;
    }
    catch(error){
        console.log(error);
    }
}

module.exports= generateToken;