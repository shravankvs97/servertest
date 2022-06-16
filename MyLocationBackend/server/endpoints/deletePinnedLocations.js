const utilityFunctions = require('../../utility/utilityFunctions')
const jwt_decode = require('jwt-decode')
const fs = require('fs')
const shortid = require('shortid');



const deletePinnedLocation = (req,res) => {

    const {userid, token,locationid} = req.headers


    const parsedToken = jwt_decode(token)
    
    if(userid !== " " && token !== " " && locationid !== " ") {

        fs.readFile('../db/users.json', (err,data) => {

            if(err) {
                res.status(400).json("bad request")
                return
            }
    
            let userData = JSON.parse(data.toString())


        if(!utilityFunctions.checkDuplicateUser(userData.users,parsedToken.email)) {

            fs.readFile('../db/pinnedlocations.json', (err,dataLocation) => {
                
                if(err) {
                    res.status(500).json("internal server error")
                    return
                }   
                
                let locationData = JSON.parse(dataLocation.toString())
                if(locationData[`${userid}`].length === 0 || locationData[`${userid}`] == undefined) {
                    res.status(404).json("No such location found")
                    return
                }

                
                

              let arr =  locationData[`${userid}`].filter(function(loc) {
                    if(loc.locationid) {
                        if(loc.locationid !== locationid) {
                                return loc
                        }
                    } else {
                    return loc
                    }
                })

                fs.readFile('../db/locationAction.json',(err,maintainceDate)=> {
                    let maintainceLocationData = JSON.parse(maintainceDate.toString()) 
                    if(maintainceLocationData[`${userid}`]) {
                        maintainceLocationData[`${userid}`].filter(x=> x.locationid === locationid).map(x=> {
                            let a2 =  new Date().toLocaleString({ timeZone: 'Asia/Kolkata' })
            
                            let b2 =a2.replace(" ", "T")
                            let a5 = b2.replace(",",'')
                            let obj = {
                                action : "deleted",
                                timeStamp : a5
                            }

                            x.historyOfActions.push(obj)
                        })

                        fs.writeFile('../db/locationAction.json',JSON.stringify(maintainceLocationData) ,(err,result) => {
                                   if(err) {
                                       console.log("gone dowm")
                                   }
               
                                   if(result) {
                                       console.log("sucess")
                                   }
        
                                  })

                               
                    


                    } else {
                        res.status(500).json("internal server error")
                        return
                    }
                //    maintainceLocationData[`${userid}`] = []
                //       maintainceLocationData[`${userid}`].push({locationid : locationid, historyOfActions : [{action : "created", timeStamp : a5}]})
                //       console.log(maintainceDate)
                //       fs.writeFile('../db/locationAction.json',JSON.stringify(maintainceLocationData) ,(err,result) => {
                //        if(err) {
                //            console.log("gone dowm")
                //        }
   
                //        if(result) {
                //            console.log("sucess")
                //        }

                //       })
                   
               })
                
                


                console.log("modifed",arr)
                locationData[`${userid}`] = arr
                console.log("final data",locationData)
                fs.writeFile("../db/pinnedlocations.json", JSON.stringify(locationData),(err,result) => {

                    if(err) {
                        res.status(500).json("internal server error")
                    }
                
                })
                res.status(200).json("location successfully deleted")
                
            })
            
        } else {

        res.status(401).json("user not found")
        return
        }

        })


    } else {
        res.status(400).json("Bad request")
        return
    }


}

exports.deletePinnedLocation = deletePinnedLocation;