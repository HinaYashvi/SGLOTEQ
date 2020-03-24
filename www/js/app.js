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
$(document).on('page:init', '.page[data-name="index"]', function (e) {
  //console.log(e);
});
function scanQR(){
  cordova.plugins.barcodeScanner.scan(function (result) {
    var qr_code = result.text; 
    //alert(qr_code);
    $.ajax({
      type:'POST', 
      url:base_url+'APP/Appcontroller/checkVehicleQR/'+qr_code,
      //data:{'qr_code':qr_code},
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

function openpopup(owner,mob1,mob2,email,vtype,metal_plate,rcbook,form24,num_plate,veh_no,hydro_date,perm_msg){
  if(perm_msg=="allow"){
    var filling_img = '<div class="text-center"><div class="text-uppercase"><h2>cng filling permission</h2></div><img src="img/right-2.png" width="150" /></div>';
  }else if(perm_msg=="deny"){
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
  var hidd_vehno = $("#hidd_vehno").val();
  cordova.plugins.barcodeScanner.scan(function (result) {
    //app.dialog.alert("Barcode/QR code data\n" + "Result: " + result.text + "\n" + "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled);
    var qr_code = result.text; 
    //gotoRecheckView(qr_code);
    mainView.router.navigate("/recheckQR/"+qr_code+"/"+hidd_vehno+"/");
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
  var qr_code = page.detail.route.params.qr_code;
  var hidd_vehno = page.detail.route.params.hidd_vehno;
  $.ajax({
      type:'POST', 
      //url:base_url+'APP/Appcontroller/checkVehicleQR',
      url:base_url+'APP/Appcontroller/updateVehicleQR',
      data:{'qr_code':qr_code,'hidd_vehno':hidd_vehno},
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
  var vehno2=np_one+np_two+np_three+np_four;

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
        upload_metalplate(lastid,old_metalplate,v_type,barcode_code,vehno2);
        upload_rcbook(lastid,old_rcbook,v_type,barcode_code,vehno2);
        upload_form24(lastid,old_from24,v_type,barcode_code,vehno2);
        upload_numplate(lastid,old_numplate,v_type,barcode_code,vehno2);
        mainView.router.navigate("/vst_submited/"+vehno2+"/");
      }    
    });
  }
}
$(document).on('page:init', '.page[data-name="vst_submited"]', function (page) {
  checkConnection();
  var veh_no2 = page.detail.route.params.vehno2; 
  $("#hidd_vehno").val(veh_no2);
});
function getCodeBoxElement(index) {
    return document.getElementById('codeBox' + index);
  }
function onKeyUpEvent(index, event) {
  const eventCode = event.which || event.keyCode;
  //console.log(getCodeBoxElement(index).value.length);
  //if(index == '3'){var len = 3}else{ var len = 2}
  if ((index!=3 && getCodeBoxElement(index).value.length === 2) || (index==3 && getCodeBoxElement(index).value.length === 3 || index==3 && getCodeBoxElement(index).value.length === 2)) {
    //console.log("called");
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

function upload_numplate(lastid,old_numplate,v_type,barcode_code,vehno2){
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
  //var uploadControllerURL_noplate = base_url+"APP/Appcontroller/photoupload_numplate/"+barcode_code+"/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_numplate+"/"+img_filename1+"/"+vehno2;

  var uploadControllerURL_noplate = base_url+"APP/Appcontroller/photoupload_numplate/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_numplate+"/"+img_filename1+"/"+vehno2;

 //var uploadControllerURL = base_url+"APP/Appcontroller/photoupload_metal/"+barcode_code+"/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_metalplate+"/"+test;  
  //alert(uploadControllerURL);
  //console.log(uploadControllerURL);    
  ft.upload(imageURI,uploadControllerURL_noplate,win,fail,options,true);
}

function upload_metalplate(lastid,old_metalplate,v_type,barcode_code,vehno2){
  //alert("called"+vehno2);
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
  //var uploadControllerURL = base_url+"APP/Appcontroller/photoupload_metal/"+barcode_code+"/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_metalplate+"/"+img_filename1+"/"+vehno2;

  var uploadControllerURL = base_url+"APP/Appcontroller/photoupload_metal/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_metalplate+"/"+img_filename1+"/"+vehno2;


 //var uploadControllerURL = base_url+"APP/Appcontroller/photoupload_metal/"+barcode_code+"/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_metalplate+"/"+test;  
  //alert(uploadControllerURL);
  //console.log(uploadControllerURL);    
  ft.upload(imageURI,uploadControllerURL, win, fail, options,true);
}
function upload_rcbook(lastid,old_rcbook,v_type,barcode_code,vehno2){
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
  //var uploadControllerURL_RC = base_url+"APP/Appcontroller/photoupload_RC/"+barcode_code+"/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_rcbook+"/"+img_filename1+"/"+vehno2; 

  var uploadControllerURL_RC = base_url+"APP/Appcontroller/photoupload_RC/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_rcbook+"/"+img_filename1+"/"+vehno2; 

  //console.log(uploadControllerURL_RC);
  ft.upload(imageURI,uploadControllerURL_RC, win, fail, options,true);
}
function upload_form24(lastid,old_from24,v_type,barcode_code,vehno2){
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
  //var uploadControllerURL_form24 = base_url+"APP/Appcontroller/photoupload_form24/"+barcode_code+"/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_from24+"/"+img_filename2+"/"+vehno2; 

  var uploadControllerURL_form24 = base_url+"APP/Appcontroller/photoupload_form24/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_from24+"/"+img_filename2+"/"+vehno2; 


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
        //console.log(parseData+"*********");
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
              mainView.router.navigate("/veh_exists/"+vehno+"/");
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
              mainView.router.navigate("/veh_search/"+veh_msg+"/"+status+"/"+owner_name+"/"+mobile_one+"/"+mob2+"/"+email+"/"+vehicle_type+"/null/null/null/null/"+vehicle_no+"/"+due_yr+"/"+due_mm+"/"+due_dd+"/"+code_chk+"/"+perm_msg+"/");
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

$(document).on('page:init', '.page[data-name="veh_exists"]', function (page) {
  checkConnection();
  var veh_no = page.detail.route.params.vehno; 
  $("#hidd_vehno").val(veh_no);
});

$(document).on('page:init', '.page[data-name="veh_search"]', function (page) {
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
  var code_chk = page.detail.route.params.code_chk;
  var perm_msg = page.detail.route.params.perm_msg;
  var vst_html = '';
  //console.log("hiiiiiiiiiiiiiii"+status+"*****"+veh_msg);
  if(status=='success'){    
    vst_html+='<div class="block-title"><strong>Name of Owner / Driver</strong></div><div class="block"><p class="text-uppercase">'+owner_name+'</p></div><div class="block-title">Mobile No</div><div class="block"><p class="text-uppercase">'+mobile_one+'</p></div><div class="block-title">Vehicle No</div><div class="block"><p class="text-uppercase">'+vehicle_no+'</p></div><div class="block-title">Hydrotest Due Date</div><div class="block"><p class="text-uppercase">'+hydro_due_dt+'</p></div>';    
    //console.log(veh_msg);
    if(perm_msg=='allow'){
      if(code_chk=='barcode_notexists'){
        mainView.router.navigate("/veh_exists/"+vehicle_no+"/");
      }else if(code_chk=='barcode_exists'){
        vst_html+='<div class="text-center"><div class="text-uppercase"><h2>cng filling permission</h2></div><img src="img/right-2.png" width="150" /></div>';      
        vst_html+='<a class="button dynamic-popup" onclick="openpopup('+"'"+owner_name+"'"+','+"'"+mobile_one+"'"+','+"'"+mob2+"'"+','+"'"+email+"'"+','+"'"+vehicle_type+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+vehicle_no+"'"+','+"'"+hydro_due_dt+"'"+','+"'"+perm_msg+"'"+')" href="#">View Details</a>';
      }
    $(".vstdata").html(vst_html);  
    }else if(perm_msg=='deny'){
      if(code_chk=='barcode_notexists'){
        mainView.router.navigate("/veh_exists/"+vehicle_no+"/");
      }else if(code_chk=='barcode_exists'){
        vst_html+='<div class="text-center"><div class="text-uppercase"><h2>cng filling permission</h2></div><img src="img/wrong.jpg" width="200" /></div>';      
        vst_html+='<a class="button dynamic-popup" onclick="openpopup('+"'"+owner_name+"'"+','+"'"+mobile_one+"'"+','+"'"+mob2+"'"+','+"'"+email+"'"+','+"'"+vehicle_type+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+vehicle_no+"'"+','+"'"+hydro_due_dt+"'"+','+"'"+perm_msg+"'"+')" href="#">View Details</a>';  
      }        
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
  checkConnection();
  app.preloader.show();
  var session_uid = window.localStorage.getItem("session_uid");

  var calendarModal_dpr = app.calendar.create({
    inputEl: '#demo-calendar-modal-dpr',
    openIn: 'customModal',
    dateFormat: 'dd-mm-yyyy',
    header: true,
    footer: true,
    renderToolbar: function () {   
      return '<div class="toolbar no-shadow"><div class="toolbar-inner"><div class="calendar-month-selector"><a href="#" class="link icon-only calendar-prev-month-button"><i class="f7-icons ">chevron_left</i></a><span class="current-month-value"></span><a href="#" class="link icon-only calendar-next-month-button"><i class="f7-icons ">chevron_right</i></a></div><div class="calendar-year-selector"><a href="#" class="link icon-only calendar-prev-year-button"><i class="f7-icons ">chevron_left</i></a><span class="current-year-value"></span><a href="#" class="link icon-only calendar-next-year-button"><i class="f7-icons ">chevron_right</i></a></div></div></div>'; 
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
$(document).on('page:init', '.page[data-name="dpr_sheet"]', function (page) {
  checkConnection();
  var station_id = page.detail.route.params.station_id;
  var dpr_date = page.detail.route.params.demo_calendar_modal_dpr;
  var station_name = page.detail.route.params.st_name;
  $("#hidd_stid").val(station_id);
  $("#hidd_dprdt").val(dpr_date);
  $(".st_name").html(station_name);
  $(".dpr_dt").html(dpr_date);
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
  var time = hour+":"+minute;
  console.log(time);

  var quarter_minutes = ["00:45","01:45","02:45","03:45","04:45","05:45","06:45","07:45","08:45","09:45","10:45","11:45","12:45","13:45","14:45","15:45","16:45","17:45","18:45","19:45","20:45","21:45","22:45","23:45"];
  var slot_hour = hour+":00";

  if(quarter_minutes.indexOf(time) != -1){  
    //console.log("found"); 
    //console.log("Please fill all required values for "+slot_hour);
     // element found //
  }else{
    //console.log("not found");
     // element not found //
  }
}, 5000);
//300000
  /*$.ajax({
    type:'PUT', 
    url:base_url+'APP/Appcontroller/getDPRsheetFields',
    //data:{'session_uid':session_uid},
    success:function(result){
      console.log(result);
      $("#sheet_data").html(result);
    }    
  });*/

});
function show_secondpg(){
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
  $(".page1_btn").addClass("display-none");
  $(".page2_btn").removeClass("display-none");
  $(".page2_btn").addClass("display-block");
}
function show_thirdpg(){
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
  $(".page2_btn").addClass("display-none");
  $(".page3_btn").removeClass("display-none");
  $(".page3_btn").addClass("display-block");
}
function show_forthpg(){
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
  $(".page3_btn").addClass("display-none");
  $(".page4_btn").removeClass("display-none");
  $(".page4_btn").addClass("display-block");
}
function show_fifthpg(){
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
  $(".page4_btn").addClass("display-none");
  $(".page5_btn").removeClass("display-none");
  $(".page5_btn").addClass("display-block");
}
function show_sixthpg(){
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
  $(".page5_btn").addClass("display-none");
  $(".page6_btn").removeClass("display-none");
  $(".page6_btn").addClass("display-block");
}
function show_seventhpg(){
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
  $(".page6_btn").addClass("display-none");
  $(".page7_btn").removeClass("display-none");
  $(".page7_btn").addClass("display-block");
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
  $(".page7_btn").addClass("display-none");
  $(".page8_btn").removeClass("display-none");
  $(".page8_btn").addClass("display-block");
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
  $(".page8_btn").addClass("display-none");
  $(".page9_btn").removeClass("display-none");
  $(".page9_btn").addClass("display-block");
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
  $(".page9_btn").addClass("display-none");
  $(".page10_btn").removeClass("display-none");
  $(".page10_btn").addClass("display-block");
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
  $(".page10_btn").addClass("display-none");
  $(".page11_btn").removeClass("display-none");
  $(".page11_btn").addClass("display-block");
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
  $(".page11_btn").addClass("display-none");
  $(".page12_btn").removeClass("display-none");
  $(".page12_btn").addClass("display-block");
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
  $(".page12_btn").addClass("display-none");
  $(".page13_btn").removeClass("display-none");
  $(".page13_btn").addClass("display-block");
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
  $(".page13_btn").addClass("display-none");
  $(".page14_btn").removeClass("display-none");
  $(".page14_btn").addClass("display-block");
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
  $(".page14_btn").addClass("display-none");
  $(".page15_btn").removeClass("display-none");
  $(".page15_btn").addClass("display-block");
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
  $(".page15_btn").addClass("display-none");
  $(".page16_btn").removeClass("display-none");
  $(".page16_btn").addClass("display-block");
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
  $(".page16_btn").addClass("display-none");
  $(".page17_btn").removeClass("display-none");
  $(".page17_btn").addClass("display-block");
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
  $(".page17_btn").addClass("display-none");
  $(".page18_btn").removeClass("display-none");
  $(".page18_btn").addClass("display-block");
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
  $(".page18_btn").addClass("display-none");
  $(".page19_btn").removeClass("display-none");
  $(".page19_btn").addClass("display-block");
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
  $(".page19_btn").addClass("display-none");
  $(".page20_btn").removeClass("display-none");
  $(".page20_btn").addClass("display-block");
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
  $(".page20_btn").addClass("display-none");
  $(".page21_btn").removeClass("display-none");
  $(".page21_btn").addClass("display-block");
}
function show_twentytwopg(){
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
  $(".page21_btn").addClass("display-none");
  $(".page22_btn").removeClass("display-none");
  $(".page22_btn").addClass("display-block");
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
  $(".page22_btn").addClass("display-none");
  $(".save_btn").removeClass("display-none");
  $(".save_btn").addClass("display-block");
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
  mainView.router.navigate('/');   
  app.panel.close();
}