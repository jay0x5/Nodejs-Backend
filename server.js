const express = require('express');
// const keys = require('./config/keys.js');
const mysql = require('mysql');
const dotenv = require('dotenv');
// const morgan = require('morgan');
// const mongoose = require('mongoose');
// const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config({path: './.env'})


const db = mysql.createConnection({
    host: process.env.HOST, //ip address of production server
    user: process.env.USER,
    password: '', //since its empty for now so nothing in env
    database: process.env.DATABASE 
});

db.connect( (error) =>{

    if(error){
        console.log(error);
    }

    else{
        console.log("Connected to the Mysql database");
    }


});


app = express();

// mongoose.connect(process.env.mongoURI,{useNewUrlParser: true}, () =>{

//     console.log("Connected to MongoDB");




// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.post('/register', async(req,res) =>{
    res.send("Hello nodemon op");
    // const data = req.body;
    const {user, mail, pass} = req.body;
    // console.log(user);
    // console.log(mail);
    // console.log(pass);
    db.query('SELECT username FROM userdata WHERE username = ?', [user],async (error,results)=>{
        // var resultArray = Object.values(JSON.parse(JSON.stringify(results)))
        let hashedpass = await bcrypt.hash(pass, 10);
        if(error){
            console.log("error found while checking for duplicate usernames\nError: " + error);
        }

        if(results.length > 0){

            console.log("username already exists");

        }
        else{
            db.query('INSERT INTO userdata SET ?', {username: user, password: hashedpass}, (error,results)=>{

                if(error){
                    console.log("user couldnt be created\nError: " + error);
                }

                else{
                    console.log("user created");
                }
            })
        }


        
        // console.log(hashedpass)

        


    });

         
});



app.listen(process.env.PORT, () => {
    console.log("Running on: " + "http://localhost:"+ process.env.port);
});

