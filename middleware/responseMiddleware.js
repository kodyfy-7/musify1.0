const axios = require('axios');

const errorResponseb = async (reres, message = null, error = null, statusCode) =>  {
    if (statusCode !== 500) {
        return res.status(statusCode).send({
            success: false,
            message,
        });
    }
}
async function errorResponse(res, message = null, error = null, statusCode = 400) {
    if (statusCode !== 500) {
        return res.status(statusCode).send({
            success: false,
            message,
        });
    }

    if (process.env.NODE_ENV === 'production') {
        try {
            await axios.post('YOUR_SLACK_WEBHOOK_URL', {
                headers: {
                    'Content-type': 'application/json',
                },
                json: {
                    attachments: [
                        {
                            color: 'danger',
                            text: '*Service School House*',
                            fields: [
                                {
                                    title: 'Message',
                                    value: error.message,
                                },
                            ],
                        },
                    ],
                },
            });
            return res.status(statusCode).send({
                success: false,
                message: error.message,
            });
        } catch (notificationError) {
            console.error('Error sending notification to Slack:', notificationError);
        }
    } else {
        return res.status(statusCode).send({
            success: false,
            message: 'An error occurred, please try again later.',
        });
    }
}

async function successResponse(data = null, message = null, statusCode) {
    return res.status(statusCode).send({
        success: true,
        data,
        message,
    });
}

module.exports = {
    errorResponse,
    successResponse
};