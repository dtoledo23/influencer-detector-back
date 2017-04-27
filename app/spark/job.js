const rp = require('request-promise');
const FB = require('fb');
FB.setAccessToken(process.env.FB_PAGE_ACCESS_TOKEN);

// {
//     "category": category,
//     "number_nodes": numNodes,
//     "number_edges": numEdges,
//     "top_five": [{
//             "id": 332466510150563,
//             "name": "Fernanda Vainilla",
//             "profile_picture": "https://scontent.xx.fbcdn.net/v/t1.0-1/c0.9.50.50/p50x50/1544535_810766095653933_3419321256284101039_n.png?oh=b5daa8ab089b6904bd9ed2eff0e1b4aa&oe=597CE3B3",
//             "ranking": 3,
//             "score": 97,
//             "likes": 23,
//             "talking_about": 12
//         },
//         {
//             "id": 29092950651,
//             "name": "Matute Salmón",
//             "profile_picture": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/10941522_10155734866490652_2013649388007612938_n.jpg?oh=c973296799d91663068c90c2cf5a7859&oe=598D1F24",
//             "ranking": 4,
//             "score": 91,
//             "likes": 32,
//             "talking_about": 4
//         },
//         {
//             "id": 449113661917721,
//             "name": "Sergio Asado",
//             "profile_picture": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/11150341_456591447836609_5132202490598543723_n.jpg?oh=88fe791eaa34098862b79e45a79609b2&oe=59817747",
//             "ranking": 5,
//             "score": 79,
//             "likes": 93,
//             "talking_about": 20
//         },
//         {
//             "id": 641285679248839,
//             "name": "Pedro Limon",
//             "profile_picture": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/12509388_1131296853581050_2770478329214469546_n.png?oh=fe49ce0b0558e9d09ed3a2ac0ff35a3a&oe=597D5B30",
//             "ranking": 1,
//             "score": 96,
//             "likes": 132,
//             "talking_about": 65
//         },
//         {
//             "id": 46246991781,
//             "name": "Sarah Panela",
//             "profile_picture": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/76212_10151023496156782_1227836263_n.jpg?oh=42c9f95be1fd747c255be393880e45f4&oe=59872C84",
//             "ranking": 2,
//             "score": 86,
//             "likes": 119,
//             "talking_about": 37
//         }
//     ]
// }

const submitSparkJob = (category, nodes) => {
    const jobInput = {
        input: {
            job: {
                keyspace: process.env.CASSANDRA_KEYSPACE,
                category: category,
                nodes: nodes,
            }

        }
    }

    const options = {
        method: 'POST',
        uri: process.env.SPARK_HOST + "/jobs",
        body: jobInput,
        qs: {
            appName: process.env.SPARK_APP_NAME,
            classPath: process.env.SPARK_APP_CLASSPATH,
            context: process.env.SPARK_CONTEXT,
        },
        json: true // Automatically stringifies the body to JSON 
    };

    return rp(options).catch(console.error)
}

const monitor = (jobId) => {
    const options = {
        method: 'GET',
        uri: process.env.SPARK_HOST + "/jobs/" + jobId,
        json: true // Automatically stringifies the body to JSON 
    };

    return rp(options).
    then(job => {
        if (job.status === "FINISHED") {
            return ({
                duration,
                jobId,
                result,
                startTime,
            } = job)
        } else {
            return monitor(jobId)
        }
    }).
    catch(console.error)
}

const processResults = async(results) => {
    console.log("Processing: ", results);
    let category = results[2];
    let numNodes = results[1];
    let numEdges = results[2];
    let topFive = []

    let count = results[3].length 
    count = count < 10 ? count : 10;
    for (let i = 0; i < count; i++) {
        let result = await fetchExtraPageInfo(results[3][i], i)
        topFive.push(result);
    }

    return {
        "category": category,
        "number_nodes": numNodes,
        "number_edges": numEdges,
        "top_five": topFive,
    }
}

const fetchExtraPageInfo = (jobNodeResult, index) => {
    if (jobNodeResult.length != 2) {
        return {};
    }

    const id = jobNodeResult[1];
    const score = jobNodeResult[0];
    console.log("Id:", jobNodeResult, " score:", score);

    return FB.api(
            `/${id}/`,
            'GET', { "fields": "id,name,talking_about_count,fan_count" })
        .then(response => {
            return {
                "id": id,
                "name": response.name,
                "ranking": index,
                "score": score,
                "likes": response.fan_count,
                "talking_about": response.talking_about_count,
            }
        })
        .then(withoutPicture => {
            console.log(withoutPicture)
            console.log("Here id", id)
            return FB.api(
                    `/${id}/picture/`,
                    'GET', { "redirect": 0, "type": "normal" })
                .then(picture => {
                    withoutPicture.profile_picture = picture.data.url;
                    return withoutPicture
                })
                .catch((err) => {
                    console.error(err)
                    return {}
                })
        })
}

const startAnalyzer = (category, nodes) => {
    console.log("Starting analysis")
    return submitSparkJob(category, nodes)
        .then(response => {
            console.log("Submited Spark Job")
            console.log(JSON.stringify(response, null, 2))
            return monitor(response.result.jobId);
        })
        .then(jobResults => {
            return processResults(jobResults.result)
        })
        .catch(console.error)
}

module.exports = startAnalyzer;