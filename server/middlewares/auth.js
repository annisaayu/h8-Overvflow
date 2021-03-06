const jwt = require('jsonwebtoken')

module.exports={
    authentication(req,res,next){
        console.log(req.headers)
        let {token} = req.headers
        jwt.verify(token, process.env.secret,(err,decoded)=>{
            if(err){
                res.status(400).json({
                    message:'sorry you\'re not the user'
                })
            }
            if(decoded){
                req.headers.decoded = decoded
                next()
            }
        })
    }, 
    authorization(req,res,next){
        if(req.headers.decoded.role=='admin'){
            next()
        }else{
            res.status(400).json({
                message:'you can\'t access this site'
            })
        }
    }
}