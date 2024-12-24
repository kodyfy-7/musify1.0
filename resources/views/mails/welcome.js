module.exports = (name, email, password, loginLink, dashboardLink) => {
    return {
        body: {
            name: name,
            intro: [
                `<p style="font-size: 14px;">We're thrilled to welcome you to our online training program!</p>`,
                `<p style="font-size: 14px;">You have taken an exciting step towards advancing your knowledge and skills in the banking industry, and we are delighted to have you on board.</p>`,
                `<p style="font-size: 14px;">We have created a user account for you to start learning with us.</p>`,
                `<p style="font-size: 14px;"><strong>About Service School House</strong></p>`,
                `<p style="font-size: 14px;">Service School House's library of courses provides you with the skills and knowledge needed to excel in your role within the organization. These self-paced courses can be taken at any time and anywhere. Our goal is to upskill you to deliver outstanding service!</p>`,
                `<p style="font-size: 14px;"><strong>To log in and start learning, click the link below using the log-in details provided:</strong></p>`,
                `<p style="font-size: 14px;">
                <ul>
                    <li>URL Link: ${loginLink}</li>
                    <li>Username: ${email}</li>
                    <li>Password: ${password}</li>
                </ul></p>`,
                `<p style="font-size: 14px;">Check your dashboard (<a href="${dashboardLink}">Dashboard</a>) to see some of the courses assigned to you. We have carefully curated a series of courses covering essential topics needed for you to succeed at the bank.</p>`,
                `<p style="font-size: 14px;">So, let's get started!</p>`
            ],
            outro: [
                `<p style="font-size: 14px;"><strong>Join the WhatsApp Group and Get Real-Time Updates</strong></p>`,
                `<p style="font-size: 14px;">Join the Service School House WhatsApp group for your cohort to get the latest updates, special announcements, and all the assistance needed to excel in your courses.</p>`,
                `<p style="font-size: 14px;"><a href='https://chat.whatsapp.com/Bc88ir15WlyF6JQseJnOqy'>Click here to join the WhatsApp group now</a>.</p>`,
                `<p style="font-size: 14px;"><strong>Need Help?</strong></p>`,
                `<p style="font-size: 14px;">We are here to support you every step of the way, so please don't hesitate to reach out to us if you have any questions or concerns. You can reach us via email at support@serviceschoolhouse.com.</p>`,
                `<p style="font-size: 14px;">To make sure you keep getting these emails, please add support@serviceschoolhouse.com to your address book or whitelist us.</p>`,
                `<p style="font-size: 14px;">Thank you for joining us on this exciting journey. We look forward to seeing you succeed!</p>`,
                `<p style="font-size: 14px;">Warm Regards.</p>`
            ]
        }
    };
};
