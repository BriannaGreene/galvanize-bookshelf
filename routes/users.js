'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const knex = require('../knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 10;

router.post('/:id', function(req, res, next) {
  const b = req.body
  const id = req.params.id

  bcrypt.hash(b.password, saltRounds, function(err, hash) {

    knex('users')
      .insert({
        // id: 2,
        first_name: b.firstName,
        last_name: b.lastName,
        email: b.email,
        hashed_password: hash
      })
      .returning('*')
      .then((user) => {
        const newUser = {
          id: user[0].id,
          firstName: user[0].first_name,
          lastName: user[0].last_name,
          email: user[0].email
        }
        res.setHeader('Content-Type', 'application/json')
        res.status(200)
        res.send(newUser)
      })
      .catch((err) => next(err))

  });

})

module.exports = router;
