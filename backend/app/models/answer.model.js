const BaseModel = require('../utils/base-model.js')
const Joi = require('joi')

module.exports = new BaseModel('Answer', {
    id:Joi.string(),
    type: Joi.string(),
    imageUrl:Joi.string(),
    value: Joi.string().required(),
    isCorrect: Joi.boolean().required(),
    questionId: Joi.number()
})