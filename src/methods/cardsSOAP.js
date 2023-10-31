const soapRequest = require('easy-soap-request');
const fs = require('fs');
const accounts = require('../../accounts/accounts.json');

// example data


// usage of module
// (async () => {
//     try {
//         const { response } = await soapRequest(url, headers, sEnvelop);
//         const { body, statusCode } = response;
//         console.log(body);
//         console.log(statusCode);
//     } catch (e) {
//         console.log(e)
//     }
// })();

async function sendSocialCards() {
    const url = 'https://www.city.ac.uk/_web_services/dev-as?WSDL';
    const headers = {
        'user-agent': 'sampleTest',
        'Content-Type': 'text/xml;charset=UTF-8',
        'Authorization': 'Basic ' + accounts.squizSocialUser.base64
    };
    let xml = fs.readFileSync('./json/all.json', 'utf-8');
    let sl = JSON.parse(xml);
    let ar = [];

    var cassofficial = sl.find(function(e) {
        return e.type === 'Facebook' && e.screenName === 'Cassofficial'
    });

    if(cassofficial !== undefined){
         cassofficial.itemRef = 'fb-Cassofficial';
    }else{
        //place holder data because cassofficial facebook account token expired contact owner to renew token
        cassofficial = {
            "itemRef": "fb-Cassofficial",
            "postId": null,
            "timeCreated": 1567533726,
            "type": "Facebook",
            "fullName": "Cass Business School",
            "screenName": "Cassofficial",
            "text": "Would you like to experience the life of a Cass MBA student in London? Join us on campus on Saturday 14th September for our 'MBA in a day' event. https://bit.ly/2lCcHFB",
            "linkedText": "Would you like to experience the life of a Cass MBA student in London? Join us on campus on Saturday 14th September for our 'MBA in a day' event. https://bit.ly/2lCcHFB",
            "accountUrl": "http://www.facebook.com/226717388297",
            "timeElapsed": "a day ago",
            "itemUrl": "https://www.facebook.com/226717388297/posts/10158997659783298",
            "imageUrl": "https://external.xx.fbcdn.net/safe_image.php?d=AQDN5z7yxz36Pbw0&url=https%3A%2F%2Fwww.facebook.com%2Fads%2Fimage%2F%3Fd%3DAQLoh9ZJOJKm5LWtUjnjLFJWmaTz2TUGHxkIOAzqXz3KteNso61dyg8__hLhe1T3fiqwCLw7uLl63adUErU5WXfTG-efHts_A6qfU0r3KWWfMqEZveD692sg3nVN8FG1Im_-SK3oNV8LSOeoEEyMQIgO&_nc_hash=AQCQWMMh9UmGUc7r",
            "videoId": null
            };
    }

    cassofficial.itemRef = 'fb-Cassofficial';

    var cassbusinessschool = sl.find(function(e) {
        return e.type === 'Instagram' && e.screenName === 'bayesbschool'
    });

    if(cassbusinessschool !== undefined){
        cassbusinessschool.itemRef = 'in-bayesbschool';
        
    }else{
        cassbusinessschool = {
            "itemRef": "in-bayesbschool",
            "postId": "17922649177884469",
            "timeCreated": "1632909643",
            "type": "Instagram",
            "fullName": "bayesbschool",
            "screenName": "bayesbschool",
            "text": "Being in the heart of the capital, student life at Bayes is never boring",
            "linkedText": "Being in the heart of the capital, student life at Bayes is never boring",
            "accountUrl": "https://instagram.com/bayesbschool",
            "timeElapsed": "6 days ago",
            "itemUrl": "https://www.instagram.com/p/CUZsNfVM5B2/",
            "imageUrl": "https://www.bayes.city.ac.uk/__data/assets/image/0003/639831/bayes.jpeg",
            "videoId": ""
        };
    }

    ar.push(cassofficial);

    ar.push(cassbusinessschool);
    

    fs.writeFile('./json/socialCards.json', JSON.stringify(ar), 'utf-8', function(err) {
        if (err) throw err;
        console.log('social cards Saved!');
    });

    let objJsonStr = JSON.stringify(ar);
    let objJsonB64 = Buffer.from(objJsonStr).toString("base64");


    let sEnvelop =
        '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://www.city.ac.uk/_web_services/dev-as">' +
        '<SOAP-ENV:Body>' +
        '<ns1:Upload>' +
        '<AssetID>542618</AssetID>' +
        '<FileName>cassSocialCards.json</FileName>' +
        '<FileContentBase64>' + objJsonB64 + '</FileContentBase64>' +
        '</ns1:Upload>' +
        '</SOAP-ENV:Body>' +
        '</SOAP-ENV:Envelope>';
    try {
        const { response } = await soapRequest(url, headers, sEnvelop);
        const { body, statusCode } = response;
        return {
            'r': response,
            'body': body,
            'statusCode': statusCode
        }
    } catch (e) {
        return e
    }
}

module.exports.sendSocialCards = sendSocialCards;