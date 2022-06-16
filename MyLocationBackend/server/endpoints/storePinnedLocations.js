const jwt_decode = require('jwt-decode')
const utilityFunctions = require('../../utility/utilityFunctions')
const fs = require('fs')
const shortid = require('shortid');
const { replace } = require('lodash');

const storePinnedLocations = (req,res) => {

    //console.log(req.headers)
    const {userid,token} = req.headers
    const {lat, lng, desc,address} = req.body
    console.log(token,"jjjj",userid)
    console.log(lat,lng,desc,address)
    

    const parsedToken = jwt_decode(token)
   // console.log("hellos",parsedToken)
    
    fs.readFile('../db/users.json', (err,data) => {

        if(err) {
            res.status(400).json("bad request")
            return
        }

        let userData = JSON.parse(data.toString())

        if(!utilityFunctions.checkDuplicateUser(userData.users,parsedToken.email)) {
            fs.readFile('../db/pinnedlocations.json', (err,dataLocation) => {
                let locationData = JSON.parse(dataLocation.toString())
                let a2 =  new Date().toLocaleString({ timeZone: 'Asia/Kolkata' })
                
                let b2 =a2.replace(" ", "T")
                let a5 = b2.replace(",",'')
                console.log(a5)
                let locationid =  userid + shortid.generate()
                if(locationData[userid]) {
                    locationData[`${userid}`].push({address : address,lat : lat,lng : lng, desc : desc , locationid : locationid})
                    fs.readFile('../db/locationAction.json',(err,maintainceDate)=> {
                         let maintainceLocationData = JSON.parse(maintainceDate.toString()) 
                         if(maintainceLocationData[`${userid}`]) {
                            maintainceLocationData[`${userid}`].push({locationid : locationid, historyOfActions : [{action : "created", timeStamp : a5}]})
                           
                         } else {
                        maintainceLocationData[`${userid}`] = []
                        maintainceLocationData[`${userid}`].push({locationid : locationid, historyOfActions : [{action : "created", timeStamp : a5}]})
                           
                         }
                           console.log(maintainceDate)
                           fs.writeFile('../db/locationAction.json',JSON.stringify(maintainceLocationData) ,(err,result) => {
                            if(err) {
                                console.log("gone dowm")
                            }
        
                            if(result) {
                                console.log("sucess")
                            }

                           })
                        
                    })
                } else {
                    locationData[`${userid}`] =[]
                    locationData[`${userid}`].push({address : address, lat : lat, lng : lng,desc : desc , locationid : locationid })
                   
                    fs.readFile('../db/locationAction.json',(err,maintainceDate)=> {
                        let maintainceLocationData = JSON.parse(maintainceDate.toString()) 
                        if(maintainceLocationData[`${userid}`]) {
                            maintainceLocationData[`${userid}`].push({locationid : locationid, historyOfActions : [{action : "created", timeStamp : a5}]})
                           
                         } else {
                        maintainceLocationData[`${userid}`] = []
                        maintainceLocationData[`${userid}`].push({locationid : locationid, historyOfActions : [{action : "created", timeStamp : a5}]})
                           
                         }
                          fs.writeFile('../db/locationAction.json',JSON.stringify(maintainceLocationData) ,(err,result) => {
                           if(err) {
                               console.log("gone dowm")
                           }
       
                           if(result) {
                               console.log("sucess")
                           }

                          })
                       
                   })
                
                }
                fs.writeFile("../db/pinnedlocations.json", JSON.stringify(locationData),(err,result) => {
                    if(err) {
                        console.log("gone dowm")
                    }

                    if(result) {
                        console.log("sucess")
                    }
                })
            
            })
        }
    
    
    
    })


    res.status(200).json("hello")
    return
    
}

exports.storePinnedLocations = storePinnedLocations;