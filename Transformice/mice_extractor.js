/* Pad short bits to necessary length */
function pad_bits(bits, len) {
	while (bits.length < len) {
		bits = "0" + bits;
	}
	return bits;
}

/* Game does not use values 1-16 for t. This function converts the used values back to what was sent */
function convert_t_val(t_val) {
	if (t_val > 6 && t_val < 9) {
		t_val += 3;
	} else if (t_val > 9 && t_val < 14) {
		t_val += 2;
	} else if (t_val > 16) {
		t_val -= 10;
	} else {
		t_val = t_val;
	}
	return t_val;
}

/* For increased covertness, cyclically change coordinates */
function adjust_x_y(coord, isX, cycle) {
	if (isX) {
		if (cycle == 1 || cycle == 2) {
			coord = 800-coord;
		}
	} else {
		if (cycle == 2 || cycle == 3) {
			coord = 400-coord;
		}
	}
	return coord;
}

/* Convert l and h to the actual bit values sent */
function convert_l_and_h_val(val) {
	val -= 10;
	val = val/16;
	return val;
}

/* Helper function for dealing with all tags that need extra processing */
function extract_tag(letter, ground, bit_len, count) {
	tag_spot = ground.indexOf(letter)+3;
	tag = ground.slice(tag_spot);
	next_quote = tag.indexOf('"')
	tag_str = tag.slice(0, next_quote);
	tag_num = parseInt(tag_str);
	if (letter == "T") {
		tag_num = convert_t_val(tag_num);
	} else if (letter == "L" || letter == "H") {
		tag_num = convert_l_and_h_val(tag_num);
	} else if (letter == "X") {
		tag_num = adjust_x_y(tag_num, true, count%4);
	} else if (letter == "Y") {
		tag_num = adjust_x_y(tag_num, false, count%4);
	} else if (letter == "C") {
		tag_num -= 1;
	}
	tag_bits = tag_num.toString(2);
	tag_bits = pad_bits(tag_bits, bit_len);
	return tag_bits;
}

/* Recover bits from a ground */
function extract_ground_bits(one_ground, count) {
	running_bits = "";
	running_bits += extract_tag("T", one_ground, 4, count);
	running_bits += extract_tag("L", one_ground, 3, count);
	running_bits += extract_tag("H", one_ground, 2, count);
	running_bits += extract_tag("X", one_ground, 9, count);
	running_bits += extract_tag("Y", one_ground, 8, count);
	running_bits += extract_tag("C", one_ground, 2, count);
	N = one_ground.indexOf("N");
	if (N == -1) {
		running_bits += "0";
	} else {
		running_bits += "1";
	}
	return running_bits;
}

/* Recover bits from spawn points */
function extract_spawn_bits(one_spawn) {
	running_bits = "";

	/* Extract bits from x coordinate */
	x_spot = one_spawn.indexOf("X")+3;
	x = one_spawn.slice(x_spot);
	next_quote = x.indexOf('"')
	x_str = x.slice(0, next_quote);
	x_num = parseInt(x_str);
	x_bits = x_num.toString(2);
	x_bits = pad_bits(x_bits, 9);
	running_bits += x_bits;

	/* Extract bits from y coordinate */
	y_spot = one_spawn.indexOf("Y")+3;
	y = one_spawn.slice(y_spot);
	next_quote = y.indexOf('"')
	y_str = y.slice(0, next_quote);
	y_num = parseInt(y_str);
	y_bits = y_num.toString(2);
	y_bits = pad_bits(y_bits, 8);
	running_bits += y_bits;
	return running_bits;
}

/* Extract bits from an object */
function extract_object_bits(one_object, count) {
	running_bits = "";
	T_spot = one_object.indexOf("T")+3;
	T_part = one_object.slice(T_spot);
	next_quote = T_part.indexOf('"');
	T_str = T_part.slice(0, next_quote);
	T_num = parseInt(T_str);
	T_bits = T_num.toString(2);
	T_bits = pad_bits(T_bits, 8);
	running_bits += T_bits;
	running_bits += extract_tag("X", one_object, 9, count);
	running_bits += extract_tag("Y", one_object, 8, count);
	return running_bits;
}

function main() {
	/* List of maps with covert data, & string to hold bits extracted */
	var secret_games = ['<C><P /><Z><S><S T="18" P="0,0,0.3,0.2,0,0,0,0" L="74" H="58" X="28" Y="153" C="1" N="" /><S T="12" P="0,0,0.3,0.2,0,0,0,0" L="42" H="42" X="775" Y="55" C="4" N="" /><S T="17" P="0,0,0.3,0.2,0,0,0,0" L="26" H="10" X="294" Y="368" C="4" N="" /><S T="19" P="0,0,0.3,0,0,0,0,0" L="106" H="58" X="501" Y="335" C="4" /><S T="13" P="0,0,0.3,0.2,0,0,0,0" L="74" H="10" X="473" Y="173" C="1" /><S T="3" P="0,0,0,20,0,0,0,0" L="74" H="58" X="355" Y="6" C="2" N="" /><S T="6" P="0,0,0.3,0.2,0,0,0,0" L="10" H="58" X="385" Y="331" C="4" /><S T="4" P="0,0,20,0.2,0,0,0,0" L="10" H="42" X="223" Y="360" C="1" N="" /><S T="19" P="0,0,0.3,0,0,0,0,0" L="26" H="42" X="60" Y="182" C="2" N="" /><S T="4" P="0,0,20,0.2,0,0,0,0" L="122" H="26" X="365" Y="160" C="4" /><S T="3" P="0,0,0,20,0,0,0,0" L="122" H="10" X="439" Y="309" C="3" N="" /><S T="3" P="0,0,0,20,0,0,0,0" L="74" H="42" X="456" Y="215" C="1" /><S T="2" P="0,0,0,1.2,0,0,0,0" L="26" H="10" X="391" Y="38" C="2" /><S T="17" P="0,0,0.3,0.2,0,0,0,0" L="74" H="42" X="538" Y="77" C="4" N="" /><S T="11" P="0,0,0.05,0.1,0,0,0,0" L="106" H="26" X="674" Y="264" C="1" N="" /><S T="12" P="0,0,0.3,0.2,0,0,0,0" L="58" H="42" X="509" Y="320" C="2" N="" /><S T="8" P="0,0,0.3,0.2,0,0,0,0" L="122" H="10" X="118" Y="107" C="2" /><S T="0" P="0,0,0.3,0.2,0,0,0,0" L="90" H="10" X="337" Y="65" C="1" /></S><D><DC X="416" Y="211" /><DS X="337" Y="10" /><F X="20" Y="244" /><T X="202" Y="131" /><P P="0,0" T="158" X="58" Y="114" /><P P="0,0" T="58" X="669" Y="158" /><P P="0,0" T="205" X="293" Y="240" /><P P="0,0" T="201" X="383" Y="275" /><P P="0,0" T="200" X="83" Y="159" /><P P="0,0" T="54" X="720" Y="0" /></D><O /></Z></C>'];
	all_bits = "";

	/* Record start time to check runtime later */
	var startTime = new Date().getTime();
	console.log("Start time: " + startTime)

	/* Process each map in the array in order */
	for (var i = 0; i < secret_games.length; ++i) {
		/* Remove excess characters on the string & splice into grounds and objects/spawns
		secret_game = secret_games[i];
		secret_game = secret_game.slice(14, -17);
		D = secret_game.indexOf("D");
		grounds = secret_game.slice(0, D-5);
		objects = secret_game.slice(D+2);

		/* Process the grounds one at a time */
		running_bits = "";
		count = 0;
		next_start = grounds.indexOf(">");
		while (next_start != -1) {
			one_ground = grounds.slice(0, next_start+1);
			running_bits = extract_ground_bits(one_ground, count);
			all_bits += running_bits;
			grounds = grounds.slice(next_start+1);
			next_start = grounds.indexOf(">");
			count += 1;
		}

		/* Process the spawns one at a time */
		next_start = objects.indexOf(">");
		for (let i = 0; i < 4; ++i) {
			one_spawn = objects.slice(0, next_start+1);
			running_bits = extract_spawn_bits(one_spawn);
			all_bits += running_bits;
			objects = objects.slice(next_start+1);
			next_start = objects.indexOf(">");
		}

		/* Process the objects one at a time */
		count = 0;
		next_start = objects.indexOf(">");
		while (next_start != -1) {
			one_object = objects.slice(0, next_start+1);
			running_bits = extract_object_bits(one_object, count);
			all_bits += running_bits;
			objects = objects.slice(next_start+1);
			next_start = objects.indexOf(">");
			count += 1;
		}
	}

	/* Decode the extracted bits, one character at a time */
	decode_string = "";
	while (all_bits.length > 6) {
		next_char_bits = all_bits.slice(0, 7);
		next_char_code = parseInt(next_char_bits, 2);
		if (next_char_code < 32) {
			break;
		}
		next_char = String.fromCharCode(next_char_code);
		decode_string += next_char;
		all_bits = all_bits.slice(7);
	}

	/* Print out recovered message */
	console.log(decode_string);

	/* Record ending time and compute total time taken */
	var endTime = new Date().getTime();
	console.log("End time: " + endTime)
	var totalTime = endTime - startTime;
	console.log("Total time: " + totalTime);
}

main();