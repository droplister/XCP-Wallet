
function padprefix(str, max) {   
    
    str = str.toString();
    return str.length < max ? padprefix('0' + str, max) : str;   
    
}

 
function checkDivisibility(asset, callback) {
    var xcp_source_html = "https://counterpartychain.io/api/asset/"+asset;
    
    var result;
    
    $.getJSON( xcp_source_html, function( data ) {  
        
        if (data.success == 1) {
          
            var divisibility = data.divisible;
            
            if(divisibility == 1) {
                result = "true"; 
            } else {
                result = "false";
            }
            
        } else {
            
            result = "error";
            
        }
        
        callback(result);
        
    })
}


    
chrome.storage.local.get(function(data) {
    
    console.log(data["chainso_detect"]);
        
    if(data["chainso_detect"] == 'yes') { 

        $('kbd').each(function(i, obj) {

            if (i == 0) {

                console.log($(this).text());

                var txid = $(this).text();

                get_xcp_encoded_opreturn(txid, function(utxo_hash, data_chunk, sendaddress, confirmation_text){

                    console.log(data_chunk);

                    //$("#arc").html(data_chunk);
                    // check for 'CNTRPRTY'
                    var counterparty_prefix = data_chunk.substring(2, 18);
                    if (counterparty_prefix != '434e545250525459') { return; }

                    // check for a send (action type 00000000)
                    var action_type = data_chunk.substring(18, 26);
                    if (action_type == '00000000') { 

                        var asset = data_chunk.substring(26, 42);
                        var amount = data_chunk.substring(42, 58);

                        //var asset_dec = parseInt(asset, 16);
                        var asset_dec = hexToDec(asset);

                        console.log(asset_dec);
                        var amount_dec = hexToDec(amount) / 100000000;
                        console.log("asset id: "+asset_dec);

                        var numeric_lowerlimit = Math.pow(26, 12) + 1;

                        console.log(numeric_lowerlimit);

                        if (asset_dec > numeric_lowerlimit) {

                            var assetnamed = "A"+asset_dec;

                            console.log(assetname(asset_dec));

                        } else {

                            var assetnamed = assetname(asset_dec);    

                        }

                        console.log(assetnamed);

                        var source_html = "https://counterpartychain.io/api/asset/"+assetnamed;

                    //    loadBvam(function(bvamdata, hashname, hashhash){

                            $.getJSON( source_html, function( data ) {

                                if (data.divisible == 0) { amount_dec = Math.round(amount_dec * 100000000); }

                                console.log(assetnamed.substr(0,1));

                                if (assetnamed.substr(0,1) != "A") {

                                    $( "<div align='center' style='padding: 10px; background-color: #000;  border: solid 10px #000; border-radius: 15px; box-shadow: 10px 10px 10px -2px rgba(0,0,0,0.25); color: #fff; margin: 20px auto 40px auto; width: 480px;'><div class='row'><div class='col-xs-12'><div class='lead' style='font-weight: bold;'>Asset Transaction Detected!</div><div style='margin-bottom: 15px;'>"+confirmation_text+"</div></div></div><div class='row' style='background-color: #fff; color: #000; padding-top: 10px; border: solid 3px #ED1650;'><div class='col-xs-6'><p align='center'>Asset:</p><p style='font-size: 24px; font-weight: bold; color: #ED1650;'>"+assetnamed+"</p></div><div class='col-xs-6'><p align='center'>Amount Sent:</p><p style='font-size: 24px; font-weight: bold; color: #ED1650;' >"+amount_dec+"</p></div><p style='font-size: 16px; padding-top: 30px;' >Sent to: <a href='https://counterpartychain.io/transaction/"+txid+"'>"+sendaddress+"</a></p></div><div align='center' class='small' style='margin: 10px 0 -10px 0;'>Counterparty Data parsed by XCP Wallet</div></div>" ).insertAfter( ".row:first" );

                                } else {

                                    findSubassetGrand(assetnamed, function(subasset) {

                                        if(subasset != "error" && subasset != undefined) {

                                            var subasset_lb = subasset.replace(/\./g, "<br>");

                                            $( "<div align='center' style='padding: 10px; background-color: #000;  border: solid 10px #000; border-radius: 15px; box-shadow: 10px 10px 10px -2px rgba(0,0,0,0.25); color: #fff; margin: 20px auto 40px auto; width: 480px;'><div class='row'><div class='col-xs-12'><div class='lead' style='font-weight: bold;'>Asset Transaction Detected!</div><div style='margin-bottom: 15px;'>"+confirmation_text+"</div></div></div><div class='row' style='background-color: #fff; color: #000; padding-top: 10px; border: solid 3px #ED1650;'><div class='col-xs-6'><p align='center'>Asset:</p><p style='font-size: 16px; line-height: 24px; font-weight: bold; color: #ED1650;'>"+subasset_lb+"</p></div><div class='col-xs-6'><p align='center'>Amount Sent:</p><p style='font-size: 24px; font-weight: bold; color: #ED1650;' >"+amount_dec+"</p></div><div style='font-size: 16px; padding: 15px 0 15px 0;' class='col-xs-12' >Sent to: <a href='https://counterpartychain.io/transaction/"+txid+"'>"+sendaddress+"</a></div></div><div align='center' class='small' style='margin: 10px 0 -10px 0;'>Counterparty Data parsed by XCP Wallet</div></div>" ).insertAfter( ".row:first" );

                                        } else {

                                            $( "<div align='center' style='padding: 10px; background-color: #000;  border: solid 10px #000; border-radius: 15px; box-shadow: 10px 10px 10px -2px rgba(0,0,0,0.25); color: #fff; margin: 20px auto 40px auto; width: 480px;'><div class='row'><div class='col-xs-12'><div class='lead' style='font-weight: bold;'>Asset Transaction Detected!</div><div style='margin-bottom: 15px;'>"+confirmation_text+"</div></div></div><div class='row' style='background-color: #fff; color: #000; padding-top: 10px; border: solid 3px #ED1650;'><div class='col-xs-6'><p align='center'>Asset:</p><p style='font-size: 16px; line-height: 24px; font-weight: bold; color: #ED1650;'>"+assetnamed+"</p></div><div class='col-xs-6'><p align='center'>Amount Sent:</p><p style='font-size: 24px; font-weight: bold; color: #ED1650;' >"+amount_dec+"</p></div><p style='font-size: 16px; padding-top: 30px;' >Sent to: <a href='https://counterpartychain.io/transaction/"+txid+"'>"+sendaddress+"</a></p></div><div align='center' class='small' style='margin: 10px 0 -10px 0;'>Counterparty Data parsed by XCP Wallet</div></div>" ).insertAfter( ".row:first" );

                                        }


                                    });



                                }

                            });
                        
                        } else if(action_type == '0000000a') {  
                            
//                            00098b174a7d3945  = Asset to Sell = 2686206940625221 = TATIANACOIN (hex to dec)
//                            00000022ecb25c00  = Amount to Sell = 150000000000 (hex to dec)
//                            0000000000000001  = Asset to Buy = 1 = XCP (hex to dec)
//                            0000000035a4e900  = Amount to Buy = 900000000 (hex to dec)

                            var asset_tosell_hex = data_chunk.substring(26, 42);
                            var amount_tosell_hex = data_chunk.substring(42, 58);

                            var asset_tobuy_hex = data_chunk.substring(58, 74);                            
                            var amount_tobuy_hex = data_chunk.substring(74, 90);
                            
                            var asset_tosell = assetname(hexToDec(asset_tosell_hex));
                            var asset_tobuy = assetname(hexToDec(asset_tobuy_hex));    
                             
                            checkDivisibility(asset_tosell, function(div){
                                
                                if(div == "true") {
                                    var amount_tosell = parseFloat(hexToDec(amount_tosell_hex)) / 100000000;
                                } else {
                                    var amount_tosell = hexToDec(amount_tosell_hex);
                                }
                                
                                checkDivisibility(asset_tobuy, function(div){
                                
                                    if(div == "true") {
                                        var amount_tobuy = parseFloat(hexToDec(amount_tobuy_hex)) / 100000000;
                                    } else {
                                        var amount_tobuy = hexToDec(amount_tobuy_hex);
                                    }
                            
                            
                                //checkDivisibility(asset, callback)
                            
                                    $( "<div align='center' style='padding: 10px; background-color: #000;  border: solid 10px #000; border-radius: 15px; box-shadow: 10px 10px 10px -2px rgba(0,0,0,0.25); color: #fff; margin: 20px auto 40px auto; width: 480px;'><div class='row'><div class='col-xs-12'><div class='lead' style='font-weight: bold;'>Asset Order Detected!</div><div style='margin-bottom: 15px;'>"+confirmation_text+"</div></div></div><div class='row' style='background-color: #fff; color: #000; padding-top: 10px; border: solid 3px #ED1650;'><div class='col-xs-6'><p align='center'>Asset to Sell:</p><p style='font-size: 16px; line-height: 24px; font-weight: bold; color: #ED1650;'>"+asset_tosell+"</p><p align='center'>Amount to Sell:</p><p style='font-size: 16px; line-height: 24px; font-weight: bold; color: #ED1650;'>"+amount_tosell+"</p></div><div class='col-xs-6'><p align='center'>Asset to Buy:</p><p style='font-size: 16px; line-height: 24px; font-weight: bold; color: #ED1650;' >"+asset_tobuy+"</p><p align='center'>Amount to Buy:</p><p style='font-size: 16px; line-height: 24px; font-weight: bold; color: #ED1650;' >"+amount_tobuy+"</p></div></div><div align='center' class='small' style='margin: 10px 0 -10px 0;'>Counterparty Data parsed by XCP Wallet</div></div>" ).insertAfter( ".row:first" );
                                })
                                
                            })
                            
                        } else {
                         
                         return;   
                            
                        }
                });
                
            }
            
        });

            
        }
});


function get_xcp_encoded_opreturn(tx_id, callback) {
    
    
    var source_html = "https://chain.so/api/v2/get_tx/BTC/"+tx_id;
    //var source_html = "https://blockchain.info/rawtx/"+tx_id+"?format=json&cors=true";
    
    var target_tx = new Array(); 
     
    $.getJSON( source_html, function( target_tx ) {
        
        var tx_index = target_tx.data.inputs[0].from_output.txid;
        //var tx_index = target_tx.inputs[0].prev_out.tx_index;
        
        //console.log(tx_index);
            
        var target_address = target_tx.data.outputs[0].address;
        
        var confirmations = target_tx.data.confirmations;
        
        if (confirmations == 0) {
            var confirmation_text = "Unconfirmed";
        } else if (confirmations == 1) {
            var confirmation_text = "1 confirmation";
        } else {
            var confirmation_text = confirmations + " confirmations";
        }
        
        $.each(target_tx.data.outputs, function(i, item) {
            
            
            
            if ((target_tx.data.outputs[i].address == "nonstandard")){
                var target_script = target_tx.data.outputs[i].script;
                var xcp_pubkey_data = target_script.substring(10);
                

                
                var source_html_tx_index = "https://chain.so/api/v2/get_tx/BTC/"+tx_index;
    
                    $.getJSON( source_html_tx_index, xcp_pubkey_data, function( data ) {
        
                        //console.log(data.hash);
                        //console.log(xcp_pubkey_data);
        
                        var xcp_decoded = xcp_rc4(data.data.txid, xcp_pubkey_data);

			            xcp_decoded = "1c"+xcp_decoded; //add first byte to simulate OP_CHECKMULTISIG
        
                        callback(data.data.txid, xcp_decoded, target_address, confirmation_text);
        
                    });
                
            }
            
            
        });
            
    });
        
}




function rc4(key, str) {
	
    //https://gist.github.com/farhadi/2185197
    
    var s = [], j = 0, x, res = '';
	for (var i = 0; i < 256; i++) {
		s[i] = i;
	}
	for (i = 0; i < 256; i++) {
		j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
		x = s[i];
		s[i] = s[j];
		s[j] = x;
	}
	i = 0;
	j = 0;
	for (var y = 0; y < str.length; y++) {
		i = (i + 1) % 256;
		j = (j + s[i]) % 256;
		x = s[i];
		s[i] = s[j];
		s[j] = x;
		res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
	}
	return res;
    
}


function xcp_rc4(key, datachunk) {
    
    return bin2hex(rc4(hex2bin(key), hex2bin(datachunk)));
    
}

function hex2bin(hex) {

        var bytes = [];
        var str;
        
        for (var i = 0; i < hex.length - 1; i += 2) {

                var ch = parseInt(hex.substr(i, 2), 16);
                bytes.push(ch);

        }

        str = String.fromCharCode.apply(String, bytes);
        return str;
    
};

function bin2hex(s) {

        // http://kevin.vanzonneveld.net

        var i, l, o = "",
                n;

        s += "";

        for (i = 0, l = s.length; i < l; i++) {
                n = s.charCodeAt(i).toString(16);
                o += n.length < 2 ? "0" + n : n;
        }

        return o;
    
}; 

function assetname(assetid) {

    if(assetid != 1){
    
        var b26_digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
        var letter_array = b26_digits.split("");
        var asset_name = "";
        var div;
        var rem;
        
        var rem_bigint;
        var div_bigint;
        var div_bigint_parsed;
        var rem_bigint_parsed;
        
        
        while (assetid > 0) { 

//            if (assetid >= 9007199254740992) {
                
              
            
           // console.log(BigIntegerSM.toJSValue(BigIntegerSM.divideAndRemainder(57044491945578590, 26)));
                
                var assetid_bigint = BigIntegerSM(assetid);

                div_bigint = BigIntegerSM(assetid_bigint).divide(26);
//                div_bigint_parsed = div_bigint.toString(16);                
////                console.log(div_bigint_parsed);              
//                div = parseInt(div_bigint_parsed);
                div = Math.floor(BigIntegerSM.toJSValue(div_bigint)); 
                
              //  console.log(div);

                rem_bigint = BigIntegerSM(assetid_bigint).remainder(26);
//                rem_bigint_parsed = rem_bigint.toString(16);
//                rem = parseInt(rem_bigint_parsed);
                rem = BigIntegerSM.toJSValue(rem_bigint);
                
           //     console.log(rem);
                
//            } else {
//
//                div = assetid/26);
//                rem = assetid % 26;
//                
//            }
            
            assetid = div;
            
            asset_name = asset_name + letter_array[rem];
            
        }    
        
        var final_name = asset_name.split("").reverse().join("");
    
    } else {
        
        var final_name = "XCP";
        
    }
    
    return final_name;
    
}

function validateEnhancedAssetJSON(jsondata) {

    var jsonstring = JSON.stringify(jsondata);

    console.log(jsonstring);
    
    var firstSHA = Crypto.SHA256(jsonstring)

    var hash160 = Crypto.RIPEMD160(Crypto.util.hexToBytes(firstSHA))
    var version = 0x41 // "T"
    var hashAndBytes = Crypto.util.hexToBytes(hash160)
    hashAndBytes.unshift(version)

    var doubleSHA = Crypto.SHA256(Crypto.util.hexToBytes(Crypto.SHA256(hashAndBytes)))
    var addressChecksum = doubleSHA.substr(0,8)

    var unencodedAddress = "41" + hash160 + addressChecksum

    var address = Bitcoin.Base58.encode(Crypto.util.hexToBytes(unencodedAddress))
    
    return address

}

//function loadBvam(callback) {
//    
//    chrome.storage.local.get(function(data) {
//        
//        if(typeof(data["bvam"]) !== 'undefined') { 
//            
//            var hashname = new Array();
//            
//            var allbvam = data["bvam"];
//            
//            for (var i = 0; i < allbvam.length; i++) {
//                
//                var asset = allbvam[i]["data"]["asset"];
//                var name = allbvam[i]["data"]["assetname"];
//            
//                hashname[asset] = name;
//                 
//            }
//            
//        } else {
//            
//            var allbvam = "";
//            
//        }
//        
//        console.log(hashname);
//        
//        callback(allbvam, hashname);
//        
//    });
//    
//}

function loadBvam(callback) {
    
    chrome.storage.local.get(function(data) {
        
        if(typeof(data["bvam"]) !== 'undefined') { 
            
            var hashname = new Array();
            var hashhash = new Array();
            
            var allbvam = data["bvam"];
            
            for (var i = 0; i < allbvam.length; i++) {
                
                var asset = allbvam[i]["data"]["asset"];
                var name = allbvam[i]["data"]["assetname"];
                var hash = allbvam[i]["hash"];
            
                hashname[asset] = name;
                
                hashhash[asset] = hash;
                 
            }
            
        } else {
            
            var allbvam = "";
            var hashname = "";
            var hashhash = "";
            
        }
        
        console.log(hashname);
        console.log(hashhash);
        
        callback(allbvam, hashname, hashhash);
        
    });
    
}

function addBvam(newbvamdata) {
    
    chrome.storage.local.get(function(data) {
        
        if(typeof(data["bvam"]) === 'undefined') { 
            
            var allbvam = new Array();
            
        } else {
        
            var allbvam = data["bvam"];
            
        }
        
        allbvam = allbvam.concat(newbvamdata);
            
            chrome.storage.local.set(
                    {
                        
                        'bvam': allbvam
                        
                    }, function (){});
                   
    });

}
