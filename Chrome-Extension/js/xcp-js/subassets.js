function getParentParam(issuances, callback){
    
    issuance_array = issuances.data;
    
    if(issuance_array.length > 1) {
    
        //sort ascending by block
        issuance_array.sort(function(a, b){
         return a.block-b.block
        })
    
    }

    var parray = [];
    
//    console.log(issuance_array);
    
    for (var i = 0; i < issuance_array.length; i++) {

        var desc = issuance_array[i].description;
        var block = issuance_array[i].block;

        if (desc.indexOf(";;") >= 0) {  
            
            desc_array = desc.split(";;");
            
            if(desc_array[1].substr(0,1) == "p") {
                
                var p = desc_array[1].substr(1);
                
                var p_object = {p: p, block: block};
                
                parray.push(p_object);
                
            }
            
        }

    }
   
    if(parray.length > 0){
        var parent = parray[0].p;
    } else {
        var parent = "error";
    }
    
    callback(parent);
      
}

function getReferenceChildParam(issuances, reference, callback){
    
    issuance_array = issuances.data;
    
    if(issuance_array.length > 1) {
    
        //sort ascending by block
        issuance_array.sort(function(a, b){
         return a.block-b.block
        })
    
    }

    var rcarray = [];
    
 //   console.log(issuance_array);
    
    for (var i = 0; i < issuance_array.length; i++) {

        var desc = issuance_array[i].description;
        var block = issuance_array[i].block;

        if (desc.indexOf(";;") >= 0) {  
            
            desc_array = desc.split(";;");
            
  //          console.log(desc_array);  
            
            if(desc_array[1].substr(0,1) == "r") {
                
                if(desc_array[1].slice(-1) == "x") {
                
                    var locked = true;
                    
                    desc_array[1] = desc_array[1].slice(0, -1);
                    
                } else {
                    
                    var locked = false;
                    
                }

                var rc = desc_array[1].substr(1).split("c");
                
                var letterNumber = /^[0-9A-Z]+$/;  
                
                if (rc[1].length > 0 && rc[1].length <= 12 && rc[1].match(letterNumber)){
                
                    var rc_object = {r: rc[0], c: rc[1], locked: locked, block: block};

                    rcarray.push(rc_object);
                    
                }
                
            } 
            
        }

    }
    
//    console.log(rcarray);
    
//    var rcarray = [{r: "A11102651893268768391", c: "FREECOFFEE", block: 394561},{r: "A11126444959828132976", c: "FREECOOKIE", block: 394693},{r: "A11102651893268768391", c: "FREECOFFEE", block: 394700},{r: "A11126444959828132976", c: "FREECOOKIE", block: 394800},{r: "A11102651893268768391", c: "FREEPOOP", block: 394900},{r: "A11102651893268768391", c: "FREEBUTTS", block: 395000}];
    
    for( var i = 0; i < rcarray.length; i++){
        //remove any newer duplicate reference assets
        for( var x = i+1; x < rcarray.length; x++){
            if( rcarray[x].r == rcarray[i].r ){
                rcarray.splice(x,1);
                --x;
            }
        }
        //remove any newer duplicate child names
        for( var x = i+1; x < rcarray.length; x++){
            if( rcarray[x].c == rcarray[i].c ){
                rcarray.splice(x,1);
                --x;
            }
        }
    }
    

    var obj = rcarray.filter(function ( obj ) {
        return obj.r === reference;
    })[0];

    if(obj != undefined) {
        var locked = obj.locked;
        var child = obj.c;
    } else {
        var child = "error";
        var locked = "error";
    }
    
    callback(child, locked);
      
}

function findIssuances(reference, callback)
{
    var xcp_source_html = "https://counterpartychain.io/api/issuances/"+reference;
    
    $.getJSON( xcp_source_html, function( data ) {  
        
        if (data.success == 1) {
            
            callback(data);   
            
        } else {
            
            callback("error");
            
        }
        
    })
}


function findSubasset(numeric, callback) {
    //A11102651893268768391
    findIssuances(numeric, function(data){
        
        getParentParam(data, function(parent){
            
            findIssuances(parent, function(data){
            
                getReferenceChildParam(data, numeric, function(child, locked){
                    if(child != "error"){
                        var subasset = parent+"."+child;
                    } else {
                        var subasset = "error";
                    }
                    
                    callback(subasset, locked);
                    
                });
        
            });
        
        });
        
    });    

}


function findSubassetGrand(numeric, callback) {
    
    findSubasset(numeric, function(subasset, locked) {
        
        console.log(locked);
        
        if(subasset.substr(0,1) != "A"){
            
            callback(subasset);
            
        } else {
            
            var array = subasset.split(".");
            
            findSubasset(array[0], function(superasset, locked) {
                
                console.log(locked);
                
                if(superasset.substr(0,1) != "A" && locked == false){
                    var combined = superasset + "." + array[1];   
                    callback(combined);   
                } else {
                    callback("error");
                }

            })
            
        }
        
    });


}



