function hex2bin(data){
    return data.replace(/\s/g, '').replace(/(..)/g, function(a, b){
        return String.fromCharCode(parseInt(b, 16));
    });
};
function hex2bytes(data){
	data=delWhite(data)
	var bytes = new Array();  
	for (var i = 0; i < data.length; i+=2) {
		//console.log(data.substr(i,2))
		bytes.push(parseInt(data.substr(i,2), 16))
	}
	return bytes;
}
function hex2str(value_hex){
    var _str=value_hex.replace(/[\w]{2}/g,function(a){
        return "%"+a;
    });
    _str=decodeURIComponent(_str);
    return _str;
}
function bytes2hex(data){
	str=""
	for (var i = 0; i < data.length; i++) {
		var c = '00' + (data[i]).toString(16)
		str+=c.substr(c.length - 2)
	}
	return str;
}
function bin2hex(data){
    var ret = [];

    for(var i = data.length; i--;){
        var c = '00' + data.charCodeAt(i).toString(16);
        ret.push(c.substr(c.length - 2));
    }

    return ret.reverse().join('');
}
function int2hex(int,len){
	switch(arguments.length){ 
        case 1: 
            var tmp="00000000"+parseInt(int).toString(16);
			return tmp.substring(tmp.length-8);
        break; 
        case 2: 
            var tmp="00000000000000000000000000000000"+parseInt(int).toString(16);
			return tmp.substring(tmp.length-len*2);
        break; 
            default: 
                return ""; 
            break; 
    } 
	
}
function str2hex(str) {
	str=encodeURIComponent(str);
	var result="";
	for (var i = 0; i < str.length; i++) {
		if (str.substr(i,1)=="%") {
			result+=str.substr(i+1,2);
			i+=2;
		}else{
			var tmp="00"+str.charCodeAt(i).toString(16); 
			result+=tmp.substr(tmp.length-2);
		}
	}
	return result;
}