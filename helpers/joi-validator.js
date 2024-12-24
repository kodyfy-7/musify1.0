const Joi = require('joi');

const validate = (payload, schema) => {
    try {
        return Joi.attempt(payload, schema, {
        abortEarly: false,
        convert: true,
        stripUnknown: true,
        });
    } catch (errors) {
        return Promise.reject(modifyErrors(errors));
    }
}

  
const errorReducer = (accumulatedErrorObject, currentError) => {
    return Object.assign(accumulatedErrorObject, {
        [currentError.context.label || currentError.context.key]:
        currentError.message.replace(new RegExp('"', 'ig'), ''),
    });
}

const modifyErrors = (errors) => {
    return !errors.details
        ? errors.message
        : errors.details.reduce(errorReducer, {});
}

module.exports = {
    validate,
    errorReducer,
    modifyErrors
}