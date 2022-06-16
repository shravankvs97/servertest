const jwt_decode = require('jwt-decode')
const fs = require('fs')
const utilityFunctions = require('../../utility/utilityFunctions')

const getPinnedLocations = (req,res) => {

    const {token,userid} = req.headers

    const parsedToken = jwt_decode(token)
    

    fs.readFile('../db/users.json', (err,data) => {

        if(err) {
            res.status(400).json("bad request")
            return
        }

        let userData = JSON.parse(data.toString())
        if(!utilityFunctions.checkDuplicateUser(userData.users,parsedToken.email)) {
            fs.readFile('../db/pinnedlocations.json', (err,dataLocation) => {
                
                let locationsData = JSON.parse(dataLocation.toString())

                if(locationsData[`${userid}`]) {
                    res.status(200).json({locations : locationsData[`${userid}`]})
                } else {
                    res.status(201).json({locations : []})
                }


            })
        }

    })


}

exports.getPinnedLocations = getPinnedLocations;