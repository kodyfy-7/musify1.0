const Joi = require('joi');

const validatePaye = () => {
    return Joi.object().keys({
    batchRef: Joi.string().required(),
    totalAmount: Joi.number().required(),
    sourceAccount: Joi.string().required(),
    sourceBankCode: Joi.string().required(),
    details: Joi.array().items(Joi.object().keys({
        transactionRef: Joi.string().required(),
        company: Joi.string().required(),
        staffNumber: Joi.string().required(),
        staffName: Joi.string().required(),
        beneficiaryName: Joi.string().required(),
        phone: Joi.string().required(),
        taxAmount: Joi.number().required(),
        tin: Joi.string().required(),
        taxState: Joi.string().required(),
        employeeCode: Joi.string().required(),
        transactionMonth: Joi.string().required(),
        period: Joi.string().required()
    })).required()
    });
}

const validatePension = () => {
    return Joi.object().keys({
        batchRef: Joi.string().required(),
        totalAmount: Joi.number().required(),
        sourceAccount: Joi.string().required(),
        sourceBankCode: Joi.string().required(),
        details: Joi.array().items(Joi.object().keys({
            transactionRef: Joi.string().required(),
            company: Joi.string().required(),
            beneficiarySurname: Joi.string().required(),
            beneficiaryOtherName: Joi.string().required(),
            amount: Joi.number().required(),
            employeeContribution: Joi.number().required(),
            employerContribution: Joi.number().required(),
            voluntaryContribution: Joi.number().required(),
            pfaCode: Joi.string().required(),
            pfaCode: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().required(),
            customerId: Joi.string().required(),
            transactionMonth: Joi.string().required(),
            period: Joi.string().required()
        })).required()
    });
}

const validateVat = () => {
    return Joi.object().keys({
        batchRef: Joi.string().required(),
        totalAmount: Joi.number().required(),
        sourceAccount: Joi.string().required(),
        sourceBankCode: Joi.string().required(),
        details: Joi.array().items(Joi.object().keys({
        transactionRef: Joi.string().required(),
        tin: Joi.string().required(),
        payerName: Joi.string().required(),
        contractDate: Joi.string().required(),
        taxAmount: Joi.number().required(),
        taxState: Joi.string().required(),
        phone: Joi.string().required(),
        company: Joi.string().required(),
        transactionDate: Joi.string().required()
        })).required()
    });
}
  
module.exports = {
    validatePaye,
    validatePension,
    validateVat
}