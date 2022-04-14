/* Used for extending bits to necessary length */
function pad_bits(bits, len) {
	while (bits.length < len) {
		bits = bits + "0";
	}
	return bits;
}

/* Given type of ground needed (num) return appropriate P tag */
function ground_nums(num) {
	switch (num) {
	case 0:
		return 'P="0,0,0.3,0.2,0,0,0,0" ';
	case 1:
		return 'P="0,0,0,0.2,0,0,0,0" ';
	case 2:
		return 'P="0,0,0,1.2,0,0,0,0" ';
	case 3:
		return 'P="0,0,0,20,0,0,0,0" ';
	case 4:
		return 'P="0,0,20,0.2,0,0,0,0" ';
	case 5:
		return 'P="0,0,0.3,0.2,0,0,0,0" ';
	case 6:
		return 'P="0,0,0.3,0.2,0,0,0,0" ';
	case 7:
		return 'P="0,0,0.3,0.2,0,0,0,0" ';
	case 8:
		return 'P="0,0,0.3,0.2,0,0,0,0" ';
	case 9:
		return 'P="0,0,0.3,0,0,0,0,0" ';
	case 10:
		return 'P="0,0,0.1,0.2,0,0,0,0" ';
	case 11:
		return 'P="0,0,0.3,0.2,0,0,0,0" ';
	case 12:
		return 'P="0,0,0.3,0,0,0,0,0" ';
	case 13:
		return 'P="0,0,0.05,0.1,0,0,0,0" ';
	case 14:
		return 'P="0,0,0.3,0.2,0,0,0,0" ';
	case 15:
		return 'P="0,0,0.3,0.2,0,0,0,0" ';
	default:
		console.log("Error. Invalid number");
		return '5';
	}
}

/* Game does not actuall use 1-16 for t values. This function adjusts t appropriately */
function convert_t_val(t_val) {
	if (6 < t_val && t_val < 10) {
		t_val += 10;
	} else if (9 < t_val && t_val < 12) {
		t_val -= 3;
	} else if (t_val > 11) {
		t_val -= 2;
	} else {
		t_val = t_val;
	}
	return t_val;
}

/* Ensure that h and l are at least 10 units while leaving bits recoverable */
function adjust_h_l(size) {
	size = size*16;
	size += 10;
	return size;
}

/* Cyclically modify x and y coords to adjust off of different corners */
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

/* Extract "len" bits from the given bitstring (bits) & convert to base 10 */
function bit_extract(len, bits) {
	piece = bits.slice(0, len);
	int_piece = parseInt(piece, 2);
	bits = bits.slice(len);
	return [int_piece, bits];
}

/* Build a ground piece using the given bitstring (bin_secret) and ground count (count) */
function build_ground(bin_secret, count) {
	first_ground = '<S ';
	[t_val, bin_secret] = bit_extract(4, bin_secret);
	ground = ground_nums(t_val);
	real_t_val = convert_t_val(t_val);
	first_ground = first_ground + 'T="' + real_t_val + '" ' + ground;
	[L_val, bin_secret] = bit_extract(3, bin_secret);
	L_val = adjust_h_l(L_val);
	first_ground = first_ground + 'L="' + L_val + '" ';
	[H_val, bin_secret] = bit_extract(2, bin_secret);
	H_val = adjust_h_l(H_val);
	first_ground = first_ground + 'H="' + H_val + '" ';
	[X_val, bin_secret] = bit_extract(9, bin_secret);
	X_val = adjust_x_y(X_val, true, count%4);
	first_ground = first_ground + 'X="' + X_val + '" ';
	[Y_val, bin_secret] = bit_extract(8, bin_secret);
	Y_val = adjust_x_y(Y_val, false, count%4);
	first_ground = first_ground + 'Y="' + Y_val + '" ';
	[C_val, bin_secret] = bit_extract(2, bin_secret);
	C_val += 1
	first_ground = first_ground + 'C="' + C_val + '" ';
	N_bit = bin_secret[0];
	bin_secret = bin_secret.slice(1);
	if (N_bit == 1) {
		first_ground = first_ground + 'N="" ';
	}
	first_ground += '/>';
	return [first_ground, bin_secret];
}

/* Build a object using the given bitstring (bin_secret) and object count (count) */
function build_object(bin_secret, count) {
	base = '<P P="0,0" ';
	[t_val, bin_secret] = bit_extract(8, bin_secret);
	base = base + 'T="' + t_val + '" ';
	[X_val, bin_secret] = bit_extract(9, bin_secret);
	X_val = adjust_x_y(X_val, true, count%4);
	base = base + 'X="' + X_val + '" ';
	[Y_val, bin_secret] = bit_extract(8, bin_secret);
	Y_val = adjust_x_y(Y_val, false, count%4);
	base = base + 'Y="' + Y_val + '" />';
	return [base, bin_secret];
}

/* Build the spawn points using the given bitstring (binsecret) */
function build_spawns(bin_secret) {
	tag_set = ["DC", "DS", "F", "T"]
	full_tags = "";
	for (const tag of tag_set) {
		base = '<' + tag + ' ';
		[x_val, bin_secret] = bit_extract(9, bin_secret);
		base = base + 'X="' + x_val + '" ';
		[Y_val, bin_secret] = bit_extract(8, bin_secret);
		base = base + 'Y="' + Y_val + '" />';
		full_tags += base;
	}
	return [full_tags, bin_secret];
}

function main() {
	/* Static values for the secret in ascii and binary */
	var secret = "Daddy don't you walk so fast. My darling cri-ied. Daddy don't you walk SO FAST! She said: slow down SOME"
	bin_secret = ""

	/* Record time for use in measuring speed */
	var startTime = new Date().getTime();
	console.log("Start time: " + startTime)

	/* Convert message one character at a time */
	console.log("Converting message");
	for (var i = 0; i < secret.length; ++i) {
		bin_i = secret[i].charCodeAt().toString(2);
		while (bin_i.length < 7){
			bin_i = "0" + bin_i;
		}
		bin_secret += bin_i;
	}

	/* Necessary variables */
	var bitCount = bin_secret.length;
	pre = "<C><P /><Z><S>";
	post = "<O /></Z></C>";
	all_maps = [];

	/* Keep building maps as long as there are more bits */
	while (bin_secret.length != 0) {
		/* More variables */
		running_total = pre;
		ground_count = 0;
		objects_needed = 1;
		spawn_buffer = 68;

		/* Build ground until all remaining bits are needed for spawns & objects
		while (bin_secret.length-objects_needed*25-spawn_buffer > 28 && ground_count < 25) {
			[next_ground, bin_secret] = build_ground(bin_secret, ground_count);
			running_total += next_ground;
			ground_count += 1;
			if (ground_count%4 == 0) {
				objects_needed += 1;
			}
		}

		/* Build the spawns */
		running_total += "</S><D>";
		[all_spawns, bin_secret] = build_spawns(bin_secret);
		running_total += all_spawns;

		/* Build objects until all needed objects are made or there are no more bits */
		for (let i = 0; i < objects_needed; ++i) {
			if (bin_secret.length < 25) {
				bin_secret = pad_bits(bin_secret, 25);
			}
			[next_object, bin_secret] = build_object(bin_secret, i);
			running_total += next_object;			
		}

		/* If there are very few bits left, make another object */
		if (bin_secret.length < 25) {
			bin_secret = pad_bits(bin_secret, 25);
			[next_object, bin_secret] = build_object(bin_secret, objects_needed);
			running_total += next_object;
		}

		/* Close the current map and add it to the list of maps */
		running_total += "</D>"
		running_total += post;
		console.log(running_total);
		all_maps.push(running_total);
	}

	/* Record final time and compute total time taken */
	var endTime = new Date().getTime();
	console.log("End time: " + endTime)
	var totalTime = endTime - startTime;
	console.log("Total time: " + totalTime);
}

main();