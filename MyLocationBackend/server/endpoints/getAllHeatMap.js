const jwt_decode = require('jwt-decode')
const utilityFunctions = require('../../utility/utilityFunctions')
const fs = require('fs')



const getAllHeatMaps = (req,res) => {

    const {userid,token} = req.headers
   
console.log("jjj")
    const parsedToken = jwt_decode(token)

    fs.readFile('../db/users.json', (err,data) => {

        if(err) {
            res.status(400).json("bad request")
            return
        }

        let userData = JSON.parse(data.toString())
        console.log("jjji am in server")
        if(!utilityFunctions.checkDuplicateUser(userData.users,parsedToken.email)) {
            fs.readFile('../db/heatMapsUsers.json', (err,dataLocation) => {
                if(err) {
                    res.status(500).json("interal server error")
                    return
                }

                let locationData = JSON.parse(dataLocation.toString())

                let arr = locationData[`${userid}`]
                
             
                
                res.status(200).json(arr)
                return 

              
                   
            })
        } else {
            res.status(401).json("not authorized")
            return 
        }})
       
 
}

exports.getAllHeatMaps = getAllHeatMaps