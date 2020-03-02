const soapRequest = require('easy-soap-request');
const fs = require('fs');
const accounts = require('../../accounts/accounts.json');

async function sendCityCourse (){
	const url = 'https://www.city.ac.uk/_web_services/socialmedia?WSDL';
    const header = {
        'user-agent': 'sampleTest',
        'Content-Type': 'text/xml;charset=UTF-8',
        'Authorization': 'Basic ' + accounts.squizSocialUser.base64
    };

    let xml = fs.readFileSync('./json/all.json', 'utf-8');
    let sl = JSON.parse(xml);
    let ar = [];

    let twCourseCards = fs.readFileSync('./json/twitterCourseCards.json', 'utf-8');
    let prTw = JSON.parse(twCourseCards);

    prTw.forEach(e => {
        ar.push(e);
    });

    var engineer = sl.find(function(e) {
        return e.type === 'Facebook' && e.screenName === 'EngineeringCityUniversityLondon'
    });

    if(engineer !== undefined){
        engineer.itemRef = 'fb-EngineeringCityUniversityLondon';
        ar.push(engineer);
    } 


    let objJsonStr = JSON.stringify(ar);
    let objJsonB64 = Buffer.from(objJsonStr).toString("base64");

	let sEnvelop =
        '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://www.city.ac.uk/_web_services/socialmedia">' +
        '<SOAP-ENV:Body>' +
        '<ns1:Upload>' +
        '<AssetID>504211</AssetID>' +
        '<FileName>courseSocialCards.json</FileName>' +
        '<FileContentBase64>' + objJsonB64 + '</FileContentBase64>' +
        '</ns1:Upload>' +
        '</SOAP-ENV:Body>' +
        '</SOAP-ENV:Envelope>';

    try {
        const { response } = await soapRequest(url, header, sEnvelop);
        const { body, statusCode } = response;
        return {
            'body': body,
            'statusCode': statusCode
        }
    } catch (e) {
        return e
    }
}

module.exports.sendCityCourse = sendCityCourse;