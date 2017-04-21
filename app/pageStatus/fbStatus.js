const FB = require('fb');
FB.setAccessToken(process.env.FB_PAGE_ACCESS_TOKEN);

const getFacebookId = (url) => {
    return FB.api(
            '/',
            'GET', { "id": url }
        )
        .then(response => {
            if (response.name) {
                return response.id;
            } else {
                return undefined;
            }

        })
        .catch(err => {
            console.error(err);
            return undefined;
        });
};

module.exports = getFacebookId;