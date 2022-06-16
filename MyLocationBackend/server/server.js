const jsonServer = require("json-server");
const bodyParser = require("body-parser");
const shortid = require("shortid");
const fs = require("fs");
const userdb = JSON.parse(fs.readFileSync("../db/users.json", "utf-8"));
const utilityFunctions = require("../utility/utilityFunctions");
const server = jsonServer.create();
const addOktaUserMethod = require("../server/endpoints/addOktaUser");
const { conformsTo } = require("lodash");
const storePinnedLocations = require("../server/endpoints/storePinnedLocations");
const getPinnedLocations = require("../server/endpoints/getPinnedLocations");
const deletePinnedLocation = require("../server/endpoints/deletePinnedLocations");
const editPinnedLocation = require("../server/endpoints/editPinnedLocation");
const addHeatMap = require("./endpoints/addHeatMap");
const getAllHeatMaps = require("../server/endpoints/getAllHeatMap");

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(jsonServer.defaults());

server.post("/signup", (req, res) => {
  const { email, password, firstName, lastName, registrationType } = req.body;
  if (
    email == "" ||
    password == "" ||
    firstName == "" ||
    lastName == "" ||
    registrationType == ""
  ) {
    res.status(400).json("Bad Request");
    return;
  }

  fs.readFile("../db/users.json", (err, data) => {
    let userData = JSON.parse(data.toString());
    let duplicateUser = utilityFunctions.checkDuplicateUser(
      userData.users,
      email
    );
    console.log(duplicateUser);
    if (!duplicateUser) {
      res.status(422).json("email already taken");
      return;
    }

    if (err) {
      res.status(401).json(err);
      return;
    }
    let obj = {
      userid: shortid.generate(),
      email: email,
      password: password,
      lastName: lastName,
      registrationType: registrationType,
      firstName: firstName,
    };
    userData.users.push(obj);
    let writeData = fs.writeFile(
      "../db/users.json",
      JSON.stringify(userData),
      (err, result) => {
        if (err) {
          res.status(401).json(err);
          return;
        }
      }
    );
    res.status(200).json("user registered successfully");
    return;
  });
});

server.post("/login", (req, res) => {
  let { email, password } = req.body;
  if (email === "" || password == "") {
    res.status(400).json("bad request");
    return;
  }

  fs.readFile("../db/users.json", (err, data) => {
    let userData = JSON.parse(data.toString());
    let checkUserExistsOrNot = utilityFunctions.checkDuplicateUser(
      userData.users,
      email
    );
    if (!checkUserExistsOrNot) {
      let checkPassword = utilityFunctions.checkPassword(
        userData.users,
        password
      );
      if (checkPassword) {
        let obj = userData.users.filter(function (user) {
          if (user.email == email) {
            return user;
          }
        });
        let userid = obj[0].userid;
        let lastname = obj[0].lastName;
        let registrationType = obj[0].registrationType;
        let token = utilityFunctions.createToken({
          email,
          password,
          userid,
          lastname,
        });
        let message = "user logged in";
        res
          .status(200)
          .json({ token, message, userid, lastname, registrationType });
        return;
      } else {
        res.status(401).json("wrong passowrd ");
      }
    } else {
      res.status(422).json("email not registered");
      return;
    }
  });
});

server.post("/addOktaUser", (req, res) => {
  addOktaUserMethod.addOktaUser(req, res);
});

server.post("/storePinnedLocation", (req, res) => {
  storePinnedLocations.storePinnedLocations(req, res);
});

server.get("/getPinnedLocations", (req, res) => {
  console.log("kk");
  getPinnedLocations.getPinnedLocations(req, res);
});

server.delete("/deletePinnedLocation", (req, res) => {
  deletePinnedLocation.deletePinnedLocation(req, res);
});

server.put("/editPinnedLocation", (req, res) => {
  editPinnedLocation.editPinnedLocation(req, res);
});

server.post("/addHeatMap", (req, res) => {
  addHeatMap.addHeatMap(req, res);
});

server.get("/getAllHeatMapsUser", (req, res) => {
  getAllHeatMaps.getAllHeatMaps(req, res);
});

server.listen(8000, () => {
  console.log("server is running");
});
