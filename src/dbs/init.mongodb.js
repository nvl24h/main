'use strict'

const mongoose = require('mongoose')
const { checkCountConnect } = require('../helpers/check.connect')
const {db : {host, port, name}} = require('../configs/init.config')

const connectString = `mongodb://${host}:${port}/${name}`

class Database {
    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {
        if(1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }

        mongoose.connect(connectString)
            .then( _ => {
                console.log('Connect Mongodb Success', checkCountConnect());
            }).catch((err) => {
                console.log('Connect Mongodb Error', err);
            });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const MongodbInstance = Database.getInstance()
module.exports = MongodbInstance