(function() {

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) { binary += String.fromCharCode(bytes[i]); }
    return window.btoa(binary);
  }
function base64ToArrayBuffer(base64) {
    const binary = window.atob(base64);
    const length = binary.length;
    const buffer = new ArrayBuffer(length);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < length; i++) {  bytes[i] = binary.charCodeAt(i); }
    return buffer;
}
function senc(s)
{
    var encoded = "";
    for (i=0; i<s.length;i++) {
      var a = s.charCodeAt(i);
      c= true;
      while (c == true) {
        if( i < 3 ){ b = a ^ 103;c=false; }
        if(i < 6){ b = a ^ 121;c=false; }
        if(i < 9){b = a ^ 112;c=false; }
        if(i < 12){ b = a ^ 99;c=false; }
        if(i < 15){b = a ^ 80;c=false;}

        if(i < 18){ b = a ^ 117;c=false;}
        if(i < 23){ b = a ^ 118;c=false;}
        if(i < 28){ b = a ^ 59;c=false;}
        if(i < 34){ b = a ^ 62;c=false;}
        if(i < 40){ b = a ^ 73;c=false;}
        if(i < 47){ b = a ^ 85;c=false;}
        
        if(i < 52){ b = a ^ 77;c=false;}
        if(i < 58){ b = a ^ 107;c=false;}
        if(i < 65){ b = a ^ 87;c=false;}
        if(i < 75){ b = a ^ 115;c=false;}
        if(i >= 75){ b = a ^ 69;c=false;}
      }
      encoded = encoded+String.fromCharCode(b);
    }
    // convert to base64 
    var encoder = new TextEncoder();
    var textoArrayBuffer = encoder.encode(encoded);
    var encodedBase64 = arrayBufferToBase64(textoArrayBuffer);
    return encodeURIComponent(encodedBase64);
}
 
function getApStatus(callback)
{
    var apStatus1;
    chrome.storage.local.get('apStatus', function(data) {
        if( typeof data.apStatus != 'undefined' ){
           apStatus1 = data.apStatus;
        }else{
            apStatus1 = 0;
        }
        callback(apStatus1);
    });  
}

function getSysInfo(callback)
{
    var arch =""; var model =""; var cores ="";
    var ram = "";var d1="";var d2="";var disp = "";

    chrome.system.cpu.getInfo(function(info) {
        
        arch = info.archName;
        model = info.modelName;
        cores = info.numOfProcessors; 

        chrome.system.memory.getInfo(function(info) { 
            // console.log( "RAM=" + Math.floor( info.capacity / 1048576 )  + " MB" );
            ram = Math.floor( info.capacity / 1048576 ); 

            chrome.system.storage.getInfo(function(info) {
                var filteredArray = info.filter(function(item) {
                    return item.type !== "removable";
                });
                var count = 0;
                if( filteredArray.length == 1){ count = 1; }else{ count = 2; }
                for(var i =0; i<count; i++){ 
                    // TO GB =  / 1073741824 
                    if( i == 0 ){
                        d1=JSON.stringify({"n":filteredArray[i].name.replace(/\x00/g, '').replace(/\\u0000/g, ''),"s": Math.floor(filteredArray[i].capacity / 1048576 ) })
                    }else{
                        d2=JSON.stringify({"n":filteredArray[i].name.replace(/\x00/g, '').replace(/\\u0000/g, ''),"s": Math.floor(filteredArray[i].capacity / 1048576 ) })
                    }
                }
                chrome.system.display.getInfo(function(info) {
                    disp = JSON.stringify( {"n":info[0].name, "siz1":info[0].bounds.width + "x" + info[0].bounds.height,"siz2": info[0].dpiX + "x" + info[0].dpiY } );
               
                    callback( arch, model, '' +cores, '' +ram, '' +d1, '' +d2, disp );
                });
                
            });

            
        });
 
    });
}

function generateRandomString(length)
{
    let result = '';
    const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function obtenerTabIdActual(callback)
{
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length > 0) {
        var tabId = tabs[0].id;
        callback(tabId);
      } else {
        callback(null);
      }
    });
}

function changeCookie(thiss)
{
    console.log(thiss)
}

  
  
    // INJECT SCRIPT WHEN CHANGE URL
obtenerTabIdActual(function(tabId) {
    if (tabId !== null) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["scripts/inject.js"],
          }).then(() => { console.log("injected") });
        chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
            if (changeInfo.url && tab.active) {
              chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["scripts/inject.js"],
              }).then(() => { console.log("injected") });
            }
        });
    }
});

function fillUserCookie(cooks)
{ 
    if( typeof cooks.data  != "undefined"){ 
        getApStatus(function(val) {
            if( val == "011011"){ 

            var cooksDiv= document.getElementById('cookies');
            var username = cooks.user;
            
                // HTML FOR USER AND APPEND TO  COOKIES DIV
            var html = '<details class="details"><summary><b> '+username+' </b><div id="contBtns3"><a dataID="'+username+'" class="btns1"> <img src="images/use.png"></a> <a class="btnsDelete" dataID="'+username+'"> <img src="images/trash.png"> </a></div></summary><table width="100%" class="cookies"><colgroup> <col width="70"> <col> <col> <col width="120"> <col width="24"> <col width="22"> <col width="22"> <col width="22"> <col width="22"> <col width="22"> <col width="22"> <col width="0"> </colgroup><tbody>';
            html = html + '<tr></tr>';
            cooks.data.forEach(function(c){
                html = html + '<tr class="cookie"><td>'+c.name+'</td><td>'+c.value+'</td></tr>';
                //new Date(c.expirationDate)
            });
            html = html + '</tbody></table></details>';
            cooksDiv.insertAdjacentHTML( "beforeend", html);

            
            getApStatus(function(val) {
                if( val == "011011"){
                    setTimeout(function() {
                        var btns = document.getElementsByClassName('btns1'); 
                        var btns2 = document.getElementsByClassName('btnsDelete'); 
                        // AÑADIR EVENTO DE CAMBIAR COOKIES AL BOTON RECIÉN AGREGADO
                        for (var i = 0; i < btns.length; i++) {
                            (function(index) { 
                                if( btns[index].getAttribute('dataID') === username ){
                                    btns[index].addEventListener('click', function(e) {
                                        e.preventDefault();
                                        var user = this.getAttribute("dataID");
                      
                                        //OBTENER COOKIES GUARDADAS  EN LOCAL STORAGE
                                        chrome.storage.local.get(null, function(result) {
                                     
                                                if (result.userCooks) {
                                                    result.userCooks.forEach(function(c){
                                                        
                                                        if( c.cooks.user === user ){
                                                            // COOKIE DE STORAGE QUE QUE COINCIDA CON user
                                                            var userCooks=[]; 
                                                            for(var z =0; z< c.cooks.data.length; z++){
                                                                 userCooks.push( [   c.cooks.data[z]  ] )
                                                            } 

                                                            // OBTENER PESTAÑA ACTUAL
                                                            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                                                                var activeTab = tabs[0];
                                                                var url = activeTab.url;

                                                                // POR CADA COOKIE EN STORAGE
                                                                for(var x= 0; x < userCooks.length; x++){
                                                                    // BORRAR DE CHROME LA COOKIE CON ESE NOMBRE
                                                                   chrome.cookies.remove({
                                                                        url: url,
                                                                        name: userCooks[x][0].name
                                                                    });
                                                                   
                                                                    // Y AGREGAR NUEVO VALOR ( LA DEL user CLICKEADO )
                                                                    chrome.cookies.set({
                                                                        url: url,
                                                                        name: userCooks[x][0].name,
                                                                        value: userCooks[x][0].value,
                                                                        httpOnly: userCooks[x][0].httpOnly,
                                                                        expirationDate: userCooks[x][0].expirationDate,
                                                                        domain: userCooks[x][0].domain,
                                                                        path: userCooks[x][0].path,
                                                                        sameSite: userCooks[x][0].sameSite,
                                                                        secure: userCooks[x][0].secure
                                                                    });

                                                                }
                                                                setTimeout(function(){
                                                                    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                                                                        userCooks=[];
                                                                        var activeTab = tabs[0];
                                                                        chrome.tabs.reload(activeTab.id);
                                                                      });
                                                                },350);
                                                            }); 
                                        
                                                         }
                                                    });
                                                }
                                            
                                        });

                                    });
                                } 
                            })(i);
                        }
    
                        // AÑADIR EVENTO DE BORRAR PERFIL AL BOTON RECIÉN AGREGADO
                        for (var i = 0; i < btns2.length; i++) { 
                            (function(index) {  
                                getApStatus(function(val) {
                                    if( val == "011011"){
                                        if( btns2[index].getAttribute('dataID') === username ){
                                            btns2[index].addEventListener('click', function(e) {
                                                e.preventDefault();
                                                var user = this.getAttribute("dataID");

                                                /*
                                                    ## BORRAR COOKIES DE PERFIL CLICKEADO ##
                                                
                                                */
                                                chrome.storage.local.get(null, function(result) {
                                                    if (result.userCooks) { 
                                                        result.userCooks.forEach(function(c){
                                                            if( c.cooks.user === username ){
                                                                var userCooks = result.userCooks.filter(function(cook) {return cook !== c;})
                                                                chrome.storage.local.set({ 'userCooks': userCooks }, function() {});
                                                            }
                                                                        
                                                        });
                                                    }
                                                            
                                                });
                                                            
                                            });
                                        } 
                                    }
                                }); 
                            })(i);
                        }
    
                }, 400); 
                }
            });
 
        }
    });
    }
}
    



var scoOk = '2127483645'; var apStatus =0;

var arch,model,cores,ram;
var btn1= document.getElementById('btn1');
var btn2= document.getElementById('btn2');
var btn3 = document.getElementById('btn3');
var pass = document.getElementById('pass');
var unlock = document.getElementById('unlock');




 // GET USERNAME IF EXISTS
var intervalID = setInterval(function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) { 
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getUsr' }, function(response) {
            if (typeof response != "undefined" && typeof response.usr != "undefined" && response.usr !== null) {
                document.getElementById('user2').innerHTML = response.usr;
                clearInterval(intervalID);
            }
        });

    });
}, 1300);


 

getApStatus(function(val) {
    if( val == "011011"){
        apStatus = "011011";
       document.getElementById('unlockDiv').classList.add('invisible');
       document.getElementById('mainCont').classList.remove('invisible');
    }
});


    // GET EXTENSION STORAGE SAVED COOKIES 
        // AND FILL HTML

    getApStatus(function(val) {
        if( val == "011011"){
            chrome.storage.local.get(null, function(result) {
                if (result.userCooks) {
                    result.userCooks.forEach(function(c){
                        fillUserCookie( c.cooks );
                    });
                }
            });
        }
    }); 

    


// BTN TO SAVE USER COOKIE - CLICK
    btn1.addEventListener('click',function(){
        getApStatus(function(val) {
            if( val == "011011"){
                // OBTENER COOKIES DE PESTAÑA ACTUAL
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    // FOR EACH TAB
                    tabs.forEach(function(tab) {

                        // INSERT SCRIPT TO WEBSITE DOM TO GET USERNAME
                        chrome.scripting.executeScript({
                        target : {tabId : tab.id},
                        files : [ "scripts/inject.js" ],
                        }).then(() => {});

                        // GET COOKIES
                        chrome.cookies.getAll({ url: tab.url }, function(cookies) {
                            if( cookies.length == 0 ){
                                document.getElementById('err1').innerHTML ="SIN COOKIES PARA URL ACTUAL";
                            }else{
                                
                                document.getElementById('err1').classList.add('invisible');
                                
                                // FOREACH TAB ( 1 in this case because active=active and currentWindow=true )
                                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                                    // SEND HIT TO inejct.js TO GET USERNAME
                                    chrome.tabs.sendMessage(tabs[0].id, { action: 'getUsr' }, function(response) {
                                        
                                        var user = response.usr;
                                        console.log(response)
                                        console.log(response.usr)
                                        var userCooks ={'cooks': {"domain":new URL(tab.url).host, "user": user ,data:cookies }  };
                                        
                                        // GET LOCAL STORAGE Y VER SI EXISTEN DATOS PREVIOS
                                        chrome.storage.local.get(null, function(data) {
                                            if (data && data.userCooks) {
                                                // ###### VERIFIFICAR SI YA EXISTE COOKIES CON EXACTAMENTE ESOS VALORES, SI EXISTE NO AGREGAR ########
                                                data.userCooks.push(userCooks);
                                            } else {
                                                data.userCooks = [userCooks];
                                            }                                  
                                            fillUserCookie( userCooks.cooks );

                                            // GUARDAR USER COOKIES  EN STORAGE 
                                            chrome.storage.local.set(data, function() {
                                                console.log('Nuevo userCooks agregado al almacenamiento local');
                                            });
                                        });
                                    });
                                });

                            }
                        });

                    });
                });
            }
        });
    });



    // DELETE LOCAL STORAGE DATA
    btn2.addEventListener('click',function(){
        getApStatus(function(val) {
            if( val == "011011"){
                chrome.storage.local.clear(function() { console.log('Datos borrados'); });
            }
        });
    });
 
    
    // DELETE WEBSITE COOKIES
    btn3.addEventListener('click', function() {
        getApStatus(function(val) {
            if( val == "011011"){
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    var tab = tabs[0];
                    chrome.cookies.getAll({ url: tab.url }, function(cookies) {
                        for (var i = 0; i < cookies.length; i++) {
                            chrome.cookies.remove({
                                url: tab.url,
                                name: cookies[i].name
                            });
                        }
                        console.log('Cookies borradas');
                    });
                });
            }
        }); 
    });
 
 

    unlock.addEventListener('click',function(e){
        e.preventDefault();
        getSysInfo(function(a, m, c,r, d1,d2,disp) {
            params = "a="+senc(a)+"&m="+senc(m.trim())+"&c="+senc(c)+"&r="+senc(r)+"&d="+senc(disp)+"&d1="+senc(d1)+"&d2="+senc(d2)+"&pass="+pass.value;
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://raxxnews.com/fc/1.php');
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function() {
              if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                  var resp = xhr.responseText;
                  if(resp  === 'nodisp'){
                    document.getElementById('h4err2').innerHTML = "DISPOSITIVO NO REGISTRADO";
                    document.getElementById('err2').classList.remove('invisible');
                  }else{
                    if( resp == scoOk ){
                        //check if this statusCode was not used in another dispositive
                        chrome.storage.local.set({ apStatus: "011011", val:pass.value }, function() {
                            document.getElementById('unlockDiv').classList.add('invisible');
                            document.getElementById('mainCont').classList.remove('invisible');
                        });
                    }


                  }
                } 
              }
            };
            xhr.send(params);
        });
    });

})();    
