'use strict'

const { BadRequestError } = require("../core/error.reponse")
const { SuccessReponse } = require("../core/success.reponse")
const { uploadFromImageUrl, uploadFromImageLocal, uploadFromImageFile } = require("../services/upload.service")

class UploadController {

    static uploadFile = async (req, res, next) => {
        new SuccessReponse({
            message: 'uploadFile Success',
            metadata: await uploadFromImageUrl()
        }).send(res)
    }

    static uploadFileThumb = async (req, res, next) => {
        const {file} = req
        if(!file) {
            throw new BadRequestError(`File missing:: ${file}`)
        }

        new SuccessReponse({
            message: 'uploadFile Success',
            metadata: await uploadFromImageLocal({
                path: file.path
            })
        }).send(res)
    }

    static uploadFromImageFile = async (req, res, next) => {
        const {files} = req
        if(!files.length) {
            throw new BadRequestError(`File missing:: ${file}`)
        }

        new SuccessReponse({
            message: 'uploadFile Success',
            metadata: await uploadFromImageFile({
                files
            })
        }).send(res)
    }
  
}

module.exports = UploadController