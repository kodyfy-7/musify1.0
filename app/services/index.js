const axios = require("axios");
const base64 = require('base-64');
const ServiceMap = require("../../config/serviceMap");
const zoomConfig = require("../../config/zoom");
const quizfunConfig = require("../../config/quizfun");

// Mautic OAuth2 Credentials
const clientId = ServiceMap.external.mauticClientId;
const clientSecret = ServiceMap.external.mauticClientSecret;
const apiUrl = ServiceMap.external.mauticApiUrl;

// OAuth2 Configuration
const oauthConfig = {
    clientId,
    clientSecret,
    tokenUrl: `${apiUrl}/oauth/v2/token`,
};

// Axios customized
const Axios = {
  call({ method, url, payload, request }) {
    return axios({
      method,
      url,
      data: payload,
      headers: {
        accept: "application/json"
      }
    });
  },
  post(url, payload, req) {
    const headers = { accept: "application/json" };

    if (req.headers.authorization) {
      headers.authorization = req.headers.authorization;
    }
    return axios.post(url, payload, { headers });
  },

  patch({ url, payload, req }) {
    const headers = { accept: "application/json" };

    if (req.headers.authorization) {
      headers.authorization = req.headers.authorization;
    }
    return axios.patch(url, payload, { headers });
  },

  get(req = null, url) {
    const headers = { accept: "application/json" };

    if (req.headers.authorization) {
      headers.authorization = req.headers.authorization;
      console.log(req.headers.authorization);
    }
    return axios.get(url, { headers });
  },

  delete(req, url) {
    return axios.delete(url, {
      headers: {
        accept: "application/json"
      }
    });
  }
};

const Service = {
    Mautic: {
        async getAccessToken() {
            try {
                const tokenResponse = await axios.post(oauthConfig.tokenUrl, {
                    grant_type: 'client_credentials',
                    client_id: oauthConfig.clientId,
                    client_secret: oauthConfig.clientSecret,
                });

                return tokenResponse.data.access_token;
            } catch (error) {
        console.error(error);
                const externalError = new Error(error.response.statusText);
                externalError.status = error.response.status;
                throw externalError;
            }
        },

        async getEmails(accessToken) {
            try {
                const response = await axios.get(`${apiUrl}/api/emails?orderBy=dateAdded&orderByDir=desc`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                return response.data;
            } catch (error) {
        console.error(error);
                const externalError = new Error(error.response.statusText);
                externalError.status = error.response.status;
                throw externalError;
            }
        },

        async sendEmail(accessToken, emailId, email) {
            try {
                // Make API Request to Send Email
                const response = await axios.post(`${apiUrl}/api/emails/send/${emailId}`, {
                    recipients: [
                        { email: email },
                    ],
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                return response.data;
            } catch (error) {
        console.error(error);
                console.log(error);
                const externalError = new Error(error.response);
                externalError.status = error.response.status;
                throw externalError;
            }
        },

        async createEmail(accessToken, emailData) {
            try {
                // Make API Request to Create Email
                const response = await axios.post(`${apiUrl}/api/emails/new`, emailData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                console.log(response);
                return response.data;
            } catch (error) {
        console.error(error);
                console.log(error);
                const externalError = new Error(error.response.statusText);
                externalError.status = error.response.status;
                throw externalError;
            }
        },

        async editEmail(accessToken, emailId, emailData) {
            try {
                // Make API Request to Edit Email
                const response = await axios.patch(`${apiUrl}/api/emails/${emailId}/edit`, emailData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                return response.data;
            } catch (error) {
        console.error(error);
                console.log(error)
                const externalError = new Error(error.response.statusText);
                externalError.status = error.response.status;
                throw externalError;
            }
        },  

        async deleteEmail(accessToken, emailId) {
            try {
                // Make API Request to Delete Email
                const response = await axios.delete(`${apiUrl}/api/emails/${emailId}/delete`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                // console.log(JSON.stringify(response));
                return true;
            } catch (error) {
        console.error(error);
                const externalError = new Error(error.response.statusText);
                externalError.status = error.response.status;
                throw externalError;
            }
        },

        async createContact(accessToken, contactData) {
            try {
                // Make API Request to Create a Contact
                const response = await axios.post(`${apiUrl}/api/contacts/new`, contactData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                return response.data;
            } catch (error) {
        console.error(error);
                const externalError = new Error(error.response.statusText);
                externalError.status = error.response.status;
                throw externalError;
            }
        },

        async getAllContacts(accessToken) {
            try {
                // Make API Request to Get all Contacts
                const response = await axios.get(`${apiUrl}/api/contacts?orderBy=date_identified&orderByDir=desc`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                return response.data;
            } catch (error) {
        console.error(error);
                const externalError = new Error(error.response.statusText);
                externalError.status = error.response.status;
                throw externalError;
            }
        },

        async getContactById(accessToken, contactId) {
            try {
                // Make API Request to Get a Contact by ID
                const response = await axios.get(`${Service.apiUrl}/api/contacts/${contactId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                return response.data;
            } catch (error) {
        console.error(error);
                throw new Error(error.response.data.message || 'Failed to retrieve contact from Mautic');
            }
        },

        async updateContact(accessToken, contactId, updatedContactData) {
            try {
                // Make API Request to Update a Contact by ID
                const response = await axios.patch(`${Service.apiUrl}/api/contacts/${contactId}`, updatedContactData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                return response.data;
            } catch (error) {
        console.error(error);
                throw new Error(error.response.data.message || 'Failed to update contact in Mautic');
            }
        },

        async deleteContact(accessToken, contactId) {
            try {
                // Make API Request to Delete a Contact by ID
                const response = await axios.delete(`${Service.apiUrl}/api/contacts/${contactId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                return response.data;
            } catch (error) {
        console.error(error);
                throw new Error(error.response.data.message || 'Failed to delete contact from Mautic');
            }
        }
        
        
    },

    Zoom: {
        async getZoomAccessToken(clientId, clientSecret, accountId) {
            const authHeader = 'Basic ' + base64.encode(`${clientId}:${clientSecret}`);

            try {
                const tokenResponse = await axios.post(`${zoomConfig.tokenURL}?grant_type=account_credentials&account_id=${accountId}`, null, {
                    headers: {
                        'Authorization': authHeader,
                        'Content-Type': 'application/json',
                    },
                });

                return tokenResponse.data.access_token;
            } catch (error) {
                console.error('Failed to retrieve Zoom access token:', error.message);
                const externalError = new Error('Authentication with Zoom API failed.');
                externalError.status = error.response.status;
                throw externalError;
            }
        },

        async createZoomMeeting(accessToken, meetingDetails) {
            try {
                const zoomResponse = await axios.post(`${zoomConfig.apiBaseURL}/users/me/meetings`, meetingDetails, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                return zoomResponse.data;
            } catch (zoomApiError) {
                console.error('Failed to create Zoom meeting:', zoomApiError.message);
                const externalError = new Error('Failed to create Zoom meeting.');
                externalError.status = zoomApiError.response.status;
                throw externalError;
            }
        },

        async updateZoomMeeting(accessToken, meetingDetails, meetingId) {
            try {
                const zoomResponse = await axios.patch(`${zoomConfig.apiBaseURL}/meetings/${meetingId}`, meetingDetails, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                return zoomResponse.data;
            } catch (zoomApiError) {
                console.error('Failed to update Zoom meeting:', zoomApiError.message);
                const externalError = new Error('Failed to update Zoom meeting.');
                externalError.status = zoomApiError.response.status;
                throw externalError;
            }
        },

        async deleteZoomMeeting(accessToken, meetingId) {
            try {
                const zoomResponse = await axios.delete(`${zoomConfig.apiBaseURL}/meetings/${meetingId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                return zoomResponse.data;
            } catch (zoomApiError) {
                console.error('Error deleting Zoom meeting detail:', zoomApiError);
                throw zoomApiError;
            }
        },

        async getZoomMeetingDetails(accessToken, meetingId) {
            try {
                const response = await axios.get(`${zoomConfig.apiBaseURL}/meetings/${meetingId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                return response.data;
            } catch (error) {
                console.error('Error fetching Zoom meeting details:', error);
                throw error;
            }
        },

        // async getZoomMeetingParticipants(accessToken, meetingId) {
        //     try {
        //         const response = await axios.get(`${zoomConfig.apiBaseURL}/past_meetings/${meetingId}/participants`, {
        //             headers: {
        //                 Authorization: `Bearer ${accessToken}`,
        //             },
        //         });

        //         return response.data;
        //     } catch (error) {
        //         console.error('Error fetching Zoom meeting details:', error);
        //         throw new Error('Failed to fetch Zoom meeting details');
        //     }
        // },
        // async getZoomMeetingParticipants(accessToken, meetingId) {
        //     try {
        //         const response = await axios.get(`${zoomConfig.apiBaseURL}/past_meetings/${meetingId}/participants`, {
        //             headers: {
        //                 Authorization: `Bearer ${accessToken}`,
        //             },
        //         });
        
        //         return response.data;
        //     } catch (error) {
        //         console.error('Error fetching Zoom meeting details:', error);
        //         // Rethrow the original error to preserve the status code and other details
        //         throw error;
        //     }
        // }
        async getZoomMeetingParticipants(accessToken, meetingId, { page_size = 25, page_token = '' } = {}) {
            try {
                const response = await axios.get(`${zoomConfig.apiBaseURL}/past_meetings/${meetingId}/participants`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    params: {
                        page_size,   // Set the number of participants per page
                        next_page_token: page_token,  // Token for the next page of results, if available
                    }
                });
        
                // Return the entire response to handle pagination and other metadata
                return response.data;
            } catch (error) {
                console.error('Error fetching Zoom meeting participants:', error);
        
                // Throw the error to be handled by the caller, including 404 handling
                throw error;
            }
        },

        async registerZoomMeetingParticipants(accessToken, participantDetails, meetingId) {
            try {
                const zoomResponse = await axios.post(`${zoomConfig.apiBaseURL}/meetings/${meetingId}/registrants`, participantDetails, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                return true;
            } catch (zoomApiError) {
                if (zoomApiError.response) {
                    // Log the detailed error message from Zoom API
                    console.error('Failed to create Zoom participant:', zoomApiError.response.data);
                } else {
                    console.error('Failed to create Zoom participant:', zoomApiError.message);
                }
        
                const externalError = new Error('Failed to create Zoom participant.');
                externalError.status = zoomApiError.response?.status || 500;
                externalError.details = zoomApiError.response?.data || zoomApiError.message;
                throw externalError;
            }
        },

        
        
        },

    QuizFun: {
        async createQuiz(quizDetails) {
            try {
                const quizUrl = `${quizfunConfig.apiBaseURL}/quiz/partner/create-quiz`;
                console.log(quizUrl);
                const quizfunResponse = await axios.post(`${quizUrl}`, quizDetails, {
                    headers: {
                        // 'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                return quizfunResponse.data;
            } catch (quizfunApiError) {
                console.error('Failed to create quiz:', quizfunApiError);
                const externalError = new Error('Failed to create quizfun meeting.');
                externalError.status = quizfunApiError.response.status;
                throw externalError;
            }
        },

        async updateQuiz(quizId, quizDetails) {
            try {
                const quizUrl = `${quizfunConfig.apiBaseURL}/quiz/${quizId}`;
                console.log(quizUrl);
                const quizfunResponse = await axios.patch(`${quizUrl}`, quizDetails, {
                    headers: {
                        // 'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                return quizfunResponse.data;
            } catch (quizfunApiError) {
                console.error('Failed to create quiz:', quizfunApiError);
                const externalError = new Error('Failed to update quizfun quiz.');
                externalError.status = quizfunApiError.response.status;
                throw externalError;
            }
        },

        async getAllQuiz(domainId) {
            try {
                const response = await axios.get(`${zoomConfig.apiBaseURL}/quiz/partner/fetch-quiz/${domainId}`, {
                    // headers: {
                    //     Authorization: `Bearer ${accessToken}`,
                    // },
                });

                return response.data;
            } catch (error) {
                console.error('Error fetching Zoom meeting details:', error);
                throw error;
            }
        },

        async generateQuizLink(quizDetails) {
            try {
                const quizUrl = `${quizfunConfig.apiBaseURL}/quiz/partner/start`;
                console.log(quizUrl);
                const quizfunResponse = await axios.post(`${quizUrl}`, quizDetails, {
                    headers: {
                        // 'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                return quizfunResponse.data;
            } catch (quizfunApiError) {
                console.error('Failed to get quiz:', quizfunApiError);
                const externalError = new Error('Failed to get quizfun.');
                externalError.status = quizfunApiError.response.status;
                throw externalError;
            }
        },

    },
};

/**
 * @return {string}
 */
const URL = ServiceMap.external.quantum; // TODO: refactor this

module.exports = { Service, Axios, URL };
