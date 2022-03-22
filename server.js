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
    // const data = req.body;
    const {user, mail, pass} = req.body;
    db.query('SELECT username FROM userdata WHERE username = ?', [user],async (error,results)=>{
        if(error){
            console.log("error found while checking for duplicate usernames\nError: " + error);
        }

        if(results.length > 0){

            console.log("username already exists");

        }
        else{
            let hashedpass = await bcrypt.hash(pass, 10);
            console.log(hashedpass)
            db.query('INSERT INTO userdata SET ?', {username: user, password: hashedpass}, (error,results)=>{

                if(error){
                    console.log("user couldnt be created\nError: " + error);
                }

                else{
                    console.log("user created"); //user created!
                    //now we fetch user data from db and send back to unity in json format so it can showcase the data to user
                    //since nodejs allows us to send response header only once so i thought lets send all valuable results to unity in json so it can access it easily

                    //fetching username and sending back
                    return res.json({userobject:user , status: 'user created'});
                
                             
                    
                }
            })
        }

    

    });

         
});

app.post('/login', async(req,res) =>{

    res.send("login Hello")
    const {user,pass} = req.body;

    db.query('SELECT username FROM userdata WHERE username = ?', [user],async (error,results)=>{

        if(error){
            console.log("error checking username from database\nError: " + error);
        }

        if(results.length > 0){
            // console.log(results) //prints username
            db.query('SELECT * FROM userdata WHERE username = ?', [user],async(error,results)=>{
               if(error){
                   console.log(error);
               }
               if(results == 0){
                   console.log("something went wrong with password checks");
               }
               else{
                   var stringres = JSON.stringify(results); //=> string
                   var jsonres = JSON.parse(stringres); //=> json object
                   var logpass = jsonres[0].password //=> password field from json object
                   console.log(logpass);
                   console.log(pass)
                   if(await bcrypt.compare(pass,logpass)){
                       console.log("signed in")
                   }
                   else{
                       console.log("password incorrect")
                   }
                //    console.log(loghashpass)


                   //TODO: Bcrypt gives diff hash every time for same input so find a way to authenticate user passwords
               }
            });
        }

        else{
            console.log("user not found");
        }

        
         
        











    });
});


app.listen(process.env.PORT, () => {
    console.log("Running on: " + "http://localhost:"+ process.env.port);
});

