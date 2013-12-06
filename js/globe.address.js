
//https://raw.github.com/globejs/globejs-lib/09e8c6e184d6501a0c2c59d73ca64db5c0d3eb95/src/address.js
Globe.Address = function (bytes) {
	if ("string" == typeof bytes) {
		bytes = Globe.Address.decodeString(bytes);
	}
	this.hash = bytes;
	this.version = Globe.Address.networkVersion;
};

Globe.Address.networkVersion = 0x00; // mainnet

/**
* Serialize this object as a standard Globe address.
*
* Returns the address as a base58-encoded string in the standardized format.
*/
Globe.Address.prototype.toString = function () {
	// Get a copy of the hash
	var hash = this.hash.slice(0);

	// Version
	hash.unshift(this.version);
	var checksum = Globe.Util.dsha256(hash);
	var bytes = hash.concat(checksum.slice(0, 4));
	return Globe.Base58.encode(bytes);
};

Globe.Address.prototype.getHashBase64 = function () {
	return Crypto.util.bytesToBase64(this.hash);
};

/**
* Parse a Globe address contained in a string.
*/
Globe.Address.decodeString = function (string) {
	var bytes = Globe.Base58.decode(string);
	var hash = bytes.slice(0, 21);
	var checksum = Globe.Util.dsha256(hash);

	if (checksum[0] != bytes[21] ||
	checksum[1] != bytes[22] ||
	checksum[2] != bytes[23] ||
	checksum[3] != bytes[24]) {
		throw "Checksum validation failed!";
	}

	var version = hash.shift();

	if (version != 0) {
		throw "Version " + version + " not supported!";
	}

	return hash;
};