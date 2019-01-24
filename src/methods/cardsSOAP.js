const soapRequest = require('easy-soap-request');
const fs = require('fs');
const accounts = require('../../accounts/accounts.json');
//const twSocialCards = require('../../json/twitterSocialCards.json');

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
    const url = 'https://www.city.ac.uk/_web_services/socialmedia?WSDL';
    const headers = {
        'user-agent': 'sampleTest',
        'Content-Type': 'text/xml;charset=UTF-8',
        'Authorization': 'Basic ' + accounts.squizSocialUser.base64
    };
    let xml = fs.readFileSync('./json/all.json', 'utf-8');
    let sl = JSON.parse(xml);
    let ar = [];

    fs.writeFile('./json/all2.json', JSON.stringify(sl), 'utf-8', function(err) {
        if (err) throw err;
        console.log('all 2 Saved!');
    });

    let twSocialCards = fs.readFileSync('./json/twitterSocialCards.json', 'utf-8');
    let prTw = JSON.parse(twSocialCards);

    prTw.forEach(e => {
        ar.push(e);
    })

    var cassofficial = sl.find(function(e) {
        return e.type === 'Facebook' && e.screenName === 'Cassofficial'
    });

    cassofficial.itemRef = 'fb-Cassofficial';

    var cassbusinessschool = sl.find(function(e) {
        return e.type === 'Instagram' && e.screenName === 'cassbusinessschool'
    });

    cassbusinessschool.itemRef = 'in-cassbusinessschool';

    ar.push(cassofficial);

    ar.push(cassbusinessschool);

    fs.writeFile('./json/socialCards.json', JSON.stringify(ar), 'utf-8', function(err) {
        if (err) throw err;
        console.log('social cards Saved!');
    });

    let objJsonStr = JSON.stringify(ar);
    let objJsonB64 = Buffer.from(objJsonStr).toString("base64");


    let sEnvelop =
        '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://www.city.ac.uk/_web_services/socialmedia">' +
        '<SOAP-ENV:Body>' +
        '<ns1:Upload>' +
        '<AssetID>446946</AssetID>' +
        '<FileName>twitter.json</FileName>' +
        '<FileContentBase64>' + objJsonB64 + '</FileContentBase64>' +
        '</ns1:Upload>' +
        '</SOAP-ENV:Body>' +
        '</SOAP-ENV:Envelope>';
    try {
        const { response } = await soapRequest(url, headers, sEnvelop);
        const { body, statusCode } = response;
        return {
            'body': body,
            'statusCode': statusCode
        }
    } catch (e) {
        return e
    }
}

module.exports.sendSocialCards = sendSocialCards;