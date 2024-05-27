// import fastTwoSms from 'fast-two-sms'

// export async function sendSMS(to, message) {
//     const options = {
//         authorization: 'LiHn8kzJMTxS3oV7Zmrv5EeuA0FRqKDaN1pQCYg6PtsdOfl9GbeznWyTmUw3HX5r9sQG2DxljIpgOfb1', // Replace with your Fast2SMS API key
//         message: message,
//         numbers: [to]
//     };

//     try {
//         const response = await fastTwoSms.sendMessage(options);
//         console.log('SMS sent successfully:', response);
//         return response;
//     } catch (error) {
//         console.error('Error sending SMS:', error);
//         throw error;
//     }
// }