import * as constants from './constants';

const sendNotification = (notificationText: string): void => {
    const url = `https://api.telegram.org/bot${constants.TG_BOT_TOKEN}/sendMessage?chat_id=${constants.CHAT_ID}&text=${notificationText}`;

    import('node-fetch')
        .then((nodeFetch) => {
            return nodeFetch.default(url, {
                method: "GET"
            });
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response;
        })
        .then(() => {
            // Notification sent successfully
        })
        .catch((error) => {
            console.error(`Error sending notification: ${error.message}`);
        });
};

export default sendNotification;
