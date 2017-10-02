'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
const knex = require('../knex')
let jwt = require('jsonwebtoken')
let cp = require('cookie-parser')
let bcrypt = require('bcrypt')

router.use(cp())

router.get('/token', function(req, res, next) {
  let token = req.cookies.token
  // is there a token?
  jwt.verify(token, 'cookiez?', function(err, decoded) {
    if (decoded) {
    res.send(true)
    }
    else {
    res.send(false)
    }
    return res.status(200)
  })
})

router.post('/token', function(req, res, next) {
  // does email match?
  knex('users')
    .select('id', 'email', 'hashed_password', 'first_name', 'last_name')
    .where('email', req.body.email)
    .then((items) => {
      if (items.length < 1) {
        res.setHeader('Content-Type', 'text/plain')
        res.status(400)
        return res.send('Bad email or password')
      }
      // testing to see if password is a match
      bcrypt.compare(req.body.password, items[0].hashed_password, function(err, test) {

        if (test == true) {
          const response = {
            id: items[0].id,
            email: items[0].email,
            firstName: items[0].first_name,
            lastName: items[0].last_name,
            userId: items[0].id
          }
          // set cookie token?
          let token = jwt.sign({  "email": req.body.email, "password": req.body.password, "userId": items[0].id }, 'cookiez?')
          res.cookie('token', token, {httpOnly: true})
          res.setHeader('Content-Type', 'application/json')
          res.status(200)
          return res.send(response)
        }
        else {
          res.setHeader('Content-Type', 'text/plain')
          res.status(400)
          res.send('Bad email or password')
        }
      })
    })
})

router.delete('/token', function(req, res, next) {
  let token = req.cookies.token
  token = ''
  res.cookie('token', token, {httpOnly: true})
  res.status(200)
  res.send(true)
})


module.exports = router;
