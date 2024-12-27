//using database to generate fake data and using node js create route
const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodoverride = require("method-override");
const { v4: uuidv4 } = require('uuid');

app.use(methodoverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "delta_app",
    password: "Vadoliya@123"
})

let getrandomuser = () => {
    return [
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password(),
    ];
};

// let q = "INSERT INTO user1 (id,username,email,password) VALUES ?";

// let data = [];
// for(let i = 0 ; i < 100 ; i++){
//     data.push(getrandomuser());//1000 fake user na data mate
// }

// try{
//    connection.query(q,[data],(err,result)=>{
//       if (err) throw err;
//       console.log(result);
//    });
// }catch(err){
//     console.log(err);
// }

// connection.end();

let port = 8000;

//home route
app.get("/", (req, res) => {
    let q = "SELECT count(*) FROM user1";
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let count = result[0]["count(*)"];
            res.render("home.ejs", { count });
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

//show user route
app.get("/user", (req, res) => {
    let q = "SELECT * FROM user1";
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let show = result;
            res.render("show.ejs", { show });
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
})

//edit route
app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user1 WHERE id='${id}'`;

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];//means id lidhu
            res.render("edit.ejs", { user });
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
})

//update route
app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password: formpass, username: newusername } = req.body;//step 2 password pela get karyo body mathi enter karelo user e
    let q = `SELECT * FROM user1 WHERE id='${id}'`;

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];//first user ni details get kari
            if (formpass != user.password) {//step 2 bannne passwrod check karya
                res.send("WRONG PASSWORD");
            } else {
                let q2 = `UPDATE user1 SET username = '${newusername}' WHERE id = '${id}'`;//new user name set karse id par thi jo password banne same hase to
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect("/user");
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
})

//add route first from create
app.get("/user/new", (req, res) => {
    res.render("form.ejs");
});
//from throught come this 
app.post("/user/add", (req, res) => {
    let { email, username, password } = req.body;
    let id = uuidv4();
    let q = `INSERT INTO user1 (id,email,username,password) VALUES ('${id}','${email}','${username}','${password}')`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            console.log("Added new user");
            res.redirect("/user");
        });
    } catch (err) {
        console.log(err);
        res.send("some error accur");
    }
});

//delete route//uder ni delete karva mate pela enu id kadhyu ne pachi delete.ejs ne rendor karavi
app.get("/user/:id/delete", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user1 WHERE id = '${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("delete.ejs", { user });
        })
    } catch (err) {
        console.log(err);
        res.send("The Wrong information");
    }
});

//tema pela aapde id kadhi ne teno password je user e enter karelo and data base na password ne match karyo banne same hase to delete or error aave 

app.delete("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password } = req.body;
    let q = `SELECT * FROM user1 WHERE id = '${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if (user.password != password) {
                res.send("Wrong Password");
            } else {
                let q2 = `DELETE FROM user1 WHERE id='${id}'`;
                connection.query(q2,(err,result)=>{
                    if (err) throw err;
                    else{
                        res.redirect("/user");
                    }
                });
            }
        });
    }catch(err){
        res.send("some error in database");
    }

})

app.listen(port, () => {
    console.log("server listening to port 8000");
})

