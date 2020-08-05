const express = require('express')
const images = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _ = require('lodash');
const Image = require('../models/Image')
const { result } = require('lodash')

images.use(cors())

process.env.SECRET_KEY = 'secret'

images.post('/add', (req, res) => {

    const user_id = req.body.user;

    const imageData = {
        name: req.body.name,
        url: req.body.url
    }
    
    Image.getIdImageByName(imageData.name, function(err, row) {
        if (err) res.json(err);
        const image_id = _.get(row[0], 'id', 0);
        
        if(image_id) {
            
            Image.findImageUser(image_id, user_id, function(err, results) {
                if (err) res.json(err);
                console.log(results[0].image_id, results[0].user_id);
                if ((image_id === results[0].image_id) && (user_id === results[0].user_id)) 
                {   
                    console.log("abc");
                    res.json("Duplicate");
                    return;
                }
            })
            Image.addImageUser(image_id, user_id, function(err,row){
                if (err) res.json(err);
                res.json("Added")
            });
        }
        else {
            Image.addImage(imageData, function(err, results) {
                if (err) res.json(err);
                const insertedId = results.insertId;

                Image.addImageUser(insertedId, user_id, function(err){
                    if (err) res.json(err);
                    res.json("Added");
                });
            })
        }
    })
     
})

images.get('/list', (req, res) => {

    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
    var user_id = decoded.id;
    Image.getAllImageByUserId(user_id, function(err, rows) {
        if (err) res.json(err);
        res.json(rows);
    })
   
})


module.exports = images