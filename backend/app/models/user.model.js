const Joi = require('joi')
const BaseModel = require('../utils/base-model.js')

module.exports = new BaseModel('User', {
    id:Joi.string(),
    name: Joi.any(),
    surname: Joi.string(),
    age: Joi.number(),
    sexe: Joi.string(),
    description: Joi.string(),
    img: Joi.string()
})
