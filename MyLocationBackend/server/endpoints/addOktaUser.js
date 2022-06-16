const jwt_decode = require('jwt-decode')
const utilityFunctions = require('../../utility/utilityFunctions')
const fs = require('fs')
const shortid = require('shortid');


const addOktaUser =(req,res) => {
    
        const {token} = req.body
        console.log(token   )
        const parsedToken = jwt_decode(token)
        console.log(parsedToken)
        let lastname
        let userid 
        let registrationType
        
        fs.readFile('../db/users.json', (err,data) => {

            if(err) {
                res.status(400).json("bad request")
                return
            }
           

            let userData = JSON.parse(data.toString())
            
            if(!utilityFunctions.checkDuplicateUser(userData.users,parsedToken.email)) {
                console.log("oo")
               
           
               userData.users.map(function(user) {
                   if(user.email == parsedToken.email) {
                    userid= user.userid
                    lastname = user.lastName
                    registrationType = user.registrationType

                       if(user.registrationType !== "openID-Okta" && user.registrationType !== "manual/openID-Okta") {
                       let appendString = "/openID-Okta"
                       user.registrationType = user.registrationType + appendString
                                             }
                       
                   }
                   return user
               })
               
                fs.writeFile('../db/users.json',JSON.stringify(userData),(err,result) =>{
                if(err) {
                    res.status(401).json(err)
                    return 
                }
               
            })
            res.status(200).json({userid,lastname,registrationType})
                  return
          
            } else {
                console.log("par")
                let name =  parsedToken.name.split(' ')
                let obj ={
                    userid : shortid.generate(),
                    email : parsedToken.email,
                    password : " ",
                    lastName : name[0],
                    registrationType : "openID-Okta",
                    firstName : name[1]
                }
                userid=obj.userid
                lastname=obj.lastName
                userData.users.push(obj)
                console.log(userData)
                let writeData = fs.writeFile('../db/users.json',JSON.stringify(userData),(err,result) =>{
                    if(err) {
                        res.status(401).json(err)
                        return 
                    }
                   
                })
                res.status(200).json({userid,lastname,registrationType})
                  return 
            }
        
        })

    //  res.status(200).json({userid})
    //  return 

}

exports.addOktaUser = addOktaUser