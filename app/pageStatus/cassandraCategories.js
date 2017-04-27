const getClient = require("../../db/connection");
const Long = require('cassandra-driver').types.Long;
const _ = require('lodash');
const FB = require('fb');
FB.setAccessToken(process.env.FB_PAGE_ACCESS_TOKEN);

const getCategories = (ids) => {
    let client = getClient();
    let promises = [];
    let categories = [];
    ids.forEach((id) => {
        promises.push(
            FB.api(
                id,
                'GET', { "fields": "id,category,category_list" })
            .then((result) => {
                let dictionaryCat = [result.category];
                let category_list = result.category_list || []
                category_list.forEach((info) => {
                    dictionaryCat.push(info.name);
                });
                categories = _.union(categories, dictionaryCat);
            })
        )
    });
    return Promise.all(promises)
        .then(() => categories)
}

module.exports = getCategories;