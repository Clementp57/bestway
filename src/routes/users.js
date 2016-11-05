var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../models/User.js');

// Benchmark test
// router.post('/' , function(req, res) {
//     console.log("request body:", req.body);
//     var user = new User(req.body);
//     user.save(function(error, user) {
//       console.log('done saving user :', user);
//       res.status(200).json({
//         msg: 'done'
//       });
//     });
// });

/* GET /users listing. */
router.get('/', (req, res) => {
    // http://mongoosejs.com/docs/api.html#query_Query-find
    User.find(function(err, users) {
        res.status(200).json(users);
    });
});

/* POST /users  */
router.post('/',(req, res) => {
    var user = new User(req.body);
    user.id = user._id;
    // http://mongoosejs.com/docs/api.html#model_Model-save
    user.save((err) => {
        res.json(200, err);
    });
});

/* GET /users/id */
router.get('/:id', (req, res) => {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    User.findById(req.params.id, (err, user) => {
        res.json(200, user);
    });
});
/* PUT /users/id */
router.put('/:id', (req, res) => {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    User.findById(req.params.id, (err, user) => {
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        // http://mongoosejs.com/docs/api.html#model_Model-save
        user.save((err, user) => {
            res.json(200, user);
        });
    });
});
/* DELETE /users/id */
router.delete('/:id', (req, res) => {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    User.findById(req.params.id, (err, user) => {
        // http://mongoosejs.com/docs/api.html#model_Model.remove
        user.remove((err, user) => {
            res.json(200, {
                msg: 'OK'
            });
        });
    });
});


module.exports = router;
