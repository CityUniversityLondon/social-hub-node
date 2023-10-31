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

    let engineer = sl.find(function(e) {
        return e.type === 'Facebook' && e.screenName === 'EngineeringCityUniversityLondon'
    });

    if(engineer !== undefined){
        engineer.itemRef = 'fb-EngineeringCityUniversityLondon';
        ar.push(engineer);
    } 

    let cityuniversitylondon = sl.find(function(e){
        return e.type === 'Facebook' && e.screenName === 'cityuniversitylondon'
    });

    if(cityuniversitylondon !== undefined){
        cityuniversitylondon.itemRef = 'fb-cityuniversitylondon';
        let fbcity = cityuniversitylondon.linkedText;
        cityuniversitylondon.linkedText = encodeURIComponent(fbcity);
        ar.push(cityuniversitylondon);
    }

    let instaCityuniversitylondon = sl.find(function(e){
        return e.type === 'Instagram' && e.screenName === 'cityuniversitylondon'
    });

    if(instaCityuniversitylondon !== undefined){
        instaCityuniversitylondon.itemRef = 'in-cityuniversitylondon';
        let f = instaCityuniversitylondon.linkedText;
        instaCityuniversitylondon.linkedText = encodeURIComponent(f);
        ar.push(instaCityuniversitylondon);
    }

    let objJsonStr = JSON.stringify(ar);
    let objJsonB64 = Buffer.from(objJsonStr).toString("base64");

	let sEnvelop =
        '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://www.city.ac.uk/_web_services/socialmedia">' +
        '<SOAP-ENV:Body>' +
        '<ns1:Upload>' +
        '<AssetID>542619</AssetID>' +
        '<FileName>web2020SocialCards.json</FileName>' +
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