const jwt_decode = require('jwt-decode')
const utilityFunctions = require('../../utility/utilityFunctions')
const fs = require('fs')
const shortid = require('shortid');


const addHeatMap = (req,res) => {

    const {userid,token} = req.headers
    const {heatMapName }= req.body

    const parsedToken = jwt_decode(token)

    fs.readFile('../db/users.json', (err,data) => {

        if(err) {
            res.status(400).json("bad request")
            return
        }

        let userData = JSON.parse(data.toString())

        if(!utilityFunctions.checkDuplicateUser(userData.users,parsedToken.email)) {
            fs.readFile('../db/heatMapsUsers.json', (err,dataLocation) => {
                let locationData = JSON.parse(dataLocation.toString())

                if(locationData[`${userid}`]) {
                    locationData[`${userid}`].push({heatMapName : heatMapName, heatMapId : shortid.generate()})
                } else {
                    locationData[`${userid}`] = []
                    locationData[`${userid}`].push({heatMapName : heatMapName, heatMapId : shortid.generate()})
                }

                fs.writeFile('../db/heatMapsUsers.json',JSON.stringify(locationData) ,(err,result) => {
                    if(err) {
                        console.log("gone dowm")
                    }

                    if(result) {
                        console.log("sucess")
                    }

                   })
            })
        } else {
            res.status(401).json("not authorized")
            return 
        }})
        res.status(200).json("Heat Map added")
        return 
 
}

exports.addHeatMap = addHeatMap