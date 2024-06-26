'use strict'

const {createLogger, format, transports} = require('winston')
require('winston-daily-rotate-file')

class MyLogger {
    constructor() {
       const formatPrintf = format.printf(({level, message, context, requestId, timestamp, metadata}) => {
            return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}`
       })

       this.logger = createLogger({
            format: format.combine(
                format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                formatPrintf
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.DailyRotateFile({
                    level: 'info',
                    dirname: 'src/logs',
                    filename: 'application-%DATE%.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: false, // true backup lai truo khi xoa 
                    maxSize: '20m', // dung luong file
                    maxFiles: '30d', // neu dat thi se xoa logs trong 30 ngay
                    format: format.combine(
                        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                        formatPrintf
                    )
                }),
                new winston.transports.DailyRotateFile({
                    level: 'error',
                    dirname: 'src/logs',
                    filename: 'application-%DATE%.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: false, // true backup lai truo khi xoa 
                    maxSize: '20m', // dung luong file
                    maxFiles: '30d', // neu dat thi se xoa logs trong 30 ngay
                    format: format.combine(
                        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                        formatPrintf
                    )
                }),
            ]
       })
       
    }

    log(message, params) {
        const logObject = Object.assign({message}, params)
        this.logger.info(logObject)
    }

    error(message, params) {
        const logObject = Object.assign({message}, params)
        this.logger.error(logObject)
    }
}

module.exports = new MyLogger()