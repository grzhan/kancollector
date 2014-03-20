case "damage": {
	if (!cache.ships) {
		callback("Ship List not read yet. Please execute 'ships' first.");
		return ;
	}
	var ship = null;
	var out = "Hurted Ships : \n"
	var flag = 0;
	for (var i=0; i<cache.ships.length;i++) {
		ship = cache.ships[i];
		if (parseInt(ship.nowhp) < parseInt(ship.maxhp)) {
			flag = 1;
			out += "[" + tools.pad(ship.id, 3) + "] " + tools.colorName(ship,ship.name,true) + " (Lv." + ship.lv + ")\t";
			out +=  cache.ships[i].nowhp + '/' + cache.ships[i].maxhp + "\n";
		}
	}
	if (flag === 1) {
		callback(out);
	} else {
		callback("All ship girls are in health ")
	}
	return ;
}break;

function sleep(time_seconds) {
	var milliseconds = time_seconds * 1000;
	var startTime = new Date().getTime();
	while (new Date.getTime() < startTime + time_seconds);
}

case "autorepair" {
	// Fetch Ships Info
	var info = "Autorepair interrupted."
	var error_flag = 0;
	var waiting_time;
	var s = true;
	while (s) {
		waiting_time = -1;
		console.log("Fetch hurted shipgirls Info ... ");
		api.ships(sesn_key,s, function(stats){
			if (stats.code == 200) {
				var ships = stats.resp;
				cache.ships = ships;
				saveCache();
			} else {
				console.log(stats);
				s = false;
				info = "Autorepair interrupted";
				waiting_time = 0;
				return;
			}
			var ship = null;
			var damage_ships = null;
			var damage_len = 0;
			for (var i=0; i<cache.ships.length;i++) {
				ship = cache.ships[i];
				if (parseInt(ship.nowhp) < parseInt(ship.maxhp)) {
					damage_ships[damage_len] = ship; damage_len++;
				}
			}
			if (damage_len === 0) {
				s = false;
				waiting_time = 0;
				info = "All shipgirls are in health, autorepair Finished."
				return ;
			} else {
				console.log("Now " + damage_len + "shipgirls are in damage.");
				console.log("Has found hurted shipgirls, now fetch docks info...");
				api.stats_dock(sesn_key, function(stats){
					if (stats.code == 200) {
						//  TODO
						var docks = stats.resp;
						var docks_empty = {};
						var ship_remain = {};
						var empty_len = 0;
						var remain_time = 49766400;
						var j =0;
						var k =0;
						for (i=0; i < docks.length; i++) {
							if (docks[i].state == "empty") {
								docks_empty[empty_len] = docks[i].id;
								empty_len ++;
							} else if (docks[i] != "locked") {
								ship_remain[k] = docks[i].id;
								k++;
								if (Math.floor(docks[i].remaining / 1000) < remain_time) remain_time = Math.floor(docks[i].remaining / 1000);
							}
						}

						if (empty_len > 0) {
							api_dock(sesn_key,docks_empty[0],damage_ships[0],false, function(resp)) {
								console.log(resp);
								waiting_time = 0;
							}
						} else {
							waiting_time = remain_time;
						}

					} else {
						console.log(stats);
						s = false;
						info = "Autorepair Interrupted";
						waiting_time = 0;
						return;
					}
				}
			}
		});
		while (waiting_time < 0);
		if (waiting_time > 0) console.log("Waiting: " + waiting_time + " seconds...");
		sleep(waiting_time);
	}
	callback(info);
	return ;
}break;