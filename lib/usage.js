const axios = require('axios').default;
const ObjectsToCsv = require('objects-to-csv');
var fs = require('fs');
const moment = require('moment');
const path = require('path');

//generate usage sheets for each application specified
function usage(options) {
    console.log(options)
    var filePaths = [];
    //configure
    const inputList = [options];
    
    // const endTimeUTC = '2021-05-28T00:00:00Z';

    // inputList.forEach(options => { 
        const formattedStartTime = formatDate(options.startDate, false);
        const formattedEndTime = formatDate(options.endDate, true);  
        
        //usage api endpoints and credentials
        const getTotalSearchRequests = axios.get('https://usage.algolia.com/1/usage/total_search_requests?startDate=' + formattedStartTime + '&endDate=' + formattedEndTime, {
            params: {
                "X-Algolia-API-Key": options.apiKey,
                "X-Algolia-Application-Id": options.appID
              }
            })
        const getTotalQuerySuggestionsRequests = axios.get('https://usage.algolia.com/1/usage/querysuggestions_total_search_requests?startDate=' + formattedStartTime + '&endDate=' + formattedEndTime, {
            params: {
                "X-Algolia-API-Key": options.apiKey,
                "X-Algolia-Application-Id": options.appID
              }
            })
        
        //create directory if it doesn't exist yet
        const folderName = 'usage';

        const dir = './' + folderName + '/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }


        return new Promise((resolve,reject) => {
            axios.all([getTotalSearchRequests, getTotalQuerySuggestionsRequests])
            .then(axios.spread(function(res1, res2) {
                var requestsArray = [];            
                //create new object per day containing date, requests, qs requests, and billed requests
                res1.data.total_search_requests.forEach(options => {
                    var newObj = {}
                    var date = new Date(options.t);
                    newObj.time = (date.getUTCMonth()+1)+"/"+date.getUTCDate();
                    newObj.requests = options.v;
                    res2.data.querysuggestions_total_search_requests.forEach((options2) => {
                        if (options2.t === options.t) {
                            newObj.qsRequests = options2.v;
                            newObj.billedRequests = (options.v - options2.v)
                        } else {
                        }
                    })
                    //push that usage object to a larger array of usage objects
                    requestsArray.push(newObj);
                })
                //create csv of all objects in array per each app in specified directory
                var filePath = dir + options.appID + '.csv';
                filePaths.push(path.resolve(filePath));
                

                new ObjectsToCsv(requestsArray).toDisk(filePath)
                    console.log(options.name + " - " + options.appID + ' usage exported to csv in folder ' + dir);
        })).then(function (response) {
            resolve(filePaths);
        }).catch(function (error) {
            reject(error);
        });
        });
        
    // );
}
// });
// }

function formatDate(date, endOfDay) {
  let offset = '';
    if (endOfDay) {
        offset = '23:23:59Z';
    } else {
        offset = '00:00:00Z'
    }
    return date + 'T' + offset;
};

module.exports = usage;