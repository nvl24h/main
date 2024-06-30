'use strict'

const cloudinary = require('../configs/cloudinary.config')

// 1. upload from image Url
const uploadFromImageUrl = async () => {
    const urlImage = 'https://product.hstatic.net/200000511439/product/prisident_96_e9efb48335aa4a92af19c5907cb7acbd_master.jpg'
    const folderName = 'product/9409', newFileName = 'testdemo'
    const result = await cloudinary.uploader.upload(urlImage, {
        public_id: newFileName,
        folder: folderName
    })

    return result
}

// 2. upload from image local
const uploadFromImageLocal = async ({path, folderName = 'product/9409'}) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            public_id: 'thumb',
            folder: folderName,
        })
    
        return {
            image_url: result.secure_url,
            shopId: 9409,
            thumb_url: await cloudinary.url(result.public_id, {
                height: 100,
                width: 100,
                format: 'jpg'
            })
        }
    } catch (error) {
        console.error('Error uploading image', error);
    }
}

// 2. uploading nhieeuf anh
const uploadFromImageFile = async ({files, folderName = 'product/9409'}) => {
    try {
        if(!files.length) {
            return
        }

        const uploadUrl = []

        for(const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: folderName,
            })

            uploadUrl.push(
                {
                    image_url: result.secure_url,
                    shopId: 9409,
                    thumb_url: await cloudinary.url(result.public_id, {
                        height: 100,
                        width: 100,
                        format: 'jpg'
                    })
                }
            )
        }
    
        return uploadUrl
        
    } catch (error) {
        console.error('Error uploading image', error);
    }
}



module.exports = {
    uploadFromImageUrl,
    uploadFromImageLocal,
    uploadFromImageFile
}