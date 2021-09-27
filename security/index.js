// Created by Kieran Watson

const { text } = require("body-parser");
const crypto = require('crypto');

const Security = {

    /**
     * encrypt will encypt a given string
     * The return a hash which is a JS object with the encrypted content and the Initialization vector.
     * @param {*} text - A string which needs to be encrypted
     * @param {*} algorithm - A Crypto approved algorhtyim 
     * @param {*} secretKey - a key used for the encryption
     */
    encrypt: (text, algorithm, secretKey) => {
        let iv = crypto.randomBytes(16);   
        let cipher = crypto.createCipheriv(algorithm, secretKey, iv);
        let encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex')
        };
    },

    /**
     * Decrypt will decrypt a given hash
     * The return will be a decrypted string of the given hash.
     * @param {*} hash - a JS object with a IV and encrypted contents
     * @param {*} algorithm - A Crypto approved algorhtyim 
     * @param {*} secretKey - a key used for the encryption
     */
    decrypt: (hash, algorithm, secretKey) => { 
        let decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
        let decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
        return decrpyted.toString();
    }
}

module.exports = Security;