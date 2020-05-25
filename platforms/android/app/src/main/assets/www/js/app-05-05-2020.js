// Initialize your app
var $$ = Dom7;
var app = new Framework7({  
  root: '#app', // App root element
  pushState: true, 
  //popupCloseByOutside:true,
  name: 'SGL',// App Name 
  id: 'com.phonegap.sgl', // App id //
  panel: {
    //swipe: 'left', // Enable swipe panel //
    closeByBackdropClick : true,    
  },  
  input: {
    scrollIntoViewOnFocus: true,
    scrollIntoViewCentered: true,
  },
  animateNavBackIcon:true,  
  dynamicNavbar: true,  
  //theme:'material',
  //material: true, //enable Material theme
  //materialRipple: false,
  routes: routes, 
  clicks: { 
    externalLinks: '.external',
  },
  navbar: {     
    hideOnPageScroll: false,
    iosCenterTitle: false,
    closeByBackdropClick: true,
  },
  picker: {
    rotateEffect: true,
    //openIn: 'popover', 
  },
  popover: {
    closeByBackdropClick: true,
  },  
  on:{
    pageInit: function(e, page) {    
      //console.log(e+"-----"+page); 
    }
  },
  // Hide and show indicator during ajax requests
  onAjaxStart: function (xhr) {
    app.showIndicator();
  },
  onAjaxComplete: function (xhr) {
    app.hideIndicator();
  }
});
var base_url = 'http://oteqprojects.co.in/sabarmati/';
var mainView = app.views.create('.view-main');
var dt = new Date();
  if(dt.getMinutes() <=9){
    var min = "0"+dt.getMinutes();
  }else{
    var min = dt.getMinutes();
  }
  var current_time = dt.getHours() + ":" + min + ":" + dt.getSeconds();
document.addEventListener("deviceready", checkStorage, false); 
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("backbutton", onBackKeyDown, false);
var pictureSource; // picture source
var destinationType;
function onDeviceReady() { 
  //alert("HELLO");  
  pictureSource = navigator.camera.PictureSourceType;
  destinationType = navigator.camera.DestinationType;
  //hasReadPermission(); // uncomment //
  //requestReadPermission();   // uncomment //
}
function onBackKeyDown() {
  checkConnection(); 
  if(app.views.main.router.history.length==2 || app.views.main.router.url=='/'){
    app.dialog.confirm('Do you want to Exit ?', function () {
      navigator.app.clearHistory(); navigator.app.exitApp();
    });
  }else{ 
    $$(".back").click();
  } 
}
function checkStorage(){
  //logOut();
  //console.log("hi");
  checkConnection();  
  var session_uid = window.localStorage.getItem("session_uid");
  //alert(session_uid);
  if(session_uid!=null){
    mainView.router.navigate("/dashboard/");
  }else{
    mainView.router.navigate("/index/"); 
  }
}
// --------------------- C H E C K  I N T E R N E T  C O N N E C T I O N --------------------- //
function checkConnection(){  
  var networkState = navigator.connection.type;
  if(networkState=='none'){  
      mainView.router.navigate('/internet/');   
  }
}
// ------------------------------ MOBILE IMEI -------------------------------- //
function logincheck(){
  //alert("hi");
  checkConnection();    
  var lform = $(".lform").serialize();  
  //console.log(lform+"***");
  var mobile_num = $("#mob_login").val();
  var pass = $("#pass").val();

  //alert(mobile_num+"-----"+pass);
  if(mobile_num==''){
    $("#passerror").html("");
    $("#umoberror").html("Mobile number is required.");
    return false;
  }else if(pass==''){
    $("#umoberror").html("");
    $("#passerror").html("Password is required.");
    return false;
  }else{ 
  //alert("else");
  //alert(base_url+'APP/Appcontroller/authenticateUser');
    $.ajax({
      type:'POST', 
      url:base_url+'APP/Appcontroller/authenticateUser',
      data:lform,  
      success:function(authRes){
        var result = $.parseJSON(authRes);
        var parse_authmsg = result.auth_msg;        
        var user_session = result.user_session[0];  
        var desi_title = result.desi_title;
        var imei_no = result.imei_no;
        var imei_no_two = result.imei_no_two;
        //alert("parse_authmsg "+parse_authmsg);
        if(parse_authmsg=="success"){
          //var permissions = cordova.plugins.permissions;
          //console.log(permissions);
          //permissions.checkPermission(permissions, successCallback, errorCallback);
          var user_id = result.user_session[0].user_id;
          
          var permissions = cordova.plugins.permissions;
          /*window.plugins.sim.getSimInfo(function(res){
            //alert("IMEI 1 : "+res.cards[0].deviceId);
            //alert("IMEI 2 : "+res.cards[1].deviceId);
            var imei_1 = res.cards[0].deviceId;
            var imei_2 = res.cards[1].deviceId;
            $.ajax({ 
              type:'POST', 
              url:base_url+'APP/Appcontroller/updateIMEI',
              data:{'imei_no':imei_no,'imei_no_two':imei_no_two,'imei_1':imei_1,'imei_2':imei_2,'user_id':user_id},  
              success:function(imei_result){
                //alert("imei_result "+imei_result);
              }
            });           
          }, function(error){
            //console.log(error);
            //alert("error "+error);
            app.dialog.alert(error+" Unable to get IMEI of "+mobile_num);
            return false;
          });  */
          mainView.router.navigate("/dashboard/"); 
          window.localStorage.setItem("session_uid",result.user_session[0].user_id);
          window.localStorage.setItem("session_utype",result.user_session[0].user_type);
          window.localStorage.setItem("session_uclass",result.user_session[0].user_class);
          window.localStorage.setItem("session_uname",result.user_session[0].username);
          window.localStorage.setItem("session_stid",result.user_session[0].station_id);
          window.localStorage.setItem("session_email",result.user_session[0].email);
          window.localStorage.setItem("session_umob",result.user_session[0].mobileno);
          window.localStorage.setItem("sess_designation",result.desi_title);

        }else if(parse_authmsg=="Inc_mobpass"){
          app.dialog.alert("Mobile no or password Incorrect");
          return false;
        }
      }
    });
  }
}
// -------------------------------- VST MODULE STARTS ------------------------------------//
// Android only: check permission
function hasReadPermission() {
  //alert("in hasReadPermission");
  window.plugins.sim.hasReadPermission(successCallback, errorCallback);
}

// Android only: request permission
function requestReadPermission() {
  //alert("in requestReadPermission");
  window.plugins.sim.requestReadPermission(successCallback, errorCallback);

}
function successCallback(result) {
  //alert("in success "+result);
}
function errorCallback(error) {
  //alert("in error " +error);
}
function showeye(){
  $(".showpass span").removeClass("display-none");
  $(".showpass span").addClass("display-block");
}
function showpassword(show){
  if(show=='show'){
    $(".pass").attr('type','text');    
    $(".showpass").html('<span class="f7-icons text-white fs-18" onclick="showpassword('+"'"+"hide"+"'"+')">eye_slash</span>');
  }else if(show=='hide'){
    $(".pass").attr('type','password');
    $(".showpass").html('<span class="f7-icons text-white fs-18" onclick="showpassword('+"'"+"show"+"'"+')">eye</span>');
  }
}
function gotonext(txtval){
  var txtlen = txtval.value.length;  
  if(txtlen==2){
    $('#np_two').focus();
    searchByveh();
  }else if(txtlen>2){
    $('#np_two').val('');
    app.dialog.alert("Enter valid vehicle number");
  }  
}
function gotonext_two(txtval){
  var txtlen = txtval.value.length;
  if(txtlen==2){
    $('#np_three').focus();
    searchByveh();
  }else if(txtlen>2){
    $('#np_three').val('');
    app.dialog.alert("Enter valid vehicle number");
  }
}
function gotonext_three(txtval){
  var txtlen = txtval.value.length;
  if(txtlen==2 || txtlen==3){
    $('#np_four').focus();
    searchByveh();
  }else if(txtlen>3){
    $('#np_four').val('');
    app.dialog.alert("Enter valid vehicle number");
  }
}
function gotonext_four(txtval){
  var txtlen = txtval.value.length;  
  if(txtlen>5){
    $("#np_four").val('');
    //searchByveh();
    app.dialog.alert("Enter valid vehicle number");
  }else if(txtlen==4 || txtlen==5){    
    searchByveh();
  }
}
$(document).on('page:init', '.page[data-name="dashboard"]', function (e) {
  menuload();
  checkConnection(); 
  //logOut();  
  var session_uid = window.localStorage.getItem("session_uid"); 
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getModules',
    data:{'session_uid':session_uid},
    success:function(module){
      var parsemodule = $.parseJSON(module);
      var html = parsemodule.html;
      //console.log(html);
      $(".dashicons").html(html); 
    }
  });
});  
/*$(document).ready(function(){
  var sess_designation = window.localStorage.getItem("sess_designation"); 
  console.log(sess_designation);     
  var menulist='';
  if(sess_designation == 'SGL EIC'){
    menulist+='<p><a class="text-white link" href="/dpr_list/">DPR</a></p><p><a class="text-white link" href="#">DPR Complain/Correction</a></p><p><a class="text-white link" href="/dpr/">DPR KPI Report</a></p><p><a class="text-white link" href="#" onclick="logOut()">Logout</a></p>';
  }else{
    menulist+='<p><a class="text-white link" href="#" onclick="logOut()">Logout</a></p>';
  }
  $(".menulist").html(menulist);
});*/
function menuload(){
  var sess_designation = window.localStorage.getItem("sess_designation"); 
  console.log(sess_designation);     
  var menulist='';
  if(sess_designation == 'SGL EIC'){
    menulist+='<p><a class="text-white link" href="/dpr_list/">DPR</a></p><p><a class="text-white link" href="#">DPR Complain/Correction</a></p><p><a class="text-white link" href="/dpr/">DPR KPI Report</a></p><p><a class="text-white link" href="#" onclick="logOut()">Logout</a></p>';
  }else{
    menulist+='<p><a class="text-white link" href="/dpr_list/">DPR</a></p><p><a class="text-white link" href="#" onclick="logOut()">Logout</a></p>';
  }
  $(".menulist").html(menulist);
}
$(document).on('page:init', '.page[data-name="index"]', function (e) {
  //console.log(e);
  menuload();
});
function scanQR(){
  cordova.plugins.barcodeScanner.scan(function (result) {
    var qr_code = result.text; 
    //alert(qr_code);
    $.ajax({
      type:'POST', 
      url:base_url+'APP/Appcontroller/checkVehicleQR',
      data:{'qr_code':qr_code},
      success:function(data){
        var parseData = $.parseJSON(data);
        var veh_msg = parseData.veh_msg;
        var checkQR = parseData.checkQR;
        var status = parseData.status;
        //console.log(checkQR+status);
        var vst_html = '';
        if(status=='success'){
          var owner_name = checkQR[0].owner_name;
          var mobile_one = checkQR[0].mobile_one;
          var mobile_two = checkQR[0].mobile_two;
          var email = checkQR[0].email;
          var vehicle_type = checkQR[0].vehicle_type;
          var att_hydrotest_metal_plate_cirty = checkQR[0].att_hydrotest_metal_plate_cirty;
          var att_rcbook = checkQR[0].att_rcbook;
          var att_form24 = checkQR[0].att_form24;
          var att_number_plate = checkQR[0].att_number_plate;

          if(mobile_two!='' || mobile_two!=undefined || mobile_two!=null){
            var mob2 = mobile_two;
          }else{
            var mob2='';
          }
          var vehicle_no = checkQR[0].vehicle_no;
          var hydrotest_due_date = checkQR[0].hydrotest_due_date;
          var split_duedt = hydrotest_due_date.split("-");
          var due_yr = split_duedt[0];
          var due_mm = split_duedt[1];
          var due_dd = split_duedt[2];
          var hydro_due_dt = due_dd+" - "+due_mm+" - "+due_yr;
          //alert(owner_name);
          vst_html+='<div class="block-title">Name of Owner / Driver</div><div class="block"><p class="text-uppercase">'+owner_name+'</p></div><div class="block-title">Mobile No</div><div class="block"><p class="text-uppercase">'+mobile_one+'</p></div><div class="block-title">Vehicle No</div><div class="block"><p class="text-uppercase">'+vehicle_no+'</p></div><div class="block-title">Hydrotest Due Date</div><div class="block"><p class="text-uppercase">'+hydro_due_dt+'</p></div>';
          /*$(".own_name").html(owner_name);
          $(".mob_one").html(mobile_one);
          $(".veh_no").html(vehicle_no);
          $(".hydro_due_dt").html(hydro_due_dt);*/
          //alert(veh_msg);
          if(veh_msg=='allow'){
            vst_html+='<div class="text-center"><div class="text-uppercase"><h2>cng filling permission</h2></div><img src="img/right-2.png" width="150" /></div>';
            /*$(".permit").removeClass("display-none");
            $(".permit").addClass("display-block");
            $(".no-permit").removeClass("display-block");
            $(".no-permit").addClass("display-none");*/
            vst_html+='<a class="button dynamic-popup" onclick="openpopup('+"'"+owner_name+"'"+','+"'"+mobile_one+"'"+','+"'"+mob2+"'"+','+"'"+email+"'"+','+"'"+vehicle_type+"'"+','+"'"+att_hydrotest_metal_plate_cirty+"'"+','+"'"+att_rcbook+"'"+','+"'"+att_form24+"'"+','+"'"+att_number_plate+"'"+','+"'"+vehicle_no+"'"+','+"'"+hydro_due_dt+"'"+','+"'"+veh_msg+"'"+')" href="#">View Details</a>';
          $(".vstdata").html(vst_html);  
          }else if(veh_msg=='deny'){
            vst_html+='<div class="text-center"><div class="text-uppercase"><h2>cng filling permission</h2></div><img src="img/wrong.jpg" width="200" /></div>';
            /*$(".permit").removeClass("display-block");
            $(".permit").addClass("display-none");
            $(".no-permit").removeClass("display-none");
            $(".no-permit").addClass("display-block");*/
            vst_html+='<a class="button dynamic-popup" onclick="openpopup('+"'"+owner_name+"'"+','+"'"+mobile_one+"'"+','+"'"+mob2+"'"+','+"'"+email+"'"+','+"'"+vehicle_type+"'"+','+"'"+att_hydrotest_metal_plate_cirty+"'"+','+"'"+att_rcbook+"'"+','+"'"+att_form24+"'"+','+"'"+att_number_plate+"'"+','+"'"+vehicle_no+"'"+','+"'"+hydro_due_dt+"'"+','+"'"+veh_msg+"'"+')" href="#">View Details</a>';          
            $(".vstdata").html(vst_html);
          }
        }else if(status=='fail'){
          $(".vstdata").html('');
          if(veh_msg=='not_exist'){
            //alert("IF");
            mainView.router.navigate("/no_vehdata/"+qr_code+"/"); 
          }
        }
      }
    });                
    //alert("Barcode/QR code data\n" + "Result: " + result.text + "\n" + "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled);
    //$("#barcode_result").html("Format "+result.format+"\n"+"Result: " + result.text);
  }
    ,function (error) {
      app.dialog.alert("Scanning failed: " + error);
      //$("#barcode_result").html("Scanning failed: " + error);
    },
    {
      preferFrontCamera : false, // iOS and Android
      //showFlipCameraButton : true, // iOS and Android
      //showTorchButton : true, // iOS and Android
      //torchOn: true, // Android, launch with the torch switched on (if available)
      saveHistory: true, // Android, save scan history (default false)
      prompt : "Place a barcode inside the scan area", // Android
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      formats : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
      orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations : true, // iOS
      disableSuccessBeep: false // iOS and Android
    }
  );
} 

function openpopup(owner,mob1,mob2,email,vtype,metal_plate,rcbook,form24,num_plate,veh_no,hydro_date,veh_msg){
  if(veh_msg=="allow"){
    var filling_img = '<div class="text-center"><div class="text-uppercase"><h2>cng filling permission</h2></div><img src="img/right-2.png" width="150" /></div>';
  }else if(veh_msg=="deny"){
    var filling_img = '<div class="text-center"><div class="text-uppercase"><h2>cng filling permission</h2></div><img src="img/wrong.jpg" width="200" /></div>';
  }
  
  if(mob2!="null" && mob2!=""){    
    var mobile_two='<div class="block-title">Mobile No 2</div><div class="block"><p class="text-uppercase">'+mob2+'</p></div>';
  }else{    
    var mobile_two='';
  }

  if(email!="null" && email!=""){    
    var emailID='<div class="block-title">Email</div><div class="block"><p class="text-uppercase">'+email+'</p></div>';
  }else{     
    var emailID='';
  }

  if(vtype!="null" && vtype!=""){    
    var veh_type='<div class="block-title">Vehicle Type</div><div class="block"><p class="text-uppercase">'+vtype+'</p></div>';
  }else{    
    var veh_type='';
  }

  var dynamicPopup = app.popup.create({
  content: '<div class="popup over_scroll">'+'<div class="block"><p><a href="#" class="link popup-close text-red fw-600">CLOSE ME</a></p><div class="block-title">Name of Owner / Driver</div><div class="block"><p class="text-uppercase">'+owner+'</p></div><div class="block-title">Mobile No 1</div><div class="block"><p class="text-uppercase">'+mob1+'</p></div>'+mobile_two+emailID+veh_type+'<div class="block-title">Hydrotest Due Date</div><div class="block"><p class="text-uppercase">'+hydro_date+'</p></div>'+filling_img+'</div>',
  });
  dynamicPopup.open();
}
function scan_qr(){
  cordova.plugins.barcodeScanner.scan(function (result) {
    //app.dialog.alert("Barcode/QR code data\n" + "Result: " + result.text + "\n" + "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled);
    var qr_code = result.text; 
    //gotoRecheckView(qr_code);
    mainView.router.navigate("/recheckQR/"+qr_code+"/");
    //alert(qr_code);
                    
    //alert("Barcode/QR code data\n" + "Result: " + result.text + "\n" + "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled);
    //$("#barcode_result").html("Format "+result.format+"\n"+"Result: " + result.text);
  
    },
    function (error) {
      app.dialog.alert("Scanning failed: " + error);
      //$("#barcode_result").html("Scanning failed: " + error);
    },
    {
      preferFrontCamera : false, // iOS and Android
      //showFlipCameraButton : true, // iOS and Android
      //showTorchButton : true, // iOS and Android
      //torchOn: true, // Android, launch with the torch switched on (if available)
      saveHistory: true, // Android, save scan history (default false)
      prompt : "Place a barcode inside the scan area", // Android
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      formats : "QR_CODE", // default: all but PDF_417 and RSS_EXPANDED
      orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations : true, // iOS
      disableSuccessBeep: false // iOS and Android
    }
  );
}
$(document).on('page:init', '.page[data-name="recheckQR"]', function (page) {
  menuload();
  var qr_code = page.detail.route.params.qr_code;
  $.ajax({
      type:'POST', 
      url:base_url+'APP/Appcontroller/checkVehicleQR',
      data:{'qr_code':qr_code},
      success:function(data){
        var parseData = $.parseJSON(data);
        var veh_msg = parseData.veh_msg;
        var checkQR = parseData.checkQR;
        var status = parseData.status;
        //console.log(checkQR+status);
        var vst_html = '';
        if(status=='success'){
          var owner_name = checkQR[0].owner_name;
          var mobile_one = checkQR[0].mobile_one;
          var mobile_two = checkQR[0].mobile_two;
          var email = checkQR[0].email;
          var vehicle_type = checkQR[0].vehicle_type;
          var att_hydrotest_metal_plate_cirty = checkQR[0].att_hydrotest_metal_plate_cirty;
          var att_rcbook = checkQR[0].att_rcbook;
          var att_form24 = checkQR[0].att_form24;
          var att_number_plate = checkQR[0].att_number_plate;

          if(mobile_two!='' || mobile_two!=undefined || mobile_two!=null){
            var mob2 = mobile_two;
          }else{
            var mob2='';
          }
          var vehicle_no = checkQR[0].vehicle_no;
          var hydrotest_due_date = checkQR[0].hydrotest_due_date;
          var split_duedt = hydrotest_due_date.split("-");
          var due_yr = split_duedt[0];
          var due_mm = split_duedt[1];
          var due_dd = split_duedt[2];
          var hydro_due_dt = due_dd+" - "+due_mm+" - "+due_yr;
          vst_html+='<div class="block-title">Name of Owner / Driver</div><div class="block"><p class="text-uppercase">'+owner_name+'</p></div><div class="block-title">Mobile No</div><div class="block"><p class="text-uppercase">'+mobile_one+'</p></div><div class="block-title">Vehicle No</div><div class="block"><p class="text-uppercase">'+vehicle_no+'</p></div><div class="block-title">Hydrotest Due Date</div><div class="block"><p class="text-uppercase">'+hydro_due_dt+'</p></div>';
          if(veh_msg=='allow'){
            vst_html+='<div class="text-center"><div class="text-uppercase"><h2>cng filling permission</h2></div><img src="img/right-2.png" width="150" /></div>';

            vst_html+='<a class="button dynamic-popup" onclick="openpopup('+"'"+owner_name+"'"+','+"'"+mobile_one+"'"+','+"'"+mob2+"'"+','+"'"+email+"'"+','+"'"+vehicle_type+"'"+','+"'"+att_hydrotest_metal_plate_cirty+"'"+','+"'"+att_rcbook+"'"+','+"'"+att_form24+"'"+','+"'"+att_number_plate+"'"+','+"'"+vehicle_no+"'"+','+"'"+hydro_due_dt+"'"+','+"'"+veh_msg+"'"+')" href="#">View Details</a>';
          $(".vstdata").html(vst_html);
          }else if(veh_msg=='deny'){
            vst_html+='<div class="text-center"><div class="text-uppercase"><h2>cng filling permission</h2></div><img src="img/wrong.jpg" width="200" /></div>';
            vst_html+='<a class="button dynamic-popup" onclick="openpopup('+"'"+owner_name+"'"+','+"'"+mobile_one+"'"+','+"'"+mob2+"'"+','+"'"+email+"'"+','+"'"+vehicle_type+"'"+','+"'"+att_hydrotest_metal_plate_cirty+"'"+','+"'"+att_rcbook+"'"+','+"'"+att_form24+"'"+','+"'"+att_number_plate+"'"+','+"'"+vehicle_no+"'"+','+"'"+hydro_due_dt+"'"+','+"'"+veh_msg+"'"+')" href="#">View Details</a>';          
            $(".vstdata").html(vst_html);
          }
        }else if(status=='fail'){
          $(".vstdata").html('');
          if(veh_msg=='not_exist'){
            //alert("IF");
            mainView.router.navigate("/no_vehdata/"+qr_code+"/"); 
          }
        }
      }
    });
});
$(document).on('page:init', '.page[data-name="no_vehdata"]', function (page) {
  menuload();
  var qr_code = page.detail.route.params.qr_code;
  $("#hidd_qrtxt").val(qr_code);
});
function addvstPage(){
  var hidd_qrtxt = $("#hidd_qrtxt").val(); 
  //alert("hidd_qrtxt "+hidd_qrtxt);
  //app.dialog.alert("Vehicle is not registered with SGL.Register the vehicle and then scan the QR Code");
  if(hidd_qrtxt==undefined && undefined==null){
    //alert("if");
    mainView.router.navigate("/add_vst/null/");  
  }else{
    //alert("else");
    mainView.router.navigate("/add_vst/"+hidd_qrtxt+"/");  
  }
  
  //return false; 
}
$(document).on('page:init', '.page[data-name="add_vst"]', function (page) {
  menuload();
  checkConnection();
  var qrcode_txt = page.detail.route.params.qr_code_txt;
  if(qrcode_txt==undefined || qrcode_txt=="null"){
    //alert("if----------");
    qrcode_txt='';
    $("#barcode_code").val(qrcode_txt);
  }else{
    //alert("else--------");
    qrcode_txt=qrcode_txt;
    $("#barcode_code").val(qrcode_txt);
  }
  
      
  var calendarModal = app.calendar.create({
    inputEl: '#demo-calendar-modal',
    openIn: 'customModal',
    dateFormat: 'dd-mm-yyyy',
    header: true,
    footer: true,
    renderToolbar: function () {   
      return '<div class="toolbar no-shadow"><div class="toolbar-inner"><div class="calendar-month-selector"><a href="#" class="link icon-only calendar-prev-month-button"><i class="f7-icons ">chevron_left</i></a><span class="current-month-value"></span><a href="#" class="link icon-only calendar-next-month-button"><i class="f7-icons ">chevron_right</i></a></div><div class="calendar-year-selector"><a href="#" class="link icon-only calendar-prev-year-button"><i class="f7-icons ">chevron_left</i></a><span class="current-year-value"></span><a href="#" class="link icon-only calendar-next-year-button"><i class="f7-icons ">chevron_right</i></a></div></div></div>'; 
    }
  });  
  $("#codeBox1").focus();
  //var qrcode_txt = page.detail.route.params.qr_code_txt;
  //$("#barcode_code").val(qrcode_txt);
});
function vstadd(){
  checkConnection();
  var form_vst = $("#form_vst").serialize();
  //var v_type = $('input[name="vtype"]').val();
  var v_type = $("#vtype").val();
  //alert(" v_type "+v_type);
  var barcode_code = $('input[name="barcode_code"]').val();
  //console.log(form_vst);
  var old_metalplate='NULL';
  var old_rcbook='NULL';
  var old_from24='NULL';
  var old_numplate='NULL';

  var np_one = $('input[name="np_one"]').val();
  var np_two = $('input[name="np_two"]').val();
  var np_three = $('input[name="np_three"]').val();
  var np_four = $('input[name="np_four"]').val();
  var owner_name = $('input[name="owner_name"]').val();
  var mobile_one = $('input[name="mobile_one"]').val();
  var vtype = $('input[name="vtype"]').val();
  var demo_calendar_modal = $("#demo-calendar-modal").val();

  if(np_one=='' || np_two=='' || np_three=='' || np_four==''){
    app.dialog.alert("Enter valid vehicle number");
    return false;
  }else if(owner_name == ''){
    app.dialog.alert("Enter owner name");
    return false;
  }else if(mobile_one == ''){
    app.dialog.alert("Enter mobile number");
    return false;
  }else if(vtype == ''){
    app.dialog.alert("Select vehicle type");
    return false;
  }else if(demo_calendar_modal == ''){
    app.dialog.alert("Enter Hydro test due date");
    return false;
  }else{ 
    $.ajax({
      type:'POST', 
      url:base_url+'APP/Appcontroller/addVST',
      data:form_vst,
      success:function(lastid){
        upload_metalplate(lastid,old_metalplate,v_type,barcode_code);
        upload_rcbook(lastid,old_rcbook,v_type,barcode_code);
        upload_form24(lastid,old_from24,v_type,barcode_code);
        upload_numplate(lastid,old_numplate,v_type,barcode_code);
        mainView.router.navigate("/vst_submited/");
      }    
    });
  }
}

function getCodeBoxElement(index) {
    return document.getElementById('codeBox' + index);
  }
function onKeyUpEvent(index, event) {
  const eventCode = event.which || event.keyCode;
  console.log(getCodeBoxElement(index).value.length);
  //if(index == '3'){var len = 3}else{ var len = 2}
  if ((index!=3 && getCodeBoxElement(index).value.length === 2) || (index==3 && getCodeBoxElement(index).value.length === 3 || index==3 && getCodeBoxElement(index).value.length === 2)) {
    console.log("called");
    searchByveh();
    if (index !== 4) {      
      getCodeBoxElement(index+ 1).focus();
    } else {
      getCodeBoxElement(index).blur();
      // Submit code
      console.log('submit code ');
    }
  }

  if (eventCode === 8 && index !== 1) {
    getCodeBoxElement(index - 1).focus();
  }
}
  function onFocusEvent(index) {
    for (item = 1; item < index; item++) {
      const currentElement = getCodeBoxElement(item);
      if (!currentElement.value) {
          currentElement.focus();
          break;
      }
    }
  }

function upload_numplate(lastid,old_numplate,v_type,barcode_code){
  //alert("called");
  var session_uid = window.localStorage.getItem("session_uid");
  //alert("session_uid "+session_uid);
  var img = document.getElementById('image_noplt');
  var imageURI = img.src;
  var options = new FileUploadOptions();
  options.fileKey="file";
  options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
  options.mimeType="image/jpeg";
  options.chunkedMode = false;
  options.headers = {
     Connection: "close"  
  };
  var params = {};  
  params.fullpath =imageURI;
  params.name = options.fileName;
  var imgfilename = params.name; 
  //alert("imgfilename "+imgfilename);
  var split_imgfilename = imgfilename.split("?");
  var ft = new FileTransfer();
  //console.log("ft :::::::::: "+ft);
  var actual_imgname1 = split_imgfilename[0];
  var img_filename1 = actual_imgname1.split('%20').join('_');
  //var test="img/gallery.png";
  var uploadControllerURL_noplate = base_url+"APP/Appcontroller/photoupload_numplate/"+barcode_code+"/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_numplate+"/"+img_filename1;
 //var uploadControllerURL = base_url+"APP/Appcontroller/photoupload_metal/"+barcode_code+"/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_metalplate+"/"+test;  
  //alert(uploadControllerURL);
  //console.log(uploadControllerURL);    
  ft.upload(imageURI,uploadControllerURL_noplate,win,fail,options,true);
}

function upload_metalplate(lastid,old_metalplate,v_type,barcode_code){
  //alert("called");
  var session_uid = window.localStorage.getItem("session_uid");
  //alert("session_uid "+session_uid);
  var img = document.getElementById('image');
  var imageURI = img.src;
  var options = new FileUploadOptions();
  options.fileKey="file";
  options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
  options.mimeType="image/jpeg";
  options.chunkedMode = false;
  options.headers = {
     Connection: "close"  
  };
  var params = {};  
  params.fullpath =imageURI;
  params.name = options.fileName;
  var imgfilename = params.name; 
  //alert("imgfilename "+imgfilename);
  var split_imgfilename = imgfilename.split("?");
  var ft = new FileTransfer();
  //console.log("ft :::::::::: "+ft);
  var actual_imgname1 = split_imgfilename[0];
  var img_filename1 = actual_imgname1.split('%20').join('_');
  //var test="img/gallery.png";
  var uploadControllerURL = base_url+"APP/Appcontroller/photoupload_metal/"+barcode_code+"/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_metalplate+"/"+img_filename1;
 //var uploadControllerURL = base_url+"APP/Appcontroller/photoupload_metal/"+barcode_code+"/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_metalplate+"/"+test;  
  //alert(uploadControllerURL);
  //console.log(uploadControllerURL);    
  ft.upload(imageURI,uploadControllerURL, win, fail, options,true);
}
function upload_rcbook(lastid,old_rcbook,v_type,barcode_code){
  //alert("upload_rcbook ");
  var session_uid = window.localStorage.getItem("session_uid");
  var img = document.getElementById('image_rc');
  var imageURI = img.src;
  var imageURI = img.src;
  var options = new FileUploadOptions();
  options.fileKey="file";
  options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
  options.mimeType="image/jpeg";
  options.chunkedMode = false;
  options.headers = {
     Connection: "close"  
  };
  var params = {};  
  params.fullpath =imageURI;
  params.name = options.fileName;
  var imgfilename = params.name; 
  //alert("imgfilename "+imgfilename);
  var split_imgfilename = imgfilename.split("?");
  var ft = new FileTransfer();
  var actual_imgname1 = split_imgfilename[0];
  var img_filename1 = actual_imgname1.split('%20').join('_');
  var uploadControllerURL_RC = base_url+"APP/Appcontroller/photoupload_RC/"+barcode_code+"/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_rcbook+"/"+img_filename1; 
  //console.log(uploadControllerURL_RC);
  ft.upload(imageURI,uploadControllerURL_RC, win, fail, options,true);
}
function upload_form24(lastid,old_from24,v_type,barcode_code){
  var session_uid = window.localStorage.getItem("session_uid");
  var img = document.getElementById('image_formtf');
  var imageURI = img.src;
  var imageURI = img.src;
  var options = new FileUploadOptions();
  options.fileKey="file";
  options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
  options.mimeType="image/jpeg";
  options.chunkedMode = false;
  options.headers = {
     Connection: "close"  
  };
  var params = {};  
  params.fullpath =imageURI;
  params.name = options.fileName;
  var imgfilename = params.name; 
  //alert("imgfilename "+imgfilename);
  var split_imgfilename = imgfilename.split("?");
  var ft = new FileTransfer();
  var actual_imgname2 = split_imgfilename[0];
  var img_filename2 = actual_imgname2.split('%20').join('_');
  var uploadControllerURL_form24 = base_url+"APP/Appcontroller/photoupload_form24/"+barcode_code+"/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_from24+"/"+img_filename2; 
  //alert(uploadControllerURL_form24);
  //console.log(uploadControllerURL_form24);
  ft.upload(imageURI,uploadControllerURL_form24, win, fail, options,true);
}
function win(r) { 
  //alert("in win ");
  //console.log("r = "+r);
  checkConnection();       
  var responseCode = r.responseCode;
  //alert(responseCode+" responseCode");
  if(responseCode==200){     
    app.dialog.close();  
  } 
}
function fail(error) {
  //alert("in fail "+error); 
  checkConnection();  
  //app.dialog.alert("An error has occurred: Code = " + error.code);
  //app.dialog.alert("upload error source " + error.source);
  //app.dialog.alert("upload error target " + error.target);
}
// ------------------------------------ BROWSE/CAPTURE IMAGE ------------------------------------------ //
function capturePhoto() {
  checkConnection();   
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
  quality: 100,
  targetWidth: 600,
  targetHeight: 600,
  destinationType: destinationType.FILE_URI,
  //saveToPhotoAlbum: true
  saveToPhotoAlbum: false,
  correctOrientation: true,
  }); 
}
function onPhotoDataSuccess(imageURI){
  //alert("in success "+imageURI);
  checkConnection();  
  var cameraImage = document.getElementById('image');
  //alert(cameraImage);
  //cameraImage.style.display = 'block';
  $("#imageblock").removeClass("display-none");
  $("#imageblock").addClass("display-block");
  cameraImage.src = imageURI;
}
function getPhoto(source) {
  checkConnection();    
  navigator.camera.getPicture(onPhotoURISuccess, onFail, {
    quality: 100,
    correctOrientation: 1,
    targetWidth: 600,
    targetHeight: 600,
    destinationType: destinationType.FILE_URI,
    sourceType: source
  });
} 
function onPhotoURISuccess(imageURI_gallery) {
  checkConnection();  
  var galleryImage = document.getElementById('image');
  //alert("galleryImage "+galleryImage);
  //galleryImage.style.display = 'block';
  $("#imageblock").removeClass("display-none");
  $("#imageblock").addClass("display-block");
  galleryImage.src = imageURI_gallery;
}
//********************************* RC BOOK *************************************//
function capturePhoto_rc(){
  checkConnection();   
  navigator.camera.getPicture(onPhotoDataSuccess_rc, onFail, {
  quality: 100,
  targetWidth: 600,
  targetHeight: 600,
  destinationType: destinationType.FILE_URI,
  //saveToPhotoAlbum: true
  saveToPhotoAlbum: false,
  correctOrientation: true,
  });
}
function onPhotoDataSuccess_rc(imageURI_rc){
  //alert("in success "+imageURI_rc);
  checkConnection();  
  var cameraImage_rc = document.getElementById('image_rc');
  //alert(cameraImage_rc);
  //cameraImage_rc.style.display = 'block';
  $("#imageblock_rc").removeClass("display-none");
  $("#imageblock_rc").addClass("display-block");
  cameraImage_rc.src = imageURI_rc;
}
function getPhoto_rc(source) {
  checkConnection();    
  navigator.camera.getPicture(onPhotoURISuccess_rc, onFail, {
    quality: 100,
    correctOrientation: 1,
    targetWidth: 600,
    targetHeight: 600,
    destinationType: destinationType.FILE_URI,
    sourceType: source
  });
} 
function onPhotoURISuccess_rc(imageURI_gallery_rc) {
  checkConnection();  
  var galleryImage_rc = document.getElementById('image_rc');
  //alert("galleryImage "+galleryImage_rc);
  //galleryImage_rc.style.display = 'block';
  $("#imageblock_rc").removeClass("display-none");
  $("#imageblock_rc").addClass("display-block");
  galleryImage_rc.src = imageURI_gallery_rc;
}
// ******************************* FORM - 24 **************************************** //
function capturePhoto_formtf(){
  checkConnection();   
  navigator.camera.getPicture(onPhotoDataSuccess_formtf, onFail, {
  quality: 100,
  targetWidth: 600,
  targetHeight: 600,
  destinationType: destinationType.FILE_URI,
  //saveToPhotoAlbum: true
  saveToPhotoAlbum: false,
  correctOrientation: true,
  });
}
function onPhotoDataSuccess_formtf(imageURI_formtf){
  //alert("in success "+imageURI_rc);
  checkConnection();  
  var cameraImage_formtf = document.getElementById('image_formtf');
  //alert(cameraImage_rc);
  //cameraImage_rc.style.display = 'block';
  $("#imageblock_formtf").removeClass("display-none");
  $("#imageblock_formtf").addClass("display-block");
  cameraImage_formtf.src = imageURI_formtf;
}
function getPhoto_formtf(source){
  checkConnection();    
  navigator.camera.getPicture(onPhotoURISuccess_formtf, onFail, {
    quality: 100,
    correctOrientation: 1,
    targetWidth: 600,
    targetHeight: 600,
    destinationType: destinationType.FILE_URI,
    sourceType: source
  });
}
function onPhotoURISuccess_formtf(imageURI_gallery_formtf) {
  checkConnection();  
  var galleryImage_formtf = document.getElementById('image_formtf');
  //alert("galleryImage "+galleryImage_rc);
  //galleryImage_rc.style.display = 'block';
  $("#imageblock_formtf").removeClass("display-none");
  $("#imageblock_formtf").addClass("display-block");
  galleryImage_formtf.src = imageURI_gallery_formtf;
}
// ************************************* NUMBER PLATE **************************************** // 
function capturePhoto_noplt(){
  checkConnection();   
  navigator.camera.getPicture(onPhotoDataSuccess_noplt, onFail, {
  quality: 100,
  targetWidth: 600,
  targetHeight: 600,
  destinationType: destinationType.FILE_URI,
  //saveToPhotoAlbum: true
  saveToPhotoAlbum: false,
  correctOrientation: true,
  });
}
function onPhotoDataSuccess_noplt(imageURI_noplt){
  //alert("in success "+imageURI_rc);
  checkConnection();  
  var cameraImage_noplt = document.getElementById('image_noplt');
  //alert(cameraImage_rc);
  //cameraImage_rc.style.display = 'block';
  $("#imageblock_noplt").removeClass("display-none");
  $("#imageblock_noplt").addClass("display-block");
  cameraImage_noplt.src = imageURI_noplt;
}
function getPhoto_noplt(source){
  checkConnection();    
  navigator.camera.getPicture(onPhotoURISuccess_noplt, onFail, {
    quality: 100,
    correctOrientation: 1,
    targetWidth: 600,
    targetHeight: 600,
    destinationType: destinationType.FILE_URI,
    sourceType: source
  });
}
function onPhotoURISuccess_noplt(imageURI_gallery_noplt){
  checkConnection();  
  var galleryImage_noplt = document.getElementById('image_noplt');
  //alert("galleryImage "+galleryImage_rc);
  //galleryImage_rc.style.display = 'block';
  $("#imageblock_noplt").removeClass("display-none");
  $("#imageblock_noplt").addClass("display-block");
  galleryImage_noplt.src = imageURI_gallery_noplt;
}
function onFail(message) {
  checkConnection();  
  app.dialog.alert('Failed because: ' + message);
}
function isNumber(evt,number){
  if(number.length>10){    
    app.dialog.alert("Mobile number should be of 10 digits."); 
    $("#mobile_one").val("");      
    //return false;
  }
}
function isNumber1(evt,number){
  if(number.length>10){    
    app.dialog.alert("Mobile number should be of 10 digits."); 
    $("#mobile_two").val("");    
    //return false;
  }
}
function searchVehicle(){
  $(".veh_search").removeClass("display-none");
  //$(".veh_search").addClass("display-block");
  $(".veh_search").fadeIn("slow");
}
function hidecard(){
  $(".veh_search").removeClass("display-block");
  //$(".veh_search").addClass("display-none");
  $(".veh_search").fadeOut("slow");
  $("#codeBox1").val('');
  $("#codeBox2").val('');
  $("#codeBox3").val('');
  $("#codeBox4").val('');
}
function searchByveh(){
  var codeBox1 = $("#codeBox1").val();
  var codeBox2 = $("#codeBox2").val();
  var codeBox3 = $("#codeBox3").val();
  var codeBox4 = $("#codeBox4").val();
  var veh_no = codeBox1+"-"+codeBox2+"-"+codeBox3+"-"+codeBox4;
  vehno = codeBox1+codeBox2+codeBox3+codeBox4;
  if(codeBox1!='' && codeBox2!='' && codeBox3!='' && codeBox4!=''){  
    $.ajax({
      type:'POST', 
      url:base_url+'APP/Appcontroller/checkVehicleNo',
      data:{'veh_no':veh_no,'vehno':vehno},
      success:function(data){
        var parseData = $.parseJSON(data);
        //console.log(parseData);
        var veh_msg = parseData.veh_msg;
        var checkvehno = parseData.checkvehno;
        var status = parseData.status;
        var code_chk = parseData.code_chk;
        var perm_msg = parseData.perm_msg;

        console.log(veh_msg+"----- veh_msg");
        console.log(status+"----- status");
        console.log(code_chk+"----- code_chk");
        console.log(perm_msg+"----- perm_msg");
        if(status=='success'){
          if(veh_msg=='exist'){
            if(code_chk=='barcode_notexists'){
              mainView.router.navigate("/veh_exists/")
            }else if(code_chk=='barcode_exists'){
              //console.log("success");
              var owner_name = checkvehno[0].owner_name;
              var mobile_one = checkvehno[0].mobile_one;
              var mobile_two = checkvehno[0].mobile_two;
              var email = checkvehno[0].email;
              var vehicle_type = checkvehno[0].vehicle_type;
              var att_hydrotest_metal_plate_cirty = checkvehno[0].att_hydrotest_metal_plate_cirty;
              var att_rcbook = checkvehno[0].att_rcbook;
              var att_form24 = checkvehno[0].att_form24;
              var att_number_plate = checkvehno[0].att_number_plate;

              //console.log(mobile_two+"----");
              if(mobile_two!='' && mobile_two!=undefined && mobile_two!=null){
                //console.log("if");
                var mob2 = mobile_two;
              }else{
                //console.log("else");
                var mob2=null;
              }
              if(email!='' && email!=undefined && email!=null){
                var email=email;
              }else{
                var email=null;
              }
              if(vehicle_type!='' && vehicle_type!=undefined && vehicle_type!=null){
                var vehicle_type = vehicle_type;
              }else{
                var vehicle_type = null;
              }
              //console.log("mob2 "+mob2);
              var vehicle_no = checkvehno[0].vehicle_no;
              var hydrotest_due_date = checkvehno[0].hydrotest_due_date;
              var split_duedt = hydrotest_due_date.split("-");
              var due_yr = split_duedt[0];
              var due_mm = split_duedt[1];
              var due_dd = split_duedt[2];
              //var hydro_due_dt = due_dd+" - "+due_mm+" - "+due_yr;
              //mainView.router.navigate("/veh_search/"+veh_msg+"/"+status+"/"+owner_name+"/"+mobile_one+"/");
              //alert("hello");
              //console.log("/veh_search/"+veh_msg+"/"+status+"/"+owner_name+"/"+mobile_one+"/"+mob2+"/"+email+"/"+vehicle_type+"/null/null/null/null/"+vehicle_no+"/"+due_yr+"/"+due_mm+"/"+due_dd+"/"); 
              mainView.router.navigate("/veh_search/"+veh_msg+"/"+status+"/"+owner_name+"/"+mobile_one+"/"+mob2+"/"+email+"/"+vehicle_type+"/null/null/null/null/"+vehicle_no+"/"+due_yr+"/"+due_mm+"/"+due_dd+"/");
            }
          }
          
          //alert("hello hiiiiiiiiii");
        }else if(status=='fail'){
          //console.log("fail");
          $(".vstdata").html('');
          if(veh_msg=='not_exist'){
            //mainView.router.navigate("/no_vehdata/null/"); 
            mainView.router.navigate("/add_vst/null/"); 
          }
        }      
        //mainView.router.navigate("/veh_search/"+parseData+"/");
      }
    });  
  }else{
    return false;
  }
}
$(document).on('page:init', '.page[data-name="veh_search"]', function (page) {
  menuload();
  checkConnection();  
  app.preloader.show(); 
  var veh_msg = page.detail.route.params.veh_msg;  
  var status = page.detail.route.params.status;
  var owner_name = page.detail.route.params.owner_name;
  var mobile_one = page.detail.route.params.mobile_one;
  var mob2 = page.detail.route.params.mob2;  
  var email = page.detail.route.params.email;  
  var vehicle_type = page.detail.route.params.vehicle_type;  
  /*var att_hydrotest_metal_plate_cirty = page.detail.route.params.att_hydrotest_metal_plate_cirty;
  var att_rcbook = page.detail.route.params.att_rcbook;
  var att_form24 = page.detail.route.params.att_form24;  
  var att_number_plate = page.detail.route.params.att_number_plate;*/
  var vehicle_no = page.detail.route.params.vehicle_no;
  var due_yr = page.detail.route.params.due_yr;
  var due_mm = page.detail.route.params.due_mm;
  var due_dd = page.detail.route.params.due_dd;
  var hydro_due_dt = due_dd+" - "+due_mm+" - "+due_yr;
  var vst_html = '';
  //console.log("hiiiiiiiiiiiiiii"+status+"*****"+veh_msg);
  if(status=='success'){    
    vst_html+='<div class="block-title">Name of Owner / Driver</div><div class="block"><p class="text-uppercase">'+owner_name+'</p></div><div class="block-title">Mobile No</div><div class="block"><p class="text-uppercase">'+mobile_one+'</p></div><div class="block-title">Vehicle No</div><div class="block"><p class="text-uppercase">'+vehicle_no+'</p></div><div class="block-title">Hydrotest Due Date</div><div class="block"><p class="text-uppercase">'+hydro_due_dt+'</p></div>';    
    //console.log(veh_msg);
    if(veh_msg=='allow'){
      vst_html+='<div class="text-center"><div class="text-uppercase"><h2>cng filling permission</h2></div><img src="img/right-2.png" width="150" /></div>';      
      vst_html+='<a class="button dynamic-popup" onclick="openpopup('+"'"+owner_name+"'"+','+"'"+mobile_one+"'"+','+"'"+mob2+"'"+','+"'"+email+"'"+','+"'"+vehicle_type+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+vehicle_no+"'"+','+"'"+hydro_due_dt+"'"+','+"'"+veh_msg+"'"+')" href="#">View Details</a>';
    $(".vstdata").html(vst_html);  
    }else if(veh_msg=='deny'){
      vst_html+='<div class="text-center"><div class="text-uppercase"><h2>cng filling permission</h2></div><img src="img/wrong.jpg" width="200" /></div>';      
      vst_html+='<a class="button dynamic-popup" onclick="openpopup('+"'"+owner_name+"'"+','+"'"+mobile_one+"'"+','+"'"+mob2+"'"+','+"'"+email+"'"+','+"'"+vehicle_type+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+vehicle_no+"'"+','+"'"+hydro_due_dt+"'"+','+"'"+veh_msg+"'"+')" href="#">View Details</a>';          
      $(".vstdata").html(vst_html);
    }
  }else if(status=='fail'){
    $(".vstdata").html('');
    if(veh_msg=='not_exist'){
      mainView.router.navigate("/no_vehdata/null/"); 
    }
  }
  app.preloader.hide();
});
// -------------------------------- VST MODULE ENDS ------------------------------------//
// -------------------------------- DPR MODULE STARTS ------------------------------------//
$(document).on('page:init', '.page[data-name="dpr"]', function (page) {
  menuload();
  checkConnection();
  app.preloader.show();
  var session_uid = window.localStorage.getItem("session_uid");
  var sess_designation = window.localStorage.getItem("sess_designation");

  if(sess_designation=='SGL EIC'){
    $(".dpr_rep_btn").removeClass("display-none");
    $(".dpr_rep_btn").addClass("display-block");
  }else{

    $(".dpr_rep_btn").removeClass("display-block");
    $(".dpr_rep_btn").addClass("display-none");
    $(".genrptbtn").removeClass("display-block");
    $(".genrptbtn").addClass("display-none");
    $("#dprul").removeClass("display-none");
    $("#dprul").addClass("display-block");
    $(".submitbtn").removeClass("display-none");
    $(".submitbtn").addClass("display-block");
  }
  var myDate=new Date();
  myDate.setDate(myDate.getDate()+1);
  // format a date
  
  var dt = myDate.getDate();
  var yr = myDate.getFullYear();
  var mnth = myDate.getMonth();
  //alert("tomorrow "+myDate.getMonth());
  var calendarModal_dpr = app.calendar.create({
    
    inputEl: '#demo-calendar-modal-dpr',
    openIn: 'customModal',
    dateFormat: 'dd-mm-yyyy',
    header: true,
    footer: true,
    renderToolbar: function () {    
      return '<div class="toolbar no-shadow"><div class="toolbar-inner"><div class="calendar-month-selector"><a href="#" class="link icon-only calendar-prev-month-button"><i class="f7-icons ">chevron_left</i></a><span class="current-month-value"></span><a href="#" class="link icon-only calendar-next-month-button"><i class="f7-icons ">chevron_right</i></a></div><div class="calendar-year-selector"><a href="#" class="link icon-only calendar-prev-year-button"><i class="f7-icons ">chevron_left</i></a><span class="current-year-value"></span><a href="#" class="link icon-only calendar-next-year-button"><i class="f7-icons ">chevron_right</i></a></div></div></div>'; 
    },
    disabled: {
        from: new Date(yr, mnth, dt)
    }
  });

  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getUserStations',
    data:{'session_uid':session_uid},
    success:function(result){
      $("#station_id").html(result);
    }    
  });
  app.preloader.hide();
});

function opendprsheet(){
  checkConnection();
  app.preloader.show();
  var station_id = $("#station_id").val();
  var st_name = $("#station_id option:selected").text();
  var demo_calendar_modal_dpr = $("#demo-calendar-modal-dpr").val();
  if(station_id==''){
    app.dialog.alert("Select Station");
  }else if(demo_calendar_modal_dpr==''){
    app.dialog.alert("Select Date");
  }else{
    mainView.router.navigate("/dpr_sheet/"+station_id+"/"+demo_calendar_modal_dpr+"/"+st_name+"/");
  }
  app.preloader.hide();
}
function getDprSheet(station_id,dpr_date,station_name){
  mainView.router.navigate("/dpr_sheet/");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  $("#hidd_stid").val(station_id);
  $("#hidd_dprdt").val(dpr_date);
  $(".st_name").html(station_name);
  $(".dpr_dt").html(dpr_date);


  var hidd_dprdt = $("#hidd_dprdt").val();
  //alert("hidd_dprdt "+hidd_dprdt);
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  var arr_ser = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty","twentyone","twentytwo","twentythree"];
  app.preloader.show();
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getDispensors',
    data:{'station_id':station_id,'dpr_date':dpr_date},
    success:function(result){
      var parse_res = $.parseJSON(result);
      var station_info = parse_res.station_info;
      var lcv_count = station_info.lcv_count;      
      var dispanser_count = parse_res.dispanser_count;
    

      //console.log("******** "+a_disp);
      $("#hidd_dispcnt").val(dispanser_count);
      $("#hidd_lcvcnt").val(lcv_count);
      var disp_html = '';
      var lcv_html = '';
      for(var l=1;l<=lcv_count;l++){
        /*if(l==1 || l==2){
          var req_lbl='<sup class="text-red fw-600 fs-12">*</sup>';
        }else{
          var req_lbl='';
        }*/
        //lcv_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">lcv '+l+' mfm'+req_lbl+'</td>';
        lcv_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">lcv '+l+' mfm'+'<sup class="text-red fw-600 fs-12">*</sup></td>';

        for(var lcv_mfm=0;lcv_mfm<=23;lcv_mfm++){
          if(lcv_mfm <= 9){
            var lcv_addzero = "0"+lcv_mfm;
          }else{
            var lcv_addzero = lcv_mfm;
          }
          if(lcv_mfm==0 || lcv_mfm==1){
            var dis_lcv = '';
          }else{
            var dis_lcv = 'display-none';
          }
          /*if(l==1 || l==2){
            var req_cls = 'val_comp_'+lcv_mfm;
          }else{
            var req_cls = '';
          } */
          if(g1 < g2){  
            //alert("arey");
            if(arr_ser[lcv_mfm]=="zero"){
              var read_only="readonly='readonly'";
              var readonly_cls = " readonlytxtbox";
            }else{
              var read_only="";
              var readonly_cls="";
            }
          }else if(g1 >= g2){
            if(arr_ser[lcv_mfm]!="zero"){
              var read_only="readonly='readonly'";
              var readonly_cls = " readonlytxtbox";
            }else{
              var read_only="";  
              var readonly_cls="";
            }
          }
          lcv_html+='<td class="text-uppercase '+dis_lcv+' pl-0 comp_th_'+arr_ser[lcv_mfm]+'"><input type="number" name="para[LCV_'+l+'_MFM]['+lcv_addzero+'_00]" class="td_txt val_comp_'+lcv_mfm+readonly_cls+' lcv'+l+'_mfm_'+lcv_mfm+' " '+read_only+'></td>';
          //lcv_html+='<td class="text-uppercase '+dis_lcv+' pl-0 comp_th_'+arr_ser[lcv_mfm]+'"><input type="number" name="para[LCV_'+l+'_MFM]['+lcv_addzero+'_00]" class="td_txt '+readonly_cls+' lcv'+l+'_mfm_'+lcv_mfm+' " '+read_only+' val_comp_'+lcv_mfm+'></td>';
        }
      }
      lcv_html+='</tr>';
      $(".lcv_data").html(lcv_html);
      //$(".compdata table tbody .lcv_data").html(lcv_html);

      //console.log(arr_ser);
      for(var i=1;i<=dispanser_count;i++){
        /*if(i==1){
          var req='<sup class="text-red fw-600 fs-12">*</sup>';
        }else{
          var req='';
        }*/
        
        //disp_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">DISP '+i+' A'+req+'</td>';        

        disp_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">DISP '+i+' A <sup class="text-red fw-600 fs-12">*</sup></td>';        

        for(var d_a=0;d_a<=23;d_a++){
          if(d_a <= 9){
            var addzero_a = "0"+d_a;
          }else{
            var addzero_a = d_a;
          }
          if(d_a==0 || d_a==1){
            var dis_a = '';
          }else{
            var dis_a = 'display-none';
          }
          /*if(g1 < g2){ 
            //alert("arey");
            var read_only="readonly='readonly'";
            var readonly_cls = "readonlytxtbox";
            //$(".disp_th_"+arr_ser[d_a]+" input").attr("readonly",true);
            //$(".disp_th_"+arr_ser[d_a]+" input").addClass("readonlytxtbox");
          }else{
            var read_only="";
            var readonly_cls = "";
          }*/
          if(g1 < g2){  
            //alert("arey");
            if(arr_ser[d_a]=="zero"){
              var read_only="readonly='readonly'";
              var readonly_cls = "readonlytxtbox";
            }else{
              var read_only="";
              var readonly_cls="";
            }
          }else if(g1 >= g2){
            if(arr_ser[d_a]!="zero"){
              var read_only="readonly='readonly'";
              var readonly_cls = "readonlytxtbox";
            }else{
              var read_only="";
              var readonly_cls="";
            }
          }
          //console.log("----"+'val_disp_'+i+'_'+d_a);
          disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+'></td>';
          

        }
        disp_html+='</tr>';

        //disp_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">DISP '+i+' B'+req+'</td>';
        disp_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">DISP '+i+' B<sup class="text-red fw-600 fs-12">*</sup></td>';

        for(var d_b=0;d_b<=23;d_b++){
          if(d_b <= 9){
            var addzero_b = "0"+d_b;
          }else{
            var addzero_b = d_b;
          }
          if(d_b==0 || d_b==1){
            var dis_b = '';
          }else{ 
            var dis_b = 'display-none';   
          }
          if(g1 < g2){  
            //alert("arey");
            if(arr_ser[d_b]=="zero"){
              var read_only="readonly='readonly'";
              var readonly_cls = "readonlytxtbox";
            }else{
              var read_only="";
              var readonly_cls="";
            }
            //$(".disp_th_"+arr_ser[d_b]+" input").attr("readonly",true);
            //$(".disp_th_"+arr_ser[d_b]+" input").addClass("readonlytxtbox");
          }else if(g1 >= g2){
            if(arr_ser[d_b]!="zero"){
              var read_only="readonly='readonly'";
              var readonly_cls = "readonlytxtbox";
            }else{
              var read_only="";
              var readonly_cls="";
            }
          }


          disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+'></td>';

        }        
        disp_html+='</tr>';        
      }
      $(".disp_data").html(disp_html); 
    }
  });
  
  $(".comp_th_one input").attr("readonly",true);
  $(".disp_th_one input").attr("readonly",true);
  $(".elec_th_one input").attr("readonly",true);
  $(".comp_th_one input").addClass("readonlytxtbox");
  $(".disp_th_one input").addClass("readonlytxtbox");
  $(".elec_th_one input").addClass("readonlytxtbox");

  $(".comp_th_two input").attr("readonly",true);
  $(".disp_th_two input").attr("readonly",true);
  $(".elec_th_two input").attr("readonly",true);
  $(".comp_th_two input").addClass("readonlytxtbox");
  $(".disp_th_two input").addClass("readonlytxtbox");
  $(".elec_th_two input").addClass("readonlytxtbox");

  $(".comp_th_three input").attr("readonly",true);
  $(".disp_th_three input").attr("readonly",true);
  $(".elec_th_three input").attr("readonly",true);
  $(".comp_th_three input").addClass("readonlytxtbox");
  $(".disp_th_three input").addClass("readonlytxtbox");
  $(".elec_th_three input").addClass("readonlytxtbox");

  $(".comp_th_four input").attr("readonly",true);
  $(".disp_th_four input").attr("readonly",true);
  $(".elec_th_four input").attr("readonly",true);
  $(".comp_th_four input").addClass("readonlytxtbox");
  $(".disp_th_four input").addClass("readonlytxtbox");
  $(".elec_th_four input").addClass("readonlytxtbox");

  $(".comp_th_five input").attr("readonly",true);
  $(".disp_th_five input").attr("readonly",true);
  $(".elec_th_five input").attr("readonly",true);
  $(".comp_th_five input").addClass("readonlytxtbox");
  $(".disp_th_five input").addClass("readonlytxtbox");
  $(".elec_th_five input").addClass("readonlytxtbox");

  $(".comp_th_six input").attr("readonly",true);
  $(".disp_th_six input").attr("readonly",true);
  $(".elec_th_six input").attr("readonly",true);
  $(".comp_th_six input").addClass("readonlytxtbox");
  $(".disp_th_six input").addClass("readonlytxtbox");
  $(".elec_th_six input").addClass("readonlytxtbox");

  $(".comp_th_seven input").attr("readonly",true);
  $(".disp_th_seven input").attr("readonly",true);
  $(".elec_th_seven input").attr("readonly",true);
  $(".comp_th_seven input").addClass("readonlytxtbox");
  $(".disp_th_seven input").addClass("readonlytxtbox");
  $(".elec_th_seven input").addClass("readonlytxtbox");

  $(".comp_th_eight input").attr("readonly",true);
  $(".disp_th_eight input").attr("readonly",true);
  $(".elec_th_eight input").attr("readonly",true);
  $(".comp_th_eight input").addClass("readonlytxtbox");
  $(".disp_th_eight input").addClass("readonlytxtbox");
  $(".elec_th_eight input").addClass("readonlytxtbox");

  $(".comp_th_nine input").attr("readonly",true);
  $(".disp_th_nine input").attr("readonly",true);
  $(".elec_th_nine input").attr("readonly",true);
  $(".comp_th_nine input").addClass("readonlytxtbox");
  $(".disp_th_nine input").addClass("readonlytxtbox");
  $(".elec_th_nine input").addClass("readonlytxtbox");

  $(".comp_th_ten input").attr("readonly",true);
  $(".disp_th_ten input").attr("readonly",true);
  $(".elec_th_ten input").attr("readonly",true);
  $(".comp_th_ten input").addClass("readonlytxtbox");
  $(".disp_th_ten input").addClass("readonlytxtbox");
  $(".elec_th_ten input").addClass("readonlytxtbox");

  $(".comp_th_eleven input").attr("readonly",true);
  $(".disp_th_eleven input").attr("readonly",true);
  $(".elec_th_eleven input").attr("readonly",true);
  $(".comp_th_eleven input").addClass("readonlytxtbox");
  $(".disp_th_eleven input").addClass("readonlytxtbox");
  $(".elec_th_eleven input").addClass("readonlytxtbox");

  $(".comp_th_twelve input").attr("readonly",true);
  $(".disp_th_twelve input").attr("readonly",true);
  $(".elec_th_twelve input").attr("readonly",true);
  $(".comp_th_twelve input").addClass("readonlytxtbox");
  $(".disp_th_twelve input").addClass("readonlytxtbox");
  $(".elec_th_twelve input").addClass("readonlytxtbox");

  $(".comp_th_thirteen input").attr("readonly",true);
  $(".disp_th_thirteen input").attr("readonly",true);
  $(".elec_th_thirteen input").attr("readonly",true);
  $(".comp_th_thirteen input").addClass("readonlytxtbox");
  $(".disp_th_thirteen input").addClass("readonlytxtbox");
  $(".elec_th_thirteen input").addClass("readonlytxtbox");

  $(".comp_th_fourteen input").attr("readonly",true);
  $(".disp_th_fourteen input").attr("readonly",true);
  $(".elec_th_fourteen input").attr("readonly",true);
  $(".comp_th_fourteen input").addClass("readonlytxtbox");
  $(".disp_th_fourteen input").addClass("readonlytxtbox");
  $(".elec_th_fourteen input").addClass("readonlytxtbox");

  $(".comp_th_fifteen input").attr("readonly",true);
  $(".disp_th_fifteen input").attr("readonly",true);
  $(".elec_th_fifteen input").attr("readonly",true);
  $(".comp_th_fifteen input").addClass("readonlytxtbox");
  $(".disp_th_fifteen input").addClass("readonlytxtbox");
  $(".elec_th_fifteen input").addClass("readonlytxtbox");

  $(".comp_th_sixteen input").attr("readonly",true);
  $(".disp_th_sixteen input").attr("readonly",true);
  $(".elec_th_sixteen input").attr("readonly",true);
  $(".comp_th_sixteen input").addClass("readonlytxtbox");
  $(".disp_th_sixteen input").addClass("readonlytxtbox");
  $(".elec_th_sixteen input").addClass("readonlytxtbox");

  $(".comp_th_seventeen input").attr("readonly",true);
  $(".disp_th_seventeen input").attr("readonly",true);
  $(".elec_th_seventeen input").attr("readonly",true);
  $(".comp_th_seventeen input").addClass("readonlytxtbox");
  $(".disp_th_seventeen input").addClass("readonlytxtbox");
  $(".elec_th_seventeen input").addClass("readonlytxtbox");

  $(".comp_th_eighteen input").attr("readonly",true);
  $(".disp_th_eighteen input").attr("readonly",true);
  $(".elec_th_eighteen input").attr("readonly",true);
  $(".comp_th_eighteen input").addClass("readonlytxtbox");
  $(".disp_th_eighteen input").addClass("readonlytxtbox");
  $(".elec_th_eighteen input").addClass("readonlytxtbox");

  $(".comp_th_nineteen input").attr("readonly",true);
  $(".disp_th_nineteen input").attr("readonly",true);
  $(".elec_th_nineteen input").attr("readonly",true);
  $(".comp_th_nineteen input").addClass("readonlytxtbox");
  $(".disp_th_nineteen input").addClass("readonlytxtbox");
  $(".elec_th_nineteen input").addClass("readonlytxtbox");

  $(".comp_th_twenty input").attr("readonly",true);
  $(".disp_th_twenty input").attr("readonly",true);
  $(".elec_th_twenty input").attr("readonly",true);
  $(".comp_th_twenty input").addClass("readonlytxtbox");
  $(".disp_th_twenty input").addClass("readonlytxtbox");
  $(".elec_th_twenty input").addClass("readonlytxtbox");

  $(".comp_th_twentyone input").attr("readonly",true);
  $(".disp_th_twentyone input").attr("readonly",true);
  $(".elec_th_twentyone input").attr("readonly",true);
  $(".comp_th_twentyone input").addClass("readonlytxtbox");
  $(".disp_th_twentyone input").addClass("readonlytxtbox");
  $(".elec_th_twentyone input").addClass("readonlytxtbox");

  $(".comp_th_twentytwo input").attr("readonly",true);
  $(".disp_th_twentytwo input").attr("readonly",true);
  $(".elec_th_twentytwo input").attr("readonly",true);
  $(".comp_th_twentytwo input").addClass("readonlytxtbox");
  $(".disp_th_twentytwo input").addClass("readonlytxtbox");
  $(".elec_th_twentytwo input").addClass("readonlytxtbox");

  $(".comp_th_twentythree input").attr("readonly",true);
  $(".disp_th_twentythree input").attr("readonly",true);
  $(".elec_th_twentythree input").attr("readonly",true);
  $(".comp_th_twentythree input").addClass("readonlytxtbox");
  $(".disp_th_twentythree input").addClass("readonlytxtbox");
  $(".elec_th_twentythree input").addClass("readonlytxtbox");

  
  app.preloader.hide();
  app.preloader.show();
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getDPRsheetvalues',
    data:{'station_id':station_id,'dpr_date':dpr_date},
    success:function(result){
      //console.log(result+"***");
      //$("#sheet_data").html(result);
      if(result!=''){
        var prsejson = $.parseJSON(result);
        var no_data = prsejson.no_data;
        if(no_data=="no_data"){
          app.preloader.hide();
          return false;
        }
        console.log("--------".prsejson);
        var COMP_SUCTION = prsejson.COMP_SUCTION;
        var COMP_DISCHARGE = prsejson.COMP_DISCHARGE;
        /*var LCV_1_MFM = prsejson.LCV_1_MFM;
        var LCV_2_MFM = prsejson.LCV_2_MFM;
        var LCV_3_MFM = prsejson.LCV_3_MFM;
        var LCV_4_MFM = prsejson.LCV_4_MFM;
        var LCV_5_MFM = prsejson.LCV_5_MFM;*/
        var LCV_MFM = prsejson.LCV_MFM;
        var COMP_HMR_COUNTER = prsejson.COMP_HMR_COUNTER;
        var COMP_ENR_METER = prsejson.COMP_ENR_METER;
        var I_stg_prs = prsejson.I_stg_prs;
        var II_stg_prs = prsejson.II_stg_prs;
        var III_stg_prs = prsejson.III_stg_prs;
        var I_stg_TEMP = prsejson.I_stg_TEMP;
        var II_stg_TEMP = prsejson.II_stg_TEMP;
        var III_stg_TEMP = prsejson.III_stg_TEMP;        
        var LP_OIL = prsejson.LP_OIL;
        var HP_OIL = prsejson.HP_OIL;
        var LOW_BANK_PRS = prsejson.LOW_BANK_PRS;
        var MED_BANK_PRS = prsejson.MED_BANK_PRS;
        var HIGH_BANK_PRS = prsejson.HIGH_BANK_PRS;
        var WATER_LVL = prsejson.WATER_LVL;
        var OIL_LVL = prsejson.OIL_LVL;
        var NO_OF_COMP_STARTS = prsejson.NO_OF_COMP_STARTS;
        var SUC_PRS = prsejson.SUC_PRS;

        /*var DISP_1A = prsejson.DISP_1A; 
        var DISP_1B = prsejson.DISP_1B;
        var DISP_2A = prsejson.DISP_2A;
        var DISP_2B = prsejson.DISP_2B; // STATIC //*/
        var DISP_A = prsejson.DISP_A;   // DYNAMIC //
        var DISP_B = prsejson.DISP_B;   // DYNAMIC //

        var GEB_MET_KWH = prsejson.GEB_MET_KWH;
        var GEB_MET_KVAH = prsejson.GEB_MET_KVAH;
        var GEB_MET_KVRH = prsejson.GEB_MET_KVRH;
        var DELAR_RO = prsejson.DELAR_RO;
        var VLTG = prsejson.VLTG;
        var AMP = prsejson.AMP;
        var PF = prsejson.PF;
        //alert("ajax");
        //console.log(COMP_SUCTION);
        // ---------------------------- COMPRESSOR ---------------------------- //
        for(var cs=0;cs<COMP_SUCTION.length;cs++){
          var cs_slot_param_val = COMP_SUCTION[cs].slot_param_val;
          $(".comp_suc_"+cs).val(cs_slot_param_val);
        }
        for(var cd=0;cd<COMP_DISCHARGE.length;cd++){
          var cd_slot_param_val = COMP_DISCHARGE[cd].slot_param_val;
          $(".comp_dis_"+cd).val(cd_slot_param_val);
        }
        for(var lcvmfm=0;lcvmfm<LCV_MFM.length;lcvmfm++){
          var cnt_lcv = LCV_MFM[lcvmfm].length;
          for(var lc=0;lc<cnt_lcv;lc++){            
            var lcv_val = LCV_MFM[lcvmfm][lc].slot_param_val; 
            $(".lcv"+(lcvmfm+1)+"_mfm_"+lc).val(lcv_val);
          }
        } // DYNAMIC //
        /*for(var lcv1=0;lcv1<LCV_1_MFM.length;lcv1++){
          var lcv1_mfm = LCV_1_MFM[lcv1].slot_param_val;
          $(".lcv1_mfm_"+lcv1).val(lcv1_mfm);
        }
        for(var lcv2=0;lcv2<LCV_2_MFM.length;lcv2++){
          var lcv2_mfm = LCV_2_MFM[lcv2].slot_param_val;
          $(".lcv2_mfm_"+lcv2).val(lcv2_mfm);
        }
        for(var lcv3=0;lcv3<LCV_3_MFM.length;lcv3++){
          var lcv3_mfm = LCV_3_MFM[lcv3].slot_param_val;
          $(".lcv3_mfm_"+lcv3).val(lcv3_mfm);
        }
        for(var lcv4=0;lcv4<LCV_4_MFM.length;lcv4++){
          var lcv4_mfm = LCV_4_MFM[lcv4].slot_param_val;
          $(".lcv4_mfm_"+lcv4).val(lcv4_mfm);
        }
        for(var lcv5=0;lcv5<LCV_5_MFM.length;lcv5++){
          var lcv5_mfm = LCV_5_MFM[lcv5].slot_param_val;
          $(".lcv5_mfm_"+lcv5).val(lcv5_mfm);
        } // STATIC // */
        for(var chc=0;chc<COMP_HMR_COUNTER.length;chc++){
          var chc_val = COMP_HMR_COUNTER[chc].slot_param_val;
          $(".comp_hmr_cnt_"+chc).val(chc_val);
        }
        for(var cem=0;cem<COMP_ENR_METER.length;cem++){
          var cem_val = COMP_ENR_METER[cem].slot_param_val;
          $(".comp_energy_met_"+cem).val(cem_val);
        }
        for(var isp=0;isp<I_stg_prs.length;isp++){
          var isp_val = I_stg_prs[isp].slot_param_val;
          $(".I_stg_prs_"+isp).val(isp_val);
        }
        for(var iisp=0;iisp<II_stg_prs.length;iisp++){
          var iisp_val = II_stg_prs[iisp].slot_param_val;
          $(".II_stg_prs_"+iisp).val(iisp_val);
        }
        for(var iiips=0;iiips<III_stg_prs.length;iiips++){
          var iiips_val = III_stg_prs[iiips].slot_param_val;
          $(".III_stg_prs_"+iiips).val(iiips_val);
        }
        for(var ist=0;ist<I_stg_TEMP.length;ist++){
          var ist_val = I_stg_TEMP[ist].slot_param_val;
          $(".I_stg_temp_"+ist).val(ist_val);
        }
        for(var iist=0;iist<II_stg_TEMP.length;iist++){
          var iist_val = II_stg_TEMP[iist].slot_param_val;
          $(".II_stg_temp_"+iist).val(iist_val);
        }
        for(var iiist=0;iiist<III_stg_TEMP.length;iiist++){
          var iiist_val = III_stg_TEMP[iiist].slot_param_val;
          $(".III_stg_temp_"+iiist).val(iiist_val);
        }
        for(var lpo=0;lpo<LP_OIL.length;lpo++){
          var lpo_val = LP_OIL[lpo].slot_param_val;
          $(".lp_oil_"+lpo).val(lpo_val);
        }
        for(var hpo=0;hpo<HP_OIL.length;hpo++){
          var hpo_val = HP_OIL[hpo].slot_param_val;
          $(".hp_oil_"+hpo).val(hpo_val);
        }
        for(var lbp=0;lbp<LOW_BANK_PRS.length;lbp++){
          var lbp_val = LOW_BANK_PRS[lbp].slot_param_val;
          $(".low_bank_prs_"+lbp).val(lbp_val);
        }
        for(var mbp=0;mbp<MED_BANK_PRS.length;mbp++){
          var mbp_val = MED_BANK_PRS[mbp].slot_param_val;
          $(".med_bank_prs_"+mbp).val(mbp_val);
        }
        for(var hbp=0;hbp<HIGH_BANK_PRS.length;hbp++){
          var hbp_val = HIGH_BANK_PRS[hbp].slot_param_val;
          $(".high_bank_prs_"+hbp).val(hbp_val);
        }
        for(var wl=0;wl<WATER_LVL.length;wl++){
          var wl_val = WATER_LVL[wl].slot_param_val;
          $(".water_lvl_"+wl).val(wl_val);
        }
        for(var ol=0;ol<OIL_LVL.length;ol++){
          var ol_val = OIL_LVL[ol].slot_param_val;
          $(".oil_lvl_"+ol).val(ol_val);
        }
        for(var nocs=0;nocs<NO_OF_COMP_STARTS.length;nocs++){
          var nocs_val = NO_OF_COMP_STARTS[nocs].slot_param_val;
          $(".comp_starts_"+nocs).val(nocs_val);
        }
        for(var sucp=0;sucp<SUC_PRS.length;sucp++){
          var sucp_val = SUC_PRS[sucp].slot_param_val;
          $(".suc_prs_"+sucp).val(sucp_val);
        }

        // ----------------------------- DISPENSER --------------------------------//
        //alert(DISP_A.length);
        for(var disp_aa=0;disp_aa<DISP_A.length;disp_aa++){
          var cnt_d = DISP_A[disp_aa].length;
          for(var d_aa=0;d_aa<cnt_d;d_aa++){            
            var disp_a_val = DISP_A[disp_aa][d_aa].slot_param_val;
            //console.log("disp_a_val "+disp_a_val); 
            $(".disp_"+(disp_aa+1)+"_a_"+d_aa).val(disp_a_val);
            /*if(disp_a_val==''){
              console.log("empty "+(disp_aa+1));
            }else{
              console.log("val = "+disp_a_val);
            }*/
          }
        } 
        //alert(DISP_B.length);
        for(var disp_bb=0;disp_bb<DISP_B.length;disp_bb++){
          var cnt_b = DISP_B[disp_bb].length;
          for(var d_bb=0;d_bb<cnt_b;d_bb++){            
            var disp_b_val = DISP_B[disp_bb][d_bb].slot_param_val;
            //console.log((".disp_"+(disp_bb+1)+"_a_"+d_bb)+"----"+disp_b_val); 
            $(".disp_"+(disp_bb+1)+"_b_"+d_bb).val(disp_b_val);
          }
        }
        /*for(var disp1a=0;disp1a<DISP_1A.length;disp1a++){
          var disp1a_val = DISP_1A[disp1a].slot_param_val;
          $(".disp_1_a_"+disp1a).val(disp1a_val);
        }
        for(var disp1b=0;disp1b<DISP_1B.length;disp1b++){
          var disp1b_val = DISP_1B[disp1b].slot_param_val;
          $(".disp_1_b_"+disp1b).val(disp1b_val);
        }
        for(var disp2a=0;disp2a<DISP_2A.length;disp2a++){
          var disp2a_val = DISP_2A[disp2a].slot_param_val;
          $(".disp_2_a_"+disp2a).val(disp2a_val);
        }
        for(var disp2b=0;disp2b<DISP_2B.length;disp2b++){
          var disp2b_val = DISP_2B[disp2b].slot_param_val;
          $(".disp_2_b_"+disp2b).val(disp2b_val);
        }  */ 
        // ----------------------------- ELECTRICAL --------------------------------//
        for(var gmk=0;gmk<GEB_MET_KWH.length;gmk++){
          var gmk_slot_param_val = GEB_MET_KWH[gmk].slot_param_val;
          $(".GEB_energy_mtr_KWH_"+gmk).val(gmk_slot_param_val);
        }
        for(var gmk=0;gmk<GEB_MET_KVAH.length;gmk++){
          var gmk_slot_param_val = GEB_MET_KVAH[gmk].slot_param_val;
          $(".GEB_energy_met_KVAH_"+gmk).val(gmk_slot_param_val);
        }
        for(var gmkrh=0;gmkrh<GEB_MET_KVRH.length;gmkrh++){
          var gmkrh_slot_param_val = GEB_MET_KVRH[gmkrh].slot_param_val;
          $(".GEB_energy_met_KVRH_"+gmkrh).val(gmkrh_slot_param_val);
        }
        for(var dro=0;dro<DELAR_RO.length;dro++){
          var dro_slot_param_val = DELAR_RO[dro].slot_param_val;
          $(".delar_ro_"+dro).val(dro_slot_param_val);
        }
        for(var vltg=0;vltg<VLTG.length;vltg++){
          var vltg_slot_param_val = VLTG[vltg].slot_param_val;
          $(".voltage_"+vltg).val(vltg_slot_param_val);
        }
        for(var amp=0;amp<AMP.length;amp++){
          var amp_slot_param_val = AMP[amp].slot_param_val;
          $(".amp_"+amp).val(amp_slot_param_val);
        }
        for(var pf=0;pf<PF.length;pf++){
          var pf_slot_param_val = PF[pf].slot_param_val;
          $(".pf_"+pf).val(pf_slot_param_val);
        }
      }
      /*
      $(".val_comp_0").each(function(){ c_zero++;
        console.log("val_comp_0 =>"+c_zero+" "+$(this).val());    
      });*/
      // -------------------------------- COMPRESSOR ------------------------------------ //
      var comp_0=0;
      $(".val_comp_0").each(function(){ 
        //alert($(this).val());
        if( $.trim($(this).val()).length == 0){  comp_0++;
          console.log("if@@@@@@@@@");
          //$(this).css("background", "#fde0e0");   
        }        
      });
      var comp_1=0;
      $(".val_comp_1").each(function(){  
        if( $.trim($(this).val()).length == 0){ comp_1++;
          //$(this).css("background", "#fde0e0");
        }        
      });
      // --------------------------------- DISPENSER ---------------------------------- //
      var disp_0=0;
      $('.val_disp_1_0').each(function(){
      //console.log("*** DISP 1_0 "+$(this).val()+"----------");      
        if( $.trim($(this).val()).length == 0){ disp_0++;
          //$(this).css("background", "#fde0e0");
        }        
      });
      var disp_1=0;
      $('.val_disp_1_1').each(function(){ 
      //console.log("*** DISP 1_1 "+$(this).val()+"----------");     
        if( $.trim($(this).val()).length == 0){ disp_1++;
          //$(this).css("background", "#fde0e0");
        } 
      });
      // -------------------------------------- ELECTRICAL ------------------------------------------- //
      var elec_0=0;
      $('.val_elec_0').each(function(){   
        if( $.trim($(this).val()).length == 0){ elec_0++;
          //$(this).css("background", "#fde0e0");
        }        
      });
      var elec_1=0;
      $('.val_elec_1').each(function(){   
        if( $.trim($(this).val()).length == 0){ elec_1++;
          //$(this).css("background", "#fde0e0");
        }         
      });
      //alert("HINA ############"+comp_0+" "+disp_0+" "+elec_0+" "+comp_1+" "+disp_1+" "+elec_1);
      if(comp_0 ==0  && disp_0 == 0 && elec_0==0 && comp_1==0 && disp_1==0 && elec_1==0){
        //alert("CHOCO PIE");
        //alert("HARRY");
        col_zero(comp_0,disp_0,elec_0,comp_1,disp_1,elec_1,current_time); 
      }

      //console.log("HINA ############"+comp_0+" "+disp_0+" "+elec_0+" "+comp_1+" "+disp_1+" "+elec_1);
      //var st_id = $("#hidd_stid").val();
      if(g1 >= g2){
        //alert("if(g1 >= g2)"); 
        //alert("HINA ############"+comp_0+" "+disp_0+" "+elec_0+" "+comp_1+" "+disp_1+" "+elec_1);
        if(comp_0 ==0  && disp_0 == 0 && elec_0==0 && comp_1!=0 && disp_1!=0 && elec_1!=0){          //
          if(current_time >= "01:00:00"){            
            col_zero(comp_0,disp_0,elec_0,comp_1,disp_1,elec_1,current_time); 
            $(".page1_btn").removeClass("display-none");
            $(".page1_btn").addClass("display-block");
          }
        }
        //alert("HIII"+current_time+" station_id "+st_id); 
        if(comp_0!=0  && disp_0!= 0 && elec_0!=0 && comp_1!=0 && disp_1!=0 && elec_1!=0){
          //col_zero(comp_0,disp_0,elec_0,comp_1,disp_1,elec_1,current_time); 
          //alert("HIII"+current_time);
          if(current_time >= "01:00:00"){
            for(var disp=1;disp<=23;disp++){
              //console.log("@@@ "+(".disp_th_"+arr_ser[disp]+" input"));
              $(".disp_th_"+arr_ser[disp]+" input").attr("readonly",true);
              $(".disp_th_"+arr_ser[disp]+" input").addClass("readonlytxtbox");
            }
            
            //$(".disp_th_one input").attr("readonly",true);
            //$(".disp_th_one input").addClass("readonlytxtbox");
          }
        } 
      }
      app.preloader.hide();
      
    }    
  });
  
  window.setInterval(function(){
    var d = new Date();
    var hour = d.getHours();
    var minute = d.getMinutes();
    
    if(hour <=9){
      hour="0"+hour;
    }else{
      hour=hour;
    }
    if(minute <=9){
      minute="0"+minute;
    }else{
      minute=minute;
    }
    var time = hour+":"+minute+":00";
    console.log(time);

    //for(var i=0;i<=23;i++){
    for(var i=0;i<=hour;i++){
      //for(var i=0;i<(hour-1);i++){
      console.log("i is "+i+"****** "+hour);
      var comp_var = 0;
      //console.log("############# "+(".val_comp_"+i));
      $(".val_comp_"+i).each(function(){ 
        //console.log((".val_comp_"+i)+"-----"+$(this).val());
        if( $.trim($(this).val()).length == 0){  comp_var++;
          //$(this).css("background", "#fde0e0");   
        }         
      });

      var disp_var = 0;
      $('.val_disp_1_'+i).each(function(){    
        if( $.trim($(this).val()).length == 0){ disp_var++;
          //$(this).css("background", "#fde0e0");
        }       
      });
      var elec_var = 0;
      $('.val_elec_'+i).each(function(){   
        if( $.trim($(this).val()).length == 0){ elec_var++;
          //$(this).css("background", "#fde0e0");
        }         
      });
    } 
    
    var quarter_minutes = ["00:45:00","01:45:00","02:45:00","03:45:00","04:45:00","05:45:00","06:45:00","07:45:00","08:45:00","09:45:00","10:45:00","11:45:00","12:45:00","13:45:00","14:45:00","15:45:00","16:45:00","17:45:00","18:45:00","19:45:00","20:45:00","21:45:00","22:45:00","23:45:00"];
    //var quarter_minutes = ["00:55:00","01:55:00","02:55:00","03:55:00","04:55:00","05:55:00","06:55:00","07:55:00","08:55:00","09:55:00","10:55:00","11:55:00","12:55:00","13:55:00","14:55:00","15:55:00","16:55:00","17:55:00","18:55:00","19:55:00","20:55:00","21:55:00","22:55:00","23:55:00"];
    var slot_hour = hour+":00";
    console.log(comp_var + "==========" + slot_hour+ "==========="+hour);
    
    if(quarter_minutes.indexOf(time) != -1){  
      //console.log("found"); 
      if((comp_var!=undefined && comp_var!=0) || (disp_var!=undefined && disp_var!=0) || (elec_var!=undefined && elec_var!=0)) {
        if(hour=="00"){
          var alert_hr = hour+":00";
        }else{
          var oneless_hr = hour - 1;
          var alert_hr = oneless_hr+":00";
        }
        //alert("Please fill all required values for "+slot_hour);
        //alert("Please fill all required values for "+(hour+":00"));
        alert("Please fill all required values for "+alert_hr);
      }else{
       // element found //
        console.log("All required fields are filled"); 
      }
    }else{
      //console.log("not found");//
      //element not found //
    }
  }, 60000); //60000 

  if(g1 < g2){
    //alert("#####@@@@@@");
    $(".comp_th_zero input").attr("readonly",true);
    $(".disp_th_zero input").attr("readonly",true);
    $(".elec_th_zero input").attr("readonly",true);
    $(".comp_th_zero input").addClass("readonlytxtbox");
    $(".disp_th_zero input").addClass("readonlytxtbox");
    $(".elec_th_zero input").addClass("readonlytxtbox");

    $(".page1_btn").removeClass("display-none");
    $(".page1_btn").addClass("display-block");
  } 

}
$(document).on('page:init', '.page[data-name="dpr_sheet"]', function (page) {
  menuload();
  checkConnection();
  var station_id = page.detail.route.params.station_id;
  var dpr_date = page.detail.route.params.demo_calendar_modal_dpr;
  var station_name = page.detail.route.params.st_name;

  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

  /*$.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getDispensors',
    data:{'station_id':station_id},
    success:function(result){
      var parse_res = $.parseJSON(result);
      var dispanser_count = parse_res.dispanser_count;
      var disp_html = '';
      var arr_ser = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty","twentyone","twentytwo","twentythree"];
      //console.log(arr_ser);
      for(var i=1;i<=dispanser_count;i++){
        if(i==1){
          var req='<sup class="text-red fw-600 fs-12">*</sup>';
        }else{
          var req='';
        }
        disp_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">DISP '+i+' A'+req+'</td>';        
        for(var d_a=0;d_a<=23;d_a++){
          if(d_a <= 9){
            var addzero_a = "0"+d_a;
          }else{
            var addzero_a = d_a;
          }
          if(d_a==0 || d_a==1){
            var dis_a = '';
          }else{
            var dis_a = 'display-none';
          }
          disp_html+='<td class="text-uppercase '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt disp_'+i+'_a_'+d_a+' val_disp_'+i+'_'+d_a+'"></td>';
        }
        disp_html+='</tr>';

        disp_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">DISP '+i+' B'+req+'</td>';
        for(var d_b=0;d_b<=23;d_b++){
          if(d_b <= 9){
            var addzero_b = "0"+d_b;
          }else{
            var addzero_b = d_b;
          }
          if(d_b==0 || d_b==1){
            var dis_b = '';
          }else{ 
            var dis_b = 'display-none';
          }
          disp_html+='<td class="text-uppercase '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt disp_'+i+'_b_'+d_b+' val_disp_'+i+'_'+d_b+'"></td>';
        }        
        disp_html+='</tr>';
      }
      $(".disp_data").html(disp_html); 
    }
  });*/
  //$(".disp_th_zero:after").css("content","none!important");
  $("#hidd_stid").val(station_id);
  $("#hidd_dprdt").val(dpr_date);
  $(".st_name").html(station_name);
  $(".dpr_dt").html(dpr_date);


  var hidd_dprdt = $("#hidd_dprdt").val();
  //alert("hidd_dprdt "+hidd_dprdt);
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  var arr_ser = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty","twentyone","twentytwo","twentythree"];
  app.preloader.show();
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getDispensors',
    data:{'station_id':station_id,'dpr_date':dpr_date},
    success:function(result){
      var parse_res = $.parseJSON(result);
      var station_info = parse_res.station_info;
      var lcv_count = station_info.lcv_count;      
      var dispanser_count = parse_res.dispanser_count;
      
      //var a_disp = parse_res.DISP_A;
      //alert(a_disp);
      /*for(var dispa=0;dispa<a_disp.length;dispa++){
        var cnt_d = a_disp[dispa].length;
        for(var d_aa=0;d_aa<cnt_d;d_aa++){            
          var disp_a_val = a_disp[dispa][d_aa].slot_param_val;
          //console.log("disp_a_val "+disp_a_val); 
          $(".disp_"+(dispa+1)+"_a_"+d_aa).val(disp_a_val);
        }
      }*/

      //console.log("******** "+a_disp);
      $("#hidd_dispcnt").val(dispanser_count);
      $("#hidd_lcvcnt").val(lcv_count);
      var disp_html = '';
      var lcv_html = '';
      for(var l=1;l<=lcv_count;l++){
        /*if(l==1 || l==2){
          var req_lbl='<sup class="text-red fw-600 fs-12">*</sup>';
        }else{
          var req_lbl='';
        }*/
        //lcv_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">lcv '+l+' mfm'+req_lbl+'</td>';
        lcv_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">lcv '+l+' mfm'+'<sup class="text-red fw-600 fs-12">*</sup></td>';

        for(var lcv_mfm=0;lcv_mfm<=23;lcv_mfm++){
          if(lcv_mfm <= 9){
            var lcv_addzero = "0"+lcv_mfm;
          }else{
            var lcv_addzero = lcv_mfm;
          }
          if(lcv_mfm==0 || lcv_mfm==1){
            var dis_lcv = '';
          }else{
            var dis_lcv = 'display-none';
          }
          /*if(l==1 || l==2){
            var req_cls = 'val_comp_'+lcv_mfm;
          }else{
            var req_cls = '';
          } */
          if(g1 < g2){  
            //alert("arey");
            if(arr_ser[lcv_mfm]=="zero"){
              var read_only="readonly='readonly'";
              var readonly_cls = " readonlytxtbox";
            }else{
              var read_only="";
              var readonly_cls="";
            }
          }else if(g1 >= g2){
            if(arr_ser[lcv_mfm]!="zero"){
              var read_only="readonly='readonly'";
              var readonly_cls = " readonlytxtbox";
            }else{
              var read_only="";  
              var readonly_cls="";
            }
          }
          lcv_html+='<td class="text-uppercase '+dis_lcv+' pl-0 comp_th_'+arr_ser[lcv_mfm]+'"><input type="number" name="para[LCV_'+l+'_MFM]['+lcv_addzero+'_00]" class="td_txt val_comp_'+lcv_mfm+readonly_cls+' lcv'+l+'_mfm_'+lcv_mfm+' " '+read_only+'></td>';
          //lcv_html+='<td class="text-uppercase '+dis_lcv+' pl-0 comp_th_'+arr_ser[lcv_mfm]+'"><input type="number" name="para[LCV_'+l+'_MFM]['+lcv_addzero+'_00]" class="td_txt '+readonly_cls+' lcv'+l+'_mfm_'+lcv_mfm+' " '+read_only+' val_comp_'+lcv_mfm+'></td>';
        }
      }
      lcv_html+='</tr>';
      $(".lcv_data").html(lcv_html);
      //$(".compdata table tbody .lcv_data").html(lcv_html);

      //console.log(arr_ser);
      for(var i=1;i<=dispanser_count;i++){
        /*if(i==1){
          var req='<sup class="text-red fw-600 fs-12">*</sup>';
        }else{
          var req='';
        }*/
        
        //disp_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">DISP '+i+' A'+req+'</td>';        

        disp_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">DISP '+i+' A <sup class="text-red fw-600 fs-12">*</sup></td>';        

        for(var d_a=0;d_a<=23;d_a++){
          if(d_a <= 9){
            var addzero_a = "0"+d_a;
          }else{
            var addzero_a = d_a;
          }
          if(d_a==0 || d_a==1){
            var dis_a = '';
          }else{
            var dis_a = 'display-none';
          }
          /*if(g1 < g2){ 
            //alert("arey");
            var read_only="readonly='readonly'";
            var readonly_cls = "readonlytxtbox";
            //$(".disp_th_"+arr_ser[d_a]+" input").attr("readonly",true);
            //$(".disp_th_"+arr_ser[d_a]+" input").addClass("readonlytxtbox");
          }else{
            var read_only="";
            var readonly_cls = "";
          }*/
          if(g1 < g2){  
            //alert("arey");
            if(arr_ser[d_a]=="zero"){
              var read_only="readonly='readonly'";
              var readonly_cls = "readonlytxtbox";
            }else{
              var read_only="";
              var readonly_cls="";
            }
          }else if(g1 >= g2){
            if(arr_ser[d_a]!="zero"){
              var read_only="readonly='readonly'";
              var readonly_cls = "readonlytxtbox";
            }else{
              var read_only="";
              var readonly_cls="";
            }
          }
          //console.log("----"+'val_disp_'+i+'_'+d_a);
          disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+'></td>';
          
          
          /*if(g1 < g2){ 
            //alert("arey");
            //var read_only="readonly='readonly'";
            //var readonly_cls = "readonlytxtbox";
            $(".disp_th_"+arr_ser[d_a]+" input").attr("readonly",true);
            $(".disp_th_"+arr_ser[d_a]+" input").addClass("readonlytxtbox");
          }else if(g1 >= g2){
            //console.log("HMMMMMMMM 1" +arr_ser[d_a]);
            //$(".disp_th_"+arr_ser[d_a]+" input").attr("readonly",true);
            //$(".disp_th_"+arr_ser[d_a]+" input").addClass("readonlytxtbox");
            //$(".disp_th_one input").attr("readonly",true);
            //$(".disp_th_one input").addClass("readonlytxtbox");
          }*/
        }
        disp_html+='</tr>';

        //disp_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">DISP '+i+' B'+req+'</td>';
        disp_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">DISP '+i+' B<sup class="text-red fw-600 fs-12">*</sup></td>';

        for(var d_b=0;d_b<=23;d_b++){
          if(d_b <= 9){
            var addzero_b = "0"+d_b;
          }else{
            var addzero_b = d_b;
          }
          if(d_b==0 || d_b==1){
            var dis_b = '';
          }else{ 
            var dis_b = 'display-none';   
          }
          if(g1 < g2){  
            //alert("arey");
            if(arr_ser[d_b]=="zero"){
              var read_only="readonly='readonly'";
              var readonly_cls = "readonlytxtbox";
            }else{
              var read_only="";
              var readonly_cls="";
            }
            //$(".disp_th_"+arr_ser[d_b]+" input").attr("readonly",true);
            //$(".disp_th_"+arr_ser[d_b]+" input").addClass("readonlytxtbox");
          }else if(g1 >= g2){
            if(arr_ser[d_b]!="zero"){
              var read_only="readonly='readonly'";
              var readonly_cls = "readonlytxtbox";
            }else{
              var read_only="";
              var readonly_cls="";
            }
          }


          disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+'></td>';

          
          /*if(g1 < g2){  
            //alert("arey");
            //var read_only="readonly='readonly'";
            //var readonly_cls = "readonlytxtbox";
            $(".disp_th_"+arr_ser[d_b]+" input").attr("readonly",true);
            $(".disp_th_"+arr_ser[d_b]+" input").addClass("readonlytxtbox");
          }else if(g1 >= g2){
            //console.log("HMMMMMMMM 2" + arr_ser[d_b]);
            console.log("********"+(".disp_th_"+arr_ser[d_b]));
            //$(".disp_th_"+arr_ser[d_b]+" input").attr("readonly",true);
            //$(".disp_th_"+arr_ser[d_b]+" input").addClass("readonlytxtbox");
          }*/
        }        
        disp_html+='</tr>';        
      }
      $(".disp_data").html(disp_html); 
    }
  });
  
  $(".comp_th_one input").attr("readonly",true);
  $(".disp_th_one input").attr("readonly",true);
  $(".elec_th_one input").attr("readonly",true);
  $(".comp_th_one input").addClass("readonlytxtbox");
  $(".disp_th_one input").addClass("readonlytxtbox");
  $(".elec_th_one input").addClass("readonlytxtbox");

  $(".comp_th_two input").attr("readonly",true);
  $(".disp_th_two input").attr("readonly",true);
  $(".elec_th_two input").attr("readonly",true);
  $(".comp_th_two input").addClass("readonlytxtbox");
  $(".disp_th_two input").addClass("readonlytxtbox");
  $(".elec_th_two input").addClass("readonlytxtbox");

  $(".comp_th_three input").attr("readonly",true);
  $(".disp_th_three input").attr("readonly",true);
  $(".elec_th_three input").attr("readonly",true);
  $(".comp_th_three input").addClass("readonlytxtbox");
  $(".disp_th_three input").addClass("readonlytxtbox");
  $(".elec_th_three input").addClass("readonlytxtbox");

  $(".comp_th_four input").attr("readonly",true);
  $(".disp_th_four input").attr("readonly",true);
  $(".elec_th_four input").attr("readonly",true);
  $(".comp_th_four input").addClass("readonlytxtbox");
  $(".disp_th_four input").addClass("readonlytxtbox");
  $(".elec_th_four input").addClass("readonlytxtbox");

  $(".comp_th_five input").attr("readonly",true);
  $(".disp_th_five input").attr("readonly",true);
  $(".elec_th_five input").attr("readonly",true);
  $(".comp_th_five input").addClass("readonlytxtbox");
  $(".disp_th_five input").addClass("readonlytxtbox");
  $(".elec_th_five input").addClass("readonlytxtbox");

  $(".comp_th_six input").attr("readonly",true);
  $(".disp_th_six input").attr("readonly",true);
  $(".elec_th_six input").attr("readonly",true);
  $(".comp_th_six input").addClass("readonlytxtbox");
  $(".disp_th_six input").addClass("readonlytxtbox");
  $(".elec_th_six input").addClass("readonlytxtbox");

  $(".comp_th_seven input").attr("readonly",true);
  $(".disp_th_seven input").attr("readonly",true);
  $(".elec_th_seven input").attr("readonly",true);
  $(".comp_th_seven input").addClass("readonlytxtbox");
  $(".disp_th_seven input").addClass("readonlytxtbox");
  $(".elec_th_seven input").addClass("readonlytxtbox");

  $(".comp_th_eight input").attr("readonly",true);
  $(".disp_th_eight input").attr("readonly",true);
  $(".elec_th_eight input").attr("readonly",true);
  $(".comp_th_eight input").addClass("readonlytxtbox");
  $(".disp_th_eight input").addClass("readonlytxtbox");
  $(".elec_th_eight input").addClass("readonlytxtbox");

  $(".comp_th_nine input").attr("readonly",true);
  $(".disp_th_nine input").attr("readonly",true);
  $(".elec_th_nine input").attr("readonly",true);
  $(".comp_th_nine input").addClass("readonlytxtbox");
  $(".disp_th_nine input").addClass("readonlytxtbox");
  $(".elec_th_nine input").addClass("readonlytxtbox");

  $(".comp_th_ten input").attr("readonly",true);
  $(".disp_th_ten input").attr("readonly",true);
  $(".elec_th_ten input").attr("readonly",true);
  $(".comp_th_ten input").addClass("readonlytxtbox");
  $(".disp_th_ten input").addClass("readonlytxtbox");
  $(".elec_th_ten input").addClass("readonlytxtbox");

  $(".comp_th_eleven input").attr("readonly",true);
  $(".disp_th_eleven input").attr("readonly",true);
  $(".elec_th_eleven input").attr("readonly",true);
  $(".comp_th_eleven input").addClass("readonlytxtbox");
  $(".disp_th_eleven input").addClass("readonlytxtbox");
  $(".elec_th_eleven input").addClass("readonlytxtbox");

  $(".comp_th_twelve input").attr("readonly",true);
  $(".disp_th_twelve input").attr("readonly",true);
  $(".elec_th_twelve input").attr("readonly",true);
  $(".comp_th_twelve input").addClass("readonlytxtbox");
  $(".disp_th_twelve input").addClass("readonlytxtbox");
  $(".elec_th_twelve input").addClass("readonlytxtbox");

  $(".comp_th_thirteen input").attr("readonly",true);
  $(".disp_th_thirteen input").attr("readonly",true);
  $(".elec_th_thirteen input").attr("readonly",true);
  $(".comp_th_thirteen input").addClass("readonlytxtbox");
  $(".disp_th_thirteen input").addClass("readonlytxtbox");
  $(".elec_th_thirteen input").addClass("readonlytxtbox");

  $(".comp_th_fourteen input").attr("readonly",true);
  $(".disp_th_fourteen input").attr("readonly",true);
  $(".elec_th_fourteen input").attr("readonly",true);
  $(".comp_th_fourteen input").addClass("readonlytxtbox");
  $(".disp_th_fourteen input").addClass("readonlytxtbox");
  $(".elec_th_fourteen input").addClass("readonlytxtbox");

  $(".comp_th_fifteen input").attr("readonly",true);
  $(".disp_th_fifteen input").attr("readonly",true);
  $(".elec_th_fifteen input").attr("readonly",true);
  $(".comp_th_fifteen input").addClass("readonlytxtbox");
  $(".disp_th_fifteen input").addClass("readonlytxtbox");
  $(".elec_th_fifteen input").addClass("readonlytxtbox");

  $(".comp_th_sixteen input").attr("readonly",true);
  $(".disp_th_sixteen input").attr("readonly",true);
  $(".elec_th_sixteen input").attr("readonly",true);
  $(".comp_th_sixteen input").addClass("readonlytxtbox");
  $(".disp_th_sixteen input").addClass("readonlytxtbox");
  $(".elec_th_sixteen input").addClass("readonlytxtbox");

  $(".comp_th_seventeen input").attr("readonly",true);
  $(".disp_th_seventeen input").attr("readonly",true);
  $(".elec_th_seventeen input").attr("readonly",true);
  $(".comp_th_seventeen input").addClass("readonlytxtbox");
  $(".disp_th_seventeen input").addClass("readonlytxtbox");
  $(".elec_th_seventeen input").addClass("readonlytxtbox");

  $(".comp_th_eighteen input").attr("readonly",true);
  $(".disp_th_eighteen input").attr("readonly",true);
  $(".elec_th_eighteen input").attr("readonly",true);
  $(".comp_th_eighteen input").addClass("readonlytxtbox");
  $(".disp_th_eighteen input").addClass("readonlytxtbox");
  $(".elec_th_eighteen input").addClass("readonlytxtbox");

  $(".comp_th_nineteen input").attr("readonly",true);
  $(".disp_th_nineteen input").attr("readonly",true);
  $(".elec_th_nineteen input").attr("readonly",true);
  $(".comp_th_nineteen input").addClass("readonlytxtbox");
  $(".disp_th_nineteen input").addClass("readonlytxtbox");
  $(".elec_th_nineteen input").addClass("readonlytxtbox");

  $(".comp_th_twenty input").attr("readonly",true);
  $(".disp_th_twenty input").attr("readonly",true);
  $(".elec_th_twenty input").attr("readonly",true);
  $(".comp_th_twenty input").addClass("readonlytxtbox");
  $(".disp_th_twenty input").addClass("readonlytxtbox");
  $(".elec_th_twenty input").addClass("readonlytxtbox");

  $(".comp_th_twentyone input").attr("readonly",true);
  $(".disp_th_twentyone input").attr("readonly",true);
  $(".elec_th_twentyone input").attr("readonly",true);
  $(".comp_th_twentyone input").addClass("readonlytxtbox");
  $(".disp_th_twentyone input").addClass("readonlytxtbox");
  $(".elec_th_twentyone input").addClass("readonlytxtbox");

  $(".comp_th_twentytwo input").attr("readonly",true);
  $(".disp_th_twentytwo input").attr("readonly",true);
  $(".elec_th_twentytwo input").attr("readonly",true);
  $(".comp_th_twentytwo input").addClass("readonlytxtbox");
  $(".disp_th_twentytwo input").addClass("readonlytxtbox");
  $(".elec_th_twentytwo input").addClass("readonlytxtbox");

  $(".comp_th_twentythree input").attr("readonly",true);
  $(".disp_th_twentythree input").attr("readonly",true);
  $(".elec_th_twentythree input").attr("readonly",true);
  $(".comp_th_twentythree input").addClass("readonlytxtbox");
  $(".disp_th_twentythree input").addClass("readonlytxtbox");
  $(".elec_th_twentythree input").addClass("readonlytxtbox");

  /*var hidd_dprdt = $("#hidd_dprdt").val();
  //alert("hidd_dprdt "+hidd_dprdt);
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getDispensors',
    data:{'station_id':station_id},
    success:function(result){
      var parse_res = $.parseJSON(result);
      var dispanser_count = parse_res.dispanser_count;
      var disp_html = '';
      var arr_ser = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty","twentyone","twentytwo","twentythree"];
      //console.log(arr_ser);
      for(var i=1;i<=dispanser_count;i++){
        if(i==1){
          var req='<sup class="text-red fw-600 fs-12">*</sup>';
        }else{
          var req='';
        }
        if(g1 < g2){
          //alert("arey");
          var read_only="readonly='readonly'";
          var readonly_cls = "readonlytxtbox";
        }else{
          var read_only="";
          var readonly_cls = "";
        }
        disp_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">DISP '+i+' A'+req+'</td>';        
        for(var d_a=0;d_a<=23;d_a++){
          if(d_a <= 9){
            var addzero_a = "0"+d_a;
          }else{
            var addzero_a = d_a;
          }
          if(d_a==0 || d_a==1){
            var dis_a = '';
          }else{
            var dis_a = 'display-none';
          }
          disp_html+='<td class="text-uppercase '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_'+i+'_'+d_a+'" '+read_only+'></td>';
        }
        disp_html+='</tr>';

        disp_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">DISP '+i+' B'+req+'</td>';
        for(var d_b=0;d_b<=23;d_b++){
          if(d_b <= 9){
            var addzero_b = "0"+d_b;
          }else{
            var addzero_b = d_b;
          }
          if(d_b==0 || d_b==1){
            var dis_b = '';
          }else{ 
            var dis_b = 'display-none';
          }
          disp_html+='<td class="text-uppercase '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_'+i+'_'+d_b+'" '+read_only+'></td>';
        }        
        disp_html+='</tr>';
      }
      $(".disp_data").html(disp_html); 
    }
  });*/
  app.preloader.hide();
  app.preloader.show();
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getDPRsheetvalues',
    data:{'station_id':station_id,'dpr_date':dpr_date},
    success:function(result){
      //console.log(result+"***");
      //$("#sheet_data").html(result);
      if(result!=''){
        var prsejson = $.parseJSON(result);
        var no_data = prsejson.no_data;
        if(no_data=="no_data"){
          app.preloader.hide();
          return false;
        }
        console.log("--------".prsejson);
        var COMP_SUCTION = prsejson.COMP_SUCTION;
        var COMP_DISCHARGE = prsejson.COMP_DISCHARGE;
        /*var LCV_1_MFM = prsejson.LCV_1_MFM;
        var LCV_2_MFM = prsejson.LCV_2_MFM;
        var LCV_3_MFM = prsejson.LCV_3_MFM;
        var LCV_4_MFM = prsejson.LCV_4_MFM;
        var LCV_5_MFM = prsejson.LCV_5_MFM;*/
        var LCV_MFM = prsejson.LCV_MFM;
        var COMP_HMR_COUNTER = prsejson.COMP_HMR_COUNTER;
        var COMP_ENR_METER = prsejson.COMP_ENR_METER;
        var I_stg_prs = prsejson.I_stg_prs;
        var II_stg_prs = prsejson.II_stg_prs;
        var III_stg_prs = prsejson.III_stg_prs;
        var I_stg_TEMP = prsejson.I_stg_TEMP;
        var II_stg_TEMP = prsejson.II_stg_TEMP;
        var III_stg_TEMP = prsejson.III_stg_TEMP;        
        var LP_OIL = prsejson.LP_OIL;
        var HP_OIL = prsejson.HP_OIL;
        var LOW_BANK_PRS = prsejson.LOW_BANK_PRS;
        var MED_BANK_PRS = prsejson.MED_BANK_PRS;
        var HIGH_BANK_PRS = prsejson.HIGH_BANK_PRS;
        var WATER_LVL = prsejson.WATER_LVL;
        var OIL_LVL = prsejson.OIL_LVL;
        var NO_OF_COMP_STARTS = prsejson.NO_OF_COMP_STARTS;
        var SUC_PRS = prsejson.SUC_PRS;

        /*var DISP_1A = prsejson.DISP_1A; 
        var DISP_1B = prsejson.DISP_1B;
        var DISP_2A = prsejson.DISP_2A;
        var DISP_2B = prsejson.DISP_2B; // STATIC //*/
        var DISP_A = prsejson.DISP_A;   // DYNAMIC //
        var DISP_B = prsejson.DISP_B;   // DYNAMIC //

        var GEB_MET_KWH = prsejson.GEB_MET_KWH;
        var GEB_MET_KVAH = prsejson.GEB_MET_KVAH;
        var GEB_MET_KVRH = prsejson.GEB_MET_KVRH;
        var DELAR_RO = prsejson.DELAR_RO;
        var VLTG = prsejson.VLTG;
        var AMP = prsejson.AMP;
        var PF = prsejson.PF;
        //alert("ajax");
        //console.log(COMP_SUCTION);
        // ---------------------------- COMPRESSOR ---------------------------- //
        for(var cs=0;cs<COMP_SUCTION.length;cs++){
          var cs_slot_param_val = COMP_SUCTION[cs].slot_param_val;
          $(".comp_suc_"+cs).val(cs_slot_param_val);
        }
        for(var cd=0;cd<COMP_DISCHARGE.length;cd++){
          var cd_slot_param_val = COMP_DISCHARGE[cd].slot_param_val;
          $(".comp_dis_"+cd).val(cd_slot_param_val);
        }
        for(var lcvmfm=0;lcvmfm<LCV_MFM.length;lcvmfm++){
          var cnt_lcv = LCV_MFM[lcvmfm].length;
          for(var lc=0;lc<cnt_lcv;lc++){            
            var lcv_val = LCV_MFM[lcvmfm][lc].slot_param_val; 
            $(".lcv"+(lcvmfm+1)+"_mfm_"+lc).val(lcv_val);
          }
        } // DYNAMIC //
        /*for(var lcv1=0;lcv1<LCV_1_MFM.length;lcv1++){
          var lcv1_mfm = LCV_1_MFM[lcv1].slot_param_val;
          $(".lcv1_mfm_"+lcv1).val(lcv1_mfm);
        }
        for(var lcv2=0;lcv2<LCV_2_MFM.length;lcv2++){
          var lcv2_mfm = LCV_2_MFM[lcv2].slot_param_val;
          $(".lcv2_mfm_"+lcv2).val(lcv2_mfm);
        }
        for(var lcv3=0;lcv3<LCV_3_MFM.length;lcv3++){
          var lcv3_mfm = LCV_3_MFM[lcv3].slot_param_val;
          $(".lcv3_mfm_"+lcv3).val(lcv3_mfm);
        }
        for(var lcv4=0;lcv4<LCV_4_MFM.length;lcv4++){
          var lcv4_mfm = LCV_4_MFM[lcv4].slot_param_val;
          $(".lcv4_mfm_"+lcv4).val(lcv4_mfm);
        }
        for(var lcv5=0;lcv5<LCV_5_MFM.length;lcv5++){
          var lcv5_mfm = LCV_5_MFM[lcv5].slot_param_val;
          $(".lcv5_mfm_"+lcv5).val(lcv5_mfm);
        } // STATIC // */
        for(var chc=0;chc<COMP_HMR_COUNTER.length;chc++){
          var chc_val = COMP_HMR_COUNTER[chc].slot_param_val;
          $(".comp_hmr_cnt_"+chc).val(chc_val);
        }
        for(var cem=0;cem<COMP_ENR_METER.length;cem++){
          var cem_val = COMP_ENR_METER[cem].slot_param_val;
          $(".comp_energy_met_"+cem).val(cem_val);
        }
        for(var isp=0;isp<I_stg_prs.length;isp++){
          var isp_val = I_stg_prs[isp].slot_param_val;
          $(".I_stg_prs_"+isp).val(isp_val);
        }
        for(var iisp=0;iisp<II_stg_prs.length;iisp++){
          var iisp_val = II_stg_prs[iisp].slot_param_val;
          $(".II_stg_prs_"+iisp).val(iisp_val);
        }
        for(var iiips=0;iiips<III_stg_prs.length;iiips++){
          var iiips_val = III_stg_prs[iiips].slot_param_val;
          $(".III_stg_prs_"+iiips).val(iiips_val);
        }
        for(var ist=0;ist<I_stg_TEMP.length;ist++){
          var ist_val = I_stg_TEMP[ist].slot_param_val;
          $(".I_stg_temp_"+ist).val(ist_val);
        }
        for(var iist=0;iist<II_stg_TEMP.length;iist++){
          var iist_val = II_stg_TEMP[iist].slot_param_val;
          $(".II_stg_temp_"+iist).val(iist_val);
        }
        for(var iiist=0;iiist<III_stg_TEMP.length;iiist++){
          var iiist_val = III_stg_TEMP[iiist].slot_param_val;
          $(".III_stg_temp_"+iiist).val(iiist_val);
        }
        for(var lpo=0;lpo<LP_OIL.length;lpo++){
          var lpo_val = LP_OIL[lpo].slot_param_val;
          $(".lp_oil_"+lpo).val(lpo_val);
        }
        for(var hpo=0;hpo<HP_OIL.length;hpo++){
          var hpo_val = HP_OIL[hpo].slot_param_val;
          $(".hp_oil_"+hpo).val(hpo_val);
        }
        for(var lbp=0;lbp<LOW_BANK_PRS.length;lbp++){
          var lbp_val = LOW_BANK_PRS[lbp].slot_param_val;
          $(".low_bank_prs_"+lbp).val(lbp_val);
        }
        for(var mbp=0;mbp<MED_BANK_PRS.length;mbp++){
          var mbp_val = MED_BANK_PRS[mbp].slot_param_val;
          $(".med_bank_prs_"+mbp).val(mbp_val);
        }
        for(var hbp=0;hbp<HIGH_BANK_PRS.length;hbp++){
          var hbp_val = HIGH_BANK_PRS[hbp].slot_param_val;
          $(".high_bank_prs_"+hbp).val(hbp_val);
        }
        for(var wl=0;wl<WATER_LVL.length;wl++){
          var wl_val = WATER_LVL[wl].slot_param_val;
          $(".water_lvl_"+wl).val(wl_val);
        }
        for(var ol=0;ol<OIL_LVL.length;ol++){
          var ol_val = OIL_LVL[ol].slot_param_val;
          $(".oil_lvl_"+ol).val(ol_val);
        }
        for(var nocs=0;nocs<NO_OF_COMP_STARTS.length;nocs++){
          var nocs_val = NO_OF_COMP_STARTS[nocs].slot_param_val;
          $(".comp_starts_"+nocs).val(nocs_val);
        }
        for(var sucp=0;sucp<SUC_PRS.length;sucp++){
          var sucp_val = SUC_PRS[sucp].slot_param_val;
          $(".suc_prs_"+sucp).val(sucp_val);
        }

        // ----------------------------- DISPENSER --------------------------------//
        //alert(DISP_A.length);
        for(var disp_aa=0;disp_aa<DISP_A.length;disp_aa++){
          var cnt_d = DISP_A[disp_aa].length;
          for(var d_aa=0;d_aa<cnt_d;d_aa++){            
            var disp_a_val = DISP_A[disp_aa][d_aa].slot_param_val;
            //console.log("disp_a_val "+disp_a_val); 
            $(".disp_"+(disp_aa+1)+"_a_"+d_aa).val(disp_a_val);
            /*if(disp_a_val==''){
              console.log("empty "+(disp_aa+1));
            }else{
              console.log("val = "+disp_a_val);
            }*/
          }
        } 
        //alert(DISP_B.length);
        for(var disp_bb=0;disp_bb<DISP_B.length;disp_bb++){
          var cnt_b = DISP_B[disp_bb].length;
          for(var d_bb=0;d_bb<cnt_b;d_bb++){            
            var disp_b_val = DISP_B[disp_bb][d_bb].slot_param_val;
            //console.log((".disp_"+(disp_bb+1)+"_a_"+d_bb)+"----"+disp_b_val); 
            $(".disp_"+(disp_bb+1)+"_b_"+d_bb).val(disp_b_val);
          }
        }
        /*for(var disp1a=0;disp1a<DISP_1A.length;disp1a++){
          var disp1a_val = DISP_1A[disp1a].slot_param_val;
          $(".disp_1_a_"+disp1a).val(disp1a_val);
        }
        for(var disp1b=0;disp1b<DISP_1B.length;disp1b++){
          var disp1b_val = DISP_1B[disp1b].slot_param_val;
          $(".disp_1_b_"+disp1b).val(disp1b_val);
        }
        for(var disp2a=0;disp2a<DISP_2A.length;disp2a++){
          var disp2a_val = DISP_2A[disp2a].slot_param_val;
          $(".disp_2_a_"+disp2a).val(disp2a_val);
        }
        for(var disp2b=0;disp2b<DISP_2B.length;disp2b++){
          var disp2b_val = DISP_2B[disp2b].slot_param_val;
          $(".disp_2_b_"+disp2b).val(disp2b_val);
        }  */ 
        // ----------------------------- ELECTRICAL --------------------------------//
        for(var gmk=0;gmk<GEB_MET_KWH.length;gmk++){
          var gmk_slot_param_val = GEB_MET_KWH[gmk].slot_param_val;
          $(".GEB_energy_mtr_KWH_"+gmk).val(gmk_slot_param_val);
        }
        for(var gmk=0;gmk<GEB_MET_KVAH.length;gmk++){
          var gmk_slot_param_val = GEB_MET_KVAH[gmk].slot_param_val;
          $(".GEB_energy_met_KVAH_"+gmk).val(gmk_slot_param_val);
        }
        for(var gmkrh=0;gmkrh<GEB_MET_KVRH.length;gmkrh++){
          var gmkrh_slot_param_val = GEB_MET_KVRH[gmkrh].slot_param_val;
          $(".GEB_energy_met_KVRH_"+gmkrh).val(gmkrh_slot_param_val);
        }
        for(var dro=0;dro<DELAR_RO.length;dro++){
          var dro_slot_param_val = DELAR_RO[dro].slot_param_val;
          $(".delar_ro_"+dro).val(dro_slot_param_val);
        }
        for(var vltg=0;vltg<VLTG.length;vltg++){
          var vltg_slot_param_val = VLTG[vltg].slot_param_val;
          $(".voltage_"+vltg).val(vltg_slot_param_val);
        }
        for(var amp=0;amp<AMP.length;amp++){
          var amp_slot_param_val = AMP[amp].slot_param_val;
          $(".amp_"+amp).val(amp_slot_param_val);
        }
        for(var pf=0;pf<PF.length;pf++){
          var pf_slot_param_val = PF[pf].slot_param_val;
          $(".pf_"+pf).val(pf_slot_param_val);
        }
      }
      /*
      $(".val_comp_0").each(function(){ c_zero++;
        console.log("val_comp_0 =>"+c_zero+" "+$(this).val());    
      });*/
      // -------------------------------- COMPRESSOR ------------------------------------ //
      var comp_0=0;
      $(".val_comp_0").each(function(){ 
        //alert($(this).val());
        if( $.trim($(this).val()).length == 0){  comp_0++;
          console.log("if@@@@@@@@@");
          //$(this).css("background", "#fde0e0");   
        }        
      });
      var comp_1=0;
      $(".val_comp_1").each(function(){  
        if( $.trim($(this).val()).length == 0){ comp_1++;
          //$(this).css("background", "#fde0e0");
        }        
      });
      // --------------------------------- DISPENSER ---------------------------------- //
      var disp_0=0;
      $('.val_disp_1_0').each(function(){
      //console.log("*** DISP 1_0 "+$(this).val()+"----------");      
        if( $.trim($(this).val()).length == 0){ disp_0++;
          //$(this).css("background", "#fde0e0");
        }        
      });
      var disp_1=0;
      $('.val_disp_1_1').each(function(){ 
      //console.log("*** DISP 1_1 "+$(this).val()+"----------");     
        if( $.trim($(this).val()).length == 0){ disp_1++;
          //$(this).css("background", "#fde0e0");
        } 
      });
      // -------------------------------------- ELECTRICAL ------------------------------------------- //
      var elec_0=0;
      $('.val_elec_0').each(function(){   
        if( $.trim($(this).val()).length == 0){ elec_0++;
          //$(this).css("background", "#fde0e0");
        }        
      });
      var elec_1=0;
      $('.val_elec_1').each(function(){   
        if( $.trim($(this).val()).length == 0){ elec_1++;
          //$(this).css("background", "#fde0e0");
        }         
      });
      //alert("HINA ############"+comp_0+" "+disp_0+" "+elec_0+" "+comp_1+" "+disp_1+" "+elec_1);
      if(comp_0 ==0  && disp_0 == 0 && elec_0==0 && comp_1==0 && disp_1==0 && elec_1==0){
        //alert("CHOCO PIE");
        //alert("HARRY");
        col_zero(comp_0,disp_0,elec_0,comp_1,disp_1,elec_1,current_time); 
      }

      //console.log("HINA ############"+comp_0+" "+disp_0+" "+elec_0+" "+comp_1+" "+disp_1+" "+elec_1);
      //var st_id = $("#hidd_stid").val();
      if(g1 >= g2){
        //alert("if(g1 >= g2)"); 
        //alert("HINA ############"+comp_0+" "+disp_0+" "+elec_0+" "+comp_1+" "+disp_1+" "+elec_1);
        if(comp_0 ==0  && disp_0 == 0 && elec_0==0 && comp_1!=0 && disp_1!=0 && elec_1!=0){          //
          if(current_time >= "01:00:00"){            
            col_zero(comp_0,disp_0,elec_0,comp_1,disp_1,elec_1,current_time); 
            $(".page1_btn").removeClass("display-none");
            $(".page1_btn").addClass("display-block");
          }
        }
        //alert("HIII"+current_time+" station_id "+st_id); 
        if(comp_0!=0  && disp_0!= 0 && elec_0!=0 && comp_1!=0 && disp_1!=0 && elec_1!=0){
          //col_zero(comp_0,disp_0,elec_0,comp_1,disp_1,elec_1,current_time); 
          //alert("HIII"+current_time);
          if(current_time >= "01:00:00"){
            for(var disp=1;disp<=23;disp++){
              //console.log("@@@ "+(".disp_th_"+arr_ser[disp]+" input"));
              $(".disp_th_"+arr_ser[disp]+" input").attr("readonly",true);
              $(".disp_th_"+arr_ser[disp]+" input").addClass("readonlytxtbox");
            }
            
            //$(".disp_th_one input").attr("readonly",true);
            //$(".disp_th_one input").addClass("readonlytxtbox");
          }
        } 
      }
      app.preloader.hide();
      // if(g1 <= g2){
      //   alert("HINA ############"+comp_0+" "+disp_0+" "+elec_0+" "+comp_1+" "+disp_1+" "+elec_1);
      //   if(comp_0==0 && disp_0==0 && elec_0 && comp_1!=0 && disp_1!=0 && elec_1!=0){
      //     alert("BOOST");
      //     if(current_time >= "01:00:00"){
      //       alert("YUPPY");
      //     }
      //   }
      // }
    }    


  });

  
  
  
  window.setInterval(function(){
    var d = new Date();
    var hour = d.getHours();
    var minute = d.getMinutes();
    
    if(hour <=9){
      hour="0"+hour;
    }else{
      hour=hour;
    }
    if(minute <=9){
      minute="0"+minute;
    }else{
      minute=minute;
    }
    var time = hour+":"+minute+":00";
    console.log(time);

    //for(var i=0;i<=23;i++){
    for(var i=0;i<=hour;i++){
      //for(var i=0;i<(hour-1);i++){
      console.log("i is "+i+"****** "+hour);
      var comp_var = 0;
      //console.log("############# "+(".val_comp_"+i));
      $(".val_comp_"+i).each(function(){ 
        //console.log((".val_comp_"+i)+"-----"+$(this).val());
        if( $.trim($(this).val()).length == 0){  comp_var++;
          //$(this).css("background", "#fde0e0");   
        }         
      });

      var disp_var = 0;
      $('.val_disp_1_'+i).each(function(){    
        if( $.trim($(this).val()).length == 0){ disp_var++;
          //$(this).css("background", "#fde0e0");
        }       
      });
      var elec_var = 0;
      $('.val_elec_'+i).each(function(){   
        if( $.trim($(this).val()).length == 0){ elec_var++;
          //$(this).css("background", "#fde0e0");
        }         
      });
    } 
    
    var quarter_minutes = ["00:45:00","01:45:00","02:45:00","03:45:00","04:45:00","05:45:00","06:45:00","07:45:00","08:45:00","09:45:00","10:45:00","11:45:00","12:45:00","13:45:00","14:45:00","15:45:00","16:45:00","17:45:00","18:45:00","19:45:00","20:45:00","21:45:00","22:45:00","23:45:00"];
    //var quarter_minutes = ["00:55:00","01:55:00","02:55:00","03:55:00","04:55:00","05:55:00","06:55:00","07:55:00","08:55:00","09:55:00","10:55:00","11:55:00","12:55:00","13:55:00","14:55:00","15:55:00","16:55:00","17:55:00","18:55:00","19:55:00","20:55:00","21:55:00","22:55:00","23:55:00"];
    var slot_hour = hour+":00";
    console.log(comp_var + "==========" + slot_hour+ "==========="+hour);
    
    if(quarter_minutes.indexOf(time) != -1){  
      //console.log("found"); 
      if((comp_var!=undefined && comp_var!=0) || (disp_var!=undefined && disp_var!=0) || (elec_var!=undefined && elec_var!=0)) {
        if(hour=="00"){
          var alert_hr = hour+":00";
        }else{
          var oneless_hr = hour - 1;
          var alert_hr = oneless_hr+":00";
        }
        //alert("Please fill all required values for "+slot_hour);
        //alert("Please fill all required values for "+(hour+":00"));
        alert("Please fill all required values for "+alert_hr);
      }else{
       // element found //
        console.log("All required fields are filled"); 
      }
    }else{
      //console.log("not found");//
      //element not found //
    }
  }, 60000); //60000 
//300000

  // var hidd_dprdt = $("#hidd_dprdt").val();
  // //alert("hidd_dprdt "+hidd_dprdt);
  // var d = new Date();
  // var month = d.getMonth()+1;
  // var day = d.getDate();
  // //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  // var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  // var split_hiddt = hidd_dprdt.split("-");
  // var split_yr = split_hiddt[2];
  // var split_mn = split_hiddt[1];
  // var split_dt = split_hiddt[0];
  // var today_yr =d.getFullYear();
  // var today_mn = month;
  // var today_dt = day;
  // var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  // var g1 = new Date(split_yr, split_mn, split_dt);  
  // var g2 = new Date(today_yr, today_mn, today_dt);
  if(g1 < g2){
    //alert("#####@@@@@@");
    $(".comp_th_zero input").attr("readonly",true);
    $(".disp_th_zero input").attr("readonly",true);
    $(".elec_th_zero input").attr("readonly",true);
    $(".comp_th_zero input").addClass("readonlytxtbox");
    $(".disp_th_zero input").addClass("readonlytxtbox");
    $(".elec_th_zero input").addClass("readonlytxtbox");

  } 


  // -------------------------------- COMPRESSOR ------------------------------------ //
  var comp_0=0;
  $(".val_comp_0").each(function(){  
    if( $.trim($(this).val()).length == 0){ comp_0++;
      //$(this).css("background", "#fde0e0");
    }        
  });
  var comp_1=0;
  $(".val_comp_1").each(function(){  
    if( $.trim($(this).val()).length == 0){ comp_1++;
      //$(this).css("background", "#fde0e0");
    }        
  });
  // --------------------------------- DISPENSER ---------------------------------- //
  var disp_0=0;
  $('.val_disp_1_0').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_0++;
      //$(this).css("background", "#fde0e0");
    } 
  });
  var disp_1=0;
  $('.val_disp_1_1').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_1++;
      //$(this).css("background", "#fde0e0");
    } 
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_0=0;
  $('.val_elec_0').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_0++;
      //$(this).css("background", "#fde0e0");
    }         
  });
  var elec_1=0;
  $('.val_elec_1').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_1++;
      //$(this).css("background", "#fde0e0");
    }         
  });
/*if(g1 >= g2){
    //alert("HAHHAHAH");
    if(disp_0==0){
      //alert("AAAAAAA");
      $(".disp_th_one input").attr("readonly",true);  
      $(".disp_th_one input").addClass("readonlytxtbox");  
    }
  }*/
    //alert("YUPPY");
  // if(comp_0==0 && disp_0==0 && elec_0 && comp_1!=0 && disp_1!=0 && elec_1!=0){
  //     if(g1<=g2){
  //     alert("HEY");
  //     if(current_time >= "01:00:00"){
  //       alert("DON'T LIE");
  //       col_zero(comp_0,disp_0,elec_0,comp_1,disp_1,elec_1,current_time);
  //     }
  //   }
  // }
  /*if(comp_1!=0 && disp_1!=0 && elec_1!=0){
    alert("BIG");
    if(g1 <= g2){
      alert("BOSS");
      $(".val_comp_1").attr("readonly",false);
      $(".val_comp_1").removeClass("readonlytxtbox");
      $(".lcv3_mfm_1").attr("readonly",false);
      $(".lcv3_mfm_1").removeClass("readonlytxtbox");
      $(".lcv4_mfm_1").attr("readonly",false);
      $(".lcv4_mfm_1").removeClass("readonlytxtbox");
      $(".lcv5_mfm_1").attr("readonly",false);
      $(".lcv5_mfm_1").removeClass("readonlytxtbox");

      $(".val_disp_1_1").attr("readonly",false);
      $(".val_disp_1_1").removeClass("readonlytxtbox");
      $(".disp_2_a_1").attr("readonly",false);
      $(".disp_2_a_1").removeClass("readonlytxtbox");
      $(".disp_2_b_1").attr("readonly",false);
      $(".disp_2_b_1").removeClass("readonlytxtbox");

      $(".val_elec_1").attr("readonly",false);
      $(".val_elec_1").removeClass("readonlytxtbox");

      if(current_time >= "01:00:00"){
      //if(current_time >= "01:00:00"){
        //alert(":)");
        $(".page1_btn").removeClass("display-none");
        $(".page1_btn").addClass("display-block");
      }
    }
  }*/
  /*$.ajax({
    type:'PUT', 
    url:base_url+'APP/Appcontroller/getDPRsheetFields',
    //data:{'session_uid':session_uid},
    success:function(result){
      console.log(result);
      $("#sheet_data").html(result);
    }    
  });*/
  //doSomething();
});

function doSomething() {
  var d = new Date();
  //var minutes = 15 - d.getMinutes() % 15; // the number of minutes till the next 15.
  var minutes = 45 - d.getMinutes() % 45; // the number of minutes till the next 15.
  window.setTimeout(doSomething, minutes * 60 * 1000);

   //code to be run
   console.log("On the quarter-hour");
   /*var d = new Date(),
   current_minutes = d.getMinutes(),
   current_hour = d.getHours(),
   next_min_hit = 0;

   if ( current_minutes >= 0 && current_minutes < 15 )
      next_min_hit = 15;
   if ( current_minutes >= 15 && current_minutes < 30 )
      next_min_hit = 30;
   if ( current_minutes >= 30 && current_minutes < 45 )
      next_min_hit = 45;
   if ( current_minutes >= 45 && current_minutes < 59 ){
      next_min_hit = 0;
      current_hour++;
   }
   var h = new Date(d.getFullYear(), d.getMonth(), d.getDate(), current_hour, next_min_hit , 0, 0),
   e = h - d;
   window.setTimeout(doSomething, e);

   //code to be run
   console.log("On the hour"); */
}
function show_secondpg(){
  //alert("show_secondpg");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  $(".comp_th_zero").removeClass("tbl-cell");
  $(".comp_th_zero").addClass("display-none");
  $(".comp_th_two").removeClass("display-none");
  $(".comp_th_two").addClass("tbl-cell");
  $(".disp_th_zero").removeClass("tbl-cell");
  $(".disp_th_zero").addClass("display-none");
  $(".disp_th_two").removeClass("display-none");
  $(".disp_th_two").addClass("tbl-cell");
  $(".elec_th_zero").removeClass("tbl-cell");
  $(".elec_th_zero").addClass("display-none");
  $(".elec_th_two").removeClass("display-none");
  $(".elec_th_two").addClass("tbl-cell");

  

  $(".page2_btn").removeClass("display-none");
  $(".page2_btn").addClass("display-block"); // old //
  // if(current_time >= "01:00:00"){
  //   //alert(current_time+" *** ");
  //   $(".page2_btn").removeClass("display-none");
  //   $(".page2_btn").addClass("display-block");
  // }else{
  //   alert(current_time+"ELSE ---- ");
  //   $(".page2_btn").removeClass("display-block");
  //   $(".page2_btn").addClass("display-none");
  // }
  
  $(".prev1_btn").removeClass("display-none");
  $(".prev1_btn").addClass("display-block");
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_one =0;
  $(".val_comp_1").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_one++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_two =0;
  $(".val_comp_2").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_two++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- //
  var disp_one=0;
  $('.val_disp_1_1').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_one++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }  
  });
  var disp_two=0;
  $('.val_disp_1_2').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_two++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_one=0;
  $('.val_elec_1').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_one++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_two=0;
  $('.val_elec_2').each(function(){ 
    //alert($(this).val());
    if( $.trim($(this).val()).length == 0){ elec_two++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff"); 
    }         
  });
  addDPR();
  col_one(c_one,disp_one,elec_one,c_two,disp_two,elec_two,current_time);
  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");  
 
  var hidd_dprdt = $("#hidd_dprdt").val();
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
    var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
    var split_hiddt = hidd_dprdt.split("-");
    var split_yr = split_hiddt[2];
    var split_mn = split_hiddt[1];      
    var split_dt = split_hiddt[0];
    var today_yr =d.getFullYear();
    var today_mn = month;
    var today_dt = day;
    var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
    var g1 = new Date(split_yr, split_mn, split_dt);  
    var g2 = new Date(today_yr, today_mn, today_dt);

    //alert(g1+"-----------"+g2);
    if(g1 >= g2){
      //alert("if(g1 >= g2)");
        if(c_one!=0 && disp_one!=0 && elec_one!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page2_btn").removeClass("display-block");
          $(".page2_btn").addClass("display-none");
          $(".prev2_btn").removeClass("display-block");
          $(".prev2_btn").addClass("display-none");
        }
        if(c_two!=0 || disp_two!=0 || elec_two!=0){
          //alert("COME ON");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page2_btn").removeClass("display-block");
          $(".page2_btn").addClass("display-none");
          $(".prev2_btn").removeClass("display-block");
          $(".prev2_btn").addClass("display-none");
        }
        if(c_one==0 && disp_one==0 && elec_one==0 && c_two!=0 && disp_two!=0 && elec_two!=0){
          $(".page2_btn").removeClass("display-block");
          $(".page2_btn").addClass("display-none");
          $(".prev2_btn").removeClass("display-block");
          $(".prev2_btn").addClass("display-none");
        }
    }
    /*if(g1 <= g2){ alert("arey");
      if(c_one==0 && disp_one==0 && elec_one==0 && c_two==0 && disp_two==0 && elec_two==0){
        if(current_time >= "01:00:00"){
          alert("WORLD----------");
           $(".page2_btn").removeClass("display-block");
          $(".page2_btn").addClass("display-none");
        }
      }
      } */ 
    
  // if(g1 == g2){
  //       alert("arey");
  //       if(c_one==0 && disp_one==0 && elec_one==0 && c_two==0 && disp_two==0 && elec_two==0){
  //         if(current_time >= "02:00:00"){
  //           alert("WORLD----------");
  //           //$(".page1_btn").removeClass("display-none");
  //           //$(".page1_btn").addClass("display-block");
  //           //col_one(c_one,disp_one,elec_one,c_two,disp_1,disp_two,current_time);
  //           $(".page2_btn").removeClass("display-block");
  //           $(".page2_btn").addClass("display-none");
  //         }
  //       }
  //     }
}
function show_thirdpg(){
  //alert("show_thirdpg");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

  $(".comp_th_one").removeClass("tbl-cell");
  $(".comp_th_one").addClass("display-none");
  $(".comp_th_three").removeClass("display-none");
  $(".comp_th_three").addClass("tbl-cell");
  $(".disp_th_one").removeClass("tbl-cell");
  $(".disp_th_one").addClass("display-none");
  $(".disp_th_three").removeClass("display-none");
  $(".disp_th_three").addClass("tbl-cell");
  $(".elec_th_one").removeClass("tbl-cell");
  $(".elec_th_one").addClass("display-none");
  $(".elec_th_three").removeClass("display-none");
  $(".elec_th_three").addClass("tbl-cell");

  $(".page2_btn").removeClass("display-block");
  $(".page2_btn").addClass("display-none");

  $(".page3_btn").removeClass("display-none");
  $(".page3_btn").addClass("display-block"); //old//
  // if(current_time >= "02:00:00"){
  //   //alert(current_time+" ---- ");
  //   $(".page3_btn").removeClass("display-none");
  //   $(".page3_btn").addClass("display-block");
  // }else{
  //   $(".page3_btn").removeClass("display-block");
  //   $(".page3_btn").addClass("display-none");
  // }


  $(".prev1_btn").removeClass("display-block");
  $(".prev1_btn").addClass("display-none");
  $(".prev2_btn").removeClass("display-none");
  $(".prev2_btn").addClass("display-block");
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_two =0;
  $(".val_comp_2").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_two++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_three =0;
  $(".val_comp_3").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_three++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_two=0;
  $('.val_disp_1_2').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_two++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_three=0;
  $('.val_disp_1_3').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_three++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_two=0;
  $('.val_elec_2').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_two++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_three=0;
  $('.val_elec_3').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_three++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  addDPR();
  col_two(c_two,disp_two,elec_two,c_three,disp_three,elec_three,current_time);
  $(".page2_btn").removeClass("display-block");
  $(".page2_btn").addClass("display-none");
  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");
  //$(".prev2_btn").removeClass("display-none");
  //$(".prev2_btn").addClass("display-block");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
        if(c_two!=0 && disp_two!=0 && elec_two!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page3_btn").removeClass("display-block");
          $(".page3_btn").addClass("display-none");
          $(".prev3_btn").removeClass("display-block");
          $(".prev3_btn").addClass("display-none");
        }
        if(c_three!=0 || disp_three!=0 || elec_three!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page3_btn").removeClass("display-block");
          $(".page3_btn").addClass("display-none");
          $(".prev3_btn").removeClass("display-block");
          $(".prev3_btn").addClass("display-none");
        }
        if(c_two==0 && disp_two==0 && elec_two==0 && c_three!=0 && disp_three!=0 && elec_three!=0){
          $(".page3_btn").removeClass("display-block");
          $(".page3_btn").addClass("display-none");
          $(".prev3_btn").removeClass("display-block");
          $(".prev3_btn").addClass("display-none");
        }
    }

  // if(g1 >= g2){
  //   //alert("if(g1 >= g2)");
  //     if(c_two!=0 && disp_two!=0 && elec_two!=0){
  //       //alert("KEM CHO");
  //       $(".page1_btn").removeClass("display-block");
  //       $(".page1_btn").addClass("display-none");
  //       $(".page2_btn").removeClass("display-block");
  //       $(".page2_btn").addClass("display-none");
  //       $(".page3_btn").removeClass("display-block");
  //       $(".page3_btn").addClass("display-none");
  //     }
  //     if(c_two==0 && disp_two==0 && elec_two==0){
  //       if(current_time >= "03:00:00"){
  //         //alert("TIME >= 03:00:00");
  //         $(".page2_btn").removeClass("display-block");
  //         $(".page2_btn").addClass("display-none");
  //         $(".page3_btn").removeClass("display-none");
  //         $(".page3_btn").addClass("display-block");
  //       } 
  //     }
  // }

  //alert(g1+"-----------"+g2);
  // if(g1 >= g2){
  //   alert("if(g1 >= g2)");
  //     if(c_two!=0 && disp_two!=0 && elec_two!=0){
  //        alert("KEM CHO");
  //       $(".page1_btn").removeClass("display-block");
  //       $(".page1_btn").addClass("display-none");
  //       $(".page2_btn").removeClass("display-block");
  //       $(".page2_btn").addClass("display-none");
  //       $(".page3_btn").removeClass("display-block");
  //       $(".page3_btn").addClass("display-none");
  //     }
  //     if(c_two==0 && disp_two==0 && elec_two==0){
  //       if(current_time >= "03:00:00"){
  //         alert("TIME >= 03:00:00");
  //         $(".page2_btn").removeClass("display-block");
  //         $(".page2_btn").addClass("display-none");
  //         $(".page3_btn").removeClass("display-none");
  //         $(".page3_btn").addClass("display-block");
  //       } 
  //     }
  // }

}
function show_forthpg(){
  //alert("show_forthpg");
  $(".comp_th_two").removeClass("tbl-cell");
  $(".comp_th_two").addClass("display-none");
  $(".comp_th_four").removeClass("display-none");
  $(".comp_th_four").addClass("tbl-cell");
  $(".disp_th_two").removeClass("tbl-cell");
  $(".disp_th_two").addClass("display-none");
  $(".disp_th_four").removeClass("display-none");
  $(".disp_th_four").addClass("tbl-cell");
  $(".elec_th_two").removeClass("tbl-cell");
  $(".elec_th_two").addClass("display-none");
  $(".elec_th_four").removeClass("display-none");
  $(".elec_th_four").addClass("tbl-cell");
  $(".page3_btn").removeClass("display-block");
  $(".page3_btn").addClass("display-none");
  //$(".page4_btn").removeClass("display-none");
  //$(".page4_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "03:00:00"){
  //   $(".page4_btn").removeClass("display-none");
  //   $(".page4_btn").addClass("display-block");
  // }else{
  //   $(".page4_btn").removeClass("display-block");
  //   $(".page4_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_three =0;
  $(".val_comp_3").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_three++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_four =0;
  $(".val_comp_4").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_four++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_three=0;
  $('.val_disp_1_3').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_three++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_four=0;
  $('.val_disp_1_4').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_four++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_three=0;
  $('.val_elec_3').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_three++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_four=0;
  $('.val_elec_4').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_four++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  addDPR();
  col_three(c_three,disp_three,elec_three,c_four,disp_four,elec_four,current_time);
  $(".prev2_btn").removeClass("display-block");
  $(".prev2_btn").addClass("display-none");
  $(".prev3_btn").removeClass("display-none");
  $(".prev3_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");



  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  /*if(g1 >= g2){
    //alert("if(g1 >= g2)");
      if((c_three!=0 && disp_three!=0 && elec_three!=0) || (c_three==0 && disp_three==0 && elec_three==0)){
         alert("KEM CHO 4th"); 
        // $(".page1_btn").removeClass("display-block");
        // $(".page1_btn").addClass("display-none");
        // $(".page2_btn").removeClass("display-block");
        // $(".page2_btn").addClass("display-none");
        // $(".page3_btn").removeClass("display-block");
        // $(".page3_btn").addClass("display-none");

        $(".page4_btn").removeClass("display-block");
        $(".page4_btn").addClass("display-none");

      }
  }*/
  if(g1 >= g2){
      //alert("if(g1 >= g2)");
        if(c_three!=0 && disp_three!=0 && elec_three!=0){
          //alert("1");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page4_btn").removeClass("display-block");
          $(".page4_btn").addClass("display-none");
          $(".prev4_btn").removeClass("display-block");
          $(".prev4_btn").addClass("display-none");
        }
        if(c_four!=0 || disp_four!=0 || elec_four!=0){
          //alert("2");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page4_btn").removeClass("display-block");
          $(".page4_btn").addClass("display-none");
          $(".prev4_btn").removeClass("display-block");
          $(".prev4_btn").addClass("display-none");
        }
        if(c_three==0 && disp_three==0 && elec_three==0 && c_four!=0 && disp_four!=0 && elec_four!=0){
          //alert("3");
          $(".page4_btn").removeClass("display-block");
          $(".page4_btn").addClass("display-none");
          $(".prev4_btn").removeClass("display-block");
          $(".prev4_btn").addClass("display-none");
        }
    }
}
function show_fifthpg(){
  //alert("show_fifthpg");
  $(".comp_th_three").removeClass("tbl-cell");
  $(".comp_th_three").addClass("display-none");
  $(".comp_th_five").removeClass("display-none");
  $(".comp_th_five").addClass("tbl-cell");
  $(".disp_th_three").removeClass("tbl-cell");
  $(".disp_th_three").addClass("display-none");
  $(".disp_th_five").removeClass("display-none");
  $(".disp_th_five").addClass("tbl-cell");
  $(".elec_th_three").removeClass("tbl-cell");
  $(".elec_th_three").addClass("display-none");
  $(".elec_th_five").removeClass("display-none");
  $(".elec_th_five").addClass("tbl-cell");
  $(".page4_btn").removeClass("display-block");
  $(".page4_btn").addClass("display-none");
  //$(".page5_btn").removeClass("display-none");
  //$(".page5_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "04:00:00"){
  //   $(".page5_btn").removeClass("display-none");
  //   $(".page5_btn").addClass("display-block");
  // }else{
  //   $(".page5_btn").removeClass("display-block");
  //   $(".page5_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_four =0;
  $(".val_comp_4").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_four++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_five =0;
  $(".val_comp_5").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_five++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_four=0;
  $('.val_disp_1_4').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_four++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_five=0;
  $('.val_disp_1_5').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_five++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_four=0;
  $('.val_elec_4').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_four++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_five=0;
  $('.val_elec_5').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_five++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  addDPR();
  col_four(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time);
  $(".prev3_btn").removeClass("display-block");
  $(".prev3_btn").addClass("display-none");
  $(".prev4_btn").removeClass("display-none");
  $(".prev4_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
        if(c_four!=0 && disp_four!=0 && elec_four!=0){
          //alert("5-1");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page5_btn").removeClass("display-block");
          $(".page5_btn").addClass("display-none");
          $(".prev5_btn").removeClass("display-block");
          $(".prev5_btn").addClass("display-none");
        }
        if(c_five!=0 || disp_five!=0 || elec_five!=0){
          //alert("5-2");
          // $(".comp_th_four").removeClass("tbl-cell");
          // $(".comp_th_four").addClass("display-none");
          // $(".disp_th_four").removeClass("tbl-cell");
          // $(".disp_th_four").addClass("display-none");
          // $(".elec_th_four").removeClass("tbl-cell");
          // $(".elec_th_four").addClass("display-none");

          // $(".comp_th_six").removeClass("display-none");
          // $(".comp_th_six").addClass("tbl-cell");
          // $(".disp_th_six").removeClass("display-none");
          // $(".disp_th_six").addClass("tbl-cell");
          // $(".elec_th_six").removeClass("display-none");
          // $(".elec_th_six").addClass("tbl-cell");


          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page5_btn").removeClass("display-block");
          $(".page5_btn").addClass("display-none");
          $(".prev5_btn").removeClass("display-block");
          $(".prev5_btn").addClass("display-none");
        }
        if(c_four==0 && disp_four==0 && elec_four==0 && c_five!=0 && disp_five!=0 && elec_five!=0){
          //alert("5-3");
          $(".page5_btn").removeClass("display-block");
          $(".page5_btn").addClass("display-none");
          $(".prev5_btn").removeClass("display-block");
          $(".prev5_btn").addClass("display-none");
        }
    }

}
function show_sixthpg(){
  //alert("show_sixthpg");
  $(".comp_th_four").removeClass("tbl-cell");
  $(".comp_th_four").addClass("display-none");
  $(".comp_th_six").removeClass("display-none");
  $(".comp_th_six").addClass("tbl-cell");
  $(".disp_th_four").removeClass("tbl-cell");
  $(".disp_th_four").addClass("display-none");
  $(".disp_th_six").removeClass("display-none");
  $(".disp_th_six").addClass("tbl-cell");
  $(".elec_th_four").removeClass("tbl-cell");
  $(".elec_th_four").addClass("display-none");
  $(".elec_th_six").removeClass("display-none");
  $(".elec_th_six").addClass("tbl-cell");
  $(".page5_btn").removeClass("display-block");
  $(".page5_btn").addClass("display-none");
  //$(".page6_btn").removeClass("display-none");
  //$(".page6_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "05:00:00"){
  //   $(".page6_btn").removeClass("display-none");
  //   $(".page6_btn").addClass("display-block");
  // }else{
  //   $(".page6_btn").removeClass("display-block");
  //   $(".page6_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_five =0;
  $(".val_comp_5").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_five++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_six =0;
  $(".val_comp_6").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_six++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_five=0;
  $('.val_disp_1_5').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_five++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_six=0;
  $('.val_disp_1_6').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_six++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_five=0;
  $('.val_elec_5').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_five++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_six=0;
  $('.val_elec_6').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_six++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  addDPR();
  col_five(c_five,disp_five,elec_five,c_six,disp_six,elec_six,current_time);
  $(".prev4_btn").removeClass("display-block");
  $(".prev4_btn").addClass("display-none");
  $(".prev5_btn").removeClass("display-none");
  $(".prev5_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
        if(c_five!=0 && disp_five!=0 && elec_five!=0){
          //alert("6-1");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page6_btn").removeClass("display-block");
          $(".page6_btn").addClass("display-none");
          $(".prev6_btn").removeClass("display-block");
          $(".prev6_btn").addClass("display-none");
        }
        if(c_six!=0 || disp_six!=0 || elec_six!=0){
          //alert("6-2");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page6_btn").removeClass("display-block");
          $(".page6_btn").addClass("display-none");
          $(".prev6_btn").removeClass("display-block");
          $(".prev6_btn").addClass("display-none");
        }
        if(c_five==0 && disp_five==0 && elec_five==0 && c_six!=0 && disp_six!=0 && elec_six!=0){
          //alert("6-3");
          $(".page6_btn").removeClass("display-block");
          $(".page6_btn").addClass("display-none");
          $(".prev6_btn").removeClass("display-block");
          $(".prev6_btn").addClass("display-none");
        }
    }
}
function show_seventhpg(){
  //alert("show_seventhpg");
  $(".comp_th_five").removeClass("tbl-cell");
  $(".comp_th_five").addClass("display-none");
  $(".comp_th_seven").removeClass("display-none");
  $(".comp_th_seven").addClass("tbl-cell");
  $(".disp_th_five").removeClass("tbl-cell");
  $(".disp_th_five").addClass("display-none");
  $(".disp_th_seven").removeClass("display-none");
  $(".disp_th_seven").addClass("tbl-cell");
  $(".elec_th_five").removeClass("tbl-cell");
  $(".elec_th_five").addClass("display-none");
  $(".elec_th_seven").removeClass("display-none");
  $(".elec_th_seven").addClass("tbl-cell");
  $(".page6_btn").removeClass("display-block");
  $(".page6_btn").addClass("display-none");
  //$(".page7_btn").removeClass("display-none");
  //$(".page7_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "06:00:00"){
  //   $(".page7_btn").removeClass("display-none");
  //   $(".page7_btn").addClass("display-block");
  // }else{
  //   $(".page7_btn").removeClass("display-block");
  //   $(".page7_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_six =0;
  $(".val_comp_6").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_six++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_seven =0;
  $(".val_comp_7").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_seven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_six=0;
  $('.val_disp_1_6').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_six++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_seven=0;
  $('.val_disp_1_7').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_seven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_six=0;
  $('.val_elec_6').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_six++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_seven=0;
  $('.val_elec_7').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_seven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  addDPR();
  col_six(c_six,disp_six,elec_six,c_seven,disp_seven,elec_seven,current_time);
  $(".prev5_btn").removeClass("display-block");
  $(".prev5_btn").addClass("display-none");
  $(".prev6_btn").removeClass("display-none");
  $(".prev6_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
        if(c_six!=0 && disp_six!=0 && elec_six!=0){
          //alert("7-1");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page7_btn").removeClass("display-block");
          $(".page7_btn").addClass("display-none");
          $(".prev7_btn").removeClass("display-block");
          $(".prev7_btn").addClass("display-none");
        }
        if(c_seven!=0 || disp_seven!=0 || elec_seven!=0){
          //alert("7-2");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page7_btn").removeClass("display-block");
          $(".page7_btn").addClass("display-none");
          $(".prev7_btn").removeClass("display-block");
          $(".prev7_btn").addClass("display-none");
        }
        if(c_six==0 && disp_six==0 && elec_six==0 && c_seven!=0 && disp_seven!=0 && elec_seven!=0){
          //alert("7-3");
          $(".page7_btn").removeClass("display-block");
          $(".page7_btn").addClass("display-none");
          $(".prev7_btn").removeClass("display-block");
          $(".prev7_btn").addClass("display-none");
        }
    }
}
function show_eighthpg(){
  $(".comp_th_six").removeClass("tbl-cell");
  $(".comp_th_six").addClass("display-none");
  $(".comp_th_eight").removeClass("display-none");
  $(".comp_th_eight").addClass("tbl-cell");
  $(".disp_th_six").removeClass("tbl-cell");
  $(".disp_th_six").addClass("display-none");
  $(".disp_th_eight").removeClass("display-none");
  $(".disp_th_eight").addClass("tbl-cell");
  $(".elec_th_six").removeClass("tbl-cell");
  $(".elec_th_six").addClass("display-none");
  $(".elec_th_eight").removeClass("display-none");
  $(".elec_th_eight").addClass("tbl-cell");
  $(".page7_btn").removeClass("display-block");
  $(".page7_btn").addClass("display-none");
  //$(".page8_btn").removeClass("display-none");
  //$(".page8_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "07:00:00"){
  //   $(".page8_btn").removeClass("display-none");
  //   $(".page8_btn").addClass("display-block");
  // }else{
  //   $(".page8_btn").removeClass("display-block");
  //   $(".page8_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_seven =0;
  $(".val_comp_7").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_seven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_eight =0;
  $(".val_comp_8").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_eight++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_seven=0;
  $('.val_disp_1_7').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_seven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_eight=0;
  $('.val_disp_1_8').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_eight++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_seven=0;
  $('.val_elec_7').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_seven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_eight=0;
  $('.val_elec_8').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_eight++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  addDPR();
  col_seven(c_seven,disp_seven,elec_seven,c_eight,disp_eight,elec_eight,current_time);
  $(".prev6_btn").removeClass("display-block");
  $(".prev6_btn").addClass("display-none");
  $(".prev7_btn").removeClass("display-none");
  $(".prev7_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
        if(c_seven!=0 && disp_seven!=0 && elec_seven!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page8_btn").removeClass("display-block");
          $(".page8_btn").addClass("display-none");
          $(".prev8_btn").removeClass("display-block");
          $(".prev8_btn").addClass("display-none");
        }
        if(c_eight!=0 || disp_eight!=0 || elec_eight!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page8_btn").removeClass("display-block");
          $(".page8_btn").addClass("display-none");
          $(".prev8_btn").removeClass("display-block");
          $(".prev8_btn").addClass("display-none");
        }
        if(c_seven==0 && disp_seven==0 && elec_seven==0 && c_eight!=0 && disp_eight!=0 && elec_eight!=0){
          $(".page8_btn").removeClass("display-block");
          $(".page8_btn").addClass("display-none");
          $(".prev8_btn").removeClass("display-block");
          $(".prev8_btn").addClass("display-none");
        }
    }
}
function show_ninthpg(){
  $(".comp_th_seven").removeClass("tbl-cell");
  $(".comp_th_seven").addClass("display-none");
  $(".comp_th_nine").removeClass("display-none");
  $(".comp_th_nine").addClass("tbl-cell");
  $(".disp_th_seven").removeClass("tbl-cell");
  $(".disp_th_seven").addClass("display-none");
  $(".disp_th_nine").removeClass("display-none");
  $(".disp_th_nine").addClass("tbl-cell");
  $(".elec_th_seven").removeClass("tbl-cell");
  $(".elec_th_seven").addClass("display-none");
  $(".elec_th_nine").removeClass("display-none");
  $(".elec_th_nine").addClass("tbl-cell");
  $(".page8_btn").removeClass("display-block");
  $(".page8_btn").addClass("display-none");
  //$(".page9_btn").removeClass("display-none");
  //$(".page9_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "08:00:00"){
  //   $(".page9_btn").removeClass("display-none");
  //   $(".page9_btn").addClass("display-block");
  // }else{
  //   $(".page9_btn").removeClass("display-block");
  //   $(".page9_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_eight =0;
  $(".val_comp_8").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_eight++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_nine =0;
  $(".val_comp_9").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_nine++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_eight=0;
  $('.val_disp_1_8').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_eight++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_nine=0;
  $('.val_disp_1_9').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_nine++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_eight=0;
  $('.val_elec_8').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_eight++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_nine=0;
  $('.val_elec_9').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_nine++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  addDPR();
  col_eight(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
  $(".prev7_btn").removeClass("display-block");
  $(".prev7_btn").addClass("display-none");
  $(".prev8_btn").removeClass("display-none");
  $(".prev8_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
        if(c_eight!=0 && disp_eight!=0 && elec_eight!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page9_btn").removeClass("display-block");
          $(".page9_btn").addClass("display-none");
          $(".prev9_btn").removeClass("display-block");
          $(".prev9_btn").addClass("display-none");
        }
        if(c_nine!=0 || disp_nine!=0 || elec_nine!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page9_btn").removeClass("display-block");
          $(".page9_btn").addClass("display-none");
          $(".prev9_btn").removeClass("display-block");
          $(".prev9_btn").addClass("display-none");
        }
        if(c_eight==0 && disp_eight==0 && elec_eight==0 && c_nine!=0 && disp_nine!=0 && elec_nine!=0){
          $(".page9_btn").removeClass("display-block");
          $(".page9_btn").addClass("display-none");
          $(".prev9_btn").removeClass("display-block");
          $(".prev9_btn").addClass("display-none");
        }
    }
}
function show_tenthpg(){
  $(".comp_th_eight").removeClass("tbl-cell");
  $(".comp_th_eight").addClass("display-none");
  $(".comp_th_ten").removeClass("display-none");
  $(".comp_th_ten").addClass("tbl-cell");
  $(".disp_th_eight").removeClass("tbl-cell");
  $(".disp_th_eight").addClass("display-none");
  $(".disp_th_ten").removeClass("display-none");
  $(".disp_th_ten").addClass("tbl-cell");
  $(".elec_th_eight").removeClass("tbl-cell");
  $(".elec_th_eight").addClass("display-none");
  $(".elec_th_ten").removeClass("display-none");
  $(".elec_th_ten").addClass("tbl-cell");
  $(".page9_btn").removeClass("display-block");
  $(".page9_btn").addClass("display-none");
  //$(".page10_btn").removeClass("display-none");
  //$(".page10_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "09:00:00"){
  //   $(".page10_btn").removeClass("display-none");
  //   $(".page10_btn").addClass("display-block");
  // }else{
  //   $(".page10_btn").removeClass("display-block");
  //   $(".page10_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_nine =0;
  $(".val_comp_9").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_nine++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_ten =0;
  $(".val_comp_10").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_ten++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_nine=0;
  $('.val_disp_1_9').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_nine++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_ten=0;
  $('.val_disp_1_10').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_ten++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_nine=0;
  $('.val_elec_9').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_nine++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_ten=0;
  $('.val_elec_10').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_ten++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  addDPR();
  col_nine(c_nine,disp_nine,elec_nine,c_ten,disp_ten,elec_ten,current_time);
  $(".prev8_btn").removeClass("display-block");
  $(".prev8_btn").addClass("display-none");
  $(".prev9_btn").removeClass("display-none");
  $(".prev9_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
        if(c_nine!=0 && disp_nine!=0 && elec_nine!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page10_btn").removeClass("display-block");
          $(".page10_btn").addClass("display-none");
          $(".prev10_btn").removeClass("display-block");
          $(".prev10_btn").addClass("display-none");
        }
        if(c_ten!=0 || disp_ten!=0 || elec_ten!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page10_btn").removeClass("display-block");
          $(".page10_btn").addClass("display-none");
          $(".prev10_btn").removeClass("display-block");
          $(".prev10_btn").addClass("display-none");
        }
        if(c_nine==0 && disp_nine==0 && elec_nine==0 && c_ten!=0 && disp_ten!=0 && elec_ten!=0){
          $(".page10_btn").removeClass("display-block");
          $(".page10_btn").addClass("display-none");
          $(".prev10_btn").removeClass("display-block");
          $(".prev10_btn").addClass("display-none");
        }
    }
}
function show_eleventhpg(){
  $(".comp_th_nine").removeClass("tbl-cell");
  $(".comp_th_nine").addClass("display-none");
  $(".comp_th_eleven").removeClass("display-none");
  $(".comp_th_eleven").addClass("tbl-cell");
  $(".disp_th_nine").removeClass("tbl-cell");
  $(".disp_th_nine").addClass("display-none");
  $(".disp_th_eleven").removeClass("display-none");
  $(".disp_th_eleven").addClass("tbl-cell");
  $(".elec_th_nine").removeClass("tbl-cell");
  $(".elec_th_nine").addClass("display-none");
  $(".elec_th_eleven").removeClass("display-none");
  $(".elec_th_eleven").addClass("tbl-cell");
  $(".page10_btn").removeClass("display-block");
  $(".page10_btn").addClass("display-none");
  //$(".page11_btn").removeClass("display-none");
  //$(".page11_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "10:00:00"){
  //   $(".page11_btn").removeClass("display-none");
  //   $(".page11_btn").addClass("display-block");
  // }else{
  //   $(".page11_btn").removeClass("display-block");
  //   $(".page11_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_ten =0;
  $(".val_comp_10").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_ten++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_eleven =0;
  $(".val_comp_11").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_eleven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_ten=0;
  $('.val_disp_1_10').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_ten++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_eleven=0;
  $('.val_disp_1_11').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_eleven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_ten=0;
  $('.val_elec_10').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_ten++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_eleven=0;
  $('.val_elec_11').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_eleven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  addDPR();
  col_ten(c_ten,disp_ten,elec_ten,c_eleven,disp_eleven,elec_eleven,current_time);
  $(".prev9_btn").removeClass("display-block");
  $(".prev9_btn").addClass("display-none");
  $(".prev10_btn").removeClass("display-none");
  $(".prev10_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
        if(c_ten!=0 && disp_ten!=0 && elec_ten!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page11_btn").removeClass("display-block");
          $(".page11_btn").addClass("display-none");
          $(".prev11_btn").removeClass("display-block");
          $(".prev11_btn").addClass("display-none");
        }
        if(c_eleven!=0 || disp_eleven!=0 || elec_eleven!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page11_btn").removeClass("display-block");
          $(".page11_btn").addClass("display-none");
          $(".prev11_btn").removeClass("display-block");
          $(".prev11_btn").addClass("display-none");
        }
        if(c_ten==0 && disp_ten==0 && elec_ten==0 && c_eleven!=0 && disp_eleven!=0 && elec_eleven!=0){
          $(".page11_btn").removeClass("display-block");
          $(".page11_btn").addClass("display-none");
          $(".prev11_btn").removeClass("display-block");
          $(".prev11_btn").addClass("display-none");
        }
    }
}
function show_twelthpg(){
  $(".comp_th_ten").removeClass("tbl-cell");
  $(".comp_th_ten").addClass("display-none");
  $(".comp_th_twelve").removeClass("display-none");
  $(".comp_th_twelve").addClass("tbl-cell");
  $(".disp_th_ten").removeClass("tbl-cell");
  $(".disp_th_ten").addClass("display-none");
  $(".disp_th_twelve").removeClass("display-none");
  $(".disp_th_twelve").addClass("tbl-cell");
  $(".elec_th_ten").removeClass("tbl-cell");
  $(".elec_th_ten").addClass("display-none");
  $(".elec_th_twelve").removeClass("display-none");
  $(".elec_th_twelve").addClass("tbl-cell");
  $(".page11_btn").removeClass("display-block");
  $(".page11_btn").addClass("display-none");
  //$(".page12_btn").removeClass("display-none");
  //$(".page12_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "11:00:00"){
  //   $(".page12_btn").removeClass("display-none");
  //   $(".page12_btn").addClass("display-block");
  // }else{
  //   $(".page12_btn").removeClass("display-block");
  //   $(".page12_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_eleven =0;
  $(".val_comp_11").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_eleven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_twelve =0;
  $(".val_comp_12").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_twelve++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_eleven=0;
  $('.val_disp_1_11').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_eleven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_twelve=0;
  $('.val_disp_1_12').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_twelve++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_eleven=0;
  $('.val_elec_11').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_eleven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_twelve=0;
  $('.val_elec_12').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_twelve++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  addDPR();
  col_eleven(c_eleven,disp_eleven,elec_eleven,c_twelve,disp_twelve,elec_twelve,current_time);
  $(".prev10_btn").removeClass("display-block");
  $(".prev10_btn").addClass("display-none");
  $(".prev11_btn").removeClass("display-none");
  $(".prev11_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
        if(c_eleven!=0 && disp_eleven!=0 && elec_eleven!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page12_btn").removeClass("display-block");
          $(".page12_btn").addClass("display-none");
          $(".prev12_btn").removeClass("display-block");
          $(".prev12_btn").addClass("display-none");
        }
        if(c_twelve!=0 || disp_twelve!=0 || elec_twelve!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page12_btn").removeClass("display-block");
          $(".page12_btn").addClass("display-none");
          $(".prev12_btn").removeClass("display-block");
          $(".prev12_btn").addClass("display-none");
        }
        if(c_eleven==0 && disp_eleven==0 && elec_eleven==0 && c_twelve!=0 && disp_twelve!=0 && elec_twelve!=0){
          $(".page12_btn").removeClass("display-block");
          $(".page12_btn").addClass("display-none");
          $(".prev12_btn").removeClass("display-block");
          $(".prev12_btn").addClass("display-none");
        }
    }
}
function show_thirteenthpg(){
  $(".comp_th_eleven").removeClass("tbl-cell");
  $(".comp_th_eleven").addClass("display-none");
  $(".comp_th_thirteen").removeClass("display-none");
  $(".comp_th_thirteen").addClass("tbl-cell");
  $(".disp_th_eleven").removeClass("tbl-cell");
  $(".disp_th_eleven").addClass("display-none");
  $(".disp_th_thirteen").removeClass("display-none");
  $(".disp_th_thirteen").addClass("tbl-cell");
  $(".elec_th_eleven").removeClass("tbl-cell");
  $(".elec_th_eleven").addClass("display-none");
  $(".elec_th_thirteen").removeClass("display-none");
  $(".elec_th_thirteen").addClass("tbl-cell");
  $(".page12_btn").removeClass("display-block");
  $(".page12_btn").addClass("display-none");
  //$(".page13_btn").removeClass("display-none");
  //$(".page13_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "12:00:00"){
  //   $(".page13_btn").removeClass("display-none");
  //   $(".page13_btn").addClass("display-block");
  // }else{
  //   $(".page13_btn").removeClass("display-block");
  //   $(".page13_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_twelve =0;
  $(".val_comp_12").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_twelve++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_thirteen =0;
  $(".val_comp_13").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_thirteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_twelve=0;
  $('.val_disp_1_12').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_twelve++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_thirteen=0;
  $('.val_disp_1_13').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_thirteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_twelve=0;
  $('.val_elec_12').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_twelve++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_thirteen=0;
  $('.val_elec_13').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_thirteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  addDPR();
  col_twelve(c_twelve,disp_twelve,elec_twelve,c_thirteen,disp_thirteen,elec_thirteen,current_time);
  $(".prev11_btn").removeClass("display-block");
  $(".prev11_btn").addClass("display-none");
  $(".prev12_btn").removeClass("display-none");
  $(".prev12_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
        if(c_twelve!=0 && disp_twelve!=0 && elec_twelve!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page13_btn").removeClass("display-block");
          $(".page13_btn").addClass("display-none");
          $(".prev13_btn").removeClass("display-block");
          $(".prev13_btn").addClass("display-none");
        }
        if(c_thirteen!=0 || disp_thirteen!=0 || elec_thirteen!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page13_btn").removeClass("display-block");
          $(".page13_btn").addClass("display-none");
          $(".prev13_btn").removeClass("display-block");
          $(".prev13_btn").addClass("display-none");
        }
        if(c_twelve==0 && disp_twelve==0 && elec_twelve==0 && c_thirteen!=0 && disp_thirteen!=0 && elec_thirteen!=0){
          $(".page13_btn").removeClass("display-block");
          $(".page13_btn").addClass("display-none");
          $(".prev13_btn").removeClass("display-block");
          $(".prev13_btn").addClass("display-none");
        }
    }
}
function show_forteenthpg(){
  $(".comp_th_twelve").removeClass("tbl-cell");
  $(".comp_th_twelve").addClass("display-none");
  $(".comp_th_fourteen").removeClass("display-none");
  $(".comp_th_fourteen").addClass("tbl-cell");
  $(".disp_th_twelve").removeClass("tbl-cell");
  $(".disp_th_twelve").addClass("display-none");
  $(".disp_th_fourteen").removeClass("display-none");
  $(".disp_th_fourteen").addClass("tbl-cell");
  $(".elec_th_twelve").removeClass("tbl-cell");
  $(".elec_th_twelve").addClass("display-none");
  $(".elec_th_fourteen").removeClass("display-none");
  $(".elec_th_fourteen").addClass("tbl-cell");
  $(".page13_btn").removeClass("display-block");
  $(".page13_btn").addClass("display-none");
  //$(".page14_btn").removeClass("display-none");
  //$(".page14_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "13:00:00"){
  //   $(".page14_btn").removeClass("display-none");
  //   $(".page14_btn").addClass("display-block");
  // }else{
  //   $(".page14_btn").removeClass("display-block");
  //   $(".page14_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_thirteen =0;
  $(".val_comp_13").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_thirteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_fourteen =0;
  $(".val_comp_14").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_fourteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_thirteen=0;
  $('.val_disp_1_13').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_thirteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_fourteen=0;
  $('.val_disp_1_14').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_fourteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_thirteen=0;
  $('.val_elec_13').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_thirteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_fourteen=0;
  $('.val_elec_14').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_fourteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  addDPR();
  col_thirteen(c_thirteen,disp_thirteen,elec_thirteen,c_fourteen,disp_fourteen,elec_fourteen,current_time);
  $(".prev12_btn").removeClass("display-block");
  $(".prev12_btn").addClass("display-none");
  $(".prev13_btn").removeClass("display-none");
  $(".prev13_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
        if(c_thirteen!=0 && disp_thirteen!=0 && elec_thirteen!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page14_btn").removeClass("display-block");
          $(".page14_btn").addClass("display-none");
          $(".prev14_btn").removeClass("display-block");
          $(".prev14_btn").addClass("display-none");
        }
        if(c_fourteen!=0 || disp_fourteen!=0 || elec_fourteen!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page14_btn").removeClass("display-block");
          $(".page14_btn").addClass("display-none");
          $(".prev14_btn").removeClass("display-block");
          $(".prev14_btn").addClass("display-none");
        }
        if(c_thirteen==0 && disp_thirteen==0 && elec_thirteen==0 && c_fourteen!=0 && disp_fourteen!=0 && elec_fourteen!=0){
          $(".page14_btn").removeClass("display-block");
          $(".page14_btn").addClass("display-none");
          $(".prev14_btn").removeClass("display-block");
          $(".prev14_btn").addClass("display-none");
        }
    }

  /*if((c_thirteen==0 && c_fourteen==0) && (disp_thirteen==0 && disp_fourteen==0) && (elec_thirteen==0 && elec_fourteen==0)){
    if(current_time >= "13:00:00"){
      if(today_dt >= hidd_dprdt){ 
        $(".page14_btn").removeClass("display-none");
        $(".page14_btn").addClass("display-block");
      }
     }
  }*/
}
function show_fifteenthpg(){
  $(".comp_th_thirteen").removeClass("tbl-cell");
  $(".comp_th_thirteen").addClass("display-none");
  $(".comp_th_fifteen").removeClass("display-none");
  $(".comp_th_fifteen").addClass("tbl-cell");
  $(".disp_th_thirteen").removeClass("tbl-cell");
  $(".disp_th_thirteen").addClass("display-none");
  $(".disp_th_fifteen").removeClass("display-none");
  $(".disp_th_fifteen").addClass("tbl-cell");
  $(".elec_th_thirteen").removeClass("tbl-cell");
  $(".elec_th_thirteen").addClass("display-none");
  $(".elec_th_fifteen").removeClass("display-none");
  $(".elec_th_fifteen").addClass("tbl-cell");
  $(".page14_btn").removeClass("display-block");
  $(".page14_btn").addClass("display-none");
  //$(".page15_btn").removeClass("display-none");
  //$(".page15_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "14:00:00"){
  //   $(".page15_btn").removeClass("display-none");
  //   $(".page15_btn").addClass("display-block");
  // }else{
  //   $(".page15_btn").removeClass("display-block");
  //   $(".page15_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_fourteen =0;
  $(".val_comp_14").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_fourteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_fifteen =0;
  $(".val_comp_15").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_fifteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_fourteen=0;
  $('.val_disp_1_14').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_fourteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_fifteen=0;
  $('.val_disp_1_15').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_fifteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_fourteen=0;
  $('.val_elec_14').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_fourteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_fifteen=0;
  $('.val_elec_15').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_fifteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  addDPR();
  col_fourteen(c_fourteen,disp_fourteen,elec_fourteen,c_fifteen,disp_fifteen,elec_fifteen,current_time);
  $(".prev13_btn").removeClass("display-block");
  $(".prev13_btn").addClass("display-none");
  $(".prev14_btn").removeClass("display-none");
  $(".prev14_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
        if(c_fourteen!=0 && disp_fourteen!=0 && elec_fourteen!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page15_btn").removeClass("display-block");
          $(".page15_btn").addClass("display-none");
          $(".prev15_btn").removeClass("display-block");
          $(".prev15_btn").addClass("display-none");
        }
        if(c_fifteen!=0 || disp_fifteen!=0 || elec_fifteen!=0){
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".page15_btn").removeClass("display-block");
          $(".page15_btn").addClass("display-none");
          $(".prev15_btn").removeClass("display-block");
          $(".prev15_btn").addClass("display-none");
        }
        if(c_fourteen==0 && disp_fourteen==0 && elec_fourteen==0 && c_fifteen!=0 && disp_fifteen!=0 && elec_fifteen!=0){
          $(".page15_btn").removeClass("display-block");
          $(".page15_btn").addClass("display-none");
          $(".prev15_btn").removeClass("display-block");
          $(".prev15_btn").addClass("display-none");
        }
    }

  /*var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +
    ((''+month).length<2 ? '0' : '') + month + '-' +
    d.getFullYear();

  if((c_fourteen==0 && c_fifteen==0) && (disp_fourteen==0 && disp_fifteen==0) && (elec_fourteen==0 && elec_fifteen==0)){
    if(current_time >= "14:00:00"){
      if(today_dt > hidd_dprdt){
        $(".page15_btn").removeClass("display-none");
        $(".page15_btn").addClass("display-block");
      }
    }
  }*/
}
function show_sixteenthpg(){
  $(".comp_th_fourteen").removeClass("tbl-cell");
  $(".comp_th_fourteen").addClass("display-none");
  $(".comp_th_sixteen").removeClass("display-none");
  $(".comp_th_sixteen").addClass("tbl-cell");
  $(".disp_th_fourteen").removeClass("tbl-cell");
  $(".disp_th_fourteen").addClass("display-none");
  $(".disp_th_sixteen").removeClass("display-none");
  $(".disp_th_sixteen").addClass("tbl-cell");
  $(".elec_th_fourteen").removeClass("tbl-cell");
  $(".elec_th_fourteen").addClass("display-none");
  $(".elec_th_sixteen").removeClass("display-none");
  $(".elec_th_sixteen").addClass("tbl-cell");
  $(".page15_btn").removeClass("display-block");
  $(".page15_btn").addClass("display-none");
  //$(".page16_btn").removeClass("display-none");
  //$(".page16_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "15:00:00"){
  //   $(".page16_btn").removeClass("display-none");
  //   $(".page16_btn").addClass("display-block");
  // }else{
  //   $(".page16_btn").removeClass("display-block");
  //   $(".page16_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_fifteen =0;
  $(".val_comp_15").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_fifteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_sixteen =0;
  $(".val_comp_16").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_sixteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_fifteen=0;
  $('.val_disp_1_15').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_fifteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_sixteen=0;
  $('.val_disp_1_16').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_sixteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_fifteen=0;
  $('.val_elec_15').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_fifteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_sixteen=0;
  $('.val_elec_16').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_sixteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }        
  });
  addDPR();
  col_fifteen(c_fifteen,disp_fifteen,elec_fifteen,c_sixteen,disp_sixteen,elec_sixteen,current_time);
  $(".prev14_btn").removeClass("display-block");
  $(".prev14_btn").addClass("display-none");
  $(".prev15_btn").removeClass("display-none");
  $(".prev15_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
    if(c_fifteen!=0 && disp_fifteen!=0 && elec_fifteen!=0){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page16_btn").removeClass("display-block");
      $(".page16_btn").addClass("display-none");
      $(".prev16_btn").removeClass("display-block");
      $(".prev16_btn").addClass("display-none");
    }
    if(c_sixteen!=0 || disp_sixteen!=0 || elec_sixteen!=0){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page16_btn").removeClass("display-block");
      $(".page16_btn").addClass("display-none");
      $(".prev16_btn").removeClass("display-block");
      $(".prev16_btn").addClass("display-none");
    }
    if(c_fifteen==0 && disp_fifteen==0 && elec_fifteen==0 && c_sixteen!=0 && disp_sixteen!=0 && elec_sixteen!=0){
      $(".page16_btn").removeClass("display-block");
      $(".page16_btn").addClass("display-none");
      $(".prev16_btn").removeClass("display-block");
      $(".prev16_btn").addClass("display-none");
    }
  }
}
function show_seventeenthpg(){
  $(".comp_th_fifteen").removeClass("tbl-cell");
  $(".comp_th_fifteen").addClass("display-none");
  $(".comp_th_seventeen").removeClass("display-none");
  $(".comp_th_seventeen").addClass("tbl-cell");
  $(".disp_th_fifteen").removeClass("tbl-cell");
  $(".disp_th_fifteen").addClass("display-none");
  $(".disp_th_seventeen").removeClass("display-none");
  $(".disp_th_seventeen").addClass("tbl-cell");
  $(".elec_th_fifteen").removeClass("tbl-cell");
  $(".elec_th_fifteen").addClass("display-none");
  $(".elec_th_seventeen").removeClass("display-none");
  $(".elec_th_seventeen").addClass("tbl-cell");
  $(".page16_btn").removeClass("display-block");
  $(".page16_btn").addClass("display-none");
  //$(".page17_btn").removeClass("display-none");
  //$(".page17_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "16:00:00"){
  //   $(".page17_btn").removeClass("display-none");
  //   $(".page17_btn").addClass("display-block");
  // }else{
  //   $(".page17_btn").removeClass("display-block");
  //   $(".page17_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_sixteen =0;
  $(".val_comp_16").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_sixteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_seventeen =0;
  $(".val_comp_17").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_seventeen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_sixteen=0;
  $('.val_disp_1_16').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_sixteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_seventeen=0;
  $('.val_disp_1_17').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_seventeen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_sixteen=0;
  $('.val_elec_16').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_sixteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }        
  });
  var elec_seventeen=0;
  $('.val_elec_17').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_seventeen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }        
  });
  addDPR();
  col_sixteen(c_sixteen,disp_sixteen,elec_sixteen,c_seventeen,disp_seventeen,elec_seventeen,current_time);
  $(".prev15_btn").removeClass("display-block");
  $(".prev15_btn").addClass("display-none");
  $(".prev16_btn").removeClass("display-none");
  $(".prev16_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
    if(c_sixteen!=0 && disp_sixteen!=0 && elec_sixteen!=0){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page17_btn").removeClass("display-block");
      $(".page17_btn").addClass("display-none");
      $(".prev17_btn").removeClass("display-block");
      $(".prev17_btn").addClass("display-none");
    }
    if(c_seventeen!=0 || disp_seventeen!=0 || elec_seventeen!=0){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page17_btn").removeClass("display-block");
      $(".page17_btn").addClass("display-none");
      $(".prev17_btn").removeClass("display-block");
      $(".prev17_btn").addClass("display-none");
    }
    if(c_sixteen==0 && disp_sixteen==0 && elec_sixteen==0 && c_seventeen!=0 && disp_seventeen!=0 && elec_seventeen!=0){
      $(".page17_btn").removeClass("display-block");
      $(".page17_btn").addClass("display-none");
      $(".prev17_btn").removeClass("display-block");
      $(".prev17_btn").addClass("display-none");
    }
  }
}
function show_eighteenthpg(){
  $(".comp_th_sixteen").removeClass("tbl-cell");
  $(".comp_th_sixteen").addClass("display-none");
  $(".comp_th_eighteen").removeClass("display-none");
  $(".comp_th_eighteen").addClass("tbl-cell");
  $(".disp_th_sixteen").removeClass("tbl-cell");
  $(".disp_th_sixteen").addClass("display-none");
  $(".disp_th_eighteen").removeClass("display-none");
  $(".disp_th_eighteen").addClass("tbl-cell");
  $(".elec_th_sixteen").removeClass("tbl-cell");
  $(".elec_th_sixteen").addClass("display-none");
  $(".elec_th_eighteen").removeClass("display-none");
  $(".elec_th_eighteen").addClass("tbl-cell");
  $(".page17_btn").removeClass("display-block");
  $(".page17_btn").addClass("display-none");
  //$(".page18_btn").removeClass("display-none");
  //$(".page18_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "17:00:00"){
  //   $(".page18_btn").removeClass("display-none");
  //   $(".page18_btn").addClass("display-block");
  // }else{
  //   $(".page18_btn").removeClass("display-block");
  //   $(".page18_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_seventeen =0;
  $(".val_comp_17").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_seventeen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_eighteen =0;
  $(".val_comp_18").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_eighteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_seventeen=0;
  $('.val_disp_1_17').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_seventeen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_eightteen=0;
  $('.val_disp_1_18').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_eightteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_seventeen=0;
  $('.val_elec_17').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_seventeen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }        
  });
  var elec_eighteen=0;
  $('.val_elec_18').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_eighteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }        
  });
  addDPR();
  col_seventeen(c_seventeen,disp_seventeen,elec_seventeen,c_eighteen,disp_eightteen,elec_eighteen,current_time);
  $(".prev16_btn").removeClass("display-block");
  $(".prev16_btn").addClass("display-none");
  $(".prev17_btn").removeClass("display-none");
  $(".prev17_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
    if(c_seventeen!=0 && disp_seventeen!=0 && elec_seventeen!=0){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page18_btn").removeClass("display-block");
      $(".page18_btn").addClass("display-none");
      $(".prev18_btn").removeClass("display-block");
      $(".prev18_btn").addClass("display-none");
    }
    if(c_eighteen!=0 || disp_eightteen!=0 || elec_eighteen!=0){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page18_btn").removeClass("display-block");
      $(".page18_btn").addClass("display-none");
      $(".prev18_btn").removeClass("display-block");
      $(".prev18_btn").addClass("display-none");
    }
    if(c_seventeen==0 && disp_seventeen==0 && elec_seventeen==0 && c_eighteen!=0 && disp_eightteen!=0 && elec_eighteen!=0){
      $(".page18_btn").removeClass("display-block");
      $(".page18_btn").addClass("display-none");
      $(".prev18_btn").removeClass("display-block");
      $(".prev18_btn").addClass("display-none");
    }
  }
}
function show_nineteenthpg(){
  $(".comp_th_seventeen").removeClass("tbl-cell");
  $(".comp_th_seventeen").addClass("display-none");
  $(".comp_th_nineteen").removeClass("display-none");
  $(".comp_th_nineteen").addClass("tbl-cell");
  $(".disp_th_seventeen").removeClass("tbl-cell");
  $(".disp_th_seventeen").addClass("display-none");
  $(".disp_th_nineteen").removeClass("display-none");
  $(".disp_th_nineteen").addClass("tbl-cell");
  $(".elec_th_seventeen").removeClass("tbl-cell");
  $(".elec_th_seventeen").addClass("display-none");
  $(".elec_th_nineteen").removeClass("display-none");
  $(".elec_th_nineteen").addClass("tbl-cell");
  $(".page18_btn").removeClass("display-block");
  $(".page18_btn").addClass("display-none");
  //$(".page19_btn").removeClass("display-none");
  //$(".page19_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "18:00:00"){
  //   $(".page19_btn").removeClass("display-none");
  //   $(".page19_btn").addClass("display-block");
  // }else{
  //   $(".page19_btn").removeClass("display-block");
  //   $(".page19_btn").addClass("display-none");
  // }  
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_eighteen =0;
  $(".val_comp_18").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_eighteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_nineteen =0;
  $(".val_comp_19").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_nineteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_eightteen=0;
  $('.val_disp_1_18').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_eightteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_nineteen=0;
  $('.val_disp_1_19').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_nineteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_eighteen=0;
  $('.val_elec_18').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_eighteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }        
  });
  var elec_nineteen=0;
  $('.val_elec_19').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_nineteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }        
  });
  addDPR();
  col_eightteen(c_eighteen,disp_eightteen,elec_eighteen,c_nineteen,disp_nineteen,elec_nineteen,current_time);
  $(".prev17_btn").removeClass("display-block");
  $(".prev17_btn").addClass("display-none");
  $(".prev18_btn").removeClass("display-none");
  $(".prev18_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
    if(c_eighteen!=0 && disp_eightteen!=0 && elec_eighteen!=0){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page19_btn").removeClass("display-block");
      $(".page19_btn").addClass("display-none");
      $(".prev19_btn").removeClass("display-block");
      $(".prev19_btn").addClass("display-none");
    }
    if(c_nineteen!=0 || disp_nineteen!=0 || elec_nineteen!=0){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page19_btn").removeClass("display-block");
      $(".page19_btn").addClass("display-none");
      $(".prev19_btn").removeClass("display-block");
      $(".prev19_btn").addClass("display-none");
    }
    if(c_eighteen==0 && disp_eightteen==0 && elec_eighteen==0 && c_nineteen!=0 && disp_nineteen!=0 && elec_nineteen!=0){
      $(".page19_btn").removeClass("display-block");
      $(".page19_btn").addClass("display-none");
      $(".prev19_btn").removeClass("display-block");
      $(".prev19_btn").addClass("display-none");
    }
  }
}
function show_twenteenthpg(){
  $(".comp_th_eighteen").removeClass("tbl-cell");
  $(".comp_th_eighteen").addClass("display-none");
  $(".comp_th_twenty").removeClass("display-none");
  $(".comp_th_twenty").addClass("tbl-cell");
  $(".disp_th_eighteen").removeClass("tbl-cell");
  $(".disp_th_eighteen").addClass("display-none");
  $(".disp_th_twenty").removeClass("display-none");
  $(".disp_th_twenty").addClass("tbl-cell");
  $(".elec_th_eighteen").removeClass("tbl-cell");
  $(".elec_th_eighteen").addClass("display-none");
  $(".elec_th_twenty").removeClass("display-none");
  $(".elec_th_twenty").addClass("tbl-cell");
  $(".page19_btn").removeClass("display-block");
  $(".page19_btn").addClass("display-none");
  //$(".page20_btn").removeClass("display-none");
  //$(".page20_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "19:00:00"){
  //   $(".page20_btn").removeClass("display-none");
  //   $(".page20_btn").addClass("display-block");
  // }else{
  //   $(".page20_btn").removeClass("display-block");
  //   $(".page20_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_nineteen =0;
  $(".val_comp_19").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_nineteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_twenty =0;
  $(".val_comp_20").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_twenty++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_nineteen=0;
  $('.val_disp_1_19').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_nineteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_twenty=0;
  $('.val_disp_1_20').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_twenty++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_nineteen=0;
  $('.val_elec_19').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_nineteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }        
  });
  var elec_twenty=0;
  $('.val_elec_20').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_twenty++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }        
  });
  addDPR();
  col_nineteen(c_nineteen,disp_nineteen,elec_nineteen,c_twenty,disp_twenty,elec_twenty,current_time);
  $(".prev18_btn").removeClass("display-block");
  $(".prev18_btn").addClass("display-none");
  $(".prev19_btn").removeClass("display-none");
  $(".prev19_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
    if(c_nineteen!=0 && disp_nineteen!=0 && elec_nineteen!=0){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page20_btn").removeClass("display-block");
      $(".page20_btn").addClass("display-none");
      $(".prev20_btn").removeClass("display-block");
      $(".prev20_btn").addClass("display-none");
    }
    if(c_twenty!=0 || disp_twenty!=0 || elec_twenty!=0){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page20_btn").removeClass("display-block");
      $(".page20_btn").addClass("display-none");
      $(".prev20_btn").removeClass("display-block");
      $(".prev20_btn").addClass("display-none");
    }
    if(c_nineteen==0 && disp_nineteen==0 && elec_nineteen==0 && c_twenty!=0 && disp_twenty!=0 && elec_twenty!=0){
      $(".page20_btn").removeClass("display-block");
      $(".page20_btn").addClass("display-none");
      $(".prev20_btn").removeClass("display-block");
      $(".prev20_btn").addClass("display-none");
    }
  }
}
function show_twentyonepg(){
  $(".comp_th_nineteen").removeClass("tbl-cell");
  $(".comp_th_nineteen").addClass("display-none");
  $(".comp_th_twentyone").removeClass("display-none");
  $(".comp_th_twentyone").addClass("tbl-cell");
  $(".disp_th_nineteen").removeClass("tbl-cell");
  $(".disp_th_nineteen").addClass("display-none");
  $(".disp_th_twentyone").removeClass("display-none");
  $(".disp_th_twentyone").addClass("tbl-cell");
  $(".elec_th_nineteen").removeClass("tbl-cell");
  $(".elec_th_nineteen").addClass("display-none");
  $(".elec_th_twentyone").removeClass("display-none");
  $(".elec_th_twentyone").addClass("tbl-cell");
  $(".page20_btn").removeClass("display-block");
  $(".page20_btn").addClass("display-none");
  //$(".page21_btn").removeClass("display-none");
  //$(".page21_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  // if(current_time >= "20:00:00"){
  //   $(".page21_btn").removeClass("display-none");
  //   $(".page21_btn").addClass("display-block");
  // }else{
  //   $(".page21_btn").removeClass("display-block");
  //   $(".page21_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_twenty =0;
  $(".val_comp_20").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_twenty++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_twentyone =0;
  $(".val_comp_21").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_twentyone++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_twenty=0;
  $('.val_disp_1_20').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_twenty++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_twentyone=0;
  $('.val_disp_1_21').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_twentyone++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_twenty=0;
  $('.val_elec_20').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_twenty++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }        
  });
  var elec_twentyone=0;
  $('.val_elec_21').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_twentyone++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }        
  });
  addDPR();
  col_twenty(c_twenty,disp_twenty,elec_twenty,c_twentyone,disp_twentyone,elec_twentyone,current_time);
  $(".prev19_btn").removeClass("display-block");
  $(".prev19_btn").addClass("display-none");
  $(".prev20_btn").removeClass("display-none");
  $(".prev20_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
    if(c_twenty!=0 && disp_twenty!=0 && elec_twenty!=0){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page21_btn").removeClass("display-block");
      $(".page21_btn").addClass("display-none");
      $(".prev21_btn").removeClass("display-block");
      $(".prev21_btn").addClass("display-none");
    }
    if(c_twentyone!=0 || disp_twentyone!=0 || elec_twentyone!=0){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page21_btn").removeClass("display-block");
      $(".page21_btn").addClass("display-none");
      $(".prev21_btn").removeClass("display-block");
      $(".prev21_btn").addClass("display-none");
    }
    if(c_twenty==0 && disp_twenty==0 && elec_twenty==0 && c_twentyone!=0 && disp_twentyone!=0 && elec_twentyone!=0){
      $(".page21_btn").removeClass("display-block");
      $(".page21_btn").addClass("display-none");
      $(".prev21_btn").removeClass("display-block");
      $(".prev21_btn").addClass("display-none");
    }
  }
}
function show_twentytwopg(){
  //alert("in show_twentytwopg");
  $(".comp_th_twenty").removeClass("tbl-cell");
  $(".comp_th_twenty").addClass("display-none");
  $(".comp_th_twentytwo").removeClass("display-none");
  $(".comp_th_twentytwo").addClass("tbl-cell");
  $(".disp_th_twenty").removeClass("tbl-cell");
  $(".disp_th_twenty").addClass("display-none");
  $(".disp_th_twentytwo").removeClass("display-none");
  $(".disp_th_twentytwo").addClass("tbl-cell");
  $(".elec_th_twenty").removeClass("tbl-cell");
  $(".elec_th_twenty").addClass("display-none");
  $(".elec_th_twentytwo").removeClass("display-none");
  $(".elec_th_twentytwo").addClass("tbl-cell");
  $(".page21_btn").removeClass("display-block");
  $(".page21_btn").addClass("display-none");
  //$(".page22_btn").removeClass("display-none");
  //$(".page22_btn").addClass("display-block");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds(); 
  //alert("@@@@@@@@@@@@@@@@"+current_time);
  // if(current_time >= "21:00:00"){
  //   alert("IFFFFFF");
  //   $(".page22_btn").removeClass("display-none");
  //   $(".page22_btn").addClass("display-block");
  // }else{
  //   alert("ELSEEEE");
  //   $(".page22_btn").removeClass("display-block");
  //   $(".page22_btn").addClass("display-none");
  // }
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_twentyone =0;
  $(".val_comp_21").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_twentyone++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_twentytwo =0;
  $(".val_comp_22").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_twentytwo++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_twentyone=0;
  $('.val_disp_1_21').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_twentyone++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_twentytwo=0;
  $('.val_disp_1_22').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_twentytwo++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_twentyone=0;
  $('.val_elec_21').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_twentyone++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }        
  });
  var elec_twentytwo=0;
  $('.val_elec_22').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_twentytwo++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }        
  });
  addDPR();
  col_twentyone(c_twentyone,disp_twentyone,elec_twentyone,c_twentytwo,disp_twentytwo,elec_twentytwo,current_time);
  $(".prev20_btn").removeClass("display-block");
  $(".prev20_btn").addClass("display-none");
  $(".prev21_btn").removeClass("display-none");
  $(".prev21_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
    if(c_twentyone!=0 && disp_twentyone!=0 && elec_twentyone!=0){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page22_btn").removeClass("display-block");
      $(".page22_btn").addClass("display-none");
      $(".prev22_btn").removeClass("display-block");
      $(".prev22_btn").addClass("display-none");
    }
    if(c_twentytwo!=0 || disp_twentytwo!=0 || elec_twentytwo!=0){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page22_btn").removeClass("display-block");
      $(".page22_btn").addClass("display-none");
      $(".prev22_btn").removeClass("display-block");
      $(".prev22_btn").addClass("display-none");
    }
    if(c_twentyone==0 && disp_twentyone==0 && elec_twentyone==0 && c_twentytwo!=0 && disp_twentytwo!=0 && elec_twentytwo!=0){
      $(".page22_btn").removeClass("display-block");
      $(".page22_btn").addClass("display-none");
      $(".prev22_btn").removeClass("display-block");
      $(".prev22_btn").addClass("display-none");
    }
  }
}
function show_twentythreepg(){   
  $(".comp_th_twentyone").removeClass("tbl-cell");
  $(".comp_th_twentyone").addClass("display-none");
  $(".comp_th_twentythree").removeClass("display-none");
  $(".comp_th_twentythree").addClass("tbl-cell");
  $(".disp_th_twentyone").removeClass("tbl-cell");
  $(".disp_th_twentyone").addClass("display-none");
  $(".disp_th_twentythree").removeClass("display-none");
  $(".disp_th_twentythree").addClass("tbl-cell");
  $(".elec_th_twentyone").removeClass("tbl-cell");
  $(".elec_th_twentyone").addClass("display-none");
  $(".elec_th_twentythree").removeClass("display-none");
  $(".elec_th_twentythree").addClass("tbl-cell");
  $(".page22_btn").removeClass("display-block");
  $(".page22_btn").addClass("display-none");

  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds(); 

  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_twentytwo =0;
  $(".val_comp_22").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_twentytwo++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_twentythree =0;
  $(".val_comp_23").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_twentythree++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- /
  var disp_twentytwo=0;
  $('.val_disp_1_22').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_twentytwo++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_twentythree=0;
  $('.val_disp_1_23').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_twentythree++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_twentytwo=0;
  $('.val_elec_22').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_twentytwo++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }        
  });
  var elec_twentythree=0;
  $('.val_elec_23').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_twentythree++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }        
  });  
  addDPR();
  col_twentytwo(c_twentytwo,disp_twentytwo,elec_twentytwo,c_twentythree,disp_twentythree,elec_twentythree,current_time);
  $(".save_btn").removeClass("display-none");
  $(".save_btn").addClass("display-block");

  $(".prev21_btn").removeClass("display-block");
  $(".prev21_btn").addClass("display-none");
  $(".prev22_btn").removeClass("display-none");
  $(".prev22_btn").addClass("display-block");

  $(".page1_btn").removeClass("display-block");
  $(".page1_btn").addClass("display-none");

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(g1 >= g2){
      //alert("if(g1 >= g2)");
    if(c_twentytwo!=0 && disp_twentytwo!=0 && elec_twentytwo!=0){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".save_btn").removeClass("display-block");
      $(".save_btn").addClass("display-none");
      // $(".prev22_btn").removeClass("display-block");
      // $(".prev22_btn").addClass("display-none");
    }
    if(c_twentythree!=0 || disp_twentythree!=0 || elec_twentythree!=0){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".save_btn").removeClass("display-block");
      $(".save_btn").addClass("display-none");
      // $(".prev22_btn").removeClass("display-block");
      // $(".prev22_btn").addClass("display-none");
    }
    if(c_twentytwo==0 && disp_twentytwo==0 && elec_twentytwo==0 && c_twentythree!=0 && disp_twentythree!=0 && elec_twentythree!=0){
      $(".save_btn").removeClass("display-block");
      $(".save_btn").addClass("display-none");
      // $(".prev22_btn").removeClass("display-block");
      // $(".prev22_btn").addClass("display-none");
    }
  }
}
function prev_show_firstpg(){
  $(".comp_th_zero").removeClass("display-none");
  $(".comp_th_zero").addClass("tbl-cell");
  $(".comp_th_one").removeClass("display-none");
  $(".comp_th_one").addClass("tbl-cell");
  $(".comp_th_two").removeClass("tbl-cell");
  $(".comp_th_two").addClass("display-none");

  $(".disp_th_zero").removeClass("display-none");
  $(".disp_th_zero").addClass("tbl-cell");
  $(".disp_th_one").removeClass("display-none");
  $(".disp_th_one").addClass("tbl-cell");
  $(".disp_th_two").removeClass("tbl-cell");
  $(".disp_th_two").addClass("display-none");

  $(".elec_th_zero").removeClass("display-none");
  $(".elec_th_zero").addClass("tbl-cell");
  $(".elec_th_one").removeClass("display-none");
  $(".elec_th_one").addClass("tbl-cell");
  $(".elec_th_two").removeClass("tbl-cell");
  $(".elec_th_two").addClass("display-none");

  $(".page1_btn").removeClass("display-none");
  $(".page1_btn").addClass("display-block");
  $(".page2_btn").removeClass("display-block");
  $(".page2_btn").addClass("display-none");
  $(".prev1_btn").removeClass("display-block");
  $(".prev1_btn").addClass("display-none");
}
function prev_show_secondpg(){
  $(".comp_th_one").removeClass("display-none");
  $(".comp_th_one").addClass("tbl-cell");
  $(".comp_th_two").removeClass("display-none");
  $(".comp_th_two").addClass("tbl-cell");
  $(".comp_th_three").removeClass("tbl-cell");
  $(".comp_th_three").addClass("display-none");

  $(".disp_th_one").removeClass("display-none");
  $(".disp_th_one").addClass("tbl-cell");
  $(".disp_th_two").removeClass("display-none");
  $(".disp_th_two").addClass("tbl-cell");
  $(".disp_th_three").removeClass("tbl-cell");
  $(".disp_th_three").addClass("display-none");

  $(".elec_th_one").removeClass("display-none");
  $(".elec_th_one").addClass("tbl-cell");
  $(".elec_th_two").removeClass("display-none");
  $(".elec_th_two").addClass("tbl-cell");
  $(".elec_th_three").removeClass("tbl-cell");
  $(".elec_th_three").addClass("display-none");

  $(".prev2_btn").removeClass("display-block");
  $(".prev2_btn").addClass("display-none");
  $(".prev1_btn").removeClass("display-none");
  $(".prev1_btn").addClass("display-block");
  $(".page2_btn").removeClass("display-none");
  $(".page2_btn").addClass("display-block");
  $(".page3_btn").removeClass("display-block");
  $(".page3_btn").addClass("display-none");
}
function prev_show_thirdpg(){
  $(".comp_th_two").removeClass("display-none");
  $(".comp_th_two").addClass("tbl-cell");
  $(".comp_th_three").removeClass("display-none");
  $(".comp_th_three").addClass("tbl-cell");
  $(".comp_th_four").removeClass("tbl-cell");
  $(".comp_th_four").addClass("display-none");

  $(".disp_th_two").removeClass("display-none");
  $(".disp_th_two").addClass("tbl-cell");
  $(".disp_th_three").removeClass("display-none");
  $(".disp_th_three").addClass("tbl-cell");
  $(".disp_th_four").removeClass("tbl-cell");
  $(".disp_th_four").addClass("display-none");

  $(".elec_th_two").removeClass("display-none");
  $(".elec_th_two").addClass("tbl-cell");
  $(".elec_th_three").removeClass("display-none");
  $(".elec_th_three").addClass("tbl-cell");
  $(".elec_th_four").removeClass("tbl-cell");
  $(".elec_th_four").addClass("display-none");

  $(".prev3_btn").removeClass("display-block");
  $(".prev3_btn").addClass("display-none");
  $(".prev2_btn").removeClass("display-none");
  $(".prev2_btn").addClass("display-block");
  $(".page3_btn").removeClass("display-none");
  $(".page3_btn").addClass("display-block");
  $(".page4_btn").removeClass("display-block");
  $(".page4_btn").addClass("display-none");
}
function prev_show_forthpg(){
  $(".comp_th_three").removeClass("display-none");
  $(".comp_th_three").addClass("tbl-cell");
  $(".comp_th_four").removeClass("display-none");
  $(".comp_th_four").addClass("tbl-cell");
  $(".comp_th_five").removeClass("tbl-cell");
  $(".comp_th_five").addClass("display-none");

  $(".disp_th_three").removeClass("display-none");
  $(".disp_th_three").addClass("tbl-cell");
  $(".disp_th_four").removeClass("display-none");
  $(".disp_th_four").addClass("tbl-cell");
  $(".disp_th_five").removeClass("tbl-cell");
  $(".disp_th_five").addClass("display-none");

  $(".elec_th_three").removeClass("display-none");
  $(".elec_th_three").addClass("tbl-cell");
  $(".elec_th_four").removeClass("display-none");
  $(".elec_th_four").addClass("tbl-cell");
  $(".elec_th_five").removeClass("tbl-cell");
  $(".elec_th_five").addClass("display-none");

  $(".prev4_btn").removeClass("display-block");
  $(".prev4_btn").addClass("display-none");
  $(".prev3_btn").removeClass("display-none");
  $(".prev3_btn").addClass("display-block");
  $(".page4_btn").removeClass("display-none");
  $(".page4_btn").addClass("display-block");
  $(".page5_btn").removeClass("display-block");
  $(".page5_btn").addClass("display-none");
}
function prev_show_fifthpg(){
  $(".comp_th_four").removeClass("display-none");
  $(".comp_th_four").addClass("tbl-cell");
  $(".comp_th_five").removeClass("display-none");
  $(".comp_th_five").addClass("tbl-cell");
  $(".comp_th_six").removeClass("tbl-cell");
  $(".comp_th_six").addClass("display-none");

  $(".disp_th_four").removeClass("display-none");
  $(".disp_th_four").addClass("tbl-cell");
  $(".disp_th_five").removeClass("display-none");
  $(".disp_th_five").addClass("tbl-cell");
  $(".disp_th_six").removeClass("tbl-cell");
  $(".disp_th_six").addClass("display-none");

  $(".elec_th_four").removeClass("display-none");
  $(".elec_th_four").addClass("tbl-cell");
  $(".elec_th_five").removeClass("display-none");
  $(".elec_th_five").addClass("tbl-cell");
  $(".elec_th_six").removeClass("tbl-cell");
  $(".elec_th_six").addClass("display-none");

  $(".prev5_btn").removeClass("display-block");
  $(".prev5_btn").addClass("display-none");
  $(".prev4_btn").removeClass("display-none");
  $(".prev4_btn").addClass("display-block");
  $(".page5_btn").removeClass("display-none");
  $(".page5_btn").addClass("display-block");
  $(".page6_btn").removeClass("display-block");
  $(".page6_btn").addClass("display-none");
}
function prev_show_sixthpg(){
  $(".comp_th_five").removeClass("display-none");
  $(".comp_th_five").addClass("tbl-cell");
  $(".comp_th_six").removeClass("display-none");
  $(".comp_th_six").addClass("tbl-cell");
  $(".comp_th_seven").removeClass("tbl-cell");
  $(".comp_th_seven").addClass("display-none");

  $(".disp_th_five").removeClass("display-none");
  $(".disp_th_five").addClass("tbl-cell");
  $(".disp_th_six").removeClass("display-none");
  $(".disp_th_six").addClass("tbl-cell");
  $(".disp_th_seven").removeClass("tbl-cell");
  $(".disp_th_seven").addClass("display-none");

  $(".elec_th_five").removeClass("display-none");
  $(".elec_th_five").addClass("tbl-cell");
  $(".elec_th_six").removeClass("display-none");
  $(".elec_th_six").addClass("tbl-cell");
  $(".elec_th_seven").removeClass("tbl-cell");
  $(".elec_th_seven").addClass("display-none");

  $(".prev6_btn").removeClass("display-block");
  $(".prev6_btn").addClass("display-none");
  $(".prev5_btn").removeClass("display-none");
  $(".prev5_btn").addClass("display-block");
  $(".page6_btn").removeClass("display-none");
  $(".page6_btn").addClass("display-block");
  $(".page7_btn").removeClass("display-block");
  $(".page7_btn").addClass("display-none");
}
function prev_show_seventhpg(){
  $(".comp_th_six").removeClass("display-none");
  $(".comp_th_six").addClass("tbl-cell");
  $(".comp_th_seven").removeClass("display-none");
  $(".comp_th_seven").addClass("tbl-cell");
  $(".comp_th_eight").removeClass("tbl-cell");
  $(".comp_th_eight").addClass("display-none");

  $(".disp_th_six").removeClass("display-none");
  $(".disp_th_six").addClass("tbl-cell");
  $(".disp_th_seven").removeClass("display-none");
  $(".disp_th_seven").addClass("tbl-cell");
  $(".disp_th_eight").removeClass("tbl-cell");
  $(".disp_th_eight").addClass("display-none");

  $(".elec_th_six").removeClass("display-none");
  $(".elec_th_six").addClass("tbl-cell");
  $(".elec_th_seven").removeClass("display-none");
  $(".elec_th_seven").addClass("tbl-cell");
  $(".elec_th_eight").removeClass("tbl-cell");
  $(".elec_th_eight").addClass("display-none");

  $(".prev7_btn").removeClass("display-block");
  $(".prev7_btn").addClass("display-none");
  $(".prev6_btn").removeClass("display-none");
  $(".prev6_btn").addClass("display-block");
  $(".page7_btn").removeClass("display-none");
  $(".page7_btn").addClass("display-block");
  $(".page8_btn").removeClass("display-block");
  $(".page8_btn").addClass("display-none");
}
function prev_show_eighthpg(){
  $(".comp_th_seven").removeClass("display-none");
  $(".comp_th_seven").addClass("tbl-cell");
  $(".comp_th_eight").removeClass("display-none");
  $(".comp_th_eight").addClass("tbl-cell");
  $(".comp_th_nine").removeClass("tbl-cell");
  $(".comp_th_nine").addClass("display-none");

  $(".disp_th_seven").removeClass("display-none");
  $(".disp_th_seven").addClass("tbl-cell");
  $(".disp_th_eight").removeClass("display-none");
  $(".disp_th_eight").addClass("tbl-cell");
  $(".disp_th_nine").removeClass("tbl-cell");
  $(".disp_th_nine").addClass("display-none");

  $(".elec_th_seven").removeClass("display-none");
  $(".elec_th_seven").addClass("tbl-cell");
  $(".elec_th_eight").removeClass("display-none");
  $(".elec_th_eight").addClass("tbl-cell");
  $(".elec_th_nine").removeClass("tbl-cell");
  $(".elec_th_nine").addClass("display-none");

  $(".prev8_btn").removeClass("display-block");
  $(".prev8_btn").addClass("display-none");
  $(".prev7_btn").removeClass("display-none");
  $(".prev7_btn").addClass("display-block");
  $(".page8_btn").removeClass("display-none");
  $(".page8_btn").addClass("display-block");
  $(".page9_btn").removeClass("display-block");
  $(".page9_btn").addClass("display-none");
}
function prev_show_ninethpg(){
  $(".comp_th_eight").removeClass("display-none");
  $(".comp_th_eight").addClass("tbl-cell");
  $(".comp_th_nine").removeClass("display-none");
  $(".comp_th_nine").addClass("tbl-cell");
  $(".comp_th_ten").removeClass("tbl-cell");
  $(".comp_th_ten").addClass("display-none");

  $(".disp_th_eight").removeClass("display-none");
  $(".disp_th_eight").addClass("tbl-cell");
  $(".disp_th_nine").removeClass("display-none");
  $(".disp_th_nine").addClass("tbl-cell");
  $(".disp_th_ten").removeClass("tbl-cell");
  $(".disp_th_ten").addClass("display-none");

  $(".elec_th_eight").removeClass("display-none");
  $(".elec_th_eight").addClass("tbl-cell");
  $(".elec_th_nine").removeClass("display-none");
  $(".elec_th_nine").addClass("tbl-cell");
  $(".elec_th_ten").removeClass("tbl-cell");
  $(".elec_th_ten").addClass("display-none");

  $(".prev9_btn").removeClass("display-block");
  $(".prev9_btn").addClass("display-none");
  $(".prev8_btn").removeClass("display-none");
  $(".prev8_btn").addClass("display-block");
  $(".page9_btn").removeClass("display-none");
  $(".page9_btn").addClass("display-block");
  $(".page10_btn").removeClass("display-block");
  $(".page10_btn").addClass("display-none");
} 
function prev_show_tenthpg(){
  $(".comp_th_nine").removeClass("display-none");
  $(".comp_th_nine").addClass("tbl-cell");
  $(".comp_th_ten").removeClass("display-none");
  $(".comp_th_ten").addClass("tbl-cell");
  $(".comp_th_eleven").removeClass("tbl-cell");
  $(".comp_th_eleven").addClass("display-none");

  $(".disp_th_nine").removeClass("display-none");
  $(".disp_th_nine").addClass("tbl-cell");
  $(".disp_th_ten").removeClass("display-none");
  $(".disp_th_ten").addClass("tbl-cell");
  $(".disp_th_eleven").removeClass("tbl-cell");
  $(".disp_th_eleven").addClass("display-none");

  $(".elec_th_nine").removeClass("display-none");
  $(".elec_th_nine").addClass("tbl-cell");
  $(".elec_th_ten").removeClass("display-none");
  $(".elec_th_ten").addClass("tbl-cell");
  $(".elec_th_eleven").removeClass("tbl-cell");
  $(".elec_th_eleven").addClass("display-none");

  $(".prev10_btn").removeClass("display-block");
  $(".prev10_btn").addClass("display-none");
  $(".prev9_btn").removeClass("display-none");
  $(".prev9_btn").addClass("display-block");
  $(".page10_btn").removeClass("display-none");
  $(".page10_btn").addClass("display-block");
  $(".page11_btn").removeClass("display-block");
  $(".page11_btn").addClass("display-none");
}
function prev_show_eleventhpg(){
  $(".comp_th_ten").removeClass("display-none");
  $(".comp_th_ten").addClass("tbl-cell");
  $(".comp_th_eleven").removeClass("display-none");
  $(".comp_th_eleven").addClass("tbl-cell");
  $(".comp_th_twelve").removeClass("tbl-cell");
  $(".comp_th_twelve").addClass("display-none");

  $(".disp_th_ten").removeClass("display-none");
  $(".disp_th_ten").addClass("tbl-cell");
  $(".disp_th_eleven").removeClass("display-none");
  $(".disp_th_eleven").addClass("tbl-cell");
  $(".disp_th_twelve").removeClass("tbl-cell");
  $(".disp_th_twelve").addClass("display-none");

  $(".elec_th_ten").removeClass("display-none");
  $(".elec_th_ten").addClass("tbl-cell");
  $(".elec_th_eleven").removeClass("display-none");
  $(".elec_th_eleven").addClass("tbl-cell");
  $(".elec_th_twelve").removeClass("tbl-cell");
  $(".elec_th_twelve").addClass("display-none");

  $(".prev11_btn").removeClass("display-block");
  $(".prev11_btn").addClass("display-none");
  $(".prev10_btn").removeClass("display-none");
  $(".prev10_btn").addClass("display-block");
  $(".page11_btn").removeClass("display-none");
  $(".page11_btn").addClass("display-block");
  $(".page12_btn").removeClass("display-block");
  $(".page12_btn").addClass("display-none");
}
function prev_show_twelvethpg(){
  $(".comp_th_eleven").removeClass("display-none");
  $(".comp_th_eleven").addClass("tbl-cell");
  $(".comp_th_twelve").removeClass("display-none");
  $(".comp_th_twelve").addClass("tbl-cell");
  $(".comp_th_thirteen").removeClass("tbl-cell");
  $(".comp_th_thirteen").addClass("display-none");

  $(".disp_th_eleven").removeClass("display-none");
  $(".disp_th_eleven").addClass("tbl-cell");
  $(".disp_th_twelve").removeClass("display-none");
  $(".disp_th_twelve").addClass("tbl-cell");
  $(".disp_th_thirteen").removeClass("tbl-cell");
  $(".disp_th_thirteen").addClass("display-none");

  $(".elec_th_eleven").removeClass("display-none");
  $(".elec_th_eleven").addClass("tbl-cell");
  $(".elec_th_twelve").removeClass("display-none");
  $(".elec_th_twelve").addClass("tbl-cell");
  $(".elec_th_thirteen").removeClass("tbl-cell");
  $(".elec_th_thirteen").addClass("display-none");

  $(".prev12_btn").removeClass("display-block");
  $(".prev12_btn").addClass("display-none");
  $(".prev11_btn").removeClass("display-none");
  $(".prev11_btn").addClass("display-block");
  $(".page12_btn").removeClass("display-none");
  $(".page12_btn").addClass("display-block");
  $(".page13_btn").removeClass("display-block");
  $(".page13_btn").addClass("display-none");
}
function prev_show_thirteenthpg(){
  //alert("HUUHHHHHH!!!!!!");
  $(".comp_th_twelve").removeClass("display-none");
  $(".comp_th_twelve").addClass("tbl-cell");
  $(".comp_th_thirteen").removeClass("display-none");
  $(".comp_th_thirteen").addClass("tbl-cell");
  $(".comp_th_fourteen").removeClass("tbl-cell");
  $(".comp_th_fourteen").addClass("display-none");

  $(".disp_th_twelve").removeClass("display-none");
  $(".disp_th_twelve").addClass("tbl-cell");
  $(".disp_th_thirteen").removeClass("display-none");
  $(".disp_th_thirteen").addClass("tbl-cell");
  $(".disp_th_fourteen").removeClass("tbl-cell");
  $(".disp_th_fourteen").addClass("display-none");

  $(".elec_th_twelve").removeClass("display-none");
  $(".elec_th_twelve").addClass("tbl-cell");
  $(".elec_th_thirteen").removeClass("display-none");
  $(".elec_th_thirteen").addClass("tbl-cell");
  $(".elec_th_fourteen").removeClass("tbl-cell");
  $(".elec_th_fourteen").addClass("display-none");

  $(".prev13_btn").removeClass("display-block");
  $(".prev13_btn").addClass("display-none");
  $(".prev12_btn").removeClass("display-none");
  $(".prev12_btn").addClass("display-block");
  $(".page13_btn").removeClass("display-none");
  $(".page13_btn").addClass("display-block");
  $(".page14_btn").removeClass("display-block");
  $(".page14_btn").addClass("display-none");
}
function prev_show_forteenthpg(){
  //alert("ALERT @@@");
  $(".comp_th_thirteen").removeClass("display-none");
  $(".comp_th_thirteen").addClass("tbl-cell");
  $(".comp_th_fourteen").removeClass("display-none");
  $(".comp_th_fourteen").addClass("tbl-cell");
  $(".comp_th_fifteen").removeClass("tbl-cell");
  $(".comp_th_fifteen").addClass("display-none");

  $(".disp_th_thirteen").removeClass("display-none");
  $(".disp_th_thirteen").addClass("tbl-cell");
  $(".disp_th_fourteen").removeClass("display-none");
  $(".disp_th_fourteen").addClass("tbl-cell");
  $(".disp_th_fifteen").removeClass("tbl-cell");
  $(".disp_th_fifteen").addClass("display-none");

  $(".elec_th_thirteen").removeClass("display-none");
  $(".elec_th_thirteen").addClass("tbl-cell");
  $(".elec_th_fourteen").removeClass("display-none");
  $(".elec_th_fourteen").addClass("tbl-cell");
  $(".elec_th_fifteen").removeClass("tbl-cell");
  $(".elec_th_fifteen").addClass("display-none");

  $(".prev14_btn").removeClass("display-block");
  $(".prev14_btn").addClass("display-none");
  $(".prev13_btn").removeClass("display-none");
  $(".prev13_btn").addClass("display-block");
  $(".page14_btn").removeClass("display-none");
  $(".page14_btn").addClass("display-block");
  $(".page15_btn").removeClass("display-block");
  $(".page15_btn").addClass("display-none");
}
function prev_show_fifteenthpg(){
  //alert("CALLED prev_show_fifteenthpg");
  $(".comp_th_fourteen").removeClass("display-none");
  $(".comp_th_fourteen").addClass("tbl-cell");
  $(".comp_th_fifteen").removeClass("display-none");
  $(".comp_th_fifteen").addClass("tbl-cell");
  $(".comp_th_sixteen").removeClass("tbl-cell");
  $(".comp_th_sixteen").addClass("display-none");

  $(".disp_th_fourteen").removeClass("display-none");
  $(".disp_th_fourteen").addClass("tbl-cell");
  $(".disp_th_fifteen").removeClass("display-none");
  $(".disp_th_fifteen").addClass("tbl-cell");
  $(".disp_th_sixteen").removeClass("tbl-cell");
  $(".disp_th_sixteen").addClass("display-none");

  $(".elec_th_fourteen").removeClass("display-none");
  $(".elec_th_fourteen").addClass("tbl-cell");
  $(".elec_th_fifteen").removeClass("display-none");
  $(".elec_th_fifteen").addClass("tbl-cell");
  $(".elec_th_sixteen").removeClass("tbl-cell");
  $(".elec_th_sixteen").addClass("display-none");

  $(".prev15_btn").removeClass("display-block");
  $(".prev15_btn").addClass("display-none");
  $(".prev14_btn").removeClass("display-none");
  $(".prev14_btn").addClass("display-block");
  $(".page15_btn").removeClass("display-none");
  $(".page15_btn").addClass("display-block");
  $(".page16_btn").removeClass("display-block");
  $(".page16_btn").addClass("display-none");
}
function prev_show_sixteenthpg(){
  //alert(" HA HA HA prev_show_sixteenthpg");
  $(".comp_th_fifteen").removeClass("display-none");
  $(".comp_th_fifteen").addClass("tbl-cell");
  $(".comp_th_sixteen").removeClass("display-none");
  $(".comp_th_sixteen").addClass("tbl-cell");
  $(".comp_th_seventeen").removeClass("tbl-cell");
  $(".comp_th_seventeen").addClass("display-none");

  $(".disp_th_fifteen").removeClass("display-none");
  $(".disp_th_fifteen").addClass("tbl-cell");
  $(".disp_th_sixteen").removeClass("display-none");
  $(".disp_th_sixteen").addClass("tbl-cell");
  $(".disp_th_seventeen").removeClass("tbl-cell");
  $(".disp_th_seventeen").addClass("display-none");

  $(".elec_th_fifteen").removeClass("display-none");
  $(".elec_th_fifteen").addClass("tbl-cell");
  $(".elec_th_sixteen").removeClass("display-none");
  $(".elec_th_sixteen").addClass("tbl-cell");
  $(".elec_th_seventeen").removeClass("tbl-cell");
  $(".elec_th_seventeen").addClass("display-none");

  $(".prev16_btn").removeClass("display-block");
  $(".prev16_btn").addClass("display-none");
  $(".prev15_btn").removeClass("display-none");
  $(".prev15_btn").addClass("display-block");
  $(".page16_btn").removeClass("display-none");
  $(".page16_btn").addClass("display-block");
  $(".page17_btn").removeClass("display-block");
  $(".page17_btn").addClass("display-none");
}
function prev_show_seventeenthpg(){
  $(".comp_th_sixteen").removeClass("display-none");
  $(".comp_th_sixteen").addClass("tbl-cell");
  $(".comp_th_seventeen").removeClass("display-none");
  $(".comp_th_seventeen").addClass("tbl-cell");
  $(".comp_th_eighteen").removeClass("tbl-cell");
  $(".comp_th_eighteen").addClass("display-none");

  $(".disp_th_sixteen").removeClass("display-none");
  $(".disp_th_sixteen").addClass("tbl-cell");
  $(".disp_th_seventeen").removeClass("display-none");
  $(".disp_th_seventeen").addClass("tbl-cell");
  $(".disp_th_eighteen").removeClass("tbl-cell");
  $(".disp_th_eighteen").addClass("display-none");

  $(".elec_th_sixteen").removeClass("display-none");
  $(".elec_th_sixteen").addClass("tbl-cell");
  $(".elec_th_seventeen").removeClass("display-none");
  $(".elec_th_seventeen").addClass("tbl-cell");
  $(".elec_th_eighteen").removeClass("tbl-cell");
  $(".elec_th_eighteen").addClass("display-none");

  $(".prev17_btn").removeClass("display-block");
  $(".prev17_btn").addClass("display-none");
  $(".prev16_btn").removeClass("display-none");
  $(".prev16_btn").addClass("display-block");
  $(".page17_btn").removeClass("display-none");
  $(".page17_btn").addClass("display-block");
  $(".page18_btn").removeClass("display-block");
  $(".page18_btn").addClass("display-none");
}
function prev_show_eighteenthpg() {
  $(".comp_th_seventeen").removeClass("display-none");
  $(".comp_th_seventeen").addClass("tbl-cell");
  $(".comp_th_eighteen").removeClass("display-none");
  $(".comp_th_eighteen").addClass("tbl-cell");
  $(".comp_th_nineteen").removeClass("tbl-cell");
  $(".comp_th_nineteen").addClass("display-none");

  $(".disp_th_seventeen").removeClass("display-none");
  $(".disp_th_seventeen").addClass("tbl-cell");
  $(".disp_th_eighteen").removeClass("display-none");
  $(".disp_th_eighteen").addClass("tbl-cell");
  $(".disp_th_nineteen").removeClass("tbl-cell");
  $(".disp_th_nineteen").addClass("display-none");

  $(".elec_th_seventeen").removeClass("display-none");
  $(".elec_th_seventeen").addClass("tbl-cell");
  $(".elec_th_eighteen").removeClass("display-none");
  $(".elec_th_eighteen").addClass("tbl-cell");
  $(".elec_th_nineteen").removeClass("tbl-cell");
  $(".elec_th_nineteen").addClass("display-none");

  $(".prev18_btn").removeClass("display-block");
  $(".prev18_btn").addClass("display-none");
  $(".prev17_btn").removeClass("display-none");
  $(".prev17_btn").addClass("display-block");
  $(".page18_btn").removeClass("display-none");
  $(".page18_btn").addClass("display-block");
  $(".page19_btn").removeClass("display-block");
  $(".page19_btn").addClass("display-none");
}
function prev_show_nineteenthpg(){
  $(".comp_th_eighteen").removeClass("display-none");
  $(".comp_th_eighteen").addClass("tbl-cell");
  $(".comp_th_nineteen").removeClass("display-none");
  $(".comp_th_nineteen").addClass("tbl-cell");
  $(".comp_th_twenty").removeClass("tbl-cell");
  $(".comp_th_twenty").addClass("display-none");

  $(".disp_th_eighteen").removeClass("display-none");
  $(".disp_th_eighteen").addClass("tbl-cell");
  $(".disp_th_nineteen").removeClass("display-none");
  $(".disp_th_nineteen").addClass("tbl-cell");
  $(".disp_th_twenty").removeClass("tbl-cell");
  $(".disp_th_twenty").addClass("display-none");

  $(".elec_th_eighteen").removeClass("display-none");
  $(".elec_th_eighteen").addClass("tbl-cell");
  $(".elec_th_nineteen").removeClass("display-none");
  $(".elec_th_nineteen").addClass("tbl-cell");
  $(".elec_th_twenty").removeClass("tbl-cell");
  $(".elec_th_twenty").addClass("display-none");

  $(".prev19_btn").removeClass("display-block");
  $(".prev19_btn").addClass("display-none");
  $(".prev18_btn").removeClass("display-none");
  $(".prev18_btn").addClass("display-block");
  $(".page19_btn").removeClass("display-none");
  $(".page19_btn").addClass("display-block");
  $(".page20_btn").removeClass("display-block");
  $(".page20_btn").addClass("display-none");
}
function prev_show_twentythpg(){
  $(".comp_th_nineteen").removeClass("display-none");
  $(".comp_th_nineteen").addClass("tbl-cell");
  $(".comp_th_twenty").removeClass("display-none");
  $(".comp_th_twenty").addClass("tbl-cell");
  $(".comp_th_twentyone").removeClass("tbl-cell");
  $(".comp_th_twentyone").addClass("display-none");

  $(".disp_th_nineteen").removeClass("display-none");
  $(".disp_th_nineteen").addClass("tbl-cell");
  $(".disp_th_twenty").removeClass("display-none");
  $(".disp_th_twenty").addClass("tbl-cell");
  $(".disp_th_twentyone").removeClass("tbl-cell");
  $(".disp_th_twentyone").addClass("display-none");

  $(".elec_th_nineteen").removeClass("display-none");
  $(".elec_th_nineteen").addClass("tbl-cell");
  $(".elec_th_twenty").removeClass("display-none");
  $(".elec_th_twenty").addClass("tbl-cell");
  $(".elec_th_twentyone").removeClass("tbl-cell");
  $(".elec_th_twentyone").addClass("display-none");

  $(".prev20_btn").removeClass("display-block");
  $(".prev20_btn").addClass("display-none");
  $(".prev19_btn").removeClass("display-none");
  $(".prev19_btn").addClass("display-block");
  $(".page20_btn").removeClass("display-none");
  $(".page20_btn").addClass("display-block");
  $(".page21_btn").removeClass("display-block");
  $(".page21_btn").addClass("display-none");
}
function prev_show_twentyonepg(){
  $(".comp_th_twenty").removeClass("display-none");
  $(".comp_th_twenty").addClass("tbl-cell");
  $(".comp_th_twentyone").removeClass("display-none");
  $(".comp_th_twentyone").addClass("tbl-cell");
  $(".comp_th_twentytwo").removeClass("tbl-cell");
  $(".comp_th_twentytwo").addClass("display-none");

  $(".disp_th_twenty").removeClass("display-none");
  $(".disp_th_twenty").addClass("tbl-cell");
  $(".disp_th_twentyone").removeClass("display-none");
  $(".disp_th_twentyone").addClass("tbl-cell");
  $(".disp_th_twentytwo").removeClass("tbl-cell");
  $(".disp_th_twentytwo").addClass("display-none");

  $(".elec_th_twenty").removeClass("display-none");
  $(".elec_th_twenty").addClass("tbl-cell");
  $(".elec_th_twentyone").removeClass("display-none");
  $(".elec_th_twentyone").addClass("tbl-cell");
  $(".elec_th_twentytwo").removeClass("tbl-cell");
  $(".elec_th_twentytwo").addClass("display-none");

  $(".prev21_btn").removeClass("display-block");
  $(".prev21_btn").addClass("display-none");
  $(".prev20_btn").removeClass("display-none");
  $(".prev20_btn").addClass("display-block");
  $(".page21_btn").removeClass("display-none");
  $(".page21_btn").addClass("display-block");
  $(".page22_btn").removeClass("display-block");
  $(".page22_btn").addClass("display-none");
}
function prev_show_twentytwopg(){
  $(".comp_th_twentyone").removeClass("display-none");
  $(".comp_th_twentyone").addClass("tbl-cell");
  $(".comp_th_twentytwo").removeClass("display-none");
  $(".comp_th_twentytwo").addClass("tbl-cell");
  $(".comp_th_twentythree").removeClass("tbl-cell");
  $(".comp_th_twentythree").addClass("display-none");

  $(".disp_th_twentyone").removeClass("display-none");
  $(".disp_th_twentyone").addClass("tbl-cell");
  $(".disp_th_twentytwo").removeClass("display-none");
  $(".disp_th_twentytwo").addClass("tbl-cell");
  $(".disp_th_twentythree").removeClass("tbl-cell");
  $(".disp_th_twentythree").addClass("display-none");

  $(".elec_th_twentyone").removeClass("display-none");
  $(".elec_th_twentyone").addClass("tbl-cell");
  $(".elec_th_twentytwo").removeClass("display-none");
  $(".elec_th_twentytwo").addClass("tbl-cell");
  $(".elec_th_twentythree").removeClass("tbl-cell");
  $(".elec_th_twentythree").addClass("display-none");

  $(".prev22_btn").removeClass("display-block");
  $(".prev22_btn").addClass("display-none");
  $(".prev21_btn").removeClass("display-none");
  $(".prev21_btn").addClass("display-block");
  $(".page22_btn").removeClass("display-none");
  $(".page22_btn").addClass("display-block");
  $(".page23_btn").removeClass("display-block");
  $(".page23_btn").addClass("display-none");
  $(".save_btn").removeClass("display-block");
  $(".save_btn").addClass("display-none");
}
function addDPR(save){
  checkConnection();
  var session_uid = window.localStorage.getItem("session_uid");
  var form_dpr = $(".form_dpr").serialize();
  var dt = new Date();
  if(dt.getMinutes() <=9){
    var min = "0"+dt.getMinutes();
  }else{
    var min = dt.getMinutes();
  }
  var current_time = dt.getHours() + ":" + min + ":" + dt.getSeconds();
  console.log(current_time);
  //console.log(form_dpr);
  /*var c_zero =0;
  $(".val_comp_0").each(function(){
  //alert("***"+$(this).val()+"----------");    
    if( $.trim($(this).val()).length == 0){ c_zero++;
      $(this).css("background", "#fde0e0");
      //var elem = document.querySelector('.val_comp_0');
      //elem.style.setProperty('border', '1px solid red', 'important');
      //$(this).css("border", "1px solid red"); 
    }        
  });*/
  // -------------------------------- COMPRESSOR ------------------------------------ //
  var c_zero =0;
  $(".val_comp_0").each(function(){ 
    if( $.trim($(this).val()).length == 0){  c_zero++;
      console.log("if");
      $(this).css("background", "#fde0e0");   
    }else{
      console.log("else");
      $(this).css("background","#fff");    
    }         
  });
  var c_one =0;
  $(".val_comp_1").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_one++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_two =0;
  $(".val_comp_2").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_two++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_three =0;
  $(".val_comp_3").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_three++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_four =0;
  $(".val_comp_4").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_four++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_five =0;
  $(".val_comp_5").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_five++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_six =0;
  $(".val_comp_6").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_six++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_seven =0;
  $(".val_comp_7").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_seven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_eight =0;
  $(".val_comp_8").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_eight++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_nine =0;
  $(".val_comp_9").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_nine++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_ten =0;
  $(".val_comp_10").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_ten++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_eleven =0;
  $(".val_comp_11").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_eleven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_twelve =0;
  $(".val_comp_12").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_twelve++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_thirteen =0;
  $(".val_comp_13").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_thirteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_fourteen =0;
  $(".val_comp_14").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_fourteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_fifteen =0;
  $(".val_comp_15").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_fifteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_sixteen =0;
  $(".val_comp_16").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_sixteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_seventeen =0;
  $(".val_comp_17").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_seventeen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_eighteen =0;
  $(".val_comp_18").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_eighteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_nineteen =0;
  $(".val_comp_19").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_nineteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_twenty =0;
  $(".val_comp_20").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_twenty++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_twentyone =0;
  $(".val_comp_21").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_twentyone++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_twentytwo =0;
  $(".val_comp_22").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_twentytwo++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var c_twentythree =0;
  $(".val_comp_23").each(function(){  
    if( $.trim($(this).val()).length == 0){ c_twentythree++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  // --------------------------------- DISPENSER ---------------------------------- //
  var disp_zero=0;
  $('.val_disp_1_0').each(function(){
  //alert("***"+$(this).val()+"----------");    
    if( $.trim($(this).val()).length == 0){ disp_zero++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }        
  });
  var disp_one=0;
  $('.val_disp_1_1').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_one++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }  
  });
  var disp_two=0;
  $('.val_disp_1_2').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_two++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_three=0;
  $('.val_disp_1_3').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_three++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_four=0;
  $('.val_disp_1_4').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_four++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_five=0;
  $('.val_disp_1_5').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_five++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_six=0;
  $('.val_disp_1_6').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_six++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_seven=0;
  $('.val_disp_1_7').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_seven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_eight=0;
  $('.val_disp_1_8').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_eight++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_nine=0;
  $('.val_disp_1_9').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_nine++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_ten=0;
  $('.val_disp_1_10').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_ten++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_eleven=0;
  $('.val_disp_1_11').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_eleven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_twelve=0;
  $('.val_disp_1_12').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_twelve++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_thirteen=0;
  $('.val_disp_1_13').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_thirteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_fourteen=0;
  $('.val_disp_1_14').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_fourteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_fifteen=0;
  $('.val_disp_1_15').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_fifteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_sixteen=0;
  $('.val_disp_1_16').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_sixteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_seventeen=0;
  $('.val_disp_1_17').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_seventeen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_eightteen=0;
  $('.val_disp_1_18').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_eightteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_nineteen=0;
  $('.val_disp_1_19').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_nineteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_twenty=0;
  $('.val_disp_1_20').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_twenty++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_twentyone=0;
  $('.val_disp_1_21').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_twentyone++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_twentytwo=0;
  $('.val_disp_1_22').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_twentytwo++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var disp_twentythree=0;
  $('.val_disp_1_23').each(function(){   
    if( $.trim($(this).val()).length == 0){ disp_twentythree++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });

  // -------------------------------------- ELECTRICAL ------------------------------------------- //
  var elec_zero=0;
  $('.val_elec_0').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_zero++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_one=0;
  $('.val_elec_1').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_one++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_two=0;
  $('.val_elec_2').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_two++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_three=0;
  $('.val_elec_3').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_three++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_four=0;
  $('.val_elec_4').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_four++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_five=0;
  $('.val_elec_5').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_five++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_six=0;
  $('.val_elec_6').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_six++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_seven=0;
  $('.val_elec_7').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_seven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_eight=0;
  $('.val_elec_8').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_eight++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_nine=0;
  $('.val_elec_9').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_nine++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_ten=0;
  $('.val_elec_10').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_ten++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_eleven=0;
  $('.val_elec_11').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_eleven++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_twelve=0;
  $('.val_elec_12').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_twelve++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_thirteen=0;
  $('.val_elec_13').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_thirteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_fourteen=0;
  $('.val_elec_14').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_fourteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_fifteen=0;
  $('.val_elec_15').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_fifteen++;
      $(this).css("background", "#fde0e0");
    }else{
      $(this).css("background","#fff");
    }         
  });
  var elec_sixteen=0;
  $('.val_elec_16').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_sixteen++;
      $(this).css("background", "#fde0e0");
    }        
  });
  var elec_seventeen=0;
  $('.val_elec_17').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_seventeen++;
      $(this).css("background", "#fde0e0");
    }        
  });
  var elec_eighteen=0;
  $('.val_elec_18').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_eighteen++;
      $(this).css("background", "#fde0e0");
    }        
  });
  var elec_nineteen=0;
  $('.val_elec_19').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_nineteen++;
      $(this).css("background", "#fde0e0");
    }        
  });
  var elec_twenty=0;
  $('.val_elec_20').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_twenty++;
      $(this).css("background", "#fde0e0");
    }        
  });
  var elec_twentyone=0;
  $('.val_elec_21').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_twentyone++;
      $(this).css("background", "#fde0e0");
    }        
  });
  var elec_twentytwo=0;
  $('.val_elec_22').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_twentytwo++;
      $(this).css("background", "#fde0e0");
    }        
  });
  var elec_twentythree=0;
  $('.val_elec_23').each(function(){   
    if( $.trim($(this).val()).length == 0){ elec_twentythree++;
      $(this).css("background", "#fde0e0");
    }        
  });
  console.log("CURRENT TIME ====================="+current_time);

  /*if(c_zero == 0){
    $("#hidd_comp_0").val(0);
    if(current_time >= "01:00:00"){
      $(".val_comp_1").attr("readonly",false);
      $(".val_comp_1").removeClass("readonlytxtbox");
      $(".lcv3_mfm_1").removeClass("readonlytxtbox");
      $(".lcv4_mfm_1").removeClass("readonlytxtbox");
      $(".lcv5_mfm_1").removeClass("readonlytxtbox");
      //$(".page1_btn").removeClass("display-none");
      //$(".page1_btn").addClass("display-block");
    }else{
      $(".val_comp_1").attr("readonly",true);
      $(".val_comp_1").addClass("readonlytxtbox");
      $(".lcv3_mfm_1").addClass("readonlytxtbox");
      $(".lcv4_mfm_1").addClass("readonlytxtbox");
      $(".lcv5_mfm_1").addClass("readonlytxtbox");
    }
  }
  if(disp_zero == 0){
    $("#hidd_disp_0").val(0);
    if(current_time >= "01:00:00"){
      $(".val_disp_1_1").attr("readonly",false);
      $(".val_disp_1_1").removeClass("readonlytxtbox");
      $(".disp_th_one input").removeClass("readonlytxtbox");
      //$(".page1_btn").removeClass("display-none");
      //$(".page1_btn").addClass("display-block");
    }else{
      $(".val_disp_1_1").attr("readonly",true);
      $(".val_disp_1_1").addClass("readonlytxtbox");
      $(".disp_th_one input").addClass("readonlytxtbox");
    }
  }
  if(elec_zero == 0){
    $("#hidd_elec_0").val(0);
    if(current_time >= "01:00:00"){
      $(".val_elec_1").attr("readonly",false);
      $(".val_elec_1").removeClass("readonlytxtbox");
      //$(".page1_btn").removeClass("display-none");
      //$(".page1_btn").addClass("display-block");
    }else{
      $(".val_elec_1").attr("readonly",true);
      $(".val_elec_1").addClass("readonlytxtbox");
    }
  }
  //alert(c_nine+"------"+disp_nine+"***********"+elec_nine);
  if(c_zero == 0 || disp_zero == 0 || elec_zero == 0){
    alert("arey");
    if(current_time > "01:00:00"){
      $(".page1_btn").removeClass("display-none");
      $(".page1_btn").addClass("display-block");
    }
  }else{
    alert("ITS not 1 o' clock");
  }
  

  //alert(c_one +"$$$$$"+disp_one+"#####"+elec_one);
  if(c_one == 0){
    $("#hidd_comp_1").val(0);
    if(current_time >= "02:00:00"){
      $(".val_comp_2").attr("readonly",false);
      $(".val_comp_2").removeClass("readonlytxtbox");
      $(".lcv3_mfm_2").removeClass("readonlytxtbox");
      $(".lcv4_mfm_2").removeClass("readonlytxtbox");
      $(".lcv5_mfm_2").removeClass("readonlytxtbox");
      //$(".page1_btn").removeClass("display-none");
      //$(".page1_btn").addClass("display-block");
    }
  }
  if(disp_one == 0){
    $("#hidd_disp_1").val(0);
    if(current_time >= "02:00:00"){
      $(".val_disp_1_2").attr("readonly",false);
      $(".val_disp_1_2").removeClass("readonlytxtbox");
      $(".disp_th_two input").removeClass("readonlytxtbox");
      //$(".page1_btn").removeClass("display-none");
      //$(".page1_btn").addClass("display-block");
    }
  }
  if(elec_one == 0){
    $("#hidd_elec_1").val(0);
    if(current_time >= "02:00:00"){
      $(".val_elec_2").attr("readonly",false);
      $(".val_elec_2").removeClass("readonlytxtbox");
      //$(".page1_btn").removeClass("display-none");
      //$(".page1_btn").addClass("display-block");
    }
  }
  //alert(c_nine+"------"+disp_nine+"***********"+elec_nine);
  if(c_one == 0 || disp_one == 0 || elec_one == 0){
    alert("arey onee---");
    if(current_time > "02:00:00"){
      $(".page2_btn").removeClass("display-none");
      $(".page2_btn").addClass("display-block");
    }
  }else{
    alert("ITS not 2 o' clock");
  }*/


  
  

  /*if(c_twenty==0 || c_twentyone==0){
    if(current_time >= '21:00:00'){
      $(".val_comp_21").attr("readonly",false);
      $(".val_comp_21").removeClass("readonlytxtbox");
    }
  }
  if((disp_twenty == 0 || disp_twentyone == 0)){
    if(current_time >= '21:00:00'){
      alert(current_time+" >= 21:00:00");      
      $(".val_disp_1_21").attr("readonly",false);
      $(".val_disp_1_21").removeClass("readonlytxtbox");  
    }
  }
  if((elec_twenty == 0 || elec_twentyone == 0)){
    if(current_time >= '21:00:00'){
      alert(current_time+" >= 21:00:00");     
      $(".val_elec_21").attr("readonly",false);      
      $(".val_elec_21").removeClass("readonlytxtbox");
      //console.log("readonly remove from 01:00");     
    }
  }
  if(c_twentyone==0 && disp_twentyone==0 && elec_twentyone==0){
    if(current_time >= '21:00:00'){
      alert("aaaaaaaaaaaaaaaaaaaaaaaaa");
      $(".page22_btn").removeClass("display-none");
      $(".page22_btn").addClass("display-block");
    }
  }*/



 /*if((c_two == 0 || c_three == 0) || (disp_two==0 || disp_three==0) || (elec_two==0 && elec_three==0)){
    if(current_time >= '03:00:00'){
      alert(current_time+" >= 03:00:00");
    //display save & next btn //
    //$(".page1_btn").removeClass("display-block");
    //$(".page1_btn").addClass("display-none");
    $(".page2_btn").removeClass("display-none");
    $(".page2_btn").addClass("display-block");
    // readonly remove from 02:00 //
    $(".comp_th_three input").attr("readonly",false);
    $(".disp_th_three input").attr("readonly",false);
    $(".elec_th_three input").attr("readonly",false);
    $(".comp_th_three input").removeClass("readonlytxtbox");
    $(".disp_th_three input").removeClass("readonlytxtbox");
    $(".elec_th_three input").removeClass("readonlytxtbox");
  }else{
    alert("ELSE " +current_time+" >= 02:00:00");
  }
 }*/

 /*if(disp_zero == 0 || disp_one == 0){
    if(current_time >= '01:00:00'){
      // readonly remove from 01:00 //
      $(".disp_th_one input").attr("readonly",false);
      //$(".disp_th_one input").attr("readonly",false);
      //$(".elec_th_one input").attr("readonly",false);
      $(".disp_th_one input").removeClass("readonlytxtbox");
      //$(".disp_th_one input").removeClass("readonlytxtbox");
      //$(".elec_th_one input").removeClass("readonlytxtbox");
      //console.log("readonly remove from 01:00");     
    }
  }
 
 if(disp_one == 0 || disp_two == 0){
    if(current_time >= '02:00:00'){
    //display save & next btn //
    $(".page1_btn").removeClass("display-none");
    $(".page1_btn").addClass("display-block");
    // readonly remove from 02:00 //
    $(".disp_th_two input").attr("readonly",false);
    //$(".disp_th_two input").attr("readonly",false);
    //$(".elec_th_two input").attr("readonly",false);
    $(".disp_th_two input").removeClass("readonlytxtbox");
    //$(".disp_th_two input").removeClass("readonlytxtbox");
    //$(".elec_th_two input").removeClass("readonlytxtbox");
  }
 }*/

 /*if(c_two == 0 || c_three == 0){
    if(current_time >= '03:00:00'){
    //display save & next btn //
    $(".page2_btn").removeClass("display-none");
    $(".page2_btn").addClass("display-block");
    // readonly remove from 02:00 //
    $(".comp_th_three input").attr("readonly",false);
    $(".comp_th_three input").removeClass("readonlytxtbox");
  }
 } */

  /*if(c_zero == 0 && c_one == 0){
    $(".page1_btn").removeClass("display-none");
    $(".page1_btn").addClass("display-block");
  }*/


  //app.preloader.show();

  var hidd_stid = $("#hidd_stid").val();
  var hidd_dprdt = $("#hidd_dprdt").val();
  // INSERT IN DATABASE //
  //if(z==0){
    $.ajax({
      type:'POST', 
      url:base_url+'APP/Appcontroller/insertDPR',
      //data:form_dpr+"&session_uid="+session_uid,
      //data:{'hidd_stid':hidd_stid,'hidd_dprdt':hidd_dprdt},  
      data:form_dpr+"&hidd_stid="+hidd_stid+"&hidd_dprdt="+hidd_dprdt+"&session_uid="+session_uid,
      success:function(authRes){
        //app.preloader.hide();
      }
    });
  //}
 
  //alert("save"+save);
  if(save!='save'){
    col_zero(c_zero,disp_zero,elec_zero,c_one,disp_one,elec_one,current_time);
  }
  // if(save=='save'){
  //   col_zero(c_zero,disp_zero,elec_zero,c_one,disp_one,elec_one,current_time);
  // }
  if(save=='submit'){
    //alert("submit clicked");
    $(".page1_btn").removeClass("display-block");
    $(".page1_btn").addClass("display-none");
  }

  if(save=='save'){
    //alert("in save");
    var hidd_dprdt = $("#hidd_dprdt").val();
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
    var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
    var split_hiddt = hidd_dprdt.split("-");
    var split_yr = split_hiddt[2];
    var split_mn = split_hiddt[1];
    var split_dt = split_hiddt[0];
    var today_yr =d.getFullYear();
    var today_mn = month;
    var today_dt = day;
    var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
    var g1 = new Date(split_yr, split_mn, split_dt);  
    var g2 = new Date(today_yr, today_mn, today_dt);
    if(g1 >= g2){   
      //alert("CUTE****************"); 
      if(c_zero==0 && disp_zero==0 && elec_zero==0 && c_one==0 && disp_one==0 && elec_one==0){
        //if(current_time >= "01:00:00"){ // cmnt on 30-4-2020 //
        if(current_time >= "02:00:00"){
          //alert("arey");
          

          
          col_zero(c_zero,disp_zero,elec_zero,c_one,disp_one,elec_one,current_time);
          show_secondpg();
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none"); 
          // $(".comp_th_one input").attr("readonly",true);
          // $(".disp_th_one input").attr("readonly",true);
          // $(".elec_th_one input").attr("readonly",true);
          // $(".comp_th_one input").addClass("readonlytxtbox");
          // $(".disp_th_one input").addClass("readonlytxtbox");
          // $(".elec_th_one input").addClass("readonlytxtbox");
        }
      }

      if(c_zero==0 && disp_zero==0 && elec_zero==0 && c_one!=0 && disp_one!=0 && elec_one!=0){
        //if(current_time >= "01:00:00"){ // cmnt on 30-4-2020 //
        if(current_time >= "02:00:00"){
          //alert("OHH are");
          //$(".page1_btn").removeClass("display-none");
          //$(".page1_btn").addClass("display-block");

          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none"); 
          
          
          col_zero(c_zero,disp_zero,elec_zero,c_one,disp_one,elec_one,current_time);
          show_secondpg();
          //col_zero(c_zero,disp_zero,elec_zero,c_one,disp_one,elec_one,current_time); 


          //$(".prev1_btn").removeClass("display-block");
          //$(".prev1_btn").addClass("display-none");
          //col_four(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time);
          //show_thirdpg();
          //col_one(c_one,disp_one,elec_one,c_two,disp_two,elec_two,current_time);
        }
      }

      if(c_one==0 && disp_one==0 && elec_one==0 && c_two==0 && disp_two==0 && elec_two==0){
        //if(current_time >= "02:00:00"){ // cmnt on 30-4-2020 //
        if(current_time >= "03:00:00"){
          //alert("OHH 02");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          //$(".prev1_btn").removeClass("display-block");
          //$(".prev1_btn").addClass("display-none");
          //col_four(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time);
          
          col_one(c_one,disp_one,elec_one,c_two,disp_two,elec_two,current_time);
          show_thirdpg();
        }
      }

      if(c_one==0 && disp_one==0 && elec_one==0 && c_two!=0 && disp_two!=0 && elec_two!=0){
        //if(current_time >= "02:00:00"){ // cmnt on 30-4-2020 //
        if(current_time >= "03:00:00"){
          //alert("OHH 02");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          //$(".prev1_btn").removeClass("display-block");
          //$(".prev1_btn").addClass("display-none");
          //col_four(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time);
          
          col_one(c_one,disp_one,elec_one,c_two,disp_two,elec_two,current_time);
          //show_thirdpg();
          show_secondpg();
        }
      }

      if(c_two==0 && disp_two==0 && elec_two==0 && c_three==0 && disp_three==0 && elec_three==0){
        //if(current_time >= "03:00:00"){ 
        if(current_time >= "04:00:00"){ 
          //alert("OHH 03");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev1_btn").removeClass("display-block");
          $(".prev1_btn").addClass("display-none");
          $(".prev2_btn").removeClass("display-block");
          $(".prev2_btn").addClass("display-none");
          //col_four(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time);
          
          col_two(c_two,disp_two,elec_two,c_three,disp_three,elec_three,current_time);
          show_forthpg();
        }
      }

      if(c_two==0 && disp_two==0 && elec_two==0 && c_three!=0 && disp_three!=0 && elec_three!=0){
        //if(current_time >= "03:00:00"){ 
        if(current_time >= "04:00:00"){
          //alert("OHH 03");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev1_btn").removeClass("display-block");
          $(".prev1_btn").addClass("display-none");
          $(".prev2_btn").removeClass("display-block");
          $(".prev2_btn").addClass("display-none");
          //col_four(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time);
          
          col_two(c_two,disp_two,elec_two,c_three,disp_three,elec_three,current_time);
          //show_forthpg();
          show_thirdpg();
        }
      }

      if(c_three==0 && disp_three==0 && elec_three==0 && c_four==0 && disp_four==0 && elec_four==0){
        //if(current_time >= "04:00:00"){
        if(current_time >= "05:00:00"){
          //alert("OHH 04");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev2_btn").removeClass("display-block");
          $(".prev2_btn").addClass("display-none");
          $(".prev3_btn").removeClass("display-block");
          $(".prev3_btn").addClass("display-none");
          //col_four(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time);
          
          col_three(c_three,disp_three,elec_three,c_four,disp_four,elec_four,current_time);
          show_fifthpg();
        }
      }

      if(c_three==0 && disp_three==0 && elec_three==0 && c_four!=0 && disp_four!=0 && elec_four!=0){
        //if(current_time >= "04:00:00"){
        if(current_time >= "05:00:00"){
          //alert("OHH 04");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev2_btn").removeClass("display-block");
          $(".prev2_btn").addClass("display-none");
          $(".prev3_btn").removeClass("display-block");
          $(".prev3_btn").addClass("display-none");
          //col_four(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time);
          
          col_three(c_three,disp_three,elec_three,c_four,disp_four,elec_four,current_time);
          //show_fifthpg();
          show_forthpg();
        }
      }

      if(c_four==0 && disp_four==0 && elec_four==0 && c_five==0 && disp_five==0 && elec_five==0){
        //if(current_time >= "05:00:00"){
        if(current_time >= "06:00:00"){
          //alert("OHH 05 **********");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev3_btn").removeClass("display-block");
          $(".prev3_btn").addClass("display-none");
          $(".prev4_btn").removeClass("display-block");
          $(".prev4_btn").addClass("display-none");
          //col_five(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time)
          
          col_four(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time);
          show_sixthpg();
        }
      }

      if(c_four==0 && disp_four==0 && elec_four==0 && c_five!=0 && disp_five!=0 && elec_five!=0){
        //if(current_time >= "05:00:00"){
        if(current_time >= "06:00:00"){
          //alert("OHH 05====================");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev3_btn").removeClass("display-block");
          $(".prev3_btn").addClass("display-none");
          $(".prev4_btn").removeClass("display-block");
          $(".prev4_btn").addClass("display-none");
          //col_five(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time)
          
          col_four(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time);
          //show_sixthpg();
          show_fifthpg();
        }
      }
      if(c_five==0 && disp_five==0 && elec_five==0 && c_six==0 && disp_six==0 && elec_six==0){
        //if(current_time >= "06:00:00"){
        if(current_time >= "07:00:00"){
          //alert("OHH 06 ****************");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev4_btn").removeClass("display-block");
          $(".prev4_btn").addClass("display-none");
          $(".prev5_btn").removeClass("display-block");
          $(".prev5_btn").addClass("display-none");
          
          col_five(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time);
          show_seventhpg();
          //col_six(c_five,disp_five,elec_five,c_six,disp_six,elec_six,current_time);
        }
      }

      if(c_five==0 && disp_five==0 && elec_five==0 && c_six!=0 && disp_six!=0 && elec_six!=0){
        //if(current_time >= "06:00:00"){
        if(current_time >= "07:00:00"){
          //alert("OHH 06 ^^^^^^^^^^^^^^^^");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev4_btn").removeClass("display-block");
          $(".prev4_btn").addClass("display-none");
          $(".prev5_btn").removeClass("display-block");
          $(".prev5_btn").addClass("display-none");
          
          col_five(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time);
          //show_seventhpg();
          show_sixthpg();
          //col_six(c_five,disp_five,elec_five,c_six,disp_six,elec_six,current_time);
        }
      }

      if(c_six==0 && disp_six==0 && elec_six==0 && c_seven==0 && disp_seven==0 && elec_seven==0){
        //if(current_time >= "07:00:00"){
        if(current_time >= "08:00:00"){
          //alert("OHH 07 *************");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev5_btn").removeClass("display-block");
          $(".prev5_btn").addClass("display-none");
          $(".prev6_btn").removeClass("display-block");
          $(".prev6_btn").addClass("display-none");
          //col_seven(c_six,disp_six,elec_six,c_seven,disp_seven,elec_seven,current_time);

          col_six(c_five,disp_five,elec_five,c_six,disp_six,elec_six,current_time);
          show_eighthpg();
        }
      }
      if(c_six==0 && disp_six==0 && elec_six==0 && c_seven!=0 && disp_seven!=0 && elec_seven!=0){
        //if(current_time >= "07:00:00"){
        if(current_time >= "08:00:00"){
          //alert("OHH 07 ==========");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev5_btn").removeClass("display-block");
          $(".prev5_btn").addClass("display-none");
          $(".prev6_btn").removeClass("display-block");
          $(".prev6_btn").addClass("display-none");
          //col_seven(c_six,disp_six,elec_six,c_seven,disp_seven,elec_seven,current_time);

          col_six(c_five,disp_five,elec_five,c_six,disp_six,elec_six,current_time);
          //show_eighthpg();
          show_seventhpg();
        }
      }

      if(c_seven==0 && disp_seven==0 && elec_seven==0 && c_eight==0 && disp_eight==0 && elec_eight==0){
        //if(current_time >= "08:00:00"){
        if(current_time >= "09:00:00"){
          //alert("OHH 08");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev6_btn").removeClass("display-block");
          $(".prev6_btn").addClass("display-none");
          $(".prev7_btn").removeClass("display-block");
          $(".prev7_btn").addClass("display-none");
          
          col_seven(c_six,disp_six,elec_six,c_seven,disp_seven,elec_seven,current_time);
          show_ninthpg();
          //col_eight(c_seven,disp_seven,elec_seven,c_eight,disp_eight,elec_eight,current_time);
        }
      }
      if(c_seven==0 && disp_seven==0 && elec_seven==0 && c_eight!=0 && disp_eight!=0 && elec_eight!=0){
        //if(current_time >= "08:00:00"){
        if(current_time >= "09:00:00"){
          //alert("OHH 08");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev6_btn").removeClass("display-block");
          $(".prev6_btn").addClass("display-none");
          $(".prev7_btn").removeClass("display-block");
          $(".prev7_btn").addClass("display-none");
          
          col_seven(c_six,disp_six,elec_six,c_seven,disp_seven,elec_seven,current_time);
          //show_ninthpg();
          show_eighthpg();
          //col_eight(c_seven,disp_seven,elec_seven,c_eight,disp_eight,elec_eight,current_time);
        }
      }


      if(c_eight==0 && disp_eight==0 && elec_eight==0 && c_nine==0 && disp_nine==0 && elec_nine==0){
        //if(current_time >= "09:00:00"){
        if(current_time >= "10:00:00"){
          //alert("OHH 09");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev7_btn").removeClass("display-block");
          $(".prev7_btn").addClass("display-none");
          $(".prev8_btn").removeClass("display-block");
          $(".prev8_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          
          col_eight(c_seven,disp_seven,elec_seven,c_eight,disp_eight,elec_eight,current_time);
          show_tenthpg();
        }
      }

      if(c_eight==0 && disp_eight==0 && elec_eight==0 && c_nine!=0 && disp_nine!=0 && elec_nine!=0){
        //if(current_time >= "09:00:00"){
        if(current_time >= "10:00:00"){
          //alert("OHH 09");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev7_btn").removeClass("display-block");
          $(".prev7_btn").addClass("display-none");
          $(".prev8_btn").removeClass("display-block");
          $(".prev8_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          
          col_eight(c_seven,disp_seven,elec_seven,c_eight,disp_eight,elec_eight,current_time);
          //show_tenthpg();
          show_ninthpg();
        }
      }

      if(c_nine==0 && disp_nine==0 && elec_nine==0 && c_ten==0 && disp_ten==0 && elec_ten==0){
        //if(current_time >= "10:00:00"){
        if(current_time >= "11:00:00"){
          //alert("OHH 10");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev8_btn").removeClass("display-block");
          $(".prev8_btn").addClass("display-none");
          $(".prev9_btn").removeClass("display-block");
          $(".prev9_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          
          col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          show_eleventhpg();
        }
      }
      if(c_nine==0 && disp_nine==0 && elec_nine==0 && c_ten!=0 && disp_ten!=0 && elec_ten!=0){
        //if(current_time >= "10:00:00"){
        if(current_time >= "11:00:00"){
          //alert("OHH 10");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev8_btn").removeClass("display-block");
          $(".prev8_btn").addClass("display-none");
          $(".prev9_btn").removeClass("display-block");
          $(".prev9_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          
          col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          //show_eleventhpg();
          show_tenthpg();
        }
      }


      if(c_ten==0 && disp_ten==0 && elec_ten==0 && c_eleven==0 && disp_eleven==0 && elec_eleven==0){
        //if(current_time >= "11:00:00"){
        if(current_time >= "12:00:00"){
          //alert("OHH 11");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev9_btn").removeClass("display-block");
          $(".prev9_btn").addClass("display-none");
          $(".prev10_btn").removeClass("display-block");
          $(".prev10_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          
          col_ten(c_nine,disp_nine,elec_nine,c_ten,disp_ten,elec_ten,current_time);
          show_twelthpg();
        }
      }
      if(c_ten==0 && disp_ten==0 && elec_ten==0 && c_eleven!=0 && disp_eleven!=0 && elec_eleven!=0){
        //if(current_time >= "11:00:00"){
        if(current_time >= "12:00:00"){
          //alert("OHH 11");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev9_btn").removeClass("display-block");
          $(".prev9_btn").addClass("display-none");
          $(".prev10_btn").removeClass("display-block");
          $(".prev10_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          
          col_ten(c_nine,disp_nine,elec_nine,c_ten,disp_ten,elec_ten,current_time);
          //show_twelthpg();
          show_eleventhpg();
        }
      }

      if(c_eleven==0 && disp_eleven==0 && elec_eleven==0 && c_twelve==0 && disp_twelve==0 && elec_twelve==0){
        //if(current_time >= "12:00:00"){
        if(current_time >= "13:00:00"){
          //alert("OHH 12");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev10_btn").removeClass("display-block");
          $(".prev10_btn").addClass("display-none");
          $(".prev11_btn").removeClass("display-block");
          $(".prev11_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          
          col_eleven(c_ten,disp_ten,elec_ten,c_eleven,disp_eleven,elec_eleven,current_time);
          show_thirteenthpg();
        }
      }
      if(c_eleven==0 && disp_eleven==0 && elec_eleven==0 && c_twelve!=0 && disp_twelve!=0 && elec_twelve!=0){
        //if(current_time >= "12:00:00"){
        if(current_time >= "13:00:00"){
          //alert("OHH 12");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev10_btn").removeClass("display-block");
          $(".prev10_btn").addClass("display-none");
          $(".prev11_btn").removeClass("display-block");
          $(".prev11_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          
          col_eleven(c_ten,disp_ten,elec_ten,c_eleven,disp_eleven,elec_eleven,current_time);
          //show_thirteenthpg();
          show_twelthpg();
        }
      }

      if(c_twelve==0 && disp_twelve==0 && elec_twelve==0 && c_thirteen==0 && disp_thirteen==0 && elec_thirteen==0){
        //if(current_time >= "13:00:00"){
        if(current_time >= "14:00:00"){
          //alert("OHH 13");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev11_btn").removeClass("display-block");
          $(".prev11_btn").addClass("display-none");
          $(".prev12_btn").removeClass("display-block");
          $(".prev12_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          
          col_twelve(c_eleven,disp_eleven,elec_eleven,c_twelve,disp_twelve,elec_twelve,current_time);
          show_forteenthpg();
        }
      }
      if(c_twelve==0 && disp_twelve==0 && elec_twelve==0 && c_thirteen!=0 && disp_thirteen!=0 && elec_thirteen!=0){
        //if(current_time >= "13:00:00"){
        if(current_time >= "14:00:00"){
          //alert("OHH 13");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev11_btn").removeClass("display-block");
          $(".prev11_btn").addClass("display-none");
          $(".prev12_btn").removeClass("display-block");
          $(".prev12_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          
          col_twelve(c_eleven,disp_eleven,elec_eleven,c_twelve,disp_twelve,elec_twelve,current_time);
          //show_forteenthpg();
          show_thirteenthpg();
        }
      }

      if(c_thirteen==0 && disp_thirteen==0 && elec_thirteen==0 && c_fourteen==0 && disp_fourteen==0 && elec_fourteen==0){
        //if(current_time >= "14:00:00"){
        if(current_time >= "15:00:00"){
          //alert("OHH 14");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev12_btn").removeClass("display-block");
          $(".prev12_btn").addClass("display-none");
          $(".prev13_btn").removeClass("display-block");
          $(".prev13_btn").addClass("display-none");

          //prev_show_fifteenthpg();
          //prev_show_thirteenthpg();
          
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          col_thirteen(c_twelve,disp_twelve,elec_twelve,c_thirteen,disp_thirteen,elec_thirteen,current_time);
          show_fifteenthpg();
        }
      }
      if(c_thirteen==0 && disp_thirteen==0 && elec_thirteen==0 && c_fourteen!=0 && disp_fourteen!=0 && elec_fourteen!=0){
        //if(current_time >= "14:00:00"){
        if(current_time >= "15:00:00"){
          //alert("OHH 14");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev12_btn").removeClass("display-block");
          $(".prev12_btn").addClass("display-none");
          $(".prev13_btn").removeClass("display-block");
          $(".prev13_btn").addClass("display-none");

          //prev_show_fifteenthpg();
          //prev_show_thirteenthpg();
          
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          col_thirteen(c_twelve,disp_twelve,elec_twelve,c_thirteen,disp_thirteen,elec_thirteen,current_time);
          //show_fifteenthpg();
          show_forteenthpg();
        }
      }

      if(c_fourteen==0 && disp_fourteen==0 && elec_fourteen==0 && c_fifteen==0 && disp_fifteen==0 && elec_fifteen==0){
        //if(current_time >= "15:00:00"){
        if(current_time >= "16:00:00"){
          //alert("OHH 15");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev13_btn").removeClass("display-block");
          $(".prev13_btn").addClass("display-none");
          $(".prev14_btn").removeClass("display-block");
          $(".prev14_btn").addClass("display-none");
          
          
          //prev_show_forteenthpg();
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          col_fourteen(c_thirteen,disp_thirteen,elec_thirteen,c_fourteen,disp_fourteen,elec_fourteen,current_time);
          show_sixteenthpg();
        }
      }

      if(c_fourteen==0 && disp_fourteen==0 && elec_fourteen==0 && c_fifteen!=0 && disp_fifteen!=0 && elec_fifteen!=0){
        //if(current_time >= "15:00:00"){
        if(current_time >= "16:00:00"){
          //alert("OHH 15");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev13_btn").removeClass("display-block");
          $(".prev13_btn").addClass("display-none");
          $(".prev14_btn").removeClass("display-block");
          $(".prev14_btn").addClass("display-none");
          
          
          //prev_show_forteenthpg();
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          col_fourteen(c_thirteen,disp_thirteen,elec_thirteen,c_fourteen,disp_fourteen,elec_fourteen,current_time);
          //show_sixteenthpg();
          show_fifteenthpg();
        }
      }

      if(c_fifteen==0 && disp_fifteen==0 && elec_fifteen==0 && c_sixteen==0 && disp_sixteen==0 && elec_sixteen==0){
        //if(current_time >= "16:00:00"){
        if(current_time >= "17:00:00"){
          //alert("OHH 16");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev14_btn").removeClass("display-block");
          $(".prev14_btn").addClass("display-none");
          $(".prev15_btn").removeClass("display-block");
          $(".prev15_btn").addClass("display-none");
          
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          col_fifteen(c_fourteen,disp_fourteen,elec_fourteen,c_fifteen,disp_fifteen,elec_fifteen,current_time);
          show_seventeenthpg();
        }
      }
      if(c_fifteen==0 && disp_fifteen==0 && elec_fifteen==0 && c_sixteen!=0 && disp_sixteen!=0 && elec_sixteen!=0){
        //if(current_time >= "16:00:00"){
        if(current_time >= "17:00:00"){
          //alert("OHH 16");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev14_btn").removeClass("display-block");
          $(".prev14_btn").addClass("display-none");
          $(".prev15_btn").removeClass("display-block");
          $(".prev15_btn").addClass("display-none");
          
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          col_fifteen(c_fourteen,disp_fourteen,elec_fourteen,c_fifteen,disp_fifteen,elec_fifteen,current_time);
          //show_seventeenthpg();
          show_sixteenthpg();
        }
      }

      if(c_sixteen==0 && disp_sixteen==0 && elec_sixteen==0 && c_seventeen==0 && disp_seventeen==0 && elec_seventeen==0){
        //if(current_time >= "17:00:00"){
        if(current_time >= "18:00:00"){
          //alert("OHH 17");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev15_btn").removeClass("display-block");
          $(".prev15_btn").addClass("display-none");
          $(".prev16_btn").removeClass("display-block");
          $(".prev16_btn").addClass("display-none");
          
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          col_sixteen(c_fifteen,disp_fifteen,elec_fifteen,c_sixteen,disp_sixteen,elec_sixteen,current_time);
          show_eighteenthpg();
        }
      }
      if(c_sixteen==0 && disp_sixteen==0 && elec_sixteen==0 && c_seventeen!=0 && disp_seventeen!=0 && elec_seventeen!=0){
        //if(current_time >= "17:00:00"){
        if(current_time >= "18:00:00"){
          //alert("OHH 17");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev15_btn").removeClass("display-block");
          $(".prev15_btn").addClass("display-none");
          $(".prev16_btn").removeClass("display-block");
          $(".prev16_btn").addClass("display-none");
          
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          col_sixteen(c_fifteen,disp_fifteen,elec_fifteen,c_sixteen,disp_sixteen,elec_sixteen,current_time);
          //show_eighteenthpg();
          show_seventeenthpg();
        }
      }

      if(c_seventeen==0 && disp_seventeen==0 && elec_seventeen==0 && c_eighteen==0 && disp_eightteen==0 && elec_eighteen==0){
        //if(current_time >= "18:00:00"){
        if(current_time >= "19:00:00"){
          //alert("OHH 18");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev16_btn").removeClass("display-block");
          $(".prev16_btn").addClass("display-none");
          $(".prev17_btn").removeClass("display-block");
          $(".prev17_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          col_seventeen(c_sixteen,disp_sixteen,elec_sixteen,c_seventeen,disp_seventeen,elec_seventeen,current_time);
          show_nineteenthpg();

        }
      }
      if(c_seventeen==0 && disp_seventeen==0 && elec_seventeen==0 && c_eighteen!=0 && disp_eightteen!=0 && elec_eighteen!=0){
        //if(current_time >= "18:00:00"){
        if(current_time >= "19:00:00"){
          //alert("OHH 18");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev16_btn").removeClass("display-block");
          $(".prev16_btn").addClass("display-none");
          $(".prev17_btn").removeClass("display-block");
          $(".prev17_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          col_seventeen(c_sixteen,disp_sixteen,elec_sixteen,c_seventeen,disp_seventeen,elec_seventeen,current_time);
          //show_nineteenthpg();
          show_eighteenthpg();
        }
      }
      

      if(c_eighteen==0 && disp_eightteen==0 && elec_eighteen==0 && c_nineteen==0 && disp_nineteen==0 && elec_nineteen==0){
        //if(current_time >= "19:00:00"){
        if(current_time >= "20:00:00"){
          //alert("OHH 19");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev17_btn").removeClass("display-block");
          $(".prev17_btn").addClass("display-none");
          $(".prev18_btn").removeClass("display-block");
          $(".prev18_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          //show_nineteenthpg();
          col_eightteen(c_seventeen,disp_seventeen,elec_seventeen,c_eighteen,disp_eightteen,elec_eighteen,current_time);
          show_twenteenthpg();
        }
      }
      if(c_eighteen==0 && disp_eightteen==0 && elec_eighteen==0 && c_nineteen!=0 && disp_nineteen!=0 && elec_nineteen!=0){
        //if(current_time >= "19:00:00"){
        if(current_time >= "20:00:00"){
          //alert("OHH 19");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev17_btn").removeClass("display-block");
          $(".prev17_btn").addClass("display-none");
          $(".prev18_btn").removeClass("display-block");
          $(".prev18_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          //show_nineteenthpg();
          col_eightteen(c_seventeen,disp_seventeen,elec_seventeen,c_eighteen,disp_eightteen,elec_eighteen,current_time);
          //show_twenteenthpg();
          show_nineteenthpg();
        }
      }


      if(c_nineteen==0 && disp_nineteen==0 && elec_nineteen==0 && c_twenty==0 && disp_twenty==0 && elec_twenty==0){
        //if(current_time >= "20:00:00"){
        if(current_time >= "21:00:00"){
          //alert("OHH 20");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev18_btn").removeClass("display-block");
          $(".prev18_btn").addClass("display-none");
          $(".prev19_btn").removeClass("display-block");
          $(".prev19_btn").addClass("display-none");
          
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          col_nineteen(c_eighteen,disp_eightteen,elec_eighteen,c_nineteen,disp_nineteen,elec_nineteen,current_time);
          show_twentyonepg();
        }
      }
      if(c_nineteen==0 && disp_nineteen==0 && elec_nineteen==0 && c_twenty!=0 && disp_twenty!=0 && elec_twenty!=0){
        //if(current_time >= "20:00:00"){
        if(current_time >= "21:00:00"){
          //alert("OHH 20");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev18_btn").removeClass("display-block");
          $(".prev18_btn").addClass("display-none");
          $(".prev19_btn").removeClass("display-block");
          $(".prev19_btn").addClass("display-none");
          
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          col_nineteen(c_eighteen,disp_eightteen,elec_eighteen,c_nineteen,disp_nineteen,elec_nineteen,current_time);
          //show_twentyonepg();
          show_twenteenthpg();
        }
      }

      if(c_twenty==0 && disp_twenty==0 && elec_twenty==0 && c_twentyone==0 && disp_twentyone==0 && elec_twentyone==0){
        //if(current_time >= "21:00:00"){
        if(current_time >= "22:00:00"){
          //alert("OHH 21");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev19_btn").removeClass("display-block");
          $(".prev19_btn").addClass("display-none");
          $(".prev20_btn").removeClass("display-block");
          $(".prev20_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          //show_twentyonepg();
          col_twenty(c_nineteen,disp_nineteen,elec_nineteen,c_twenty,disp_twenty,elec_twenty,current_time);
          show_twentytwopg();
        }
      }
      if(c_twenty==0 && disp_twenty==0 && elec_twenty==0 && c_twentyone!=0 && disp_twentyone!=0 && elec_twentyone!=0){
        //if(current_time >= "21:00:00"){
        if(current_time >= "22:00:00"){
          //alert("OHH 21");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev19_btn").removeClass("display-block");
          $(".prev19_btn").addClass("display-none");
          $(".prev20_btn").removeClass("display-block");
          $(".prev20_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          //show_twentyonepg();
          col_twenty(c_nineteen,disp_nineteen,elec_nineteen,c_twenty,disp_twenty,elec_twenty,current_time);
          //show_twentytwopg();
          show_twentyonepg();
        }
      }

      if(c_twentyone==0 && disp_twentyone==0 && elec_twentyone==0 && c_twentytwo==0 && disp_twentytwo==0 && elec_twentytwo==0){
        //if(current_time >= "22:00:00"){
        if(current_time >= "23:00:00"){
          //alert("OHH 22");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev20_btn").removeClass("display-block");
          $(".prev20_btn").addClass("display-none");
          $(".prev21_btn").removeClass("display-block");
          $(".prev21_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          
          col_twentyone(c_twenty,disp_twenty,elec_twenty,c_twentyone,disp_twentyone,elec_twentyone,current_time);
          show_twentythreepg();
        }
      }

      if(c_twentyone==0 && disp_twentyone==0 && elec_twentyone==0 && c_twentytwo!=0 && disp_twentytwo!=0 && elec_twentytwo!=0){
        //if(current_time >= "22:00:00"){
        if(current_time >= "23:00:00"){
          //alert("OHH 22");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev20_btn").removeClass("display-block");
          $(".prev20_btn").addClass("display-none");
          $(".prev21_btn").removeClass("display-block");
          $(".prev21_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          //show_twentytwopg();
          col_twentyone(c_twenty,disp_twenty,elec_twenty,c_twentyone,disp_twentyone,elec_twentyone,current_time);
          //show_twentythreepg();
          show_twentytwopg();
        }
      }

      if(c_twentytwo==0 && disp_twentytwo==0 && elec_twentytwo==0 && c_twentythree==0 && disp_twentythree==0 && elec_twentythree==0){
        //if(current_time >= "23:00:00"){
        if(current_time >= "24:00:00"){
          //alert("OHH 23");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev21_btn").removeClass("display-block");
          $(".prev21_btn").addClass("display-none");
          $(".prev22_btn").removeClass("display-block");
          $(".prev22_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          
          col_twentytwo(c_twentyone,disp_twentyone,elec_twentyone,c_twentytwo,disp_twentytwo,elec_twentytwo,current_time);
          show_twentythreepg();
        }
      }
      if(c_twentytwo==0 && disp_twentytwo==0 && elec_twentytwo==0 && c_twentythree!=0 && disp_twentythree!=0 && elec_twentythree!=0){
        //if(current_time >= "23:00:00"){
        if(current_time >= "24:00:00"){
          //alert("OHH 23");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          $(".prev21_btn").removeClass("display-block");
          $(".prev21_btn").addClass("display-none");
          $(".prev22_btn").removeClass("display-block");
          $(".prev22_btn").addClass("display-none");
          //col_nine(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time);
          
          col_twentytwo(c_twentyone,disp_twentyone,elec_twentyone,c_twentytwo,disp_twentytwo,elec_twentytwo,current_time);
          show_twentytwopg();
        }
      }


      // if(c_zero!=0 && disp_zero!=0 && elec_zero!=0){
      //   if(current_time >= "01:00:00"){         
      //     $(".comp_th_one input").attr("readonly",true);
      //     $(".disp_th_one input").attr("readonly",true);
      //     $(".elec_th_one input").attr("readonly",true);
      //     $(".comp_th_one input").addClass("readonlytxtbox");
      //     $(".disp_th_one input").addClass("readonlytxtbox");
      //     $(".elec_th_one input").addClass("readonlytxtbox");
      //     //col_zero(comp_0,disp_0,elec_0,comp_1,disp_1,elec_1,current_time); 
      //   }
      // }
      

      }
    // if(c_one==0 && disp_one==0 && elec_one==0 && c_two!=0 && disp_two!=0 && elec_two!=0){
    //   if(current_time >= "03:00:00"){
    //     //col_one(c_one,disp_one,elec_one,c_two,disp_1,disp_two,current_time); 
    //     //col_zero(comp_0,disp_0,elec_0,comp_1,disp_1,elec_1,current_time); 
    //     col_zero(c_zero,disp_zero,elec_zero,c_one,disp_one,elec_one,current_time); 
    //   }
    // }
    // if(c_two==0 && disp_two==0 && elec_two==0 && c_three!=0 && disp_three!=0 && elec_three!=0){
    //   if(current_time >= "04:00:00"){
    //     alert("jordar");
    //     //col_two(c_two,disp_two,elec_two,c_three,disp_three,disp_three,current_time);
    //     col_one(c_one,disp_one,elec_one,c_two,disp_two,elec_two,current_time);  
    //   }
    // }
    // if(c_three==0 && disp_three==0 && elec_three==0 && c_four!=0 && disp_four!=0 && elec_four!=0){
    //   if(current_time >= "05:00:00"){
    //     alert("jordar ho");
    //     //col_three(c_three,disp_three,elec_three,c_four,disp_four,elec_four,current_time);
    //     col_two(c_two,disp_two,elec_two,c_three,disp_three,elec_three,current_time);  
    //   }
    // }
    // if(c_four==0 && disp_four==0 && elec_four==0 && c_five!=0 && disp_five!=0 && elec_five!=0){
    //   if(current_time >= "06:00:00"){
    //     alert("jordar 6");
    //     //col_four(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time); 
    //     col_three(c_three,disp_three,elec_three,c_four,disp_four,elec_four,current_time); 
    //   }
    // }
    // if(c_five==0 && disp_five==0 && elec_five==0 && c_six!=0 && disp_six!=0 && elec_six!=0){
    //   if(current_time >= "07:00:00"){
    //     alert("jordar 7");
    //     //col_five(c_five,disp_five,elec_five,c_six,disp_six,elec_six,current_time); 
    //     col_four(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time); 
    //   }
    // }
    // if(c_six==0 && disp_six==0 && elec_six==0 && c_seven!=0 && disp_seven!=0 && elec_seven!=0){
    //   if(current_time >= "08:00:00"){
    //     alert("jordar 8");
    //     //col_six(c_six,disp_six,elec_six,c_seven,disp_seven,elec_seven,current_time); 
    //     col_five(c_five,disp_five,elec_five,c_six,disp_six,elec_six,current_time);
    //   }
    // }
    // if(c_seven==0 && disp_seven==0 && elec_seven==0 && c_eight!=0 && disp_eight!=0 && elec_eight!=0){
    //   if(current_time >= "09:00:00"){
    //     alert("jordar 9");
    //     col_six(c_six,disp_six,elec_six,c_seven,disp_seven,elec_seven,current_time); 
    //     //col_seven(c_seven,disp_seven,elec_seven,c_eight,disp_eight,elec_eight,current_time); 
    //   }
    // }
    // if(c_eight==0 && disp_eight==0 && elec_eight==0 && c_nine!=0 && disp_nine!=0 && elec_nine!=0){
    //   if(current_time >= "10:00:00"){
    //     alert("jordar 10");
    //     col_seven(c_seven,disp_seven,elec_seven,c_eight,disp_eight,elec_eight,current_time); 
    //     //col_eight(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time); 
    //   }
    // }
    // if(c_nine==0 && disp_nine==0 && elec_nine==0 && c_ten!=0 && disp_ten!=0 && elec_ten!=0){
    //   if(current_time >= "11:00:00"){
    //     alert("jordar 11");
    //     col_eight(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time); 
    //     //col_eight(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time); 
    //   }
    // }
    // if(c_ten==0 && disp_ten==0 && elec_ten==0 && c_eleven!=0 && disp_eleven!=0 && elec_eleven!=0){
    //   if(current_time >= "12:00:00"){
    //     alert("jordar 12");
    //     col_nine(c_seven,disp_seven,elec_seven,c_eight,disp_eight,elec_eight,current_time); 
    //     //col_eight(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time); 
    //   }
    // }










    // if(c_zero ==0  && disp_zero == 0 && elec_zero==0 && c_one==0 && disp_one==0 && elec_one==0){
    //   //alert("CHOCO PIE");
    //   col_zero(c_zero,disp_zero,elec_zero,c_one,disp_one,elec_one,current_time); 
    // }
    // if(comp_1==0 && disp_1==0 && elec_1==0){
    //   if(current_time >= "01:00:00"){
    //     $(".comp_th_one input").attr("readonly",false);
    //     $(".disp_th_one input").attr("readonly",false);
    //     $(".elec_th_one input").attr("readonly",false);
    //     $(".comp_th_one input").removeClass("readonlytxtbox");
    //     $(".disp_th_one input").removeClass("readonlytxtbox");
    //     $(".elec_th_one input").removeClass("readonlytxtbox");
    //   }
    // }
    /*if(comp_1!=0 && disp_1!=0 && elec_1!=0){
      //alert("BIG");
      if(current_time >= "02:00:00"){
        //alert("HA HA HA");
        //alert(g1+"-------------"+g2);
        $(".comp_th_one input").attr("readonly",false);
        $(".disp_th_one input").attr("readonly",false);
        $(".elec_th_one input").attr("readonly",false);
        $(".comp_th_one input").removeClass("readonlytxtbox");
        $(".disp_th_one input").removeClass("readonlytxtbox");
        $(".elec_th_one input").removeClass("readonlytxtbox");
        $(".page1_btn").removeClass("display-none");
        $(".page1_btn").addClass("display-block");
      }
    }*/
  }
}
  //col_one(c_one,disp_one,elec_one,c_two,disp_two,elec_two,current_time);

function col_zero(c_zero,disp_zero,elec_zero,c_one,disp_one,elec_one,current_time){
  //console.log("CALLED col_zero");
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);
  
  //alert("CALLED "+st_id);
  if(c_zero==0 && disp_zero==0 && elec_zero==0){
    // $("#hidd_comp_0").val(0);
    // $("#hidd_disp_0").val(0);
    // $("#hidd_elec_0").val(0);
    //$(".svbtn").addClass("display-none");
    
    //alert("ST ID:: "+station_id);
    /* $(".val_comp_1").attr("readonly",false);
    $(".val_comp_1").removeClass("readonlytxtbox");
    $(".lcv3_mfm_1").attr("readonly",false);
    $(".lcv3_mfm_1").removeClass("readonlytxtbox");
    $(".lcv4_mfm_1").attr("readonly",false);
    $(".lcv4_mfm_1").removeClass("readonlytxtbox");
    $(".lcv5_mfm_1").attr("readonly",false);
    $(".lcv5_mfm_1").removeClass("readonlytxtbox");

    $(".val_disp_1_1").attr("readonly",false);
    $(".val_disp_1_1").removeClass("readonlytxtbox");
    $(".val_disp_2_1").attr("readonly",false);
    $(".val_disp_2_1").removeClass("readonlytxtbox");
    $(".val_disp_3_1").attr("readonly",false);
    $(".val_disp_3_1").removeClass("readonlytxtbox");
    $(".val_disp_4_1").attr("readonly",false);
    $(".val_disp_4_1").removeClass("readonlytxtbox"); */


    var st_id = $("#hidd_stid").val();
    var dispanser_count = $("#hidd_dispcnt").val();
    var lcv_count = $("#hidd_lcvcnt").val();
    if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
        $(".val_comp_1").attr("readonly",false);
        $(".val_comp_1").removeClass("readonlytxtbox");
        $(".lcv"+l+"_mfm_1").attr("readonly",false);
        $(".lcv"+l+"_mfm_1").removeClass("readonlytxtbox");
      }
      for(var i=1;i<=dispanser_count;i++){
        $(".val_disp_"+i+"_1").attr("readonly",false);
        $(".val_disp_"+i+"_1").removeClass("readonlytxtbox");
        $(".disp_"+i+"_a_1").attr("readonly",false);
        $(".disp_"+i+"_a_1").removeClass("readonlytxtbox");
        $(".disp_"+i+"_b_1").attr("readonly",false);
        $(".disp_"+i+"_b_1").removeClass("readonlytxtbox");          
      }
      /* $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_1").attr("readonly",false);
          $(".val_comp_1").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_1").attr("readonly",false);
          $(".lcv"+l+"_mfm_1").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_1").attr("readonly",false);
            $(".val_disp_"+i+"_1").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_1").attr("readonly",false);
            $(".disp_"+i+"_a_1").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_1").attr("readonly",false);
            $(".disp_"+i+"_b_1").removeClass("readonlytxtbox");          
          }
        }
      });  */
    } 

    /*$(".val_disp_"+i+"_1").attr("readonly",false);
          $(".val_disp_"+i+"_1").removeClass("readonlytxtbox");
          $(".val_disp_"+i+"_1").attr("readonly",false);
          $(".val_disp_"+i+"_1").removeClass("readonlytxtbox");
          $(".val_disp_"+i+"_1").attr("readonly",false);
          $(".val_disp_"+i+"_1").removeClass("readonlytxtbox");
          $(".val_disp_"+i+"_1").attr("readonly",false);
          $(".val_disp_"+i+"_1").removeClass("readonlytxtbox");*/


    /* */

    /*for(var dr=1;dr<=2;dr++){
      if(dr==1){
        $(".val_disp_"+dr+"_1").attr("readonly",false);
        $(".val_disp_"+dr+"_1").removeClass("readonlytxtbox");
      }
      $(".disp_"+dr+"_a_1").attr("readonly",false);
      $(".disp_"+dr+"_a_1").removeClass("readonlytxtbox");
      $(".disp_"+dr+"_b_1").attr("readonly",false);
      $(".disp_"+dr+"_b_1").removeClass("readonlytxtbox");
      /*$(".disp_2_a_1").attr("readonly",false);
      $(".disp_2_a_1").removeClass("readonlytxtbox");
      $(".disp_2_b_1").attr("readonly",false);
      $(".disp_2_b_1").removeClass("readonlytxtbox");*/
    //}

    /*$(".val_disp_1_1").attr("readonly",false);
    $(".val_disp_1_1").removeClass("readonlytxtbox");
    $(".disp_2_a_1").attr("readonly",false);
    $(".disp_2_a_1").removeClass("readonlytxtbox");
    $(".disp_2_b_1").attr("readonly",false);
    $(".disp_2_b_1").removeClass("readonlytxtbox");*/

    $(".val_elec_1").attr("readonly",false);
    $(".val_elec_1").removeClass("readonlytxtbox");


  }else{
    //$(".svbtn").removeClass("display-none");
    //$(".svbtn").addClass("display-block");
  }

  

  if((c_zero==0 && c_one==0) && (disp_zero==0 && disp_one==0) && (elec_zero==0 && elec_one==0)){
//    if(current_time >= "02:00:00"){ // cmnt on 30-4-2020 //
    if(current_time >= "03:00:00"){ // new on 30-4-2020 //
    //if(current_time >= "01:00:00"){
      //alert(":)");
      $(".page1_btn").removeClass("display-none");
      $(".page1_btn").addClass("display-block");
    }
    if(g1 < g2){
      $(".comp_th_one input").attr("readonly",true);
      $(".disp_th_one input").attr("readonly",true);
      $(".elec_th_one input").attr("readonly",true);
      $(".comp_th_one input").addClass("readonlytxtbox");
      $(".disp_th_one input").addClass("readonlytxtbox");
      $(".elec_th_one input").addClass("readonlytxtbox");
    }
  }
  if(g1 < g2){
    $(".comp_th_one input").attr("readonly",true);
    $(".disp_th_one input").attr("readonly",true);
    $(".elec_th_one input").attr("readonly",true);
    $(".comp_th_one input").addClass("readonlytxtbox");
    $(".disp_th_one input").addClass("readonlytxtbox");
    $(".elec_th_one input").addClass("readonlytxtbox");
  }
  //alert(c_two+"==============c_two");
  /*else{
    alert("ELSE");
  }*/
}
function col_one(c_one,disp_one,elec_one,c_two,disp_two,elec_two,current_time){
  console.log("ONE COL"+c_one+"---disp_one"+disp_one+"___elec_one"+elec_one+" c_two"+c_two+"----disp_two disp_two"+disp_two+"***** elec_two"+elec_two);
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(c_one==0 && disp_one==0 && elec_one==0){
    // $("#hidd_comp_1").val(0);
    // $("#hidd_disp_1").val(0);
    // $("#hidd_elec_1").val(0);
//    if(current_time >= "02:00:00"){
    if(current_time >= "03:00:00"){
      /*$(".val_comp_2").attr("readonly",false);
      $(".val_comp_2").removeClass("readonlytxtbox");
      $(".lcv3_mfm_2").attr("readonly",false);
      $(".lcv3_mfm_2").removeClass("readonlytxtbox");
      $(".lcv4_mfm_2").attr("readonly",false);
      $(".lcv4_mfm_2").removeClass("readonlytxtbox");
      $(".lcv5_mfm_2").attr("readonly",false);
      $(".lcv5_mfm_2").removeClass("readonlytxtbox");

      $(".val_disp_1_2").attr("readonly",false);
      $(".val_disp_1_2").removeClass("readonlytxtbox");
      $(".disp_2_a_2").attr("readonly",false);
      $(".disp_2_a_2").removeClass("readonlytxtbox");
      $(".disp_2_b_2").attr("readonly",false);
      $(".disp_2_b_2").removeClass("readonlytxtbox");*/
      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_2").attr("readonly",false);
          $(".val_comp_2").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_2").attr("readonly",false);
          $(".lcv"+l+"_mfm_2").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_2").attr("readonly",false);
          $(".val_disp_"+i+"_2").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_2").attr("readonly",false);
          $(".disp_"+i+"_a_2").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_2").attr("readonly",false);
          $(".disp_"+i+"_b_2").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_2").attr("readonly",false);
          $(".val_comp_2").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_2").attr("readonly",false);
          $(".lcv"+l+"_mfm_2").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_2").attr("readonly",false);
            $(".val_disp_"+i+"_2").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_2").attr("readonly",false);
            $(".disp_"+i+"_a_2").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_2").attr("readonly",false);
            $(".disp_"+i+"_b_2").removeClass("readonlytxtbox");          
          }
        }
      }); 
    } */

      $(".val_elec_2").attr("readonly",false);
      $(".val_elec_2").removeClass("readonlytxtbox");
    }
  }

  

  if((c_one==0 && c_two==0) && (disp_one==0 && disp_two==0) && (elec_one==0 && elec_two==0)){
//    if(current_time >= "02:00:00"){
      if(current_time >= "03:00:00"){
      //alert("current_time >= 02:00:00");
      //$(".prev1_btn").removeClass("display-block");
      //$(".prev1_btn").addClass("display-none");
      //$(".page1_btn").removeClass("display-block");
      //$(".page1_btn").addClass("display-none");
      //$(".prev2_btn").removeClass("display-none");
      //$(".prev2_btn").addClass("display-block");
      $(".page2_btn").removeClass("display-none");
      $(".page2_btn").addClass("display-block");
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");

      $(".prev2_btn").removeClass("display-block");
      $(".prev2_btn").addClass("display-none");
      $(".prev1_btn").removeClass("display-none");
      $(".prev1_btn").addClass("display-block");
    }
    //if(current_time >= "01:00:00"){
    if(g1 < g2){
      //alert("OKAY");
      $(".page2_btn").removeClass("display-none");
      $(".page2_btn").addClass("display-block");

      $(".comp_th_two input").attr("readonly",true);
      $(".disp_th_two input").attr("readonly",true);
      $(".elec_th_two input").attr("readonly",true);
      $(".comp_th_two input").addClass("readonlytxtbox");
      $(".disp_th_two input").addClass("readonlytxtbox");
      $(".elec_th_two input").addClass("readonlytxtbox");
    }     
    //}
  }
  /*if((c_one==0 && c_two!=0) || (disp_one==0 && disp_two!=0) || (elec_one==0 && elec_two!=0)){
//    if(current_time >= "02:00:00"){
      if(current_time >= "03:00:00"){
      $(".comp_th_one").removeClass("tbl-cell");
      $(".comp_th_one").addClass("display-none");
      $(".disp_th_one").removeClass("tbl-cell");
      $(".disp_th_one").addClass("display-none");
      $(".elec_th_one").removeClass("tbl-cell");
      $(".elec_th_one").addClass("display-none");

      $(".page2_btn").removeClass("display-none");
      $(".page2_btn").addClass("display-block");
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");

      $(".prev2_btn").removeClass("display-block");
      $(".prev2_btn").addClass("display-none");
      $(".prev1_btn").removeClass("display-none");
      $(".prev1_btn").addClass("display-block");
    }
    //if(current_time >= "01:00:00"){
    if(g1 < g2){
      //alert("OKAY");
      $(".page2_btn").removeClass("display-none");
      $(".page2_btn").addClass("display-block");

      $(".comp_th_two input").attr("readonly",true);
      $(".disp_th_two input").attr("readonly",true);
      $(".elec_th_two input").attr("readonly",true);
      $(".comp_th_two input").addClass("readonlytxtbox");
      $(".disp_th_two input").addClass("readonlytxtbox");
      $(".elec_th_two input").addClass("readonlytxtbox");
    }     
    //}
  }*/
  /*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    //alert("OKAY");
    $(".page2_btn").removeClass("display-none");
    $(".page2_btn").addClass("display-block");

    $(".comp_th_two input").attr("readonly",true);
    $(".disp_th_two input").attr("readonly",true);
    $(".elec_th_two input").attr("readonly",true);
    $(".comp_th_two input").addClass("readonlytxtbox");
    $(".disp_th_two input").addClass("readonlytxtbox");
    $(".elec_th_two input").addClass("readonlytxtbox");
  }
}
function col_two(c_two,disp_two,elec_two,c_three,disp_three,elec_three,current_time){
  console.log("TWO COL"+c_two+"---disp_two"+disp_two+"-------elec_two"+elec_two+" c_three"+c_three+"----disp_three "+disp_three+"***** elec_three"+elec_three);
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(c_two==0 && disp_two==0 && elec_two==0){
//    if(current_time >= "03:00:00"){
      if(current_time >= "04:00:00"){
      /*$(".val_comp_3").attr("readonly",false);
      $(".val_comp_3").removeClass("readonlytxtbox");
      $(".lcv3_mfm_3").attr("readonly",false);
      $(".lcv3_mfm_3").removeClass("readonlytxtbox");
      $(".lcv4_mfm_3").attr("readonly",false);
      $(".lcv4_mfm_3").removeClass("readonlytxtbox");
      $(".lcv5_mfm_3").attr("readonly",false);
      $(".lcv5_mfm_3").removeClass("readonlytxtbox");

      $(".val_disp_1_3").attr("readonly",false);
      $(".val_disp_1_3").removeClass("readonlytxtbox");
      $(".disp_2_a_3").attr("readonly",false);
      $(".disp_2_a_3").removeClass("readonlytxtbox");
      $(".disp_2_b_3").attr("readonly",false);
      $(".disp_2_b_3").removeClass("readonlytxtbox");*/
      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_3").attr("readonly",false);
          $(".val_comp_3").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_3").attr("readonly",false);
          $(".lcv"+l+"_mfm_3").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_3").attr("readonly",false);
          $(".val_disp_"+i+"_3").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_3").attr("readonly",false);
          $(".disp_"+i+"_a_3").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_3").attr("readonly",false);
          $(".disp_"+i+"_b_3").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_3").attr("readonly",false);
          $(".val_comp_3").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_3").attr("readonly",false);
          $(".lcv"+l+"_mfm_3").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_3").attr("readonly",false);
            $(".val_disp_"+i+"_3").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_3").attr("readonly",false);
            $(".disp_"+i+"_a_3").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_3").attr("readonly",false);
            $(".disp_"+i+"_b_3").removeClass("readonlytxtbox");          
          }
        }
      }); 
    } */

      $(".val_elec_3").attr("readonly",false);
      $(".val_elec_3").removeClass("readonlytxtbox");
    }
  }
  if((c_two==0 && c_three==0) && (disp_two==0 && disp_three==0) && (elec_two==0 && elec_three==0)){
//    if(current_time >= "03:00:00"){
  if(current_time >= "04:00:00"){
      //alert("current_time >= 03:00:00");
      //$(".prev1_btn").removeClass("display-block");
      //$(".prev1_btn").addClass("display-none");
      //$(".page1_btn").removeClass("display-block");
      //$(".page1_btn").addClass("display-none");
      //$(".prev2_btn").removeClass("display-none");
      //$(".prev2_btn").addClass("display-block");
      $(".page3_btn").removeClass("display-none");
      $(".page3_btn").addClass("display-block");
      $(".page2_btn").removeClass("display-block");
      $(".page2_btn").addClass("display-none");

      $(".prev3_btn").removeClass("display-block");
      $(".prev3_btn").addClass("display-none");
      $(".prev2_btn").removeClass("display-none");
      $(".prev2_btn").addClass("display-block");
    }
    //if(current_time >= "02:00:00"){
    if(g1 < g2){
      $(".page3_btn").removeClass("display-none");
      $(".page3_btn").addClass("display-block");

      $(".comp_th_three input").attr("readonly",true);
      $(".disp_th_three input").attr("readonly",true);
      $(".elec_th_three input").attr("readonly",true);
      $(".comp_th_three input").addClass("readonlytxtbox");
      $(".disp_th_three input").addClass("readonlytxtbox");
      $(".elec_th_three input").addClass("readonlytxtbox");
    }
    //}
  }
  /*if((c_two==0 && c_three!=0) || (disp_two==0 && disp_three!=0) || (elec_two==0 && elec_three!=0)){
//    if(current_time >= "03:00:00"){
  if(current_time >= "04:00:00"){
      //alert("current_time >= 03:00:00");
      //$(".prev1_btn").removeClass("display-block");
      //$(".prev1_btn").addClass("display-none");
      //$(".page1_btn").removeClass("display-block");
      //$(".page1_btn").addClass("display-none");
      //$(".prev2_btn").removeClass("display-none");
      //$(".prev2_btn").addClass("display-block");

      $(".comp_th_two").removeClass("tbl-cell");
      $(".comp_th_two").addClass("display-none");
      $(".disp_th_two").removeClass("tbl-cell");
      $(".disp_th_two").addClass("display-none");
      $(".elec_th_two").removeClass("tbl-cell");
      $(".elec_th_two").addClass("display-none");

      $(".page3_btn").removeClass("display-none");
      $(".page3_btn").addClass("display-block");
      $(".page2_btn").removeClass("display-block");
      $(".page2_btn").addClass("display-none");

      $(".prev3_btn").removeClass("display-block");
      $(".prev3_btn").addClass("display-none");
      $(".prev2_btn").removeClass("display-none");
      $(".prev2_btn").addClass("display-block");
    }
    //if(current_time >= "02:00:00"){
    if(g1 < g2){
      $(".page3_btn").removeClass("display-none");
      $(".page3_btn").addClass("display-block");

      $(".comp_th_three input").attr("readonly",true);
      $(".disp_th_three input").attr("readonly",true);
      $(".elec_th_three input").attr("readonly",true);
      $(".comp_th_three input").addClass("readonlytxtbox");
      $(".disp_th_three input").addClass("readonlytxtbox");
      $(".elec_th_three input").addClass("readonlytxtbox");
    }
    //}
  }*/
  /*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    $(".page3_btn").removeClass("display-none");
    $(".page3_btn").addClass("display-block");

    $(".comp_th_three input").attr("readonly",true);
    $(".disp_th_three input").attr("readonly",true);
    $(".elec_th_three input").attr("readonly",true);
    $(".comp_th_three input").addClass("readonlytxtbox");
    $(".disp_th_three input").addClass("readonlytxtbox");
    $(".elec_th_three input").addClass("readonlytxtbox");
  }
}
function col_three(c_three,disp_three,elec_three,c_four,disp_four,elec_four,current_time){
  console.log("THREE COL"+c_three+"---disp_three"+disp_three+"-------elec_three"+elec_three+" c_four"+c_four+"----disp_four "+disp_four+"***** elec_four"+elec_four);
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);
  if(c_three==0 && disp_three==0 && elec_three==0){
 //   if(current_time >= "04:00:00"){
if(current_time >= "05:00:00"){
      /*$(".val_comp_4").attr("readonly",false);
      $(".val_comp_4").removeClass("readonlytxtbox");
      $(".lcv3_mfm_4").attr("readonly",false);
      $(".lcv3_mfm_4").removeClass("readonlytxtbox");
      $(".lcv4_mfm_4").attr("readonly",false);
      $(".lcv4_mfm_4").removeClass("readonlytxtbox");
      $(".lcv5_mfm_4").attr("readonly",false);
      $(".lcv5_mfm_4").removeClass("readonlytxtbox");

      $(".val_disp_1_4").attr("readonly",false);
      $(".val_disp_1_4").removeClass("readonlytxtbox");
      $(".disp_2_a_4").attr("readonly",false);
      $(".disp_2_a_4").removeClass("readonlytxtbox");
      $(".disp_2_b_4").attr("readonly",false);
      $(".disp_2_b_4").removeClass("readonlytxtbox");*/
      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_4").attr("readonly",false);
          $(".val_comp_4").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_4").attr("readonly",false);
          $(".lcv"+l+"_mfm_4").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_4").attr("readonly",false);
          $(".val_disp_"+i+"_4").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_4").attr("readonly",false);
          $(".disp_"+i+"_a_4").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_4").attr("readonly",false);
          $(".disp_"+i+"_b_4").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_4").attr("readonly",false);
          $(".val_comp_4").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_4").attr("readonly",false);
          $(".lcv"+l+"_mfm_4").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_4").attr("readonly",false);
            $(".val_disp_"+i+"_4").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_4").attr("readonly",false);
            $(".disp_"+i+"_a_4").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_4").attr("readonly",false);
            $(".disp_"+i+"_b_4").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/
      $(".val_elec_4").attr("readonly",false);
      $(".val_elec_4").removeClass("readonlytxtbox");
    }
  }
  if((c_three==0 && c_four==0) && (disp_three==0 && disp_four==0) && (elec_three==0 && elec_four==0)){
//    if(current_time >= "04:00:00"){
if(current_time >= "05:00:00"){
      //alert("current_time >= 04:00:00");
      $(".page4_btn").removeClass("display-none");
      $(".page4_btn").addClass("display-block");
      $(".page3_btn").removeClass("display-block");
      $(".page3_btn").addClass("display-none");

      $(".prev4_btn").removeClass("display-block");
      $(".prev4_btn").addClass("display-none");
      $(".prev3_btn").removeClass("display-none");
      $(".prev3_btn").addClass("display-block");
    }
    //if(current_time >= "03:00:00"){
    if(g1 < g2){
      $(".page4_btn").removeClass("display-none");
      $(".page4_btn").addClass("display-block");

      $(".comp_th_four input").attr("readonly",true);
      $(".disp_th_four input").attr("readonly",true);
      $(".elec_th_four input").attr("readonly",true);
      $(".comp_th_four input").addClass("readonlytxtbox");
      $(".disp_th_four input").addClass("readonlytxtbox");
      $(".elec_th_four input").addClass("readonlytxtbox");
    }
    //}
  }
  /*if((c_three==0 && c_four!=0) || (disp_three==0 && disp_four!=0) || (elec_three==0 && elec_four!=0)){
//    if(current_time >= "04:00:00"){
if(current_time >= "05:00:00"){
      //alert("current_time >= 04:00:00");
      $(".comp_th_three").removeClass("tbl-cell");
      $(".comp_th_three").addClass("display-none");
      $(".disp_th_three").removeClass("tbl-cell");
      $(".disp_th_three").addClass("display-none");
      $(".elec_th_three").removeClass("tbl-cell");
      $(".elec_th_three").addClass("display-none");

      $(".page4_btn").removeClass("display-none");
      $(".page4_btn").addClass("display-block");
      $(".page3_btn").removeClass("display-block");
      $(".page3_btn").addClass("display-none");

      $(".prev4_btn").removeClass("display-block");
      $(".prev4_btn").addClass("display-none");
      $(".prev3_btn").removeClass("display-none");
      $(".prev3_btn").addClass("display-block");
    }
    //if(current_time >= "03:00:00"){
    if(g1 < g2){
      $(".page4_btn").removeClass("display-none");
      $(".page4_btn").addClass("display-block");

      $(".comp_th_four input").attr("readonly",true);
      $(".disp_th_four input").attr("readonly",true);
      $(".elec_th_four input").attr("readonly",true);
      $(".comp_th_four input").addClass("readonlytxtbox");
      $(".disp_th_four input").addClass("readonlytxtbox");
      $(".elec_th_four input").addClass("readonlytxtbox");
    }
    //}
  }*/
  /*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    $(".page4_btn").removeClass("display-none");
    $(".page4_btn").addClass("display-block");

    $(".comp_th_four input").attr("readonly",true);
    $(".disp_th_four input").attr("readonly",true);
    $(".elec_th_four input").attr("readonly",true);
    $(".comp_th_four input").addClass("readonlytxtbox");
    $(".disp_th_four input").addClass("readonlytxtbox");
    $(".elec_th_four input").addClass("readonlytxtbox");
  }
}
function col_four(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time){
  console.log("FOUR COL"+c_four+"---disp_four"+disp_four+"-------elec_four"+elec_four+" c_five"+c_five+"----disp_five "+disp_five+"***** elec_five"+elec_five);
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(c_four==0 && disp_four==0 && elec_four==0){
//    if(current_time >= "05:00:00"){
if(current_time >= "06:00:00"){
      /*$(".val_comp_5").attr("readonly",false);
      $(".val_comp_5").removeClass("readonlytxtbox");
      $(".lcv3_mfm_5").attr("readonly",false);
      $(".lcv3_mfm_5").removeClass("readonlytxtbox");
      $(".lcv4_mfm_5").attr("readonly",false);
      $(".lcv4_mfm_5").removeClass("readonlytxtbox");
      $(".lcv5_mfm_5").attr("readonly",false);
      $(".lcv5_mfm_5").removeClass("readonlytxtbox");

      $(".val_disp_1_5").attr("readonly",false);
      $(".val_disp_1_5").removeClass("readonlytxtbox");
      $(".disp_2_a_5").attr("readonly",false);
      $(".disp_2_a_5").removeClass("readonlytxtbox");
      $(".disp_2_b_5").attr("readonly",false);
      $(".disp_2_b_5").removeClass("readonlytxtbox");*/

      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_5").attr("readonly",false);
          $(".val_comp_5").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_5").attr("readonly",false);
          $(".lcv"+l+"_mfm_5").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_5").attr("readonly",false);
          $(".val_disp_"+i+"_5").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_5").attr("readonly",false);
          $(".disp_"+i+"_a_5").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_5").attr("readonly",false);
          $(".disp_"+i+"_b_5").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_5").attr("readonly",false);
          $(".val_comp_5").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_5").attr("readonly",false);
          $(".lcv"+l+"_mfm_5").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_5").attr("readonly",false);
            $(".val_disp_"+i+"_5").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_5").attr("readonly",false);
            $(".disp_"+i+"_a_5").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_5").attr("readonly",false);
            $(".disp_"+i+"_b_5").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/
      $(".val_elec_5").attr("readonly",false);
      $(".val_elec_5").removeClass("readonlytxtbox");
    }
  }
  if((c_four==0 && c_five==0) && (disp_four==0 && disp_five==0) && (elec_four==0 && elec_five==0)){
//    if(current_time >= "05:00:00"){
if(current_time >= "06:00:00"){
      //alert("current_time >= 05:00:00");
      $(".page5_btn").removeClass("display-none");
      $(".page5_btn").addClass("display-block");
      $(".page4_btn").removeClass("display-block");
      $(".page4_btn").addClass("display-none");

      $(".prev5_btn").removeClass("display-block");
      $(".prev5_btn").addClass("display-none");
      $(".prev4_btn").removeClass("display-none");
      $(".prev4_btn").addClass("display-block");
    }
    //if(current_time >= "04:00:00"){
      if(g1 < g2){
        $(".page5_btn").removeClass("display-none");
        $(".page5_btn").addClass("display-block");

        $(".comp_th_five input").attr("readonly",true);
        $(".disp_th_five input").attr("readonly",true);
        $(".elec_th_five input").attr("readonly",true);
        $(".comp_th_five input").addClass("readonlytxtbox");
        $(".disp_th_five input").addClass("readonlytxtbox");
        $(".elec_th_five input").addClass("readonlytxtbox");
      }
    //}
  }
  /*if((c_four==0 && c_five!=0) || (disp_four==0 && disp_five!=0) || (elec_four==0 && elec_five!=0)){
//    if(current_time >= "05:00:00"){
if(current_time >= "06:00:00"){
      //alert("current_time >= 05:00:00");
      $(".comp_th_four").removeClass("tbl-cell");
      $(".comp_th_four").addClass("display-none");
      $(".disp_th_four").removeClass("tbl-cell");
      $(".disp_th_four").addClass("display-none");
      $(".elec_th_four").removeClass("tbl-cell");
      $(".elec_th_four").addClass("display-none");

      $(".page5_btn").removeClass("display-none");
      $(".page5_btn").addClass("display-block");
      $(".page4_btn").removeClass("display-block");
      $(".page4_btn").addClass("display-none");

      $(".prev5_btn").removeClass("display-block");
      $(".prev5_btn").addClass("display-none");
      $(".prev4_btn").removeClass("display-none");
      $(".prev4_btn").addClass("display-block");
    }
    //if(current_time >= "04:00:00"){
      if(g1 < g2){
        $(".page5_btn").removeClass("display-none");
        $(".page5_btn").addClass("display-block");

        $(".comp_th_five input").attr("readonly",true);
        $(".disp_th_five input").attr("readonly",true);
        $(".elec_th_five input").attr("readonly",true);
        $(".comp_th_five input").addClass("readonlytxtbox");
        $(".disp_th_five input").addClass("readonlytxtbox");
        $(".elec_th_five input").addClass("readonlytxtbox");
      }
    //}
  }*/
  /*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    $(".page5_btn").removeClass("display-none");
    $(".page5_btn").addClass("display-block");

    $(".comp_th_five input").attr("readonly",true);
    $(".disp_th_five input").attr("readonly",true);
    $(".elec_th_five input").attr("readonly",true);
    $(".comp_th_five input").addClass("readonlytxtbox");
    $(".disp_th_five input").addClass("readonlytxtbox");
    $(".elec_th_five input").addClass("readonlytxtbox");
  }
}
function col_five(c_five,disp_five,elec_five,c_six,disp_six,elec_six,current_time){
  console.log("FIVE COL"+c_five+"---disp_five"+disp_five+"-------elec_five"+elec_five+" c_six"+c_six+"----disp_six "+disp_six+"***** elec_six"+elec_six);  

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);
  if(c_five==0 && disp_five==0 && elec_five==0){
//    if(current_time >= "06:00:00"){
if(current_time >= "07:00:00"){
      /*$(".val_comp_6").attr("readonly",false);
      $(".val_comp_6").removeClass("readonlytxtbox");
      $(".lcv3_mfm_6").attr("readonly",false);
      $(".lcv3_mfm_6").removeClass("readonlytxtbox");
      $(".lcv4_mfm_6").attr("readonly",false);
      $(".lcv4_mfm_6").removeClass("readonlytxtbox");
      $(".lcv5_mfm_6").attr("readonly",false);
      $(".lcv5_mfm_6").removeClass("readonlytxtbox");

      $(".val_disp_1_6").attr("readonly",false);
      $(".val_disp_1_6").removeClass("readonlytxtbox");
      $(".disp_2_a_6").attr("readonly",false);
      $(".disp_2_a_6").removeClass("readonlytxtbox");
      $(".disp_2_b_6").attr("readonly",false);
      $(".disp_2_b_6").removeClass("readonlytxtbox");*/

      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_6").attr("readonly",false);
          $(".val_comp_6").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_6").attr("readonly",false);
          $(".lcv"+l+"_mfm_6").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_6").attr("readonly",false);
          $(".val_disp_"+i+"_6").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_6").attr("readonly",false);
          $(".disp_"+i+"_a_6").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_6").attr("readonly",false);
          $(".disp_"+i+"_b_6").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_6").attr("readonly",false);
          $(".val_comp_6").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_6").attr("readonly",false);
          $(".lcv"+l+"_mfm_6").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_6").attr("readonly",false);
            $(".val_disp_"+i+"_6").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_6").attr("readonly",false);
            $(".disp_"+i+"_a_6").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_6").attr("readonly",false);
            $(".disp_"+i+"_b_6").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/

      $(".val_elec_6").attr("readonly",false);
      $(".val_elec_6").removeClass("readonlytxtbox");
    }
  }

  if((c_five==0 && c_six==0) && (disp_five==0 && disp_six==0) && (elec_five==0 && elec_six==0)){
//    if(current_time >= "06:00:00"){
    if(current_time >= "07:00:00"){
      //alert("current_time >= 06:00:00");
      $(".page6_btn").removeClass("display-none");
      $(".page6_btn").addClass("display-block");
      $(".page5_btn").removeClass("display-block");
      $(".page5_btn").addClass("display-none");

      $(".prev6_btn").removeClass("display-block");
      $(".prev6_btn").addClass("display-none");
      $(".prev5_btn").removeClass("display-none");
      $(".prev5_btn").addClass("display-block");
    }
    //if(current_time >= "05:00:00"){
      if(g1 < g2){
        $(".page6_btn").removeClass("display-none");
        $(".page6_btn").addClass("display-block");

        $(".comp_th_six input").attr("readonly",true);
        $(".disp_th_six input").attr("readonly",true);
        $(".elec_th_six input").attr("readonly",true);
        $(".comp_th_six input").addClass("readonlytxtbox");
        $(".disp_th_six input").addClass("readonlytxtbox");
        $(".elec_th_six input").addClass("readonlytxtbox");
      }
    //}
  }
  /*if((c_five==0 && c_six!=0) || (disp_five==0 && disp_six!=0) || (elec_five==0 && elec_six!=0)){
//    if(current_time >= "06:00:00"){
    if(current_time >= "07:00:00"){
      //alert("current_time >= 06:00:00");
      $(".comp_th_five").removeClass("tbl-cell");
      $(".comp_th_five").addClass("display-none");
      $(".disp_th_five").removeClass("tbl-cell");
      $(".disp_th_five").addClass("display-none");
      $(".elec_th_five").removeClass("tbl-cell");
      $(".elec_th_five").addClass("display-none");

      $(".page6_btn").removeClass("display-none");
      $(".page6_btn").addClass("display-block");
      $(".page5_btn").removeClass("display-block");
      $(".page5_btn").addClass("display-none");

      $(".prev6_btn").removeClass("display-block");
      $(".prev6_btn").addClass("display-none");
      $(".prev5_btn").removeClass("display-none");
      $(".prev5_btn").addClass("display-block");
    }
    //if(current_time >= "05:00:00"){
      if(g1 < g2){
        $(".page6_btn").removeClass("display-none");
        $(".page6_btn").addClass("display-block");

        $(".comp_th_six input").attr("readonly",true);
        $(".disp_th_six input").attr("readonly",true);
        $(".elec_th_six input").attr("readonly",true);
        $(".comp_th_six input").addClass("readonlytxtbox");
        $(".disp_th_six input").addClass("readonlytxtbox");
        $(".elec_th_six input").addClass("readonlytxtbox");
      }
    //}
  }*/
  /*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    $(".page6_btn").removeClass("display-none");
    $(".page6_btn").addClass("display-block");

    $(".comp_th_six input").attr("readonly",true);
    $(".disp_th_six input").attr("readonly",true);
    $(".elec_th_six input").attr("readonly",true);
    $(".comp_th_six input").addClass("readonlytxtbox");
    $(".disp_th_six input").addClass("readonlytxtbox");
    $(".elec_th_six input").addClass("readonlytxtbox");
  }
}
function col_six(c_six,disp_six,elec_six,c_seven,disp_seven,elec_seven,current_time){
  console.log("SIX COL"+c_six+"---disp_six"+disp_six+"-------elec_six"+elec_six+" c_seven"+c_seven+"----disp_seven "+disp_seven+"***** elec_seven"+elec_seven);  

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);
  if(c_six==0 && disp_six==0 && elec_six==0){
//    if(current_time >= "07:00:00"){
if(current_time >= "08:00:00"){
      /*$(".val_comp_7").attr("readonly",false);
      $(".val_comp_7").removeClass("readonlytxtbox");
      $(".lcv3_mfm_7").attr("readonly",false);
      $(".lcv3_mfm_7").removeClass("readonlytxtbox");
      $(".lcv4_mfm_7").attr("readonly",false);
      $(".lcv4_mfm_7").removeClass("readonlytxtbox");
      $(".lcv5_mfm_7").attr("readonly",false);
      $(".lcv5_mfm_7").removeClass("readonlytxtbox");

      $(".val_disp_1_7").attr("readonly",false);
      $(".val_disp_1_7").removeClass("readonlytxtbox");
      $(".disp_2_a_7").attr("readonly",false);
      $(".disp_2_a_7").removeClass("readonlytxtbox");
      $(".disp_2_b_7").attr("readonly",false);
      $(".disp_2_b_7").removeClass("readonlytxtbox");*/
      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_7").attr("readonly",false);
          $(".val_comp_7").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_7").attr("readonly",false);
          $(".lcv"+l+"_mfm_7").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_7").attr("readonly",false);
          $(".val_disp_"+i+"_7").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_7").attr("readonly",false);
          $(".disp_"+i+"_a_7").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_7").attr("readonly",false);
          $(".disp_"+i+"_b_7").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_7").attr("readonly",false);
          $(".val_comp_7").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_7").attr("readonly",false);
          $(".lcv"+l+"_mfm_7").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_7").attr("readonly",false);
            $(".val_disp_"+i+"_7").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_7").attr("readonly",false);
            $(".disp_"+i+"_a_7").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_7").attr("readonly",false);
            $(".disp_"+i+"_b_7").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/

      $(".val_elec_7").attr("readonly",false);
      $(".val_elec_7").removeClass("readonlytxtbox");
    }
  }

  if((c_six==0 && c_seven==0) && (disp_six==0 && disp_seven==0) && (elec_six==0 && elec_seven==0)){
//    if(current_time >= "07:00:00"){
  if(current_time >= "08:00:00"){
      //alert("current_time >= 07:00:00");
      $(".page7_btn").removeClass("display-none");
      $(".page7_btn").addClass("display-block");
      $(".page6_btn").removeClass("display-block");
      $(".page6_btn").addClass("display-none");

      $(".prev7_btn").removeClass("display-block");
      $(".prev7_btn").addClass("display-none");
      $(".prev6_btn").removeClass("display-none");
      $(".prev6_btn").addClass("display-block");
    }
    //if(current_time >= "06:00:00"){
      if(g1 < g2){
        $(".page7_btn").removeClass("display-none");
        $(".page7_btn").addClass("display-block");

        $(".comp_th_seven input").attr("readonly",true);
        $(".disp_th_seven input").attr("readonly",true);
        $(".elec_th_seven input").attr("readonly",true);
        $(".comp_th_seven input").addClass("readonlytxtbox");
        $(".disp_th_seven input").addClass("readonlytxtbox");
        $(".elec_th_seven input").addClass("readonlytxtbox");
      }
    //}
  }
  /*if((c_six==0 && c_seven!=0) || (disp_six==0 && disp_seven!=0) || (elec_six==0 && elec_seven!=0)){
//    if(current_time >= "07:00:00"){
  if(current_time >= "08:00:00"){
      //alert("current_time >= 07:00:00");
      $(".comp_th_six").removeClass("tbl-cell");
      $(".comp_th_six").addClass("display-none");
      $(".disp_th_six").removeClass("tbl-cell");
      $(".disp_th_six").addClass("display-none");
      $(".elec_th_six").removeClass("tbl-cell");
      $(".elec_th_six").addClass("display-none");

      $(".page7_btn").removeClass("display-none");
      $(".page7_btn").addClass("display-block");
      $(".page6_btn").removeClass("display-block");
      $(".page6_btn").addClass("display-none");

      $(".prev7_btn").removeClass("display-block");
      $(".prev7_btn").addClass("display-none");
      $(".prev6_btn").removeClass("display-none");
      $(".prev6_btn").addClass("display-block");
    }
    //if(current_time >= "06:00:00"){
      if(g1 < g2){
        $(".page7_btn").removeClass("display-none");
        $(".page7_btn").addClass("display-block");

        $(".comp_th_seven input").attr("readonly",true);
        $(".disp_th_seven input").attr("readonly",true);
        $(".elec_th_seven input").attr("readonly",true);
        $(".comp_th_seven input").addClass("readonlytxtbox");
        $(".disp_th_seven input").addClass("readonlytxtbox");
        $(".elec_th_seven input").addClass("readonlytxtbox");
      }
    //}
  }*/
  /*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    $(".page7_btn").removeClass("display-none");
    $(".page7_btn").addClass("display-block");

    $(".comp_th_seven input").attr("readonly",true);
    $(".disp_th_seven input").attr("readonly",true);
    $(".elec_th_seven input").attr("readonly",true);
    $(".comp_th_seven input").addClass("readonlytxtbox");
    $(".disp_th_seven input").addClass("readonlytxtbox");
    $(".elec_th_seven input").addClass("readonlytxtbox");
  }
}
function col_seven(c_seven,disp_seven,elec_seven,c_eight,disp_eight,elec_eight,current_time){
  console.log("SEVEN COL"+c_seven+"---disp_seven"+disp_seven+"-------elec_seven"+elec_seven+" c_eight"+c_eight+"----disp_eight "+disp_eight+"***** elec_eight"+elec_eight);

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);
  if(c_seven==0 && disp_seven==0 && elec_seven==0){
//    if(current_time >= "08:00:00"){
if(current_time >= "09:00:00"){
      /*$(".val_comp_8").attr("readonly",false);
      $(".val_comp_8").removeClass("readonlytxtbox");
      $(".lcv3_mfm_8").attr("readonly",false);
      $(".lcv3_mfm_8").removeClass("readonlytxtbox");
      $(".lcv4_mfm_8").attr("readonly",false);
      $(".lcv4_mfm_8").removeClass("readonlytxtbox");
      $(".lcv5_mfm_8").attr("readonly",false);
      $(".lcv5_mfm_8").removeClass("readonlytxtbox");

      $(".val_disp_1_8").attr("readonly",false);
      $(".val_disp_1_8").removeClass("readonlytxtbox");
      $(".disp_2_a_8").attr("readonly",false);
      $(".disp_2_a_8").removeClass("readonlytxtbox");
      $(".disp_2_b_8").attr("readonly",false);
      $(".disp_2_b_8").removeClass("readonlytxtbox");*/
      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_8").attr("readonly",false);
          $(".val_comp_8").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_8").attr("readonly",false);
          $(".lcv"+l+"_mfm_8").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_8").attr("readonly",false);
          $(".val_disp_"+i+"_8").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_8").attr("readonly",false);
          $(".disp_"+i+"_a_8").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_8").attr("readonly",false);
          $(".disp_"+i+"_b_8").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_8").attr("readonly",false);
          $(".val_comp_8").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_8").attr("readonly",false);
          $(".lcv"+l+"_mfm_8").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_8").attr("readonly",false);
            $(".val_disp_"+i+"_8").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_8").attr("readonly",false);
            $(".disp_"+i+"_a_8").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_8").attr("readonly",false);
            $(".disp_"+i+"_b_8").removeClass("readonlytxtbox");          
        }
      }
      }); 
    }*/

      $(".val_elec_8").attr("readonly",false);
      $(".val_elec_8").removeClass("readonlytxtbox");
    }
  }

  if((c_seven==0 && c_eight==0) && (disp_seven==0 && disp_eight==0) && (elec_seven==0 && elec_eight==0)){
    //if(current_time >= "08:00:00"){
    if(current_time >= "09:00:00"){
      //alert("current_time >= 08:00:00");
      $(".page8_btn").removeClass("display-none");
      $(".page8_btn").addClass("display-block");
      $(".page7_btn").removeClass("display-block");
      $(".page7_btn").addClass("display-none");

      $(".prev8_btn").removeClass("display-block");
      $(".prev8_btn").addClass("display-none");
      $(".prev7_btn").removeClass("display-none");
      $(".prev7_btn").addClass("display-block");
    }
    //if(current_time >= "07:00:00"){
      if(g1 < g2){
        $(".page8_btn").removeClass("display-none");
        $(".page8_btn").addClass("display-block");

        $(".comp_th_eight input").attr("readonly",true);
        $(".disp_th_eight input").attr("readonly",true);
        $(".elec_th_eight input").attr("readonly",true);
        $(".comp_th_eight input").addClass("readonlytxtbox");
        $(".disp_th_eight input").addClass("readonlytxtbox");
        $(".elec_th_eight input").addClass("readonlytxtbox");
      }
    //}
  }
  /*if((c_seven==0 && c_eight!=0) && (disp_seven==0 && disp_eight!=0) && (elec_seven==0 && elec_eight!=0)){
    //if(current_time >= "08:00:00"){
    if(current_time >= "09:00:00"){
      //alert("current_time >= 08:00:00");
      $(".comp_th_seven").removeClass("tbl-cell");
      $(".comp_th_seven").addClass("display-none");
      $(".disp_th_seven").removeClass("tbl-cell");
      $(".disp_th_seven").addClass("display-none");
      $(".elec_th_seven").removeClass("tbl-cell");
      $(".elec_th_seven").addClass("display-none");

      $(".page8_btn").removeClass("display-none");
      $(".page8_btn").addClass("display-block");
      $(".page7_btn").removeClass("display-block");
      $(".page7_btn").addClass("display-none");

      $(".prev8_btn").removeClass("display-block");
      $(".prev8_btn").addClass("display-none");
      $(".prev7_btn").removeClass("display-none");
      $(".prev7_btn").addClass("display-block");
    }
    //if(current_time >= "07:00:00"){
      if(g1 < g2){
        $(".page8_btn").removeClass("display-none");
        $(".page8_btn").addClass("display-block");

        $(".comp_th_eight input").attr("readonly",true);
        $(".disp_th_eight input").attr("readonly",true);
        $(".elec_th_eight input").attr("readonly",true);
        $(".comp_th_eight input").addClass("readonlytxtbox");
        $(".disp_th_eight input").addClass("readonlytxtbox");
        $(".elec_th_eight input").addClass("readonlytxtbox");
      }
    //}
  }*//*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    $(".page8_btn").removeClass("display-none");
    $(".page8_btn").addClass("display-block");

    $(".comp_th_eight input").attr("readonly",true);
    $(".disp_th_eight input").attr("readonly",true);
    $(".elec_th_eight input").attr("readonly",true);
    $(".comp_th_eight input").addClass("readonlytxtbox");
    $(".disp_th_eight input").addClass("readonlytxtbox");
    $(".elec_th_eight input").addClass("readonlytxtbox");
  }
}
function col_eight(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time){
  console.log("EIGHT COL"+c_eight+"---disp_eight"+disp_eight+"-------elec_eight"+elec_eight+" c_nine"+c_nine+"----disp_nine "+disp_nine+"***** elec_nine"+elec_nine);

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(c_eight==0 && disp_eight==0 && elec_eight==0){
  //  if(current_time >= "09:00:00"){
  if(current_time >= "10:00:00"){
      /*$(".val_comp_9").attr("readonly",false);
      $(".val_comp_9").removeClass("readonlytxtbox");
      $(".lcv3_mfm_9").attr("readonly",false);
      $(".lcv3_mfm_9").removeClass("readonlytxtbox");
      $(".lcv4_mfm_9").attr("readonly",false);
      $(".lcv4_mfm_9").removeClass("readonlytxtbox");
      $(".lcv5_mfm_9").attr("readonly",false);
      $(".lcv5_mfm_9").removeClass("readonlytxtbox");

      $(".val_disp_1_9").attr("readonly",false);
      $(".val_disp_1_9").removeClass("readonlytxtbox");
      $(".disp_2_a_9").attr("readonly",false);
      $(".disp_2_a_9").removeClass("readonlytxtbox");
      $(".disp_2_b_9").attr("readonly",false);
      $(".disp_2_b_9").removeClass("readonlytxtbox");*/
      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_9").attr("readonly",false);
          $(".val_comp_9").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_9").attr("readonly",false);
          $(".lcv"+l+"_mfm_9").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_9").attr("readonly",false);
          $(".val_disp_"+i+"_9").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_9").attr("readonly",false);
          $(".disp_"+i+"_a_9").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_9").attr("readonly",false);
          $(".disp_"+i+"_b_9").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_9").attr("readonly",false);
          $(".val_comp_9").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_9").attr("readonly",false);
          $(".lcv"+l+"_mfm_9").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_9").attr("readonly",false);
            $(".val_disp_"+i+"_9").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_9").attr("readonly",false);
            $(".disp_"+i+"_a_9").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_9").attr("readonly",false);
            $(".disp_"+i+"_b_9").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/

      $(".val_elec_9").attr("readonly",false);
      $(".val_elec_9").removeClass("readonlytxtbox");
    }
  }

  if((c_eight==0 && c_nine==0) && (disp_eight==0 && disp_nine==0) && (elec_eight==0 && elec_nine==0)){
    //if(current_time >= "09:00:00"){
    if(current_time >= "10:00:00"){
      //alert("current_time >= 09:00:00");
      $(".page9_btn").removeClass("display-none");
      $(".page9_btn").addClass("display-block");
      $(".page8_btn").removeClass("display-block");
      $(".page8_btn").addClass("display-none");

      $(".prev9_btn").removeClass("display-block");
      $(".prev9_btn").addClass("display-none");
      $(".prev8_btn").removeClass("display-none");
      $(".prev8_btn").addClass("display-block");
    }
    //if(current_time >= "08:00:00"){
      if(g1 < g2){
        $(".page9_btn").removeClass("display-none");
        $(".page9_btn").addClass("display-block");

        $(".comp_th_nine input").attr("readonly",true);
        $(".disp_th_nine input").attr("readonly",true);
        $(".elec_th_nine input").attr("readonly",true);
        $(".comp_th_nine input").addClass("readonlytxtbox");
        $(".disp_th_nine input").addClass("readonlytxtbox");
        $(".elec_th_nine input").addClass("readonlytxtbox");
      }
    //}
  }
  /*if((c_eight==0 && c_nine!=0) || (disp_eight==0 && disp_nine!=0) || (elec_eight==0 && elec_nine!=0)){
    //if(current_time >= "09:00:00"){
    if(current_time >= "10:00:00"){
      //alert("current_time >= 09:00:00");
      $(".comp_th_eight").removeClass("tbl-cell");
      $(".comp_th_eight").addClass("display-none");
      $(".disp_th_eight").removeClass("tbl-cell");
      $(".disp_th_eight").addClass("display-none");
      $(".elec_th_eight").removeClass("tbl-cell");
      $(".elec_th_eight").addClass("display-none");

      $(".page9_btn").removeClass("display-none");
      $(".page9_btn").addClass("display-block");
      $(".page8_btn").removeClass("display-block");
      $(".page8_btn").addClass("display-none");

      $(".prev9_btn").removeClass("display-block");
      $(".prev9_btn").addClass("display-none");
      $(".prev8_btn").removeClass("display-none");
      $(".prev8_btn").addClass("display-block");
    }
    //if(current_time >= "08:00:00"){
      if(g1 < g2){
        $(".page9_btn").removeClass("display-none");
        $(".page9_btn").addClass("display-block");

        $(".comp_th_nine input").attr("readonly",true);
        $(".disp_th_nine input").attr("readonly",true);
        $(".elec_th_nine input").attr("readonly",true);
        $(".comp_th_nine input").addClass("readonlytxtbox");
        $(".disp_th_nine input").addClass("readonlytxtbox");
        $(".elec_th_nine input").addClass("readonlytxtbox");
      }
    //}
  }*//*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    $(".page9_btn").removeClass("display-none");
    $(".page9_btn").addClass("display-block");

    $(".comp_th_nine input").attr("readonly",true);
    $(".disp_th_nine input").attr("readonly",true);
    $(".elec_th_nine input").attr("readonly",true);
    $(".comp_th_nine input").addClass("readonlytxtbox");
    $(".disp_th_nine input").addClass("readonlytxtbox");
    $(".elec_th_nine input").addClass("readonlytxtbox");
  }
}
function col_nine(c_nine,disp_nine,elec_nine,c_ten,disp_ten,elec_ten,current_time){
  console.log("NINE COL"+c_nine+"---disp_nine"+disp_nine+"-------elec_nine"+elec_nine+" c_ten"+c_ten+"----disp_ten "+disp_ten+"***** elec_ten"+elec_ten);  

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);
  if(c_nine==0 && disp_nine==0 && elec_nine==0){
    //if(current_time >= "10:00:00"){
    if(current_time >= "11:00:00"){
      /*$(".val_comp_10").attr("readonly",false);
      $(".val_comp_10").removeClass("readonlytxtbox");
      $(".lcv3_mfm_10").attr("readonly",false);
      $(".lcv3_mfm_10").removeClass("readonlytxtbox");
      $(".lcv4_mfm_10").attr("readonly",false);
      $(".lcv4_mfm_10").removeClass("readonlytxtbox");
      $(".lcv5_mfm_10").attr("readonly",false);
      $(".lcv5_mfm_10").removeClass("readonlytxtbox");

      $(".val_disp_1_10").attr("readonly",false);
      $(".val_disp_1_10").removeClass("readonlytxtbox");
      $(".disp_2_a_10").attr("readonly",false);
      $(".disp_2_a_10").removeClass("readonlytxtbox");
      $(".disp_2_b_10").attr("readonly",false);
      $(".disp_2_b_10").removeClass("readonlytxtbox");*/
      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_10").attr("readonly",false);
          $(".val_comp_10").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_10").attr("readonly",false);
          $(".lcv"+l+"_mfm_10").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_10").attr("readonly",false);
          $(".val_disp_"+i+"_10").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_10").attr("readonly",false);
          $(".disp_"+i+"_a_10").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_10").attr("readonly",false);
          $(".disp_"+i+"_b_10").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_10").attr("readonly",false);
          $(".val_comp_10").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_10").attr("readonly",false);
          $(".lcv"+l+"_mfm_10").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_10").attr("readonly",false);
            $(".val_disp_"+i+"_10").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_10").attr("readonly",false);
            $(".disp_"+i+"_a_10").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_10").attr("readonly",false);
            $(".disp_"+i+"_b_10").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/

      $(".val_elec_10").attr("readonly",false);
      $(".val_elec_10").removeClass("readonlytxtbox");
    }
  }

  if((c_nine==0 && c_ten==0) && (disp_nine==0 && disp_ten==0) && (elec_nine==0 && elec_ten==0)){
    //if(current_time >= "10:00:00"){
    if(current_time >= "11:00:00"){
      //alert("current_time >= 10:00:00");
      $(".page10_btn").removeClass("display-none");
      $(".page10_btn").addClass("display-block");
      $(".page9_btn").removeClass("display-block");
      $(".page9_btn").addClass("display-none");

      $(".prev10_btn").removeClass("display-block");
      $(".prev10_btn").addClass("display-none");
      $(".prev9_btn").removeClass("display-none");
      $(".prev9_btn").addClass("display-block");
    }
    //if(current_time >= "09:00:00"){
      if(g1 < g2){
        $(".page10_btn").removeClass("display-none");
        $(".page10_btn").addClass("display-block");

        $(".comp_th_ten input").attr("readonly",true);
        $(".disp_th_ten input").attr("readonly",true);
        $(".elec_th_ten input").attr("readonly",true);
        $(".comp_th_ten input").addClass("readonlytxtbox");
        $(".disp_th_ten input").addClass("readonlytxtbox");
        $(".elec_th_ten input").addClass("readonlytxtbox");
      }
    //}
  }
  /*if((c_nine==0 && c_ten!=0) || (disp_nine==0 && disp_ten!=0) || (elec_nine==0 && elec_ten!=0)){
    //if(current_time >= "10:00:00"){
    if(current_time >= "11:00:00"){
      //alert("current_time >= 10:00:00");
      $(".comp_th_nine").removeClass("tbl-cell");
      $(".comp_th_nine").addClass("display-none");
      $(".disp_th_nine").removeClass("tbl-cell");
      $(".disp_th_nine").addClass("display-none");
      $(".elec_th_nine").removeClass("tbl-cell");
      $(".elec_th_nine").addClass("display-none");

      $(".page10_btn").removeClass("display-none");
      $(".page10_btn").addClass("display-block");
      $(".page9_btn").removeClass("display-block");
      $(".page9_btn").addClass("display-none");

      $(".prev10_btn").removeClass("display-block");
      $(".prev10_btn").addClass("display-none");
      $(".prev9_btn").removeClass("display-none");
      $(".prev9_btn").addClass("display-block");
    }
    //if(current_time >= "09:00:00"){
      if(g1 < g2){
        $(".page10_btn").removeClass("display-none");
        $(".page10_btn").addClass("display-block");

        $(".comp_th_ten input").attr("readonly",true);
        $(".disp_th_ten input").attr("readonly",true);
        $(".elec_th_ten input").attr("readonly",true);
        $(".comp_th_ten input").addClass("readonlytxtbox");
        $(".disp_th_ten input").addClass("readonlytxtbox");
        $(".elec_th_ten input").addClass("readonlytxtbox");
      }
    //}
  }*/
  /*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    $(".page10_btn").removeClass("display-none");
    $(".page10_btn").addClass("display-block");

    $(".comp_th_ten input").attr("readonly",true);
    $(".disp_th_ten input").attr("readonly",true);
    $(".elec_th_ten input").attr("readonly",true);
    $(".comp_th_ten input").addClass("readonlytxtbox");
    $(".disp_th_ten input").addClass("readonlytxtbox");
    $(".elec_th_ten input").addClass("readonlytxtbox");
  }
}
function col_ten(c_ten,disp_ten,elec_ten,c_eleven,disp_eleven,elec_eleven,current_time){
  console.log("TEN COL"+c_ten+"---disp_ten"+disp_ten+"-------elec_ten"+elec_ten+" c_eleven"+c_eleven+"----disp_eleven "+disp_eleven+"***** elec_eleven"+elec_eleven);

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(c_ten==0 && disp_ten==0 && elec_ten==0){
    //if(current_time >= "11:00:00"){
    if(current_time >= "12:00:00"){
      /*$(".val_comp_11").attr("readonly",false);
      $(".val_comp_11").removeClass("readonlytxtbox");
      $(".lcv3_mfm_11").attr("readonly",false);
      $(".lcv3_mfm_11").removeClass("readonlytxtbox");
      $(".lcv4_mfm_11").attr("readonly",false);
      $(".lcv4_mfm_11").removeClass("readonlytxtbox");
      $(".lcv5_mfm_11").attr("readonly",false);
      $(".lcv5_mfm_11").removeClass("readonlytxtbox");

      $(".val_disp_1_11").attr("readonly",false);
      $(".val_disp_1_11").removeClass("readonlytxtbox");
      $(".disp_2_a_11").attr("readonly",false);
      $(".disp_2_a_11").removeClass("readonlytxtbox");
      $(".disp_2_b_11").attr("readonly",false);
      $(".disp_2_b_11").removeClass("readonlytxtbox");*/
      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_11").attr("readonly",false);
          $(".val_comp_11").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_11").attr("readonly",false);
          $(".lcv"+l+"_mfm_11").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_11").attr("readonly",false);
          $(".val_disp_"+i+"_11").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_11").attr("readonly",false);
          $(".disp_"+i+"_a_11").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_11").attr("readonly",false);
          $(".disp_"+i+"_b_11").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_11").attr("readonly",false);
          $(".val_comp_11").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_11").attr("readonly",false);
          $(".lcv"+l+"_mfm_11").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_11").attr("readonly",false);
            $(".val_disp_"+i+"_11").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_11").attr("readonly",false);
            $(".disp_"+i+"_a_11").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_11").attr("readonly",false);
            $(".disp_"+i+"_b_11").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/

      $(".val_elec_11").attr("readonly",false);
      $(".val_elec_11").removeClass("readonlytxtbox");
    }
  }

  if((c_ten==0 && c_eleven==0) && (disp_ten==0 && disp_eleven==0) && (elec_ten==0 && elec_eleven==0)){
    //if(current_time >= "11:00:00"){
    if(current_time >= "12:00:00"){
      //alert("current_time >= 11:00:00");
      $(".page11_btn").removeClass("display-none");
      $(".page11_btn").addClass("display-block");
      $(".page10_btn").removeClass("display-block");
      $(".page10_btn").addClass("display-none");

      $(".prev11_btn").removeClass("display-block");
      $(".prev11_btn").addClass("display-none");
      $(".prev10_btn").removeClass("display-none");
      $(".prev10_btn").addClass("display-block");
    }
    //if(current_time >= "10:00:00"){
      if(g1 < g2){
        $(".page11_btn").removeClass("display-none");
        $(".page11_btn").addClass("display-block");

        $(".comp_th_eleven input").attr("readonly",true);
        $(".disp_th_eleven input").attr("readonly",true);
        $(".elec_th_eleven input").attr("readonly",true);
        $(".comp_th_eleven input").addClass("readonlytxtbox");
        $(".disp_th_eleven input").addClass("readonlytxtbox");
        $(".elec_th_eleven input").addClass("readonlytxtbox");
      }
    //}
  }
  /*if((c_ten==0 && c_eleven!=0) || (disp_ten==0 && disp_eleven!=0) || (elec_ten==0 && elec_eleven!=0)){
    //if(current_time >= "11:00:00"){
    if(current_time >= "12:00:00"){
      //alert("current_time >= 11:00:00");

      $(".comp_th_ten").removeClass("tbl-cell");
      $(".comp_th_ten").addClass("display-none");
      $(".disp_th_ten").removeClass("tbl-cell");
      $(".disp_th_ten").addClass("display-none");
      $(".elec_th_ten").removeClass("tbl-cell");
      $(".elec_th_ten").addClass("display-none");

      $(".page11_btn").removeClass("display-none");
      $(".page11_btn").addClass("display-block");
      $(".page10_btn").removeClass("display-block");
      $(".page10_btn").addClass("display-none");

      $(".prev11_btn").removeClass("display-block");
      $(".prev11_btn").addClass("display-none");
      $(".prev10_btn").removeClass("display-none");
      $(".prev10_btn").addClass("display-block");
    }
    //if(current_time >= "10:00:00"){
      if(g1 < g2){
        $(".page11_btn").removeClass("display-none");
        $(".page11_btn").addClass("display-block");

        $(".comp_th_eleven input").attr("readonly",true);
        $(".disp_th_eleven input").attr("readonly",true);
        $(".elec_th_eleven input").attr("readonly",true);
        $(".comp_th_eleven input").addClass("readonlytxtbox");
        $(".disp_th_eleven input").addClass("readonlytxtbox");
        $(".elec_th_eleven input").addClass("readonlytxtbox");
      }
    //}
  }*/
  /*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    $(".page11_btn").removeClass("display-none");
    $(".page11_btn").addClass("display-block");

    $(".comp_th_eleven input").attr("readonly",true);
    $(".disp_th_eleven input").attr("readonly",true);
    $(".elec_th_eleven input").attr("readonly",true);
    $(".comp_th_eleven input").addClass("readonlytxtbox");
    $(".disp_th_eleven input").addClass("readonlytxtbox");
    $(".elec_th_eleven input").addClass("readonlytxtbox");
  }
}
function col_eleven(c_eleven,disp_eleven,elec_eleven,c_twelve,disp_twelve,elec_twelve,current_time){
  console.log("ELEVEN COL"+c_eleven+"---disp_eleven"+disp_eleven+"-------elec_eleven"+elec_eleven+" c_twelve"+c_twelve+"----disp_twelve "+disp_twelve+"***** elec_twelve"+elec_twelve);

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(c_eleven==0 && disp_eleven==0 && elec_eleven==0){
 //   if(current_time >= "12:00:00"){
  if(current_time >= "13:00:00"){
      /*$(".val_comp_12").attr("readonly",false);
      $(".val_comp_12").removeClass("readonlytxtbox");
      $(".lcv3_mfm_12").attr("readonly",false);
      $(".lcv3_mfm_12").removeClass("readonlytxtbox");
      $(".lcv4_mfm_12").attr("readonly",false);
      $(".lcv4_mfm_12").removeClass("readonlytxtbox");
      $(".lcv5_mfm_12").attr("readonly",false);
      $(".lcv5_mfm_12").removeClass("readonlytxtbox");

      $(".val_disp_1_12").attr("readonly",false);
      $(".val_disp_1_12").removeClass("readonlytxtbox");
      $(".disp_2_a_12").attr("readonly",false);
      $(".disp_2_a_12").removeClass("readonlytxtbox");
      $(".disp_2_b_12").attr("readonly",false);
      $(".disp_2_b_12").removeClass("readonlytxtbox");*/

      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_12").attr("readonly",false);
          $(".val_comp_12").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_12").attr("readonly",false);
          $(".lcv"+l+"_mfm_12").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_12").attr("readonly",false);
          $(".val_disp_"+i+"_12").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_12").attr("readonly",false);
          $(".disp_"+i+"_a_12").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_12").attr("readonly",false);
          $(".disp_"+i+"_b_12").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_12").attr("readonly",false);
          $(".val_comp_12").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_12").attr("readonly",false);
          $(".lcv"+l+"_mfm_12").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_12").attr("readonly",false);
            $(".val_disp_"+i+"_12").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_12").attr("readonly",false);
            $(".disp_"+i+"_a_12").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_12").attr("readonly",false);
            $(".disp_"+i+"_b_12").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/

      $(".val_elec_12").attr("readonly",false);
      $(".val_elec_12").removeClass("readonlytxtbox");
    }
  }

  if((c_eleven==0 && c_twelve==0) && (disp_eleven==0 && disp_twelve==0) && (elec_eleven==0 && elec_twelve==0)){
    //if(current_time >= "12:00:00"){
    if(current_time >= "13:00:00"){
      //alert("current_time >= 12:00:00");
      $(".page12_btn").removeClass("display-none");
      $(".page12_btn").addClass("display-block");
      $(".page11_btn").removeClass("display-block");
      $(".page11_btn").addClass("display-none");

      $(".prev12_btn").removeClass("display-block");
      $(".prev12_btn").addClass("display-none");
      $(".prev11_btn").removeClass("display-none");
      $(".prev11_btn").addClass("display-block");
    }
    //if(current_time >= "11:00:00"){
      if(g1 < g2){
        $(".page12_btn").removeClass("display-none");
        $(".page12_btn").addClass("display-block");

        $(".comp_th_twelve input").attr("readonly",true);
        $(".disp_th_twelve input").attr("readonly",true);
        $(".elec_th_twelve input").attr("readonly",true);
        $(".comp_th_twelve input").addClass("readonlytxtbox");
        $(".disp_th_twelve input").addClass("readonlytxtbox");
        $(".elec_th_twelve input").addClass("readonlytxtbox");
      }
    //}
  }
  /*if((c_eleven==0 && c_twelve!=0) || (disp_eleven==0 && disp_twelve!=0) || (elec_eleven==0 && elec_twelve!=0)){
    //if(current_time >= "12:00:00"){
    if(current_time >= "13:00:00"){
      //alert("current_time >= 12:00:00");
      $(".comp_th_eleven").removeClass("tbl-cell");
      $(".comp_th_eleven").addClass("display-none");
      $(".disp_th_eleven").removeClass("tbl-cell");
      $(".disp_th_eleven").addClass("display-none");
      $(".elec_th_eleven").removeClass("tbl-cell");
      $(".elec_th_eleven").addClass("display-none");

      $(".page12_btn").removeClass("display-none");
      $(".page12_btn").addClass("display-block");
      $(".page11_btn").removeClass("display-block");
      $(".page11_btn").addClass("display-none");

      $(".prev12_btn").removeClass("display-block");
      $(".prev12_btn").addClass("display-none");
      $(".prev11_btn").removeClass("display-none");
      $(".prev11_btn").addClass("display-block");
    }
    //if(current_time >= "11:00:00"){
      if(g1 < g2){
        $(".page12_btn").removeClass("display-none");
        $(".page12_btn").addClass("display-block");

        $(".comp_th_twelve input").attr("readonly",true);
        $(".disp_th_twelve input").attr("readonly",true);
        $(".elec_th_twelve input").attr("readonly",true);
        $(".comp_th_twelve input").addClass("readonlytxtbox");
        $(".disp_th_twelve input").addClass("readonlytxtbox");
        $(".elec_th_twelve input").addClass("readonlytxtbox");
      }
    //}
  }*/
  /*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    $(".page12_btn").removeClass("display-none");
    $(".page12_btn").addClass("display-block");

    $(".comp_th_twelve input").attr("readonly",true);
    $(".disp_th_twelve input").attr("readonly",true);
    $(".elec_th_twelve input").attr("readonly",true);
    $(".comp_th_twelve input").addClass("readonlytxtbox");
    $(".disp_th_twelve input").addClass("readonlytxtbox");
    $(".elec_th_twelve input").addClass("readonlytxtbox");
  }
}
function col_twelve(c_twelve,disp_twelve,elec_twelve,c_thirteen,disp_thirteen,elec_thirteen,current_time){
  console.log("TWELVE COL"+c_twelve+"---disp_twelve"+disp_twelve+"-------elec_twelve"+elec_twelve+" c_thirteen"+c_thirteen+"----disp_thirteen "+disp_thirteen+"***** elec_thirteen"+elec_thirteen);

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(c_twelve==0 && disp_twelve==0 && elec_twelve==0){
//    if(current_time >= "13:00:00"){
if(current_time >= "14:00:00"){
      /*$(".val_comp_13").attr("readonly",false);
      $(".val_comp_13").removeClass("readonlytxtbox");
      $(".lcv3_mfm_13").attr("readonly",false);
      $(".lcv3_mfm_13").removeClass("readonlytxtbox");
      $(".lcv4_mfm_13").attr("readonly",false);
      $(".lcv4_mfm_13").removeClass("readonlytxtbox");
      $(".lcv5_mfm_13").attr("readonly",false);
      $(".lcv5_mfm_13").removeClass("readonlytxtbox");

      $(".val_disp_1_13").attr("readonly",false);
      $(".val_disp_1_13").removeClass("readonlytxtbox");
      $(".disp_2_a_13").attr("readonly",false);
      $(".disp_2_a_13").removeClass("readonlytxtbox");
      $(".disp_2_b_13").attr("readonly",false);
      $(".disp_2_b_13").removeClass("readonlytxtbox");*/

      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_13").attr("readonly",false);
          $(".val_comp_13").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_13").attr("readonly",false);
          $(".lcv"+l+"_mfm_13").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_13").attr("readonly",false);
          $(".val_disp_"+i+"_13").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_13").attr("readonly",false);
          $(".disp_"+i+"_a_13").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_13").attr("readonly",false);
          $(".disp_"+i+"_b_13").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_13").attr("readonly",false);
          $(".val_comp_13").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_13").attr("readonly",false);
          $(".lcv"+l+"_mfm_13").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_13").attr("readonly",false);
            $(".val_disp_"+i+"_13").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_13").attr("readonly",false);
            $(".disp_"+i+"_a_13").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_13").attr("readonly",false);
            $(".disp_"+i+"_b_13").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/

      $(".val_elec_13").attr("readonly",false);
      $(".val_elec_13").removeClass("readonlytxtbox");
    }
  }

//alert("current_time >= 13:00:00");
  if((c_twelve==0 && c_thirteen==0) && (disp_twelve==0 && disp_thirteen==0) && (elec_twelve==0 && elec_thirteen==0)){
    //alert("aaaaaaaaaaaaa");
//    if(current_time >= "13:00:00"){
  if(current_time >= "14:00:00"){
      //alert("current_time >= 13:00:00");
      $(".page13_btn").removeClass("display-none");
      $(".page13_btn").addClass("display-block");
      $(".page12_btn").removeClass("display-block");
      $(".page12_btn").addClass("display-none");

      $(".prev13_btn").removeClass("display-block");
      $(".prev13_btn").addClass("display-none");
      $(".prev12_btn").removeClass("display-none");
      $(".prev12_btn").addClass("display-block");
    }
    //if(current_time >= "12:00:00"){
      if(g1 < g2){
        $(".page13_btn").removeClass("display-none");
        $(".page13_btn").addClass("display-block");

        $(".comp_th_thirteen input").attr("readonly",true);
        $(".disp_th_thirteen input").attr("readonly",true);
        $(".elec_th_thirteen input").attr("readonly",true);
        $(".comp_th_thirteen input").addClass("readonlytxtbox");
        $(".disp_th_thirteen input").addClass("readonlytxtbox");
        $(".elec_th_thirteen input").addClass("readonlytxtbox");
      }
    //}
  }
  /*if((c_twelve==0 && c_thirteen!=0) || (disp_twelve==0 && disp_thirteen!=0) || (elec_twelve==0 && elec_thirteen!=0)){
    //alert("aaaaaaaaaaaaa");
//    if(current_time >= "13:00:00"){
  if(current_time >= "14:00:00"){
      //alert("current_time >= 13:00:00");
      $(".comp_th_twelve").removeClass("tbl-cell");
      $(".comp_th_twelve").addClass("display-none");
      $(".disp_th_twelve").removeClass("tbl-cell");
      $(".disp_th_twelve").addClass("display-none");
      $(".elec_th_twelve").removeClass("tbl-cell");
      $(".elec_th_twelve").addClass("display-none");

      $(".page13_btn").removeClass("display-none");
      $(".page13_btn").addClass("display-block");
      $(".page12_btn").removeClass("display-block");
      $(".page12_btn").addClass("display-none");

      $(".prev13_btn").removeClass("display-block");
      $(".prev13_btn").addClass("display-none");
      $(".prev12_btn").removeClass("display-none");
      $(".prev12_btn").addClass("display-block");
    }
    //if(current_time >= "12:00:00"){
      if(g1 < g2){
        $(".page13_btn").removeClass("display-none");
        $(".page13_btn").addClass("display-block");

        $(".comp_th_thirteen input").attr("readonly",true);
        $(".disp_th_thirteen input").attr("readonly",true);
        $(".elec_th_thirteen input").attr("readonly",true);
        $(".comp_th_thirteen input").addClass("readonlytxtbox");
        $(".disp_th_thirteen input").addClass("readonlytxtbox");
        $(".elec_th_thirteen input").addClass("readonlytxtbox");
      }
    //}
  }*/
  /*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    $(".page13_btn").removeClass("display-none");
    $(".page13_btn").addClass("display-block");

    $(".comp_th_thirteen input").attr("readonly",true);
    $(".disp_th_thirteen input").attr("readonly",true);
    $(".elec_th_thirteen input").attr("readonly",true);
    $(".comp_th_thirteen input").addClass("readonlytxtbox");
    $(".disp_th_thirteen input").addClass("readonlytxtbox");
    $(".elec_th_thirteen input").addClass("readonlytxtbox");
  }
}
function col_thirteen(c_thirteen,disp_thirteen,elec_thirteen,c_fourteen,disp_fourteen,elec_fourteen,current_time){
  console.log("THIRTEEN COL"+c_thirteen+"---disp_thirteen"+disp_thirteen+"-------elec_thirteen"+elec_thirteen+" c_fourteen"+c_fourteen+"----disp_fourteen "+disp_fourteen+"***** elec_fourteen"+elec_fourteen);

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(c_thirteen==0 && disp_thirteen==0 && elec_thirteen==0){
 //   if(current_time >= "14:00:00"){
if(current_time >= "15:00:00"){
      /*$(".val_comp_14").attr("readonly",false);
      $(".val_comp_14").removeClass("readonlytxtbox");
      $(".lcv3_mfm_14").attr("readonly",false);
      $(".lcv3_mfm_14").removeClass("readonlytxtbox");
      $(".lcv4_mfm_14").attr("readonly",false);
      $(".lcv4_mfm_14").removeClass("readonlytxtbox");
      $(".lcv5_mfm_14").attr("readonly",false);
      $(".lcv5_mfm_14").removeClass("readonlytxtbox");

      $(".val_disp_1_14").attr("readonly",false);
      $(".val_disp_1_14").removeClass("readonlytxtbox");
      $(".disp_2_a_14").attr("readonly",false);
      $(".disp_2_a_14").removeClass("readonlytxtbox");
      $(".disp_2_b_14").attr("readonly",false);
      $(".disp_2_b_14").removeClass("readonlytxtbox");*/
      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_14").attr("readonly",false);
          $(".val_comp_14").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_14").attr("readonly",false);
          $(".lcv"+l+"_mfm_14").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_14").attr("readonly",false);
          $(".val_disp_"+i+"_14").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_14").attr("readonly",false);
          $(".disp_"+i+"_a_14").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_14").attr("readonly",false);
          $(".disp_"+i+"_b_14").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_14").attr("readonly",false);
          $(".val_comp_14").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_14").attr("readonly",false);
          $(".lcv"+l+"_mfm_14").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_14").attr("readonly",false);
            $(".val_disp_"+i+"_14").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_14").attr("readonly",false);
            $(".disp_"+i+"_a_14").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_14").attr("readonly",false);
            $(".disp_"+i+"_b_14").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/

      $(".val_elec_14").attr("readonly",false);
      $(".val_elec_14").removeClass("readonlytxtbox");
    }
  }

  if((c_thirteen==0 && c_fourteen==0) && (disp_thirteen==0 && disp_fourteen==0) && (elec_thirteen==0 && elec_fourteen==0)){
//    if(current_time >= "14:00:00"){
  if(current_time >= "15:00:00"){
      //alert("current_time >= 14:00:00");
      $(".page14_btn").removeClass("display-none");
      $(".page14_btn").addClass("display-block");
      $(".page13_btn").removeClass("display-block");
      $(".page13_btn").addClass("display-none");

      $(".prev14_btn").removeClass("display-block");
      $(".prev14_btn").addClass("display-none");
      $(".prev13_btn").removeClass("display-none");
      $(".prev13_btn").addClass("display-block");
    }
    //if(current_time >= "13:00:00"){
      if(g1 < g2){
        $(".page14_btn").removeClass("display-none");
        $(".page14_btn").addClass("display-block");

        $(".comp_th_fourteen input").attr("readonly",true);
        $(".disp_th_fourteen input").attr("readonly",true);
        $(".elec_th_fourteen input").attr("readonly",true);
        $(".comp_th_fourteen input").addClass("readonlytxtbox");
        $(".disp_th_fourteen input").addClass("readonlytxtbox");
        $(".elec_th_fourteen input").addClass("readonlytxtbox");
      }
    //}
  }
  /*if((c_thirteen==0 && c_fourteen!=0) || (disp_thirteen==0 && disp_fourteen!=0) || (elec_thirteen==0 && elec_fourteen!=0)){
//    if(current_time >= "14:00:00"){
  if(current_time >= "15:00:00"){
      //alert("current_time >= 14:00:00");
      $(".comp_th_thirteen").removeClass("tbl-cell");
      $(".comp_th_thirteen").addClass("display-none");
      $(".disp_th_thirteen").removeClass("tbl-cell");
      $(".disp_th_thirteen").addClass("display-none");
      $(".elec_th_thirteen").removeClass("tbl-cell");
      $(".elec_th_thirteen").addClass("display-none");

      $(".page14_btn").removeClass("display-none");
      $(".page14_btn").addClass("display-block");
      $(".page13_btn").removeClass("display-block");
      $(".page13_btn").addClass("display-none");

      $(".prev14_btn").removeClass("display-block");
      $(".prev14_btn").addClass("display-none");
      $(".prev13_btn").removeClass("display-none");
      $(".prev13_btn").addClass("display-block");
    }
    //if(current_time >= "13:00:00"){
      if(g1 < g2){
        $(".page14_btn").removeClass("display-none");
        $(".page14_btn").addClass("display-block");

        $(".comp_th_fourteen input").attr("readonly",true);
        $(".disp_th_fourteen input").attr("readonly",true);
        $(".elec_th_fourteen input").attr("readonly",true);
        $(".comp_th_fourteen input").addClass("readonlytxtbox");
        $(".disp_th_fourteen input").addClass("readonlytxtbox");
        $(".elec_th_fourteen input").addClass("readonlytxtbox");
      }
    //}
  }*/
  /*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    $(".page14_btn").removeClass("display-none");
    $(".page14_btn").addClass("display-block");

    $(".comp_th_fourteen input").attr("readonly",true);
    $(".disp_th_fourteen input").attr("readonly",true);
    $(".elec_th_fourteen input").attr("readonly",true);
    $(".comp_th_fourteen input").addClass("readonlytxtbox");
    $(".disp_th_fourteen input").addClass("readonlytxtbox");
    $(".elec_th_fourteen input").addClass("readonlytxtbox");
  }
}
function col_fourteen(c_fourteen,disp_fourteen,elec_fourteen,c_fifteen,disp_fifteen,elec_fifteen,current_time){
  console.log("FOURTEEN COL"+c_fourteen+"---disp_fourteen"+disp_fourteen+"-------elec_fourteen"+elec_fourteen+" c_fifteen"+c_fifteen+"----disp_fifteen "+disp_fifteen+"***** elec_fifteen"+elec_fifteen);

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(c_fourteen==0 && disp_fourteen==0 && elec_fourteen==0){
//    if(current_time >= "15:00:00"){
if(current_time >= "16:00:00"){
      /*$(".val_comp_15").attr("readonly",false);
      $(".val_comp_15").removeClass("readonlytxtbox");
      $(".lcv3_mfm_15").attr("readonly",false);
      $(".lcv3_mfm_15").removeClass("readonlytxtbox");
      $(".lcv4_mfm_15").attr("readonly",false);
      $(".lcv4_mfm_15").removeClass("readonlytxtbox");
      $(".lcv5_mfm_15").attr("readonly",false);
      $(".lcv5_mfm_15").removeClass("readonlytxtbox");

      $(".val_disp_1_15").attr("readonly",false);
      $(".val_disp_1_15").removeClass("readonlytxtbox");
      $(".disp_2_a_15").attr("readonly",false);
      $(".disp_2_a_15").removeClass("readonlytxtbox");
      $(".disp_2_b_15").attr("readonly",false);
      $(".disp_2_b_15").removeClass("readonlytxtbox");*/
      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_15").attr("readonly",false);
          $(".val_comp_15").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_15").attr("readonly",false);
          $(".lcv"+l+"_mfm_15").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_15").attr("readonly",false);
          $(".val_disp_"+i+"_15").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_15").attr("readonly",false);
          $(".disp_"+i+"_a_15").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_15").attr("readonly",false);
          $(".disp_"+i+"_b_15").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_15").attr("readonly",false);
          $(".val_comp_15").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_15").attr("readonly",false);
          $(".lcv"+l+"_mfm_15").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_15").attr("readonly",false);
            $(".val_disp_"+i+"_15").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_15").attr("readonly",false);
            $(".disp_"+i+"_a_15").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_15").attr("readonly",false);
            $(".disp_"+i+"_b_15").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/

      $(".val_elec_15").attr("readonly",false);
      $(".val_elec_15").removeClass("readonlytxtbox");
    }
  }

  //alert("today_dt "+today_dt+"------ hidd_dprdt "+hidd_dprdt);
  if((c_fourteen==0 && c_fifteen==0) && (disp_fourteen==0 && disp_fifteen==0) && (elec_fourteen==0 && elec_fifteen==0)){
 //   if(current_time >= "15:00:00"){
  if(current_time >= "16:00:00"){
      //alert("current_time >= 15:00:00");
      $(".page15_btn").removeClass("display-none");
      $(".page15_btn").addClass("display-block");
      $(".page14_btn").removeClass("display-block");
      $(".page14_btn").addClass("display-none");

      $(".prev15_btn").removeClass("display-block");
      $(".prev15_btn").addClass("display-none");
      $(".prev14_btn").removeClass("display-none");
      $(".prev14_btn").addClass("display-block");
    }
    //if(current_time >= "14:00:00"){
      if(g1 < g2){
        $(".page15_btn").removeClass("display-none");
        $(".page15_btn").addClass("display-block");

        $(".comp_th_fifteen input").attr("readonly",true);
        $(".disp_th_fifteen input").attr("readonly",true);
        $(".elec_th_fifteen input").attr("readonly",true);
        $(".comp_th_fifteen input").addClass("readonlytxtbox");
        $(".disp_th_fifteen input").addClass("readonlytxtbox");
        $(".elec_th_fifteen input").addClass("readonlytxtbox");
      }
    //}
  }
  /*if((c_fourteen==0 && c_fifteen!=0) || (disp_fourteen==0 && disp_fifteen!=0) || (elec_fourteen==0 && elec_fifteen==0)){
 //   if(current_time >= "15:00:00"){
  if(current_time >= "16:00:00"){

      $(".comp_th_fourteen").removeClass("tbl-cell");
      $(".comp_th_fourteen").addClass("display-none");
      $(".disp_th_fourteen").removeClass("tbl-cell");
      $(".disp_th_fourteen").addClass("display-none");
      $(".elec_th_fourteen").removeClass("tbl-cell");
      $(".elec_th_fourteen").addClass("display-none");

      //alert("current_time >= 15:00:00");
      $(".page15_btn").removeClass("display-none");
      $(".page15_btn").addClass("display-block");
      $(".page14_btn").removeClass("display-block");
      $(".page14_btn").addClass("display-none");

      $(".prev15_btn").removeClass("display-block");
      $(".prev15_btn").addClass("display-none");
      $(".prev14_btn").removeClass("display-none");
      $(".prev14_btn").addClass("display-block");
    }
    //if(current_time >= "14:00:00"){
      if(g1 < g2){
        $(".page15_btn").removeClass("display-none");
        $(".page15_btn").addClass("display-block");

        $(".comp_th_fifteen input").attr("readonly",true);
        $(".disp_th_fifteen input").attr("readonly",true);
        $(".elec_th_fifteen input").attr("readonly",true);
        $(".comp_th_fifteen input").addClass("readonlytxtbox");
        $(".disp_th_fifteen input").addClass("readonlytxtbox");
        $(".elec_th_fifteen input").addClass("readonlytxtbox");
      }
    //}
  }*/
  /*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    $(".page15_btn").removeClass("display-none");
    $(".page15_btn").addClass("display-block");

    $(".comp_th_fifteen input").attr("readonly",true);
    $(".disp_th_fifteen input").attr("readonly",true);
    $(".elec_th_fifteen input").attr("readonly",true);
    $(".comp_th_fifteen input").addClass("readonlytxtbox");
    $(".disp_th_fifteen input").addClass("readonlytxtbox");
    $(".elec_th_fifteen input").addClass("readonlytxtbox");
  }
}
function col_fifteen(c_fifteen,disp_fifteen,elec_fifteen,c_sixteen,disp_sixteen,elec_sixteen,current_time){
  console.log("FIFTEEN COL"+c_fifteen+"---disp_fifteen"+disp_fifteen+"-------elec_fifteen"+elec_fifteen+" c_sixteen"+c_sixteen+"----disp_sixteen "+disp_sixteen+"***** elec_sixteen"+elec_sixteen);


  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(c_fifteen==0 && disp_fifteen==0 && elec_fifteen==0){
//    if(current_time >= "16:00:00"){
  if(current_time >= "17:00:00"){
      /*$(".val_comp_16").attr("readonly",false);
      $(".val_comp_16").removeClass("readonlytxtbox");
      $(".lcv3_mfm_16").attr("readonly",false);
      $(".lcv3_mfm_16").removeClass("readonlytxtbox");
      $(".lcv4_mfm_16").attr("readonly",false);
      $(".lcv4_mfm_16").removeClass("readonlytxtbox");
      $(".lcv5_mfm_16").attr("readonly",false);
      $(".lcv5_mfm_16").removeClass("readonlytxtbox");

      $(".val_disp_1_16").attr("readonly",false);
      $(".val_disp_1_16").removeClass("readonlytxtbox");
      $(".disp_2_a_16").attr("readonly",false);
      $(".disp_2_a_16").removeClass("readonlytxtbox");
      $(".disp_2_b_16").attr("readonly",false);
      $(".disp_2_b_16").removeClass("readonlytxtbox");*/

      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_16").attr("readonly",false);
          $(".val_comp_16").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_16").attr("readonly",false);
          $(".lcv"+l+"_mfm_16").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_16").attr("readonly",false);
          $(".val_disp_"+i+"_16").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_16").attr("readonly",false);
          $(".disp_"+i+"_a_16").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_16").attr("readonly",false);
          $(".disp_"+i+"_b_16").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_16").attr("readonly",false);
          $(".val_comp_16").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_16").attr("readonly",false);
          $(".lcv"+l+"_mfm_16").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_16").attr("readonly",false);
            $(".val_disp_"+i+"_16").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_16").attr("readonly",false);
            $(".disp_"+i+"_a_16").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_16").attr("readonly",false);
            $(".disp_"+i+"_b_16").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/

      $(".val_elec_16").attr("readonly",false);
      $(".val_elec_16").removeClass("readonlytxtbox");
    }
  }

  if((c_fifteen==0 && c_sixteen==0) && (disp_fifteen==0 && disp_sixteen==0) && (elec_fifteen==0 && elec_sixteen==0)){
 //   if(current_time >= "16:00:00"){
  if(current_time >= "17:00:00"){
      //alert("current_time >= 16:00:00");
      $(".page16_btn").removeClass("display-none");
      $(".page16_btn").addClass("display-block");
      $(".page15_btn").removeClass("display-block");
      $(".page15_btn").addClass("display-none");

      $(".prev16_btn").removeClass("display-block");
      $(".prev16_btn").addClass("display-none");
      $(".prev15_btn").removeClass("display-none");
      $(".prev15_btn").addClass("display-block");
    }
    //if(current_time >= "15:00:00"){
      if(g1 < g2){
        $(".page16_btn").removeClass("display-none");
        $(".page16_btn").addClass("display-block");

        $(".comp_th_sixteen input").attr("readonly",true);
        $(".disp_th_sixteen input").attr("readonly",true);
        $(".elec_th_sixteen input").attr("readonly",true);
        $(".comp_th_sixteen input").addClass("readonlytxtbox");
        $(".disp_th_sixteen input").addClass("readonlytxtbox");
        $(".elec_th_sixteen input").addClass("readonlytxtbox");
      }
    //}
  }
  /*if((c_fifteen==0 && c_sixteen!=0) || (disp_fifteen==0 && disp_sixteen!=0) || (elec_fifteen==0 && elec_sixteen!=0)){
 //   if(current_time >= "16:00:00"){
  if(current_time >= "17:00:00"){

      $(".comp_th_fifteen").removeClass("tbl-cell");
      $(".comp_th_fifteen").addClass("display-none");
      $(".disp_th_fifteen").removeClass("tbl-cell");
      $(".disp_th_fifteen").addClass("display-none");
      $(".elec_th_fifteen").removeClass("tbl-cell");
      $(".elec_th_fifteen").addClass("display-none");

      //alert("current_time >= 16:00:00");
      $(".page16_btn").removeClass("display-none");
      $(".page16_btn").addClass("display-block");
      $(".page15_btn").removeClass("display-block");
      $(".page15_btn").addClass("display-none");

      $(".prev16_btn").removeClass("display-block");
      $(".prev16_btn").addClass("display-none");
      $(".prev15_btn").removeClass("display-none");
      $(".prev15_btn").addClass("display-block");
    }
    //if(current_time >= "15:00:00"){
      if(g1 < g2){
        $(".page16_btn").removeClass("display-none");
        $(".page16_btn").addClass("display-block");

        $(".comp_th_sixteen input").attr("readonly",true);
        $(".disp_th_sixteen input").attr("readonly",true);
        $(".elec_th_sixteen input").attr("readonly",true);
        $(".comp_th_sixteen input").addClass("readonlytxtbox");
        $(".disp_th_sixteen input").addClass("readonlytxtbox");
        $(".elec_th_sixteen input").addClass("readonlytxtbox");
      }
    //}
  }*/
  /*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    $(".page16_btn").removeClass("display-none");
    $(".page16_btn").addClass("display-block");

    $(".comp_th_sixteen input").attr("readonly",true);
    $(".disp_th_sixteen input").attr("readonly",true);
    $(".elec_th_sixteen input").attr("readonly",true);
    $(".comp_th_sixteen input").addClass("readonlytxtbox");
    $(".disp_th_sixteen input").addClass("readonlytxtbox");
    $(".elec_th_sixteen input").addClass("readonlytxtbox");
  }
}
function col_sixteen(c_sixteen,disp_sixteen,elec_sixteen,c_seventeen,disp_seventeen,elec_seventeen,current_time){
  console.log("SIXTEEN COL"+c_sixteen+"---disp_sixteen"+disp_sixteen+"-------elec_sixteen"+elec_sixteen+" c_seventeen"+c_seventeen+"----disp_seventeen "+disp_seventeen+"***** elec_seventeen"+elec_seventeen);

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(c_sixteen==0 && disp_sixteen==0 && elec_sixteen==0){
    //if(current_time >= "17:00:00"){
    if(current_time >= "18:00:00"){
      /*$(".val_comp_17").attr("readonly",false);
      $(".val_comp_17").removeClass("readonlytxtbox");
      $(".lcv3_mfm_17").attr("readonly",false);
      $(".lcv3_mfm_17").removeClass("readonlytxtbox");
      $(".lcv4_mfm_17").attr("readonly",false);
      $(".lcv4_mfm_17").removeClass("readonlytxtbox");
      $(".lcv5_mfm_17").attr("readonly",false);
      $(".lcv5_mfm_17").removeClass("readonlytxtbox");

      $(".val_disp_1_17").attr("readonly",false);
      $(".val_disp_1_17").removeClass("readonlytxtbox");
      $(".disp_2_a_17").attr("readonly",false);
      $(".disp_2_a_17").removeClass("readonlytxtbox");
      $(".disp_2_b_17").attr("readonly",false);
      $(".disp_2_b_17").removeClass("readonlytxtbox");*/
      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_17").attr("readonly",false);
          $(".val_comp_17").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_17").attr("readonly",false);
          $(".lcv"+l+"_mfm_17").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_17").attr("readonly",false);
          $(".val_disp_"+i+"_17").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_17").attr("readonly",false);
          $(".disp_"+i+"_a_17").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_17").attr("readonly",false);
          $(".disp_"+i+"_b_17").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_17").attr("readonly",false);
          $(".val_comp_17").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_17").attr("readonly",false);
          $(".lcv"+l+"_mfm_17").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_17").attr("readonly",false);
            $(".val_disp_"+i+"_17").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_17").attr("readonly",false);
            $(".disp_"+i+"_a_17").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_17").attr("readonly",false);
            $(".disp_"+i+"_b_17").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/

      $(".val_elec_17").attr("readonly",false);
      $(".val_elec_17").removeClass("readonlytxtbox");
    }
  }

  if((c_sixteen==0 && c_seventeen==0) && (disp_sixteen==0 && disp_seventeen==0) && (elec_sixteen==0 && elec_seventeen==0)){
  //  if(current_time >= "17:00:00"){
    if(current_time >= "18:00:00"){
      //alert("current_time >= 17:00:00");
      $(".page17_btn").removeClass("display-none");
      $(".page17_btn").addClass("display-block");
      $(".page16_btn").removeClass("display-block");
      $(".page16_btn").addClass("display-none");

      $(".prev17_btn").removeClass("display-block");
      $(".prev17_btn").addClass("display-none");
      $(".prev16_btn").removeClass("display-none");
      $(".prev16_btn").addClass("display-block");
    }
    //if(current_time >= "16:00:00"){
      if(g1 < g2){
        $(".page17_btn").removeClass("display-none");
        $(".page17_btn").addClass("display-block");

        $(".comp_th_seventeen input").attr("readonly",true);
        $(".disp_th_seventeen input").attr("readonly",true);
        $(".elec_th_seventeen input").attr("readonly",true);
        $(".comp_th_seventeen input").addClass("readonlytxtbox");
        $(".disp_th_seventeen input").addClass("readonlytxtbox");
        $(".elec_th_seventeen input").addClass("readonlytxtbox");
      }
    //}
  }
  /*if((c_sixteen==0 && c_seventeen!=0) || (disp_sixteen==0 && disp_seventeen!=0) || (elec_sixteen==0 && elec_seventeen!=0)){   
    //if(current_time >= "18:00:00"){
      //alert("current_time >= 17:00:00");
    if(current_time >= "18:00:00"){
      $(".comp_th_sixteen").removeClass("tbl-cell");
      $(".comp_th_sixteen").addClass("display-none");
      $(".disp_th_sixteen").removeClass("tbl-cell");
      $(".disp_th_sixteen").addClass("display-none");
      $(".elec_th_sixteen").removeClass("tbl-cell");
      $(".elec_th_sixteen").addClass("display-none");
    
      $(".page17_btn").removeClass("display-none");
      $(".page17_btn").addClass("display-block");
      $(".page16_btn").removeClass("display-block");
      $(".page16_btn").addClass("display-none");

      $(".prev17_btn").removeClass("display-block");
      $(".prev17_btn").addClass("display-none");
      $(".prev16_btn").removeClass("display-none");
      $(".prev16_btn").addClass("display-block");
    }
    //if(current_time >= "16:00:00"){
      if(g1 < g2){
        $(".page17_btn").removeClass("display-none");
        $(".page17_btn").addClass("display-block");

        $(".comp_th_seventeen input").attr("readonly",true);
        $(".disp_th_seventeen input").attr("readonly",true);
        $(".elec_th_seventeen input").attr("readonly",true);
        $(".comp_th_seventeen input").addClass("readonlytxtbox");
        $(".disp_th_seventeen input").addClass("readonlytxtbox");
        $(".elec_th_seventeen input").addClass("readonlytxtbox");
      }
    //}
  }*//*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    $(".page17_btn").removeClass("display-none");
    $(".page17_btn").addClass("display-block");

    $(".comp_th_seventeen input").attr("readonly",true);
    $(".disp_th_seventeen input").attr("readonly",true);
    $(".elec_th_seventeen input").attr("readonly",true);
    $(".comp_th_seventeen input").addClass("readonlytxtbox");
    $(".disp_th_seventeen input").addClass("readonlytxtbox");
    $(".elec_th_seventeen input").addClass("readonlytxtbox");
  }
}
function col_seventeen(c_seventeen,disp_seventeen,elec_seventeen,c_eighteen,disp_eightteen,elec_eighteen,current_time){
  console.log("SEVENTEEN COL"+c_seventeen+"---disp_seventeen"+disp_seventeen+"-------elec_seventeen"+elec_seventeen+" c_eighteen"+c_eighteen+"----disp_eightteen "+disp_eightteen+"***** elec_eighteen"+elec_eighteen);

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(c_seventeen==0 && disp_seventeen==0 && elec_seventeen==0){
 //   if(current_time >= "18:00:00"){
  if(current_time >= "19:00:00"){
      /*$(".val_comp_18").attr("readonly",false);
      $(".val_comp_18").removeClass("readonlytxtbox");
      $(".lcv3_mfm_18").attr("readonly",false);
      $(".lcv3_mfm_18").removeClass("readonlytxtbox");
      $(".lcv4_mfm_18").attr("readonly",false);
      $(".lcv4_mfm_18").removeClass("readonlytxtbox");
      $(".lcv5_mfm_18").attr("readonly",false);
      $(".lcv5_mfm_18").removeClass("readonlytxtbox");

      $(".val_disp_1_18").attr("readonly",false);
      $(".val_disp_1_18").removeClass("readonlytxtbox");
      $(".disp_2_a_18").attr("readonly",false);
      $(".disp_2_a_18").removeClass("readonlytxtbox");
      $(".disp_2_b_18").attr("readonly",false);
      $(".disp_2_b_18").removeClass("readonlytxtbox");*/

      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_18").attr("readonly",false);
          $(".val_comp_18").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_18").attr("readonly",false);
          $(".lcv"+l+"_mfm_18").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_18").attr("readonly",false);
          $(".val_disp_"+i+"_18").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_18").attr("readonly",false);
          $(".disp_"+i+"_a_18").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_18").attr("readonly",false);
          $(".disp_"+i+"_b_18").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_18").attr("readonly",false);
          $(".val_comp_18").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_18").attr("readonly",false);
          $(".lcv"+l+"_mfm_18").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_18").attr("readonly",false);
            $(".val_disp_"+i+"_18").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_18").attr("readonly",false);
            $(".disp_"+i+"_a_18").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_18").attr("readonly",false);
            $(".disp_"+i+"_b_18").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/

      $(".val_elec_18").attr("readonly",false);
      $(".val_elec_18").removeClass("readonlytxtbox");
    }
  }

  if((c_seventeen==0 && c_eighteen==0) && (disp_seventeen==0 && disp_eightteen==0) && (elec_seventeen==0 && elec_eighteen==0)){
 //   if(current_time >= "18:00:00"){
  if(current_time >= "19:00:00"){
      //alert("current_time >= 18:00:00");
      $(".page18_btn").removeClass("display-none");
      $(".page18_btn").addClass("display-block");
      $(".page17_btn").removeClass("display-block");
      $(".page17_btn").addClass("display-none");

      $(".prev18_btn").removeClass("display-block");
      $(".prev18_btn").addClass("display-none");
      $(".prev17_btn").removeClass("display-none");
      $(".prev17_btn").addClass("display-block");
    }

    //if(current_time >= "17:00:00"){
      if(g1 < g2){
        $(".page18_btn").removeClass("display-none");
        $(".page18_btn").addClass("display-block");

        $(".comp_th_eighteen input").attr("readonly",true);
        $(".disp_th_eighteen input").attr("readonly",true);
        $(".elec_th_eighteen input").attr("readonly",true);
        $(".comp_th_eighteen input").addClass("readonlytxtbox");
        $(".disp_th_eighteen input").addClass("readonlytxtbox");
        $(".elec_th_eighteen input").addClass("readonlytxtbox");
      }
    //}
  }
  /*if((c_seventeen==0 && c_eighteen!=0) || (disp_seventeen==0 && disp_eightteen!=0) || (elec_seventeen==0 && elec_eighteen!=0)){
 //   if(current_time >= "18:00:00"){
  if(current_time >= "19:00:00"){
      $(".comp_th_seventeen").removeClass("tbl-cell");
      $(".comp_th_seventeen").addClass("display-none");
      $(".disp_th_seventeen").removeClass("tbl-cell");
      $(".disp_th_seventeen").addClass("display-none");
      $(".elec_th_seventeen").removeClass("tbl-cell");
      $(".elec_th_seventeen").addClass("display-none");

      //alert("current_time >= 18:00:00");
      $(".page18_btn").removeClass("display-none");
      $(".page18_btn").addClass("display-block");
      $(".page17_btn").removeClass("display-block");
      $(".page17_btn").addClass("display-none");

      $(".prev18_btn").removeClass("display-block");
      $(".prev18_btn").addClass("display-none");
      $(".prev17_btn").removeClass("display-none");
      $(".prev17_btn").addClass("display-block");
    }

    //if(current_time >= "17:00:00"){
      if(g1 < g2){
        $(".page18_btn").removeClass("display-none");
        $(".page18_btn").addClass("display-block");

        $(".comp_th_eighteen input").attr("readonly",true);
        $(".disp_th_eighteen input").attr("readonly",true);
        $(".elec_th_eighteen input").attr("readonly",true);
        $(".comp_th_eighteen input").addClass("readonlytxtbox");
        $(".disp_th_eighteen input").addClass("readonlytxtbox");
        $(".elec_th_eighteen input").addClass("readonlytxtbox");
      }
    //}
  }*/
  /*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    $(".page18_btn").removeClass("display-none");
    $(".page18_btn").addClass("display-block");

    $(".comp_th_eighteen input").attr("readonly",true);
    $(".disp_th_eighteen input").attr("readonly",true);
    $(".elec_th_eighteen input").attr("readonly",true);
    $(".comp_th_eighteen input").addClass("readonlytxtbox");
    $(".disp_th_eighteen input").addClass("readonlytxtbox");
    $(".elec_th_eighteen input").addClass("readonlytxtbox");
  }
}
function col_eightteen(c_eighteen,disp_eightteen,elec_eighteen,c_nineteen,disp_nineteen,elec_nineteen,current_time){
  console.log("EIGHTTEEN COL"+c_eighteen+"---disp_eightteen"+disp_eightteen+"-------elec_eighteen"+elec_eighteen+" c_nineteen"+c_nineteen+"----disp_nineteen "+disp_nineteen+"***** elec_nineteen"+elec_nineteen);


  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);
  var st_id = $("#hidd_stid").val();

  if(c_eighteen==0 && disp_eightteen==0 && elec_eighteen==0){
    //if(current_time >= "19:00:00"){
    if(current_time >= "20:00:00"){
      /*$(".val_comp_19").attr("readonly",false);
      $(".val_comp_19").removeClass("readonlytxtbox");
      $(".lcv3_mfm_19").attr("readonly",false);
      $(".lcv3_mfm_19").removeClass("readonlytxtbox");
      $(".lcv4_mfm_19").attr("readonly",false);
      $(".lcv4_mfm_19").removeClass("readonlytxtbox");
      $(".lcv5_mfm_19").attr("readonly",false);
      $(".lcv5_mfm_19").removeClass("readonlytxtbox");

      $(".val_disp_1_19").attr("readonly",false);
      $(".val_disp_1_19").removeClass("readonlytxtbox");
      $(".disp_2_a_19").attr("readonly",false);
      $(".disp_2_a_19").removeClass("readonlytxtbox");
      $(".disp_2_b_19").attr("readonly",false);
      $(".disp_2_b_19").removeClass("readonlytxtbox");*/

      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_19").attr("readonly",false);
          $(".val_comp_19").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_19").attr("readonly",false);
          $(".lcv"+l+"_mfm_19").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_19").attr("readonly",false);
          $(".val_disp_"+i+"_19").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_19").attr("readonly",false);
          $(".disp_"+i+"_a_19").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_19").attr("readonly",false);
          $(".disp_"+i+"_b_19").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_19").attr("readonly",false);
          $(".val_comp_19").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_19").attr("readonly",false);
          $(".lcv"+l+"_mfm_19").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_19").attr("readonly",false);
            $(".val_disp_"+i+"_19").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_19").attr("readonly",false);
            $(".disp_"+i+"_a_19").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_19").attr("readonly",false);
            $(".disp_"+i+"_b_19").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/

      $(".val_elec_19").attr("readonly",false);
      $(".val_elec_19").removeClass("readonlytxtbox");
    }
  }

  if((c_eighteen==0 && c_nineteen==0) && (disp_eightteen==0 && disp_nineteen==0) && (elec_eighteen==0 && elec_nineteen==0)){
 //   if(current_time >= "19:00:00"){
if(current_time >= "20:00:00"){
      //alert("current_time >= 19:00:00");
      $(".page19_btn").removeClass("display-none");
      $(".page19_btn").addClass("display-block");
      $(".page18_btn").removeClass("display-block");
      $(".page18_btn").addClass("display-none");

      $(".prev19_btn").removeClass("display-block");
      $(".prev19_btn").addClass("display-none");
      $(".prev18_btn").removeClass("display-none");
      $(".prev18_btn").addClass("display-block");
    }
    //if(current_time >= "18:00:00"){
      if(g1 < g2){
        $(".page19_btn").removeClass("display-none");
        $(".page19_btn").addClass("display-block");

        $(".comp_th_nineteen input").attr("readonly",true);
        $(".disp_th_nineteen input").attr("readonly",true);
        $(".elec_th_nineteen input").attr("readonly",true);
        $(".comp_th_nineteen input").addClass("readonlytxtbox");
        $(".disp_th_nineteen input").addClass("readonlytxtbox");
        $(".elec_th_nineteen input").addClass("readonlytxtbox");
      }
    //}
  }
  /*if((c_eighteen==0 && c_nineteen!=0) || (disp_eightteen==0 && disp_nineteen!=0) || (elec_eighteen==0 && elec_nineteen!=0)){
 //   if(current_time >= "19:00:00"){
if(current_time >= "20:00:00"){

      $(".comp_th_eighteen").removeClass("tbl-cell");
      $(".comp_th_eighteen").addClass("display-none");
      $(".disp_th_eighteen").removeClass("tbl-cell");
      $(".disp_th_eighteen").addClass("display-none");
      $(".elec_th_eighteen").removeClass("tbl-cell");
      $(".elec_th_eighteen").addClass("display-none");

      //alert("current_time >= 19:00:00");
      $(".page19_btn").removeClass("display-none");
      $(".page19_btn").addClass("display-block");
      $(".page18_btn").removeClass("display-block");
      $(".page18_btn").addClass("display-none");

      $(".prev19_btn").removeClass("display-block");
      $(".prev19_btn").addClass("display-none");
      $(".prev18_btn").removeClass("display-none");
      $(".prev18_btn").addClass("display-block");
    }
    //if(current_time >= "18:00:00"){
      if(g1 < g2){
        $(".page19_btn").removeClass("display-none");
        $(".page19_btn").addClass("display-block");

        $(".comp_th_nineteen input").attr("readonly",true);
        $(".disp_th_nineteen input").attr("readonly",true);
        $(".elec_th_nineteen input").attr("readonly",true);
        $(".comp_th_nineteen input").addClass("readonlytxtbox");
        $(".disp_th_nineteen input").addClass("readonlytxtbox");
        $(".elec_th_nineteen input").addClass("readonlytxtbox");
      }
    //}
  }*/
  /*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
    $(".page19_btn").removeClass("display-none");
    $(".page19_btn").addClass("display-block");

    $(".comp_th_nineteen input").attr("readonly",true);
    $(".disp_th_nineteen input").attr("readonly",true);
    $(".elec_th_nineteen input").attr("readonly",true);
    $(".comp_th_nineteen input").addClass("readonlytxtbox");
    $(".disp_th_nineteen input").addClass("readonlytxtbox");
    $(".elec_th_nineteen input").addClass("readonlytxtbox");
  }
}
function col_nineteen(c_nineteen,disp_nineteen,elec_nineteen,c_twenty,disp_twenty,elec_twenty,current_time){
  console.log("NINETEEN COL"+c_nineteen+"---disp_nineteen"+disp_nineteen+"-------elec_nineteen"+elec_nineteen+" c_twenty"+c_twenty+"----disp_twenty "+disp_twenty+"***** elec_twenty"+elec_twenty);

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(c_nineteen==0 && disp_nineteen==0 && elec_nineteen==0){
  //  if(current_time >= "20:00:00"){
  if(current_time >= "21:00:00"){
      /*$(".val_comp_20").attr("readonly",false);
      $(".val_comp_20").removeClass("readonlytxtbox");
      $(".lcv3_mfm_20").attr("readonly",false);
      $(".lcv3_mfm_20").removeClass("readonlytxtbox");
      $(".lcv4_mfm_20").attr("readonly",false);
      $(".lcv4_mfm_20").removeClass("readonlytxtbox");
      $(".lcv5_mfm_20").attr("readonly",false);
      $(".lcv5_mfm_20").removeClass("readonlytxtbox");

      $(".val_disp_1_20").attr("readonly",false);
      $(".val_disp_1_20").removeClass("readonlytxtbox");
      $(".disp_2_a_20").attr("readonly",false);
      $(".disp_2_a_20").removeClass("readonlytxtbox");
      $(".disp_2_b_20").attr("readonly",false);
      $(".disp_2_b_20").removeClass("readonlytxtbox");*/
      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_20").attr("readonly",false);
          $(".val_comp_20").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_20").attr("readonly",false);
          $(".lcv"+l+"_mfm_20").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_20").attr("readonly",false);
          $(".val_disp_"+i+"_20").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_20").attr("readonly",false);
          $(".disp_"+i+"_a_20").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_20").attr("readonly",false);
          $(".disp_"+i+"_b_20").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_20").attr("readonly",false);
          $(".val_comp_20").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_20").attr("readonly",false);
          $(".lcv"+l+"_mfm_20").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_20").attr("readonly",false);
            $(".val_disp_"+i+"_20").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_20").attr("readonly",false);
            $(".disp_"+i+"_a_20").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_20").attr("readonly",false);
            $(".disp_"+i+"_b_20").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/

      $(".val_elec_20").attr("readonly",false);
      $(".val_elec_20").removeClass("readonlytxtbox");
    }
  }

  if((c_nineteen==0 && c_twenty==0) && (disp_nineteen==0 && disp_twenty==0) && (elec_nineteen==0 && elec_twenty==0)){
 //   if(current_time >= "20:00:00"){
  if(current_time >= "21:00:00"){
      //alert("current_time >= 20:00:00");
      $(".page20_btn").removeClass("display-none");
      $(".page20_btn").addClass("display-block");
      $(".page19_btn").removeClass("display-block");
      $(".page19_btn").addClass("display-none");

      $(".prev20_btn").removeClass("display-block");
      $(".prev20_btn").addClass("display-none");
      $(".prev19_btn").removeClass("display-none");
      $(".prev19_btn").addClass("display-block");
    }
    //if(current_time >= "19:00:00"){
      if(g1 < g2){
        $(".page20_btn").removeClass("display-none");
        $(".page20_btn").addClass("display-block");

        $(".comp_th_twenty input").attr("readonly",true);
        $(".disp_th_twenty input").attr("readonly",true);
        $(".elec_th_twenty input").attr("readonly",true);
        $(".comp_th_twenty input").addClass("readonlytxtbox");
        $(".disp_th_twenty input").addClass("readonlytxtbox");
        $(".elec_th_twenty input").addClass("readonlytxtbox");
      }
    //}
  }
  /*if((c_nineteen==0 && c_twenty!=0) || (disp_nineteen==0 && disp_twenty!=0) || (elec_nineteen==0 && elec_twenty!=0)){
 //   if(current_time >= "20:00:00"){
  if(current_time >= "21:00:00"){

      $(".comp_th_nineteen").removeClass("tbl-cell");
      $(".comp_th_nineteen").addClass("display-none");
      $(".disp_th_nineteen").removeClass("tbl-cell");
      $(".disp_th_nineteen").addClass("display-none");
      $(".elec_th_nineteen").removeClass("tbl-cell");
      $(".elec_th_nineteen").addClass("display-none");

      //alert("current_time >= 20:00:00");
      $(".page20_btn").removeClass("display-none");
      $(".page20_btn").addClass("display-block");
      $(".page19_btn").removeClass("display-block");
      $(".page19_btn").addClass("display-none");

      $(".prev20_btn").removeClass("display-block");
      $(".prev20_btn").addClass("display-none");
      $(".prev19_btn").removeClass("display-none");
      $(".prev19_btn").addClass("display-block");
    }
    //if(current_time >= "19:00:00"){
      if(g1 < g2){
        $(".page20_btn").removeClass("display-none");
        $(".page20_btn").addClass("display-block");

        $(".comp_th_twenty input").attr("readonly",true);
        $(".disp_th_twenty input").attr("readonly",true);
        $(".elec_th_twenty input").attr("readonly",true);
        $(".comp_th_twenty input").addClass("readonlytxtbox");
        $(".disp_th_twenty input").addClass("readonlytxtbox");
        $(".elec_th_twenty input").addClass("readonlytxtbox");
      }
    //}
  }*//*else{
    alert("ELSE");
  }*/
  if(g1 < g2){
        $(".page20_btn").removeClass("display-none");
        $(".page20_btn").addClass("display-block");

        $(".comp_th_twenty input").attr("readonly",true);
        $(".disp_th_twenty input").attr("readonly",true);
        $(".elec_th_twenty input").attr("readonly",true);
        $(".comp_th_twenty input").addClass("readonlytxtbox");
        $(".disp_th_twenty input").addClass("readonlytxtbox");
        $(".elec_th_twenty input").addClass("readonlytxtbox");
      }
}
function col_twenty(c_twenty,disp_twenty,elec_twenty,c_twentyone,disp_twentyone,elec_twentyone,current_time){
  console.log("TWENTY COL"+c_twenty+"---disp_twenty"+disp_twenty+"-------elec_twenty"+elec_twenty+" c_twentyone"+c_twentyone+"----disp_twentyone "+disp_twentyone+"***** elec_twentyone"+elec_twentyone);

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(c_twenty==0 && disp_twenty==0 && elec_twenty==0){
    //if(current_time >= "21:00:00"){
    if(current_time >= "22:00:00"){
      /*$(".val_comp_21").attr("readonly",false);
      $(".val_comp_21").removeClass("readonlytxtbox");
      $(".lcv3_mfm_21").attr("readonly",false);
      $(".lcv3_mfm_21").removeClass("readonlytxtbox");
      $(".lcv4_mfm_21").attr("readonly",false);
      $(".lcv4_mfm_21").removeClass("readonlytxtbox");
      $(".lcv5_mfm_21").attr("readonly",false);
      $(".lcv5_mfm_21").removeClass("readonlytxtbox");

      $(".val_disp_1_21").attr("readonly",false);
      $(".val_disp_1_21").removeClass("readonlytxtbox");
      $(".disp_2_a_21").attr("readonly",false);
      $(".disp_2_a_21").removeClass("readonlytxtbox");
      $(".disp_2_b_21").attr("readonly",false);
      $(".disp_2_b_21").removeClass("readonlytxtbox");*/
      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_21").attr("readonly",false);
          $(".val_comp_21").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_21").attr("readonly",false);
          $(".lcv"+l+"_mfm_21").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_21").attr("readonly",false);
          $(".val_disp_"+i+"_21").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_21").attr("readonly",false);
          $(".disp_"+i+"_a_21").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_21").attr("readonly",false);
          $(".disp_"+i+"_b_21").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_21").attr("readonly",false);
          $(".val_comp_21").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_21").attr("readonly",false);
          $(".lcv"+l+"_mfm_21").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_21").attr("readonly",false);
            $(".val_disp_"+i+"_21").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_21").attr("readonly",false);
            $(".disp_"+i+"_a_21").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_21").attr("readonly",false);
            $(".disp_"+i+"_b_21").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/

      $(".val_elec_21").attr("readonly",false);
      $(".val_elec_21").removeClass("readonlytxtbox");
    }
  }

  if((c_twenty==0 && c_twentyone==0) && (disp_twenty==0 && disp_twentyone==0) && (elec_twenty==0 && elec_twentyone==0)){
    //if(current_time >= "21:00:00"){
    if(current_time >= "22:00:00"){
      //alert("current_time >= 21:00:00");
      $(".page21_btn").removeClass("display-none");
      $(".page21_btn").addClass("display-block");
      $(".page20_btn").removeClass("display-block");
      $(".page20_btn").addClass("display-none");

      $(".prev21_btn").removeClass("display-block");
      $(".prev21_btn").addClass("display-none");
      $(".prev20_btn").removeClass("display-none");
      $(".prev20_btn").addClass("display-block");
    }
    //if(current_time >= "20:00:00"){
      if(g1 < g2){
        $(".page21_btn").removeClass("display-none");
        $(".page21_btn").addClass("display-block");

        $(".comp_th_twentyone input").attr("readonly",true);
        $(".disp_th_twentyone input").attr("readonly",true);
        $(".elec_th_twentyone input").attr("readonly",true);
        $(".comp_th_twentyone input").addClass("readonlytxtbox");
        $(".disp_th_twentyone input").addClass("readonlytxtbox");
        $(".elec_th_twentyone input").addClass("readonlytxtbox");
      }
    //}
  }
  /*if((c_twenty==0 && c_twentyone!=0) || (disp_twenty==0 && disp_twentyone!=0) || (elec_twenty==0 && elec_twentyone!=0)){
    //if(current_time >= "21:00:00"){
    if(current_time >= "22:00:00"){
      $(".comp_th_twenty").removeClass("tbl-cell");
      $(".comp_th_twenty").addClass("display-none");
      $(".disp_th_twenty").removeClass("tbl-cell");
      $(".disp_th_twenty").addClass("display-none");
      $(".elec_th_twenty").removeClass("tbl-cell");
      $(".elec_th_twenty").addClass("display-none");

      //alert("current_time >= 21:00:00");
      $(".page21_btn").removeClass("display-none");
      $(".page21_btn").addClass("display-block");
      $(".page20_btn").removeClass("display-block");
      $(".page20_btn").addClass("display-none");

      $(".prev21_btn").removeClass("display-block");
      $(".prev21_btn").addClass("display-none");
      $(".prev20_btn").removeClass("display-none");
      $(".prev20_btn").addClass("display-block");
    }
    //if(current_time >= "20:00:00"){
      if(g1 < g2){
        $(".page21_btn").removeClass("display-none");
        $(".page21_btn").addClass("display-block");

        $(".comp_th_twentyone input").attr("readonly",true);
        $(".disp_th_twentyone input").attr("readonly",true);
        $(".elec_th_twentyone input").attr("readonly",true);
        $(".comp_th_twentyone input").addClass("readonlytxtbox");
        $(".disp_th_twentyone input").addClass("readonlytxtbox");
        $(".elec_th_twentyone input").addClass("readonlytxtbox");
      }
    //}
  }

  if(g1 < g2){
    $(".page21_btn").removeClass("display-none");
    $(".page21_btn").addClass("display-block");

    $(".comp_th_twentyone input").attr("readonly",true);
    $(".disp_th_twentyone input").attr("readonly",true);
    $(".elec_th_twentyone input").attr("readonly",true);
    $(".comp_th_twentyone input").addClass("readonlytxtbox");
    $(".disp_th_twentyone input").addClass("readonlytxtbox");
    $(".elec_th_twentyone input").addClass("readonlytxtbox");
  }*/
      /*else{
    alert("ELSE");
  }*/
}
function col_twentyone(c_twentyone,disp_twentyone,elec_twentyone,c_twentytwo,disp_twentytwo,elec_twentytwo,current_time){
  console.log("TWENTYONE COL"+c_twentyone+"---disp_twentyone"+disp_twentyone+"-------elec_twentyone"+elec_twentyone+" c_twentytwo"+c_twentytwo+"----disp_twentytwo "+disp_twentytwo+"***** elec_twentytwo"+elec_twentytwo);

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);

  if(c_twentyone==0 && disp_twentyone==0 && elec_twentyone==0){
    //if(current_time >= "22:00:00"){
    if(current_time >= "23:00:00"){
      /*$(".val_comp_22").attr("readonly",false);
      $(".val_comp_22").removeClass("readonlytxtbox");
      $(".lcv3_mfm_22").attr("readonly",false);
      $(".lcv3_mfm_22").removeClass("readonlytxtbox");
      $(".lcv4_mfm_22").attr("readonly",false);
      $(".lcv4_mfm_22").removeClass("readonlytxtbox");
      $(".lcv5_mfm_22").attr("readonly",false);
      $(".lcv5_mfm_22").removeClass("readonlytxtbox");

      $(".val_disp_1_22").attr("readonly",false);
      $(".val_disp_1_22").removeClass("readonlytxtbox");
      $(".disp_2_a_22").attr("readonly",false);
      $(".disp_2_a_22").removeClass("readonlytxtbox");
      $(".disp_2_b_22").attr("readonly",false);
      $(".disp_2_b_22").removeClass("readonlytxtbox");*/
      var st_id = $("#hidd_stid").val();
      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_22").attr("readonly",false);
          $(".val_comp_22").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_22").attr("readonly",false);
          $(".lcv"+l+"_mfm_22").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_22").attr("readonly",false);
          $(".val_disp_"+i+"_22").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_22").attr("readonly",false);
          $(".disp_"+i+"_a_22").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_22").attr("readonly",false);
          $(".disp_"+i+"_b_22").removeClass("readonlytxtbox");          
        }
      }
      /*if(g1 >= g2){  
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_22").attr("readonly",false);
          $(".val_comp_22").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_22").attr("readonly",false);
          $(".lcv"+l+"_mfm_22").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_22").attr("readonly",false);
            $(".val_disp_"+i+"_22").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_22").attr("readonly",false);
            $(".disp_"+i+"_a_22").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_22").attr("readonly",false);
            $(".disp_"+i+"_b_22").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/

      $(".val_elec_22").attr("readonly",false);
      $(".val_elec_22").removeClass("readonlytxtbox");
    }
  }

  if((c_twentyone==0 && c_twentytwo==0) && (disp_twentyone==0 && disp_twentytwo==0) && (elec_twentyone==0 && elec_twentytwo==0)){
    //if(current_time >= "22:00:00"){
    if(current_time >= "23:00:00"){
      //alert("current_time >= 22:00:00");
      $(".page22_btn").removeClass("display-none");
      $(".page22_btn").addClass("display-block");
      $(".page21_btn").removeClass("display-block");
      $(".page21_btn").addClass("display-none");

      $(".prev22_btn").removeClass("display-block");
      $(".prev22_btn").addClass("display-none");
      $(".prev21_btn").removeClass("display-none");
      $(".prev21_btn").addClass("display-block");
    }
    //if(current_time >= "21:00:00"){
      if(g1 < g2){
        $(".page22_btn").removeClass("display-none");
        $(".page22_btn").addClass("display-block");

        $(".comp_th_twentytwo input").attr("readonly",true);
        $(".disp_th_twentytwo input").attr("readonly",true);
        $(".elec_th_twentytwo input").attr("readonly",true);
        $(".comp_th_twentytwo input").addClass("readonlytxtbox");
        $(".disp_th_twentytwo input").addClass("readonlytxtbox");
        $(".elec_th_twentytwo input").addClass("readonlytxtbox");
      }
    //}
  }

  /*if((c_twentyone==0 && c_twentytwo!=0) || (disp_twentyone==0 && disp_twentytwo!=0) || (elec_twentyone==0 && elec_twentytwo!=0)){
    //if(current_time >= "22:00:00"){
    if(current_time >= "23:00:00"){

      $(".comp_th_twentyone").removeClass("tbl-cell");
      $(".comp_th_twentyone").addClass("display-none");
      $(".disp_th_twentyone").removeClass("tbl-cell");
      $(".disp_th_twentyone").addClass("display-none");
      $(".elec_th_twentyone").removeClass("tbl-cell");
      $(".elec_th_twentyone").addClass("display-none");

      //alert("current_time >= 22:00:00");
      $(".page22_btn").removeClass("display-none");
      $(".page22_btn").addClass("display-block");
      $(".page21_btn").removeClass("display-block");
      $(".page21_btn").addClass("display-none");

      $(".prev22_btn").removeClass("display-block");
      $(".prev22_btn").addClass("display-none");
      $(".prev21_btn").removeClass("display-none");
      $(".prev21_btn").addClass("display-block");
    }
    //if(current_time >= "21:00:00"){
      if(g1 < g2){
        $(".page22_btn").removeClass("display-none");
        $(".page22_btn").addClass("display-block");

        $(".comp_th_twentytwo input").attr("readonly",true);
        $(".disp_th_twentytwo input").attr("readonly",true);
        $(".elec_th_twentytwo input").attr("readonly",true);
        $(".comp_th_twentytwo input").addClass("readonlytxtbox");
        $(".disp_th_twentytwo input").addClass("readonlytxtbox");
        $(".elec_th_twentytwo input").addClass("readonlytxtbox");
      }
    //}
  }*/


  if(g1 < g2){
        $(".page22_btn").removeClass("display-none");
        $(".page22_btn").addClass("display-block");

        $(".comp_th_twentytwo input").attr("readonly",true);
        $(".disp_th_twentytwo input").attr("readonly",true);
        $(".elec_th_twentytwo input").attr("readonly",true);
        $(".comp_th_twentytwo input").addClass("readonlytxtbox");
        $(".disp_th_twentytwo input").addClass("readonlytxtbox");
        $(".elec_th_twentytwo input").addClass("readonlytxtbox");
      }/*else{
    alert("ELSE");
  }*/
}
function col_twentytwo(c_twentytwo,disp_twentytwo,elec_twentytwo,c_twentthree,disp_twentthree,elec_twentthree,current_time){
  console.log("TWENTYTWO COL"+c_twentytwo+"---disp_twentytwo"+disp_twentytwo+"-------elec_twentytwo"+elec_twentytwo+" c_twentthree"+c_twentthree+"----disp_twentthree "+disp_twentthree+"***** elec_twentthree"+elec_twentthree);

  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  //var today_dt = ((''+day).length<2 ? '0' : '') + day +'-' +    ((''+month).length<2 ? '0' : '') + month + '-' +    d.getFullYear();
  var today_dt = d.getFullYear()+'-'+((''+month).length<2 ? '0' : '') + month + '-'+((''+day).length<2 ? '0' : '') + day;
  var split_hiddt = hidd_dprdt.split("-");
  var split_yr = split_hiddt[2];
  var split_mn = split_hiddt[1];
  var split_dt = split_hiddt[0];
  var today_yr =d.getFullYear();
  var today_mn = month;
  var today_dt = day;
  var hiddt = split_yr+"-"+split_mn+"-"+split_dt;
  var g1 = new Date(split_yr, split_mn, split_dt);  
  var g2 = new Date(today_yr, today_mn, today_dt);
  var st_id = $("#hidd_stid").val();
  if(c_twentytwo==0 && disp_twentytwo==0 && elec_twentytwo==0){
    //alert("QQQQQQQQ");
    //if(current_time >= "23:00:00"){
    if(current_time >= "24:00:00"){
      //alert("+=+");
      /*$(".val_comp_23").attr("readonly",false);
      $(".val_comp_23").removeClass("readonlytxtbox");
      $(".lcv3_mfm_23").attr("readonly",false);
      $(".lcv3_mfm_23").removeClass("readonlytxtbox");
      $(".lcv4_mfm_23").attr("readonly",false);
      $(".lcv4_mfm_23").removeClass("readonlytxtbox");
      $(".lcv5_mfm_23").attr("readonly",false);
      $(".lcv5_mfm_23").removeClass("readonlytxtbox");

      $(".val_disp_1_23").attr("readonly",false);
      $(".val_disp_1_23").removeClass("readonlytxtbox");
      $(".disp_2_a_23").attr("readonly",false);
      $(".disp_2_a_23").removeClass("readonlytxtbox");
      $(".disp_2_b_23").attr("readonly",false);
      $(".disp_2_b_23").removeClass("readonlytxtbox");*/

      var dispanser_count = $("#hidd_dispcnt").val();
      var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      for(var l=1;l<=lcv_count;l++){
          $(".val_comp_23").attr("readonly",false);
          $(".val_comp_23").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_23").attr("readonly",false);
          $(".lcv"+l+"_mfm_23").removeClass("readonlytxtbox");
        }
        for(var i=1;i<=dispanser_count;i++){
          $(".val_disp_"+i+"_23").attr("readonly",false);
          $(".val_disp_"+i+"_23").removeClass("readonlytxtbox");
          $(".disp_"+i+"_a_23").attr("readonly",false);
          $(".disp_"+i+"_a_23").removeClass("readonlytxtbox");
          $(".disp_"+i+"_b_23").attr("readonly",false);
          $(".disp_"+i+"_b_23").removeClass("readonlytxtbox");          
        }
      }
      
      /*if(g1 >= g2){  
      //alert("~~~~~~~~~");
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/getDispensors',
        data:{'station_id':st_id},
        success:function(result){
        //console.log("console.log ******************");
        var parse_res = $.parseJSON(result);
        var dispanser_count = parse_res.dispanser_count;
        var station_info = parse_res.station_info;
        var lcv_count = station_info.lcv_count;
        for(var l=1;l<=lcv_count;l++){
          $(".val_comp_23").attr("readonly",false);
          $(".val_comp_23").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_23").attr("readonly",false);
          $(".lcv"+l+"_mfm_23").removeClass("readonlytxtbox");
        }
        var disp_html = '';        
        //console.log("dispanser_count" +dispanser_count);
          for(var i=1;i<=dispanser_count;i++){
            $(".val_disp_"+i+"_23").attr("readonly",false);
            $(".val_disp_"+i+"_23").removeClass("readonlytxtbox");
            $(".disp_"+i+"_a_23").attr("readonly",false);
            $(".disp_"+i+"_a_23").removeClass("readonlytxtbox");
            $(".disp_"+i+"_b_23").attr("readonly",false);
            $(".disp_"+i+"_b_23").removeClass("readonlytxtbox");          
          }
        }
      }); 
    }*/

      $(".val_elec_23").attr("readonly",false);
      $(".val_elec_23").removeClass("readonlytxtbox");
    }
  }


  if((c_twentytwo==0 && c_twentthree==0) && (disp_twentytwo==0 && disp_twentthree==0) && (elec_twentytwo==0 && elec_twentthree==0)){
    //if(current_time >= "23:00:00"){
    if(current_time >= "24:00:00"){
      //alert("current_time >= 23:00:00");
      $(".page23_btn").removeClass("display-none");
      $(".page23_btn").addClass("display-block");
      $(".page22_btn").removeClass("display-block");
      $(".page22_btn").addClass("display-none");

      $(".prev23_btn").removeClass("display-block");
      $(".prev23_btn").addClass("display-none");
      $(".prev22_btn").removeClass("display-none");
      $(".prev22_btn").addClass("display-block");
    }
    //if(current_time >= "22:00:00"){
      if(g1 < g2){
        //alert("@@@@@");
        //$(".page23_btn").removeClass("display-none");
        //$(".page23_btn").addClass("display-block");
        $(".save_btn").removeClass("display-none");
        $(".save_btn").addClass("display-block");

        $(".comp_th_twentythree input").attr("readonly",true);
        $(".disp_th_twentythree input").attr("readonly",true);
        $(".elec_th_twentythree input").attr("readonly",true);
        $(".comp_th_twentythree input").addClass("readonlytxtbox");
        $(".disp_th_twentythree input").addClass("readonlytxtbox");
        $(".elec_th_twentythree input").addClass("readonlytxtbox");


      //alert("~~~~~~~~~");
       
    
      } 
    //}
  }
  /*if((c_twentytwo==0 && c_twentthree!=0) || (disp_twentytwo==0 && disp_twentthree!=0) || (elec_twentytwo==0 && elec_twentthree!=0)){
    //if(current_time >= "23:00:00"){
    if(current_time >= "24:00:00"){
      //alert("current_time >= 23:00:00");

      $(".comp_th_twentytwo").removeClass("tbl-cell");
      $(".comp_th_twentytwo").addClass("display-none");
      $(".disp_th_twentytwo").removeClass("tbl-cell");
      $(".disp_th_twentytwo").addClass("display-none");
      $(".elec_th_twentytwo").removeClass("tbl-cell");
      $(".elec_th_twentytwo").addClass("display-none");


      $(".page23_btn").removeClass("display-none");
      $(".page23_btn").addClass("display-block");
      $(".page22_btn").removeClass("display-block");
      $(".page22_btn").addClass("display-none");

      $(".prev23_btn").removeClass("display-block");
      $(".prev23_btn").addClass("display-none");
      $(".prev22_btn").removeClass("display-none");
      $(".prev22_btn").addClass("display-block");
    }
    //if(current_time >= "22:00:00"){
      if(g1 < g2){
        //alert("@@@@@");
        //$(".page23_btn").removeClass("display-none");
        //$(".page23_btn").addClass("display-block");
        $(".save_btn").removeClass("display-none");
        $(".save_btn").addClass("display-block");

        $(".comp_th_twentythree input").attr("readonly",true);
        $(".disp_th_twentythree input").attr("readonly",true);
        $(".elec_th_twentythree input").attr("readonly",true);
        $(".comp_th_twentythree input").addClass("readonlytxtbox");
        $(".disp_th_twentythree input").addClass("readonlytxtbox");
        $(".elec_th_twentythree input").addClass("readonlytxtbox");      //alert("~~~~~~~~~");   
      } 
    //}
  }*/
  /*else{
    //alert("ELSE");
    
  }*/
  if(g1 < g2){
      $(".save_btn").removeClass("display-none");
        $(".save_btn").addClass("display-block");
        $(".comp_th_twentythree input").attr("readonly",true);
        $(".disp_th_twentythree input").attr("readonly",true);
        $(".elec_th_twentythree input").attr("readonly",true);
        $(".comp_th_twentythree input").addClass("readonlytxtbox");
        $(".disp_th_twentythree input").addClass("readonlytxtbox");
        $(".elec_th_twentythree input").addClass("readonlytxtbox");
    }
}
/*function showdprkpi_inputs(){
  $("#dprul").removeClass("display-none");
  $("#dprul").addClass("display-block");
  $(".genrptbtn").removeClass("display-none");
  $(".genrptbtn").addClass("display-block");
}*/
function dpr_kpi_repsheet(){
  //alert("called");
  checkConnection();
  app.preloader.show();
  var station_id = $("#station_id").val();
  var st_name = $("#station_id option:selected").text();
  var demo_calendar_modal_dpr = $("#demo-calendar-modal-dpr").val();
  if(station_id==''){
    app.dialog.alert("Select Station");
  }else if(demo_calendar_modal_dpr==''){
    app.dialog.alert("Select Date");
  }else{
    mainView.router.navigate("/dpr_kpi_rep/"+station_id+"/"+demo_calendar_modal_dpr+"/"+st_name+"/");
  }
  app.preloader.hide();
}
$(document).on('page:init', '.page[data-name="dpr_kpi_rep"]', function (page) {
  menuload();
  checkConnection();
  var station_id = page.detail.route.params.station_id;
  var dpr_date = page.detail.route.params.demo_calendar_modal_dpr;
  var station_name = page.detail.route.params.st_name;

  $("#hidd_stid_rep").val(station_id);
  $("#hidd_dprdt_rep").val(dpr_date);
  $(".st_name_rep").html(station_name);
  $(".dpr_dt_rep").html(dpr_date);

  app.preloader.show();   
  $.ajax({
    type:'POST',   
    url:base_url+'APP/Appcontroller/getDPR',
    data:{'station_id':station_id,'dpr_date':dpr_date},  
    success:function(dprData){    
      //app.preloader.show(); 
      var parsedpr = $.parseJSON(dprData);
      var no_dpr = parsedpr.no_dpr;
      if(no_dpr=="no_dpr"){
        app.preloader.hide(); 
        $(".form_dpr").removeClass("display-block");
        $(".form_dpr").addClass("display-none");
        $(".no_data").html("<span class='fw-600 text-red'>No DPR Found.</span>");
        return false;
      }

      //var dpr_kpi = parsedpr.dpr_kpi;
      $(".form_dpr").removeClass("display-none");
      $(".form_dpr").addClass("display-block");
      // ------------- SALE -------------- //
      var sale_0 = parsedpr.sale_sum_zero;
      var sale_1 = parsedpr.sale_sum_one;
      var sale_2 = parsedpr.sale_sum_two;
      var sale_3 = parsedpr.sale_sum_three;
      var sale_4 = parsedpr.sale_sum_four;
      var sale_5 = parsedpr.sale_sum_five;
      var sale_6 = parsedpr.sale_sum_six;
      var sale_7 = parsedpr.sale_sum_seven;
      var sale_8 = parsedpr.sale_sum_eight;
      var sale_9 = parsedpr.sale_sum_nine;
      var sale_10 = parsedpr.sale_sum_ten;
      var sale_11 = parsedpr.sale_sum_eleven;
      var sale_12 = parsedpr.sale_sum_twelve;
      var sale_13 = parsedpr.sale_sum_thirteen;
      var sale_14 = parsedpr.sale_sum_fourteen;
      var sale_15 = parsedpr.sale_sum_fifteen;
      var sale_16 = parsedpr.sale_sum_sixteen;
      var sale_17 = parsedpr.sale_sum_seventeen;
      var sale_18 = parsedpr.sale_sum_eighteen;
      var sale_19 = parsedpr.sale_sum_nineteen;
      var sale_20 = parsedpr.sale_sum_twenty;
      var sale_21 = parsedpr.sale_sum_twentyone;
      var sale_22 = parsedpr.sale_sum_twentytwo;
      var sale_23 = parsedpr.sale_sum_twentythree; 
      $(".sale_0").html(sale_0);
      $(".sale_1").html(sale_1);
      $(".sale_2").html(sale_2);
      $(".sale_3").html(sale_3);
      $(".sale_4").html(sale_4);
      $(".sale_5").html(sale_5);
      $(".sale_6").html(sale_6);
      $(".sale_7").html(sale_7);
      $(".sale_8").html(sale_8);
      $(".sale_9").html(sale_9);
      $(".sale_10").html(sale_10);
      $(".sale_11").html(sale_11);
      $(".sale_12").html(sale_12);
      $(".sale_13").html(sale_13);
      $(".sale_14").html(sale_14);
      $(".sale_15").html(sale_15);
      $(".sale_16").html(sale_16);
      $(".sale_17").html(sale_17);
      $(".sale_18").html(sale_18);
      $(".sale_19").html(sale_19);
      $(".sale_20").html(sale_20);
      $(".sale_21").html(sale_21);
      $(".sale_22").html(sale_22);
      $(".sale_23").html(sale_23);
      // -------------  COMP.SUCTION ---------------- //
      var comp_suc_1 = parsedpr.comp_suc_one;
      var comp_suc_2 = parsedpr.comp_suc_two;
      var comp_suc_3 = parsedpr.comp_suc_three;
      var comp_suc_4 = parsedpr.comp_suc_four;
      var comp_suc_5 = parsedpr.comp_suc_five;
      var comp_suc_6 = parsedpr.comp_suc_six;
      var comp_suc_7 = parsedpr.comp_suc_seven;
      var comp_suc_8 = parsedpr.comp_suc_eight;
      var comp_suc_9 = parsedpr.comp_suc_nine;
      var comp_suc_10 = parsedpr.comp_suc_ten;
      var comp_suc_11 = parsedpr.comp_suc_eleven;
      var comp_suc_12 = parsedpr.comp_suc_twelve;
      var comp_suc_13 = parsedpr.comp_suc_thirteen;
      var comp_suc_14 = parsedpr.comp_suc_fourteen;
      var comp_suc_15 = parsedpr.comp_suc_fifteen;
      var comp_suc_16 = parsedpr.comp_suc_sixteen;
      var comp_suc_17 = parsedpr.comp_suc_seventeen;
      var comp_suc_18 = parsedpr.comp_suc_eighteen;
      var comp_suc_19 = parsedpr.comp_suc_nineteen;
      var comp_suc_20 = parsedpr.comp_suc_twenty;
      var comp_suc_21 = parsedpr.comp_suc_twentyone;
      var comp_suc_22 = parsedpr.comp_suc_twentytwo;
      var comp_suc_23 = parsedpr.comp_suc_twentythree;      
      $(".comp_suc_1").html(comp_suc_1);
      $(".comp_suc_2").html(comp_suc_2);
      $(".comp_suc_3").html(comp_suc_3);
      $(".comp_suc_4").html(comp_suc_4);
      $(".comp_suc_5").html(comp_suc_5);
      $(".comp_suc_6").html(comp_suc_6);
      $(".comp_suc_7").html(comp_suc_7);
      $(".comp_suc_8").html(comp_suc_8);
      $(".comp_suc_9").html(comp_suc_9);
      $(".comp_suc_10").html(comp_suc_10);
      $(".comp_suc_11").html(comp_suc_11);
      $(".comp_suc_12").html(comp_suc_12);
      $(".comp_suc_13").html(comp_suc_13);
      $(".comp_suc_14").html(comp_suc_14);
      $(".comp_suc_15").html(comp_suc_15);
      $(".comp_suc_16").html(comp_suc_16);
      $(".comp_suc_17").html(comp_suc_17);
      $(".comp_suc_18").html(comp_suc_18);
      $(".comp_suc_19").html(comp_suc_19);
      $(".comp_suc_20").html(comp_suc_20);
      $(".comp_suc_21").html(comp_suc_21);
      $(".comp_suc_22").html(comp_suc_22);
      $(".comp_suc_23").html(comp_suc_23);
      // -------------  COMP.DISCHARGE ---------------- //
      var comp_disc_1 = parsedpr.comp_dischrg_one;
      var comp_disc_2 = parsedpr.comp_dischrg_two;
      var comp_disc_3 = parsedpr.comp_dischrg_three;
      var comp_disc_4 = parsedpr.comp_dischrg_four;
      var comp_disc_5 = parsedpr.comp_dischrg_five;
      var comp_disc_6 = parsedpr.comp_dischrg_six;
      var comp_disc_7 = parsedpr.comp_dischrg_seven;
      var comp_disc_8 = parsedpr.comp_dischrg_eight;
      var comp_disc_9 = parsedpr.comp_dischrg_nine;
      var comp_disc_10 = parsedpr.comp_dischrg_ten;
      var comp_disc_11 = parsedpr.comp_dischrg_eleven;
      var comp_disc_12 = parsedpr.comp_dischrg_twelve;
      var comp_disc_13 = parsedpr.comp_dischrg_thirteen;
      var comp_disc_14 = parsedpr.comp_dischrg_fourteen;
      var comp_disc_15 = parsedpr.comp_dischrg_fifteen;
      var comp_disc_16 = parsedpr.comp_dischrg_sixteen;
      var comp_disc_17 = parsedpr.comp_dischrg_seventeen;
      var comp_disc_18 = parsedpr.comp_dischrg_eighteen;
      var comp_disc_19 = parsedpr.comp_dischrg_nineteen;
      var comp_disc_20 = parsedpr.comp_dischrg_twenty;
      var comp_disc_21 = parsedpr.comp_dischrg_twentyone;
      var comp_disc_22 = parsedpr.comp_dischrg_twentytwo;
      var comp_disc_23 = parsedpr.comp_dischrg_twentythree;      
      $(".comp_disc_1").html(comp_disc_1);
      $(".comp_disc_2").html(comp_disc_2);
      $(".comp_disc_3").html(comp_disc_3);
      $(".comp_disc_4").html(comp_disc_4);
      $(".comp_disc_5").html(comp_disc_5);
      $(".comp_disc_6").html(comp_disc_6);
      $(".comp_disc_7").html(comp_disc_7);
      $(".comp_disc_8").html(comp_disc_8);
      $(".comp_disc_9").html(comp_disc_9);
      $(".comp_disc_10").html(comp_disc_10);
      $(".comp_disc_11").html(comp_disc_11);
      $(".comp_disc_12").html(comp_disc_12);
      $(".comp_disc_13").html(comp_disc_13);
      $(".comp_disc_14").html(comp_disc_14);
      $(".comp_disc_15").html(comp_disc_15);
      $(".comp_disc_16").html(comp_disc_16);
      $(".comp_disc_17").html(comp_disc_17);
      $(".comp_disc_18").html(comp_disc_18);
      $(".comp_disc_19").html(comp_disc_19);
      $(".comp_disc_20").html(comp_disc_20);
      $(".comp_disc_21").html(comp_disc_21);
      $(".comp_disc_22").html(comp_disc_22);
      $(".comp_disc_23").html(comp_disc_23);
      // -------------  DISP. SALE ---------------- //
      var disp_sale_1 = parsedpr.disp_sale_one;
      var disp_sale_2 = parsedpr.disp_sale_two;
      var disp_sale_3 = parsedpr.disp_sale_three;
      var disp_sale_4 = parsedpr.disp_sale_four;
      var disp_sale_5 = parsedpr.disp_sale_five;
      var disp_sale_6 = parsedpr.disp_sale_six;
      var disp_sale_7 = parsedpr.disp_sale_seven;
      var disp_sale_8 = parsedpr.disp_sale_eight;
      var disp_sale_9 = parsedpr.disp_sale_nine;
      var disp_sale_10 = parsedpr.disp_sale_ten;
      var disp_sale_11 = parsedpr.disp_sale_eleven;
      var disp_sale_12 = parsedpr.disp_sale_twelve;
      var disp_sale_13 = parsedpr.disp_sale_thirteen;
      var disp_sale_14 = parsedpr.disp_sale_fourteen;
      var disp_sale_15 = parsedpr.disp_sale_fifteen;
      var disp_sale_16 = parsedpr.disp_sale_sixteen;
      var disp_sale_17 = parsedpr.disp_sale_seventeen;
      var disp_sale_18 = parsedpr.disp_sale_eighteen;
      var disp_sale_19 = parsedpr.disp_sale_nineteen;
      var disp_sale_20 = parsedpr.disp_sale_twenty;
      var disp_sale_21 = parsedpr.disp_sale_twentyone;
      var disp_sale_22 = parsedpr.disp_sale_twentytwo;
      var disp_sale_23 = parsedpr.disp_sale_twentythree;      
      $(".disp_sale_1").html(disp_sale_1);
      $(".disp_sale_2").html(disp_sale_2);
      $(".disp_sale_3").html(disp_sale_3);
      $(".disp_sale_4").html(disp_sale_4);
      $(".disp_sale_5").html(disp_sale_5);
      $(".disp_sale_6").html(disp_sale_6);
      $(".disp_sale_7").html(disp_sale_7);
      $(".disp_sale_8").html(disp_sale_8);
      $(".disp_sale_9").html(disp_sale_9);
      $(".disp_sale_10").html(disp_sale_10);
      $(".disp_sale_11").html(disp_sale_11);
      $(".disp_sale_12").html(disp_sale_12);
      $(".disp_sale_13").html(disp_sale_13);
      $(".disp_sale_14").html(disp_sale_14);
      $(".disp_sale_15").html(disp_sale_15);
      $(".disp_sale_16").html(disp_sale_16);
      $(".disp_sale_17").html(disp_sale_17);
      $(".disp_sale_18").html(disp_sale_18);
      $(".disp_sale_19").html(disp_sale_19);
      $(".disp_sale_20").html(disp_sale_20);
      $(".disp_sale_21").html(disp_sale_21);
      $(".disp_sale_22").html(disp_sale_22);
      $(".disp_sale_23").html(disp_sale_23);
      // -------------  LCV SALE (MOTHER) ---------------- //
      var lcv_sale_1 = parsedpr.lcv_sale_one;
      var lcv_sale_2 = parsedpr.lcv_sale_two;
      var lcv_sale_3 = parsedpr.lcv_sale_three;
      var lcv_sale_4 = parsedpr.lcv_sale_four;
      var lcv_sale_5 = parsedpr.lcv_sale_five;
      var lcv_sale_6 = parsedpr.lcv_sale_six;
      var lcv_sale_7 = parsedpr.lcv_sale_seven;
      var lcv_sale_8 = parsedpr.lcv_sale_eight;
      var lcv_sale_9 = parsedpr.lcv_sale_nine;
      var lcv_sale_10 = parsedpr.lcv_sale_ten;
      var lcv_sale_11 = parsedpr.lcv_sale_eleven;
      var lcv_sale_12 = parsedpr.lcv_sale_twelve;
      var lcv_sale_13 = parsedpr.lcv_sale_thirteen;
      var lcv_sale_14 = parsedpr.lcv_sale_fourteen;
      var lcv_sale_15 = parsedpr.lcv_sale_fifteen;
      var lcv_sale_16 = parsedpr.lcv_sale_sixteen;
      var lcv_sale_17 = parsedpr.lcv_sale_seventeen;
      var lcv_sale_18 = parsedpr.lcv_sale_eighteen;
      var lcv_sale_19 = parsedpr.lcv_sale_nineteen;
      var lcv_sale_20 = parsedpr.lcv_sale_twenty;
      var lcv_sale_21 = parsedpr.lcv_sale_twentyone;
      var lcv_sale_22 = parsedpr.lcv_sale_twentytwo;
      var lcv_sale_23 = parsedpr.lcv_sale_twentythree;      
      $(".lcv_sale_mot_1").html(lcv_sale_1);
      $(".lcv_sale_mot_2").html(lcv_sale_2);
      $(".lcv_sale_mot_3").html(lcv_sale_3);
      $(".lcv_sale_mot_4").html(lcv_sale_4);
      $(".lcv_sale_mot_5").html(lcv_sale_5);
      $(".lcv_sale_mot_6").html(lcv_sale_6);
      $(".lcv_sale_mot_7").html(lcv_sale_7);
      $(".lcv_sale_mot_8").html(lcv_sale_8);
      $(".lcv_sale_mot_9").html(lcv_sale_9);
      $(".lcv_sale_mot_10").html(lcv_sale_10);
      $(".lcv_sale_mot_11").html(lcv_sale_11);
      $(".lcv_sale_mot_12").html(lcv_sale_12);
      $(".lcv_sale_mot_13").html(lcv_sale_13);
      $(".lcv_sale_mot_14").html(lcv_sale_14);
      $(".lcv_sale_mot_15").html(lcv_sale_15);
      $(".lcv_sale_mot_16").html(lcv_sale_16);
      $(".lcv_sale_mot_17").html(lcv_sale_17);
      $(".lcv_sale_mot_18").html(lcv_sale_18);
      $(".lcv_sale_mot_19").html(lcv_sale_19);
      $(".lcv_sale_mot_20").html(lcv_sale_20);
      $(".lcv_sale_mot_21").html(lcv_sale_21);
      $(".lcv_sale_mot_22").html(lcv_sale_22);
      $(".lcv_sale_mot_23").html(lcv_sale_23);
      // -------------  COMP. GAIN LOSS ---------------- //
      var comp_gain_loss_1 = parsedpr.comp_gain_one;
      var comp_gain_loss_2 = parsedpr.comp_gain_two;
      var comp_gain_loss_3 = parsedpr.comp_gain_three;
      var comp_gain_loss_4 = parsedpr.comp_gain_four;
      var comp_gain_loss_5 = parsedpr.comp_gain_five;
      var comp_gain_loss_6 = parsedpr.comp_gain_six;
      var comp_gain_loss_7 = parsedpr.comp_gain_seven;
      var comp_gain_loss_8 = parsedpr.comp_gain_eight;
      var comp_gain_loss_9 = parsedpr.comp_gain_nine;
      var comp_gain_loss_10 = parsedpr.comp_gain_ten;
      var comp_gain_loss_11 = parsedpr.comp_gain_eleven;
      var comp_gain_loss_12 = parsedpr.comp_gain_twelve;
      var comp_gain_loss_13 = parsedpr.comp_gain_thirteen;
      var comp_gain_loss_14 = parsedpr.comp_gain_fourteen;
      var comp_gain_loss_15 = parsedpr.comp_gain_fifteen;
      var comp_gain_loss_16 = parsedpr.comp_gain_sixteen;
      var comp_gain_loss_17 = parsedpr.comp_gain_seventeen;
      var comp_gain_loss_18 = parsedpr.comp_gain_eighteen;
      var comp_gain_loss_19 = parsedpr.comp_gain_nineteen;
      var comp_gain_loss_20 = parsedpr.comp_gain_twenty;
      var comp_gain_loss_21 = parsedpr.comp_gain_twentyone;
      var comp_gain_loss_22 = parsedpr.comp_gain_twentytwo;
      var comp_gain_loss_23 = parsedpr.comp_gain_twentythree;

      $(".comp_gain_loss_1").html(comp_gain_loss_1);
      $(".comp_gain_loss_2").html(comp_gain_loss_2);
      $(".comp_gain_loss_3").html(comp_gain_loss_3);
      $(".comp_gain_loss_4").html(comp_gain_loss_4);
      $(".comp_gain_loss_5").html(comp_gain_loss_5);
      $(".comp_gain_loss_6").html(comp_gain_loss_6);
      $(".comp_gain_loss_7").html(comp_gain_loss_7);
      $(".comp_gain_loss_8").html(comp_gain_loss_8);
      $(".comp_gain_loss_9").html(comp_gain_loss_9);
      $(".comp_gain_loss_10").html(comp_gain_loss_10);
      $(".comp_gain_loss_11").html(comp_gain_loss_11);
      $(".comp_gain_loss_12").html(comp_gain_loss_12);
      $(".comp_gain_loss_13").html(comp_gain_loss_13);
      $(".comp_gain_loss_14").html(comp_gain_loss_14);
      $(".comp_gain_loss_15").html(comp_gain_loss_15);
      $(".comp_gain_loss_16").html(comp_gain_loss_16);
      $(".comp_gain_loss_17").html(comp_gain_loss_17);
      $(".comp_gain_loss_18").html(comp_gain_loss_18);
      $(".comp_gain_loss_19").html(comp_gain_loss_19);
      $(".comp_gain_loss_20").html(comp_gain_loss_20);
      $(".comp_gain_loss_21").html(comp_gain_loss_21);
      $(".comp_gain_loss_22").html(comp_gain_loss_22);
      $(".comp_gain_loss_23").html(comp_gain_loss_23);

      // -------------  DISP. GAIN LOSS ---------------- //
      var disp_gain_loss_1 = parsedpr.disp_gain_loss_one;
      var disp_gain_loss_2 = parsedpr.disp_gain_loss_two;
      var disp_gain_loss_3 = parsedpr.disp_gain_loss_three;
      var disp_gain_loss_4 = parsedpr.disp_gain_loss_four;
      var disp_gain_loss_5 = parsedpr.disp_gain_loss_five;
      var disp_gain_loss_6 = parsedpr.disp_gain_loss_six;
      var disp_gain_loss_7 = parsedpr.disp_gain_loss_seven;
      var disp_gain_loss_8 = parsedpr.disp_gain_loss_eight;
      var disp_gain_loss_9 = parsedpr.disp_gain_loss_nine;
      var disp_gain_loss_10 = parsedpr.disp_gain_loss_ten;
      var disp_gain_loss_11 = parsedpr.disp_gain_loss_eleven;
      var disp_gain_loss_12 = parsedpr.disp_gain_loss_twelve;
      var disp_gain_loss_13 = parsedpr.disp_gain_loss_thirteen;
      var disp_gain_loss_14 = parsedpr.disp_gain_loss_fourteen;
      var disp_gain_loss_15 = parsedpr.disp_gain_loss_fifteen;
      var disp_gain_loss_16 = parsedpr.disp_gain_loss_sixteen;
      var disp_gain_loss_17 = parsedpr.disp_gain_loss_seventeen;
      var disp_gain_loss_18 = parsedpr.disp_gain_loss_eighteen;
      var disp_gain_loss_19 = parsedpr.disp_gain_loss_nineteen;
      var disp_gain_loss_20 = parsedpr.disp_gain_loss_twenty;
      var disp_gain_loss_21 = parsedpr.disp_gain_loss_twentyone;
      var disp_gain_loss_22 = parsedpr.disp_gain_loss_twentytwo;
      var disp_gain_loss_23 = parsedpr.disp_gain_loss_twentythree;

      $(".disp_gain_loss_1").html(disp_gain_loss_1);
      $(".disp_gain_loss_2").html(disp_gain_loss_2);
      $(".disp_gain_loss_3").html(disp_gain_loss_3);
      $(".disp_gain_loss_4").html(disp_gain_loss_4);
      $(".disp_gain_loss_5").html(disp_gain_loss_5);
      $(".disp_gain_loss_6").html(disp_gain_loss_6);
      $(".disp_gain_loss_7").html(disp_gain_loss_7);
      $(".disp_gain_loss_8").html(disp_gain_loss_8);
      $(".disp_gain_loss_9").html(disp_gain_loss_9);
      $(".disp_gain_loss_10").html(disp_gain_loss_10);
      $(".disp_gain_loss_11").html(disp_gain_loss_11);
      $(".disp_gain_loss_12").html(disp_gain_loss_12);
      $(".disp_gain_loss_13").html(disp_gain_loss_13);
      $(".disp_gain_loss_14").html(disp_gain_loss_14);
      $(".disp_gain_loss_15").html(disp_gain_loss_15);
      $(".disp_gain_loss_16").html(disp_gain_loss_16);
      $(".disp_gain_loss_17").html(disp_gain_loss_17);
      $(".disp_gain_loss_18").html(disp_gain_loss_18);
      $(".disp_gain_loss_19").html(disp_gain_loss_19);
      $(".disp_gain_loss_20").html(disp_gain_loss_20);
      $(".disp_gain_loss_21").html(disp_gain_loss_21);
      $(".disp_gain_loss_22").html(disp_gain_loss_22);
      $(".disp_gain_loss_23").html(disp_gain_loss_23);


      // -------------  DISP. GAIN LOSS ---------------- //
      var stn_gain_loss_1 = parsedpr.stn_gain_loss_one;
      var stn_gain_loss_2 = parsedpr.stn_gain_loss_two;
      var stn_gain_loss_3 = parsedpr.stn_gain_loss_three;
      var stn_gain_loss_4 = parsedpr.stn_gain_loss_four;
      var stn_gain_loss_5 = parsedpr.stn_gain_loss_five;
      var stn_gain_loss_6 = parsedpr.stn_gain_loss_six;
      var stn_gain_loss_7 = parsedpr.stn_gain_loss_seven;
      var stn_gain_loss_8 = parsedpr.stn_gain_loss_eight;
      var stn_gain_loss_9 = parsedpr.stn_gain_loss_nine;
      var stn_gain_loss_10 = parsedpr.stn_gain_loss_ten;
      var stn_gain_loss_11 = parsedpr.stn_gain_loss_eleven;
      var stn_gain_loss_12 = parsedpr.stn_gain_loss_twelve;
      var stn_gain_loss_13 = parsedpr.stn_gain_loss_thirteen;
      var stn_gain_loss_14 = parsedpr.stn_gain_loss_fourteen;
      var stn_gain_loss_15 = parsedpr.stn_gain_loss_fifteen;
      var stn_gain_loss_16 = parsedpr.stn_gain_loss_sixteen;
      var stn_gain_loss_17 = parsedpr.stn_gain_loss_seventeen;
      var stn_gain_loss_18 = parsedpr.stn_gain_loss_eighteen;
      var stn_gain_loss_19 = parsedpr.stn_gain_loss_nineteen;
      var stn_gain_loss_20 = parsedpr.stn_gain_loss_twenty;
      var stn_gain_loss_21 = parsedpr.stn_gain_loss_twentyone;
      var stn_gain_loss_22 = parsedpr.stn_gain_loss_twentytwo;
      var stn_gain_loss_23 = parsedpr.stn_gain_loss_twentythree;

      $(".stn_gain_loss_1").html(stn_gain_loss_1);
      $(".stn_gain_loss_2").html(stn_gain_loss_2);
      $(".stn_gain_loss_3").html(stn_gain_loss_3);
      $(".stn_gain_loss_4").html(stn_gain_loss_4);
      $(".stn_gain_loss_5").html(stn_gain_loss_5);
      $(".stn_gain_loss_6").html(stn_gain_loss_6);
      $(".stn_gain_loss_7").html(stn_gain_loss_7);
      $(".stn_gain_loss_8").html(stn_gain_loss_8);
      $(".stn_gain_loss_9").html(stn_gain_loss_9);
      $(".stn_gain_loss_10").html(stn_gain_loss_10);
      $(".stn_gain_loss_11").html(stn_gain_loss_11);
      $(".stn_gain_loss_12").html(stn_gain_loss_12);
      $(".stn_gain_loss_13").html(stn_gain_loss_13);
      $(".stn_gain_loss_14").html(stn_gain_loss_14);
      $(".stn_gain_loss_15").html(stn_gain_loss_15);
      $(".stn_gain_loss_16").html(stn_gain_loss_16);
      $(".stn_gain_loss_17").html(stn_gain_loss_17);
      $(".stn_gain_loss_18").html(stn_gain_loss_18);
      $(".stn_gain_loss_19").html(stn_gain_loss_19);
      $(".stn_gain_loss_20").html(stn_gain_loss_20);
      $(".stn_gain_loss_21").html(stn_gain_loss_21);
      $(".stn_gain_loss_22").html(stn_gain_loss_22);
      $(".stn_gain_loss_23").html(stn_gain_loss_23);
      

      // -------------  REACTIVE CHARGES ---------------- //
      var reactive_chrg_1 = parsedpr.reactive_chrg_one;
      var reactive_chrg_2 = parsedpr.reactive_chrg_two;
      var reactive_chrg_3 = parsedpr.reactive_chrg_three;
      var reactive_chrg_4 = parsedpr.reactive_chrg_four;
      var reactive_chrg_5 = parsedpr.reactive_chrg_five;
      var reactive_chrg_6 = parsedpr.reactive_chrg_six;
      var reactive_chrg_7 = parsedpr.reactive_chrg_seven;
      var reactive_chrg_8 = parsedpr.reactive_chrg_eight;
      var reactive_chrg_9 = parsedpr.reactive_chrg_nine;
      var reactive_chrg_10 = parsedpr.reactive_chrg_ten;
      var reactive_chrg_11 = parsedpr.reactive_chrg_eleven;
      var reactive_chrg_12 = parsedpr.reactive_chrg_twelve;
      var reactive_chrg_13 = parsedpr.reactive_chrg_thirteen;
      var reactive_chrg_14 = parsedpr.reactive_chrg_fourteen;
      var reactive_chrg_15 = parsedpr.reactive_chrg_fifteen;
      var reactive_chrg_16 = parsedpr.reactive_chrg_sixteen;
      var reactive_chrg_17 = parsedpr.reactive_chrg_seventeen;
      var reactive_chrg_18 = parsedpr.reactive_chrg_eighteen;
      var reactive_chrg_19 = parsedpr.reactive_chrg_nineteen;
      var reactive_chrg_20 = parsedpr.reactive_chrg_twenty;
      var reactive_chrg_21 = parsedpr.reactive_chrg_twentyone;
      var reactive_chrg_22 = parsedpr.reactive_chrg_twentytwo;
      var reactive_chrg_23 = parsedpr.reactive_chrg_twentythree;      
      $(".reactive_chrg_1").html(reactive_chrg_1);
      $(".reactive_chrg_2").html(reactive_chrg_2);
      $(".reactive_chrg_3").html(reactive_chrg_3);
      $(".reactive_chrg_4").html(reactive_chrg_4);
      $(".reactive_chrg_5").html(reactive_chrg_5);
      $(".reactive_chrg_6").html(reactive_chrg_6);
      $(".reactive_chrg_7").html(reactive_chrg_7);
      $(".reactive_chrg_8").html(reactive_chrg_8);
      $(".reactive_chrg_9").html(reactive_chrg_9);
      $(".reactive_chrg_10").html(reactive_chrg_10);
      $(".reactive_chrg_11").html(reactive_chrg_11);
      $(".reactive_chrg_12").html(reactive_chrg_12);
      $(".reactive_chrg_13").html(reactive_chrg_13); 
      $(".reactive_chrg_14").html(reactive_chrg_14);   
      $(".reactive_chrg_15").html(reactive_chrg_15);
      $(".reactive_chrg_16").html(reactive_chrg_16);
      $(".reactive_chrg_17").html(reactive_chrg_17);
      $(".reactive_chrg_18").html(reactive_chrg_18);
      $(".reactive_chrg_19").html(reactive_chrg_19);
      $(".reactive_chrg_20").html(reactive_chrg_20);
      $(".reactive_chrg_21").html(reactive_chrg_21);
      $(".reactive_chrg_22").html(reactive_chrg_22);
      $(".reactive_chrg_23").html(reactive_chrg_23);
      // -------------  POWER FACTOR ---------------- //
      var pf_1 = parsedpr.pf_one;
      var pf_2 = parsedpr.pf_two;
      var pf_3 = parsedpr.pf_three;
      var pf_4 = parsedpr.pf_four;
      var pf_5 = parsedpr.pf_five;
      var pf_6 = parsedpr.pf_six;
      var pf_7 = parsedpr.pf_seven;
      var pf_8 = parsedpr.pf_eight;
      var pf_9 = parsedpr.pf_nine;
      var pf_10 = parsedpr.pf_ten;
      var pf_11 = parsedpr.pf_eleven;
      var pf_12 = parsedpr.pf_twelve;
      var pf_13 = parsedpr.pf_thirteen;
      var pf_14 = parsedpr.pf_fourteen;
      var pf_15 = parsedpr.pf_fifteen;
      var pf_16 = parsedpr.pf_sixteen;
      var pf_17 = parsedpr.pf_seventeen;
      var pf_18 = parsedpr.pf_eighteen;
      var pf_19 = parsedpr.pf_nineteen;
      var pf_20 = parsedpr.pf_twenty;
      var pf_21 = parsedpr.pf_twentyone;
      var pf_22 = parsedpr.pf_twentytwo;
      var pf_23 = parsedpr.pf_twentythree;      
      $(".pf_1").html(pf_1);
      $(".pf_2").html(pf_2);
      $(".pf_3").html(pf_3);
      $(".pf_4").html(pf_4);
      $(".pf_5").html(pf_5);
      $(".pf_6").html(pf_6);
      $(".pf_7").html(pf_7);
      $(".pf_8").html(pf_8);
      $(".pf_9").html(pf_9);
      $(".pf_10").html(pf_10);
      $(".pf_11").html(pf_11);
      $(".pf_12").html(pf_12);
      $(".pf_13").html(pf_13); 
      $(".pf_14").html(pf_14);   
      $(".pf_15").html(pf_15);
      $(".pf_16").html(pf_16);
      $(".pf_17").html(pf_17);
      $(".pf_18").html(pf_18);
      $(".pf_19").html(pf_19);
      $(".pf_20").html(pf_20);
      $(".pf_21").html(pf_21);
      $(".pf_22").html(pf_22);
      $(".pf_23").html(pf_23);
      // -------------  COMP. RUNNING HRS ---------------- //
      var cmp_runhrs_1 = parsedpr.cmp_runhrs_one;
      var cmp_runhrs_2 = parsedpr.cmp_runhrs_two;
      var cmp_runhrs_3 = parsedpr.cmp_runhrs_three;
      var cmp_runhrs_4 = parsedpr.cmp_runhrs_four;
      var cmp_runhrs_5 = parsedpr.cmp_runhrs_five;
      var cmp_runhrs_6 = parsedpr.cmp_runhrs_six;
      var cmp_runhrs_7 = parsedpr.cmp_runhrs_seven;
      var cmp_runhrs_8 = parsedpr.cmp_runhrs_eight;
      var cmp_runhrs_9 = parsedpr.cmp_runhrs_nine;
      var cmp_runhrs_10 = parsedpr.cmp_runhrs_ten;
      var cmp_runhrs_11 = parsedpr.cmp_runhrs_eleven;
      var cmp_runhrs_12 = parsedpr.cmp_runhrs_twelve;
      var cmp_runhrs_13 = parsedpr.cmp_runhrs_thirteen;
      var cmp_runhrs_14 = parsedpr.cmp_runhrs_fourteen;
      var cmp_runhrs_15 = parsedpr.cmp_runhrs_fifteen;
      var cmp_runhrs_16 = parsedpr.cmp_runhrs_sixteen;
      var cmp_runhrs_17 = parsedpr.cmp_runhrs_seventeen;
      var cmp_runhrs_18 = parsedpr.cmp_runhrs_eighteen;
      var cmp_runhrs_19 = parsedpr.cmp_runhrs_nineteen;
      var cmp_runhrs_20 = parsedpr.cmp_runhrs_twenty;
      var cmp_runhrs_21 = parsedpr.cmp_runhrs_twentyone;
      var cmp_runhrs_22 = parsedpr.cmp_runhrs_twentytwo;
      var cmp_runhrs_23 = parsedpr.cmp_runhrs_twentythree;      
      $(".comp_run_hrs_1").html(cmp_runhrs_1);
      $(".comp_run_hrs_2").html(cmp_runhrs_2);
      $(".comp_run_hrs_3").html(cmp_runhrs_3);
      $(".comp_run_hrs_4").html(cmp_runhrs_4);
      $(".comp_run_hrs_5").html(cmp_runhrs_5);
      $(".comp_run_hrs_6").html(cmp_runhrs_6);
      $(".comp_run_hrs_7").html(cmp_runhrs_7);
      $(".comp_run_hrs_8").html(cmp_runhrs_8);
      $(".comp_run_hrs_9").html(cmp_runhrs_9);
      $(".comp_run_hrs_10").html(cmp_runhrs_10);
      $(".comp_run_hrs_11").html(cmp_runhrs_11);
      $(".comp_run_hrs_12").html(cmp_runhrs_12);
      $(".comp_run_hrs_13").html(cmp_runhrs_13); 
      $(".comp_run_hrs_14").html(cmp_runhrs_14);   
      $(".comp_run_hrs_15").html(cmp_runhrs_15);
      $(".comp_run_hrs_16").html(cmp_runhrs_16);
      $(".comp_run_hrs_17").html(cmp_runhrs_17);
      $(".comp_run_hrs_18").html(cmp_runhrs_18);
      $(".comp_run_hrs_19").html(cmp_runhrs_19);
      $(".comp_run_hrs_20").html(cmp_runhrs_20);
      $(".comp_run_hrs_21").html(cmp_runhrs_21);
      $(".comp_run_hrs_22").html(cmp_runhrs_22);
      $(".comp_run_hrs_23").html(cmp_runhrs_23);
      // -------------  SUCTION PRESSURE ---------------- //
      var suc_prsr_1 = parsedpr.suc_prsr_one;
      var suc_prsr_2 = parsedpr.suc_prsr_two;
      var suc_prsr_3 = parsedpr.suc_prsr_three;
      var suc_prsr_4 = parsedpr.suc_prsr_four;
      var suc_prsr_5 = parsedpr.suc_prsr_five;
      var suc_prsr_6 = parsedpr.suc_prsr_six;
      var suc_prsr_7 = parsedpr.suc_prsr_seven;
      var suc_prsr_8 = parsedpr.suc_prsr_eight;
      var suc_prsr_9 = parsedpr.suc_prsr_nine;
      var suc_prsr_10 = parsedpr.suc_prsr_ten;
      var suc_prsr_11 = parsedpr.suc_prsr_eleven;
      var suc_prsr_12 = parsedpr.suc_prsr_twelve;
      var suc_prsr_13 = parsedpr.suc_prsr_thirteen;
      var suc_prsr_14 = parsedpr.suc_prsr_fourteen;
      var suc_prsr_15 = parsedpr.suc_prsr_fifteen;
      var suc_prsr_16 = parsedpr.suc_prsr_sixteen;
      var suc_prsr_17 = parsedpr.suc_prsr_seventeen;
      var suc_prsr_18 = parsedpr.suc_prsr_eighteen;
      var suc_prsr_19 = parsedpr.suc_prsr_nineteen;
      var suc_prsr_20 = parsedpr.suc_prsr_twenty;
      var suc_prsr_21 = parsedpr.suc_prsr_twentyone;
      var suc_prsr_22 = parsedpr.suc_prsr_twentytwo;
      var suc_prsr_23 = parsedpr.suc_prsr_twentythree;      
      $(".suc_prs_1").html(suc_prsr_1);
      $(".suc_prs_2").html(suc_prsr_2);
      $(".suc_prs_3").html(suc_prsr_3);
      $(".suc_prs_4").html(suc_prsr_4);
      $(".suc_prs_5").html(suc_prsr_5);
      $(".suc_prs_6").html(suc_prsr_6);
      $(".suc_prs_7").html(suc_prsr_7);
      $(".suc_prs_8").html(suc_prsr_8);
      $(".suc_prs_9").html(suc_prsr_9);
      $(".suc_prs_10").html(suc_prsr_10);
      $(".suc_prs_11").html(suc_prsr_11);
      $(".suc_prs_12").html(suc_prsr_12);
      $(".suc_prs_13").html(suc_prsr_13); 
      $(".suc_prs_14").html(suc_prsr_14);   
      $(".suc_prs_15").html(suc_prsr_15);
      $(".suc_prs_16").html(suc_prsr_16);
      $(".suc_prs_17").html(suc_prsr_17);
      $(".suc_prs_18").html(suc_prsr_18);
      $(".suc_prs_19").html(suc_prsr_19);
      $(".suc_prs_20").html(suc_prsr_20);
      $(".suc_prs_21").html(suc_prsr_21);
      $(".suc_prs_22").html(suc_prsr_22);
      $(".suc_prs_23").html(suc_prsr_23);
      // -------------  COMP FLOW ---------------- //
      var comp_flow_1 = parsedpr.comp_flow_one;
      var comp_flow_2 = parsedpr.comp_flow_two;
      var comp_flow_3 = parsedpr.comp_flow_three;
      var comp_flow_4 = parsedpr.comp_flow_four;
      var comp_flow_5 = parsedpr.comp_flow_five;
      var comp_flow_6 = parsedpr.comp_flow_six;
      var comp_flow_7 = parsedpr.comp_flow_seven;
      var comp_flow_8 = parsedpr.comp_flow_eight;
      var comp_flow_9 = parsedpr.comp_flow_nine;
      var comp_flow_10 = parsedpr.comp_flow_ten;
      var comp_flow_11 = parsedpr.comp_flow_eleven;
      var comp_flow_12 = parsedpr.comp_flow_twelve;
      var comp_flow_13 = parsedpr.comp_flow_thirteen;
      var comp_flow_14 = parsedpr.comp_flow_fourteen;
      var comp_flow_15 = parsedpr.comp_flow_fifteen;
      var comp_flow_16 = parsedpr.comp_flow_sixteen;
      var comp_flow_17 = parsedpr.comp_flow_seventeen;
      var comp_flow_18 = parsedpr.comp_flow_eighteen;
      var comp_flow_19 = parsedpr.comp_flow_nineteen;
      var comp_flow_20 = parsedpr.comp_flow_twenty;
      var comp_flow_21 = parsedpr.comp_flow_twentyone;
      var comp_flow_22 = parsedpr.comp_flow_twentytwo;
      var comp_flow_23 = parsedpr.comp_flow_twentythree;      
      $(".comp_flow_1").html(comp_flow_1);
      $(".comp_flow_2").html(comp_flow_2);
      $(".comp_flow_3").html(comp_flow_3);
      $(".comp_flow_4").html(comp_flow_4);
      $(".comp_flow_5").html(comp_flow_5);
      $(".comp_flow_6").html(comp_flow_6);
      $(".comp_flow_7").html(comp_flow_7);
      $(".comp_flow_8").html(comp_flow_8);
      $(".comp_flow_9").html(comp_flow_9);
      $(".comp_flow_10").html(comp_flow_10);
      $(".comp_flow_11").html(comp_flow_11);
      $(".comp_flow_12").html(comp_flow_12);
      $(".comp_flow_13").html(comp_flow_13); 
      $(".comp_flow_14").html(comp_flow_14);   
      $(".comp_flow_15").html(comp_flow_15);
      $(".comp_flow_16").html(comp_flow_16);
      $(".comp_flow_17").html(comp_flow_17);
      $(".comp_flow_18").html(comp_flow_18);
      $(".comp_flow_19").html(comp_flow_19);
      $(".comp_flow_20").html(comp_flow_20);
      $(".comp_flow_21").html(comp_flow_21);
      $(".comp_flow_22").html(comp_flow_22);
      $(".comp_flow_23").html(comp_flow_23);

      // -------------  KWH/KG EQIPMENT ---------------- //
      var kgh_kg_eq_1 = parsedpr.kgh_kg_eq_one;
      var kgh_kg_eq_2 = parsedpr.kgh_kg_eq_two;
      var kgh_kg_eq_3 = parsedpr.kgh_kg_eq_three;
      var kgh_kg_eq_4 = parsedpr.kgh_kg_eq_four;
      var kgh_kg_eq_5 = parsedpr.kgh_kg_eq_five;
      var kgh_kg_eq_6 = parsedpr.kgh_kg_eq_six;
      var kgh_kg_eq_7 = parsedpr.kgh_kg_eq_seven;
      var kgh_kg_eq_8 = parsedpr.kgh_kg_eq_eight;
      var kgh_kg_eq_9 = parsedpr.kgh_kg_eq_nine;
      var kgh_kg_eq_10 = parsedpr.kgh_kg_eq_ten;
      var kgh_kg_eq_11 = parsedpr.kgh_kg_eq_eleven;
      var kgh_kg_eq_12 = parsedpr.kgh_kg_eq_twelve;
      var kgh_kg_eq_13 = parsedpr.kgh_kg_eq_thirteen;
      var kgh_kg_eq_14 = parsedpr.kgh_kg_eq_fourteen;
      var kgh_kg_eq_15 = parsedpr.kgh_kg_eq_fifteen;
      var kgh_kg_eq_16 = parsedpr.kgh_kg_eq_sixteen;
      var kgh_kg_eq_17 = parsedpr.kgh_kg_eq_seventeen;
      var kgh_kg_eq_18 = parsedpr.kgh_kg_eq_eighteen;
      var kgh_kg_eq_19 = parsedpr.kgh_kg_eq_nineteen;
      var kgh_kg_eq_20 = parsedpr.kgh_kg_eq_twenty;
      var kgh_kg_eq_21 = parsedpr.kgh_kg_eq_twentyone;
      var kgh_kg_eq_22 = parsedpr.kgh_kg_eq_twentytwo;
      var kgh_kg_eq_23 = parsedpr.kgh_kg_eq_twentythree;      
      $(".kgh_kg_eq_1").html(kgh_kg_eq_1); 
      $(".kgh_kg_eq_2").html(kgh_kg_eq_2);
      $(".kgh_kg_eq_3").html(kgh_kg_eq_3);
      $(".kgh_kg_eq_4").html(kgh_kg_eq_4);
      $(".kgh_kg_eq_5").html(kgh_kg_eq_5);
      $(".kgh_kg_eq_6").html(kgh_kg_eq_6);
      $(".kgh_kg_eq_7").html(kgh_kg_eq_7);
      $(".kgh_kg_eq_8").html(kgh_kg_eq_8);
      $(".kgh_kg_eq_9").html(kgh_kg_eq_9);
      $(".kgh_kg_eq_10").html(kgh_kg_eq_10);
      $(".kgh_kg_eq_11").html(kgh_kg_eq_11);
      $(".kgh_kg_eq_12").html(kgh_kg_eq_12);
      $(".kgh_kg_eq_13").html(kgh_kg_eq_13); 
      $(".kgh_kg_eq_14").html(kgh_kg_eq_14);   
      $(".kgh_kg_eq_15").html(kgh_kg_eq_15);
      $(".kgh_kg_eq_16").html(kgh_kg_eq_16);
      $(".kgh_kg_eq_17").html(kgh_kg_eq_17);
      $(".kgh_kg_eq_18").html(kgh_kg_eq_18);
      $(".kgh_kg_eq_19").html(kgh_kg_eq_19);
      $(".kgh_kg_eq_20").html(kgh_kg_eq_20);
      $(".kgh_kg_eq_21").html(kgh_kg_eq_21);
      $(".kgh_kg_eq_22").html(kgh_kg_eq_22);
      $(".kgh_kg_eq_23").html(kgh_kg_eq_23);


      // -------------  KWH/KG STN ---------------- //
      var kwh_kg_stn_1 = parsedpr.kwh_kg_stn_one;
      var kwh_kg_stn_2 = parsedpr.kwh_kg_stn_two;
      var kwh_kg_stn_3 = parsedpr.kwh_kg_stn_three;
      var kwh_kg_stn_4 = parsedpr.kwh_kg_stn_four;
      var kwh_kg_stn_5 = parsedpr.kwh_kg_stn_five;
      var kwh_kg_stn_6 = parsedpr.kwh_kg_stn_six;
      var kwh_kg_stn_7 = parsedpr.kwh_kg_stn_seven;
      var kwh_kg_stn_8 = parsedpr.kwh_kg_stn_eight;
      var kwh_kg_stn_9 = parsedpr.kwh_kg_stn_nine;
      var kwh_kg_stn_10 = parsedpr.kwh_kg_stn_ten;
      var kwh_kg_stn_11 = parsedpr.kwh_kg_stn_eleven;
      var kwh_kg_stn_12 = parsedpr.kwh_kg_stn_twelve;
      var kwh_kg_stn_13 = parsedpr.kwh_kg_stn_thirteen;
      var kwh_kg_stn_14 = parsedpr.kwh_kg_stn_fourteen;
      var kwh_kg_stn_15 = parsedpr.kwh_kg_stn_fifteen;
      var kwh_kg_stn_16 = parsedpr.kwh_kg_stn_sixteen;
      var kwh_kg_stn_17 = parsedpr.kwh_kg_stn_seventeen;
      var kwh_kg_stn_18 = parsedpr.kwh_kg_stn_eighteen;
      var kwh_kg_stn_19 = parsedpr.kwh_kg_stn_nineteen;
      var kwh_kg_stn_20 = parsedpr.kwh_kg_stn_twenty;
      var kwh_kg_stn_21 = parsedpr.kwh_kg_stn_twentyone;
      var kwh_kg_stn_22 = parsedpr.kwh_kg_stn_twentytwo;
      var kwh_kg_stn_23 = parsedpr.kwh_kg_stn_twentythree;      
      $(".kwh_kg_stn_1").html(kwh_kg_stn_1); 
      $(".kwh_kg_stn_2").html(kwh_kg_stn_2);
      $(".kwh_kg_stn_3").html(kwh_kg_stn_3);
      $(".kwh_kg_stn_4").html(kwh_kg_stn_4);
      $(".kwh_kg_stn_5").html(kwh_kg_stn_5);
      $(".kwh_kg_stn_6").html(kwh_kg_stn_6);
      $(".kwh_kg_stn_7").html(kwh_kg_stn_7);
      $(".kwh_kg_stn_8").html(kwh_kg_stn_8);
      $(".kwh_kg_stn_9").html(kwh_kg_stn_9);
      $(".kwh_kg_stn_10").html(kwh_kg_stn_10);
      $(".kwh_kg_stn_11").html(kwh_kg_stn_11);
      $(".kwh_kg_stn_12").html(kwh_kg_stn_12);
      $(".kwh_kg_stn_13").html(kwh_kg_stn_13); 
      $(".kwh_kg_stn_14").html(kwh_kg_stn_14);   
      $(".kwh_kg_stn_15").html(kwh_kg_stn_15);
      $(".kwh_kg_stn_16").html(kwh_kg_stn_16);
      $(".kwh_kg_stn_17").html(kwh_kg_stn_17);
      $(".kwh_kg_stn_18").html(kwh_kg_stn_18);
      $(".kwh_kg_stn_19").html(kwh_kg_stn_19);
      $(".kwh_kg_stn_20").html(kwh_kg_stn_20);
      $(".kwh_kg_stn_21").html(kwh_kg_stn_21);
      $(".kwh_kg_stn_22").html(kwh_kg_stn_22);
      $(".kwh_kg_stn_23").html(kwh_kg_stn_23);


      // -------------  UTILIZATION % (16 Hrs) ---------------- //
      var util_st_1 = parsedpr.util_st_one;
      var util_st_2 = parsedpr.util_st_two;
      var util_st_3 = parsedpr.util_st_three;
      var util_st_4 = parsedpr.util_st_four;
      var util_st_5 = parsedpr.util_st_five;
      var util_st_6 = parsedpr.util_st_six;
      var util_st_7 = parsedpr.util_st_seven;
      var util_st_8 = parsedpr.util_st_eight;
      var util_st_9 = parsedpr.util_st_nine;
      var util_st_10 = parsedpr.util_st_ten;
      var util_st_11 = parsedpr.util_st_eleven;
      var util_st_12 = parsedpr.util_st_twelve;
      var util_st_13 = parsedpr.util_st_thirteen;
      var util_st_14 = parsedpr.util_st_fourteen;
      var util_st_15 = parsedpr.util_st_fifteen;
      var util_st_16 = parsedpr.util_st_sixteen;
      var util_st_17 = parsedpr.util_st_seventeen;
      var util_st_18 = parsedpr.util_st_eighteen;
      var util_st_19 = parsedpr.util_st_nineteen;
      var util_st_20 = parsedpr.util_st_twenty;
      var util_st_21 = parsedpr.util_st_twentyone;
      var util_st_22 = parsedpr.util_st_twentytwo;
      var util_st_23 = parsedpr.util_st_twentythree;      
      $(".util_st_1").html(util_st_1); 
      $(".util_st_2").html(util_st_2);
      $(".util_st_3").html(util_st_3);
      $(".util_st_4").html(util_st_4);
      $(".util_st_5").html(util_st_5);
      $(".util_st_6").html(util_st_6);
      $(".util_st_7").html(util_st_7);
      $(".util_st_8").html(util_st_8);
      $(".util_st_9").html(util_st_9);
      $(".util_st_10").html(util_st_10);
      $(".util_st_11").html(util_st_11);
      $(".util_st_12").html(util_st_12);
      $(".util_st_13").html(util_st_13); 
      $(".util_st_14").html(util_st_14);   
      $(".util_st_15").html(util_st_15);
      $(".util_st_16").html(util_st_16);
      $(".util_st_17").html(util_st_17);
      $(".util_st_18").html(util_st_18);
      $(".util_st_19").html(util_st_19);
      $(".util_st_20").html(util_st_20);
      $(".util_st_21").html(util_st_21);
      $(".util_st_22").html(util_st_22);
      $(".util_st_23").html(util_st_23);


      // -------------  UTILIZATION % (24 Hrs) ---------------- //
      var util_tf_1 = parsedpr.util_tf_one;
      var util_tf_2 = parsedpr.util_tf_two;
      var util_tf_3 = parsedpr.util_tf_three;
      var util_tf_4 = parsedpr.util_tf_four;
      var util_tf_5 = parsedpr.util_tf_five;
      var util_tf_6 = parsedpr.util_tf_six;
      var util_tf_7 = parsedpr.util_tf_seven;
      var util_tf_8 = parsedpr.util_tf_eight;
      var util_tf_9 = parsedpr.util_tf_nine;
      var util_tf_10 = parsedpr.util_tf_ten;
      var util_tf_11 = parsedpr.util_tf_eleven;
      var util_tf_12 = parsedpr.util_tf_twelve;
      var util_tf_13 = parsedpr.util_tf_thirteen;
      var util_tf_14 = parsedpr.util_tf_fourteen;
      var util_tf_15 = parsedpr.util_tf_fifteen;
      var util_tf_16 = parsedpr.util_tf_sixteen;
      var util_tf_17 = parsedpr.util_tf_seventeen;
      var util_tf_18 = parsedpr.util_tf_eighteen;
      var util_tf_19 = parsedpr.util_tf_nineteen;
      var util_tf_20 = parsedpr.util_tf_twenty;
      var util_tf_21 = parsedpr.util_tf_twentyone;
      var util_tf_22 = parsedpr.util_tf_twentytwo;
      var util_tf_23 = parsedpr.util_tf_twentythree;      
      $(".util_tf_1").html(util_tf_1); 
      $(".util_tf_2").html(util_tf_2);
      $(".util_tf_3").html(util_tf_3);
      $(".util_tf_4").html(util_tf_4);
      $(".util_tf_5").html(util_tf_5);
      $(".util_tf_6").html(util_tf_6);
      $(".util_tf_7").html(util_tf_7);
      $(".util_tf_8").html(util_tf_8);
      $(".util_tf_9").html(util_tf_9);
      $(".util_tf_10").html(util_tf_10);
      $(".util_tf_11").html(util_tf_11);
      $(".util_tf_12").html(util_tf_12);
      $(".util_tf_13").html(util_tf_13); 
      $(".util_tf_14").html(util_tf_14);   
      $(".util_tf_15").html(util_tf_15);
      $(".util_tf_16").html(util_tf_16);
      $(".util_tf_17").html(util_tf_17);
      $(".util_tf_18").html(util_tf_18);
      $(".util_tf_19").html(util_tf_19);
      $(".util_tf_20").html(util_tf_20);
      $(".util_tf_21").html(util_tf_21);
      $(".util_tf_22").html(util_tf_22);
      $(".util_tf_23").html(util_tf_23);

      // ---------------------- No .of car ----------------------- //
      var no_of_car_1 = parsedpr.no_of_car_one;
      var no_of_car_2 = parsedpr.no_of_car_two;
      var no_of_car_3 = parsedpr.no_of_car_three;
      var no_of_car_4 = parsedpr.no_of_car_four;
      var no_of_car_5 = parsedpr.no_of_car_five;
      var no_of_car_6 = parsedpr.no_of_car_six;
      var no_of_car_7 = parsedpr.no_of_car_seven;
      var no_of_car_8 = parsedpr.no_of_car_eight;
      var no_of_car_9 = parsedpr.no_of_car_nine; 
      var no_of_car_10 = parsedpr.no_of_car_ten;
      var no_of_car_11 = parsedpr.no_of_car_eleven;
      var no_of_car_12 = parsedpr.no_of_car_twelve;
      var no_of_car_13 = parsedpr.no_of_car_thirteen;
      var no_of_car_14 = parsedpr.no_of_car_fourteen;
      var no_of_car_15 = parsedpr.no_of_car_fifteen;
      var no_of_car_16 = parsedpr.no_of_car_sixteen;
      var no_of_car_17 = parsedpr.no_of_car_seventeen;
      var no_of_car_18 = parsedpr.no_of_car_eighteen;
      var no_of_car_19 = parsedpr.no_of_car_nineteen;
      var no_of_car_20 = parsedpr.no_of_car_twenty;
      var no_of_car_21 = parsedpr.no_of_car_twentyone;
      var no_of_car_22 = parsedpr.no_of_car_twentytwo;
      var no_of_car_23 = parsedpr.no_of_car_twentythree;      
      $(".no_of_car_1").html(no_of_car_1); 
      $(".no_of_car_2").html(no_of_car_2);
      $(".no_of_car_3").html(no_of_car_3);
      $(".no_of_car_4").html(no_of_car_4);
      $(".no_of_car_5").html(no_of_car_5);
      $(".no_of_car_6").html(no_of_car_6);
      $(".no_of_car_7").html(no_of_car_7);
      $(".no_of_car_8").html(no_of_car_8);
      $(".no_of_car_9").html(no_of_car_9);
      $(".no_of_car_10").html(no_of_car_10);
      $(".no_of_car_11").html(no_of_car_11);
      $(".no_of_car_12").html(no_of_car_12);
      $(".no_of_car_13").html(no_of_car_13); 
      $(".no_of_car_14").html(no_of_car_14);   
      $(".no_of_car_15").html(no_of_car_15);
      $(".no_of_car_16").html(no_of_car_16);
      $(".no_of_car_17").html(no_of_car_17);
      $(".no_of_car_18").html(no_of_car_18);
      $(".no_of_car_19").html(no_of_car_19);
      $(".no_of_car_20").html(no_of_car_20);
      $(".no_of_car_21").html(no_of_car_21);
      $(".no_of_car_22").html(no_of_car_22);
      $(".no_of_car_23").html(no_of_car_23);

      // ---------------------- No .of rickshaw ----------------------- //
      var no_of_rick_1 = parsedpr.no_of_rick_one;
      var no_of_rick_2 = parsedpr.no_of_rick_two;
      var no_of_rick_3 = parsedpr.no_of_rick_three;
      var no_of_rick_4 = parsedpr.no_of_rick_four;
      var no_of_rick_5 = parsedpr.no_of_rick_five;
      var no_of_rick_6 = parsedpr.no_of_rick_six;
      var no_of_rick_7 = parsedpr.no_of_rick_seven;
      var no_of_rick_8 = parsedpr.no_of_rick_eight;
      var no_of_rick_9 = parsedpr.no_of_rick_nine;
      var no_of_rick_10 = parsedpr.no_of_rick_ten;
      var no_of_rick_11 = parsedpr.no_of_rick_eleven;
      var no_of_rick_12 = parsedpr.no_of_rick_twelve;
      var no_of_rick_13 = parsedpr.no_of_rick_thirteen;
      var no_of_rick_14 = parsedpr.no_of_rick_fourteen;
      var no_of_rick_15 = parsedpr.no_of_rick_fifteen;
      var no_of_rick_16 = parsedpr.no_of_rick_sixteen;
      var no_of_rick_17 = parsedpr.no_of_rick_seventeen;
      var no_of_rick_18 = parsedpr.no_of_rick_eighteen;
      var no_of_rick_19 = parsedpr.no_of_rick_nineteen;
      var no_of_rick_20 = parsedpr.no_of_rick_twenty;
      var no_of_rick_21 = parsedpr.no_of_rick_twentyone;
      var no_of_rick_22 = parsedpr.no_of_rick_twentytwo;
      var no_of_rick_23 = parsedpr.no_of_rick_twentythree;      
      $(".no_of_rick_1").html(no_of_rick_1); 
      $(".no_of_rick_2").html(no_of_rick_2);
      $(".no_of_rick_3").html(no_of_rick_3);
      $(".no_of_rick_4").html(no_of_rick_4);
      $(".no_of_rick_5").html(no_of_rick_5);
      $(".no_of_rick_6").html(no_of_rick_6);
      $(".no_of_rick_7").html(no_of_rick_7);
      $(".no_of_rick_8").html(no_of_rick_8);
      $(".no_of_rick_9").html(no_of_rick_9);
      $(".no_of_rick_10").html(no_of_rick_10);
      $(".no_of_rick_11").html(no_of_rick_11);
      $(".no_of_rick_12").html(no_of_rick_12);
      $(".no_of_rick_13").html(no_of_rick_13); 
      $(".no_of_rick_14").html(no_of_rick_14);   
      $(".no_of_rick_15").html(no_of_rick_15);
      $(".no_of_rick_16").html(no_of_rick_16);
      $(".no_of_rick_17").html(no_of_rick_17);
      $(".no_of_rick_18").html(no_of_rick_18);
      $(".no_of_rick_19").html(no_of_rick_19);
      $(".no_of_rick_20").html(no_of_rick_20);
      $(".no_of_rick_21").html(no_of_rick_21);
      $(".no_of_rick_22").html(no_of_rick_22);
      $(".no_of_rick_23").html(no_of_rick_23);

      // ---------------------- Dryout hours ----------------------- //
      var final_arr = parsedpr.final_arr;
      jQuery.each( final_arr, function( i, val ) {
        $("." +i).html(val);        
      }); 
      // ---------------------- Dryout percentage ----------------------- //
      var dryout_per = parsedpr.dryout_per;
      jQuery.each( dryout_per, function( j, val ) {
        $("." +j).html(val);        
      });
      // ---------------------- BD Hours ----------------------- //
      var final_arr_bd = parsedpr.final_arr_bd;
      jQuery.each( final_arr_bd, function( bd, val ) {
        $("." +bd).html(val);        
      });
      // ---------------------- BD Hours ----------------------- //
      var final_arr_pm = parsedpr.final_arr_pm;
      jQuery.each( final_arr_pm, function( pm, val ) {
        $("." +pm).html(val);        
      });
      // ---------------------- Availability ------------------- //
      var final_availablity = parsedpr.final_availablity;
      jQuery.each( final_availablity, function(avail, val ) {
        $("." +avail).html(val);        
      });
      // ---------------------- Daily average ----------------- //
      var daily_avg_sale = parsedpr.daily_avg_sale;
      $(".daily_avg_sale").html(daily_avg_sale);
      var daily_avg_compsuc = parsedpr.daily_avg_compsuc;
      $(".daily_avg_compsuc").html(daily_avg_compsuc);
      var daily_avg_compdischrg = parsedpr.daily_avg_compdischrg;
      $(".daily_avg_compdischrg").html(daily_avg_compdischrg);
      var daily_avg_dispsale = parsedpr.daily_avg_dispsale;
      $(".daily_avg_dispsale").html(daily_avg_dispsale);
      var daily_avg_lcvsale = parsedpr.daily_avg_lcvsale;
      $(".daily_avg_lcvsale").html(daily_avg_lcvsale);
      var daily_avg_compgain = parsedpr.daily_avg_compgain;
      $(".daily_avg_compgain").html(daily_avg_compgain);
      var daily_avg_dispgain = parsedpr.daily_avg_dispgain;
      $(".daily_avg_dispgain").html(daily_avg_dispgain);
      var daily_avg_stngain = parsedpr.daily_avg_stngain;
      $(".daily_avg_stngain").html(daily_avg_stngain);
      var daily_avg_reactive_chrg = parsedpr.daily_avg_reactive_chrg;
      $(".daily_avg_reactive_chrg").html(daily_avg_reactive_chrg);
      var daily_avg_pf = parsedpr.daily_avg_pf;
      $(".daily_avg_pf").html(daily_avg_pf);
      var daily_avg_cmp_run_hrs = parsedpr.daily_avg_cmp_run_hrs;
      $(".daily_avg_cmp_run_hrs").html(daily_avg_cmp_run_hrs);
      var daily_avg_suc_prs = parsedpr.daily_avg_suc_prs;
      $(".daily_avg_suc_prs").html(daily_avg_suc_prs);
      var daily_avg_comp_flw = parsedpr.daily_avg_comp_flw;
      $(".daily_avg_comp_flw").html(daily_avg_comp_flw);
      var daily_avg_kwh_eqip = parsedpr.daily_avg_kwh_eqip;
      $(".daily_avg_kwh_eqip").html(daily_avg_kwh_eqip); 
      var daily_avg_kwh_stn = parsedpr.daily_avg_kwh_stn;
      $(".daily_avg_kwh_stn").html(daily_avg_kwh_stn);
      var daily_avg_util_16 = parsedpr.daily_avg_util_16;
      $(".daily_avg_util_16").html(daily_avg_util_16);
      var daily_avg_util_24 = parsedpr.daily_avg_util_24;
      $(".daily_avg_util_24").html(daily_avg_util_24);
      var daily_avg_dryout_hr = parsedpr.daily_avg_dryout_hr;
      $(".daily_avg_dryout_hr").html(daily_avg_dryout_hr);
      var daily_avg_dryout_per = parsedpr.daily_avg_dryout_per;
      $(".daily_avg_dryout_per").html(daily_avg_dryout_per);
      var daily_avg_bd_hr = parsedpr.daily_avg_bd_hr;
      $(".daily_avg_bd_hr").html(daily_avg_bd_hr);
      var daily_avg_pm_hr = parsedpr.daily_avg_pm_hr;
      $(".daily_avg_pm_hr").html(daily_avg_pm_hr);
      var daily_avg_avail = parsedpr.daily_avg_avail;
      $(".daily_avg_avail").html(daily_avg_avail);
      var daily_avg_carno = parsedpr.daily_avg_carno;
      $(".daily_avg_carno").html(daily_avg_carno);
      var daily_avg_rickno = parsedpr.daily_avg_rickno;
      $(".daily_avg_rickno").html(daily_avg_rickno);
      //--------------------- Monthly Average --------------------- // 
      var monthly_avg_sale = parsedpr.monthly_avg_sale;
      $(".monthly_avg_sale").html(monthly_avg_sale);

      var monthly_avg_compsuc = parsedpr.monthly_avg_compsuc;
      $(".monthly_avg_compsuc").html(monthly_avg_compsuc);

      var monthly_avg_compdischrg = parsedpr.monthly_avg_compdischrg;
      $(".monthly_avg_compdischrg").html(monthly_avg_compdischrg);

      var monthly_avg_reactive_chrg = parsedpr.monthly_avg_reactive_chrg;
      $(".monthly_avg_reactive_chrg").html(monthly_avg_reactive_chrg);

      var monthly_avg_pf = parsedpr.monthly_avg_pf;
      $(".monthly_avg_pf").html(monthly_avg_pf);

      var monthly_avg_cmp_run_hrs = parsedpr.monthly_avg_cmp_run_hrs;
      $(".monthly_avg_cmp_run_hrs").html(monthly_avg_cmp_run_hrs);

      var monthly_avg_suc_prs = parsedpr.monthly_avg_suc_prs;
      $(".monthly_avg_suc_prs").html(monthly_avg_suc_prs);


      $(".sale_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_sale+"</span> / <span class='text-red fw-600'>"+monthly_avg_sale+"</span>");

      $(".compsuc_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_compsuc+"</span> / <span class='text-red fw-600'>"+monthly_avg_compsuc+"</span>");
      
      $(".compdischrge_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_compdischrg+"</span> / <span class='text-red fw-600'>"+monthly_avg_compdischrg+"</span>");

      $(".react_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_reactive_chrg+"</span> / <span class='text-red fw-600'>"+monthly_avg_reactive_chrg+"</span>");

      $(".pf_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_pf+"</span> / <span class='text-red fw-600'>"+monthly_avg_pf+"</span>");

      $(".comprunhr_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_cmp_run_hrs+"</span> / <span class='text-red fw-600'>"+monthly_avg_cmp_run_hrs+"</span>");

      $(".sucprs_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_suc_prs+"</span> / <span class='text-red fw-600'>"+monthly_avg_suc_prs+"</span>");

      app.preloader.hide();
    }
  });
  
}); 

/*
*/
$(document).on('page:init', '.page[data-name="dpr_list"]', function (page) {
  menuload();
  checkConnection();
  var months_arr = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var mon_list='';
  var d = new Date();
  var c_mnth = d.getMonth()+1;
  var cur_mnth = c_mnth-1;
  mon_list+="<option value=''></option>";
  for(var m=0;m<months_arr.length;m++){
    if(m < 9){
      var mn = "0"+(m+1);
    }else{
      var mn = m+1;
    }
    if(m==cur_mnth){
      var sel_mn = 'selected';
    }else{
      var sel_mn='';
    }
    mon_list+="<option value='"+mn+"' "+sel_mn+">"+months_arr[m]+"</option>";
  } 
  $("#dpr_month").html(mon_list);
  var yrs='';
  
  var c_year = new Date().getFullYear();
  for(var y=2012;y<=c_year;y++){
    if(y==c_year){
      var sel_yr = 'selected';
    }else{
      var sel_yr='';
    }
    yrs+="<option value='"+y+"' "+sel_yr+">"+y+"</option>";
  }
  $("#dpr_year").html(yrs);
  var session_uid = window.localStorage.getItem("session_uid");
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getEICUserStations',
    data:{'session_uid':session_uid},
    success:function(result){
      $("#station_id").html(result);
    }    
  });
  getDPRList();
  /*$.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getTotalStations',
    data:{'session_uid':session_uid},
    dataType:'json',
    success:function(result){    
      //console.log(result.dpr_list);
      var dprList = result.dpr_list;
      $("#dpr_list").html(dprList);
    }
  });*/
});
function getDPRList(){
  var session_uid = window.localStorage.getItem("session_uid");
  var sess_designation = window.localStorage.getItem("sess_designation");
  var station_id = $("#station_id").val();
  var dpr_month = $("#dpr_month").val();
  var dpr_year = $("#dpr_year").val();
  $.ajax({
    type:'POST',  
    url:base_url+'APP/Appcontroller/getTotalStations',
    data:{'session_uid':session_uid,'sess_designation':sess_designation,'station_id':station_id,'dpr_month':dpr_month,'dpr_year':dpr_year},
    dataType:'json',
    success:function(result){    
      //console.log(result.dpr_list);
      var dprList = result.dpr_list;
      var total_dpr = result.total_dpr;
      if(total_dpr==undefined){
        total_dpr=0;
      }else{
        total_dpr=total_dpr;
      }
      $("#dpr_list").html(dprList); 
      $(".total_dpr").html("Total Records: ("+total_dpr+")");
    }
  });
}
function approve_dpr(dprid){
  checkConnection();
  var session_uid = window.localStorage.getItem("session_uid");
  app.preloader.show();
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/approveDPR',
    data:{'session_uid':session_uid,'dprid':dprid},
    //dataType:'json',
    success:function(result){ 
      //alert(result.trim());
      var res = result.trim();
      if(res=="Updated"){
        var toastCenter = app.toast.create({
          icon: '<i class="f7-icons">checkmark_alt_circle</i>',
          text: 'DPR approval updated successfully!',
          position: 'center',
          closeTimeout: 3000,
        });
        toastCenter.open();
        getDPRList(session_uid);
      }else if(result=="error"){
        app.dialog.alert("Error approving DPR");
      }
      app.preloader.hide();
    }
  });
}
// -------------------------------- DPR MODULE ENDS ------------------------------------//
// -------------------------------- L O G O U T -------------------------------- //
function logOut(){
  checkConnection();
  window.localStorage.removeItem("session_uid"); 
  window.localStorage.removeItem("session_utype"); 
  window.localStorage.removeItem("session_uclass"); 
  window.localStorage.removeItem("session_uname"); 
  window.localStorage.removeItem("session_stid"); 
  window.localStorage.removeItem("session_email"); 
  window.localStorage.removeItem("session_umob");
  window.localStorage.removeItem("sess_designation");
  mainView.router.navigate('/');   
  app.panel.close();
} 