'use strict'

require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')

// init middlerwares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({'extended': true}))

// init dbs
require('./dbs/init.mongodb')

// init router
app.use('/', require('./routers'))

// handle error
app.use((req, res, next) => {
    const error = new Error('Not Fount')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
})

module.exports = app