const fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xml = fs.readFileSync('../../json/twitter.json', 'utf-8');
let sl = xml.slice(0, 20);
let objJsonStr = JSON.stringify(sl);
let objJsonB64 = Buffer.from(objJsonStr).toString("base64");




	/**
	* Convert a JSON string to object
	*/
	function jsonToObj(json)
	{
		// Make the conversion
		if (typeof(JSON) !== 'undefined') {
			return JSON.parse(json);
		}// end if

		// Don't worry, even the creator of JSON says eval is ok here
		return eval('(' + json + ')');

	}// end jsonToObj


	/**
	* Get all the properties of an object as an array
	*
	* @param object    obj     The object to get the parameters for
	*/
	function getProperties(obj)
	{
		var properties = [];
		for (var propName in obj){
			if (obj.hasOwnProperty(propName)){
				properties.push(propName);
			}// end if
		}// end for

		return properties;

	}// end getProperties


	/**
	* Convert a variable to a boolean
	*/
	function convertToBoolean(variable)
	{
		var ret = false;
		if (variable !== null && typeof(variable) !== "undefined") {
			switch (typeof(variable)) {
				case 'number':
					ret = (variable === 1) ? true : false;
					break;

				case 'boolean':
					ret = variable;
					break;

				case 'string':
					var testVar = variable.toLowerCase();
					if (testVar === 'true' || testVar === '1') {
						ret = true;
					} else if (testVar === 'false' || testVar === '0') {
						ret = false;
					}// end if
					break;
			}// end switch

		}// end if

		return ret;

	}// end convertToBoolean


	/**
	* The API constructor
	*/
	Squiz_Matrix_API = function(options)
	{
		var self = this;

		if (!options.hasOwnProperty('key') || options.key === '') {
			throw 'An API key is required';
		}// end if

		self.key = options.key;

		self.nonceToken = '';

	};// end construct


	/**
	* API methods
	*/
	Squiz_Matrix_API.prototype = {
		syncing_enabled : 0,

		_http: function(options)
		{
			var self = this;

			// Create the HTTPRequest object
			function createRequest()
			{
				var request;
				try {
					request = new XMLHttpRequest();
				} catch (trymicrosoft) {
					try {
						request = new ActiveXObject("Msxml2.XMLHTTP");
					} catch (othermicrosoft) {
						try {
							request = new ActiveXObject("Microsoft.XMLHTTP");
						} catch(nosupport) {
							request = false;
						}// end try
					}// end try
				}// end try

				if (!request) {
					throw 'Your browser does not support Ajax';
				}// end if

				return request;

			}// end createRequest


			// Process parameters into a data array
			function data(params)
			{
				// Automatically append 'key' to every request
				var dataArr = {};

				for (var i = 0, l = params.length; i < l; i+=1) {
					if(params[i]) {
						dataArr[params[i][0]] = params[i][1];
					}
				}// end for
				return JSON.stringify(dataArr);

			}// end data

			// Set some defaults for the HTTP Request
			options = self._options(['params'],{
						url:                'https://www.city.ac.uk/_web_services/socialmediajs.js',
						method:             'POST',
						contentType:        'application/json',
						params:             [],
						async:              true,
						onSuccess:          function(){},
						onError:            function(){
													throw 'HTTPRequest call failed';
											}
			},options);

			var http = createRequest();
			http.open(options.method,encodeURI(options.url),options.async);
			http.onreadystatechange = function() {
				if (http.readyState === 4) {
					if (http.status === 200) {
						if (typeof(http.responseText) !== 'undefined' || http.responseText !== '' || http.responseText !== null) {
							var response = jsonToObj(http.responseText);
							options.onSuccess.call(this,response);
						} else {
							options.onError.call(this,http);
						}// end if
					} else {
						options.onError.call(this,http);
					}// end if
				}// end if
			};// end onreadstatechange

			http.setRequestHeader("Content-type", options.contentType);
			http.setRequestHeader("X-SquizMatrix-JSAPI-Key", self.key);

			// Send the request
			http.send(data(options.params));

		},// end _ajax


		/**
		* Validates options and returns merged data
		*/
		_options: function(required,defaults,options,discard)
		{
		    if (arguments.length < 4) {
		        discard = true;
		    }

			// Required data
			for (var i = 0, l = required.length; i<l; i+=1) {
				if (!options.hasOwnProperty(required[i])) {
					throw 'Required argument "' + required[i] + '" missing';
				}// end if
			}// end for

			// Merge options and defaults
			for (var def in options) {
			    if (defaults.hasOwnProperty(def)){
					defaults[def] = (options.hasOwnProperty(def)) ? options[def] : defaults[def];
				} else if ((discard === false) && (options.hasOwnProperty(def))) {
				    defaults[def] = options[def];
				}//end if
			}// end for

			if (defaults.hasOwnProperty('dataCallback') && typeof(defaults.dataCallback) !== "function") {
				throw 'Data callback must be a function';
			}// end if

			return defaults;

		},// end _options

			
		/**
		* This function will let user edit content of Editable File type assets
		* File type that can be edited - css_file, xml_file, css_file, text_file, xsl_file, js_file
		* User needs to acquire locks before being able to edit the file
		*
		* @param object		options       JSON string of options
		* {
		*      asset_id:		string/int	Id of the asset to update content for
		*      content:			string		new content of the asset
		*      dataCallback:	function	Custom callback function
		* }
		*/
		setContentOfEditableFileAsset: function(options)
		{
			var fnName = 'setContentOfEditableFileAsset';
			if (arguments.length === 0) {
				return {
					// Set the default values
					defaults: {
						asset_id:           null,
						content:            'no_value_provided',
						dataCallback:       function(){}
					},

					// Set the required arguments
					required: ['asset_id','content']
					};
			}// end if

			// Extract some configuration and use it to build
			// parameters for the post call
			var fnConfig = this[fnName].call(this);
			options = this._options(fnConfig.required,fnConfig.defaults,options);

			options.content = escape(options.content);

			this._doPost(fnName,[
				['id', options.asset_id],
				['content', options.content]
			],options);

		},// end setContentOfEditableFileAsset


		/**
		* This function will let user edit content of File type assets
		* User needs to acquire locks before being able to edit the file
		*
		* @param object		options       JSON string of options
		* {
		*      asset_id:		string/int	Id of the asset to update content for
		*      content:			string		New base64 encoded content for the File asset
		*      dataCallback:	function	Custom callback function
		* }
		*/
		updateFileAssetContent: function(options)
		{
			var fnName = 'updateFileAssetContent';
			if (arguments.length === 0) {
				return {
					// Set the default values
					defaults: {
						asset_id:           null,
						content:            'no_value_provided',
						dataCallback:       function(){}
					},

					// Set the required arguments
					required: ['asset_id','content']
					};
			}// end if

			// Extract some configuration and use it to build
			// parameters for the post call
			var fnConfig = this[fnName].call(this);
			options = this._options(fnConfig.required,fnConfig.defaults,options);

			options.content = escape(options.content);

			this._doPost(fnName,[
				['id', options.asset_id],
				['content', options.content]
			],options);

		},// end updateFileAssetContent

			
		/**
		* Shortcut function for sending post data
		*/
		_doPost: function(fnName,data,options)
		{
			var self = this;

			// Add the 'type' parameter for as the calling function name
			data.push(['type',fnName]);

            // append nonce token
            if(!self.nonceToken) {
                var tokenElem = document.getElementById('token');
                if (tokenElem) {
                    self.nonceToken = tokenElem.value;
                }
            }

			if (self.nonceToken) {
				data.push(['nonce_token', self.nonceToken]);
				self._http({
					params: data,
					onSuccess: function(json) {
						// Every function should have a dataCallback argument
						if (options.hasOwnProperty('dataCallback')) {
							options.dataCallback.call(this,json);
						}// end if
					}
				});
			}
			else {
				var xmlhttp;
				if (window.XMLHttpRequest)
				  {// code for IE7+, Firefox, Chrome, Opera, Safari
				  xmlhttp=new XMLHttpRequest();
				  }
				else
				  {// code for IE6, IE5
				  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
				  }
				xmlhttp.onreadystatechange=function()
				  {
				  if (xmlhttp.readyState==4 && xmlhttp.status==200)
				    {
				    	self.nonceToken = xmlhttp.responseText;
				    	data.push(['nonce_token', self.nonceToken]);
						self._http({
							params: data,
							onSuccess: function(json) {
								// Every function should have a dataCallback argument
								if (options.hasOwnProperty('dataCallback')) {
									options.dataCallback.call(this,json);
								}// end if
							}
						});
				    }
				}
				xmlhttp.open("GET","https://www.city.ac.uk/_web_services/socialmediajs.js" + "?SQ_ACTION=getToken",true);
				xmlhttp.send();
			}

		}// end _doPost


	};// end Squiz_Matrix_API methods




var options = new Array();
options['key'] = '4971253316';
var js_api = new Squiz_Matrix_API(options);

function sendSocialCard(){
	js_api.updateFileAssetContent({
	   "asset_id":"446946",
	   "content": objJsonB64,
	   "dataCallback":cb
	}); 
}
 function cb (r){
 	console.log(r);
 }
