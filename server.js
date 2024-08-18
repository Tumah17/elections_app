const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const app = express();






const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./election.db')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public" ));
app.set('view engine' , 'ejs');

db.serialize(() =>{
    db.run('CREATE TABLE IF NOT EXISTS roles(id INT AUTO_INCREMENT PRIMARY KEY , role TEXT NOT NULL)')
    db.run('CREATE TABLE IF NOT EXISTS auth(id INT AUTO_INCREMENT PRIMARY KEY , username TEXT NOT NULL, password TEXT NOT NULL, user_id INT)')
    db.run('CREATE TABLE IF NOT EXISTS user(id INT AUTO_INCREMENT PRIMARY KEY , first_name TEXT NOT NULL , middle_name TEXT NOT NULL , last_name TEXT NOT NULL , dob DATE NOT NULL , photo BLOB)')
    db.run('CREATE TABLE IF NOT EXISTS parties(id INT AUTO_INCREMENT PRIMARY KEY , party TEXT NOT NULL, party_logo TEXT NOT NULL)')
    db.run('CREATE TABLE IF NOT EXISTS position(id INT AUTO_INCREMENT PRIMARY KEY , position TEXT NOT NULL )')
    db.run('CREATE TABLE IF NOT EXISTS candidates(id INT AUTO_INCREMENT PRIMARY KEY , first_name TEXT NOT NULL , middle_name TEXT NOT NULL , last_name TEXT NOT NULL , position_id INT AUTO_INCREMENT  , party_id INT AUTO_INCREMENT  , photo BLOB  )')
    db.run('CREATE TABLE IF NOT EXISTS votes(id INT AUTO_INCREMENT PRIMARY KEY , candidate_id INT AUTO_INCREMENT  , vote INT AUTO_INCREMENT  )')
    
    app.post('/voter_reg.ejs' , (req , res) =>{
        console.log(req.body);
        const {first_name, middle_name, last_name, Date_of_Birth }=req.body;

        db.run(`INSERT INTO user(first_name , middle_name , last_name , dob) VALUES (?, ?, ?, ?)`,
            [first_name , middle_name , last_name, Date_of_Birth],
            function (err) {
                if (err){
                    console.error(err.message);
                    return res.status(500).send("database error");
                }
                console.log("Data inserted");
                res.redirect('dashboard');
            }

        )
    })

    
    db.each('SELECT * FROM auth' , (err , row) =>{
        console.log(row)
    })
})




// db.close();




app.get('/' , (req , res) =>{
    res.render("voter_reg.ejs");

})



app.get('/dashboard' , (req , res) =>{
    res.render("dashboard.ejs");

})




app.listen(5000, () =>{
    console.log('The server is listening at port 5000');
})


