var all = require('../../json/all.json');
var fs = require('fs');

var counter = 0;
var newArray = [];
function t(){
	return all.reduce(function(prev,next,index){
		if(prev.itemRef === next.itemRef){
			var obj = prev;
			obj.itemRef = obj.itemRef + '-' + counter;
			newArray.push(obj);
			counter++;
		}
		else{
			counter=0;
			newArray.push(prev);
		}

        return next
	})
}


t();

fs.writeFile('../../json/all.json', JSON.stringify(newArray), 'utf-8', function(err) {
        if (err) throw err;
        console.log('All json Saved!');
    });