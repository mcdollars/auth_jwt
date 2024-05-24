const Users = require("../models/users");
const jwt = require('jsonwebtoken')
require("dotenv").config()
const secret = process.env.JWT_SECRET
const router = require("express").Router();

router.post('/login', async (req, res) => {
  const {username, password} = req.body
  if(!username || !password) {
    return res.status(401).send('Username or password not present')
  }
  const user = await Users.findOne({ where: { username, password } })
  if(!user) {
    return res.status(401).send('Invalid username or password')
  }
  const date = new Date()
  const token = jwt.sign({username: user.username, timestamp: date}, secret)
  await Users.update({token}, {where: {id: user.id}})
  return res.status(200).send({token})
})

router.post('/validate', async(req, res) => {
  const token = req.body.token;
  try {
    const decoded = jwt.verify(token, secret)
    const user = await Users.findOne({ where: { username: decoded.username }})
    if (user.token !== token) {
      res.status(401).send('Old token')
    } else {
      res.status(200).send({username: decoded.username})
    }
  } catch {
    res.status(401).send('Invalid or expired token')
  }
})

module.exports = router;