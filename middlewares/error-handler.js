
const errorHandler= (error, req, res, next)=>{
    return res.status(error.statusCode).send({errors: error.serializeErrors() });
}

module.exports= errorHandler;