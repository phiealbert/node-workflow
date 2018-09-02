const express = require('express');
const router = express.Router();
const pg = require('pg');
const {User} = require('../models/user.js');
const { 
    getUserID
} = require('../query');

router.get('/addUser/:name/:password', async(req, res) => {
    const name = req.params.name;
    const password = req.params.password;

    if(name.length < 4)
        return res.status(400).send("Minimum character of name is 4");

    if(password.length < 6)
        return res.status(400).send("Password must be greater than 5");

    const user = new User({
        name: req.params.name,
        password: req.params.password
    });

    try {
        await user.save();    
    } catch (error) {
        console.log(error);
        res.send("Cannot save user");
    }
    
    return res.send(user);
});

router.get('/auth/:name/:password', async(req, res) => {
    const user = await User.find({ name: req.params.name, password: req.params.password })
                    .limit(1)
                    .select({name: 1});

    if(user.length == 0)
        return res.status(404).send("Invalid username/password");
    
    res.send(user);

    /*
    var query = getUserID;
    var uid = [user[0]._id];

    const pool = new pg.Pool({
        user: process.env.DB_User,
        host: process.env.host,
        database: process.env.database,
        password: process.env.password,
        port: process.env.DB_PORT,
    });

    pool.connect((err) => {
        if(err) 
            return console.error('could not connect to postgres', err);
        
        pool.query(query, uid, (err, result) => {
            if(err) return console.error('error running query', err);

            console.log("Result:"+result.rows)

            if(result.rows.length == 0)
                res.send("Please setup user between taowi and node");
            else
                res.send(result.rows);
            pool.end();
        });
    })
    */
});

module.exports = router; 