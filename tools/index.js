var pad = function(num, len){
	num = "" + num;
	while(num.length !== len){
		num = "0" + num;
	}
	return num;
}
exports.pad = pad;
exports.pretty_time = function(time){
	var seconds = Math.floor(time / 1000);
	var minutes = Math.floor(seconds / 60);
	var hours = Math.floor(minutes / 60);
	seconds -= minutes * 60;
	minutes -= hours * 60;
	return pad(hours,2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2);
};

exports.ship_db = require("./shipdb.js");

exports.rarity = function(stars){
	if(typeof stars !== 'number' || isNaN(stars)){
		return "      ";
	}
	var out = "";
	for(var i = 0; i < stars; i++){
		out+="*";
	}
	for(var j = 0; j < 6 - stars; j++){
		out+= " ";
	}
	return out;
}

exports.findById = function(shipdb, ref, id){
	if(shipdb){
		for(var x in shipdb){
			if(shipdb[x].id === id){
				var sid = shipdb[x];
				if(ref[sid.sortno -1]){
					return ref[sid.sortno -1]["name"];
				}else{
					return sid.sortno;
				}
			}
		}
		return id;
	}
	return id;
}