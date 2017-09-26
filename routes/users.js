'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const knex = require('../knex')

router.post('/users', function(req, res, next) {
  const b = req.body
  console.log(b);

  knex('users')
    .insert({
      id: 2,
      first_name: b.first_name,
      last_name: b.last_name,
      email: b.email,
      hashed_password: b.password
    })
    .then(() => {
      res.body({id})
      res.sendStatus(200)
    })
    .catch((err) => next(err))
})

module.exports = router;
