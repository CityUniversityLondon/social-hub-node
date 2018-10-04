import 'babel-polyfill';
import {instAccounts} from './social-api/test'


function component(){
	let element = document.createElement('div');

	element.innerHTML = _.join(['hello','webpack'], ' ');

	return element;
}	
	/*var p1 = new Promise(function(resolve, reject){
		if(array){
			resolve(array)
		}
	});
	p1.then(function(v){
		v.forEach(e=> console.log(e));
	})*/

	Promise.all(instAccounts).then(r=> console.log([].concat(...r)));

	

document.body.appendChild(component());