function analyseBT(x){
    var torrent=bdecode(x);
    var encoding=torrent.encoding||"utf-8";
    if (torrent.info['name.utf-8']!=undefined) {
        encoding="utf-8";
    }
    encoding=encoding.toLowerCase();
    torrent.data={};

    if (torrent.info!=undefined && torrent.info.name!=undefined) {
        torrent.name=torrent.info['name.utf-8']||torrent.info.name;
    }else if(torrent.info.files!=undefined && torrent.info.files[0].path!=undefined){
        var i=torrent.info.files[0].path.length-1;
        torrent.name=torrent.info.files[0]['path.utf-8'][i]||torrent.info.files[0].path[i];
    }
    if (typeof(JsEncoding)!="undefined") {
        torrent.name=JsEncoding.GetString(bin2hex(torrent.name),encoding)
        torrent.data.hash=bin2hex(getInfoBin(x))
    }else{ 
        if(encoding=='utf-8'){
            torrent.name=hex2str(bin2hex(torrent.name))
        }
        torrent.data.hash=sha1File(getInfoBin(x))
    }

    
    torrent.data.name=torrent.name;
    torrent.data.size=Long.ZERO;
    torrent.data.date=torrent['creation date']||0;
    torrent.data.files=[];

    if(torrent.info.files!=undefined){
        torrent.info.files.forEach(function(v,k){
            torrent.data.files[k]={};
            torrent.data.files[k].index=k;
            if (v['path.utf-8']!=undefined){
                v.path=v['path.utf-8'];
                encoding='utf-8';
            }
            torrent.data.files[k].name=(v.path.join('/'));
            torrent.data.files[k].size=v.length;
            if(v.ed2k!=undefined){
                torrent.data.files[k].ed2k=bin2hex(v.ed2k);
            }
            if(v.md5!=undefined){
                torrent.data.files[k].md5=bin2hex(v.ed2k);
            }
            if (v.filehash!=undefined) {
                torrent.data.files[k].filehash=bin2hex(v.filehash);
            }
            if (typeof(JsEncoding)!="undefined") {
                torrent.data.files[k].name=JsEncoding.GetString(bin2hex(torrent.data.files[k].name),encoding)
            }else if(encoding=='utf-8'){
                torrent.data.files[k].name=hex2str(bin2hex(torrent.data.files[k].name))
            }
            if (v.path[0].substring(0,18)!="_____padding_file_") {
                torrent.data.size=torrent.data.size.add(v.length);
            }

        });
    }else{
        var k=0;
        var v=torrent.info;
        if (v['name.utf-8']!=undefined){
            encoding='utf-8';
            v.name=v['name.utf-8'];
        }
        torrent.data.files[k]={};
        torrent.data.files[k].index=k;
        torrent.data.files[k].name=(v.name);
        torrent.data.files[k].size=v.length;
        
        
        if(v.ed2k!=undefined){
            torrent.data.files[k].ed2k=bin2hex(v.ed2k);
        }
        if(v.md5!=undefined){
            torrent.data.files[k].md5=bin2hex(v.ed2k);
        }
        if (v.filehash!=undefined) {
            torrent.data.files[k].filehash=bin2hex(v.filehash);
        }   
        if (typeof(JsEncoding)!="undefined") {
            torrent.data.files[k].name=JsEncoding.GetString(bin2hex(torrent.data.files[k].name),encoding)
        }else if(encoding=='utf-8'){
            torrent.data.files[k].name=hex2str(bin2hex(torrent.data.files[k].name))
        }
        torrent.data.size=torrent.data.size.add(v.length);
    }
    torrent.data.size=torrent.data.size.toString();
    
    if (typeof(JsEncoding)!="undefined") {
        return JSON.stringify(torrent.data);
    }else{
        return torrent;
    }
}
function getInfoBin(x){
    var ori=x;
    var pos=x.indexOf("4:info")+6;
    var _pos=pos;
    var pos_=pos;
    var count=0;
    x=x.substring(pos);
    do{
        var tag=x.substring(0,1);
        switch(tag){
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                pos=x.indexOf(":");
                pos+=parseInt(x.substring(0,pos))+1;
                x=x.substring(pos);
                pos_+=pos;
                break;
            case 'l':
            case 'd':
                count++;
                x=x.substring(1);
                pos_+=1;
                break;
            case 'i':
                pos=x.indexOf("e");
                x=x.substring(pos+1);
                pos_+=pos+1;
                break;
            case 'e':
                count--;
                x=x.substring(1);
                pos_+=1;
                break;
        }    
    }while(count>0);
    //console.log(ori.substring(_pos,pos_))
    //console.log(ori.substring(pos_))
    return ori.substring(_pos,pos_);
}
/*
 * Author: Demon
 * Website: http://demon.tw
 * Email: 380401911@qq.com
 */
function decode_int(x, f) {
    f++;
    var newf = x.indexOf('e', f);
    var n = (x.substring(f,newf));
    if (x.charAt(f) == '-' && x.charAt(f+1) == '0') {
        throw("ValueError");
    } else if (x.charAt(f) == '0' && newf != f+1) {
        throw("ValueError");
    }
    return [n, newf+1];
}

function decode_string(x, f) {
    var colon = x.indexOf(':', f);
    var n = parseInt(x.substring(f,colon));
    if (x.charAt(f) == '0' && colon != f+1) {
        throw("ValueError");
    }
    colon++;
    return [x.substring(colon,colon+n), colon+n];
}

function decode_list(x, f) {
    var r = []; f++;
    while (x.charAt(f) != 'e') {
        var a = decode_func[x.charAt(f)](x, f);
        var v = a[0]; f = a[1];
        r.push(v);
    }
    return [r, f + 1];
}

function decode_dict(x, f) {
    var r = {}; f++;
    while (x.charAt(f) != 'e') {
        var a = decode_string(x, f);
        var k = a[0]; f = a[1];
        a = decode_func[x.charAt(f)](x, f)
        r[k] = a[0]; f = a[1];
    }
    return [r, f + 1];
}

decode_func = {};
decode_func['l'] = decode_list;
decode_func['d'] = decode_dict;
decode_func['i'] = decode_int;
decode_func['0'] = decode_string;
decode_func['1'] = decode_string;
decode_func['2'] = decode_string;
decode_func['3'] = decode_string;
decode_func['4'] = decode_string;
decode_func['5'] = decode_string;
decode_func['6'] = decode_string;
decode_func['7'] = decode_string;
decode_func['8'] = decode_string;
decode_func['9'] = decode_string;

// x is a string containing bencoded data, 
// where each charCodeAt value matches the byte of data
function bdecode(x) {
    try {
        var a = decode_func[x.charAt(0)](x, 0);
        var r = a[0]; var l = a[1];
    } catch(e) {
        throw("not a valid bencoded string");
    }
    if (l != x.length) {
        throw("invalid bencoded value (data after valid prefix)");
    }
    return r;
}

/*
 * Author: Demon
 * Website: http://demon.tw
 * Email: 380401911@qq.com
 */

function encode_int(x,r) {
    r.push('i'); r.push(x+''); r.push('e');
}

function encode_string(x,r) {
    r.push(x.length+''); r.push(':'); r.push(x);
}

function encode_list(x,r) {
    r.push('l');
    for (var i in x){
        var type = typeof(x[i]);
        type = (type == 'object') ? ((x[i] instanceof Array) ? 'list' : 'dict') : type;
        encode_func[type](x[i], r)
    }
    r.push('e');
}

function encode_dict(x,r) {
    r.push('d');
    var keys = [], ilist = {};
    for (var i in x) {
        keys.push(i);
    }
    keys.sort();
    for (var j in keys) {
        ilist[keys[j]] = x[keys[j]];
    }
    for (var k in ilist) {
        r.push(k.length+''); r.push(':'); r.push(k);
        var v = ilist[k];
        var type = typeof(v);
        type = (type == 'object') ? ((v instanceof Array) ? 'list' : 'dict') : type;
        encode_func[type](v, r);
    }
    r.push('e');
}

encode_func = {};
encode_func['number']  = encode_int;
encode_func['string']  = encode_string;
encode_func['list']    = encode_list;
encode_func['dict']    = encode_dict;

function bencode(x) {
    var r = [];
    var type = typeof(x);
    type = (type == 'object') ? ((x instanceof Array) ? 'list' : 'dict') : type;
    encode_func[type](x, r);
    return r.join('');
}