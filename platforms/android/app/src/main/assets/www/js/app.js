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
  //alert(app.views.main.router.history.length==2);
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
          });*/  
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

  var pass_length = $(".l_pass").val();
  var len_pass = pass_length.length;
  if(len_pass >= 3){
    //$(".login-button a").css('background','#018137!important;');
    //$(".login-button a").css('border','none!important;');
    $(".submit-box").removeClass("login-button");
    $(".submit-box").addClass("login_change");
  }else if(len_pass <= 0){
    $(".submit-box").removeClass("login_change");
    $(".submit-box").addClass("login-button");
  }
}
function showpassword(show){
  if(show=='show'){
    $(".pass").attr('type','text');    
    $(".showpass").html('<span class="f7-icons text-white fs-18" onclick="showpassword('+"'"+"hide"+"'"+')">eye_slash</span>');
  }else if(show=='hide'){
    $(".pass").attr('type','password');
    $(".showpass").html('<span class="f7-icons text-white fs-18" onclick="showpassword('+"'"+"show"+"'"+')">eye_fill</span>');
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
  app.panel.close();

  checkConnection(); 
  //logOut();  
  var session_uid = window.localStorage.getItem("session_uid"); 
  $.ajax({ 
    type:'POST', 
    url:base_url+'APP/Appcontroller/getModules',   
    data:{'session_uid':session_uid},
    success:function(module){
      window.localStorage.removeItem("module_name"); 
      var parsemodule = $.parseJSON(module);
      var html = parsemodule.html;
      //console.log(html);
      $(".dashicons").html(html); 
      //var module_name = $(".mod_name").text();
      //window.localStorage.setItem("module_name",module_name);
    }
  });
});  
function view_comp(dc_id,stn_name,dc_dttm){
  mainView.router.navigate("/dpr_view_complain/"+dc_id+"/"+stn_name+"/"+dc_dttm+"/");
}
function dltcorr(dc_id){
  checkConnection();
  menuload(); 
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/DelCorrectionDPR',
    data:{'dc_id':dc_id},
    success:function(result){
      var res = result.trim();
      if(res=="deleted"){
        var toastCenter = app.toast.create({
          icon: '<i class="f7-icons">checkmark_alt_circle_fill</i>',
          text: 'Correction deleted successfully!',
          position: 'center',
          closeTimeout: 3000,
        });
        toastCenter.open();
        mainView.router.navigate("/dpr_complain/");
      }else{
        app.dialog.alert("Problem deleting data");
      }
    }
  });
} 
$(document).on('page:init', '.page[data-name="dpr_view_complain"]', function (page) {
  checkConnection();
  app.panel.close();
  menuload();  
  var sess_designation = window.localStorage.getItem("sess_designation");
  var dc_id = page.detail.route.params.dc_id;
  var stn_name = page.detail.route.params.stn_name;
  var dc_dttm = page.detail.route.params.dc_dttm;
  $.ajax({
    type:'POST', 
    dataType:'json',
    url:base_url+'APP/Appcontroller/getDPRcompdata',
    data:{'dc_id':dc_id,'stn_name':stn_name,'dc_dttm':dc_dttm,'sess_designation':sess_designation},
    success:function(res){
      var html = res.html;
      $(".dpr_complaindet").html(html);  
    }
  });
}); 
function approvecomp(dc_id,apr_status,stn_name,dttm){
  checkConnection();
  menuload();
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/updtcompappst',
    data:{'dc_id':dc_id,'apr_status':apr_status},
    success:function(res){
      var msg = res.trim();
      console.log(res);
      if(msg=="error"){
        app.dialog.alert("Error updating status");
      }else{
        app.dialog.alert(msg);
        //mainView.router.navigate("/dpr_view_complain/"+dc_id+"/"+stn_name+"/"+dttm+"/");
        mainView.router.navigate("/dpr_complain/");
      }
    }
  });
}
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

  var session_uid = window.localStorage.getItem("session_uid"); 
  var sess_designation = window.localStorage.getItem("sess_designation"); 
  var sess_module_name =window.localStorage.getItem("module_name");
  //alert(sess_module_name);
  //console.log(sess_designation);       
  var menulist='';   
  var session_umob = window.localStorage.getItem("session_umob");
  var session_utype = window.localStorage.getItem("session_utype");
  var session_email = window.localStorage.getItem("session_email");
  var session_uname = window.localStorage.getItem("session_uname");

  menulist+='<p><center><img id="user_pic" src="img/nouser.png" height="100" width="100" class="img-circle"></center></p><p ><center id="userName" class="text-uppercase">'+session_uname+'</center></p><p ><center id="userdesg_type" class="text-uppercase"><span class="fs-12">['+sess_designation+' - '+session_utype+']</span></center></p><p ><center id="userEmail" class=""><i class="f7-icons fs-14 mr-5">envelope_fill</i><span class="fs-12">'+session_email+'</span></center></p><p ><center id="userMo" class="text-uppercase"><i class="f7-icons fs-14 mr-5">phone_circle_fill</i>'+session_umob+'</center></p>';

  if(sess_designation == 'SGL EIC'){
    if(sess_module_name==='dpr'){
      menulist+='<br/><p><a class="text-white link" href="/dpr_list/"><i class="f7-icons fs-16 mr-5">speedometer</i>DPR</a></p><p><a class="text-white link" href="/dpr_complain/"><i class="f7-icons fs-16 mr-5">checkmark_shield_fill</i>DPR Corrections</a><span class="cntnoti float-right"></span></p><p><a class="text-white link" href="/dpr/"><i class="f7-icons fs-16 mr-5">chart_bar_alt_fill</i>DPR KPI Report</a></p><p><a class="text-white link" href="/change_password/" ><i class="f7-icons fs-16 mr-5">lock_fill</i>Change Password</a></p><p><a class="text-white link" href="#" onclick="logOut()"><i class="f7-icons fs-16 mr-5">power</i>Logout</a></p>';
    }
    if(sess_module_name==='vst'){
      menulist+='<br/><p><a class="text-white link" href="/dashboard/"><i class="f7-icons fs-16 mr-5">house_fill</i>Dashboard</a></p><p><a class="text-white link" href="/change_password/" ><i class="f7-icons fs-16 mr-5">lock_fill</i>Change Password</a></p><p><a class="text-white link" href="#" onclick="logOut()"><i class="f7-icons fs-16 mr-5">power</i>Logout</a></p>';
    }
    if(sess_module_name==='jmr'){
      menulist+='<br/><p><a class="text-white link" href="/dashboard/"><i class="f7-icons fs-16 mr-5">house_fill</i>Dashboard</a></p><p><a class="text-white link" href="/change_password/" ><i class="f7-icons fs-16 mr-5">lock_fill</i>Change Password</a></p><p><a class="text-white link" href="#" onclick="logOut()"><i class="f7-icons fs-16 mr-5">power</i>Logout</a></p>';
    }
    if(sess_module_name==='cms'){
      menulist+='<br/><p><a class="text-white link" href="/dashboard/"><i class="f7-icons fs-16 mr-5">house_fill</i>Dashboard</a></p><p><a class="text-white link" href="/cms/"><i class="f7-icons fs-16 mr-5">house_fill</i>Complaints</a></p><p><a class="text-white link" href="/change_password/" ><i class="f7-icons fs-16 mr-5">lock_fill</i>Change Password</a></p><p><a class="text-white link" href="#" onclick="logOut()"><i class="f7-icons fs-16 mr-5">power</i>Logout</a></p>';
    }
  }else{
    if(sess_module_name==='dpr'){
      menulist+='<br/><p><a class="text-white link" href="/dpr_list/"><i class="f7-icons fs-16 mr-5">speedometer</i>DPR</a></p><p><a class="text-white link" href="/dpr_complain/"><i class="f7-icons fs-16 mr-5">checkmark_shield_fill</i>DPR Corrections</a><span class="cntnoti float-right"></span></p><p><a class="text-white link" href="/change_password/" ><i class="f7-icons fs-16 mr-5">lock_fill</i>Change Password</a></p><p><a class="text-white link" href="#" onclick="logOut()"><i class="f7-icons fs-16 mr-5">power</i>Logout</a></p>';
    }
    if(sess_module_name==='vst'){
      menulist+='<br/><p><a class="text-white link" href="/dashboard/"><i class="f7-icons fs-16 mr-5">house_fill</i>Dashboard</a></p><p><a class="text-white link" href="/change_password/" ><i class="f7-icons fs-16 mr-5">lock_fill</i>Change Password</a></p><p><a class="text-white link" href="#" onclick="logOut()"><i class="f7-icons fs-16 mr-5">power</i>Logout</a></p>';
    }
    if(sess_module_name==='jmr'){
      menulist+='<br/><p><a class="text-white link" href="/dashboard/"><i class="f7-icons fs-16 mr-5">house_fill</i>Dashboard</a></p><p><a class="text-white link" href="/change_password/" ><i class="f7-icons fs-16 mr-5">lock_fill</i>Change Password</a></p><p><a class="text-white link" href="#" onclick="logOut()"><i class="f7-icons fs-16 mr-5">power</i>Logout</a></p>';
    }
    if(sess_module_name==='cms'){
      menulist+='<br/><p><a class="text-white link" href="/dashboard/"><i class="f7-icons fs-16 mr-5">house_fill</i>Dashboard</a></p><p><a class="text-white link" href="/cms/"><i class="f7-icons fs-16 mr-5">house_fill</i>Complaints</a></p><p><a class="text-white link" href="/change_password/" ><i class="f7-icons fs-16 mr-5">lock_fill</i>Change Password</a></p><p><a class="text-white link" href="#" onclick="logOut()"><i class="f7-icons fs-16 mr-5">power</i>Logout</a></p>';
    }
  }
  $(".menulist").html(menulist);
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getDPRComplains',
    data:{'session_uid':session_uid,'sess_designation':sess_designation},
    dataType:'json',
    success:function(result_html){
      var notifi_cnt = result_html.notifi_cnt;
      if(notifi_cnt >= 1){
        $(".cntnoti").html("<span class='badge rd-badge'>"+notifi_cnt+"</span>")
      }
    }    
  });
}
$(document).on('page:init', '.page[data-name="index"]', function (e) {
  //console.log(e);
  menuload();
  app.panel.close();
  /*var calendarModal_dpr = app.calendar.create({    
    inputEl: '#demo-calendar-modal-dpr',
    openIn: 'customModal',
    dateFormat: 'dd-mm-yyyy',
    header: true,
    footer: true,
    renderToolbar: function () {    
      return '<div class="toolbar no-shadow"><div class="toolbar-inner"><div class="calendar-month-selector"><a href="#" class="link icon-only calendar-prev-month-button"><i class="f7-icons ">chevron_left</i></a><span class="current-month-value"></span><a href="#" class="link icon-only calendar-next-month-button"><i class="f7-icons ">chevron_right</i></a></div><div class="calendar-year-selector"><a href="#" class="link icon-only calendar-prev-year-button"><i class="f7-icons ">chevron_left</i></a><span class="current-year-value"></span><a href="#" class="link icon-only calendar-next-year-button"><i class="f7-icons ">chevron_right</i></a></div></div></div>'; 
    },
    //disabled: {
    //    from: new Date(yr, mnth, dt)
    //}
  });  */
});
$(document).on('page:init', '.page[data-name="vst"]', function (e) {
  //console.log(e);
  menuload();
  app.panel.close();
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
  var hidd_vehno=$("#hidd_vehno").val();
  //alert("### "+hidd_vehno);
  cordova.plugins.barcodeScanner.scan(function (result) {
    //app.dialog.alert("Barcode/QR code data\n" + "Result: " + result.text + "\n" + "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled);
    var qr_code = result.text; 
    //gotoRecheckView(qr_code);
    //mainView.router.navigate("/recheckQR/"+qr_code+"/"); // old 15-06-2020 //
    mainView.router.navigate("/recheckQR/"+qr_code+"/"+hidd_vehno+"/"); // new 15-06-2020 //
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
  app.panel.close();
  var qr_code = page.detail.route.params.qr_code;
  var hidd_vehno = page.detail.route.params.hidd_vehno;
  $.ajax({
      type:'POST', 
      //url:base_url+'APP/Appcontroller/checkVehicleQR',
      url:base_url+'APP/Appcontroller/checkVehicle_recheckQR/'+qr_code+"/"+hidd_vehno,
      //data:{'qr_code':qr_code},
      //data:{'qr_code':qr_code,'hidd_vehno':hidd_vehno},
      success:function(data){
        var parseData = $.parseJSON(data);
        var veh_msg = parseData.veh_msg;
        var checkQR = parseData.checkQR;  
        var status = parseData.status;
        console.log(veh_msg+"====="+checkQR+"====="+status);
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
  app.panel.close();
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
  app.panel.close();
  checkConnection();
  var prev_page = page.detail.pageFrom.name;
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
  var hidden_vehno = $("#hidden_vehno").val();
  //alert(hidden_vehno);

  var split_vehno = hidden_vehno.split("-");
  var split_one = split_vehno[0];
  var split_two = split_vehno[1];
  var split_three = split_vehno[2]; 
  var split_four = split_vehno[3];

  $("#codeBox1").val(split_one);
  $("#codeBox2").val(split_two);
  $("#codeBox3").val(split_three);
  $("#codeBox4").val(split_four); 
  $("#codeBox1").focus();
  //var qrcode_txt = page.detail.route.params.qr_code_txt;
  //$("#barcode_code").val(qrcode_txt);
});
function vstadd(){
  checkConnection();
  var session_uid = window.localStorage.getItem("session_uid");
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


  var hidd_vehno = np_one+"-"+np_two+"-"+np_three+"-"+np_four;
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
    app.preloader.show(); 
    $.ajax({
      type:'POST', 
      url:base_url+'APP/Appcontroller/addVST',
      data:form_vst+"&session_uid="+session_uid,
      success:function(lastid){
        upload_metalplate(lastid,old_metalplate,v_type,barcode_code);
        upload_rcbook(lastid,old_rcbook,v_type,barcode_code);
        upload_form24(lastid,old_from24,v_type,barcode_code);
        upload_numplate(lastid,old_numplate,v_type,barcode_code);
        //mainView.router.navigate("/vst_submited/");
        app.preloader.hide();
        mainView.router.navigate("/vst_submited/"+hidd_vehno+"/");
      }    
    });    
  }
   
}
$(document).on('page:init', '.page[data-name="vst_submited"]', function (page) {
  menuload();
  app.panel.close();
  checkConnection();  
  app.preloader.show(); 
  var hidd_vehno = page.detail.route.params.hidd_vehno; 
  $("#hidd_vehno").val(hidd_vehno);
  app.preloader.hide(); 
});
function getCodeBoxElement(index) {
    return document.getElementById('codeBox'+index);
  }
function onKeyUpEvent(index, event) {
  const eventCode = event.which || event.keyCode;
  console.log(getCodeBoxElement(index).value.length);
  //if(index == '3'){var len = 3}else{ var len = 2}
  if ((index!=3 && getCodeBoxElement(index).value.length === 2) || (index==3 && getCodeBoxElement(index).value.length === 3 || index==3 && getCodeBoxElement(index).value.length === 2)) {
    console.log("called");
    searchByveh();
    if(index == 1 || index == 2 || index == 3){
      if(getCodeBoxElement(index).value.length === 2){
        getCodeBoxElement(index+ 1).focus();
      }else if(getCodeBoxElement(index).value.length === 2){
        getCodeBoxElement(index+ 1).focus();
      }      
    }else if (index !== 4) {      
      getCodeBoxElement(index+ 1).focus();
    } else {
      getCodeBoxElement(index).blur();
      // Submit code
      console.log('submit code ');
    }
    /*if (index !== 4) {      
      getCodeBoxElement(index+ 1).focus();
    } else {
      getCodeBoxElement(index).blur();
      // Submit code
      console.log('submit code ');
    }*/
  }

  if (eventCode === 8 && index !== 1) {
    getCodeBoxElement(index - 1).focus();
  }
}
  function onFocusEvent(index) {
    for (item = 1; item < index; item++) {
      var currentElement = getCodeBoxElement(item);
      if (!currentElement.value) {
          currentElement.focus();
          break;
      }
    }
  }


function onKeyUpEvent_noveh(index, event) {
  const eventCode = event.which || event.keyCode;
  var hidd_qrtxt=$("#hidd_qrtxt").val();
  console.log(getCodeBoxElement_noveh(index).value.length);
  //if(index == '3'){var len = 3}else{ var len = 2}

  if(index == 1){    
    if(getCodeBoxElement_noveh(index).value.length == 2){
      getCodeBoxElement_noveh(index+ 1).focus();
    }else if(getCodeBoxElement_noveh(index).value.length < 2){
      getCodeBoxElement_noveh(index).focus();
    }      
  }else if(index == 2){
    if(getCodeBoxElement_noveh(index).value.length == 2){
      getCodeBoxElement_noveh(index+ 1).focus();
    }else if(getCodeBoxElement_noveh(index).value.length < 2){
      getCodeBoxElement_noveh(index).focus();
    }
  }else if(index == 3){
    if(getCodeBoxElement_noveh(index).value.length == 2){
      getCodeBoxElement_noveh(index+ 1).focus();
    }else if(getCodeBoxElement_noveh(index).value.length < 2){
      getCodeBoxElement_noveh(index).focus();
    }
  }


  if ((index!=3 && getCodeBoxElement_noveh(index).value.length === 2) || (index==3 && getCodeBoxElement_noveh(index).value.length === 3 || index==3 && getCodeBoxElement_noveh(index).value.length === 2)) {
    console.log("called");
    //searchByveh();
    if (index !== 4) {      
      getCodeBoxElement_noveh(index+ 1).focus();
    } else {
      getCodeBoxElement_noveh(index).blur();
      // Submit code
      console.log('submit code ');
      searchByveh_noveh(hidd_qrtxt);
    }
    /*if (index !== 4) {      
      getCodeBoxElement(index+ 1).focus();
    } else {
      getCodeBoxElement(index).blur();
      // Submit code
      console.log('submit code ');
    }*/
  } 
  if (eventCode === 8 && index !== 1) {
    getCodeBoxElement_noveh(index - 1).focus();
  }
}
function onFocusEvent_noveh(index) {
  for (item = 1; item < index; item++) {
    var currentElement = getCodeBoxElement_noveh(item);
    if (!currentElement.value) {
        currentElement.focus();
        break;
    }
  }
}
function getCodeBoxElement_noveh(index) {
  return document.getElementById('codeBox'+index+"_"+index);
}
//function searchByveh_noveh(){
function searchByveh_noveh(hidd_qrtxt){
  //alert("searchByveh_noveh");
  var codeBox1 = $("#codeBox1_1").val();
  var codeBox2 = $("#codeBox2_2").val();
  var codeBox3 = $("#codeBox3_3").val();
  var codeBox4 = $("#codeBox4_4").val();
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
        if(status=='success'){
          if(veh_msg=='exist'){
            if(code_chk=='barcode_notexists'){
              //mainView.router.navigate("/veh_exists/");
              mainView.router.navigate("/veh_exists/"+veh_no+"/");
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
              mainView.router.navigate("/veh_search/"+veh_msg+"/"+status+"/"+owner_name+"/"+mobile_one+"/"+mob2+"/"+email+"/"+vehicle_type+"/null/null/null/null/"+vehicle_no+"/"+due_yr+"/"+due_mm+"/"+due_dd+"/"+perm_msg+"/");
            }
          }
          
          //alert("hello hiiiiiiiiii");
        }else if(status=='fail'){
          //console.log("fail");
          $(".vstdata").html('');
          if(veh_msg=='not_exist'){
            //mainView.router.navigate("/no_vehdata/null/"); 
            //mainView.router.navigate("/add_vst/null/"); 
            mainView.router.navigate("/add_vst/"+hidd_qrtxt+"/");
          }
        }      
        //mainView.router.navigate("/veh_search/"+parseData+"/");
      }
    });  
  }else{
    return false;
  }
}
function gotonext_four_noveh(txtval){
  var txtlen = txtval.value.length; 
  var hidd_qrtxt = $("#hidd_qrtxt").val();
  var codeBox1_1 = $("#codeBox1_1").val();
  var codeBox2_2 = $("#codeBox2_2").val();
  var codeBox3_3 = $("#codeBox3_3").val();
  var codeBox4_4 = $("#codeBox4_4").val();
  var veh_no = codeBox1_1+"-"+codeBox2_2+"-"+codeBox3_3+"-"+codeBox4_4;
  vehno = codeBox1_1+codeBox2_2+codeBox3_3+codeBox4_4;
  $("#hidden_vehno").val(veh_no);
  if(txtlen>5){
    $("#codeBox4_4").val('');
    //searchByveh();
    app.dialog.alert("Enter valid vehicle number");
  }else if(txtlen==4 || txtlen==5){    
    //searchByveh_noveh();
    searchByveh_noveh(hidd_qrtxt);
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
  //var uploadControllerURL_noplate = base_url+"APP/Appcontroller/photoupload_numplate/"+barcode_code+"/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_numplate+"/"+img_filename1;

   var uploadControllerURL_noplate = base_url+"APP/Appcontroller/photoupload_numplate/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_numplate+"/"+img_filename1+"/"+barcode_code;

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
  //var uploadControllerURL = base_url+"APP/Appcontroller/photoupload_metal/"+barcode_code+"/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_metalplate+"/"+img_filename1;

  var uploadControllerURL = base_url+"APP/Appcontroller/photoupload_metal/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_metalplate+"/"+img_filename1+"/"+barcode_code;

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
  //var uploadControllerURL_RC = base_url+"APP/Appcontroller/photoupload_RC/"+barcode_code+"/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_rcbook+"/"+img_filename1; 

  var uploadControllerURL_RC = base_url+"APP/Appcontroller/photoupload_RC/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_rcbook+"/"+img_filename1+"/"+barcode_code;

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
  //var uploadControllerURL_form24 = base_url+"APP/Appcontroller/photoupload_form24/"+barcode_code+"/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_from24+"/"+img_filename2; 

  var uploadControllerURL_form24 = base_url+"APP/Appcontroller/photoupload_form24/"+v_type+"/"+session_uid+"/"+lastid+"/"+old_from24+"/"+img_filename2+"/"+barcode_code;

  //alert(uploadControllerURL_form24);
  //console.log(uploadControllerURL_form24);
  ft.upload(imageURI,uploadControllerURL_form24, win, fail, options,true);
}
function win(r) { 
  //alert("in win ");
  //document.writeln("r = "+r);
   
  checkConnection();         
  var responseCode = r.responseCode;
  //alert(responseCode+" responseCode");
  //alert("r = "+JSON.stringify(r));
  //document.writeln("r = "+JSON.stringify(r));
  if(responseCode==200){     
    app.dialog.close();  
  } 
}
function fail(error) {
  //alert("in fail");
 // alert(error);
  //alert("error code "+error.code); 
  checkConnection();  
  app.dialog.alert("An error has occurred: Code = " + error.code);
  app.dialog.alert("upload error source " + error.source);
  app.dialog.alert("upload error target " + error.target);
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
function capturePhoto_cms() {
  checkConnection();   
  navigator.camera.getPicture(onPhotoDataSuccess_cms, onFail, {
  quality: 100,
  targetWidth: 600,
  targetHeight: 600,
  destinationType: destinationType.FILE_URI,
  //saveToPhotoAlbum: true
  saveToPhotoAlbum: false,
  correctOrientation: true,
  }); 
}
function onPhotoDataSuccess_cms(imageURI){
  checkConnection();  
  var cameraImage = document.getElementById('image_cms_0');
  //alert(cameraImage);
  //cameraImage.style.display = 'block';
  $("#imageblock_cms_0").removeClass("display-none");
  $("#imageblock_cms_0").addClass("display-block");
  cameraImage.src = imageURI;
}
function onPhotoDataSuccess_cms(imageURI){
  checkConnection();  
  var cameraImage = document.getElementById('image_cms_0');
  //alert(cameraImage);
  //cameraImage.style.display = 'block';
  $("#imageblock_cms_0").removeClass("display-none");
  $("#imageblock_cms_0").addClass("display-block");
  cameraImage.src = imageURI;
}
function getPhoto_cms(source) {
  checkConnection();    
  navigator.camera.getPicture(onPhotoURISuccess_cms, onFail, {
    quality: 100,
    correctOrientation: 1,
    targetWidth: 600,
    targetHeight: 600,
    destinationType: destinationType.FILE_URI,
    sourceType: source
  });
}  
function onPhotoURISuccess_cms(imageURI_gallery1) {
  checkConnection();  
  var galleryImage_cms = document.getElementById('image_cms_0');
  //galleryImage_cms.style.display = 'block';
  $("#imageblock_cms_0").removeClass("display-none");
  $("#imageblock_cms_0").addClass("display-block");
  galleryImage_cms.src = imageURI_gallery1;
}
function capturePhoto_cms_adddiv(divid){
  checkConnection();   
  var options = {
    quality: 100,
    targetWidth: 600,
    targetHeight: 600,
    destinationType: destinationType.FILE_URI,
    //saveToPhotoAlbum: true
    saveToPhotoAlbum: false,
    correctOrientation: true,
  };
  navigator.camera.getPicture(function(imageData){
    onPhotoDataSuccess_cms_adddiv(imageData,divid);
  }, onFail, options);
}
function onPhotoDataSuccess_cms_adddiv(imageURI,divid){
  checkConnection();  
  var cameraImage = document.getElementById('image_cms_'+divid);
  $("#imageblock_cms_"+divid).removeClass("display-none");
  $("#imageblock_cms_"+divid).addClass("display-block");
  cameraImage.src = imageURI;
}
function getPhoto_cms_adddiv(source,divid){
  checkConnection();  
  var options = {
    quality: 100,
    correctOrientation: 1,
    targetWidth: 600,
    targetHeight: 600,
    destinationType: destinationType.FILE_URI,
    sourceType: source
  };
  navigator.camera.getPicture(function(imageData) {
    onPhotoURISuccess_cms_adddiv(imageData,divid);
  }, onFail, options);
}
function onPhotoURISuccess_cms_adddiv(imageURI_gallery1,divid){
  checkConnection();  
  var galleryImage_cms = document.getElementById('image_cms_'+divid);
  $("#imageblock_cms_"+divid).removeClass("display-none");
  $("#imageblock_cms_"+divid).addClass("display-block");
  galleryImage_cms.src = imageURI_gallery1;
}
function onFail(message){
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
  //alert("searchByveh");
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
        if(status=='success'){
          if(veh_msg=='exist'){
            if(code_chk=='barcode_notexists'){
              //mainView.router.navigate("/veh_exists/");
              mainView.router.navigate("/veh_exists/"+veh_no+"/");
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
              mainView.router.navigate("/veh_search/"+veh_msg+"/"+status+"/"+owner_name+"/"+mobile_one+"/"+mob2+"/"+email+"/"+vehicle_type+"/null/null/null/null/"+vehicle_no+"/"+due_yr+"/"+due_mm+"/"+due_dd+"/"+perm_msg+"/");
            }
          }
          
          //alert("hello hiiiiiiiiii");
        }else if(status=='fail'){
          //console.log("fail");
          $(".vstdata").html('');
          if(veh_msg=='not_exist'){
            //mainView.router.navigate("/no_vehdata/null/"); 
            //mainView.router.navigate("/add_vst/null/"); 
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
  menuload();
  checkConnection();  
  app.panel.close();
  app.preloader.show(); 
  var veh_no = page.detail.route.params.veh_no; 
  $("#hidd_vehno").val(veh_no);
  app.preloader.hide(); 
});
$(document).on('page:init', '.page[data-name="veh_search"]', function (page) {
  menuload();
  app.panel.close();
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
  var perm_msg = page.detail.route.params.perm_msg;
  var vst_html = '';
  console.log(status+"*****"+veh_msg);
  if(status=='success'){    
    vst_html+='<div class="block-title">Name of Owner / Driver</div><div class="block"><p class="text-uppercase">'+owner_name+'</p></div><div class="block-title">Mobile No</div><div class="block"><p class="text-uppercase">'+mobile_one+'</p></div><div class="block-title">Vehicle No</div><div class="block"><p class="text-uppercase">'+vehicle_no+'</p></div><div class="block-title">Hydrotest Due Date</div><div class="block"><p class="text-uppercase">'+hydro_due_dt+'</p></div>';    
    //console.log(veh_msg);
    if(perm_msg=='allow'){
      vst_html+='<div class="text-center"><div class="text-uppercase"><h2>cng filling permission</h2></div><img src="img/right-2.png" width="150" /></div>';      
      vst_html+='<a class="button dynamic-popup" onclick="openpopup('+"'"+owner_name+"'"+','+"'"+mobile_one+"'"+','+"'"+mob2+"'"+','+"'"+email+"'"+','+"'"+vehicle_type+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+vehicle_no+"'"+','+"'"+hydro_due_dt+"'"+','+"'"+perm_msg+"'"+')" href="#">View Details</a>';
    $(".vstdata").html(vst_html);  
    }else if(perm_msg=='deny'){
      vst_html+='<div class="text-center"><div class="text-uppercase"><h2>cng filling permission</h2></div><img src="img/wrong.jpg" width="200" /></div>';      
      vst_html+='<a class="button dynamic-popup" onclick="openpopup('+"'"+owner_name+"'"+','+"'"+mobile_one+"'"+','+"'"+mob2+"'"+','+"'"+email+"'"+','+"'"+vehicle_type+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+"null"+"'"+','+"'"+vehicle_no+"'"+','+"'"+hydro_due_dt+"'"+','+"'"+perm_msg+"'"+')" href="#">View Details</a>';          
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
  app.panel.close();
  app.preloader.show();
  var session_uid = window.localStorage.getItem("session_uid");
  var sess_designation = window.localStorage.getItem("sess_designation");

  if(sess_designation=='SGL EIC'){
    $(".genrptbtn").removeClass("display-none");
    $(".genrptbtn").addClass("display-block");
/*    $(".dpr_rep_btn").removeClass("display-none");
    $(".dpr_rep_btn").addClass("display-block");*/
  }else{
    /*$(".dpr_rep_btn").removeClass("display-block");
    $(".dpr_rep_btn").addClass("display-none");*/
    $(".genrptbtn").removeClass("display-block");
    $(".genrptbtn").addClass("display-none");
    $("#dprul").removeClass("display-none");
    $("#dprul").addClass("display-block");
    $(".submitbtn").removeClass("display-none");
    $(".submitbtn").addClass("display-block");
  }
  /*var myDate=new Date();
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
  });*/

  $.ajax({
    type:'POST', 
    dataType:'json',
    url:base_url+'APP/Appcontroller/getUserStations',
    data:{'session_uid':session_uid},
    success:function(result){
      //var par_res = $.parseJSON(result);
      //var htmlres = par_res.html;
      $("#station_id").html(result.html);
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

  var split_demo_cal_dt = demo_calendar_modal_dpr.split("-");
  var splied_yr = split_demo_cal_dt[0];
  var splied_mm = split_demo_cal_dt[1];
  var splied_dd = split_demo_cal_dt[2];
  var dt_cal = splied_dd+"-"+splied_mm+"-"+splied_yr;

  if(station_id==''){
    app.dialog.alert("Select Station");
  }else if(demo_calendar_modal_dpr==''){
    app.dialog.alert("Select Date");
  }else{
    mainView.router.navigate("/dpr_sheet/"+station_id+"/"+demo_calendar_modal_dpr+"/"+st_name+"/");
    //mainView.router.navigate("/dpr_sheet/"+station_id+"/"+dt_cal+"/"+st_name+"/");
  }
  app.preloader.hide();
}
function getDprSheet(station_id,dpr_date,station_name){  //alert(dpr_date+"****");
  mainView.router.navigate("/dpr_sheet/"+station_id+"/"+dpr_date+"/"+station_name+"/");
}
$(document).on('page:init', '.page[data-name="dpr_sheetphp"]', function (page) {
  menuload();
  checkConnection();
  app.panel.close();
  var station_id = page.detail.route.params.station_id;
  var dpr_date = page.detail.route.params.demo_calendar_modal_dpr;
  var station_name = page.detail.route.params.st_name;  
  var arr_slots = ["one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty","twentyone","twentytwo","twentythree"];
  /*$.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getBlankSheet',
    dataType:'json',
    data:{'station_id':station_id},
    success:function(result){
      var dpr_sheet_comp = result.dpr_sheet_comp;
      var dpr_sheet_disp = result.dpr_sheet_disp;
      var dpr_sheet_elec = result.dpr_sheet_elec;
      $(".compdata").html(dpr_sheet_comp);
      $('.dispsec').html(dpr_sheet_disp);
      $(".elecsec").html(dpr_sheet_elec);
    }
  });*/

  for(var i=1;i<23;i++){
    console.log(".comp_th_"+i);
    $(".comp_th_"+i+" input").attr("readonly",true);
    $(".disp_th_"+i+" input").attr("readonly",true);
    $(".elec_th_"+i+" input").attr("readonly",true);
    $(".comp_th_"+i+" input").addClass("readonlytxtbox");
    $(".disp_th_"+i+" input").addClass("readonlytxtbox");
    $(".elec_th_"+i+" input").addClass("readonlytxtbox");
  }
    /*$(".comp_th_one input").attr("readonly",true);
    $(".disp_th_one input").attr("readonly",true);
    $(".elec_th_one input").attr("readonly",true);
    $(".comp_th_one input").addClass("readonlytxtbox");
    $(".disp_th_one input").addClass("readonlytxtbox");
    $(".elec_th_one input").addClass("readonlytxtbox");*/
  //alert(arr_slots.length);
  /*for(var i=0;i<arr_slots.length;i++){
    console.log(".comp_th_"+arr_slots[i]);
    $(".comp_th_"+arr_slots[i]+" input").attr("readonly",true);
    $(".disp_th_"+arr_slots[i]+" input").attr("readonly",true);
    $(".elec_th_"+arr_slots[i]+" input").attr("readonly",true);
    $(".comp_th_"+arr_slots[i]+" input").addClass("readonlytxtbox");
    $(".disp_th_"+arr_slots[i]+" input").addClass("readonlytxtbox");
    $(".elec_th_"+arr_slots[i]+" input").addClass("readonlytxtbox");
  }*/
});  
$(document).on('page:init', '.page[data-name="dpr_sheet"]', function (page) {
  menuload();
  app.panel.close();
  checkConnection();
  var station_id = page.detail.route.params.station_id;
  var dpr_date = page.detail.route.params.demo_calendar_modal_dpr;
  var station_name = page.detail.route.params.st_name;
  var sess_designation = window.localStorage.getItem("sess_designation");
  var dt = new Date();
  var current_time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
  $("#hidd_stid").val(station_id);
  $("#hidd_dprdt").val(dpr_date);
  $(".st_name").html(station_name);
  var change_dt_format = dpr_date.split("-");
  var change_dd = change_dt_format[0];
  var change_mm = change_dt_format[1];
  var change_yr = change_dt_format[2];
  var changed_dpr_dt = change_dd+"-"+change_mm+"-"+change_yr; 
  $(".dpr_dt").html(changed_dpr_dt);
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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

  // FETCH DISPENSERS (ENABLE - DISABLE) //
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getDispensors',
    data:{'station_id':station_id,'dpr_date':dpr_date},
    success:function(result){
      var parse_res = $.parseJSON(result);
      var dispanser_count = parse_res.dispanser_count;
      var fromdttm = parse_res.fromdttm;
      var sel_dpr = parse_res.sel_dpr;
      var enable_disps = parse_res.enable_disps;
      var today_dttm = parse_res.today_dttm;
      var today_enable_arr = parse_res.today_enable_arr;
      //var today_fromdttm = parse_res.today_fromdttm;
      var today_slot = parse_res.today_slot;
      var test_arr = parse_res.test_arr;
      var st_start_date = parse_res.st_start_date;
      //var st_start_time = parse_res.st_start_time-1;
      var st_start_time = parse_res.st_start_time;

      $("#hidd_dispcnt").val(dispanser_count);
      var DISP_A = parse_res.DISP_A;   // DYNAMIC //
      var DISP_B = parse_res.DISP_B;   // DYNAMIC //

      var getstart = parse_res.getstart;

      //console.log(getstart);
      //console.log("ENABLE:: "+enable_disps);
      //console.log("TODAY ENABLE:: "+today_enable_arr);      
      
      var disp_html = '';
      for(var i=1;i<=dispanser_count;i++){

        // DISPENSER A-SIDE SCRIPT //
        var dispsrno = getstart[0]['dispen'+i+'_sr_no'];
        disp_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">DISP '+i+' A <sup class="text-red fw-600 fs-12">*</sup><br/><span class="dark-blue">('+dispsrno+')</span></td>'; 
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
          if(g1 < g2){
            if(arr_ser[d_a]=="zero" || arr_ser[d_a]=="one"){
              var read_only="readonly='readonly'";
              var readonly_cls = "readonlytxtbox";
            }else{
              var read_only="";
              var readonly_cls="";
            }              
            if(sess_designation=='SGL EIC'){
              if(arr_ser[d_a]=="one"){
                var read_only="readonly='readonly'";
                var readonly_cls = "readonlytxtbox";
              }else{
                var read_only="";
                var readonly_cls="";
              }
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
         var cur_date = parse_res.cur_date;
          if(today_enable_arr!='') {
            if(typeof today_enable_arr==='string'){ 
            //alert("hello");
              if(addzero_a < today_slot){
                if(enable_disps.indexOf(i) != -1){
                  //console.log("if "+enable_disps+"---"+i);
                  disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
                }else{
                  disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
                }
              }else if(addzero_a >= today_slot){ 
                if(today_enable_arr.indexOf(i) != -1){
                  disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
                }else{
                  //console.log("else "+disable_disps+"---"+i);
                  disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
                }  
              }
            }else{ 
              //alert("hi");
              //console.log(enable_disps.length);
              //alert(dpr_date+"======="+cur_date);
              if(dpr_date==cur_date){
              //console.log("current day multiple entry");              
              var aa='';
              var enble_prev='';
              var enable_html='';
              for(var z=0;z<test_arr.length;z++){
                var dbdate=test_arr[z].date;
                var from_dt_slot=test_arr[z].from_dt_slot;
                var to_dt_slot=test_arr[z].to_dt_slot;
                var enable=test_arr[z].enable; 
                var from_datetm=test_arr[z].from_datetm;
                var to_datetm=test_arr[z].to_datetm;
                var full_fromdt=test_arr[z].full_fromdt;
                var full_todt=test_arr[z].full_todt;
                var to_dt=to_datetm.split(" ");
                var dbtodt=to_dt[0];
                var split_dtto = dbtodt.split("-");
                var toyr=split_dtto[0];
                var tomm=split_dtto[1];
                var todd=split_dtto[2];
                var final_todt = todd+"-"+tomm+"-"+toyr;
              //console.log("hi "+to_dt_slot);
              if(cur_date != dbdate){      
              //console.log("not same" +"cur_date====="+cur_date+"------dbdate "+dbdate);
                //console.log("in cond "+dbdate+"====="+to_dt_slot);
                aa=to_dt_slot; 
                enble_prev=enable;
              }       
               //0000-00-00 00:00:00
              //console.log('outside '+aa);
              if(cur_date === dbdate){ 
               //console.log("~~~~ same dates"+final_todt);
                if(final_todt=="00-00-0000"){
                  //console.log("FROM "+from_dt_slot+" TO "+to_dt_slot+" AA "+aa+" ==> "+d_a+" enable "+enable);
                   //if(from_dt_slot >= d_a || to_dt_slot > d_a){
                    if(from_dt_slot <= d_a ){
                    //console.log("***************FROM "+from_dt_slot+" TO "+to_dt_slot+" "+enable+" aa :: "+aa+ "   "+d_a);
                    if(enable.indexOf(i) != -1){
                     //console.log(d_a+"========"+i+"====enable prev"+enble_prev);
                     enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
                    }else{
                      //console.log(d_a+"*******"+i+"====  prev disabled");
                      enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
                    }
                   }
                 }
            //    console.log("FRM "+from_dt_slot +" TOO "+to_dt_slot); 
                if(from_dt_slot < d_a || to_dt_slot > d_a){
                  //console.log("main if :: FROM "+from_dt_slot+ " TO "+to_dt_slot);
                  if(aa > d_a){
                    //console.log("IF "+" FROM "+from_dt_slot+" TO "+to_dt_slot + "---  ENABLE "+enble_prev);
                    if(enble_prev.indexOf(i) != -1){
                     //console.log(d_a+"========"+i+"====enable prev"+enble_prev);
                     enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
                    }else{
                      //console.log(d_a+"*******"+i+"====  prev disabled");
                      enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
                    }                    
                  }else{
                    if(to_dt_slot >= d_a && from_dt_slot <= d_a){
                      //console.log(to_dt_slot+" >= "+d_a +" && "+from_dt_slot+" <= "+d_a + " enable "+enable);
                      //console.log("ELSE "+" FROM "+from_dt_slot+" TO "+to_dt_slot + "---  ENABLE "+enable);
                      if(enable.indexOf(i) != -1){
                      //console.log(d_a+"========"+i+"====enable "+enable);
                      enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
                      }else{
                        //console.log(d_a+"*******"+i+"==== disabled");
                        enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
                      }
                    }else{
                      //console.log(to_dt_slot+" <= "+d_a +" && "+from_dt_slot+" >= "+d_a + " enable "+enable);                     
                      if(to_dt_slot <= d_a && from_dt_slot <= d_a){
                        //console.log("ELSE ======"+d_a+" from date "+from_dt_slot +"to date "+to_dt_slot+ "enable "+enable);
                        if(enable.indexOf(i) != -1){
                        //console.log(d_a+"========"+i+"====enable "+enable);
                        enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
                        }else{
                          //console.log(d_a+"*******"+i+"==== disabled");
                          enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
                        }
                      }
                    }                    
                  }                    
                }else{
                  //console.log("ELSE "+dbdate+"==== loop tm :"+d_a+" if ======="+enable+"==== frm "+from_dt_slot+"===== to "+to_dt_slot);
                }
              }
            } // for loop ends //
          }else if(dpr_date!=cur_date){
            console.log("past day multiple entry");
            console.log(test_arr);
            var past_aa='';
            var past_enble_prev='';
            var enable_html='';
            for(var z=0;z<test_arr.length;z++){
              var past_dbdate=test_arr[z].date;
              var past_from_dt_slot=test_arr[z].from_dt_slot;
              var past_to_dt_slot=test_arr[z].to_dt_slot;
              var past_enable=test_arr[z].enable; 
              var past_from_datetm=test_arr[z].from_datetm;
              var past_to_datetm=test_arr[z].to_datetm;
              var past_full_fromdt=test_arr[z].full_fromdt;
              var past_full_todt=test_arr[z].full_todt;
              var past_to_dt=past_to_datetm.split(" ");
              var past_dbtodt=past_to_dt[0];
              var past_split_dtto = past_dbtodt.split("-");
              var past_toyr=past_split_dtto[0];
              var past_tomm=past_split_dtto[1];
              var past_todd=past_split_dtto[2];  
              var past_final_todt = past_todd+"-"+past_tomm+"-"+past_toyr;
              //console.log(past_dbdate);
              if(cur_date != past_dbdate){                 
                past_aa=past_to_dt_slot; 
                past_enble_prev=past_enable;        
                //console.log("not same" +"cur_date====="+cur_date+"------dbdate "+past_dbdate+"---- "+past_enble_prev);
              }
              if(past_from_datetm!=past_final_todt){
                if(past_from_datetm > past_final_todt){
                  //alert(past_from_datetm +" is bigger than "+past_final_todt);
                  if(past_final_todt=="00-00-0000"){
                    //console.log("IN "+past_from_dt_slot+" TO "+past_to_dt_slot+" AA "+past_aa+" ==> "+d_a+" enable "+past_enable);
                     //if(from_dt_slot >= d_a || to_dt_slot > d_a){
                    if(past_from_dt_slot <= d_a ){
                      //console.log("***************FROM "+from_dt_slot+" TO "+to_dt_slot+" "+enable+" aa :: "+aa+ "   "+d_a);
                      if(past_enable.indexOf(i) != -1){
                       enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
                      }else{
                        enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
                      }
                    }
                  }
                }
                if(dpr_date > past_from_datetm){
                  //console.log("--- FROM "+past_from_dt_slot+ " TO "+past_to_dt_slot+" enable "+past_enble_prev +" d_a "+d_a+" aa "+past_to_dt_slot);
                  if(d_a < past_to_dt_slot){
                    if(past_enble_prev.indexOf(i) != -1){
                      enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
                    }else{
                      enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
                    }
                  }
                }
                if(dpr_date < past_final_todt){
                  //console.log("*** FROM "+past_from_dt_slot+ " TO "+past_to_dt_slot+" enable "+past_enable+" d_a "+d_a+" aa "+past_to_dt_slot);
                  //if(past_from_dt_slot >= d_a && past_from_dt_slot < d_a){
                  if(past_from_dt_slot <= d_a && past_to_dt_slot <= d_a){
                    //if(d_a >= past_to_dt_slot){
                      if(past_enable.indexOf(i) != -1){
                        enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
                      }else{ 
                        enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
                      }
                    //}
                  }                  
                }
              }else {                                
                //console.log("*** FROM "+past_from_dt_slot+ " TO "+past_to_dt_slot+" enable "+past_enable+" d_a "+d_a+" aa "+past_to_dt_slot);
                if(past_to_dt_slot >= d_a && past_from_dt_slot <= d_a){
                  if(past_enable.indexOf(i) != -1){
                    enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
                    }else{ 
                      enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
                    }
                }
              }
            }
          }
            disp_html+=enable_html;
          }          
         }else{
          //alert("hi");
           if(sel_dpr > fromdttm) {
              if(enable_disps.indexOf(i) != -1){
                //console.log("if "+enable_disps+"---"+i);
                disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
              }else{
                //console.log("else "+disable_disps+"---"+i);
                disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
              }
           }
        } 
        //disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+'></td>'; 
      }
      disp_html+='</tr>';
      disp_html+='<tr><td class="text-uppercase fs-10 fw-600" style="width:55%;padding-right: 0px!important">DISP '+i+' B<sup class="text-red fw-600 fs-12">*</sup><br/><span class="dark-blue">('+dispsrno+')</span></td>';

        // DISPENSER B-SIDE SCRIPT //

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
            if(arr_ser[d_b]=="zero" || arr_ser[d_b]=="one"){
              var read_only="readonly='readonly'";
              var readonly_cls = "readonlytxtbox";
            }else{
              //alert("< else B");
              var read_only="";
              var readonly_cls="";
            }
            if(sess_designation=='SGL EIC'){
              if(arr_ser[d_b]=="one"){
                var read_only="readonly='readonly'";
                var readonly_cls = "readonlytxtbox";
              }else{
                var read_only="";
                var readonly_cls="";
              }
            }
          }else if(g1 >= g2){
            if(arr_ser[d_b]!="zero"){
              var read_only="readonly='readonly'";
              var readonly_cls = "readonlytxtbox";
            }else{
              var read_only="";
              var readonly_cls="";
            }
          }

          if(today_enable_arr!='') { 
          if(typeof today_enable_arr==='string'){          
            if(addzero_b < today_slot){
              //alert("hello");
              if(enable_disps.indexOf(i) != -1){
                //console.log("if "+enable_disps+"---"+i);
                disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+' id="DISP_'+i+'_B_'+d_b+'"></td>';
              }else{
                disp_html+='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-9 disp_th_'+arr_ser[d_b]+'">--</td>';
              }
            }else if(addzero_b >= today_slot){ 
              if(today_enable_arr.indexOf(i) != -1){
                //console.log("if "+enable_disps+"---"+i);
                //alert("hi");
                disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+' id="DISP_'+i+'_B_'+d_b+'"></td>';
              }else{
                //console.log("else "+disable_disps+"---"+i);
                disp_html+='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-9 disp_th_'+arr_ser[d_b]+'">--</td>';
              }
            } 
          }else{
            // multiple entry for current day // 
            if(dpr_date==cur_date){           
            var bb='';
            var enble_prev_b='';
            var enable_html_b='';
            for(var z=0;z<test_arr.length;z++){
              var dbdate_b=test_arr[z].date;
              var from_dt_slot_b=test_arr[z].from_dt_slot;
              var to_dt_slot_b=test_arr[z].to_dt_slot;
              var enable_b=test_arr[z].enable;
              var from_datetm_b=test_arr[z].from_datetm;
              var to_datetm_b=test_arr[z].to_datetm; 
              var to_dt_b=to_datetm_b.split(" ");
              var dbtodt_b=to_dt_b[0];
              var split_dtto_b = dbtodt_b.split("-");
              var toyr_b=split_dtto_b[0];
              var tomm_b=split_dtto_b[1];
              var todd_b=split_dtto_b[2];
              var final_todt_b = todd_b+"-"+tomm_b+"-"+toyr_b;

              if(cur_date != dbdate_b){
                bb=to_dt_slot_b;
                enble_prev_b=enable_b;
              }       
              //console.log('outside '+bb);

              if(cur_date === dbdate_b){ 
                //console.log(dbdate_b+"====="+z);
                if(final_todt_b=="00-00-0000"){
                  if(from_dt_slot_b <= d_b){
                  if(enable_b.indexOf(i) != -1){
                   enable_html_b='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+' id="DISP_'+i+'_B_'+d_b+'"></td>';
                  }else{
                    enable_html_b='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-9 disp_th_'+arr_ser[d_b]+'">--</td>';
                  }
                 }   
                }
                if(from_dt_slot_b < d_b || to_dt_slot_b > d_b){
                  if(bb > d_b){
                    //console.log("IF "+dbdate_b+"==== loop tm :"+d_a+"--frm "+from_dt_slot_b+" to "+to_dt_slot_b + "---"+enable);
                    if(enble_prev_b.indexOf(i) != -1){
                     //console.log(d_a+"========"+i+"====enable prev"+enble_prev_b);
                     enable_html_b='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+' id="DISP_'+i+'_B_'+d_b+'"></td>';
                    }else{
                      //console.log(d_a+"*******"+i+"====  prev disabled");
                      enable_html_b='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-9 disp_th_'+arr_ser[d_b]+'">--</td>';
                    }
                  }else{ 
                    if(to_dt_slot_b >= d_b && from_dt_slot_b <= d_b){
                      if(enable_b.indexOf(i) != -1){
                      //console.log(d_a+"========"+i+"====enable "+enable);
                      enable_html_b='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+' id="DISP_'+i+'_B_'+d_b+'"></td>';
                      }else{
                        //console.log(d_a+"*******"+i+"==== disabled");
                        enable_html_b='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-9 disp_th_'+arr_ser[d_b]+'">--</td>';
                      }
                      //console.log("IF-----"+d_a+" from date "+from_dt_slot_b +"to date "+to_dt_slot_b+ "enable "+enable );
                    }else{
                      //console.log("ELSE ======"+d_a+" from date "+from_dt_slot_b +"to date "+to_dt_slot_b+ "enable "+enable);
                      if(to_dt_slot_b <= d_b && from_dt_slot_b <= d_b){
                        //console.log("ELSE ======"+d_a+" from date "+from_dt_slot +"to date "+to_dt_slot+ "enable "+enable);
                        if(enable_b.indexOf(i) != -1){
                        //console.log(d_a+"========"+i+"====enable "+enable);
                        enable_html_b='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+' id="DISP_'+i+'_B_'+d_b+'"></td>';
                        }else{
                          //console.log(d_a+"*******"+i+"==== disabled");
                          enable_html_b='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-9 disp_th_'+arr_ser[d_b]+'">--</td>';
                        }
                      }
                    }        
                  }                    
                }else{
                  //console.log("ELSE "+dbdate_b+"==== loop tm :"+d_a+" if ======="+enable+"==== frm "+from_dt_slot_b+"===== to "+to_dt_slot_b);
                }
              }
            } // for loop ends //
          }else if(dpr_date!=cur_date){
            console.log("past day multiple entry");
            console.log(test_arr);
            var past_bb='';
            var past_enble_prev_b='';
            var enable_html='';
            for(var z=0;z<test_arr.length;z++){
              var past_dbdate_b=test_arr[z].date;
              var past_from_dt_slot_b=test_arr[z].from_dt_slot;
              var past_to_dt_slot_b=test_arr[z].to_dt_slot;
              var past_enable_b=test_arr[z].enable; 
              var past_from_datetm_b=test_arr[z].from_datetm;
              var past_to_datetm_b=test_arr[z].to_datetm;
              var past_full_fromdt_b=test_arr[z].full_fromdt;
              var past_full_todt_b=test_arr[z].full_todt;
              var past_to_dt_b=past_to_datetm_b.split(" ");
              var past_dbtodt_b=past_to_dt_b[0];
              var past_split_dtto_b = past_dbtodt_b.split("-");
              var past_toyr_b=past_split_dtto_b[0];
              var past_tomm_b=past_split_dtto_b[1];
              var past_todd_b=past_split_dtto_b[2];  
              var past_final_todt_b = past_todd_b+"-"+past_tomm_b+"-"+past_toyr_b;
              //console.log(past_dbdate_b);
              if(cur_date != past_dbdate_b){                 
                past_bb=past_to_dt_slot_b; 
                past_enble_prev_b=past_enable_b;        
                //console.log("not same" +"cur_date====="+cur_date+"------dbdate "+past_dbdate_b+"---- "+past_enble_prev_b);
              }
              if(past_from_datetm_b!=past_final_todt_b){
                if(past_from_datetm_b > past_final_todt_b){
                  //alert(past_from_datetm_b +" is bigger than "+past_final_todt_b);
                  if(past_final_todt_b=="00-00-0000"){
                    //console.log("IN "+past_from_dt_slot_b+" TO "+past_to_dt_slot_b+" AA "+past_bb+" ==> "+d_b+" enable "+past_enable_b);
                     //if(from_dt_slot >= d_b || to_dt_slot > d_b){
                    if(past_from_dt_slot_b <= d_b ){
                      //console.log("***************FROM "+from_dt_slot+" TO "+to_dt_slot+" "+enable+" aa :: "+aa+ "   "+d_b);
                      if(past_enable_b.indexOf(i) != -1){
                       enable_html_b='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+' id="DISP_'+i+'_B_'+d_b+'"></td>';
                      }else{
                        enable_html_b='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-9 disp_th_'+arr_ser[d_b]+'">--</td>';
                      }
                    }
                  }
                }                
                if(dpr_date > past_from_datetm_b){
                  //console.log("--- FROM "+past_from_dt_slot_b+ " TO "+past_to_dt_slot_b+" enable "+past_enble_prev_b +" d_b "+d_b+" aa "+past_to_dt_slot_b);
                  if(d_b < past_to_dt_slot_b){
                    if(past_enble_prev_b.indexOf(i) != -1){
                      enable_html_b='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+' id="DISP_'+i+'_B_'+d_b+'"></td>';
                    }else{
                      enable_html_b='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-9 disp_th_'+arr_ser[d_b]+'">--</td>';
                    }
                  }
                }
                if(dpr_date < past_final_todt_b){
                  //console.log("*** FROM "+past_from_dt_slot_b+ " TO "+past_to_dt_slot_b+" enable "+past_enable_b+" d_b "+d_b+" aa "+past_to_dt_slot_b);
                  //if(past_from_dt_slot_b >= d_b && past_from_dt_slot_b < d_b){
                  if(past_from_dt_slot_b <= d_b && past_to_dt_slot_b <= d_b){
                    //if(d_b >= past_to_dt_slot_b){
                      if(past_enable_b.indexOf(i) != -1){
                        enable_html_b='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+' id="DISP_'+i+'_B_'+d_b+'"></td>';
                      }else{ 
                        enable_html_b='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-9 disp_th_'+arr_ser[d_b]+'">--</td>';
                      }
                    //}
                  }                  
                }
              }else {                    
                //console.log("*** FROM "+past_from_dt_slot_b+ " TO "+past_to_dt_slot_b+" enable "+past_enable_b+" d_b "+d_b+" aa "+past_to_dt_slot_b);
                if(past_to_dt_slot_b >= d_b && past_from_dt_slot_b <= d_b){
                  if(past_enable_b.indexOf(i) != -1){
                    enable_html_b='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+' id="DISP_'+i+'_B_'+d_b+'"></td>';
                    }else{ 
                      enable_html_b='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-9 disp_th_'+arr_ser[d_b]+'">--</td>';
                    }
                }
              }
            }
          }
          
      //    disp_html+=enable_html_b;
          }          
        }else{
          if(sel_dpr > fromdttm) {
            if(enable_disps.indexOf(i) != -1){
                //console.log("if "+enable_disps+"---"+i);
                disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+' id="DISP_'+i+'_B_'+d_b+'"></td>';
              }else{
                //console.log("else "+disable_disps+"---"+i);
                disp_html+='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-9 disp_th_'+arr_ser[d_b]+'">--</td>';
              }
           }
        }
        disp_html+=enable_html_b;    
        /*if(st_start_date == dpr_date){
          for(var col=0;col<st_start_time;col++){
            $(".disp_th_"+col).html("---");
            $(".disp_th_"+col).removeClass("pl-0");
            $(".disp_th_"+col).addClass("text-center pl-9");
          }
        }*/
        //disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+'></td>';
        }        
        disp_html+='</tr>';
      } // for loop ends //
      $(".disp_data").html(disp_html);

      if(st_start_date==dpr_date){ 
        if(st_start_time=="00"){
          st_start_time=0;
        }else{
          st_start_time=st_start_time;
        }
        //console.log(DISP_A);
        //alert("st_start_time "+st_start_time);  
        for(var disp_aa=0;disp_aa<dispanser_count;disp_aa++){
              for(var l_a=st_start_time;l_a<=23;l_a++){    
                //console.log(".disp_"+(disp_aa+1)+"_a_"+l_a);
                var txtbox_id = $(".disp_"+(disp_aa+1)+"_a_"+l_a).attr('id');
                //console.log("txtbox_id "+txtbox_id);
                if(txtbox_id!=undefined){
                  var split_txt = txtbox_id.split("_");
                  var dispno = split_txt[1];
                  var disptm = split_txt[3];
                    var disp_a_val = DISP_A[l_a][0].slot_param_val;
                    var time_slot_a = DISP_A[l_a][0].time_slot; 
                    var param = DISP_A[l_a][0].dpr_params;
                    //console.log(param+" "+time_slot_a+" "+disp_a_val);
                    var split_tm = time_slot_a.split(":");
                    var splited_tm = split_tm[0];
                    var timeslot = splited_tm.replace(/^0+/, "");
                    if(time_slot_a=="00:00"){
                      timeslot=0;
                    }else{ 
                      timeslot=timeslot;
                    }
                    if(timeslot==disptm){
                      console.log(disp_a_val);
                      //console.log(txtbox_id+" "+time_slot_a+" ("+'.disp'+(disp_aa+1)+'_a_'+timeslot+").val="+disp_a_val);
                      $(".disp_"+(disp_aa+1)+"_a_"+timeslot).val(disp_a_val);
                    }
                  }
              }
            }
            
            for(var disp_bb=0;disp_bb<dispanser_count;disp_bb++){
              for(var l_b=st_start_time;l_b<=23;l_b++){ 
                //console.log(".disp_"+(disp_bb+1)+"_b_"+l_b);
                var txtbox_id_b = $(".disp_"+(disp_bb+1)+"_b_"+l_b).attr('id');
                //console.log("txtbox_id_b "+txtbox_id_b);
                if(txtbox_id_b!=undefined){
                  var split_txt_b = txtbox_id_b.split("_");
                  var dispno = split_txt_b[1];
                  var disptm_b = split_txt_b[3];
                    var disp_b_val = DISP_B[l_b][0].slot_param_val;
                    var time_slot_b = DISP_B[l_b][0].time_slot; 
                    var param = DISP_B[l_b][0].dpr_params;
                    //console.log(param+" "+time_slot_b+" "+disp_b_val);
                    var split_tm_b = time_slot_b.split(":");
                    var splited_tm_b = split_tm_b[0];
                    var timeslot_b = splited_tm_b.replace(/^0+/, "");
                    if(time_slot_b=="00:00"){
                      timeslot_b=0;
                    }else{
                      timeslot_b=timeslot_b;
                    }
                    if(timeslot_b==disptm_b){
                      console.log(disp_b_val);
                      //console.log(txtbox_id+" "+time_slot_b+" ("+'.disp'+(disp_bb+1)+'_a_'+timeslot_b+").val="+disp_b_val);
                      $(".disp_"+(disp_bb+1)+"_b_"+timeslot_b).val(disp_b_val);
                    }
                  }
              }
          }
        }else{
          for(var disp_aa=0;disp_aa<DISP_A.length;disp_aa++){
            var cnt_d = DISP_A[disp_aa].length;
            //alert(cnt_d);
            for(var l_a=0;l_a<=23;l_a++){
              var txtbox_id = $(".disp_"+(disp_aa+1)+"_a_"+l_a).attr('id');
              if(txtbox_id!=undefined){
                //alert(txtbox_id);
                var split_txt = txtbox_id.split("_");
                var dispno = split_txt[1];
                var disptm = split_txt[3]; 
                for(var d_aa=0;d_aa<cnt_d;d_aa++){ 
                  var disp_a_val = DISP_A[disp_aa][d_aa].slot_param_val;
                  var time_slot_a = DISP_A[disp_aa][d_aa].time_slot; 
                  var param = DISP_A[disp_aa][d_aa].dpr_params;
                  //console.log(param+" "+time_slot_a+" "+disp_a_val+" === "+d_aa);
                  var split_tm = time_slot_a.split(":");
                  var splited_tm = split_tm[0];
                  var timeslot = splited_tm.replace(/^0+/, "");
                  if(time_slot_a=="00:00"){
                    timeslot=0;
                  }else{
                    timeslot=timeslot;
                  }                
                  if(timeslot==disptm){
                    console.log("DISP A"+disp_a_val);
                    //console.log(disptm+" "+timeslot);
                    //console.log(txtbox_id+" "+time_slot_a+" ("+'.disp'+(disp_aa+1)+'_a_'+timeslot+").val="+disp_a_val);
                    $(".disp_"+(disp_aa+1)+"_a_"+timeslot).val(disp_a_val);
                  }
                }
              }

            }
            //console.log("----------------------------------");
          } 

          for(var disp_bb=0;disp_bb<DISP_B.length;disp_bb++){
            var cnt_d = DISP_B[disp_bb].length;
            for(var l_b=0;l_b<=23;l_b++){
              var txtbox_id_b = $(".disp_"+(disp_bb+1)+"_b_"+l_b).attr('id');
              if(txtbox_id_b!=undefined){
                //alert(txtbox_id_b);
                var split_txt_b = txtbox_id_b.split("_");
                var dispno = split_txt_b[1];
                var disptm_b = split_txt_b[3]; 
                for(var d_bb=0;d_bb<cnt_d;d_bb++){ 
                  var disp_b_val = DISP_B[disp_bb][d_bb].slot_param_val;
                  var time_slot_b = DISP_B[disp_bb][d_bb].time_slot; 
                  var param = DISP_B[disp_bb][d_bb].dpr_params;
                  //console.log(param+" "+time_slot_b+" "+disp_b_val+" === "+d_bb);
                  var split_tm_b = time_slot_b.split(":");
                  var splited_tm_b = split_tm_b[0];
                  var timeslot_b = splited_tm_b.replace(/^0+/, "");
                  if(time_slot_b=="00:00"){
                    timeslot_b=0;
                  }else{
                    timeslot_b=timeslot_b;
                  }                
                  if(timeslot_b==disptm_b){
                    console.log("DISP B"+disp_b_val);
                    //console.log(disptm_b+" "+timeslot_b);
                    //console.log(txtbox_id_b+" "+time_slot_b+" ("+'.disp'+(disp_bb+1)+'_b_'+timeslot_b+").val="+disp_b_val);
                    $(".disp_"+(disp_bb+1)+"_b_"+timeslot_b).val(disp_b_val);
                  }
                }
              }

            }
            //console.log("----------------------------------");
          }
        }


      if(st_start_date == dpr_date){        
        for(var col=0;col<st_start_time;col++){          
          $(".disp_th_"+col).html("---");
          $(".disp_th_"+col).removeClass("pl-0");
          $(".disp_th_"+col).addClass("text-center pl-9");
        }
      }
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
  /*$.ajax({
    type:'POST',  
    dataType:'json',
    url:base_url+'APP/Appcontroller/getStationStart',
    data:{'station_id':station_id},
    success:function(data_res){
      var st_start_date = data_res.st_start_date;
      //var st_start_time = data_res.st_start_time-1; // old //
      var st_start_time = data_res.st_start_time;
      //alert(st_start_time);
      if(st_start_date == dpr_date){
        for(var col=0;col<st_start_time;col++){
          $(".comp_th_"+col).html("---");
          $(".comp_th_"+col).removeClass("pl-0");
          $(".comp_th_"+col).addClass("text-center pl-9");

          $(".disp_th_"+col).html("---");
          $(".disp_th_"+col).removeClass("pl-0");
          $(".disp_th_"+col).addClass("text-center pl-9");

          $(".elec_th_"+col).html("---");
          $(".elec_th_"+col).removeClass("pl-0");
          $(".elec_th_"+col).addClass("text-center pl-9");
        }
      }
      //$("#sheet_data").html(result);
    }    
  });*/
  app.preloader.show();
  $.ajax({
    type:'POST', 
    //dataType:'json',
    url:base_url+'APP/Appcontroller/getDPRsheetvalues',
    data:{'station_id':station_id,'dpr_date':dpr_date},
    success:function(result){
      //console.log(result+"***");
      //$("#sheet_data").html(result);
      if(result!=''){
        var prsejson = $.parseJSON(result);
        var no_data = prsejson.no_data;
        var st_start_date = prsejson.st_start_date;
        var st_start_time = prsejson.st_start_time;
        var start_dt = prsejson.start_dt;
        var st_strt_tm = prsejson.st_strt_tm;
        var dispanser_count = prsejson.dispanser_count; 

        if(no_data=="no_data"){
          app.preloader.hide();
          return false;
        }
        //console.log("--------".prsejson);
        var COMP_SUCTION = prsejson.COMP_SUCTION;
        var COMP_DISCHARGE = prsejson.COMP_DISCHARGE;
        var LCV_1_MFM = prsejson.LCV_1_MFM;
        var LCV_2_MFM = prsejson.LCV_2_MFM;
        var LCV_3_MFM = prsejson.LCV_3_MFM;
        var LCV_4_MFM = prsejson.LCV_4_MFM;
        //var LCV_5_MFM = prsejson.LCV_5_MFM;
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
       // alert("ajax");
        
        if(start_dt==dpr_date){ 

          for(var cs=0;cs<COMP_SUCTION.length;cs++){
            if(COMP_SUCTION[cs]!=''){ 
              var cs_slot_param_val = COMP_SUCTION[cs][0].slot_param_val;
              console.log(cs_slot_param_val);
              $(".comp_suc_"+cs).val(cs_slot_param_val);
            }            
          }
          for(var cd=0;cd<COMP_DISCHARGE.length;cd++){
            if(COMP_DISCHARGE[cd]!=''){
              var cd_slot_param_val = COMP_DISCHARGE[cd][0].slot_param_val;
              console.log(cd_slot_param_val);
              $(".comp_dis_"+cd).val(cd_slot_param_val);
            }            
          }
          for(var lcv1=0;lcv1<LCV_1_MFM.length;lcv1++){
            if(LCV_1_MFM[lcv1]!=''){
              var lcv1_mfm = LCV_1_MFM[lcv1][0].slot_param_val;
              console.log(lcv1_mfm);
              $(".lcv1_mfm_"+lcv1).val(lcv1_mfm);
            }
          }
          for(var lcv2=0;lcv2<LCV_2_MFM.length;lcv2++){
            if(LCV_2_MFM[lcv2]!=''){
              var lcv2_mfm = LCV_2_MFM[lcv2][0].slot_param_val;
              console.log(lcv2_mfm);
              $(".lcv2_mfm_"+lcv2).val(lcv2_mfm);
            }
          }
          for(var lcv3=0;lcv3<LCV_3_MFM.length;lcv3++){
            if(LCV_3_MFM[lcv3]!=''){
              var lcv3_mfm = LCV_3_MFM[lcv3][0].slot_param_val;
              console.log(lcv3_mfm);
              $(".lcv3_mfm_"+lcv3).val(lcv3_mfm);
            }
          }
          for(var lcv4=0;lcv4<LCV_4_MFM.length;lcv4++){
            if(LCV_4_MFM[lcv4]!=''){
              var lcv4_mfm = LCV_4_MFM[lcv4][0].slot_param_val;
              console.log(lcv4_mfm);
              $(".lcv4_mfm_"+lcv4).val(lcv4_mfm);
            }
          }
          for(var chc=0;chc<COMP_HMR_COUNTER.length;chc++){
            if(COMP_HMR_COUNTER[chc]!=''){
              var chc_val = COMP_HMR_COUNTER[chc][0].slot_param_val;
              console.log(chc_val);
              $(".comp_hmr_cnt_"+chc).val(chc_val);
            }
          }
          for(var cem=0;cem<COMP_ENR_METER.length;cem++){
            if(COMP_ENR_METER[cem]!=''){
              var cem_val = COMP_ENR_METER[cem][0].slot_param_val;
              console.log(cem_val);
              $(".comp_energy_met_"+cem).val(cem_val);
            }
          }
          for(var isp=0;isp<I_stg_prs.length;isp++){
            if(I_stg_prs[isp]!=''){
              var isp_val = I_stg_prs[isp][0].slot_param_val;
              console.log(isp_val);
              $(".I_stg_prs_"+isp).val(isp_val);
            }
          }
          for(var iisp=0;iisp<II_stg_prs.length;iisp++){
            if(II_stg_prs[iisp]!=''){
              var iisp_val = II_stg_prs[iisp][0].slot_param_val;
              console.log(iisp_val);
              $(".II_stg_prs_"+iisp).val(iisp_val);
            }
          }
          for(var iiips=0;iiips<III_stg_prs.length;iiips++){
            if(III_stg_prs[iiips]!=''){
              var iiips_val = III_stg_prs[iiips][0].slot_param_val;
              console.log(iiips_val);
              $(".III_stg_prs_"+iiips).val(iiips_val);
            }
          }
          for(var ist=0;ist<I_stg_TEMP.length;ist++){
            if(I_stg_TEMP[ist]!=''){
              var ist_val = I_stg_TEMP[ist][0].slot_param_val;
              console.log(ist_val);
              $(".I_stg_temp_"+ist).val(ist_val);
            }
          }
          for(var iist=0;iist<II_stg_TEMP.length;iist++){
            if(II_stg_TEMP[iist]!=''){
              var iist_val = II_stg_TEMP[iist][0].slot_param_val;
              console.log(iist_val);
              $(".II_stg_temp_"+iist).val(iist_val);
            }
          }
          for(var iiist=0;iiist<III_stg_TEMP.length;iiist++){
            if(III_stg_TEMP[iiist]!=''){
              var iiist_val = III_stg_TEMP[iiist][0].slot_param_val;
              console.log(iiist_val);
              $(".III_stg_temp_"+iiist).val(iiist_val);
            }
          }
          for(var lpo=0;lpo<LP_OIL.length;lpo++){
            if(LP_OIL[lpo]!=''){
              var lpo_val = LP_OIL[lpo][0].slot_param_val;
              console.log(lpo_val);
              $(".lp_oil_"+lpo).val(lpo_val);
            }
          }
          for(var hpo=0;hpo<HP_OIL.length;hpo++){
            if(HP_OIL[hpo]!=''){
              var hpo_val = HP_OIL[hpo][0].slot_param_val;
              console.log(hpo_val);
              $(".hp_oil_"+hpo).val(hpo_val);
            }
          }
          for(var lbp=0;lbp<LOW_BANK_PRS.length;lbp++){
            if(LOW_BANK_PRS[lbp]!=''){
              var lbp_val = LOW_BANK_PRS[lbp][0].slot_param_val;
              console.log(lbp_val);
              $(".low_bank_prs_"+lbp).val(lbp_val);
            }
          }
          for(var mbp=0;mbp<MED_BANK_PRS.length;mbp++){
            if(MED_BANK_PRS[mbp]!=''){
              var mbp_val = MED_BANK_PRS[mbp][0].slot_param_val;
              console.log(mbp_val);
              $(".med_bank_prs_"+mbp).val(mbp_val);
            }
          }
          for(var hbp=0;hbp<HIGH_BANK_PRS.length;hbp++){
            if(HIGH_BANK_PRS[hbp]!=''){
              var hbp_val = HIGH_BANK_PRS[hbp][0].slot_param_val;
              console.log(hbp_val);
              $(".high_bank_prs_"+hbp).val(hbp_val);
            }
          }
          for(var wl=0;wl<WATER_LVL.length;wl++){
            if(WATER_LVL[wl]!=''){
              var wl_val = WATER_LVL[wl][0].slot_param_val;
              console.log(wl_val);
              $(".water_lvl_"+wl).val(wl_val);
            }
          }
          for(var ol=0;ol<OIL_LVL.length;ol++){
            if(OIL_LVL[ol]!=''){
              var ol_val = OIL_LVL[ol][0].slot_param_val;
              console.log(ol_val);
              $(".oil_lvl_"+ol).val(ol_val);
            }
          }
          for(var nocs=0;nocs<NO_OF_COMP_STARTS.length;nocs++){
            if(NO_OF_COMP_STARTS[nocs]!=''){
              var nocs_val = NO_OF_COMP_STARTS[nocs][0].slot_param_val;
              console.log(nocs_val);
              $(".comp_starts_"+nocs).val(nocs_val);
            }
          }
          for(var sucp=0;sucp<SUC_PRS.length;sucp++){
            if(SUC_PRS[sucp]!=''){
              var sucp_val = SUC_PRS[sucp][0].slot_param_val;
              console.log(sucp_val);
              $(".suc_prs_"+sucp).val(sucp_val);
            }
          }
                    

          /*for(var disp_aa=0;disp_aa<dispanser_count;disp_aa++){
            for(var l_a=st_strt_tm;l_a<=23;l_a++){ 
              //console.log(".disp_"+(disp_aa+1)+"_a_"+l_a);
              var txtbox_id = $(".disp_"+(disp_aa+1)+"_a_"+l_a).attr('id');
              //console.log("txtbox_id "+txtbox_id);
              if(txtbox_id!=undefined){
                var split_txt = txtbox_id.split("_");
                var dispno = split_txt[1];
                var disptm = split_txt[3];
                  var disp_a_val = DISP_A[l_a][0].slot_param_val;
                  var time_slot_a = DISP_A[l_a][0].time_slot; 
                  var param = DISP_A[l_a][0].dpr_params;
                  //console.log(param+" "+time_slot_a+" "+disp_a_val);
                  var split_tm = time_slot_a.split(":");
                  var splited_tm = split_tm[0];
                  var timeslot = splited_tm.replace(/^0+/, "");
                  if(time_slot_a=="00:00"){
                    timeslot=0;
                  }else{ 
                    timeslot=timeslot;
                  }
                  if(timeslot==disptm){
                    console.log(disp_a_val);
                    //console.log(txtbox_id+" "+time_slot_a+" ("+'.disp'+(disp_aa+1)+'_a_'+timeslot+").val="+disp_a_val);
                    $(".disp_"+(disp_aa+1)+"_a_"+timeslot).val(disp_a_val);
                  }
                }
            }
          }
          
          for(var disp_bb=0;disp_bb<dispanser_count;disp_bb++){
            for(var l_b=st_strt_tm;l_b<=23;l_b++){ 
              //console.log(".disp_"+(disp_bb+1)+"_b_"+l_b);
              var txtbox_id_b = $(".disp_"+(disp_bb+1)+"_b_"+l_b).attr('id');
              //console.log("txtbox_id_b "+txtbox_id_b);
              if(txtbox_id_b!=undefined){
                var split_txt_b = txtbox_id_b.split("_");
                var dispno = split_txt_b[1];
                var disptm_b = split_txt_b[3];
                  var disp_b_val = DISP_B[l_b][0].slot_param_val;
                  var time_slot_b = DISP_B[l_b][0].time_slot; 
                  var param = DISP_B[l_b][0].dpr_params;
                  //console.log(param+" "+time_slot_b+" "+disp_b_val);
                  var split_tm_b = time_slot_b.split(":");
                  var splited_tm_b = split_tm_b[0];
                  var timeslot_b = splited_tm_b.replace(/^0+/, "");
                  if(time_slot_b=="00:00"){
                    timeslot_b=0;
                  }else{
                    timeslot_b=timeslot_b;
                  }
                  if(timeslot_b==disptm_b){
                    console.log(disp_b_val);
                    //console.log(txtbox_id+" "+time_slot_b+" ("+'.disp'+(disp_bb+1)+'_a_'+timeslot_b+").val="+disp_b_val);
                    $(".disp_"+(disp_bb+1)+"_b_"+timeslot_b).val(disp_b_val);
                  }
                }
            }
          }*/
           

          for(var gmk=0;gmk<GEB_MET_KWH.length;gmk++){
            if(GEB_MET_KWH[gmk]!=''){
              var gmk_slot_param_val = GEB_MET_KWH[gmk][0].slot_param_val;
              console.log(gmk_slot_param_val);
              $(".GEB_energy_mtr_KWH_"+gmk).val(gmk_slot_param_val);
            }
          }
          for(var gmkv=0;gmkv<GEB_MET_KVAH.length;gmkv++){
            if(GEB_MET_KVAH[gmkv]!=''){
              var gmk_kvah_slot_param_val = GEB_MET_KVAH[gmkv][0].slot_param_val;
              console.log(gmk_kvah_slot_param_val);
              $(".GEB_energy_met_KVAH_"+gmkv).val(gmk_kvah_slot_param_val);
            }
          }
          for(var gmkrh=0;gmkrh<GEB_MET_KVRH.length;gmkrh++){
            if(GEB_MET_KVRH[gmkrh]!=''){
              var gmkrh_slot_param_val = GEB_MET_KVRH[gmkrh][0].slot_param_val;
              console.log(gmkrh_slot_param_val);
              $(".GEB_energy_met_KVRH_"+gmkrh).val(gmkrh_slot_param_val);
            }
          }
          for(var dro=0;dro<DELAR_RO.length;dro++){
            if(DELAR_RO[dro]!=''){
              var dro_slot_param_val = DELAR_RO[dro][0].slot_param_val;
              console.log(dro_slot_param_val);
              $(".delar_ro_"+dro).val(dro_slot_param_val);
            }
          }
          for(var vltg=0;vltg<VLTG.length;vltg++){
            if(VLTG[vltg]!=''){
              var vltg_slot_param_val = VLTG[vltg][0].slot_param_val;
              console.log(vltg_slot_param_val);
              $(".voltage_"+vltg).val(vltg_slot_param_val);
            }
          }
          for(var amp=0;amp<AMP.length;amp++){
            if(AMP[amp]!=''){
              var amp_slot_param_val = AMP[amp][0].slot_param_val;
              console.log(amp_slot_param_val);
              $(".amp_"+amp).val(amp_slot_param_val);
            }
          }
          for(var pf=0;pf<PF.length;pf++){
            if(PF[pf]!=''){
              var pf_slot_param_val = PF[pf][0].slot_param_val;
              console.log(pf_slot_param_val);
              $(".pf_"+pf).val(pf_slot_param_val);
            }
          }

          if(start_dt == dpr_date){
          for(var col=0;col<st_start_time;col++){
            $(".comp_th_"+col).html("---");
            $(".comp_th_"+col).removeClass("pl-0");
            $(".comp_th_"+col).addClass("text-center pl-9");

            $(".disp_th_"+col).html("---");
            $(".disp_th_"+col).removeClass("pl-0");
            $(".disp_th_"+col).addClass("text-center pl-9");

            $(".elec_th_"+col).html("---");
            $(".elec_th_"+col).removeClass("pl-0");
            $(".elec_th_"+col).addClass("text-center pl-9");
          }
        } 

        }else{   // station start date is not = dpr_date DPR data display //      
          //console.log(COMP_SUCTION);
          // ---------------------------- COMPRESSOR ---------------------------- //
          for(var cs=0;cs<COMP_SUCTION.length;cs++){
            var cs_slot_param_val = COMP_SUCTION[cs].slot_param_val;
            //alert(cs_slot_param_val+"*****");
            console.log(cs_slot_param_val);
            $(".comp_suc_"+cs).val(cs_slot_param_val);
          }
          for(var cd=0;cd<COMP_DISCHARGE.length;cd++){
            var cd_slot_param_val = COMP_DISCHARGE[cd].slot_param_val;
            console.log(cd_slot_param_val);
            $(".comp_dis_"+cd).val(cd_slot_param_val);
          }
          /*for(var lcvmfm=0;lcvmfm<LCV_MFM.length;lcvmfm++){
            var cnt_lcv = LCV_MFM[lcvmfm].length;
            for(var lc=0;lc<cnt_lcv;lc++){            
              var lcv_val = LCV_MFM[lcvmfm][lc].slot_param_val; 
              $(".lcv"+(lcvmfm+1)+"_mfm_"+lc).val(lcv_val);
            }
          } // DYNAMIC //*/
          for(var lcv1=0;lcv1<LCV_1_MFM.length;lcv1++){
            var lcv1_mfm = LCV_1_MFM[lcv1].slot_param_val;
            console.log(lcv1_mfm);
            $(".lcv1_mfm_"+lcv1).val(lcv1_mfm);
          }
          for(var lcv2=0;lcv2<LCV_2_MFM.length;lcv2++){
            var lcv2_mfm = LCV_2_MFM[lcv2].slot_param_val;
            console.log(lcv2_mfm);
            $(".lcv2_mfm_"+lcv2).val(lcv2_mfm);
          }
          for(var lcv3=0;lcv3<LCV_3_MFM.length;lcv3++){
            var lcv3_mfm = LCV_3_MFM[lcv3].slot_param_val;
            console.log(lcv3_mfm);
            $(".lcv3_mfm_"+lcv3).val(lcv3_mfm);
          }
          for(var lcv4=0;lcv4<LCV_4_MFM.length;lcv4++){
            var lcv4_mfm = LCV_4_MFM[lcv4].slot_param_val;
            console.log(lcv4_mfm);
            $(".lcv4_mfm_"+lcv4).val(lcv4_mfm);
          }
          /*for(var lcv5=0;lcv5<LCV_5_MFM.length;lcv5++){
            var lcv5_mfm = LCV_5_MFM[lcv5].slot_param_val;
            $(".lcv5_mfm_"+lcv5).val(lcv5_mfm);
          } // STATIC // */
          for(var chc=0;chc<COMP_HMR_COUNTER.length;chc++){
            var chc_val = COMP_HMR_COUNTER[chc].slot_param_val;
            console.log(chc_val);
            $(".comp_hmr_cnt_"+chc).val(chc_val);
          }
          for(var cem=0;cem<COMP_ENR_METER.length;cem++){
            var cem_val = COMP_ENR_METER[cem].slot_param_val;
            console.log(cem_val);
            $(".comp_energy_met_"+cem).val(cem_val);
          }
          for(var isp=0;isp<I_stg_prs.length;isp++){
            var isp_val = I_stg_prs[isp].slot_param_val;
            //console.log(isp_val);
            $(".I_stg_prs_"+isp).val(isp_val);
          }
          for(var iisp=0;iisp<II_stg_prs.length;iisp++){
            var iisp_val = II_stg_prs[iisp].slot_param_val;
            console.log(iisp_val);
            $(".II_stg_prs_"+iisp).val(iisp_val);
          }
          for(var iiips=0;iiips<III_stg_prs.length;iiips++){
            var iiips_val = III_stg_prs[iiips].slot_param_val;
            console.log(iiips_val);
            $(".III_stg_prs_"+iiips).val(iiips_val);
          }
          for(var ist=0;ist<I_stg_TEMP.length;ist++){
            var ist_val = I_stg_TEMP[ist].slot_param_val;
            console.log(ist_val);
            $(".I_stg_temp_"+ist).val(ist_val);
          }
          for(var iist=0;iist<II_stg_TEMP.length;iist++){
            var iist_val = II_stg_TEMP[iist].slot_param_val;
            console.log(iist_val);
            $(".II_stg_temp_"+iist).val(iist_val);
          }
          for(var iiist=0;iiist<III_stg_TEMP.length;iiist++){
            var iiist_val = III_stg_TEMP[iiist].slot_param_val;
            console.log(iiist_val);
            $(".III_stg_temp_"+iiist).val(iiist_val);
          }
          for(var lpo=0;lpo<LP_OIL.length;lpo++){
            var lpo_val = LP_OIL[lpo].slot_param_val;
            console.log(lpo_val);
            $(".lp_oil_"+lpo).val(lpo_val);
          }
          for(var hpo=0;hpo<HP_OIL.length;hpo++){
            var hpo_val = HP_OIL[hpo].slot_param_val;
            console.log(hpo_val);
            $(".hp_oil_"+hpo).val(hpo_val);
          }
          for(var lbp=0;lbp<LOW_BANK_PRS.length;lbp++){
            var lbp_val = LOW_BANK_PRS[lbp].slot_param_val;
            console.log(lbp_val);
            $(".low_bank_prs_"+lbp).val(lbp_val);
          }
          for(var mbp=0;mbp<MED_BANK_PRS.length;mbp++){
            var mbp_val = MED_BANK_PRS[mbp].slot_param_val;
            console.log(mbp_val);
            $(".med_bank_prs_"+mbp).val(mbp_val);
          }
          for(var hbp=0;hbp<HIGH_BANK_PRS.length;hbp++){
            var hbp_val = HIGH_BANK_PRS[hbp].slot_param_val;
            console.log(hbp_val);
            $(".high_bank_prs_"+hbp).val(hbp_val);
          }
          for(var wl=0;wl<WATER_LVL.length;wl++){
            var wl_val = WATER_LVL[wl].slot_param_val;
            console.log(wl_val);
            $(".water_lvl_"+wl).val(wl_val);
          }
          for(var ol=0;ol<OIL_LVL.length;ol++){
            var ol_val = OIL_LVL[ol].slot_param_val;
            console.log(ol_val);
            $(".oil_lvl_"+ol).val(ol_val);
          }
          for(var nocs=0;nocs<NO_OF_COMP_STARTS.length;nocs++){
            var nocs_val = NO_OF_COMP_STARTS[nocs].slot_param_val;
            console.log(nocs_val);
            $(".comp_starts_"+nocs).val(nocs_val);
          }
          for(var sucp=0;sucp<SUC_PRS.length;sucp++){
            var sucp_val = SUC_PRS[sucp].slot_param_val;
           console.log(sucp_val);
            $(".suc_prs_"+sucp).val(sucp_val);
          }

          // ----------------------------- DISPENSER --------------------------------//
          
            /*for(var disp_aa=0;disp_aa<DISP_A.length;disp_aa++){
              for(var dloop_a=0;dloop_a<23;dloop_a++){
              if(dloop_a <= 9){
                var addzero_disp="0"+dloop_a;
              }else{
                var addzero_disp=dloop_a;
              }
              //console.log(disp_aa);
              var cnt_d = DISP_A[disp_aa].length;
              for(var d_aa=0;d_aa<cnt_d;d_aa++){
                var disp_a_val = DISP_A[disp_aa][d_aa].slot_param_val;
                var slot=DISP_A[disp_aa][d_aa].time_slot;
                var split_slot=slot.split(":");
                console.log(split_slot[0]+"=="+addzero_disp);
                if(split_slot[0]==addzero_disp){
                  $(".disp_"+(disp_aa+1)+"_a_"+d_aa).val(disp_a_val);
                }
              }
            }
          }*/ 
          //console.log(DISP_A);
          /*for(var disp_aa=0;disp_aa<DISP_A.length;disp_aa++){
            var cnt_d = DISP_A[disp_aa].length;
            //alert(cnt_d);
            for(var l_a=0;l_a<=23;l_a++){
              var txtbox_id = $(".disp_"+(disp_aa+1)+"_a_"+l_a).attr('id');
              if(txtbox_id!=undefined){
                //alert(txtbox_id);
                var split_txt = txtbox_id.split("_");
                var dispno = split_txt[1];
                var disptm = split_txt[3]; 
                for(var d_aa=0;d_aa<cnt_d;d_aa++){ 
                  var disp_a_val = DISP_A[disp_aa][d_aa].slot_param_val;
                  var time_slot_a = DISP_A[disp_aa][d_aa].time_slot; 
                  var param = DISP_A[disp_aa][d_aa].dpr_params;
                  //console.log(param+" "+time_slot_a+" "+disp_a_val+" === "+d_aa);
                  var split_tm = time_slot_a.split(":");
                  var splited_tm = split_tm[0];
                  var timeslot = splited_tm.replace(/^0+/, "");
                  if(time_slot_a=="00:00"){
                    timeslot=0;
                  }else{
                    timeslot=timeslot;
                  }                
                  if(timeslot==disptm){
                    console.log("DISP A"+disp_a_val);
                    //console.log(disptm+" "+timeslot);
                    //console.log(txtbox_id+" "+time_slot_a+" ("+'.disp'+(disp_aa+1)+'_a_'+timeslot+").val="+disp_a_val);
                    $(".disp_"+(disp_aa+1)+"_a_"+timeslot).val(disp_a_val);
                  }
                }
              }

            }
            //console.log("----------------------------------");
          } 

          for(var disp_bb=0;disp_bb<DISP_B.length;disp_bb++){
            var cnt_d = DISP_B[disp_bb].length;
            for(var l_b=0;l_b<=23;l_b++){
              var txtbox_id_b = $(".disp_"+(disp_bb+1)+"_b_"+l_b).attr('id');
              if(txtbox_id_b!=undefined){
                //alert(txtbox_id_b);
                var split_txt_b = txtbox_id_b.split("_");
                var dispno = split_txt_b[1];
                var disptm_b = split_txt_b[3]; 
                for(var d_bb=0;d_bb<cnt_d;d_bb++){ 
                  var disp_b_val = DISP_B[disp_bb][d_bb].slot_param_val;
                  var time_slot_b = DISP_B[disp_bb][d_bb].time_slot; 
                  var param = DISP_B[disp_bb][d_bb].dpr_params;
                  //console.log(param+" "+time_slot_b+" "+disp_b_val+" === "+d_bb);
                  var split_tm_b = time_slot_b.split(":");
                  var splited_tm_b = split_tm_b[0];
                  var timeslot_b = splited_tm_b.replace(/^0+/, "");
                  if(time_slot_b=="00:00"){
                    timeslot_b=0;
                  }else{
                    timeslot_b=timeslot_b;
                  }                
                  if(timeslot_b==disptm_b){
                    console.log("DISP B"+disp_b_val);
                    //console.log(disptm_b+" "+timeslot_b);
                    //console.log(txtbox_id_b+" "+time_slot_b+" ("+'.disp'+(disp_bb+1)+'_b_'+timeslot_b+").val="+disp_b_val);
                    $(".disp_"+(disp_bb+1)+"_b_"+timeslot_b).val(disp_b_val);
                  }
                }
              }

            }
            //console.log("----------------------------------");
          }*/


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
            console.log(gmk_slot_param_val);
            $(".GEB_energy_mtr_KWH_"+gmk).val(gmk_slot_param_val);
          }
          for(var gmkvh=0;gmkvh<GEB_MET_KVAH.length;gmkvh++){
            var gmkvah_slot_param_val = GEB_MET_KVAH[gmkvh].slot_param_val;
            console.log(gmkvah_slot_param_val);
            $(".GEB_energy_met_KVAH_"+gmkvh).val(gmkvah_slot_param_val);
          }
          for(var gmkrh=0;gmkrh<GEB_MET_KVRH.length;gmkrh++){
            var gmkrh_slot_param_val = GEB_MET_KVRH[gmkrh].slot_param_val;
            console.log(gmkrh_slot_param_val);
            $(".GEB_energy_met_KVRH_"+gmkrh).val(gmkrh_slot_param_val);
          }
          for(var dro=0;dro<DELAR_RO.length;dro++){
            var dro_slot_param_val = DELAR_RO[dro].slot_param_val;
            //console.log(dro_slot_param_val);
            $(".delar_ro_"+dro).val(dro_slot_param_val);
          }
          for(var vltg=0;vltg<VLTG.length;vltg++){
            var vltg_slot_param_val = VLTG[vltg].slot_param_val;
            console.log(vltg_slot_param_val);
            $(".voltage_"+vltg).val(vltg_slot_param_val);
          }
          for(var amp=0;amp<AMP.length;amp++){
            var amp_slot_param_val = AMP[amp].slot_param_val;
            console.log(amp_slot_param_val);
            $(".amp_"+amp).val(amp_slot_param_val);
          }
          for(var pf=0;pf<PF.length;pf++){
            var pf_slot_param_val = PF[pf].slot_param_val;
            console.log(pf_slot_param_val);
            $(".pf_"+pf).val(pf_slot_param_val);
          }
        } // else ends //
      } // result!='' ends here //
      /*
      $(".val_comp_0").each(function(){ c_zero++;
        console.log("val_comp_0 =>"+c_zero+" "+$(this).val());    
      });*/
      // -------------------------------- COMPRESSOR ------------------------------------ //
      var comp_0=0;
      $(".val_comp_0").each(function(){ 
        //alert($(this).val());
        if( $.trim($(this).val()).length == 0){  comp_0++;
          //console.log("if@@@@@@@@@");
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
 /*     if(g1 >= g2){
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
      }    commented on 12-05-2020 7:01 PM */

if(g1 >= g2){
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

  if(comp_0==0 && disp_0==0 && elec_0==0 && comp_1==0 && disp_1==0 && elec_1==0){
        //if(current_time >= "01:00:00"){ // cmnt on 30-4-2020 //
        if(current_time >= "02:00:00"){
          //alert("arey");
          col_zero(comp_0,disp_0,elec_0,comp_1,disp_1,elec_1,current_time);
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

      if(comp_0==0 && disp_0==0 && elec_0==0 && comp_1!=0 && disp_1!=0 && elec_1!=0){
        //if(current_time >= "01:00:00"){ // cmnt on 30-4-2020 //
        if(current_time >= "02:00:00"){
          //alert("OHH are");
          //$(".page1_btn").removeClass("display-none");
          //$(".page1_btn").addClass("display-block");

          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none"); 
          
          
          col_zero(comp_0,disp_0,elec_0,comp_1,disp_1,elec_1,current_time);
          show_secondpg();
          //col_zero(comp_0,disp_0,elec_0,c_one,disp_1,elec_1,current_time); 


          //$(".prev1_btn").removeClass("display-block");
          //$(".prev1_btn").addClass("display-none");
          //col_four(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time);
          //show_thirdpg();
          //col_one(c_one,disp_1,elec_1,c_two,disp_two,elec_two,current_time);
        }
      }

      if(comp_1==0 && disp_1==0 && elec_1==0 && c_two==0 && disp_two==0 && elec_two==0){
        //if(current_time >= "02:00:00"){ // cmnt on 30-4-2020 //
        if(current_time >= "03:00:00"){
          //alert("OHH 02");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          //$(".prev1_btn").removeClass("display-block");
          //$(".prev1_btn").addClass("display-none");
          //col_four(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time);
          
          col_one(comp_1,disp_1,elec_1,c_two,disp_two,elec_two,current_time);
          show_thirdpg();
        }
      }

      if(comp_1==0 && disp_1==0 && elec_1==0 && c_two!=0 && disp_two!=0 && elec_two!=0){
        //if(current_time >= "02:00:00"){ // cmnt on 30-4-2020 //
        if(current_time >= "03:00:00"){
          //alert("OHH 02");
          $(".page1_btn").removeClass("display-block");
          $(".page1_btn").addClass("display-none");
          //$(".prev1_btn").removeClass("display-block");
          //$(".prev1_btn").addClass("display-none");
          //col_four(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time);
          
          col_one(comp_1,disp_1,elec_1,c_two,disp_two,elec_two,current_time);
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
    var slot_hour = hour+":00";
    console.log(comp_var + "==========" + slot_hour+ "==========="+hour);
    
    if(quarter_minutes.indexOf(time) != -1){  
      //console.log("found");
      var hidd_stid = $("#hidd_stid").val();
      var hidd_dprdt = $("#hidd_dprdt").val(); 
      $.ajax({
        type:'POST',         
        url:base_url+'APP/Appcontroller/checkFilledDprSlot',
        data:{'station_id':hidd_stid,'dpr_date':hidd_dprdt},
        success:function(data_res){
          var encode_res = $.parseJSON(data_res);
          var slotcnt = encode_res.slotcnt;
          var empty_slot = encode_res.empty_slot;
          var unexp_slot = encode_res.unexp_slot;
          //alert(empty_slot+"----"+unexp_slot);
          if(empty_slot <= 11){ 
            var time_string = "AM";
          }else{
            var time_string = "PM";
          } 
          if(empty_slot==0){
            //alert("if");
            empty_slot=12;
            //var e_slot = empty_slot % 12;
            var alert_hr = empty_slot+":00 "+time_string;
          }else{
            //alert("else-----");
            if(empty_slot > 12){
              var oneless_hr = empty_slot % 12;
            }else{
              var oneless_hr = empty_slot ;
            }
            //var oneless_hr = empty_slot ;
            //var oneless_hr = hour - 1;
            //var e_slot = oneless_hr % 12;
            var alert_hr = oneless_hr+":00 "+time_string;
            //alert(alert_hr);    
          }  
           
          //alert("alert_hr "+alert_hr);       
          //alert("slotcnt ===="+slotcnt); 
          //alert(i+" "+empty_slot);
          //alert(hour+" "+empty_slot);                  
          if(hour==empty_slot){
            console.log("no alert");                
          }else{
            if(slotcnt==0){          
              console.log("All required fields are filled"); 
            }else if(slotcnt >= 1){ 
              app.dialog.alert("Please fill all required values for "+alert_hr);
            }else{
              app.dialog.alert("Please fill all required values for "+alert_hr);
            }
          }
        }
      });
/*      if((comp_var!=undefined && comp_var!=0) || (disp_var!=undefined && disp_var!=0) || (elec_var!=undefined && elec_var!=0)) {
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
      } */
    }else{
      //console.log("not found");//
      //element not found //
    }
  }, 60000); //60000 
//300000

  if(g1 < g2){
   //alert("#####@@@@@@");
    /*$(".comp_th_zero input").attr("readonly",true);
    $(".disp_th_zero input").attr("readonly",true);
    $(".elec_th_zero input").attr("readonly",true);
    $(".comp_th_zero input").addClass("readonlytxtbox");
    $(".disp_th_zero input").addClass("readonlytxtbox");
    $(".elec_th_zero input").addClass("readonlytxtbox");*/

    //$(".svbtn").removeClass("display-block");
    //$(".svbtn").addClass("display-none");

    if(sess_designation!='SGL EIC'){
      $(".svbtn").removeClass("display-block");
      $(".svbtn").addClass("display-none");
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page1_btn_nxt").removeClass("display-none");
      $(".page1_btn_nxt").addClass("display-block");
      $(".comp_th_zero input").attr("readonly",true);
      $(".disp_th_zero input").attr("readonly",true);
      $(".elec_th_zero input").attr("readonly",true);
      $(".comp_th_zero input").addClass("readonlytxtbox");
      $(".disp_th_zero input").addClass("readonlytxtbox");
      $(".elec_th_zero input").addClass("readonlytxtbox");
    }else{
      $(".svbtn").removeClass("display-none");
      $(".svbtn").addClass("display-block");
      $(".page1_btn").removeClass("display-none");
      $(".page1_btn").addClass("display-block");
      $(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");
      $(".comp_th_zero input").attr("readonly",false);
      $(".disp_th_zero input").attr("readonly",false);
      $(".elec_th_zero input").attr("readonly",false);
      $(".comp_th_zero input").removeClass("readonlytxtbox");
      $(".disp_th_zero input").removeClass("readonlytxtbox");
      $(".elec_th_zero input").removeClass("readonlytxtbox");
    } 
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

  if(comp_0 ==0  && disp_0 == 0 && elec_0==0 && comp_1==0 && disp_1==0 && elec_1==0){
        //alert("CHOCO PIE");
        //alert("HARRY");
        col_zero(comp_0,disp_0,elec_0,comp_1,disp_1,elec_1,current_time); 
      }

      if(g1 >= g2){
        //alert("if(g1 >= g2)");
        if(comp_0 ==0  && disp_0 == 0 && elec_0==0 && comp_1!=0 && disp_1!=0 && elec_1!=0){
          if(current_time >= "01:00:00"){
            //alert("POTTER");
            col_zero(comp_0,disp_0,elec_0,comp_1,disp_1,elec_1,current_time); 
            $(".page1_btn").removeClass("display-none");
            $(".page1_btn").addClass("display-block");
          }
        }
      }

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
  //       
  //       col_zero(comp_0,disp_0,elec_0,comp_1,disp_1,elec_1,current_time);
  //     }
  //   }
  // }
  /*if(comp_1!=0 && disp_1!=0 && elec_1!=0){
    
    if(g1 <= g2){
      
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
  //alert(dpr_date);
  /*$.ajax({
    type:'POST',  
    dataType:'json',
    url:base_url+'APP/Appcontroller/getStationStart',
    data:{'station_id':station_id},
    success:function(data_res){
      var st_start_date = data_res.st_start_date;
      //var st_start_time = data_res.st_start_time-1; // old //
      var st_start_time = data_res.st_start_time;
      //alert(st_start_time);
      if(st_start_date == dpr_date){
        for(var col=0;col<st_start_time;col++){
          $(".comp_th_"+col).html("---");
          $(".comp_th_"+col).removeClass("pl-0");
          $(".comp_th_"+col).addClass("text-center pl-9");

          $(".disp_th_"+col).html("---");
          $(".disp_th_"+col).removeClass("pl-0");
          $(".disp_th_"+col).addClass("text-center pl-9");

          $(".elec_th_"+col).html("---");
          $(".elec_th_"+col).removeClass("pl-0");
          $(".elec_th_"+col).addClass("text-center pl-9");
        }
      }
      //$("#sheet_data").html(result);
    }    
  });*/

});
function getst_Start(st_id){
  app.preloader.show();
  $.ajax({
    type:'POST',  
    dataType:'json',
    url:base_url+'APP/Appcontroller/getStationStart',
    data:{'station_id':st_id},
    success:function(data_res){      
      var st_start_date = data_res.st_start_date;
      var db_st_val = data_res.db_st_val;
      var split_stdt = st_start_date.split("-");
      var stddt_dd = split_stdt[0]-1;
      var stddt_mm = split_stdt[1]-1;
      var stddt_yr = split_stdt[2];
      // } });
      if(db_st_val=='0000-00-00 00:00:00'){
        var toastWithButton = app.toast.create({
          text: 'Station is not started',
          closeButton: true,
        });
        toastWithButton.open();
        return false;
      }else{
        var myDate=new Date();
        myDate.setDate(myDate.getDate()+1);
        // format a date    
        var dt = myDate.getDate();
        var yr = myDate.getFullYear();
        var mnth = myDate.getMonth();   
        //console.log(new Date(stddt_yr, stddt_mm, stddt_dd));
        //alert("tomorrow "+myDate.getMonth());
        var calendarModal_dpr = app.calendar.create({      
          inputEl: '#demo-calendar-modal-dpr',
          openIn: 'customModal',
          dateFormat: 'dd-mm-yyyy',
          header: true, 
          footer: true,
          closeByOutsideClick: true,
          closeOnSelect: true,
          //toolbar: true,
          //minDate: new Date(yr, mnth, dt),
          //maxDate: new Date(stddt_yr, stddt_mm, stddt_dd),
          renderToolbar: function () {    
            return '<div class="toolbar no-shadow"><div class="toolbar-inner"><div class="calendar-month-selector"><a href="#" class="link icon-only calendar-prev-month-button"><i class="f7-icons ">chevron_left</i></a><span class="current-month-value"></span><a href="#" class="link icon-only calendar-next-month-button"><i class="f7-icons ">chevron_right</i></a></div><div class="calendar-year-selector"><a href="#" class="link icon-only calendar-prev-year-button"><i class="f7-icons ">chevron_left</i></a><span class="current-year-value"></span><a href="#" class="link icon-only calendar-next-year-button"><i class="f7-icons ">chevron_right</i></a></div></div></div>'; 
          },
          on: {
            close: function () {
              //calendarModal_dpr.destroy();
              //calendarModal_dpr.close();
              calendarModal_dpr.update();
            }
          },
          disabled: [{
              //from: new Date(yr, mnth, dt),
              to: new Date(stddt_yr, stddt_mm, stddt_dd),
            },
            {
              from: new Date(yr, mnth, dt),
            }
          ],
        });
      }
    }
  }); // ajax //
  app.preloader.hide();
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
  $(".save_btn").removeClass("display-none");
  $(".save_btn").addClass("display-block");
  col_twentytwo(c_twentytwo,disp_twentytwo,elec_twentytwo,c_twentythree,disp_twentythree,elec_twentythree,current_time);
  //$(".save_btn").removeClass("display-none");
  //$(".save_btn").addClass("display-block");

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
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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
  
  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page1_btn_nxt").removeClass("display-none");
      $(".page1_btn_nxt").addClass("display-block");
      $(".page2_btn_nxt").removeClass("display-block");
      $(".page2_btn_nxt").addClass("display-none");
    }else{
      $(".page1_btn").removeClass("display-none");
      $(".page1_btn").addClass("display-block");
      $(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");
      $(".page2_btn_nxt").removeClass("display-block");
      $(".page2_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_secondpg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page2_btn").removeClass("display-block");
      $(".page2_btn").addClass("display-none");
      $(".page2_btn_nxt").removeClass("display-none");
      $(".page2_btn_nxt").addClass("display-block");
      $(".page3_btn_nxt").removeClass("display-block");
      $(".page3_btn_nxt").addClass("display-none");
    }else{
      $(".page2_btn").removeClass("display-none");
      $(".page2_btn").addClass("display-block");
      $(".page2_btn_nxt").removeClass("display-block");
      $(".page2_btn_nxt").addClass("display-none");
      $(".page3_btn_nxt").removeClass("display-block");
      $(".page3_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_thirdpg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page3_btn").removeClass("display-block");
      $(".page3_btn").addClass("display-none");
      $(".page3_btn_nxt").removeClass("display-none");
      $(".page3_btn_nxt").addClass("display-block");
      $(".page4_btn_nxt").removeClass("display-block");
      $(".page4_btn_nxt").addClass("display-none");
    }else{
      $(".page3_btn").removeClass("display-none");
      $(".page3_btn").addClass("display-block");
      $(".page3_btn_nxt").removeClass("display-block");
      $(".page3_btn_nxt").addClass("display-none");
      $(".page4_btn_nxt").removeClass("display-block");
      $(".page4_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_forthpg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page4_btn").removeClass("display-block");
      $(".page4_btn").addClass("display-none");
      $(".page4_btn_nxt").removeClass("display-none");
      $(".page4_btn_nxt").addClass("display-block");
      $(".page5_btn_nxt").removeClass("display-block");
      $(".page5_btn_nxt").addClass("display-none");
    }else{
      $(".page4_btn").removeClass("display-none");
      $(".page4_btn").addClass("display-block");
      $(".page4_btn_nxt").removeClass("display-block");
      $(".page4_btn_nxt").addClass("display-none");
      $(".page5_btn_nxt").removeClass("display-block");
      $(".page5_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_fifthpg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page5_btn").removeClass("display-block");
      $(".page5_btn").addClass("display-none");
      $(".page5_btn_nxt").removeClass("display-none");
      $(".page5_btn_nxt").addClass("display-block");
      $(".page6_btn_nxt").removeClass("display-block");
      $(".page6_btn_nxt").addClass("display-none");
    }else{
      $(".page5_btn").removeClass("display-none");
      $(".page5_btn").addClass("display-block");
      $(".page5_btn_nxt").removeClass("display-block");
      $(".page5_btn_nxt").addClass("display-none");
      $(".page6_btn_nxt").removeClass("display-block");
      $(".page6_btn_nxt").addClass("display-none"); 
    }
    
  }
}
function prev_show_sixthpg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page6_btn").removeClass("display-block");
      $(".page6_btn").addClass("display-none");
      $(".page6_btn_nxt").removeClass("display-none");
      $(".page6_btn_nxt").addClass("display-block");
      $(".page7_btn_nxt").removeClass("display-block");
      $(".page7_btn_nxt").addClass("display-none");
    }else{
      $(".page6_btn").removeClass("display-none");
      $(".page6_btn").addClass("display-block");
      $(".page6_btn_nxt").removeClass("display-block");
      $(".page6_btn_nxt").addClass("display-none");
      $(".page7_btn_nxt").removeClass("display-block");
      $(".page7_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_seventhpg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page7_btn").removeClass("display-block");
      $(".page7_btn").addClass("display-none");
      $(".page7_btn_nxt").removeClass("display-none");
      $(".page7_btn_nxt").addClass("display-block");
      $(".page8_btn_nxt").removeClass("display-block");
      $(".page8_btn_nxt").addClass("display-none");
    }else{
      $(".page7_btn").removeClass("display-none");
      $(".page7_btn").addClass("display-block");
      $(".page7_btn_nxt").removeClass("display-block");
      $(".page7_btn_nxt").addClass("display-none");
      $(".page8_btn_nxt").removeClass("display-block");
      $(".page8_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_eighthpg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page8_btn").removeClass("display-block");
      $(".page8_btn").addClass("display-none");
      $(".page8_btn_nxt").removeClass("display-none");
      $(".page8_btn_nxt").addClass("display-block");
      $(".page9_btn_nxt").removeClass("display-block");
      $(".page9_btn_nxt").addClass("display-none");
    }else{
      $(".page8_btn").removeClass("display-none");
      $(".page8_btn").addClass("display-block");
      $(".page8_btn_nxt").removeClass("display-block");
      $(".page8_btn_nxt").addClass("display-none");
      $(".page9_btn_nxt").removeClass("display-block");
      $(".page9_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_ninethpg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page9_btn").removeClass("display-block");
      $(".page9_btn").addClass("display-none");
      $(".page9_btn_nxt").removeClass("display-none");
      $(".page9_btn_nxt").addClass("display-block");
      $(".page10_btn_nxt").removeClass("display-block");
      $(".page10_btn_nxt").addClass("display-none");
    }else{
      $(".page9_btn").removeClass("display-none");
      $(".page9_btn").addClass("display-block");
      $(".page9_btn_nxt").removeClass("display-block");
      $(".page9_btn_nxt").addClass("display-none");
      $(".page10_btn_nxt").removeClass("display-block");
      $(".page10_btn_nxt").addClass("display-none");
    }
    
  }
} 
function prev_show_tenthpg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page10_btn").removeClass("display-block");
      $(".page10_btn").addClass("display-none");
      $(".page10_btn_nxt").removeClass("display-none");
      $(".page10_btn_nxt").addClass("display-block");
      $(".page11_btn_nxt").removeClass("display-block");
      $(".page11_btn_nxt").addClass("display-none");
    }else{
      $(".page10_btn").removeClass("display-none");
      $(".page10_btn").addClass("display-block");
      $(".page10_btn_nxt").removeClass("display-block");
      $(".page10_btn_nxt").addClass("display-none");
      $(".page11_btn_nxt").removeClass("display-block");
      $(".page11_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_eleventhpg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page11_btn").removeClass("display-block");
      $(".page11_btn").addClass("display-none");
      $(".page11_btn_nxt").removeClass("display-none");
      $(".page11_btn_nxt").addClass("display-block");
      $(".page12_btn_nxt").removeClass("display-block");
      $(".page12_btn_nxt").addClass("display-none");
    }else{
      $(".page11_btn").removeClass("display-none");
      $(".page11_btn").addClass("display-block");
      $(".page11_btn_nxt").removeClass("display-block");
      $(".page11_btn_nxt").addClass("display-none");
      $(".page12_btn_nxt").removeClass("display-block");
      $(".page12_btn_nxt").addClass("display-none");
    }
  }
}
function prev_show_twelvethpg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page12_btn").removeClass("display-block");
      $(".page12_btn").addClass("display-none");
      $(".page12_btn_nxt").removeClass("display-none");
      $(".page12_btn_nxt").addClass("display-block");
      $(".page13_btn_nxt").removeClass("display-block");
      $(".page13_btn_nxt").addClass("display-none");
    }else{
      $(".page12_btn").removeClass("display-none");
      $(".page12_btn").addClass("display-block");
      $(".page12_btn_nxt").removeClass("display-block");
      $(".page12_btn_nxt").addClass("display-none");
      $(".page13_btn_nxt").removeClass("display-block");
      $(".page13_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_thirteenthpg(){
  //alert("HUUHHHHHH!!!!!!");
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page13_btn").removeClass("display-block");
      $(".page13_btn").addClass("display-none");
      $(".page13_btn_nxt").removeClass("display-none");
      $(".page13_btn_nxt").addClass("display-block");
      $(".page14_btn_nxt").removeClass("display-block");
      $(".page14_btn_nxt").addClass("display-none");
    }else{
      $(".page13_btn").removeClass("display-none");
      $(".page13_btn").addClass("display-block");
      $(".page13_btn_nxt").removeClass("display-block");
      $(".page13_btn_nxt").addClass("display-none");
      $(".page14_btn_nxt").removeClass("display-block");
      $(".page14_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_forteenthpg(){
  //alert("ALERT @@@");
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page14_btn").removeClass("display-block");
      $(".page14_btn").addClass("display-none");
      $(".page14_btn_nxt").removeClass("display-none");
      $(".page14_btn_nxt").addClass("display-block");
      $(".page15_btn_nxt").removeClass("display-block");
      $(".page15_btn_nxt").addClass("display-none");
    }else{
      $(".page14_btn").removeClass("display-none");
      $(".page14_btn").addClass("display-block");
      $(".page14_btn_nxt").removeClass("display-block");
      $(".page14_btn_nxt").addClass("display-none");
      $(".page15_btn_nxt").removeClass("display-block");
      $(".page15_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_fifteenthpg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page15_btn").removeClass("display-block");
      $(".page15_btn").addClass("display-none");
      $(".page15_btn_nxt").removeClass("display-none");
      $(".page15_btn_nxt").addClass("display-block");
      $(".page16_btn_nxt").removeClass("display-block");
      $(".page16_btn_nxt").addClass("display-none");
    }else{
      $(".page15_btn").removeClass("display-none");
      $(".page15_btn").addClass("display-block");
      $(".page15_btn_nxt").removeClass("display-block");
      $(".page15_btn_nxt").addClass("display-none");
      $(".page16_btn_nxt").removeClass("display-block");
      $(".page16_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_sixteenthpg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page16_btn").removeClass("display-block");
      $(".page16_btn").addClass("display-none");
      $(".page16_btn_nxt").removeClass("display-none");
      $(".page16_btn_nxt").addClass("display-block");
      $(".page17_btn_nxt").removeClass("display-block");
      $(".page17_btn_nxt").addClass("display-none");
    }else{
      $(".page16_btn").removeClass("display-none");
      $(".page16_btn").addClass("display-block");
      $(".page16_btn_nxt").removeClass("display-block");
      $(".page16_btn_nxt").addClass("display-none");
      $(".page17_btn_nxt").removeClass("display-block");
      $(".page17_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_seventeenthpg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page17_btn").removeClass("display-block");
      $(".page17_btn").addClass("display-none");
      $(".page17_btn_nxt").removeClass("display-none");
      $(".page17_btn_nxt").addClass("display-block");
      $(".page18_btn_nxt").removeClass("display-block");
      $(".page18_btn_nxt").addClass("display-none");
    }else{
      $(".page17_btn").removeClass("display-none");
      $(".page17_btn").addClass("display-block");
      $(".page17_btn_nxt").removeClass("display-block");
      $(".page17_btn_nxt").addClass("display-none");
      $(".page18_btn_nxt").removeClass("display-block");
      $(".page18_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_eighteenthpg() {
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page18_btn").removeClass("display-block");
      $(".page18_btn").addClass("display-none");
      $(".page18_btn_nxt").removeClass("display-none");
      $(".page18_btn_nxt").addClass("display-block");
      $(".page19_btn_nxt").removeClass("display-block");
      $(".page19_btn_nxt").addClass("display-none");
    }else{
      $(".page18_btn").removeClass("display-none");
      $(".page18_btn").addClass("display-block");
      $(".page18_btn_nxt").removeClass("display-block");
      $(".page18_btn_nxt").addClass("display-none");
      $(".page19_btn_nxt").removeClass("display-block");
      $(".page19_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_nineteenthpg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page19_btn").removeClass("display-block");
      $(".page19_btn").addClass("display-none");
      $(".page19_btn_nxt").removeClass("display-none");
      $(".page19_btn_nxt").addClass("display-block");
      $(".page20_btn_nxt").removeClass("display-block");
      $(".page20_btn_nxt").addClass("display-none");
    }else{
      $(".page19_btn").removeClass("display-none");
      $(".page19_btn").addClass("display-block");
      $(".page19_btn_nxt").removeClass("display-block");
      $(".page19_btn_nxt").addClass("display-none");
      $(".page20_btn_nxt").removeClass("display-block");
      $(".page20_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_twentythpg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page20_btn").removeClass("display-block");
      $(".page20_btn").addClass("display-none");
      $(".page20_btn_nxt").removeClass("display-none");
      $(".page20_btn_nxt").addClass("display-block");
      $(".page21_btn_nxt").removeClass("display-block");
      $(".page21_btn_nxt").addClass("display-none");
    }else{
      $(".page20_btn").removeClass("display-none");
      $(".page20_btn").addClass("display-block");
      $(".page20_btn_nxt").removeClass("display-block");
      $(".page20_btn_nxt").addClass("display-none");
      $(".page21_btn_nxt").removeClass("display-block");
      $(".page21_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_twentyonepg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page21_btn").removeClass("display-block");
      $(".page21_btn").addClass("display-none");
      $(".page21_btn_nxt").removeClass("display-none");
      $(".page21_btn_nxt").addClass("display-block");
      $(".page22_btn_nxt").removeClass("display-block");
      $(".page22_btn_nxt").addClass("display-none");
    }else{
      $(".page21_btn").removeClass("display-none");
      $(".page21_btn").addClass("display-block");
      $(".page21_btn_nxt").removeClass("display-block");
      $(".page21_btn_nxt").addClass("display-none");
      $(".page22_btn_nxt").removeClass("display-block");
      $(".page22_btn_nxt").addClass("display-none");
    }
    
  }
}
function prev_show_twentytwopg(){
  var hidd_dprdt = $("#hidd_dprdt").val();
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
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
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page22_btn").removeClass("display-block");
      $(".page22_btn").addClass("display-none");
      $(".page22_btn_nxt").removeClass("display-none");
      $(".page22_btn_nxt").addClass("display-block");
    }else{
      $(".page22_btn").removeClass("display-none");
      $(".page22_btn").addClass("display-block");
      $(".page22_btn_nxt").removeClass("display-block");
      $(".page22_btn_nxt").addClass("display-none");
    }
  }
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
  console.log(" hidd_dprdt = "+hidd_dprdt);
  // INSERT IN DATABASE //
  //console.log(form_dpr);
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
    app.preloader.show();
    //alert("submit clicked");
    $(".page1_btn").removeClass("display-block");
    $(".page1_btn").addClass("display-none");
    $("#hidd_stid").val('');
    $("#hidd_dprdt").val('');
    mainView.router.navigate("/dpr_list/");
    app.preloader.hide();
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
  console.log("CALLED col_zero");
  var sess_designation = window.localStorage.getItem("sess_designation");
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
    //var lcv_count = $("#hidd_lcvcnt").val();
    if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
        $(".val_comp_1").attr("readonly",false);
        $(".val_comp_1").removeClass("readonlytxtbox");
        $(".lcv"+l+"_mfm_1").attr("readonly",false);
        $(".lcv"+l+"_mfm_1").removeClass("readonlytxtbox");
      }*/
      $(".val_comp_1").attr("readonly",false);
      $(".val_comp_1").removeClass("readonlytxtbox");
      $(".lcv3_mfm_1").attr("readonly",false);
      $(".lcv3_mfm_1").removeClass("readonlytxtbox");
      $(".lcv4_mfm_1").attr("readonly",false);
      $(".lcv4_mfm_1").removeClass("readonlytxtbox");

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

      /*$(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page1_btn_nxt").removeClass("display-none");
      $(".page1_btn_nxt").addClass("display-block");

      $(".comp_th_one input").attr("readonly",true);
      $(".disp_th_one input").attr("readonly",true);
      $(".elec_th_one input").attr("readonly",true);
      $(".comp_th_one input").addClass("readonlytxtbox");
      $(".disp_th_one input").addClass("readonlytxtbox");
      $(".elec_th_one input").addClass("readonlytxtbox");*/
      if(sess_designation!='SGL EIC'){
        $(".page1_btn").removeClass("display-block");
        $(".page1_btn").addClass("display-none");
        $(".page1_btn_nxt").removeClass("display-none");
        $(".page1_btn_nxt").addClass("display-block");
        $(".comp_th_one input").attr("readonly",true);
        $(".disp_th_one input").attr("readonly",true);
        $(".elec_th_one input").attr("readonly",true);
        $(".comp_th_one input").addClass("readonlytxtbox");
        $(".disp_th_one input").addClass("readonlytxtbox");
        $(".elec_th_one input").addClass("readonlytxtbox");

        $(".comp_th_zero input").attr("readonly",true);
        $(".disp_th_zero input").attr("readonly",true);
        $(".elec_th_zero input").attr("readonly",true); 
        $(".comp_th_zero input").addClass("readonlytxtbox");
        $(".disp_th_zero input").addClass("readonlytxtbox");
        $(".elec_th_zero input").addClass("readonlytxtbox");
      }else{
        $(".page1_btn").removeClass("display-none");
        $(".page1_btn").addClass("display-block");
        $(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");
        $(".comp_th_one input").attr("readonly",false);
        $(".disp_th_one input").attr("readonly",false);
        $(".elec_th_one input").attr("readonly",false);
        $(".comp_th_one input").removeClass("readonlytxtbox");
        $(".disp_th_one input").removeClass("readonlytxtbox");
        $(".elec_th_one input").removeClass("readonlytxtbox");

        $(".comp_th_zero input").attr("readonly",false);
        $(".disp_th_zero input").attr("readonly",false);
        $(".elec_th_zero input").attr("readonly",false); 
        $(".comp_th_zero input").removeClass("readonlytxtbox");
        $(".disp_th_zero input").removeClass("readonlytxtbox");
        $(".elec_th_zero input").removeClass("readonlytxtbox");
      }
    }
  }
  if(g1 < g2){
    if(sess_designation!='SGL EIC'){
      $(".page1_btn").removeClass("display-block");
      $(".page1_btn").addClass("display-none");
      $(".page1_btn_nxt").removeClass("display-none");
      $(".page1_btn_nxt").addClass("display-block");
      $(".comp_th_one input").attr("readonly",true);
      $(".disp_th_one input").attr("readonly",true);
      $(".elec_th_one input").attr("readonly",true);
      $(".comp_th_one input").addClass("readonlytxtbox");
      $(".disp_th_one input").addClass("readonlytxtbox");
      $(".elec_th_one input").addClass("readonlytxtbox");
    }else{
      $(".page1_btn").removeClass("display-none");
      $(".page1_btn").addClass("display-block");
      $(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");
      $(".comp_th_one input").attr("readonly",false);
      $(".disp_th_one input").attr("readonly",false);
      $(".elec_th_one input").attr("readonly",false);
      $(".comp_th_one input").removeClass("readonlytxtbox");
      $(".disp_th_one input").removeClass("readonlytxtbox");
      $(".elec_th_one input").removeClass("readonlytxtbox");

    }

    /*$(".comp_th_one input").attr("readonly",true);
    $(".disp_th_one input").attr("readonly",true);
    $(".elec_th_one input").attr("readonly",true);
    $(".comp_th_one input").addClass("readonlytxtbox");
    $(".disp_th_one input").addClass("readonlytxtbox");
    $(".elec_th_one input").addClass("readonlytxtbox");*/
  }
  //alert(c_two+"==============c_two");
  /*else{
    alert("ELSE");
  }*/
}
function col_one(c_one,disp_one,elec_one,c_two,disp_two,elec_two,current_time){
  console.log("ONE COL"+c_one+"---disp_one"+disp_one+"___elec_one"+elec_one+" c_two"+c_two+"----disp_two disp_two"+disp_two+"***** elec_two"+elec_two);
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
        $(".val_comp_2").attr("readonly",false);
        $(".val_comp_2").removeClass("readonlytxtbox");
        $(".lcv3_mfm_2").attr("readonly",false);
        $(".lcv3_mfm_2").removeClass("readonlytxtbox");
        $(".lcv4_mfm_2").attr("readonly",false);
        $(".lcv4_mfm_2").removeClass("readonlytxtbox");
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_2").attr("readonly",false);
          $(".val_comp_2").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_2").attr("readonly",false);
          $(".lcv"+l+"_mfm_2").removeClass("readonlytxtbox");
        }*/
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
      //$(".page2_btn").removeClass("display-none");
      //$(".page2_btn").addClass("display-block");

      if(sess_designation!='SGL EIC'){
        $(".page2_btn").removeClass("display-block");
        $(".page2_btn").addClass("display-none");
        $(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");
        $(".page2_btn_nxt").removeClass("display-none");
        $(".page2_btn_nxt").addClass("display-block");
        $(".comp_th_two input").attr("readonly",true);
        $(".disp_th_two input").attr("readonly",true);
        $(".elec_th_two input").attr("readonly",true);
        $(".comp_th_two input").addClass("readonlytxtbox");
        $(".disp_th_two input").addClass("readonlytxtbox");
        $(".elec_th_two input").addClass("readonlytxtbox");
      }else{
        $(".page2_btn").removeClass("display-block");
        $(".page2_btn").addClass("display-none");
        $(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");
        $(".page2_btn_nxt").removeClass("display-none");
        $(".page2_btn_nxt").addClass("display-block");
        $(".comp_th_two input").attr("readonly",false);
        $(".disp_th_two input").attr("readonly",false);
        $(".elec_th_two input").attr("readonly",false);
        $(".comp_th_two input").removeClass("readonlytxtbox");
        $(".disp_th_two input").removeClass("readonlytxtbox");
        $(".elec_th_two input").removeClass("readonlytxtbox");
      }
      /*$(".comp_th_two input").attr("readonly",true);
      $(".disp_th_two input").attr("readonly",true);
      $(".elec_th_two input").attr("readonly",true);
      $(".comp_th_two input").addClass("readonlytxtbox");
      $(".disp_th_two input").addClass("readonlytxtbox");
      $(".elec_th_two input").addClass("readonlytxtbox");*/
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
    //$(".page2_btn").removeClass("display-none");
    //$(".page2_btn").addClass("display-block");
    if(sess_designation!='SGL EIC'){
      $(".page2_btn").removeClass("display-block");
      $(".page2_btn").addClass("display-none");
      $(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");
      $(".page2_btn_nxt").removeClass("display-none");
      $(".page2_btn_nxt").addClass("display-block");
      $(".comp_th_two input").attr("readonly",true);
      $(".disp_th_two input").attr("readonly",true);
      $(".elec_th_two input").attr("readonly",true);
      $(".comp_th_two input").addClass("readonlytxtbox");
      $(".disp_th_two input").addClass("readonlytxtbox");
      $(".elec_th_two input").addClass("readonlytxtbox");
    }else{
      $(".page2_btn").removeClass("display-none");
      $(".page2_btn").addClass("display-block");
      $(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");
      $(".page2_btn_nxt").removeClass("display-block");
      $(".page2_btn_nxt").addClass("display-none");
      $(".comp_th_two input").attr("readonly",false);
      $(".disp_th_two input").attr("readonly",false);
      $(".elec_th_two input").attr("readonly",false);
      $(".comp_th_two input").removeClass("readonlytxtbox");
      $(".disp_th_two input").removeClass("readonlytxtbox");
      $(".elec_th_two input").removeClass("readonlytxtbox");
    }

    /*$(".comp_th_two input").attr("readonly",true);
    $(".disp_th_two input").attr("readonly",true);
    $(".elec_th_two input").attr("readonly",true);
    $(".comp_th_two input").addClass("readonlytxtbox");
    $(".disp_th_two input").addClass("readonlytxtbox");
    $(".elec_th_two input").addClass("readonlytxtbox");*/
  }
}
function col_two(c_two,disp_two,elec_two,c_three,disp_three,elec_three,current_time){
  console.log("TWO COL"+c_two+"---disp_two"+disp_two+"-------elec_two"+elec_two+" c_three"+c_three+"----disp_three "+disp_three+"***** elec_three"+elec_three);
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
        $(".val_comp_3").attr("readonly",false);
        $(".val_comp_3").removeClass("readonlytxtbox");
        $(".lcv3_mfm_3").attr("readonly",false);
        $(".lcv3_mfm_3").removeClass("readonlytxtbox");
        $(".lcv4_mfm_3").attr("readonly",false);
        $(".lcv4_mfm_3").removeClass("readonlytxtbox");
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_3").attr("readonly",false);
          $(".val_comp_3").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_3").attr("readonly",false);
          $(".lcv"+l+"_mfm_3").removeClass("readonlytxtbox");
        }*/
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
      //$(".page3_btn").removeClass("display-none");
      //$(".page3_btn").addClass("display-block");
      if(sess_designation!='SGL EIC'){
        $(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");
        $(".page3_btn").removeClass("display-block");
        $(".page3_btn").addClass("display-none");
        $(".page2_btn_nxt").removeClass("display-block");
        $(".page2_btn_nxt").addClass("display-none");
        $(".page3_btn_nxt").removeClass("display-none");
        $(".page3_btn_nxt").addClass("display-block");
        $(".comp_th_three input").attr("readonly",true);
        $(".disp_th_three input").attr("readonly",true);
        $(".elec_th_three input").attr("readonly",true);
        $(".comp_th_three input").addClass("readonlytxtbox");
        $(".disp_th_three input").addClass("readonlytxtbox");
        $(".elec_th_three input").addClass("readonlytxtbox");
      }else{
        $(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");
        $(".page3_btn").removeClass("display-none");
        $(".page3_btn").addClass("display-block");
        $(".page2_btn_nxt").removeClass("display-block");
        $(".page2_btn_nxt").addClass("display-none");
        $(".page3_btn_nxt").removeClass("display-block");
        $(".page3_btn_nxt").addClass("display-none");
        $(".comp_th_three input").attr("readonly",false);
        $(".disp_th_three input").attr("readonly",false);
        $(".elec_th_three input").attr("readonly",false);
        $(".comp_th_three input").removeClass("readonlytxtbox");
        $(".disp_th_three input").removeClass("readonlytxtbox");
        $(".elec_th_three input").removeClass("readonlytxtbox");
      }
      /*$(".comp_th_three input").attr("readonly",true);
      $(".disp_th_three input").attr("readonly",true);
      $(".elec_th_three input").attr("readonly",true);
      $(".comp_th_three input").addClass("readonlytxtbox");
      $(".disp_th_three input").addClass("readonlytxtbox");
      $(".elec_th_three input").addClass("readonlytxtbox");*/
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
    //$(".page3_btn").removeClass("display-none");
    //$(".page3_btn").addClass("display-block");
    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none"); 
    $(".page3_btn").removeClass("display-block");
    $(".page3_btn").addClass("display-none");
    $(".page2_btn_nxt").removeClass("display-block");
    $(".page2_btn_nxt").addClass("display-none");
    $(".page3_btn_nxt").removeClass("display-none");
    $(".page3_btn_nxt").addClass("display-block");

    $(".comp_th_three input").attr("readonly",true);
    $(".disp_th_three input").attr("readonly",true);
    $(".elec_th_three input").attr("readonly",true);
    $(".comp_th_three input").addClass("readonlytxtbox");
    $(".disp_th_three input").addClass("readonlytxtbox");
    $(".elec_th_three input").addClass("readonlytxtbox");*/

    if(sess_designation!='SGL EIC'){
        $(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");
        $(".page3_btn").removeClass("display-block");
        $(".page3_btn").addClass("display-none");
        $(".page2_btn_nxt").removeClass("display-block");
        $(".page2_btn_nxt").addClass("display-none");
        $(".page3_btn_nxt").removeClass("display-none");
        $(".page3_btn_nxt").addClass("display-block");
        $(".comp_th_three input").attr("readonly",true);
        $(".disp_th_three input").attr("readonly",true);
        $(".elec_th_three input").attr("readonly",true);
        $(".comp_th_three input").addClass("readonlytxtbox");
        $(".disp_th_three input").addClass("readonlytxtbox");
        $(".elec_th_three input").addClass("readonlytxtbox");
      }else{
        $(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");
        $(".page3_btn").removeClass("display-none");
        $(".page3_btn").addClass("display-block");
        $(".page2_btn_nxt").removeClass("display-block");
        $(".page2_btn_nxt").addClass("display-none");
        $(".page3_btn_nxt").removeClass("display-block");
        $(".page3_btn_nxt").addClass("display-none");
        $(".comp_th_three input").attr("readonly",false);
        $(".disp_th_three input").attr("readonly",false);
        $(".elec_th_three input").attr("readonly",false);
        $(".comp_th_three input").removeClass("readonlytxtbox");
        $(".disp_th_three input").removeClass("readonlytxtbox");
        $(".elec_th_three input").removeClass("readonlytxtbox");
      }

  }
}
function col_three(c_three,disp_three,elec_three,c_four,disp_four,elec_four,current_time){
  console.log("THREE COL"+c_three+"---disp_three"+disp_three+"-------elec_three"+elec_three+" c_four"+c_four+"----disp_four "+disp_four+"***** elec_four"+elec_four);
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_4").attr("readonly",false);
          $(".val_comp_4").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_4").attr("readonly",false);
          $(".lcv"+l+"_mfm_4").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_4").attr("readonly",false);
        $(".val_comp_4").removeClass("readonlytxtbox");
        $(".lcv3_mfm_4").attr("readonly",false);
        $(".lcv3_mfm_4").removeClass("readonlytxtbox");
        $(".lcv4_mfm_4").attr("readonly",false);
        $(".lcv4_mfm_4").removeClass("readonlytxtbox");
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
      //$(".page4_btn").removeClass("display-none");
      //$(".page4_btn").addClass("display-block");
      /*$(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");
      $(".page4_btn").removeClass("display-block");
      $(".page4_btn").addClass("display-none");
      $(".page3_btn_nxt").removeClass("display-block");
      $(".page3_btn_nxt").addClass("display-none");
      $(".page4_btn_nxt").removeClass("display-none");
      $(".page4_btn_nxt").addClass("display-block");

      $(".comp_th_four input").attr("readonly",true);
      $(".disp_th_four input").attr("readonly",true);
      $(".elec_th_four input").attr("readonly",true);
      $(".comp_th_four input").addClass("readonlytxtbox");
      $(".disp_th_four input").addClass("readonlytxtbox");
      $(".elec_th_four input").addClass("readonlytxtbox");*/
      if(sess_designation!='SGL EIC'){
        $(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");
        $(".page4_btn").removeClass("display-block");
        $(".page4_btn").addClass("display-none");
        $(".page3_btn_nxt").removeClass("display-block");
        $(".page3_btn_nxt").addClass("display-none");
        $(".page4_btn_nxt").removeClass("display-none");
        $(".page4_btn_nxt").addClass("display-block");

        $(".comp_th_four input").attr("readonly",true);
        $(".disp_th_four input").attr("readonly",true);
        $(".elec_th_four input").attr("readonly",true);
        $(".comp_th_four input").addClass("readonlytxtbox");
        $(".disp_th_four input").addClass("readonlytxtbox");
        $(".elec_th_four input").addClass("readonlytxtbox");
      }else{
        $(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");
        $(".page4_btn").removeClass("display-none");
        $(".page4_btn").addClass("display-block");
        $(".page3_btn_nxt").removeClass("display-block");
        $(".page3_btn_nxt").addClass("display-none");
        $(".page4_btn_nxt").removeClass("display-block");
        $(".page4_btn_nxt").addClass("display-none");

        $(".comp_th_four input").attr("readonly",false);
        $(".disp_th_four input").attr("readonly",false);
        $(".elec_th_four input").attr("readonly",false);
        $(".comp_th_four input").removeClass("readonlytxtbox");
        $(".disp_th_four input").removeClass("readonlytxtbox");
        $(".elec_th_four input").removeClass("readonlytxtbox");
      }
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
    //$(".page4_btn").removeClass("display-none");
    //$(".page4_btn").addClass("display-block");
    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none");
    $(".page4_btn").removeClass("display-block");
    $(".page4_btn").addClass("display-none");
    $(".page3_btn_nxt").removeClass("display-block");
    $(".page3_btn_nxt").addClass("display-none");
    $(".page4_btn_nxt").removeClass("display-none");
    $(".page4_btn_nxt").addClass("display-block");

    $(".comp_th_four input").attr("readonly",true);
    $(".disp_th_four input").attr("readonly",true);
    $(".elec_th_four input").attr("readonly",true);
    $(".comp_th_four input").addClass("readonlytxtbox");
    $(".disp_th_four input").addClass("readonlytxtbox");
    $(".elec_th_four input").addClass("readonlytxtbox");*/
    if(sess_designation!='SGL EIC'){
        $(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");
        $(".page4_btn").removeClass("display-block");
        $(".page4_btn").addClass("display-none");
        $(".page3_btn_nxt").removeClass("display-block");
        $(".page3_btn_nxt").addClass("display-none");
        $(".page4_btn_nxt").removeClass("display-none");
        $(".page4_btn_nxt").addClass("display-block");

        $(".comp_th_four input").attr("readonly",true);
        $(".disp_th_four input").attr("readonly",true);
        $(".elec_th_four input").attr("readonly",true);
        $(".comp_th_four input").addClass("readonlytxtbox");
        $(".disp_th_four input").addClass("readonlytxtbox");
        $(".elec_th_four input").addClass("readonlytxtbox");
      }else{
        $(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");
        $(".page4_btn").removeClass("display-none");
        $(".page4_btn").addClass("display-block");
        $(".page3_btn_nxt").removeClass("display-block");
        $(".page3_btn_nxt").addClass("display-none");
        $(".page4_btn_nxt").removeClass("display-block");
        $(".page4_btn_nxt").addClass("display-none");

        $(".comp_th_four input").attr("readonly",false);
        $(".disp_th_four input").attr("readonly",false);
        $(".elec_th_four input").attr("readonly",false);
        $(".comp_th_four input").removeClass("readonlytxtbox");
        $(".disp_th_four input").removeClass("readonlytxtbox");
        $(".elec_th_four input").removeClass("readonlytxtbox");
      }
  }
}
function col_four(c_four,disp_four,elec_four,c_five,disp_five,elec_five,current_time){
  console.log("FOUR COL"+c_four+"---disp_four"+disp_four+"-------elec_four"+elec_four+" c_five"+c_five+"----disp_five "+disp_five+"***** elec_five"+elec_five);
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_5").attr("readonly",false);
          $(".val_comp_5").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_5").attr("readonly",false);
          $(".lcv"+l+"_mfm_5").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_5").attr("readonly",false);
        $(".val_comp_5").removeClass("readonlytxtbox");
        $(".lcv3_mfm_5").attr("readonly",false);
        $(".lcv3_mfm_5").removeClass("readonlytxtbox");
        $(".lcv4_mfm_5").attr("readonly",false);
        $(".lcv4_mfm_5").removeClass("readonlytxtbox");
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
        //$(".page5_btn").removeClass("display-none");
        //$(".page5_btn").addClass("display-block");
        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");    
        $(".page5_btn").removeClass("display-block");
        $(".page5_btn").addClass("display-none");
        $(".page4_btn_nxt").removeClass("display-block");
        $(".page4_btn_nxt").addClass("display-none");
        $(".page5_btn_nxt").removeClass("display-none");
        $(".page5_btn_nxt").addClass("display-block");

        $(".comp_th_five input").attr("readonly",true);
        $(".disp_th_five input").attr("readonly",true);
        $(".elec_th_five input").attr("readonly",true);
        $(".comp_th_five input").addClass("readonlytxtbox");
        $(".disp_th_five input").addClass("readonlytxtbox");
        $(".elec_th_five input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");    
          $(".page5_btn").removeClass("display-block");
          $(".page5_btn").addClass("display-none");
          $(".page4_btn_nxt").removeClass("display-block");
          $(".page4_btn_nxt").addClass("display-none");
          $(".page5_btn_nxt").removeClass("display-none");
          $(".page5_btn_nxt").addClass("display-block");

          $(".comp_th_five input").attr("readonly",true);
          $(".disp_th_five input").attr("readonly",true);
          $(".elec_th_five input").attr("readonly",true);
          $(".comp_th_five input").addClass("readonlytxtbox");
          $(".disp_th_five input").addClass("readonlytxtbox");
          $(".elec_th_five input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");    
          $(".page5_btn").removeClass("display-none");
          $(".page5_btn").addClass("display-block");
          $(".page4_btn_nxt").removeClass("display-block");
          $(".page4_btn_nxt").addClass("display-none");
          $(".page5_btn_nxt").removeClass("display-block");
          $(".page5_btn_nxt").addClass("display-none");

          $(".comp_th_five input").attr("readonly",false);
          $(".disp_th_five input").attr("readonly",false);
          $(".elec_th_five input").attr("readonly",false);
          $(".comp_th_five input").removeClass("readonlytxtbox");
          $(".disp_th_five input").removeClass("readonlytxtbox");
          $(".elec_th_five input").removeClass("readonlytxtbox");
        }
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
    //$(".page5_btn").removeClass("display-none");
    //$(".page5_btn").addClass("display-block");
    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none");  
    $(".page5_btn").removeClass("display-block");
    $(".page5_btn").addClass("display-none");
    $(".page4_btn_nxt").removeClass("display-block");
    $(".page4_btn_nxt").addClass("display-none");
    $(".page5_btn_nxt").removeClass("display-none");
    $(".page5_btn_nxt").addClass("display-block");


    $(".comp_th_five input").attr("readonly",true);
    $(".disp_th_five input").attr("readonly",true);
    $(".elec_th_five input").attr("readonly",true);
    $(".comp_th_five input").addClass("readonlytxtbox");
    $(".disp_th_five input").addClass("readonlytxtbox");
    $(".elec_th_five input").addClass("readonlytxtbox");*/
    if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");    
          $(".page5_btn").removeClass("display-block");
          $(".page5_btn").addClass("display-none");
          $(".page4_btn_nxt").removeClass("display-block");
          $(".page4_btn_nxt").addClass("display-none");
          $(".page5_btn_nxt").removeClass("display-none");
          $(".page5_btn_nxt").addClass("display-block");

          $(".comp_th_five input").attr("readonly",true);
          $(".disp_th_five input").attr("readonly",true);
          $(".elec_th_five input").attr("readonly",true);
          $(".comp_th_five input").addClass("readonlytxtbox");
          $(".disp_th_five input").addClass("readonlytxtbox");
          $(".elec_th_five input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");    
          $(".page5_btn").removeClass("display-none");
          $(".page5_btn").addClass("display-block");
          $(".page4_btn_nxt").removeClass("display-block");
          $(".page4_btn_nxt").addClass("display-none");
          $(".page5_btn_nxt").removeClass("display-block");
          $(".page5_btn_nxt").addClass("display-none");

          $(".comp_th_five input").attr("readonly",false);
          $(".disp_th_five input").attr("readonly",false);
          $(".elec_th_five input").attr("readonly",false);
          $(".comp_th_five input").removeClass("readonlytxtbox");
          $(".disp_th_five input").removeClass("readonlytxtbox");
          $(".elec_th_five input").removeClass("readonlytxtbox");
        }
  }
}
function col_five(c_five,disp_five,elec_five,c_six,disp_six,elec_six,current_time){
  console.log("FIVE COL"+c_five+"---disp_five"+disp_five+"-------elec_five"+elec_five+" c_six"+c_six+"----disp_six "+disp_six+"***** elec_six"+elec_six);  
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_6").attr("readonly",false);
          $(".val_comp_6").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_6").attr("readonly",false);
          $(".lcv"+l+"_mfm_6").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_6").attr("readonly",false);
        $(".val_comp_6").removeClass("readonlytxtbox");
        $(".lcv3_mfm_6").attr("readonly",false);
        $(".lcv3_mfm_6").removeClass("readonlytxtbox");
        $(".lcv4_mfm_6").attr("readonly",false);
        $(".lcv4_mfm_6").removeClass("readonlytxtbox");
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
        //$(".page6_btn").removeClass("display-none");
        //$(".page6_btn").addClass("display-block");
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page6_btn").removeClass("display-block");
          $(".page6_btn").addClass("display-none");
          $(".page5_btn_nxt").removeClass("display-block");
          $(".page5_btn_nxt").addClass("display-none");
          $(".page6_btn_nxt").removeClass("display-none");
          $(".page6_btn_nxt").addClass("display-block");

          $(".comp_th_six input").attr("readonly",true);
          $(".disp_th_six input").attr("readonly",true);
          $(".elec_th_six input").attr("readonly",true);
          $(".comp_th_six input").addClass("readonlytxtbox");
          $(".disp_th_six input").addClass("readonlytxtbox");
          $(".elec_th_six input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page6_btn").removeClass("display-none");
          $(".page6_btn").addClass("display-block");
          $(".page5_btn_nxt").removeClass("display-block");
          $(".page5_btn_nxt").addClass("display-none");
          $(".page6_btn_nxt").removeClass("display-block");
          $(".page6_btn_nxt").addClass("display-none");

          $(".comp_th_six input").attr("readonly",false);
          $(".disp_th_six input").attr("readonly",false);
          $(".elec_th_six input").attr("readonly",false);
          $(".comp_th_six input").removeClass("readonlytxtbox");
          $(".disp_th_six input").removeClass("readonlytxtbox");
          $(".elec_th_six input").removeClass("readonlytxtbox");
        }
        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page6_btn").removeClass("display-block");
        $(".page6_btn").addClass("display-none");
        $(".page5_btn_nxt").removeClass("display-block");
        $(".page5_btn_nxt").addClass("display-none");
        $(".page6_btn_nxt").removeClass("display-none");
        $(".page6_btn_nxt").addClass("display-block");

        $(".comp_th_six input").attr("readonly",true);
        $(".disp_th_six input").attr("readonly",true);
        $(".elec_th_six input").attr("readonly",true);
        $(".comp_th_six input").addClass("readonlytxtbox");
        $(".disp_th_six input").addClass("readonlytxtbox");
        $(".elec_th_six input").addClass("readonlytxtbox");*/
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
    //$(".page6_btn").removeClass("display-none");
    //$(".page6_btn").addClass("display-block");
    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none");  
    $(".page6_btn").removeClass("display-block");
    $(".page6_btn").addClass("display-none");
    $(".page5_btn_nxt").removeClass("display-block");
    $(".page5_btn_nxt").addClass("display-none");
    $(".page6_btn_nxt").removeClass("display-none");
    $(".page6_btn_nxt").addClass("display-block");

    $(".comp_th_six input").attr("readonly",true);
    $(".disp_th_six input").attr("readonly",true);
    $(".elec_th_six input").attr("readonly",true);
    $(".comp_th_six input").addClass("readonlytxtbox");
    $(".disp_th_six input").addClass("readonlytxtbox");
    $(".elec_th_six input").addClass("readonlytxtbox");*/
    if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page6_btn").removeClass("display-block");
          $(".page6_btn").addClass("display-none");
          $(".page5_btn_nxt").removeClass("display-block");
          $(".page5_btn_nxt").addClass("display-none");
          $(".page6_btn_nxt").removeClass("display-none");
          $(".page6_btn_nxt").addClass("display-block");

          $(".comp_th_six input").attr("readonly",true);
          $(".disp_th_six input").attr("readonly",true);
          $(".elec_th_six input").attr("readonly",true);
          $(".comp_th_six input").addClass("readonlytxtbox");
          $(".disp_th_six input").addClass("readonlytxtbox");
          $(".elec_th_six input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page6_btn").removeClass("display-none");
          $(".page6_btn").addClass("display-block");
          $(".page5_btn_nxt").removeClass("display-block");
          $(".page5_btn_nxt").addClass("display-none");
          $(".page6_btn_nxt").removeClass("display-block");
          $(".page6_btn_nxt").addClass("display-none");

          $(".comp_th_six input").attr("readonly",false);
          $(".disp_th_six input").attr("readonly",false);
          $(".elec_th_six input").attr("readonly",false);
          $(".comp_th_six input").removeClass("readonlytxtbox");
          $(".disp_th_six input").removeClass("readonlytxtbox");
          $(".elec_th_six input").removeClass("readonlytxtbox");
        }
  }
}
function col_six(c_six,disp_six,elec_six,c_seven,disp_seven,elec_seven,current_time){
  console.log("SIX COL"+c_six+"---disp_six"+disp_six+"-------elec_six"+elec_six+" c_seven"+c_seven+"----disp_seven "+disp_seven+"***** elec_seven"+elec_seven);  
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_7").attr("readonly",false);
          $(".val_comp_7").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_7").attr("readonly",false);
          $(".lcv"+l+"_mfm_7").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_7").attr("readonly",false);
        $(".val_comp_7").removeClass("readonlytxtbox");
        $(".lcv3_mfm_7").attr("readonly",false);
        $(".lcv3_mfm_7").removeClass("readonlytxtbox");
        $(".lcv4_mfm_7").attr("readonly",false);
        $(".lcv4_mfm_7").removeClass("readonlytxtbox");
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
        //$(".page7_btn").removeClass("display-none");
        //$(".page7_btn").addClass("display-block");
        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page7_btn").removeClass("display-block");
        $(".page7_btn").addClass("display-none");
        $(".page6_btn_nxt").removeClass("display-block");
        $(".page6_btn_nxt").addClass("display-none");
        $(".page7_btn_nxt").removeClass("display-none");
        $(".page7_btn_nxt").addClass("display-block");

        $(".comp_th_seven input").attr("readonly",true);
        $(".disp_th_seven input").attr("readonly",true);
        $(".elec_th_seven input").attr("readonly",true);
        $(".comp_th_seven input").addClass("readonlytxtbox");
        $(".disp_th_seven input").addClass("readonlytxtbox");
        $(".elec_th_seven input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page7_btn").removeClass("display-block");
          $(".page7_btn").addClass("display-none");
          $(".page6_btn_nxt").removeClass("display-block");
          $(".page6_btn_nxt").addClass("display-none");
          $(".page7_btn_nxt").removeClass("display-none");
          $(".page7_btn_nxt").addClass("display-block");

          $(".comp_th_seven input").attr("readonly",true);
          $(".disp_th_seven input").attr("readonly",true);
          $(".elec_th_seven input").attr("readonly",true);
          $(".comp_th_seven input").addClass("readonlytxtbox");
          $(".disp_th_seven input").addClass("readonlytxtbox");
          $(".elec_th_seven input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page7_btn").removeClass("display-none");
          $(".page7_btn").addClass("display-block");
          $(".page6_btn_nxt").removeClass("display-block");
          $(".page6_btn_nxt").addClass("display-none");
          $(".page7_btn_nxt").removeClass("display-block");
          $(".page7_btn_nxt").addClass("display-none");

          $(".comp_th_seven input").attr("readonly",false);
          $(".disp_th_seven input").attr("readonly",false);
          $(".elec_th_seven input").attr("readonly",false);
          $(".comp_th_seven input").removeClass("readonlytxtbox");
          $(".disp_th_seven input").removeClass("readonlytxtbox");
          $(".elec_th_seven input").removeClass("readonlytxtbox");
        }
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
    //$(".page7_btn").removeClass("display-none");
    //$(".page7_btn").addClass("display-block");
    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none");  
    $(".page7_btn").removeClass("display-block");
    $(".page7_btn").addClass("display-none");
    $(".page6_btn_nxt").removeClass("display-block");
    $(".page6_btn_nxt").addClass("display-none");
    $(".page7_btn_nxt").removeClass("display-none");
    $(".page7_btn_nxt").addClass("display-block");

    $(".comp_th_seven input").attr("readonly",true);
    $(".disp_th_seven input").attr("readonly",true);
    $(".elec_th_seven input").attr("readonly",true);
    $(".comp_th_seven input").addClass("readonlytxtbox");
    $(".disp_th_seven input").addClass("readonlytxtbox");
    $(".elec_th_seven input").addClass("readonlytxtbox");*/

    if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page7_btn").removeClass("display-block");
          $(".page7_btn").addClass("display-none");
          $(".page6_btn_nxt").removeClass("display-block");
          $(".page6_btn_nxt").addClass("display-none");
          $(".page7_btn_nxt").removeClass("display-none");
          $(".page7_btn_nxt").addClass("display-block");

          $(".comp_th_seven input").attr("readonly",true);
          $(".disp_th_seven input").attr("readonly",true);
          $(".elec_th_seven input").attr("readonly",true);
          $(".comp_th_seven input").addClass("readonlytxtbox");
          $(".disp_th_seven input").addClass("readonlytxtbox");
          $(".elec_th_seven input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page7_btn").removeClass("display-none");
          $(".page7_btn").addClass("display-block");
          $(".page6_btn_nxt").removeClass("display-block");
          $(".page6_btn_nxt").addClass("display-none");
          $(".page7_btn_nxt").removeClass("display-block");
          $(".page7_btn_nxt").addClass("display-none");

          $(".comp_th_seven input").attr("readonly",false);
          $(".disp_th_seven input").attr("readonly",false);
          $(".elec_th_seven input").attr("readonly",false);
          $(".comp_th_seven input").removeClass("readonlytxtbox");
          $(".disp_th_seven input").removeClass("readonlytxtbox");
          $(".elec_th_seven input").removeClass("readonlytxtbox");
        }

  }
}
function col_seven(c_seven,disp_seven,elec_seven,c_eight,disp_eight,elec_eight,current_time){
  console.log("SEVEN COL"+c_seven+"---disp_seven"+disp_seven+"-------elec_seven"+elec_seven+" c_eight"+c_eight+"----disp_eight "+disp_eight+"***** elec_eight"+elec_eight);
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_8").attr("readonly",false);
          $(".val_comp_8").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_8").attr("readonly",false);
          $(".lcv"+l+"_mfm_8").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_8").attr("readonly",false);
        $(".val_comp_8").removeClass("readonlytxtbox");
        $(".lcv3_mfm_8").attr("readonly",false);
        $(".lcv3_mfm_8").removeClass("readonlytxtbox");
        $(".lcv4_mfm_8").attr("readonly",false);
        $(".lcv4_mfm_8").removeClass("readonlytxtbox");
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
        //$(".page8_btn").removeClass("display-none");
        //$(".page8_btn").addClass("display-block");
        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page8_btn").removeClass("display-block");
        $(".page8_btn").addClass("display-none");
        $(".page7_btn_nxt").removeClass("display-block");
        $(".page7_btn_nxt").addClass("display-none");
        $(".page8_btn_nxt").removeClass("display-none");
        $(".page8_btn_nxt").addClass("display-block");

        $(".comp_th_eight input").attr("readonly",true);
        $(".disp_th_eight input").attr("readonly",true);
        $(".elec_th_eight input").attr("readonly",true);
        $(".comp_th_eight input").addClass("readonlytxtbox");
        $(".disp_th_eight input").addClass("readonlytxtbox");
        $(".elec_th_eight input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page8_btn").removeClass("display-block");
          $(".page8_btn").addClass("display-none");
          $(".page7_btn_nxt").removeClass("display-block");
          $(".page7_btn_nxt").addClass("display-none");
          $(".page8_btn_nxt").removeClass("display-none");
          $(".page8_btn_nxt").addClass("display-block");

          $(".comp_th_eight input").attr("readonly",true);
          $(".disp_th_eight input").attr("readonly",true);
          $(".elec_th_eight input").attr("readonly",true);
          $(".comp_th_eight input").addClass("readonlytxtbox");
          $(".disp_th_eight input").addClass("readonlytxtbox");
          $(".elec_th_eight input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page8_btn").removeClass("display-none");
          $(".page8_btn").addClass("display-block");
          $(".page7_btn_nxt").removeClass("display-block");
          $(".page7_btn_nxt").addClass("display-none");
          $(".page8_btn_nxt").removeClass("display-block");
          $(".page8_btn_nxt").addClass("display-none");

          $(".comp_th_eight input").attr("readonly",false);
          $(".disp_th_eight input").attr("readonly",false);
          $(".elec_th_eight input").attr("readonly",false);
          $(".comp_th_eight input").removeClass("readonlytxtbox");
          $(".disp_th_eight input").removeClass("readonlytxtbox");
          $(".elec_th_eight input").removeClass("readonlytxtbox");
        }
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
    //$(".page8_btn").removeClass("display-none");
    //$(".page8_btn").addClass("display-block");
    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none");  
    $(".page8_btn").removeClass("display-block");
    $(".page8_btn").addClass("display-none");
    $(".page7_btn_nxt").removeClass("display-block");
    $(".page7_btn_nxt").addClass("display-none");
    $(".page8_btn_nxt").removeClass("display-none");
    $(".page8_btn_nxt").addClass("display-block");

    $(".comp_th_eight input").attr("readonly",true);
    $(".disp_th_eight input").attr("readonly",true);
    $(".elec_th_eight input").attr("readonly",true);
    $(".comp_th_eight input").addClass("readonlytxtbox");
    $(".disp_th_eight input").addClass("readonlytxtbox");
    $(".elec_th_eight input").addClass("readonlytxtbox");*/
    if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page8_btn").removeClass("display-block");
          $(".page8_btn").addClass("display-none");
          $(".page7_btn_nxt").removeClass("display-block");
          $(".page7_btn_nxt").addClass("display-none");
          $(".page8_btn_nxt").removeClass("display-none");
          $(".page8_btn_nxt").addClass("display-block");

          $(".comp_th_eight input").attr("readonly",true);
          $(".disp_th_eight input").attr("readonly",true);
          $(".elec_th_eight input").attr("readonly",true);
          $(".comp_th_eight input").addClass("readonlytxtbox");
          $(".disp_th_eight input").addClass("readonlytxtbox");
          $(".elec_th_eight input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page8_btn").removeClass("display-none");
          $(".page8_btn").addClass("display-block");
          $(".page7_btn_nxt").removeClass("display-block");
          $(".page7_btn_nxt").addClass("display-none");
          $(".page8_btn_nxt").removeClass("display-block");
          $(".page8_btn_nxt").addClass("display-none");

          $(".comp_th_eight input").attr("readonly",false);
          $(".disp_th_eight input").attr("readonly",false);
          $(".elec_th_eight input").attr("readonly",false);
          $(".comp_th_eight input").removeClass("readonlytxtbox");
          $(".disp_th_eight input").removeClass("readonlytxtbox");
          $(".elec_th_eight input").removeClass("readonlytxtbox");
        }

  }
}
function col_eight(c_eight,disp_eight,elec_eight,c_nine,disp_nine,elec_nine,current_time){
  console.log("EIGHT COL"+c_eight+"---disp_eight"+disp_eight+"-------elec_eight"+elec_eight+" c_nine"+c_nine+"----disp_nine "+disp_nine+"***** elec_nine"+elec_nine);
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_9").attr("readonly",false);
          $(".val_comp_9").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_9").attr("readonly",false);
          $(".lcv"+l+"_mfm_9").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_9").attr("readonly",false);
        $(".val_comp_9").removeClass("readonlytxtbox");
        $(".lcv3_mfm_9").attr("readonly",false);
        $(".lcv3_mfm_9").removeClass("readonlytxtbox");
        $(".lcv4_mfm_9").attr("readonly",false);
        $(".lcv4_mfm_9").removeClass("readonlytxtbox");

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
        //$(".page9_btn").removeClass("display-none");
        //$(".page9_btn").addClass("display-block");
        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page9_btn").removeClass("display-block");
        $(".page9_btn").addClass("display-none");
        $(".page8_btn_nxt").removeClass("display-block");
        $(".page8_btn_nxt").addClass("display-none");
        $(".page9_btn_nxt").removeClass("display-none");
        $(".page9_btn_nxt").addClass("display-block");

        $(".comp_th_nine input").attr("readonly",true);
        $(".disp_th_nine input").attr("readonly",true);
        $(".elec_th_nine input").attr("readonly",true);
        $(".comp_th_nine input").addClass("readonlytxtbox");
        $(".disp_th_nine input").addClass("readonlytxtbox");
        $(".elec_th_nine input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page9_btn").removeClass("display-block");
          $(".page9_btn").addClass("display-none");
          $(".page8_btn_nxt").removeClass("display-block");
          $(".page8_btn_nxt").addClass("display-none");
          $(".page9_btn_nxt").removeClass("display-none");
          $(".page9_btn_nxt").addClass("display-block");

          $(".comp_th_nine input").attr("readonly",true);
          $(".disp_th_nine input").attr("readonly",true);
          $(".elec_th_nine input").attr("readonly",true);
          $(".comp_th_nine input").addClass("readonlytxtbox");
          $(".disp_th_nine input").addClass("readonlytxtbox");
          $(".elec_th_nine input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page9_btn").removeClass("display-none");
          $(".page9_btn").addClass("display-block");
          $(".page8_btn_nxt").removeClass("display-block");
          $(".page8_btn_nxt").addClass("display-none");
          $(".page9_btn_nxt").removeClass("display-block");
          $(".page9_btn_nxt").addClass("display-none");

          $(".comp_th_nine input").attr("readonly",false);
          $(".disp_th_nine input").attr("readonly",false);
          $(".elec_th_nine input").attr("readonly",false);
          $(".comp_th_nine input").removeClass("readonlytxtbox");
          $(".disp_th_nine input").removeClass("readonlytxtbox");
          $(".elec_th_nine input").removeClass("readonlytxtbox");
        }
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
    //$(".page9_btn").removeClass("display-none");
    //$(".page9_btn").addClass("display-block");
    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none");  
    $(".page9_btn").removeClass("display-block");
    $(".page9_btn").addClass("display-none");
    $(".page8_btn_nxt").removeClass("display-block");
    $(".page8_btn_nxt").addClass("display-none");
    $(".page9_btn_nxt").removeClass("display-none");
    $(".page9_btn_nxt").addClass("display-block");

    $(".comp_th_nine input").attr("readonly",true);
    $(".disp_th_nine input").attr("readonly",true);
    $(".elec_th_nine input").attr("readonly",true);
    $(".comp_th_nine input").addClass("readonlytxtbox");
    $(".disp_th_nine input").addClass("readonlytxtbox");
    $(".elec_th_nine input").addClass("readonlytxtbox");*/
    if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page9_btn").removeClass("display-block");
          $(".page9_btn").addClass("display-none");
          $(".page8_btn_nxt").removeClass("display-block");
          $(".page8_btn_nxt").addClass("display-none");
          $(".page9_btn_nxt").removeClass("display-none");
          $(".page9_btn_nxt").addClass("display-block");

          $(".comp_th_nine input").attr("readonly",true);
          $(".disp_th_nine input").attr("readonly",true);
          $(".elec_th_nine input").attr("readonly",true);
          $(".comp_th_nine input").addClass("readonlytxtbox");
          $(".disp_th_nine input").addClass("readonlytxtbox");
          $(".elec_th_nine input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page9_btn").removeClass("display-none");
          $(".page9_btn").addClass("display-block");
          $(".page8_btn_nxt").removeClass("display-block");
          $(".page8_btn_nxt").addClass("display-none");
          $(".page9_btn_nxt").removeClass("display-block");
          $(".page9_btn_nxt").addClass("display-none");

          $(".comp_th_nine input").attr("readonly",false);
          $(".disp_th_nine input").attr("readonly",false);
          $(".elec_th_nine input").attr("readonly",false);
          $(".comp_th_nine input").removeClass("readonlytxtbox");
          $(".disp_th_nine input").removeClass("readonlytxtbox");
          $(".elec_th_nine input").removeClass("readonlytxtbox");
        }
  }
}
function col_nine(c_nine,disp_nine,elec_nine,c_ten,disp_ten,elec_ten,current_time){
  console.log("NINE COL"+c_nine+"---disp_nine"+disp_nine+"-------elec_nine"+elec_nine+" c_ten"+c_ten+"----disp_ten "+disp_ten+"***** elec_ten"+elec_ten);  
  var sess_designation = window.localStorage.getItem("sess_designation");

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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_10").attr("readonly",false);
          $(".val_comp_10").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_10").attr("readonly",false);
          $(".lcv"+l+"_mfm_10").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_10").attr("readonly",false);
        $(".val_comp_10").removeClass("readonlytxtbox");
        $(".lcv3_mfm_10").attr("readonly",false);
        $(".lcv3_mfm_10").removeClass("readonlytxtbox");
        $(".lcv4_mfm_10").attr("readonly",false);
        $(".lcv4_mfm_10").removeClass("readonlytxtbox");
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
        //$(".page10_btn").removeClass("display-none");
        //$(".page10_btn").addClass("display-block");
        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page10_btn").removeClass("display-block");
        $(".page10_btn").addClass("display-none");
        $(".page9_btn_nxt").removeClass("display-block");
        $(".page9_btn_nxt").addClass("display-none");
        $(".page10_btn_nxt").removeClass("display-none");
        $(".page10_btn_nxt").addClass("display-block");

        $(".comp_th_ten input").attr("readonly",true);
        $(".disp_th_ten input").attr("readonly",true);
        $(".elec_th_ten input").attr("readonly",true);
        $(".comp_th_ten input").addClass("readonlytxtbox");
        $(".disp_th_ten input").addClass("readonlytxtbox");
        $(".elec_th_ten input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page10_btn").removeClass("display-block");
          $(".page10_btn").addClass("display-none");
          $(".page9_btn_nxt").removeClass("display-block");
          $(".page9_btn_nxt").addClass("display-none");
          $(".page10_btn_nxt").removeClass("display-none");
          $(".page10_btn_nxt").addClass("display-block");

          $(".comp_th_ten input").attr("readonly",true);
          $(".disp_th_ten input").attr("readonly",true);
          $(".elec_th_ten input").attr("readonly",true);
          $(".comp_th_ten input").addClass("readonlytxtbox");
          $(".disp_th_ten input").addClass("readonlytxtbox");
          $(".elec_th_ten input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page10_btn").removeClass("display-none");
          $(".page10_btn").addClass("display-block");
          $(".page9_btn_nxt").removeClass("display-block");
          $(".page9_btn_nxt").addClass("display-none");
          $(".page10_btn_nxt").removeClass("display-block");
          $(".page10_btn_nxt").addClass("display-none");

          $(".comp_th_ten input").attr("readonly",false);
          $(".disp_th_ten input").attr("readonly",false);
          $(".elec_th_ten input").attr("readonly",false);
          $(".comp_th_ten input").removeClass("readonlytxtbox");
          $(".disp_th_ten input").removeClass("readonlytxtbox");
          $(".elec_th_ten input").removeClass("readonlytxtbox");
        } 
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
    //$(".page10_btn").removeClass("display-none");
    //$(".page10_btn").addClass("display-block");
    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none");  
    $(".page10_btn").removeClass("display-block");
    $(".page10_btn").addClass("display-none");
    $(".page9_btn_nxt").removeClass("display-block");
    $(".page9_btn_nxt").addClass("display-none");
    $(".page10_btn_nxt").removeClass("display-none");
    $(".page10_btn_nxt").addClass("display-block");

    $(".comp_th_ten input").attr("readonly",true);
    $(".disp_th_ten input").attr("readonly",true);
    $(".elec_th_ten input").attr("readonly",true);
    $(".comp_th_ten input").addClass("readonlytxtbox");
    $(".disp_th_ten input").addClass("readonlytxtbox");
    $(".elec_th_ten input").addClass("readonlytxtbox");*/
    if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page10_btn").removeClass("display-block");
          $(".page10_btn").addClass("display-none");
          $(".page9_btn_nxt").removeClass("display-block");
          $(".page9_btn_nxt").addClass("display-none");
          $(".page10_btn_nxt").removeClass("display-none");
          $(".page10_btn_nxt").addClass("display-block");

          $(".comp_th_ten input").attr("readonly",true);
          $(".disp_th_ten input").attr("readonly",true);
          $(".elec_th_ten input").attr("readonly",true);
          $(".comp_th_ten input").addClass("readonlytxtbox");
          $(".disp_th_ten input").addClass("readonlytxtbox");
          $(".elec_th_ten input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page10_btn").removeClass("display-none");
          $(".page10_btn").addClass("display-block");
          $(".page9_btn_nxt").removeClass("display-block");
          $(".page9_btn_nxt").addClass("display-none");
          $(".page10_btn_nxt").removeClass("display-block");
          $(".page10_btn_nxt").addClass("display-none");

          $(".comp_th_ten input").attr("readonly",false);
          $(".disp_th_ten input").attr("readonly",false);
          $(".elec_th_ten input").attr("readonly",false);
          $(".comp_th_ten input").removeClass("readonlytxtbox");
          $(".disp_th_ten input").removeClass("readonlytxtbox");
          $(".elec_th_ten input").removeClass("readonlytxtbox");
        } 
  }
}
function col_ten(c_ten,disp_ten,elec_ten,c_eleven,disp_eleven,elec_eleven,current_time){
  console.log("TEN COL"+c_ten+"---disp_ten"+disp_ten+"-------elec_ten"+elec_ten+" c_eleven"+c_eleven+"----disp_eleven "+disp_eleven+"***** elec_eleven"+elec_eleven);
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_11").attr("readonly",false);
          $(".val_comp_11").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_11").attr("readonly",false);
          $(".lcv"+l+"_mfm_11").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_11").attr("readonly",false);
        $(".val_comp_11").removeClass("readonlytxtbox");
        $(".lcv3_mfm_11").attr("readonly",false);
        $(".lcv3_mfm_11").removeClass("readonlytxtbox");
        $(".lcv4_mfm_11").attr("readonly",false);
        $(".lcv4_mfm_11").removeClass("readonlytxtbox");
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
        //$(".page11_btn").removeClass("display-none");
        //$(".page11_btn").addClass("display-block");
        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page11_btn").removeClass("display-block");
        $(".page11_btn").addClass("display-none");
        $(".page10_btn_nxt").removeClass("display-block");
        $(".page10_btn_nxt").addClass("display-none");
        $(".page11_btn_nxt").removeClass("display-none");
        $(".page11_btn_nxt").addClass("display-block");

        $(".comp_th_eleven input").attr("readonly",true);
        $(".disp_th_eleven input").attr("readonly",true);
        $(".elec_th_eleven input").attr("readonly",true);
        $(".comp_th_eleven input").addClass("readonlytxtbox");
        $(".disp_th_eleven input").addClass("readonlytxtbox");
        $(".elec_th_eleven input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page11_btn").removeClass("display-block");
          $(".page11_btn").addClass("display-none");
          $(".page10_btn_nxt").removeClass("display-block");
          $(".page10_btn_nxt").addClass("display-none");
          $(".page11_btn_nxt").removeClass("display-none");
          $(".page11_btn_nxt").addClass("display-block");

          $(".comp_th_eleven input").attr("readonly",true);
          $(".disp_th_eleven input").attr("readonly",true);
          $(".elec_th_eleven input").attr("readonly",true);
          $(".comp_th_eleven input").addClass("readonlytxtbox");
          $(".disp_th_eleven input").addClass("readonlytxtbox");
          $(".elec_th_eleven input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page11_btn").removeClass("display-none");
          $(".page11_btn").addClass("display-block");
          $(".page10_btn_nxt").removeClass("display-block");
          $(".page10_btn_nxt").addClass("display-none");
          $(".page11_btn_nxt").removeClass("display-block");
          $(".page11_btn_nxt").addClass("display-none");

          $(".comp_th_eleven input").attr("readonly",false);
          $(".disp_th_eleven input").attr("readonly",false);
          $(".elec_th_eleven input").attr("readonly",false);
          $(".comp_th_eleven input").removeClass("readonlytxtbox");
          $(".disp_th_eleven input").removeClass("readonlytxtbox");
          $(".elec_th_eleven input").removeClass("readonlytxtbox");
        }
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
    //$(".page11_btn").removeClass("display-none");
    //$(".page11_btn").addClass("display-block");
    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none");  
    $(".page11_btn").removeClass("display-block");
    $(".page11_btn").addClass("display-none");
    $(".page10_btn_nxt").removeClass("display-block");
    $(".page10_btn_nxt").addClass("display-none");
    $(".page11_btn_nxt").removeClass("display-none");
    $(".page11_btn_nxt").addClass("display-block");

    $(".comp_th_eleven input").attr("readonly",true);
    $(".disp_th_eleven input").attr("readonly",true);
    $(".elec_th_eleven input").attr("readonly",true);
    $(".comp_th_eleven input").addClass("readonlytxtbox");
    $(".disp_th_eleven input").addClass("readonlytxtbox");
    $(".elec_th_eleven input").addClass("readonlytxtbox");*/

    if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page11_btn").removeClass("display-block");
          $(".page11_btn").addClass("display-none");
          $(".page10_btn_nxt").removeClass("display-block");
          $(".page10_btn_nxt").addClass("display-none");
          $(".page11_btn_nxt").removeClass("display-none");
          $(".page11_btn_nxt").addClass("display-block");

          $(".comp_th_eleven input").attr("readonly",true);
          $(".disp_th_eleven input").attr("readonly",true);
          $(".elec_th_eleven input").attr("readonly",true);
          $(".comp_th_eleven input").addClass("readonlytxtbox");
          $(".disp_th_eleven input").addClass("readonlytxtbox");
          $(".elec_th_eleven input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page11_btn").removeClass("display-none");
          $(".page11_btn").addClass("display-block");
          $(".page10_btn_nxt").removeClass("display-block");
          $(".page10_btn_nxt").addClass("display-none");
          $(".page11_btn_nxt").removeClass("display-block");
          $(".page11_btn_nxt").addClass("display-none");

          $(".comp_th_eleven input").attr("readonly",false);
          $(".disp_th_eleven input").attr("readonly",false);
          $(".elec_th_eleven input").attr("readonly",false);
          $(".comp_th_eleven input").removeClass("readonlytxtbox");
          $(".disp_th_eleven input").removeClass("readonlytxtbox");
          $(".elec_th_eleven input").removeClass("readonlytxtbox");
        }

  }
}
function col_eleven(c_eleven,disp_eleven,elec_eleven,c_twelve,disp_twelve,elec_twelve,current_time){
  console.log("ELEVEN COL"+c_eleven+"---disp_eleven"+disp_eleven+"-------elec_eleven"+elec_eleven+" c_twelve"+c_twelve+"----disp_twelve "+disp_twelve+"***** elec_twelve"+elec_twelve);
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_12").attr("readonly",false);
          $(".val_comp_12").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_12").attr("readonly",false);
          $(".lcv"+l+"_mfm_12").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_12").attr("readonly",false);
        $(".val_comp_12").removeClass("readonlytxtbox");
        $(".lcv3_mfm_12").attr("readonly",false);
        $(".lcv3_mfm_12").removeClass("readonlytxtbox");
        $(".lcv4_mfm_12").attr("readonly",false);
        $(".lcv4_mfm_12").removeClass("readonlytxtbox");
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
        //$(".page12_btn").removeClass("display-none");
        //$(".page12_btn").addClass("display-block");
        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page12_btn").removeClass("display-block");
        $(".page12_btn").addClass("display-none");
        $(".page11_btn_nxt").removeClass("display-block");
        $(".page11_btn_nxt").addClass("display-none");
        $(".page12_btn_nxt").removeClass("display-none");
        $(".page12_btn_nxt").addClass("display-block");

        $(".comp_th_twelve input").attr("readonly",true);
        $(".disp_th_twelve input").attr("readonly",true);
        $(".elec_th_twelve input").attr("readonly",true);
        $(".comp_th_twelve input").addClass("readonlytxtbox");
        $(".disp_th_twelve input").addClass("readonlytxtbox");
        $(".elec_th_twelve input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page12_btn").removeClass("display-block");
          $(".page12_btn").addClass("display-none");
          $(".page11_btn_nxt").removeClass("display-block");
          $(".page11_btn_nxt").addClass("display-none");
          $(".page12_btn_nxt").removeClass("display-none");
          $(".page12_btn_nxt").addClass("display-block");

          $(".comp_th_twelve input").attr("readonly",true);
          $(".disp_th_twelve input").attr("readonly",true);
          $(".elec_th_twelve input").attr("readonly",true);
          $(".comp_th_twelve input").addClass("readonlytxtbox");
          $(".disp_th_twelve input").addClass("readonlytxtbox");
          $(".elec_th_twelve input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page12_btn").removeClass("display-none");
          $(".page12_btn").addClass("display-block");
          $(".page11_btn_nxt").removeClass("display-block");
          $(".page11_btn_nxt").addClass("display-none");
          $(".page12_btn_nxt").removeClass("display-block");
          $(".page12_btn_nxt").addClass("display-none");

          $(".comp_th_twelve input").attr("readonly",false);
          $(".disp_th_twelve input").attr("readonly",false);
          $(".elec_th_twelve input").attr("readonly",false);
          $(".comp_th_twelve input").removeClass("readonlytxtbox");
          $(".disp_th_twelve input").removeClass("readonlytxtbox");
          $(".elec_th_twelve input").removeClass("readonlytxtbox");
        }
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
    //$(".page12_btn").removeClass("display-none");
    //$(".page12_btn").addClass("display-block");
    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none");  
    $(".page12_btn").removeClass("display-block");
    $(".page12_btn").addClass("display-none");
    $(".page11_btn_nxt").removeClass("display-block");
    $(".page11_btn_nxt").addClass("display-none");
    $(".page12_btn_nxt").removeClass("display-none");
    $(".page12_btn_nxt").addClass("display-block");

    $(".comp_th_twelve input").attr("readonly",true);
    $(".disp_th_twelve input").attr("readonly",true);
    $(".elec_th_twelve input").attr("readonly",true);
    $(".comp_th_twelve input").addClass("readonlytxtbox");
    $(".disp_th_twelve input").addClass("readonlytxtbox");
    $(".elec_th_twelve input").addClass("readonlytxtbox");*/

    if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page12_btn").removeClass("display-block");
          $(".page12_btn").addClass("display-none");
          $(".page11_btn_nxt").removeClass("display-block");
          $(".page11_btn_nxt").addClass("display-none");
          $(".page12_btn_nxt").removeClass("display-none");
          $(".page12_btn_nxt").addClass("display-block");

          $(".comp_th_twelve input").attr("readonly",true);
          $(".disp_th_twelve input").attr("readonly",true);
          $(".elec_th_twelve input").attr("readonly",true);
          $(".comp_th_twelve input").addClass("readonlytxtbox");
          $(".disp_th_twelve input").addClass("readonlytxtbox");
          $(".elec_th_twelve input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page12_btn").removeClass("display-none");
          $(".page12_btn").addClass("display-block");
          $(".page11_btn_nxt").removeClass("display-block");
          $(".page11_btn_nxt").addClass("display-none");
          $(".page12_btn_nxt").removeClass("display-block");
          $(".page12_btn_nxt").addClass("display-none");

          $(".comp_th_twelve input").attr("readonly",false);
          $(".disp_th_twelve input").attr("readonly",false);
          $(".elec_th_twelve input").attr("readonly",false);
          $(".comp_th_twelve input").removeClass("readonlytxtbox");
          $(".disp_th_twelve input").removeClass("readonlytxtbox");
          $(".elec_th_twelve input").removeClass("readonlytxtbox");
        }

  }
}
function col_twelve(c_twelve,disp_twelve,elec_twelve,c_thirteen,disp_thirteen,elec_thirteen,current_time){
  console.log("TWELVE COL"+c_twelve+"---disp_twelve"+disp_twelve+"-------elec_twelve"+elec_twelve+" c_thirteen"+c_thirteen+"----disp_thirteen "+disp_thirteen+"***** elec_thirteen"+elec_thirteen);
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_13").attr("readonly",false);
          $(".val_comp_13").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_13").attr("readonly",false);
          $(".lcv"+l+"_mfm_13").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_13").attr("readonly",false);
        $(".val_comp_13").removeClass("readonlytxtbox");
        $(".lcv3_mfm_13").attr("readonly",false);
        $(".lcv3_mfm_13").removeClass("readonlytxtbox");
        $(".lcv4_mfm_13").attr("readonly",false);
        $(".lcv4_mfm_13").removeClass("readonlytxtbox");
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
        //$(".page13_btn").removeClass("display-none");
        //$(".page13_btn").addClass("display-block");
        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page13_btn").removeClass("display-block");
        $(".page13_btn").addClass("display-none");
        $(".page12_btn_nxt").removeClass("display-block");
        $(".page12_btn_nxt").addClass("display-none");
        $(".page13_btn_nxt").removeClass("display-none");
        $(".page13_btn_nxt").addClass("display-block");

        $(".comp_th_thirteen input").attr("readonly",true);
        $(".disp_th_thirteen input").attr("readonly",true);
        $(".elec_th_thirteen input").attr("readonly",true);
        $(".comp_th_thirteen input").addClass("readonlytxtbox");
        $(".disp_th_thirteen input").addClass("readonlytxtbox");
        $(".elec_th_thirteen input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page13_btn").removeClass("display-block");
          $(".page13_btn").addClass("display-none");
          $(".page12_btn_nxt").removeClass("display-block");
          $(".page12_btn_nxt").addClass("display-none");
          $(".page13_btn_nxt").removeClass("display-none");
          $(".page13_btn_nxt").addClass("display-block");

          $(".comp_th_thirteen input").attr("readonly",true);
          $(".disp_th_thirteen input").attr("readonly",true);
          $(".elec_th_thirteen input").attr("readonly",true);
          $(".comp_th_thirteen input").addClass("readonlytxtbox");
          $(".disp_th_thirteen input").addClass("readonlytxtbox");
          $(".elec_th_thirteen input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page13_btn").removeClass("display-none");
          $(".page13_btn").addClass("display-block");
          $(".page12_btn_nxt").removeClass("display-block");
          $(".page12_btn_nxt").addClass("display-none");
          $(".page13_btn_nxt").removeClass("display-block");
          $(".page13_btn_nxt").addClass("display-none");

          $(".comp_th_thirteen input").attr("readonly",false);
          $(".disp_th_thirteen input").attr("readonly",false);
          $(".elec_th_thirteen input").attr("readonly",false);
          $(".comp_th_thirteen input").removeClass("readonlytxtbox");
          $(".disp_th_thirteen input").removeClass("readonlytxtbox");
          $(".elec_th_thirteen input").removeClass("readonlytxtbox");
        }
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
    //$(".page13_btn").removeClass("display-none");
    //$(".page13_btn").addClass("display-block");
    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none");  
    $(".page13_btn").removeClass("display-block");
    $(".page13_btn").addClass("display-none");
    $(".page12_btn_nxt").removeClass("display-block");
    $(".page12_btn_nxt").addClass("display-none");
    $(".page13_btn_nxt").removeClass("display-none");
    $(".page13_btn_nxt").addClass("display-block");

    $(".comp_th_thirteen input").attr("readonly",true);
    $(".disp_th_thirteen input").attr("readonly",true);
    $(".elec_th_thirteen input").attr("readonly",true);
    $(".comp_th_thirteen input").addClass("readonlytxtbox");
    $(".disp_th_thirteen input").addClass("readonlytxtbox");
    $(".elec_th_thirteen input").addClass("readonlytxtbox");*/
    if(sess_designation!='SGL EIC'){
      $(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");  
      $(".page13_btn").removeClass("display-block");
      $(".page13_btn").addClass("display-none");
      $(".page12_btn_nxt").removeClass("display-block");
      $(".page12_btn_nxt").addClass("display-none");
      $(".page13_btn_nxt").removeClass("display-none");
      $(".page13_btn_nxt").addClass("display-block");

      $(".comp_th_thirteen input").attr("readonly",true);
      $(".disp_th_thirteen input").attr("readonly",true);
      $(".elec_th_thirteen input").attr("readonly",true);
      $(".comp_th_thirteen input").addClass("readonlytxtbox");
      $(".disp_th_thirteen input").addClass("readonlytxtbox");
      $(".elec_th_thirteen input").addClass("readonlytxtbox");
    }else{
      $(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");  
      $(".page13_btn").removeClass("display-none");
      $(".page13_btn").addClass("display-block");
      $(".page12_btn_nxt").removeClass("display-block");
      $(".page12_btn_nxt").addClass("display-none");
      $(".page13_btn_nxt").removeClass("display-block");
      $(".page13_btn_nxt").addClass("display-none");

      $(".comp_th_thirteen input").attr("readonly",false);
      $(".disp_th_thirteen input").attr("readonly",false);
      $(".elec_th_thirteen input").attr("readonly",false);
      $(".comp_th_thirteen input").removeClass("readonlytxtbox");
      $(".disp_th_thirteen input").removeClass("readonlytxtbox");
      $(".elec_th_thirteen input").removeClass("readonlytxtbox");
    }
  }
}
function col_thirteen(c_thirteen,disp_thirteen,elec_thirteen,c_fourteen,disp_fourteen,elec_fourteen,current_time){
  console.log("THIRTEEN COL"+c_thirteen+"---disp_thirteen"+disp_thirteen+"-------elec_thirteen"+elec_thirteen+" c_fourteen"+c_fourteen+"----disp_fourteen "+disp_fourteen+"***** elec_fourteen"+elec_fourteen);
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_14").attr("readonly",false);
          $(".val_comp_14").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_14").attr("readonly",false);
          $(".lcv"+l+"_mfm_14").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_14").attr("readonly",false);
        $(".val_comp_14").removeClass("readonlytxtbox");
        $(".lcv3_mfm_14").attr("readonly",false);
        $(".lcv3_mfm_14").removeClass("readonlytxtbox");
        $(".lcv4_mfm_14").attr("readonly",false);
        $(".lcv4_mfm_14").removeClass("readonlytxtbox");

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
        //$(".page14_btn").removeClass("display-none");
        //$(".page14_btn").addClass("display-block");
        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page14_btn").removeClass("display-block");
        $(".page14_btn").addClass("display-none");
        $(".page13_btn_nxt").removeClass("display-block");
        $(".page13_btn_nxt").addClass("display-none");
        $(".page14_btn_nxt").removeClass("display-none");
        $(".page14_btn_nxt").addClass("display-block");

        $(".comp_th_fourteen input").attr("readonly",true);
        $(".disp_th_fourteen input").attr("readonly",true);
        $(".elec_th_fourteen input").attr("readonly",true);
        $(".comp_th_fourteen input").addClass("readonlytxtbox");
        $(".disp_th_fourteen input").addClass("readonlytxtbox");
        $(".elec_th_fourteen input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page14_btn").removeClass("display-block");
          $(".page14_btn").addClass("display-none");
          $(".page13_btn_nxt").removeClass("display-block");
          $(".page13_btn_nxt").addClass("display-none");
          $(".page14_btn_nxt").removeClass("display-none");
          $(".page14_btn_nxt").addClass("display-block");

          $(".comp_th_fourteen input").attr("readonly",true);
          $(".disp_th_fourteen input").attr("readonly",true);
          $(".elec_th_fourteen input").attr("readonly",true);
          $(".comp_th_fourteen input").addClass("readonlytxtbox");
          $(".disp_th_fourteen input").addClass("readonlytxtbox");
          $(".elec_th_fourteen input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page14_btn").removeClass("display-none");
          $(".page14_btn").addClass("display-block");
          $(".page13_btn_nxt").removeClass("display-block");
          $(".page13_btn_nxt").addClass("display-none");
          $(".page14_btn_nxt").removeClass("display-block");
          $(".page14_btn_nxt").addClass("display-none");

          $(".comp_th_fourteen input").attr("readonly",false);
          $(".disp_th_fourteen input").attr("readonly",false);
          $(".elec_th_fourteen input").attr("readonly",false);
          $(".comp_th_fourteen input").removeClass("readonlytxtbox");
          $(".disp_th_fourteen input").removeClass("readonlytxtbox");
          $(".elec_th_fourteen input").removeClass("readonlytxtbox");
        }
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
    //$(".page14_btn").removeClass("display-none");
    //$(".page14_btn").addClass("display-block");
    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none");  
    $(".page14_btn").removeClass("display-block");
    $(".page14_btn").addClass("display-none");
    $(".page13_btn_nxt").removeClass("display-block");
    $(".page13_btn_nxt").addClass("display-none");
    $(".page14_btn_nxt").removeClass("display-none");
    $(".page14_btn_nxt").addClass("display-block");

    $(".comp_th_fourteen input").attr("readonly",true);
    $(".disp_th_fourteen input").attr("readonly",true);
    $(".elec_th_fourteen input").attr("readonly",true);
    $(".comp_th_fourteen input").addClass("readonlytxtbox");
    $(".disp_th_fourteen input").addClass("readonlytxtbox");
    $(".elec_th_fourteen input").addClass("readonlytxtbox");*/

    if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page14_btn").removeClass("display-block");
          $(".page14_btn").addClass("display-none");
          $(".page13_btn_nxt").removeClass("display-block");
          $(".page13_btn_nxt").addClass("display-none");
          $(".page14_btn_nxt").removeClass("display-none");
          $(".page14_btn_nxt").addClass("display-block");

          $(".comp_th_fourteen input").attr("readonly",true);
          $(".disp_th_fourteen input").attr("readonly",true);
          $(".elec_th_fourteen input").attr("readonly",true);
          $(".comp_th_fourteen input").addClass("readonlytxtbox");
          $(".disp_th_fourteen input").addClass("readonlytxtbox");
          $(".elec_th_fourteen input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page14_btn").removeClass("display-none");
          $(".page14_btn").addClass("display-block");
          $(".page13_btn_nxt").removeClass("display-block");
          $(".page13_btn_nxt").addClass("display-none");
          $(".page14_btn_nxt").removeClass("display-block");
          $(".page14_btn_nxt").addClass("display-none");

          $(".comp_th_fourteen input").attr("readonly",false);
          $(".disp_th_fourteen input").attr("readonly",false);
          $(".elec_th_fourteen input").attr("readonly",false);
          $(".comp_th_fourteen input").removeClass("readonlytxtbox");
          $(".disp_th_fourteen input").removeClass("readonlytxtbox");
          $(".elec_th_fourteen input").removeClass("readonlytxtbox");
        }

  }
}
function col_fourteen(c_fourteen,disp_fourteen,elec_fourteen,c_fifteen,disp_fifteen,elec_fifteen,current_time){
  console.log("FOURTEEN COL"+c_fourteen+"---disp_fourteen"+disp_fourteen+"-------elec_fourteen"+elec_fourteen+" c_fifteen"+c_fifteen+"----disp_fifteen "+disp_fifteen+"***** elec_fifteen"+elec_fifteen);
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_15").attr("readonly",false);
          $(".val_comp_15").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_15").attr("readonly",false);
          $(".lcv"+l+"_mfm_15").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_15").attr("readonly",false);
        $(".val_comp_15").removeClass("readonlytxtbox");
        $(".lcv3_mfm_15").attr("readonly",false);
        $(".lcv3_mfm_15").removeClass("readonlytxtbox");
        $(".lcv4_mfm_15").attr("readonly",false);
        $(".lcv4_mfm_15").removeClass("readonlytxtbox");
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
        //$(".page15_btn").removeClass("display-none");
        //$(".page15_btn").addClass("display-block");
        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page15_btn").removeClass("display-block");
        $(".page15_btn").addClass("display-none");
        $(".page14_btn_nxt").removeClass("display-block");
        $(".page14_btn_nxt").addClass("display-none");
        $(".page15_btn_nxt").removeClass("display-none");
        $(".page15_btn_nxt").addClass("display-block");

        $(".comp_th_fifteen input").attr("readonly",true);
        $(".disp_th_fifteen input").attr("readonly",true);
        $(".elec_th_fifteen input").attr("readonly",true);
        $(".comp_th_fifteen input").addClass("readonlytxtbox");
        $(".disp_th_fifteen input").addClass("readonlytxtbox");
        $(".elec_th_fifteen input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page15_btn").removeClass("display-block");
          $(".page15_btn").addClass("display-none");
          $(".page14_btn_nxt").removeClass("display-block");
          $(".page14_btn_nxt").addClass("display-none");
          $(".page15_btn_nxt").removeClass("display-none");
          $(".page15_btn_nxt").addClass("display-block");

          $(".comp_th_fifteen input").attr("readonly",true);
          $(".disp_th_fifteen input").attr("readonly",true);
          $(".elec_th_fifteen input").attr("readonly",true);
          $(".comp_th_fifteen input").addClass("readonlytxtbox");
          $(".disp_th_fifteen input").addClass("readonlytxtbox");
          $(".elec_th_fifteen input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page15_btn").removeClass("display-none");
          $(".page15_btn").addClass("display-block");
          $(".page14_btn_nxt").removeClass("display-block");
          $(".page14_btn_nxt").addClass("display-none");
          $(".page15_btn_nxt").removeClass("display-block");
          $(".page15_btn_nxt").addClass("display-none");

          $(".comp_th_fifteen input").attr("readonly",false);
          $(".disp_th_fifteen input").attr("readonly",false);
          $(".elec_th_fifteen input").attr("readonly",false);
          $(".comp_th_fifteen input").removeClass("readonlytxtbox");
          $(".disp_th_fifteen input").removeClass("readonlytxtbox");
          $(".elec_th_fifteen input").removeClass("readonlytxtbox");
        }
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
    //$(".page15_btn").removeClass("display-none");
    //$(".page15_btn").addClass("display-block");
    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none");  
    $(".page15_btn").removeClass("display-block");
    $(".page15_btn").addClass("display-none");
    $(".page14_btn_nxt").removeClass("display-block");
    $(".page14_btn_nxt").addClass("display-none");
    $(".page15_btn_nxt").removeClass("display-none");
    $(".page15_btn_nxt").addClass("display-block");

    $(".comp_th_fifteen input").attr("readonly",true);
    $(".disp_th_fifteen input").attr("readonly",true);
    $(".elec_th_fifteen input").attr("readonly",true);
    $(".comp_th_fifteen input").addClass("readonlytxtbox");
    $(".disp_th_fifteen input").addClass("readonlytxtbox");
    $(".elec_th_fifteen input").addClass("readonlytxtbox");*/
    if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page15_btn").removeClass("display-block");
          $(".page15_btn").addClass("display-none");
          $(".page14_btn_nxt").removeClass("display-block");
          $(".page14_btn_nxt").addClass("display-none");
          $(".page15_btn_nxt").removeClass("display-none");
          $(".page15_btn_nxt").addClass("display-block");

          $(".comp_th_fifteen input").attr("readonly",true);
          $(".disp_th_fifteen input").attr("readonly",true);
          $(".elec_th_fifteen input").attr("readonly",true);
          $(".comp_th_fifteen input").addClass("readonlytxtbox");
          $(".disp_th_fifteen input").addClass("readonlytxtbox");
          $(".elec_th_fifteen input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page15_btn").removeClass("display-none");
          $(".page15_btn").addClass("display-block");
          $(".page14_btn_nxt").removeClass("display-block");
          $(".page14_btn_nxt").addClass("display-none");
          $(".page15_btn_nxt").removeClass("display-block");
          $(".page15_btn_nxt").addClass("display-none");

          $(".comp_th_fifteen input").attr("readonly",false);
          $(".disp_th_fifteen input").attr("readonly",false);
          $(".elec_th_fifteen input").attr("readonly",false);
          $(".comp_th_fifteen input").removeClass("readonlytxtbox");
          $(".disp_th_fifteen input").removeClass("readonlytxtbox");
          $(".elec_th_fifteen input").removeClass("readonlytxtbox");
        }
  }
}
function col_fifteen(c_fifteen,disp_fifteen,elec_fifteen,c_sixteen,disp_sixteen,elec_sixteen,current_time){
  console.log("FIFTEEN COL"+c_fifteen+"---disp_fifteen"+disp_fifteen+"-------elec_fifteen"+elec_fifteen+" c_sixteen"+c_sixteen+"----disp_sixteen "+disp_sixteen+"***** elec_sixteen"+elec_sixteen);

  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_16").attr("readonly",false);
          $(".val_comp_16").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_16").attr("readonly",false);
          $(".lcv"+l+"_mfm_16").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_16").attr("readonly",false);
        $(".val_comp_16").removeClass("readonlytxtbox");
        $(".lcv3_mfm_16").attr("readonly",false);
        $(".lcv3_mfm_16").removeClass("readonlytxtbox");
        $(".lcv4_mfm_16").attr("readonly",false);
        $(".lcv4_mfm_16").removeClass("readonlytxtbox");

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
        //$(".page16_btn").removeClass("display-none");
        //$(".page16_btn").addClass("display-block");

        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page16_btn").removeClass("display-block");
        $(".page16_btn").addClass("display-none");
        $(".page15_btn_nxt").removeClass("display-block");
        $(".page15_btn_nxt").addClass("display-none");
        $(".page16_btn_nxt").removeClass("display-none");
        $(".page16_btn_nxt").addClass("display-block");


        $(".comp_th_sixteen input").attr("readonly",true);
        $(".disp_th_sixteen input").attr("readonly",true);
        $(".elec_th_sixteen input").attr("readonly",true);
        $(".comp_th_sixteen input").addClass("readonlytxtbox");
        $(".disp_th_sixteen input").addClass("readonlytxtbox");
        $(".elec_th_sixteen input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page16_btn").removeClass("display-block");
          $(".page16_btn").addClass("display-none");
          $(".page15_btn_nxt").removeClass("display-block");
          $(".page15_btn_nxt").addClass("display-none");
          $(".page16_btn_nxt").removeClass("display-none");
          $(".page16_btn_nxt").addClass("display-block");


          $(".comp_th_sixteen input").attr("readonly",true);
          $(".disp_th_sixteen input").attr("readonly",true);
          $(".elec_th_sixteen input").attr("readonly",true);
          $(".comp_th_sixteen input").addClass("readonlytxtbox");
          $(".disp_th_sixteen input").addClass("readonlytxtbox");
          $(".elec_th_sixteen input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          /*$(".page16_btn").removeClass("display-none");
          $(".page16_btn").addClass("display-block");
          $(".page15_btn_nxt").removeClass("display-block");
          $(".page15_btn_nxt").addClass("display-none");
          $(".page16_btn_nxt").removeClass("display-none");
          $(".page16_btn_nxt").addClass("display-block");*/
          $(".page16_btn").removeClass("display-none");
          $(".page16_btn").addClass("display-block");
          $(".page15_btn_nxt").removeClass("display-block");
          $(".page15_btn_nxt").addClass("display-none");
          $(".page16_btn_nxt").removeClass("display-block");
          $(".page16_btn_nxt").addClass("display-none");

          $(".comp_th_sixteen input").attr("readonly",false);
          $(".disp_th_sixteen input").attr("readonly",false);
          $(".elec_th_sixteen input").attr("readonly",false);
          $(".comp_th_sixteen input").removeClass("readonlytxtbox");
          $(".disp_th_sixteen input").removeClass("readonlytxtbox");
          $(".elec_th_sixteen input").removeClass("readonlytxtbox");
        } 
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
    //$(".page16_btn").removeClass("display-none");
    //$(".page16_btn").addClass("display-block");

    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none");  
    $(".page16_btn").removeClass("display-block");
    $(".page16_btn").addClass("display-none");
    $(".page15_btn_nxt").removeClass("display-block");
    $(".page15_btn_nxt").addClass("display-none");
    $(".page16_btn_nxt").removeClass("display-none");
    $(".page16_btn_nxt").addClass("display-block");


    $(".comp_th_sixteen input").attr("readonly",true);
    $(".disp_th_sixteen input").attr("readonly",true);
    $(".elec_th_sixteen input").attr("readonly",true);
    $(".comp_th_sixteen input").addClass("readonlytxtbox");
    $(".disp_th_sixteen input").addClass("readonlytxtbox");
    $(".elec_th_sixteen input").addClass("readonlytxtbox");*/
    if(sess_designation!='SGL EIC'){
      $(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");  
      $(".page16_btn").removeClass("display-block");
      $(".page16_btn").addClass("display-none");
      $(".page15_btn_nxt").removeClass("display-block");
      $(".page15_btn_nxt").addClass("display-none");
      $(".page16_btn_nxt").removeClass("display-none");
      $(".page16_btn_nxt").addClass("display-block");


      $(".comp_th_sixteen input").attr("readonly",true);
      $(".disp_th_sixteen input").attr("readonly",true);
      $(".elec_th_sixteen input").attr("readonly",true);
      $(".comp_th_sixteen input").addClass("readonlytxtbox");
      $(".disp_th_sixteen input").addClass("readonlytxtbox");
      $(".elec_th_sixteen input").addClass("readonlytxtbox");
    }else{
      $(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");  
      /*$(".page16_btn").removeClass("display-none");
      $(".page16_btn").addClass("display-block");
      $(".page15_btn_nxt").removeClass("display-block");
      $(".page15_btn_nxt").addClass("display-none");
      $(".page16_btn_nxt").removeClass("display-none");
      $(".page16_btn_nxt").addClass("display-block");*/
      $(".page16_btn").removeClass("display-none");
      $(".page16_btn").addClass("display-block");
      $(".page15_btn_nxt").removeClass("display-block");
      $(".page15_btn_nxt").addClass("display-none");
      $(".page16_btn_nxt").removeClass("display-block");
      $(".page16_btn_nxt").addClass("display-none");


      $(".comp_th_sixteen input").attr("readonly",false);
      $(".disp_th_sixteen input").attr("readonly",false);
      $(".elec_th_sixteen input").attr("readonly",false);
      $(".comp_th_sixteen input").removeClass("readonlytxtbox");
      $(".disp_th_sixteen input").removeClass("readonlytxtbox");
      $(".elec_th_sixteen input").removeClass("readonlytxtbox");
    } 
  }
}
function col_sixteen(c_sixteen,disp_sixteen,elec_sixteen,c_seventeen,disp_seventeen,elec_seventeen,current_time){
  console.log("SIXTEEN COL"+c_sixteen+"---disp_sixteen"+disp_sixteen+"-------elec_sixteen"+elec_sixteen+" c_seventeen"+c_seventeen+"----disp_seventeen "+disp_seventeen+"***** elec_seventeen"+elec_seventeen);
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_17").attr("readonly",false);
          $(".val_comp_17").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_17").attr("readonly",false);
          $(".lcv"+l+"_mfm_17").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_17").attr("readonly",false);
        $(".val_comp_17").removeClass("readonlytxtbox");
        $(".lcv3_mfm_17").attr("readonly",false);
        $(".lcv3_mfm_17").removeClass("readonlytxtbox");
        $(".lcv4_mfm_17").attr("readonly",false);
        $(".lcv4_mfm_17").removeClass("readonlytxtbox");
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
        //$(".page17_btn").removeClass("display-none");
        //$(".page17_btn").addClass("display-block");
        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page17_btn").removeClass("display-block");
        $(".page17_btn").addClass("display-none");
        $(".page16_btn_nxt").removeClass("display-block");
        $(".page16_btn_nxt").addClass("display-none");
        $(".page17_btn_nxt").removeClass("display-none");
        $(".page17_btn_nxt").addClass("display-block");

        $(".comp_th_seventeen input").attr("readonly",true);
        $(".disp_th_seventeen input").attr("readonly",true);
        $(".elec_th_seventeen input").attr("readonly",true);
        $(".comp_th_seventeen input").addClass("readonlytxtbox");
        $(".disp_th_seventeen input").addClass("readonlytxtbox");
        $(".elec_th_seventeen input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page17_btn").removeClass("display-block");
          $(".page17_btn").addClass("display-none");
          $(".page16_btn_nxt").removeClass("display-block");
          $(".page16_btn_nxt").addClass("display-none");
          $(".page17_btn_nxt").removeClass("display-none");
          $(".page17_btn_nxt").addClass("display-block");

          $(".comp_th_seventeen input").attr("readonly",true);
          $(".disp_th_seventeen input").attr("readonly",true);
          $(".elec_th_seventeen input").attr("readonly",true);
          $(".comp_th_seventeen input").addClass("readonlytxtbox");
          $(".disp_th_seventeen input").addClass("readonlytxtbox");
          $(".elec_th_seventeen input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page17_btn").removeClass("display-none");
          $(".page17_btn").addClass("display-block");
          $(".page16_btn_nxt").removeClass("display-block");
          $(".page16_btn_nxt").addClass("display-none");
          $(".page17_btn_nxt").removeClass("display-block");
          $(".page17_btn_nxt").addClass("display-none");

          $(".comp_th_seventeen input").attr("readonly",false);
          $(".disp_th_seventeen input").attr("readonly",false);
          $(".elec_th_seventeen input").attr("readonly",false);
          $(".comp_th_seventeen input").removeClass("readonlytxtbox");
          $(".disp_th_seventeen input").removeClass("readonlytxtbox");
          $(".elec_th_seventeen input").removeClass("readonlytxtbox");
        }
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
    //$(".page17_btn").removeClass("display-none");
    //$(".page17_btn").addClass("display-block");

    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none");  
    $(".page17_btn").removeClass("display-block");
    $(".page17_btn").addClass("display-none");
    $(".page16_btn_nxt").removeClass("display-block");
    $(".page16_btn_nxt").addClass("display-none");
    $(".page17_btn_nxt").removeClass("display-none");
    $(".page17_btn_nxt").addClass("display-block");


    $(".comp_th_seventeen input").attr("readonly",true);
    $(".disp_th_seventeen input").attr("readonly",true);
    $(".elec_th_seventeen input").attr("readonly",true);
    $(".comp_th_seventeen input").addClass("readonlytxtbox");
    $(".disp_th_seventeen input").addClass("readonlytxtbox");
    $(".elec_th_seventeen input").addClass("readonlytxtbox");*/
    if(sess_designation!='SGL EIC'){
      $(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");  
      $(".page17_btn").removeClass("display-block");
      $(".page17_btn").addClass("display-none");
      $(".page16_btn_nxt").removeClass("display-block");
      $(".page16_btn_nxt").addClass("display-none");
      $(".page17_btn_nxt").removeClass("display-none");
      $(".page17_btn_nxt").addClass("display-block");

      $(".comp_th_seventeen input").attr("readonly",true);
      $(".disp_th_seventeen input").attr("readonly",true);
      $(".elec_th_seventeen input").attr("readonly",true);
      $(".comp_th_seventeen input").addClass("readonlytxtbox");
      $(".disp_th_seventeen input").addClass("readonlytxtbox");
      $(".elec_th_seventeen input").addClass("readonlytxtbox");
    }else{
      $(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");  
      $(".page17_btn").removeClass("display-none");
      $(".page17_btn").addClass("display-block");
      $(".page16_btn_nxt").removeClass("display-block");
      $(".page16_btn_nxt").addClass("display-none");
      $(".page17_btn_nxt").removeClass("display-block");
      $(".page17_btn_nxt").addClass("display-none");

      $(".comp_th_seventeen input").attr("readonly",false);
      $(".disp_th_seventeen input").attr("readonly",false);
      $(".elec_th_seventeen input").attr("readonly",false);
      $(".comp_th_seventeen input").removeClass("readonlytxtbox");
      $(".disp_th_seventeen input").removeClass("readonlytxtbox");
      $(".elec_th_seventeen input").removeClass("readonlytxtbox");
    }
  }
}
function col_seventeen(c_seventeen,disp_seventeen,elec_seventeen,c_eighteen,disp_eightteen,elec_eighteen,current_time){
  console.log("SEVENTEEN COL"+c_seventeen+"---disp_seventeen"+disp_seventeen+"-------elec_seventeen"+elec_seventeen+" c_eighteen"+c_eighteen+"----disp_eightteen "+disp_eightteen+"***** elec_eighteen"+elec_eighteen);
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_18").attr("readonly",false);
          $(".val_comp_18").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_18").attr("readonly",false);
          $(".lcv"+l+"_mfm_18").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_18").attr("readonly",false);
        $(".val_comp_18").removeClass("readonlytxtbox");
        $(".lcv3_mfm_18").attr("readonly",false);
        $(".lcv3_mfm_18").removeClass("readonlytxtbox");
        $(".lcv4_mfm_18").attr("readonly",false);
        $(".lcv4_mfm_18").removeClass("readonlytxtbox");
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
        //$(".page18_btn").removeClass("display-none");
        //$(".page18_btn").addClass("display-block");
        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page18_btn").removeClass("display-block");
        $(".page18_btn").addClass("display-none");
        $(".page17_btn_nxt").removeClass("display-block");
        $(".page17_btn_nxt").addClass("display-none");
        $(".page18_btn_nxt").removeClass("display-none");
        $(".page18_btn_nxt").addClass("display-block");

        $(".comp_th_eighteen input").attr("readonly",true);
        $(".disp_th_eighteen input").attr("readonly",true);
        $(".elec_th_eighteen input").attr("readonly",true);
        $(".comp_th_eighteen input").addClass("readonlytxtbox");
        $(".disp_th_eighteen input").addClass("readonlytxtbox");
        $(".elec_th_eighteen input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page18_btn").removeClass("display-block");
          $(".page18_btn").addClass("display-none");
          $(".page17_btn_nxt").removeClass("display-block");
          $(".page17_btn_nxt").addClass("display-none");
          $(".page18_btn_nxt").removeClass("display-none");
          $(".page18_btn_nxt").addClass("display-block");

          $(".comp_th_eighteen input").attr("readonly",true);
          $(".disp_th_eighteen input").attr("readonly",true);
          $(".elec_th_eighteen input").attr("readonly",true);
          $(".comp_th_eighteen input").addClass("readonlytxtbox");
          $(".disp_th_eighteen input").addClass("readonlytxtbox");
          $(".elec_th_eighteen input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page18_btn").removeClass("display-none");
          $(".page18_btn").addClass("display-block");
          $(".page17_btn_nxt").removeClass("display-block");
          $(".page17_btn_nxt").addClass("display-none");
          $(".page18_btn_nxt").removeClass("display-block");
          $(".page18_btn_nxt").addClass("display-none");

          $(".comp_th_eighteen input").attr("readonly",false);
          $(".disp_th_eighteen input").attr("readonly",false);
          $(".elec_th_eighteen input").attr("readonly",false);
          $(".comp_th_eighteen input").removeClass("readonlytxtbox");
          $(".disp_th_eighteen input").removeClass("readonlytxtbox");
          $(".elec_th_eighteen input").removeClass("readonlytxtbox");
        }
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
    //$(".page18_btn").removeClass("display-none");
    //$(".page18_btn").addClass("display-block");
    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none");  
    $(".page18_btn").removeClass("display-block");
    $(".page18_btn").addClass("display-none");
    $(".page17_btn_nxt").removeClass("display-block");
    $(".page17_btn_nxt").addClass("display-none");
    $(".page18_btn_nxt").removeClass("display-none");
    $(".page18_btn_nxt").addClass("display-block");

    $(".comp_th_eighteen input").attr("readonly",true);
    $(".disp_th_eighteen input").attr("readonly",true);
    $(".elec_th_eighteen input").attr("readonly",true);
    $(".comp_th_eighteen input").addClass("readonlytxtbox");
    $(".disp_th_eighteen input").addClass("readonlytxtbox");
    $(".elec_th_eighteen input").addClass("readonlytxtbox");*/
    if(sess_designation!='SGL EIC'){
      $(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");  
      $(".page18_btn").removeClass("display-block");
      $(".page18_btn").addClass("display-none");
      $(".page17_btn_nxt").removeClass("display-block");
      $(".page17_btn_nxt").addClass("display-none");
      $(".page18_btn_nxt").removeClass("display-none");
      $(".page18_btn_nxt").addClass("display-block");

      $(".comp_th_eighteen input").attr("readonly",true);
      $(".disp_th_eighteen input").attr("readonly",true);
      $(".elec_th_eighteen input").attr("readonly",true);
      $(".comp_th_eighteen input").addClass("readonlytxtbox");
      $(".disp_th_eighteen input").addClass("readonlytxtbox");
      $(".elec_th_eighteen input").addClass("readonlytxtbox");
    }else{
      $(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");  
      $(".page18_btn").removeClass("display-none");
      $(".page18_btn").addClass("display-block");
      $(".page17_btn_nxt").removeClass("display-block");
      $(".page17_btn_nxt").addClass("display-none");
      $(".page18_btn_nxt").removeClass("display-block");
      $(".page18_btn_nxt").addClass("display-none");

      $(".comp_th_eighteen input").attr("readonly",false);
      $(".disp_th_eighteen input").attr("readonly",false);
      $(".elec_th_eighteen input").attr("readonly",false);
      $(".comp_th_eighteen input").removeClass("readonlytxtbox");
      $(".disp_th_eighteen input").removeClass("readonlytxtbox");
      $(".elec_th_eighteen input").removeClass("readonlytxtbox");
    }
  }
}
function col_eightteen(c_eighteen,disp_eightteen,elec_eighteen,c_nineteen,disp_nineteen,elec_nineteen,current_time){
  console.log("EIGHTTEEN COL"+c_eighteen+"---disp_eightteen"+disp_eightteen+"-------elec_eighteen"+elec_eighteen+" c_nineteen"+c_nineteen+"----disp_nineteen "+disp_nineteen+"***** elec_nineteen"+elec_nineteen);
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_19").attr("readonly",false);
          $(".val_comp_19").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_19").attr("readonly",false);
          $(".lcv"+l+"_mfm_19").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_19").attr("readonly",false);
        $(".val_comp_19").removeClass("readonlytxtbox");
        $(".lcv3_mfm_19").attr("readonly",false);
        $(".lcv3_mfm_19").removeClass("readonlytxtbox");
        $(".lcv4_mfm_19").attr("readonly",false);
        $(".lcv4_mfm_19").removeClass("readonlytxtbox");
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
        //$(".page19_btn").removeClass("display-none");
        //$(".page19_btn").addClass("display-block");

        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page19_btn").removeClass("display-block");
        $(".page19_btn").addClass("display-none");
        $(".page18_btn_nxt").removeClass("display-block");
        $(".page18_btn_nxt").addClass("display-none");
        $(".page19_btn_nxt").removeClass("display-none");
        $(".page19_btn_nxt").addClass("display-block");


        $(".comp_th_nineteen input").attr("readonly",true);
        $(".disp_th_nineteen input").attr("readonly",true);
        $(".elec_th_nineteen input").attr("readonly",true);
        $(".comp_th_nineteen input").addClass("readonlytxtbox");
        $(".disp_th_nineteen input").addClass("readonlytxtbox");
        $(".elec_th_nineteen input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page19_btn").removeClass("display-block");
          $(".page19_btn").addClass("display-none");
          $(".page18_btn_nxt").removeClass("display-block");
          $(".page18_btn_nxt").addClass("display-none");
          $(".page19_btn_nxt").removeClass("display-none");
          $(".page19_btn_nxt").addClass("display-block");


          $(".comp_th_nineteen input").attr("readonly",true);
          $(".disp_th_nineteen input").attr("readonly",true);
          $(".elec_th_nineteen input").attr("readonly",true);
          $(".comp_th_nineteen input").addClass("readonlytxtbox");
          $(".disp_th_nineteen input").addClass("readonlytxtbox");
          $(".elec_th_nineteen input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page19_btn").removeClass("display-none");
          $(".page19_btn").addClass("display-block");
          $(".page18_btn_nxt").removeClass("display-block");
          $(".page18_btn_nxt").addClass("display-none");
          $(".page19_btn_nxt").removeClass("display-block");
          $(".page19_btn_nxt").addClass("display-none");


          $(".comp_th_nineteen input").attr("readonly",false);
          $(".disp_th_nineteen input").attr("readonly",false);
          $(".elec_th_nineteen input").attr("readonly",false);
          $(".comp_th_nineteen input").removeClass("readonlytxtbox");
          $(".disp_th_nineteen input").removeClass("readonlytxtbox");
          $(".elec_th_nineteen input").removeClass("readonlytxtbox");
        }
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
    //$(".page19_btn").removeClass("display-none");
    //$(".page19_btn").addClass("display-block");

    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none");  
    $(".page19_btn").removeClass("display-block");
    $(".page19_btn").addClass("display-none");
    $(".page18_btn_nxt").removeClass("display-block");
    $(".page18_btn_nxt").addClass("display-none");
    $(".page19_btn_nxt").removeClass("display-none");
    $(".page19_btn_nxt").addClass("display-block");


    $(".comp_th_nineteen input").attr("readonly",true);
    $(".disp_th_nineteen input").attr("readonly",true);
    $(".elec_th_nineteen input").attr("readonly",true);
    $(".comp_th_nineteen input").addClass("readonlytxtbox");
    $(".disp_th_nineteen input").addClass("readonlytxtbox");
    $(".elec_th_nineteen input").addClass("readonlytxtbox");*/

    if(sess_designation!='SGL EIC'){
      $(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");  
      $(".page19_btn").removeClass("display-block");
      $(".page19_btn").addClass("display-none");
      $(".page18_btn_nxt").removeClass("display-block");
      $(".page18_btn_nxt").addClass("display-none");
      $(".page19_btn_nxt").removeClass("display-none");
      $(".page19_btn_nxt").addClass("display-block");


      $(".comp_th_nineteen input").attr("readonly",true);
      $(".disp_th_nineteen input").attr("readonly",true);
      $(".elec_th_nineteen input").attr("readonly",true);
      $(".comp_th_nineteen input").addClass("readonlytxtbox");
      $(".disp_th_nineteen input").addClass("readonlytxtbox");
      $(".elec_th_nineteen input").addClass("readonlytxtbox");
    }else{
      $(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");  
      $(".page19_btn").removeClass("display-none");
      $(".page19_btn").addClass("display-block");
      $(".page18_btn_nxt").removeClass("display-block");
      $(".page18_btn_nxt").addClass("display-none");
      $(".page19_btn_nxt").removeClass("display-block");
      $(".page19_btn_nxt").addClass("display-none");


      $(".comp_th_nineteen input").attr("readonly",false);
      $(".disp_th_nineteen input").attr("readonly",false);
      $(".elec_th_nineteen input").attr("readonly",false);
      $(".comp_th_nineteen input").removeClass("readonlytxtbox");
      $(".disp_th_nineteen input").removeClass("readonlytxtbox");
      $(".elec_th_nineteen input").removeClass("readonlytxtbox");
    }
  }
}
function col_nineteen(c_nineteen,disp_nineteen,elec_nineteen,c_twenty,disp_twenty,elec_twenty,current_time){
  console.log("NINETEEN COL"+c_nineteen+"---disp_nineteen"+disp_nineteen+"-------elec_nineteen"+elec_nineteen+" c_twenty"+c_twenty+"----disp_twenty "+disp_twenty+"***** elec_twenty"+elec_twenty);
  var sess_designation = window.localStorage.getItem("sess_designation");
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

  //alert(g1+"-----"+g2);

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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_20").attr("readonly",false);
          $(".val_comp_20").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_20").attr("readonly",false);
          $(".lcv"+l+"_mfm_20").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_20").attr("readonly",false);
        $(".val_comp_20").removeClass("readonlytxtbox");
        $(".lcv3_mfm_20").attr("readonly",false);
        $(".lcv3_mfm_20").removeClass("readonlytxtbox");
        $(".lcv4_mfm_20").attr("readonly",false);
        $(".lcv4_mfm_20").removeClass("readonlytxtbox");
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
        //$(".page20_btn").removeClass("display-none");
        //$(".page20_btn").addClass("display-block");
        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page20_btn").removeClass("display-block");
        $(".page20_btn").addClass("display-none");
        $(".page19_btn_nxt").removeClass("display-block");
        $(".page19_btn_nxt").addClass("display-none");
        $(".page20_btn_nxt").removeClass("display-none");
        $(".page20_btn_nxt").addClass("display-block");

        $(".comp_th_twenty input").attr("readonly",true);
        $(".disp_th_twenty input").attr("readonly",true);
        $(".elec_th_twenty input").attr("readonly",true);
        $(".comp_th_twenty input").addClass("readonlytxtbox");
        $(".disp_th_twenty input").addClass("readonlytxtbox");
        $(".elec_th_twenty input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page20_btn").removeClass("display-block");
          $(".page20_btn").addClass("display-none");
          $(".page19_btn_nxt").removeClass("display-block");
          $(".page19_btn_nxt").addClass("display-none");
          $(".page20_btn_nxt").removeClass("display-none");
          $(".page20_btn_nxt").addClass("display-block");

          $(".comp_th_twenty input").attr("readonly",true);
          $(".disp_th_twenty input").attr("readonly",true);
          $(".elec_th_twenty input").attr("readonly",true);
          $(".comp_th_twenty input").addClass("readonlytxtbox");
          $(".disp_th_twenty input").addClass("readonlytxtbox");
          $(".elec_th_twenty input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page20_btn").removeClass("display-none");
          $(".page20_btn").addClass("display-block");
          $(".page19_btn_nxt").removeClass("display-block");
          $(".page19_btn_nxt").addClass("display-none");
          $(".page20_btn_nxt").removeClass("display-block");
          $(".page20_btn_nxt").addClass("display-none");

          $(".comp_th_twenty input").attr("readonly",false);
          $(".disp_th_twenty input").attr("readonly",false);
          $(".elec_th_twenty input").attr("readonly",false);
          $(".comp_th_twenty input").removeClass("readonlytxtbox");
          $(".disp_th_twenty input").removeClass("readonlytxtbox");
          $(".elec_th_twenty input").removeClass("readonlytxtbox");
        }
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
        
        //$(".page20_btn").removeClass("display-none");
        //$(".page20_btn").addClass("display-block");
        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page20_btn").removeClass("display-block");
        $(".page20_btn").addClass("display-none");
        $(".page19_btn_nxt").removeClass("display-block");
        $(".page19_btn_nxt").addClass("display-none");
        $(".page20_btn_nxt").removeClass("display-none");
        $(".page20_btn_nxt").addClass("display-block");

        $(".comp_th_twenty input").attr("readonly",true);
        $(".disp_th_twenty input").attr("readonly",true);
        $(".elec_th_twenty input").attr("readonly",true);
        $(".comp_th_twenty input").addClass("readonlytxtbox");
        $(".disp_th_twenty input").addClass("readonlytxtbox");
        $(".elec_th_twenty input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page20_btn").removeClass("display-block");
          $(".page20_btn").addClass("display-none");
          $(".page19_btn_nxt").removeClass("display-block");
          $(".page19_btn_nxt").addClass("display-none");
          $(".page20_btn_nxt").removeClass("display-none");
          $(".page20_btn_nxt").addClass("display-block");

          $(".comp_th_twenty input").attr("readonly",true);
          $(".disp_th_twenty input").attr("readonly",true);
          $(".elec_th_twenty input").attr("readonly",true);
          $(".comp_th_twenty input").addClass("readonlytxtbox");
          $(".disp_th_twenty input").addClass("readonlytxtbox");
          $(".elec_th_twenty input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page20_btn").removeClass("display-none");
          $(".page20_btn").addClass("display-block");
          $(".page19_btn_nxt").removeClass("display-block");
          $(".page19_btn_nxt").addClass("display-none");
          $(".page20_btn_nxt").removeClass("display-block");
          $(".page20_btn_nxt").addClass("display-none");

          $(".comp_th_twenty input").attr("readonly",false);
          $(".disp_th_twenty input").attr("readonly",false);
          $(".elec_th_twenty input").attr("readonly",false);
          $(".comp_th_twenty input").removeClass("readonlytxtbox");
          $(".disp_th_twenty input").removeClass("readonlytxtbox");
          $(".elec_th_twenty input").removeClass("readonlytxtbox");
        }
      }
}
function col_twenty(c_twenty,disp_twenty,elec_twenty,c_twentyone,disp_twentyone,elec_twentyone,current_time){
  console.log("TWENTY COL"+c_twenty+"---disp_twenty"+disp_twenty+"-------elec_twenty"+elec_twenty+" c_twentyone"+c_twentyone+"----disp_twentyone "+disp_twentyone+"***** elec_twentyone"+elec_twentyone);
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_21").attr("readonly",false);
          $(".val_comp_21").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_21").attr("readonly",false);
          $(".lcv"+l+"_mfm_21").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_21").attr("readonly",false);
        $(".val_comp_21").removeClass("readonlytxtbox");
        $(".lcv3_mfm_21").attr("readonly",false);
        $(".lcv3_mfm_21").removeClass("readonlytxtbox");
        $(".lcv4_mfm_21").attr("readonly",false);
        $(".lcv4_mfm_21").removeClass("readonlytxtbox");
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
        //$(".page21_btn").removeClass("display-none");
        //$(".page21_btn").addClass("display-block");
        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page21_btn").removeClass("display-block");
        $(".page21_btn").addClass("display-none");
        $(".page20_btn_nxt").removeClass("display-block");
        $(".page20_btn_nxt").addClass("display-none");
        $(".page21_btn_nxt").removeClass("display-none");
        $(".page21_btn_nxt").addClass("display-block");

        $(".comp_th_twentyone input").attr("readonly",true);
        $(".disp_th_twentyone input").attr("readonly",true);
        $(".elec_th_twentyone input").attr("readonly",true);
        $(".comp_th_twentyone input").addClass("readonlytxtbox");
        $(".disp_th_twentyone input").addClass("readonlytxtbox");
        $(".elec_th_twentyone input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page21_btn").removeClass("display-block");
          $(".page21_btn").addClass("display-none");
          $(".page20_btn_nxt").removeClass("display-block");
          $(".page20_btn_nxt").addClass("display-none");
          $(".page21_btn_nxt").removeClass("display-none");
          $(".page21_btn_nxt").addClass("display-block");

          $(".comp_th_twentyone input").attr("readonly",true);
          $(".disp_th_twentyone input").attr("readonly",true);
          $(".elec_th_twentyone input").attr("readonly",true);
          $(".comp_th_twentyone input").addClass("readonlytxtbox");
          $(".disp_th_twentyone input").addClass("readonlytxtbox");
          $(".elec_th_twentyone input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page21_btn").removeClass("display-none");
          $(".page21_btn").addClass("display-block");
          $(".page20_btn_nxt").removeClass("display-block");
          $(".page20_btn_nxt").addClass("display-none");
          $(".page21_btn_nxt").removeClass("display-block");
          $(".page21_btn_nxt").addClass("display-none");

          $(".comp_th_twentyone input").attr("readonly",false);
          $(".disp_th_twentyone input").attr("readonly",false);
          $(".elec_th_twentyone input").attr("readonly",false);
          $(".comp_th_twentyone input").removeClass("readonlytxtbox");
          $(".disp_th_twentyone input").removeClass("readonlytxtbox");
          $(".elec_th_twentyone input").removeClass("readonlytxtbox");
        } 
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
  }*/

  if(g1 < g2){
    //$(".page21_btn").removeClass("display-none");
    //$(".page21_btn").addClass("display-block");

    /*$(".page1_btn_nxt").removeClass("display-block");
    $(".page1_btn_nxt").addClass("display-none");  
    $(".page21_btn").removeClass("display-block");
    $(".page21_btn").addClass("display-none");
    $(".page20_btn_nxt").removeClass("display-block");
    $(".page20_btn_nxt").addClass("display-none");
    $(".page21_btn_nxt").removeClass("display-none");
    $(".page21_btn_nxt").addClass("display-block");

    $(".comp_th_twentyone input").attr("readonly",true);
    $(".disp_th_twentyone input").attr("readonly",true);
    $(".elec_th_twentyone input").attr("readonly",true);
    $(".comp_th_twentyone input").addClass("readonlytxtbox");
    $(".disp_th_twentyone input").addClass("readonlytxtbox");
    $(".elec_th_twentyone input").addClass("readonlytxtbox");*/
    if(sess_designation!='SGL EIC'){
      $(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");  
      $(".page21_btn").removeClass("display-block");
      $(".page21_btn").addClass("display-none");
      $(".page20_btn_nxt").removeClass("display-block");
      $(".page20_btn_nxt").addClass("display-none");
      $(".page21_btn_nxt").removeClass("display-none");
      $(".page21_btn_nxt").addClass("display-block");

      $(".comp_th_twentyone input").attr("readonly",true);
      $(".disp_th_twentyone input").attr("readonly",true);
      $(".elec_th_twentyone input").attr("readonly",true);
      $(".comp_th_twentyone input").addClass("readonlytxtbox");
      $(".disp_th_twentyone input").addClass("readonlytxtbox");
      $(".elec_th_twentyone input").addClass("readonlytxtbox");
    }else{
      $(".page1_btn_nxt").removeClass("display-block");
      $(".page1_btn_nxt").addClass("display-none");  
      $(".page21_btn").removeClass("display-none");
      $(".page21_btn").addClass("display-block");
      $(".page20_btn_nxt").removeClass("display-block");
      $(".page20_btn_nxt").addClass("display-none");
      $(".page21_btn_nxt").removeClass("display-block");
      $(".page21_btn_nxt").addClass("display-none");

      $(".comp_th_twentyone input").attr("readonly",false);
      $(".disp_th_twentyone input").attr("readonly",false);
      $(".elec_th_twentyone input").attr("readonly",false);
      $(".comp_th_twentyone input").removeClass("readonlytxtbox");
      $(".disp_th_twentyone input").removeClass("readonlytxtbox");
      $(".elec_th_twentyone input").removeClass("readonlytxtbox");
    }
  }
}
function col_twentyone(c_twentyone,disp_twentyone,elec_twentyone,c_twentytwo,disp_twentytwo,elec_twentytwo,current_time){
  console.log("TWENTYONE COL"+c_twentyone+"---disp_twentyone"+disp_twentyone+"-------elec_twentyone"+elec_twentyone+" c_twentytwo"+c_twentytwo+"----disp_twentytwo "+disp_twentytwo+"***** elec_twentytwo"+elec_twentytwo);
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_22").attr("readonly",false);
          $(".val_comp_22").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_22").attr("readonly",false);
          $(".lcv"+l+"_mfm_22").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_22").attr("readonly",false);
        $(".val_comp_22").removeClass("readonlytxtbox");
        $(".lcv3_mfm_22").attr("readonly",false);
        $(".lcv3_mfm_22").removeClass("readonlytxtbox");
        $(".lcv4_mfm_22").attr("readonly",false);
        $(".lcv4_mfm_22").removeClass("readonlytxtbox");
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
        //$(".page22_btn").removeClass("display-none");
        //$(".page22_btn").addClass("display-block");

        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page22_btn").removeClass("display-block");
        $(".page22_btn").addClass("display-none");
        $(".page21_btn_nxt").removeClass("display-block");
        $(".page21_btn_nxt").addClass("display-none");
        $(".page22_btn_nxt").removeClass("display-none");
        $(".page22_btn_nxt").addClass("display-block");

        $(".comp_th_twentytwo input").attr("readonly",true);
        $(".disp_th_twentytwo input").attr("readonly",true);
        $(".elec_th_twentytwo input").attr("readonly",true);
        $(".comp_th_twentytwo input").addClass("readonlytxtbox");
        $(".disp_th_twentytwo input").addClass("readonlytxtbox");
        $(".elec_th_twentytwo input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page22_btn").removeClass("display-block");
          $(".page22_btn").addClass("display-none");
          $(".page21_btn_nxt").removeClass("display-block");
          $(".page21_btn_nxt").addClass("display-none");
          $(".page22_btn_nxt").removeClass("display-none");
          $(".page22_btn_nxt").addClass("display-block");

          $(".comp_th_twentytwo input").attr("readonly",true);
          $(".disp_th_twentytwo input").attr("readonly",true);
          $(".elec_th_twentytwo input").attr("readonly",true);
          $(".comp_th_twentytwo input").addClass("readonlytxtbox");
          $(".disp_th_twentytwo input").addClass("readonlytxtbox");
          $(".elec_th_twentytwo input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page22_btn").removeClass("display-none");
          $(".page22_btn").addClass("display-block");
          $(".page21_btn_nxt").removeClass("display-block");
          $(".page21_btn_nxt").addClass("display-none");
          $(".page22_btn_nxt").removeClass("display-block");
          $(".page22_btn_nxt").addClass("display-none");

          $(".comp_th_twentytwo input").attr("readonly",false);
          $(".disp_th_twentytwo input").attr("readonly",false);
          $(".elec_th_twentytwo input").attr("readonly",false);
          $(".comp_th_twentytwo input").removeClass("readonlytxtbox");
          $(".disp_th_twentytwo input").removeClass("readonlytxtbox");
          $(".elec_th_twentytwo input").removeClass("readonlytxtbox");
        }
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
        //$(".page22_btn").removeClass("display-none");
        //$(".page22_btn").addClass("display-block");
        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page22_btn").removeClass("display-block");
        $(".page22_btn").addClass("display-none");
        $(".page21_btn_nxt").removeClass("display-block");
        $(".page21_btn_nxt").addClass("display-none");
        $(".page22_btn_nxt").removeClass("display-none");
        $(".page22_btn_nxt").addClass("display-block");

        $(".comp_th_twentytwo input").attr("readonly",true);
        $(".disp_th_twentytwo input").attr("readonly",true);
        $(".elec_th_twentytwo input").attr("readonly",true);
        $(".comp_th_twentytwo input").addClass("readonlytxtbox");
        $(".disp_th_twentytwo input").addClass("readonlytxtbox");
        $(".elec_th_twentytwo input").addClass("readonlytxtbox");*/

        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page22_btn").removeClass("display-block");
          $(".page22_btn").addClass("display-none");
          $(".page21_btn_nxt").removeClass("display-block");
          $(".page21_btn_nxt").addClass("display-none");
          $(".page22_btn_nxt").removeClass("display-none");
          $(".page22_btn_nxt").addClass("display-block");

          $(".comp_th_twentytwo input").attr("readonly",true);
          $(".disp_th_twentytwo input").attr("readonly",true);
          $(".elec_th_twentytwo input").attr("readonly",true);
          $(".comp_th_twentytwo input").addClass("readonlytxtbox");
          $(".disp_th_twentytwo input").addClass("readonlytxtbox");
          $(".elec_th_twentytwo input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page22_btn").removeClass("display-none");
          $(".page22_btn").addClass("display-block");
          $(".page21_btn_nxt").removeClass("display-block");
          $(".page21_btn_nxt").addClass("display-none");
          $(".page22_btn_nxt").removeClass("display-block");
          $(".page22_btn_nxt").addClass("display-none");

          $(".comp_th_twentytwo input").attr("readonly",false);
          $(".disp_th_twentytwo input").attr("readonly",false);
          $(".elec_th_twentytwo input").attr("readonly",false);
          $(".comp_th_twentytwo input").removeClass("readonlytxtbox");
          $(".disp_th_twentytwo input").removeClass("readonlytxtbox");
          $(".elec_th_twentytwo input").removeClass("readonlytxtbox");
        }
      }/*else{
    alert("ELSE");
  }*/
}
function col_twentytwo(c_twentytwo,disp_twentytwo,elec_twentytwo,c_twentthree,disp_twentthree,elec_twentthree,current_time){
  console.log("TWENTYTWO COL"+c_twentytwo+"---disp_twentytwo"+disp_twentytwo+"-------elec_twentytwo"+elec_twentytwo+" c_twentthree"+c_twentthree+"----disp_twentthree "+disp_twentthree+"***** elec_twentthree"+elec_twentthree);
  var sess_designation = window.localStorage.getItem("sess_designation");
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
      //var lcv_count = $("#hidd_lcvcnt").val();
      if(g1 >= g2){ 
      /*for(var l=1;l<=lcv_count;l++){
          $(".val_comp_23").attr("readonly",false);
          $(".val_comp_23").removeClass("readonlytxtbox");
          $(".lcv"+l+"_mfm_23").attr("readonly",false);
          $(".lcv"+l+"_mfm_23").removeClass("readonlytxtbox");
        }*/
        $(".val_comp_23").attr("readonly",false);
        $(".val_comp_23").removeClass("readonlytxtbox");
        $(".lcv3_mfm_23").attr("readonly",false);
        $(".lcv3_mfm_23").removeClass("readonlytxtbox");
        $(".lcv4_mfm_23").attr("readonly",false);
        $(".lcv4_mfm_23").removeClass("readonlytxtbox");
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
        //$(".save_btn").removeClass("display-none");
        //$(".save_btn").addClass("display-block");
        $(".save_btn").removeClass("display-block");
      $(".save_btn").addClass("display-none");

        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page23_btn").removeClass("display-block");
        $(".page23_btn").addClass("display-none");
        $(".page22_btn_nxt").removeClass("display-block");
        $(".page22_btn_nxt").addClass("display-none");
        $(".page23_btn_nxt").removeClass("display-none");
        $(".page23_btn_nxt").addClass("display-block");

        $(".comp_th_twentythree input").attr("readonly",true);
        $(".disp_th_twentythree input").attr("readonly",true);
        $(".elec_th_twentythree input").attr("readonly",true);
        $(".comp_th_twentythree input").addClass("readonlytxtbox");
        $(".disp_th_twentythree input").addClass("readonlytxtbox");
        $(".elec_th_twentythree input").addClass("readonlytxtbox");*/

        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page23_btn").removeClass("display-block");
          $(".page23_btn").addClass("display-none");
          $(".page22_btn_nxt").removeClass("display-block");
          $(".page22_btn_nxt").addClass("display-none");
          $(".page23_btn_nxt").removeClass("display-none");
          $(".page23_btn_nxt").addClass("display-block");

          $(".comp_th_twentythree input").attr("readonly",true);
          $(".disp_th_twentythree input").attr("readonly",true);
          $(".elec_th_twentythree input").attr("readonly",true);
          $(".comp_th_twentythree input").addClass("readonlytxtbox");
          $(".disp_th_twentythree input").addClass("readonlytxtbox");
          $(".elec_th_twentythree input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page23_btn").removeClass("display-none");
          $(".page23_btn").addClass("display-block");
          $(".page22_btn_nxt").removeClass("display-block");
          $(".page22_btn_nxt").addClass("display-none");
          $(".page23_btn_nxt").removeClass("display-block");
          $(".page23_btn_nxt").addClass("display-none");

          $(".comp_th_twentythree input").attr("readonly",false);
          $(".disp_th_twentythree input").attr("readonly",false);
          $(".elec_th_twentythree input").attr("readonly",false);
          $(".comp_th_twentythree input").removeClass("readonlytxtbox");
          $(".disp_th_twentythree input").removeClass("readonlytxtbox");
          $(".elec_th_twentythree input").removeClass("readonlytxtbox");
          //$(".save_btn").removeClass("display-none"); 
          //$(".save_btn").addClass("display-block");
        }
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
      //$(".save_btn").removeClass("display-none");
      //$(".save_btn").addClass("display-block");
      $(".save_btn").removeClass("display-block"); 
      $(".save_btn").addClass("display-none");


        /*$(".page1_btn_nxt").removeClass("display-block");
        $(".page1_btn_nxt").addClass("display-none");  
        $(".page23_btn").removeClass("display-block");
        $(".page23_btn").addClass("display-none");
        $(".page22_btn_nxt").removeClass("display-block");
        $(".page22_btn_nxt").addClass("display-none");
        $(".page23_btn_nxt").removeClass("display-none");
        $(".page23_btn_nxt").addClass("display-block");

        $(".comp_th_twentythree input").attr("readonly",true);
        $(".disp_th_twentythree input").attr("readonly",true);
        $(".elec_th_twentythree input").attr("readonly",true);
        $(".comp_th_twentythree input").addClass("readonlytxtbox");
        $(".disp_th_twentythree input").addClass("readonlytxtbox");
        $(".elec_th_twentythree input").addClass("readonlytxtbox");*/
        if(sess_designation!='SGL EIC'){
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page23_btn").removeClass("display-block");
          $(".page23_btn").addClass("display-none");
          $(".page22_btn_nxt").removeClass("display-block");
          $(".page22_btn_nxt").addClass("display-none");
          $(".page23_btn_nxt").removeClass("display-none");
          $(".page23_btn_nxt").addClass("display-block");

          $(".comp_th_twentythree input").attr("readonly",true);
          $(".disp_th_twentythree input").attr("readonly",true);
          $(".elec_th_twentythree input").attr("readonly",true);
          $(".comp_th_twentythree input").addClass("readonlytxtbox");
          $(".disp_th_twentythree input").addClass("readonlytxtbox");
          $(".elec_th_twentythree input").addClass("readonlytxtbox");
        }else{
          $(".page1_btn_nxt").removeClass("display-block");
          $(".page1_btn_nxt").addClass("display-none");  
          $(".page23_btn").removeClass("display-none");
          $(".page23_btn").addClass("display-block");
          $(".page22_btn_nxt").removeClass("display-block");
          $(".page22_btn_nxt").addClass("display-none");
          $(".page23_btn_nxt").removeClass("display-block");
          $(".page23_btn_nxt").addClass("display-none");

          $(".comp_th_twentythree input").attr("readonly",false);
          $(".disp_th_twentythree input").attr("readonly",false);
          $(".elec_th_twentythree input").attr("readonly",false);
          $(".comp_th_twentythree input").removeClass("readonlytxtbox");
          $(".disp_th_twentythree input").removeClass("readonlytxtbox");
          $(".elec_th_twentythree input").removeClass("readonlytxtbox");

          $(".save_btn").removeClass("display-none");
          $(".save_btn").addClass("display-block");
        }
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
  app.panel.close();
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
      //var no_dpr = parsedpr.no_dpr;
      var msg = parsedpr.msg;

      if(msg=="no_dpr"){ 
        app.preloader.hide(); 
        $(".form_dpr").removeClass("display-block");
        $(".form_dpr").addClass("display-none");
        //$(".no_data").html("<span class='fw-600 text-red'>No DPR Found.</span>");
        $(".no_data").html("<span class='fw-600 text-red'>No DPR Data.</span>");
        return false;
      }else if(msg == 'past_dpr_not_filled_or_apprv'){
        mainView.router.navigate("/dpr/");
        var toastWithButton = app.toast.create({
          text: 'Some past DPR are not completely filled or approved.',
          closeButton: true,
        });
        toastWithButton.open();
        app.preloader.hide(); 
        return false;
      }else if(msg == 'dpr_not_aprv'){
        mainView.router.navigate("/dpr/");
        var toastWithButton = app.toast.create({
          text: 'DPR is not approved.',
          closeButton: true,
        });
        if(dpr_date!=''){
          toastWithButton.open();
          app.preloader.hide(); 
        }
        return false;
      }else if(msg == 'tilldate_approved'){
        $(".form_dpr").removeClass("display-none");
        $(".form_dpr").addClass("display-block");
      }
       
//     var dpr_kpi = parsedpr.dpr_kpi;
//     $(".form_dpr").removeClass("display-none");
//     $(".form_dpr").addClass("display-block");
      // ------------- SALE -------------- //
      var final_sale_sum = parsedpr.final_sale_sum;
      jQuery.each( final_sale_sum, function( i, val ) {
        $("." +i).html(val);        
      });
      // -------------  COMP.SUCTION ---------------- //
      var final_comp_suc = parsedpr.final_comp_suc;
      jQuery.each( final_comp_suc, function( i, val ) {
        $("." +i).html(val);        
      });
      // -------------  COMP.DISCHARGE ---------------- //
      var final_disc_suc = parsedpr.final_disc_suc;
      jQuery.each( final_disc_suc, function( i, val ) {
        $("." +i).html(val);        
      });
      // -------------  DISP. SALE ---------------- //
      var final_disp_sale = parsedpr.final_disp_sale;
      jQuery.each( final_disp_sale, function( i, val ) {
        $("." +i).html(val);        
      });
      // -------------  LCV SALE (MOTHER) ---------------- //
      var final_lcv_mother = parsedpr.final_lcv_mother;
      jQuery.each( final_lcv_mother, function( i, val ) {
        $("." +i).html(val);        
      });
      // -------------  COMP. GAIN LOSS ---------------- //
      var final_cgl = parsedpr.final_cgl;
      jQuery.each( final_cgl, function( i, val ) {
        $("." +i).html(val);        
      });
      // -------------  DISP. GAIN LOSS ---------------- //
      var final_dgl = parsedpr.final_dgl;
      jQuery.each( final_dgl, function( i, val ) {
        $("." +i).html(val);        
      });
      // -------------  DISP. GAIN LOSS ---------------- //
      var final_sgl = parsedpr.final_sgl;
      jQuery.each( final_sgl, function( i, val ) {
        $("." +i).html(val);        
      });
      // -------------  REACTIVE CHARGES ---------------- //
      var final_reactive = parsedpr.final_reactive;
      jQuery.each( final_reactive, function( i, val ) {
        $("." +i).html(val);        
      });
      // -------------  POWER FACTOR ---------------- //
      var final_pf = parsedpr.final_pf;
      jQuery.each( final_pf, function( i, val ) {
        $("." +i).html(val);        
      });
      // -------------  COMP. RUNNING HRS ---------------- //
      var final_cmp_hr = parsedpr.final_cmp_hr;
      jQuery.each( final_cmp_hr, function( i, val ) {
        $("." +i).html(val);        
      });
      // -------------  SUCTION PRESSURE ---------------- //
      var final_suc_prsr = parsedpr.final_suc_prsr;
      jQuery.each( final_suc_prsr, function( i, val ) {
        $("." +i).html(val);        
      });
      // -------------  COMP FLOW ---------------- //
      var final_comp_flow = parsedpr.final_comp_flow;
      jQuery.each( final_comp_flow, function( i, val ) {
        $("." +i).html(val);        
      });
      // -------------  KWH/KG EQIPMENT ---------------- //
      var final_kwhkg_eq = parsedpr.final_kwhkg_eq;
      jQuery.each( final_kwhkg_eq, function( i, val ) {
        $("." +i).html(val);        
      });
      // -------------  KWH/KG STN ---------------- //
      var final_kwhkg_stn = parsedpr.final_kwhkg_stn;
      jQuery.each( final_kwhkg_stn, function( i, val ) {
        $("." +i).html(val);        
      });    
      // -------------  UTILIZATION % (16 Hrs) ---------------- //      
      var final_util_16 = parsedpr.final_util_16;
      jQuery.each( final_util_16, function( i, val ) {
        $("." +i).html(val);        
      });
      // -------------  UTILIZATION % (24 Hrs) ---------------- //
      var final_util_24 = parsedpr.final_util_24;
      jQuery.each( final_util_24, function( i, val ) {
        $("." +i).html(val);        
      });
      // ---------------------- No .of car ----------------------- //
      var final_noof_car = parsedpr.final_noof_car;
      jQuery.each( final_noof_car, function( i, val ) {
        $("." +i).html(val);        
      });
      // ---------------------- No .of rickshaw ----------------------- //
      var final_noof_rick = parsedpr.final_noof_rick;
      jQuery.each( final_noof_rick, function( i, val ) {
        $("." +i).html(val);        
      });
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
      // ---------------------- PM Hours ----------------------- //
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

      var monthly_avg_carno = parsedpr.monthly_avg_carno;
      $(".monthly_avg_carno").html(monthly_avg_carno);

      var monthly_avg_rickno = parsedpr.monthly_avg_rickno;
      $(".monthly_avg_rickno").html(monthly_avg_rickno);

      var monthly_avg_compgain = parsedpr.monthly_avg_compgain;
      $(".monthly_avg_compgain").html(monthly_avg_compgain);

      var monthly_avg_util_16 = parsedpr.monthly_avg_util_16;
      $(".monthly_avg_util_16").html(monthly_avg_util_16);

      var monthly_avg_util_24 = parsedpr.monthly_avg_util_24;
      $(".monthly_avg_util_24").html(monthly_avg_util_24);

      var monthly_avg_comp_flw = parsedpr.monthly_avg_comp_flw;
      $(".monthly_avg_comp_flw").html(monthly_avg_comp_flw);

      var monthly_avg_kwh_eqip = parsedpr.monthly_avg_kwh_eqip;
      $(".monthly_avg_kwh_eqip").html(monthly_avg_kwh_eqip);

      var monthly_avg_kwh_stn = parsedpr.monthly_avg_kwh_stn;
      $(".monthly_avg_kwh_stn").html(monthly_avg_kwh_stn);

      var monthly_avg_dryout_hr = parsedpr.monthly_avg_dryout_hr;
      $(".monthly_avg_dryout_hr").html(monthly_avg_dryout_hr);

      var monthly_avg_dryout_per = parsedpr.monthly_avg_dryout_per;
      $(".monthly_avg_dryout_per").html(monthly_avg_dryout_per);

      var monthly_avg_bd_hr = parsedpr.monthly_avg_bd_hr;
      $(".monthly_avg_bd_hr").html(monthly_avg_bd_hr); 

      var monthly_avg_pm_hr = parsedpr.monthly_avg_pm_hr;
      $(".monthly_avg_pm_hr").html(monthly_avg_pm_hr);

      var monthly_avg_avail = parsedpr.monthly_avg_avail;
      $(".monthly_avg_avail").html(monthly_avg_avail);

      var monthly_avg_compgain = parsedpr.monthly_avg_compgain;
      $(".monthly_avg_compgain").html(monthly_avg_compgain);

      var monthly_avg_dispsale = parsedpr.monthly_avg_dispsale;
      $(".monthly_avg_dispsale").html(monthly_avg_dispsale);

      var monthly_avg_lcvsale = parsedpr.monthly_avg_lcvsale;
      $(".monthly_avg_lcvsale").html(monthly_avg_lcvsale);

      var monthly_avg_dispgain = parsedpr.monthly_avg_dispgain;
      $(".monthly_avg_dispgain").html(monthly_avg_dispgain);

      var monthly_avg_stngain = parsedpr.monthly_avg_stngain;
      $(".monthly_avg_stngain").html(monthly_avg_stngain);

      $(".sale_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_sale+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_sale+"</span>");

      $(".compsuc_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_compsuc+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_compsuc+"</span>");
      
      $(".compdischrge_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_compdischrg+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_compdischrg+"</span>");

      $(".dispsale_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_dispsale+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_dispsale+"</span>");

      $(".dispgl_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_dispgain+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_dispgain+"</span>");

      $(".stngl_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_stngain+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_stngain+"</span>");

      $(".react_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_reactive_chrg+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_reactive_chrg+"</span>");

      $(".pf_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_pf+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_pf+"</span>");

      $(".compgain_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_compgain+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_compgain+"</span>"); 

      $(".comprunhr_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_cmp_run_hrs+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_cmp_run_hrs+"</span>");

      $(".sucprs_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_suc_prs+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_suc_prs+"</span>");

      $(".compflow_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_comp_flw+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_comp_flw+"</span>");

      $(".kwhkg_eq_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_kwh_eqip+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_kwh_eqip+"</span>");

      $(".kwhkgstn_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_kwh_stn+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_kwh_stn+"</span>"); 

      $(".util_16_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_util_16+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_util_16+"</span>");

      $(".util_24_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_util_24+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_util_24+"</span>");

      $(".noof_car_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_carno+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_carno+"</span>");

      $(".noof_rick_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_rickno+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_rickno+"</span>");

      $(".dryouthr_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_dryout_hr+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_dryout_hr+"</span>");

      $(".dryoutper_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_dryout_per+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_dryout_per+"</span>");

      $(".bdhr_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_bd_hr+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_bd_hr+"</span>");

      $(".pmhr_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_pm_hr+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_pm_hr+"</span>");

      $(".availability_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_avail+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_avail+"</span>");

      $(".lcv_avgs").html("<span class='dark-blue fw-600'>"+daily_avg_lcvsale+"</span> / <span class='color-sgl-green fw-600'>"+monthly_avg_lcvsale+"</span>");

      app.preloader.hide();
    }
  });
  
}); 

/*
*/
$(document).on('page:init', '.page[data-name="dpr_list"]', function (page) {
  menuload();
  checkConnection();
  app.panel.close();
  //var prevPageName = page.el.prev('.page').attr('data-name');
  //var prevPageName = page.$el.prev('.page').attr('data-name');
  //console.log(page.detail);
  var prev_page = page.detail.pageFrom.name;
  console.log(prev_page);
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
    dataType:'json',
    success:function(result){
      $("#station_id_lists").html(result.html);
    }    
  });
  //getDPRList(prev_page,c_mnth,c_year);
  getDPRList(prev_page);
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
//function getDPRList(prev_page,c_mnth,c_year){
function getDPRList(prev_page){
  //alert("called");
  app.preloader.show();
  var session_uid = window.localStorage.getItem("session_uid");
  var sess_designation = window.localStorage.getItem("sess_designation");
  if(prev_page=='dpr_sheet'){
    //console.log("FORM "+prev_page);
    var station_id = null;
    var dpr_month = $("#dpr_month").val();
    var dpr_year = $("#dpr_year").val();
    console.log("======"+station_id+"----"+dpr_month+"-----"+dpr_year);
  }else{
    var station_id = $("#station_id_lists").val();
    if(station_id==''){
      station_id=null;
    }else{
      station_id=station_id;
    }
    var dpr_month = $("#dpr_month").val();
    var dpr_year = $("#dpr_year").val();
    console.log(station_id+"----"+dpr_month+"-----"+dpr_year);
  }
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
  app.preloader.hide();
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
function checkPrevHourVal(prev_slot,val,param){
  checkConnection();
  app.preloader.show();
  var hidd_stid = $("#hidd_stid").val();
  var hidd_dprdt = $("#hidd_dprdt").val();
  var entered_val = $(val).val();
  //alert(entered_val+"entered_val");             
  if(entered_val!=''){  
    //setTimeout(function() {   //calls click event after a certain time //    
      $.ajax({
        type:'POST',  
        url:base_url+'APP/Appcontroller/checkPrevSlotVal',
        data:{'hidd_stid':hidd_stid,'hidd_dprdt':hidd_dprdt,'prev_slot':prev_slot,'entered_val':entered_val,'param':param},
        //dataType:'json',
        success:function(result){ 
          var res = result.trim();
          //alert(res);
          if(res=="sameval"){
            app.dialog.alert("Current and previous value for "+param+" can not be same");
            $(val).val('');  
          }else if(res=="notsame"){
            //alert("IN ELSE");
            return false;
          }
        }    
      });
    //}, 6000);
  }
  app.preloader.hide();
}
$(document).on('page:init', '.page[data-name="dpr_complain"]', function (e) {
  menuload();
  checkConnection();
  app.panel.close();
  $(".plus_icon").hide();
  $(".bell_icon").hide();
  $(".stn").hide();
  var session_uid = window.localStorage.getItem("session_uid");
  var sess_designation = window.localStorage.getItem("sess_designation");
  if(sess_designation=='SGL EIC'){
    $(".plus_icon").show();
    $(".bell_noti").addClass("pl-10");
  }else{
    $(".plus_icon").hide();
    $(".bell_noti").addClass("pl-10");
  }
  $.ajax({
    type:'POST', 
    dataType:'json',
    url:base_url+'APP/Appcontroller/getEICUserStations',
    data:{'session_uid':session_uid},
    success:function(result){
      $("#station_id_comps").html(result.html);
      //$("#station_id_comps").html(result);
    }    
  });
  getcorrData();  
});
function getcorrData(){
  var session_uid = window.localStorage.getItem("session_uid");
  var sess_designation = window.localStorage.getItem("sess_designation");
  var station_id_comps = $("#station_id_comps").val();
  app.preloader.show();
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getDPRComplains',
    data:{'session_uid':session_uid,'sess_designation':sess_designation,'station_id_comps':station_id_comps},
    dataType:'json',
    success:function(result_html){
      var stns = result_html.stns;
      var comp_html = result_html.comp_html;
      var notifi_cnt = result_html.notifi_cnt;
      var total_comps = result_html.total_comps;
      var status = result_html.status;
      //console.log(stns);
      if(notifi_cnt >= 1){  
        $(".stn").show();
        $(".no-bg").addClass("row");
        $(".bgcnt").html("<span class='badge rd-badge bell_badge'>"+notifi_cnt+"</span>");
        $(".bell_icon").show();
      }else{
        $(".no-bg").removeClass("row");
        $(".stn").hide();
      }
      $(".total_comps").html("Total Records: ("+total_comps+")")
      $("#comp_list").html(comp_html);
      $("li").removeAttr("style");
      $("#station_id_comps").html(stns);
    }    
  });
  app.preloader.hide();
}
$(document).on('page:init', '.page[data-name="add_dprcomplain"]', function (page) {
  menuload();
  checkConnection();
  app.panel.close();
  //$("#savecomp").attr("disabled","disabled");
  var session_uid = window.localStorage.getItem("session_uid");
  $('#hidd_sess_user').val(session_uid);
  $.ajax({
    type:'POST', 
    dataType:'json',
    url:base_url+'APP/Appcontroller/getUserStations',
    data:{'session_uid':session_uid},
    success:function(result){
      //var parsest = $.parseJSON(result);
      /*var parsest = $.parseJSON(result);
      var st_ids = parsest.st_ids;
      //console.log(st_ids);
      var split_stids = st_ids.split(",");
      for(var st=0;st<split_stids.length;st++){
        var id_sts = split_stids[st];
        console.log(id_sts);
      }*/
      //var htmlres = parsest.html;
      $("#u_stations").html(result.html);
    }    
  });

});
function getallDPRs(sel_stn){
  menuload();   
  checkConnection();
  var u_stations = $("#u_stations").val();
  var date_dpr = $("#date_dpr").val();
  var timeslots = $("#timeslots").val();
  var dpr_params = $("#dpr_params").val();
  var hidd_dpr_id = $("#hidd_dpr_id").val();
  var session_uid = window.localStorage.getItem("session_uid");
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getStnDprs',
    data:{'sel_stn':sel_stn},
    dataType:'json',
    success:function(result){
      //console.log(result);     
      //var parsedt_arr=$.parseJSON(result);
      $("#date_dpr").html(result.html);
      // var add_arr=[];
      // var test_arr=[];
      //var dt_arr = parsedt_arr.dt_arr;
      //console.log("******** "+dt_arr.length);
      /*for(var j=0;j<dt_arr.length;j++){
        var split_dt = dt_arr[j].split("-");
        var yr = split_dt[2];
        var mnth = split_dt[1];
        var day_dt = split_dt[0];
        //console.log(day_dt+" day");
        if(mnth <= 9){
          var mnth=mnth.split("0");
          var excluded_zero = mnth[1]-1;
        }else{
          var excluded_zero=mnth-1;
        }
        if(day_dt <= 9){
          var day_split=day_dt.split("0");
          var excludedday_zero = day_split[1];
        }else{
          var excludedday_zero=day_dt;
        }
        //console.log(yr+"-"+excluded_zero+"-"+excludedday_zero);
        //console.log(new Date(yr, excluded_zero, excludedday_zero));
        //var string_dts = new Date(yr+","+ excluded_zero+","+ excludedday_zero);
        var string_dts = yr+","+ excluded_zero+","+ excludedday_zero;
        add_arr.push(string_dts);
       
      } 
      //console.log(add_arr);
      //var arr_join = add_arr.join("'"+", "+"'");
      var arr_join = add_arr.join(", ");
      console.log(arr_join);
      //console.log(new Date(add_arr));
    
      //console.log(new Date(2020, 4, 2),new Date(2020, 4, 1),new Date(2020, 3, 30));
      var calendarModal = app.calendar.create({
    inputEl: '#addcorr-cal',
    openIn: 'customModal',
    dateFormat: 'dd-mm-yyyy',
    header: true,
    footer: true, 
    //disabled:[arr_join],
    //disabled:["'"+arr_join+"'"],
    //disabled:['Thu Apr 02 2020 00:00:00 GMT+0530 (India Standard Time)', 'Wed Apr 01 2020 00:00:00 GMT+0530 (India Standard Time)', 'Mon Mar 30 2020 00:00:00 GMT+0530 (India Standard Time)'],
    //disabled:['Thu Apr 02 2020 00:00:00 GMT+0530 (India Standard Time)', 'Wed Apr 01 2020 00:00:00 GMT+0530 (India Standard Time)', 'Mon Mar 30 2020 00:00:00 GMT+0530 (India Standard Time)'],
    //disabled:['Fri May 01 2020 00:00:00 GMT+0530 (India Standard Time)'],
    disabled: [new Date(2020, 5, 15), new Date(2020, 7, 15)],
    //disabled: [new Date(2020, 4, 2),new Date(2020, 4, 1),new Date(2020, 3, 30)],
    renderToolbar: function () {   
      return '<div class="toolbar no-shadow"><div class="toolbar-inner"><div class="calendar-month-selector"><a href="#" class="link icon-only calendar-prev-month-button"><i class="f7-icons ">chevron_left</i></a><span class="current-month-value"></span><a href="#" class="link icon-only calendar-next-month-button"><i class="f7-icons ">chevron_right</i></a></div><div class="calendar-year-selector"><a href="#" class="link icon-only calendar-prev-year-button"><i class="f7-icons ">chevron_left</i></a><span class="current-year-value"></span><a href="#" class="link icon-only calendar-next-year-button"><i class="f7-icons ">chevron_right</i></a></div></div></div>'; 
    }
  }); */
    }    
  });
  //console.log("^^^^^^^^ "+dt_arr);
  /*var calendarModal = app.calendar.create({
    inputEl: '#addcorr-cal',
    openIn: 'customModal',
    dateFormat: 'dd-mm-yyyy',
    header: true,
    footer: true,
    disabled: [new Date(2020, 5, 15), new Date(2020, 7, 15)],
    renderToolbar: function () {   
      return '<div class="toolbar no-shadow"><div class="toolbar-inner"><div class="calendar-month-selector"><a href="#" class="link icon-only calendar-prev-month-button"><i class="f7-icons ">chevron_left</i></a><span class="current-month-value"></span><a href="#" class="link icon-only calendar-next-month-button"><i class="f7-icons ">chevron_right</i></a></div><div class="calendar-year-selector"><a href="#" class="link icon-only calendar-prev-year-button"><i class="f7-icons ">chevron_left</i></a><span class="current-year-value"></span><a href="#" class="link icon-only calendar-next-year-button"><i class="f7-icons ">chevron_right</i></a></div></div></div>'; 
    }
  });*/

  /*if(u_stations!='' && date_dpr!='' && timeslots!='' && dpr_params!='' && hidd_dpr_id!=''){
    checktoaddComplain(u_stations,date_dpr,timeslots,dpr_params,hidd_dpr_id);
  }*/
}
function loadtimeslots(){
  menuload();   
  checkConnection();
  var u_stations = $("#u_stations").val();
  var sel_date = $("#date_dpr").val();
  var date_dpr = $("#date_dpr option:selected").text();
  var timeslots = $("#timeslots").val();
  var dpr_params = $("#dpr_params").val();
  var hidd_dpr_id = $("#hidd_dpr_id").val();
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getDPRID',
    data:{'u_stations':u_stations,'date_dpr':date_dpr},
    success:function(result){
      var parseRes = $.parseJSON(result);
      var dpr_id = parseRes.dpr_id;
      var createdby = parseRes.createdby;
      var params = parseRes.params;
      var tot_param = params.length;
      $("#hidd_dpr_id").val(dpr_id);
      $("#hidd_created").val(createdby);
      var para='';
      para+='<option value="">--- Parameters ---</option>';
      for(var p=0;p<tot_param;p++){
        var par = params[p].dpr_params;         
        para+='<option value="'+par+'">'+par+'</option>';
      }
      $("#dpr_params").html(para);
    }    
  });  
  var slots='';
  slots+='<option value="">--- Timeslots ---</option>';

  for(var i=0;i<=23;i++){
  //console.log("****** "+i);
    if(i==0){
        var tm = "12:00 AM";
    }else if(i==1){
      var tm = "01:00 AM";
    }else if(i==2){
      var tm = "02:00 AM";
    }else if(i==3){
      var tm = "03:00 AM";
    }else if(i==4){
      var tm = "04:00 AM";
    }else if(i==5){
      var tm = "05:00 AM";
    }else if(i==6){
      var tm = "06:00 AM";
    }else if(i==7){
      var tm = "07:00 AM";
    }else if(i==8){
      var tm = "08:00 AM";
    }else if(i==9){
      var tm = "09:00 AM";
    }else if(i==10){
      var tm = "10:00 AM";
    }else if(i==11){
      var tm = "11:00 AM";
    }else if(i==12){
      var tm = "12:00 PM";
    }else if(i==13){
      var tm = "01:00 PM";
    }else if(i==14){
      var tm = "02:00 PM";
    }else if(i==15){
      var tm = "03:00 PM";
    }else if(i==16){
      var tm = "04:00 PM";
    }else if(i==17){
      var tm = "05:00 PM";
    }else if(i==18){
      var tm = "06:00 PM";
    }else if(i==19){
      var tm = "07:00 PM";
    }else if(i==20){
      var tm = "08:00 PM";
    }else if(i==21){
      var tm = "09:00 PM";
    }else if(i==22){
      var tm = "10:00 PM";
    }else if(i==23){
      var tm = "11:00 PM";
    }
    if(i<=9){ 
      i="0"+i;
    }else{
      i=i;
    }
    
    slots+='<option value="'+i+':00">'+tm+' - '+i+':00</option>';
  }
  $("#timeslots").html(slots);
  $("#dpr_oldval").val('');
  
  /*if(u_stations!='' && sel_date!='' && timeslots!='' && dpr_params!='' && hidd_dpr_id!=''){
    checktoaddComplain(u_stations,sel_date,timeslots,dpr_params,hidd_dpr_id);
  }*/
}
function getoldval(timeslot){
  var timeslots = $("#timeslots").val();
  var dpr_param =$("#dpr_params").val();
  var u_stations = $("#u_stations").val();
  var date_dpr = $("#date_dpr").val();
  var hidd_dpr_id = $("#hidd_dpr_id").val();
  $("#hidd_slot_sel").val(timeslots);
  //var dpr_param =$("#dpr_params option:selected").text();
  
  if(dpr_param!='' && timeslots!=''){
    getoldpara_val(dpr_param);

  }else{
    app.dialog.alert("Select parameter");
    return false;
  }
  /*if(u_stations!='' && date_dpr!='' && timeslots!='' && dpr_params!='' && hidd_dpr_id!=''){
    checktoaddComplain(u_stations,date_dpr,timeslots,dpr_params,hidd_dpr_id);
  }*/
}
function getoldpara_val(parameter){
  var u_stations = $("#u_stations").val();
  var hidd_dpr_id = $("#hidd_dpr_id").val();
  var timeslots_str = $("#timeslots option:selected").text();
  var split_timeslots_str = timeslots_str.split("-");
  var timeslots = $("#timeslots").val();
  var dpr_param =$("#dpr_params option:selected").text();
  var date_dpr = $("#date_dpr").val();
  var sel_param = $("#dpr_params").val();
  var split_timeslots_str = timeslots_str.split("-");
  if(timeslots==''){
    app.dialog.alert("Select time");
  }else{
    $.ajax({
      type:'POST', 
      url:base_url+'APP/Appcontroller/getOldparam',
      data:{'hidd_dpr_id':hidd_dpr_id,'timeslots':timeslots,'dpr_param':dpr_param,'u_stations':u_stations},
      success:function(result){
        var resparse = $.parseJSON(result);
        /*var pending_comp = resparse.pending_comp;
        if(pending_comp >= 1){
          app.dialog.alert("Please wait, correction already sent for "+dpr_param+" for "+split_timeslots_str[0]);
        }else{*/
          var old_value = resparse.old_value;      
          var sheet_id = resparse.sheet_id;
          if(old_value==''){
            app.dialog.alert("DPR values for "+split_timeslots_str[0]+" is not filled");
            $("#dpr_oldval").val('');
          }else{
            $("#dpr_oldval").val(old_value);
            if(old_value!=''){
              chkaddComplain();
              //if(u_stations!='' && date_dpr!='' && timeslots!='' && sel_param!='' && hidd_dpr_id!=''){
                //chkaddComplain(u_stations,date_dpr,timeslots,dpr_params,hidd_dpr_id);
              //}
            }
          }
          $("#hidd_sheetid").val(sheet_id);
        }
      //}    
    });
    
  } 
}
//function chkaddComplain(u_stations,date_dpr,timeslots,dpr_params,hidd_dpr_id){
function chkaddComplain(){
  checkConnection();
  var u_stations = $("#u_stations").val();
  var date_dpr = $("#date_dpr").val();
  var timeslots = $("#timeslots").val();
  var hidd_dpr_id = $("#hidd_dpr_id").val();
  var dpr_params = $("#dpr_params").val();
  $.ajax({
    type:'POST',
    url:base_url+'APP/Appcontroller/checkaddcompln',
    data:{'u_stations':u_stations,'date_dpr':date_dpr,'timeslots':timeslots,'dpr_params':dpr_params,'hidd_dpr_id':hidd_dpr_id},
    success:function(result){
      var parseReslt = $.parseJSON(result);
      var status = parseReslt.status;
      var st=status.trim();
      if(st=='pending'){
        app.dialog.alert("Correction for "+dpr_params+" for "+date_dpr+" "+timeslots+" is already sent");
        mainView.router.navigate("/dpr_complain/");
      }else if(st=='completed'){
        app.dialog.alert("value already updated by Compressor Operator.want to give correction again?");
      }else if(st=="no_data"){

      }
    }
  });
  /*$.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/checkaddcompln',
    data:{'u_stations':u_stations,'date_dpr':date_dpr,'timeslots':timeslots,'dpr_params':dpr_params,'hidd_dpr_id':hidd_dpr_id},
    success:function(result){
      var parseReslt = $.parseJSON(result);
      var status = parseReslt.status;
      var st=status.trim();
      if(st=='pending'){
        app.dialog.alert("Correction for "+dpr_params+" for "+date_dpr+" "+timeslots+" is already sent");
        mainView.router.navigate("/dpr_complain/");
      }else if(st=='completed'){
        app.dialog.alert("value already updated by Compressor Operator.want to give correction again?");
      }
    }
  });*/
}
function dprcompadd(){
  menuload();   
  checkConnection();
  var form_dprcomp = $("#form_dprcomp").serialize();
  var u_stations = $("#u_stations").val();
  var date_dpr = $("#date_dpr").val();
  var timeslots = $("#timeslots").val();
  var dpr_params = $("#dpr_params").val();
  var dpr_oldval = $("#dpr_oldval").val();
  var dpr_desc = $("#dpr_desc").val();
  if(u_stations==''){
    app.dialog.alert("Select station");
  }else if(date_dpr==''){
    app.dialog.alert("Select date");
  }else if(timeslots==''){
    app.dialog.alert("Select time");
  }else if(dpr_params==''){
    app.dialog.alert("Select parameter");
  }else if(dpr_oldval==''){
    app.dialog.alert("Old value not found for "+dpr_params+" for "+timeslots+" slot.DPR values for "+timeslots+" is not filled");
  }else if(dpr_desc==''){
    app.dialog.alert("Enter description");
  }else{
    app.preloader.show();
    $.ajax({
      type:'POST', 
      url:base_url+'APP/Appcontroller/dprCompAdd',
      data:form_dprcomp,
      success:function(result){
        var res=result.trim();
        if(res=='inserted'){
          app.dialog.alert("Complain added successfully.");
          mainView.router.navigate("/dpr_complain/");
        }else{
          app.dialog.alert("Problem inserting data");
        }
      }    
    }); 
    app.preloader.hide();
  }
}
function dprcompupdateval(){
  checkConnection();
  menuload();
  var session_uid = window.localStorage.getItem("session_uid");
  var hidd_dcid = $("#hidd_dcid").val();
  var new_val = $("#new_val").val();
  var hidd_parameter = $("#hidd_parameter").val();
  //var updt_newdprcomp = $(".updt_newdprcomp").serialize();
  //console.log("updt_newdprcomp "+updt_newdprcomp);
  if(new_val==''){
    app.dialog.alert("Enter new value to update");
    return false;
  }else{
  app.preloader.show();
    $.ajax({
      type:'POST', 
      url:base_url+'APP/Appcontroller/dprCompupdt',
      //data:updt_newdprcomp,
      data:{'hidd_dcid':hidd_dcid,'session_uid':session_uid,'new_val':new_val},
      success:function(result){
        var res=result.trim();
        console.log(res);
        if(res=="sameval"){
          app.dialog.alert("Current and previous value for "+hidd_parameter+" can not be same");
          mainView.router.navigate("/dpr_complain/"); 
        }else if(res=='updated'){
          app.dialog.alert("New value updated successfully.");
          mainView.router.navigate("/dpr_complain/");
        }else{
          app.dialog.alert("Problem updaing data");
        }
        /*if(res.indexOf("-") != -1){
          var split_param=res.split("-");
          var param=split_param[1];
          app.dialog.alert("Current and previous value for "+param+" can not be same");
          mainView.router.navigate("/dpr_complain/"); 
        }else{
          if(res=='updated'){
            app.dialog.alert("New value updated successfully.");
            mainView.router.navigate("/dpr_complain/");
          }else{
            app.dialog.alert("Problem updaing data");
          }
        }*/ 
        
      }    
    }); 
    app.preloader.hide();
  }
}
function modulename(sel_module){
  window.localStorage.setItem("module_name",sel_module);
}
// -------------------------------- JMR MODULE STARTS -------------------------- //
$(document).on('page:init', '.page[data-name="jmr"]', function (page) {
  menuload();
  checkConnection();
  app.panel.close();
  app.preloader.show();
  var session_uid = window.localStorage.getItem("session_uid");
  $.ajax({
    type:'POST', 
    dataType:'json',
    url:base_url+'APP/Appcontroller/getstartedStations',
    data:{'session_uid':session_uid},
    success:function(result){
      $("#jmr_station_id").html(result.html);
    }    
  });
  //getJMRList();   
  app.preloader.hide();
});
function getStationJMRList(){
  menuload();
  checkConnection();
  app.preloader.show();
  var jmr_station_id = $("#jmr_station_id").val();
  if(jmr_station_id==''){
    app.dialog.alert("Select Station");
  }else{
    mainView.router.navigate("/jmr_list/"+jmr_station_id+"/");
  }
  app.preloader.hide(); 
}
$(document).on('page:init', '.page[data-name="jmr_list"]', function (page) {
  menuload();
  checkConnection();
  app.panel.close();
  app.preloader.show();
  var jmr_station_id = page.detail.route.params.jmr_station_id;
  $("#hidd_stnid").val(jmr_station_id);
  //alert("jmr_list page "+jmr_station_id);
  var session_uid = window.localStorage.getItem("session_uid");
  var sess_designation = window.localStorage.getItem("sess_designation");
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
  $("#jmr_month").html(mon_list);
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
  $("#jmr_year").html(yrs);
  var hidd_stnid = $("#hidd_stnid").val();
  //alert("jmr_list page hidden id "+hidd_stnid);  
  getJMRList(hidd_stnid);
  app.preloader.hide();
});
function getJMRList(jmr_station_id){   
  //alert(jmr_station_id);
  menuload();  
  checkConnection();    
  app.preloader.show();  
  var session_uid = window.localStorage.getItem("session_uid");
  var sess_designation = window.localStorage.getItem("sess_designation");
  
  //console.log("===="+hidd_stnid);
  //var jmr_station_id = $("#jmr_station_id").val();
    if(jmr_station_id=='' || jmr_station_id==undefined){
      var hidd_stnid = $("#hidd_stnid").val();
      jmr_station_id = hidd_stnid;
      //jmr_station_id=null;
    }else{
      jmr_station_id=jmr_station_id;
    }
    var jmr_month = $("#jmr_month").val();
    var jmr_year = $("#jmr_year").val();
    $.ajax({
      type:'POST', 
      //dataType:'json', 
      url:base_url+'APP/Appcontroller/getStationJMRs',
      data:{'jmr_station_id':jmr_station_id,'jmr_month':jmr_month,'jmr_year':jmr_year,'session_uid':session_uid,'sess_designation':sess_designation},
      success:function(result){
        //console.log(result);
        var upcoming_jmr_dt='';
        var parseRes = $.parseJSON(result);
        var jmrList = parseRes.jmr_list;
        var st_name = parseRes.st_name;
        var total_jmr = parseRes.total_jmr;
        
        var jmr = parseRes.jmr;
        if(sess_designation=='COMP. OPERATOR'){
          if(jmr!='' || jmr!=undefined){
            var jmrdt = parseRes.jmrdt;
            var jmr_create = jmr.jmr_create;
            var station_id = jmr.station_id;
            var start_time = jmr.start_time;
            var jmr_date = jmr.jmr_date;
            var first_date = jmr.first_date;
            var last_date = jmr.last_date;
            var msg = jmr.msg;            
            if(jmr_create == 1){              
                upcoming_jmr_dt+='<a class="button button-fill button-small sgl-blue" onclick="getJMRdateJMRReding('+"'"+station_id+"'"+','+"'"+start_time+"'"+','+"'"+jmr_date+"'"+','+"'"+first_date+"'"+','+"'"+last_date+"'"+')">'+jmrdt+'</a>';        
            }else{ 
              if((msg.indexOf("between") !== -1)){
                upcoming_jmr_dt+='<a class="button button-fill button-small sgl-blue" onclick="showmsg('+"'"+msg+"'"+')">'+jmrdt+'</a>';                
              }            
            }
            $(".upcoming_jmrdate").html(upcoming_jmr_dt);
          }
        }
        $(".stname").html(st_name);
        $(".total_jmr").html("Total Records: ("+total_jmr+")");
        $("#jmr_list").html(jmrList);
      }    
    });
  app.preloader.hide();
}
function showmsg(msg){
  app.dialog.alert(msg);
}
function getJMRdateJMRReding(station_id,start_time,jmr_date,first_date,last_date){
  menuload();
  checkConnection();
  app.preloader.show(); 
  mainView.router.navigate("/jmr_readings/"+station_id+"/"+start_time+"/"+jmr_date+"/"+first_date+"/"+last_date+"/");
  app.preloader.hide();
}
$(document).on('page:init', '.page[data-name="jmr_readings"]', function (page) {
  menuload();
  checkConnection();
  app.panel.close();
  app.preloader.show();
  var station_id = page.detail.route.params.station_id;
  var start_time = page.detail.route.params.start_time;
  var jmr_date = page.detail.route.params.jmr_date;
  var first_date = page.detail.route.params.first_date;
  var last_date = page.detail.route.params.last_date;
  var session_uid = window.localStorage.getItem("session_uid");
  $.ajax({
    type:'POST',  
    //dataType:'json', 
    url:base_url+'APP/Appcontroller/getJMRReading',
    data:{'station_id':station_id,'start_time':start_time,'jmr_date':jmr_date,'first_date':first_date,'last_date':last_date,'session_uid':session_uid},
    success:function(result){
      $(".jmr_reading_details").html(result);
    }
  });
  app.preloader.hide();
});
function jmradd(station_id){
  menuload();
  checkConnection();
  app.preloader.show();
  var jmr_readingdata = $(".jmr_readingdata").serialize();
  //console.log(jmr_readingdata);
  $.ajax({
    type:'POST',  
    //dataType:'json', 
    url:base_url+'APP/Appcontroller/addJMR',
    data:jmr_readingdata,
    success:function(result){
      if(result=='inserted'){
        app.dialog.alert("JMR has been created");
        mainView.router.navigate("/jmr_list/"+station_id+"/");
        //getJMRList(station_id);
      }
    }    
  });
  app.preloader.hide();
}
function getJMR(jmr_ID){  
  menuload();
  checkConnection();
  app.preloader.show();
  mainView.router.navigate("/jmr_view/"+jmr_ID+"/");
  app.preloader.hide();
}
$(document).on('page:init', '.page[data-name="jmr_view"]', function (page) {
  menuload();
  checkConnection();
  app.panel.close();
  app.preloader.show();
  var sess_designation = window.localStorage.getItem("sess_designation");
  var jmr_ID = page.detail.route.params.jmr_ID;  
  $.ajax({  
    type:'POST',  
    //dataType:'json', 
    url:base_url+'APP/Appcontroller/getJMR',
    data:{'jmr_ID':jmr_ID,'sess_designation':sess_designation},
    success:function(result){
      $(".jmr_view_details").html(result);
    }
  });

  /*$.ajax({  
    type:'POST',  
    //dataType:'json', 
    url:base_url+'APP/Appcontroller/checkJMRapproved',
    data:{'jmr_ID':jmr_ID},
    success:function(result){
     var parseResult = $.parseJSON(result);
     var app_one = parseResult.app_one;
     var app_two = parseResult.app_two;
     var app_three = parseResult.app_three;
     var jmr_ID = parseResult.jmr_ID;
     var aprv_btn='';
     if(app_one!=0 && app_two==0){
      aprv_btn+='<a class="button col button button-fill sgl-blue no-radius" href="#" onclick="jmr_approve('."'".$jmr_ID."'".')">Approve</a>';
     }
     $(".").html(aprv_btn);
    }
  });*/
  app.preloader.hide();
});
function jmr_approve(jmr_ID){
  menuload();
  checkConnection();
  app.preloader.show();
  var session_uid = window.localStorage.getItem("session_uid");
  var sess_designation = window.localStorage.getItem("sess_designation");
  var eic_email = $("#eic_email").val();
  var stn_mgr_email = $("#stn_mgr_email").val();
  var operator_email = $("#operator_email").val();
  $.ajax({
    type:'POST',  
    //dataType:'json', 
    url:base_url+'APP/Appcontroller/approveJMR',
    data:{'session_uid':session_uid,'sess_designation':sess_designation,'jmr_ID':jmr_ID,'eic_email':eic_email,'stn_mgr_email':stn_mgr_email,'operator_email':operator_email},
    success:function(result){ 
      var parse_res = $.parseJSON(result);
      var station_id = parse_res.station_id;     
      app.dialog.alert("JMR has been updated");
      mainView.router.navigate("/jmr_list/"+station_id+"/");
      //getJMRList(station_id);      
    }    
  });
  app.preloader.hide();
}
/*function jmradd(station_id){
  menuload();
  checkConnection();
  app.preloader.show();
  var jmr_readingdata = $(".jmr_readingdata").serialize();
  //console.log(jmr_readingdata);
  $.ajax({
    type:'POST',  
    //dataType:'json', 
    url:base_url+'APP/Appcontroller/addJMR',
    data:jmr_readingdata,
    success:function(result){
      if(result=='inserted'){
        app.dialog.alert("JMR has been created");
        mainView.router.navigate("/jmr_list/"+station_id+"/");
        //getJMRList(station_id);
      }
    }    
  });
  app.preloader.hide();
} */
// -------------------------------- C M S  M O D U L E ------------------------- //
$(document).on('page:init', '.page[data-name="cms"]', function (page) {
  menuload();
  checkConnection();
  app.panel.close();
  $(".bell_icon_cms").hide();
  var sess_designation = window.localStorage.getItem("sess_designation");
  if(sess_designation=='COMP. OPERATOR' || sess_designation=='SGL EIC'){
    $(".addcmsbtn").removeClass("display-none");
    $(".addcmsbtn").addClass("display-block");
  }else{
    $(".addcmsbtn").removeClass("display-block");
    $(".addcmsbtn").addClass("display-none");
  }
  //var prevPageName = page.el.prev('.page').attr('data-name');
  //var prevPageName = page.$el.prev('.page').attr('data-name');
  //console.log(page.detail);
  var prev_page = page.detail.pageFrom.name;
  console.log(prev_page);
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
  $("#cms_month").html(mon_list);
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
  $("#cms_year").html(yrs);
  var session_uid = window.localStorage.getItem("session_uid");
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getEICUserStations',
    data:{'session_uid':session_uid},
    dataType:'json',
    success:function(result){
      $("#station_cms_lists").html(result.html);
    }    
  });
  //getDPRList(prev_page,c_mnth,c_year);
  getCMSList(prev_page);
});
function getPendingComps(){
  checkConnection();
  menuload();
  app.preloader.show();
  var session_uid = window.localStorage.getItem("session_uid");
  var sess_designation = window.localStorage.getItem("sess_designation");
  var session_utype = window.localStorage.getItem("session_utype");
  var session_stid = window.localStorage.getItem("session_stid");
  mainView.router.navigate("/pending_cms/");
  $.ajax({
    type:'POST',  
    url:base_url+'APP/Appcontroller/getPendingCMSlist',
    data:{'session_uid':session_uid,'sess_designation':sess_designation,'session_utype':session_utype,'session_stid':session_stid},
    dataType:'json',
    success:function(result){    
      //console.log(result.cms_list);
      var pending_cmsList = result.cms_list;
      var pending_cnts = result.pending_cnts;
      //if(pending_cnts >=1){
        $(".bgcnt_pending").html("<span class='badge rd-badge bell_badge'>"+pending_cnts+"</span>");
        $(".bell_icon_cms").show();
      //}else{
      //  $(".bell_icon_cms").hide();
      //}
      $("#pending_cms_list").html(pending_cmsList); 
      $(".totalpending_cms").html("Total Records: ("+pending_cnts+")");
    }
  });
  app.preloader.hide();
}
function getCMSList(prev_page){
  checkConnection();
  menuload();
  app.preloader.show();
  var session_uid = window.localStorage.getItem("session_uid");
  var sess_designation = window.localStorage.getItem("sess_designation");
  var session_utype = window.localStorage.getItem("session_utype");
  var session_stid = window.localStorage.getItem("session_stid");
  if(prev_page=='add_cms'){
    //console.log("FORM "+prev_page);
    var station_id = null;
    var cms_month = $("#cms_month").val();
    var cms_year = $("#cms_year").val();
    //console.log("======"+station_id+"----"+cms_month+"-----"+cms_year);
  }else{
    var station_id = $("#station_cms_lists").val();
    if(station_id==''){
      station_id=null;
    }else{
      station_id=station_id;
    }
    var cms_month = $("#cms_month").val();
    var cms_year = $("#cms_year").val();
    //console.log(station_id+"----"+cms_month+"-----"+cms_year);
  }
  $.ajax({
    type:'POST',  
    url:base_url+'APP/Appcontroller/getCMSlist',
    data:{'session_uid':session_uid,'sess_designation':sess_designation,'station_id':station_id,'cms_month':cms_month,'cms_year':cms_year,'session_utype':session_utype,'session_stid':session_stid},
    dataType:'json',
    success:function(result){    
      //console.log(result.cms_list);
      var cmsList = result.cms_list;
      var total_cms = result.total_cms;
      var pending_cnts = result.pending_cnts;
      //alert(pending_cnts);
      if(total_cms==undefined){
        total_cms=0;
      }else{
        total_cms=total_cms;
      }
      //if(pending_cnts >=1){
        $(".bgcnt_pending").html("<span class='badge rd-badge bell_badge'>"+pending_cnts+"</span>");
        $(".bell_icon_cms").show();
      //}else{
      //  $(".bell_icon_cms").hide();
      //}
      $("#cms_list").html(cmsList); 
      $(".total_cms").html("Total Records: ("+total_cms+")");
    }
  });
  app.preloader.hide();
}
$(document).on('page:init', '.page[data-name="add_cms"]', function (page) {
  menuload();
  checkConnection();
  app.panel.close();
  var session_utype = window.localStorage.getItem("session_utype");
  var session_stid = window.localStorage.getItem("session_stid");
  $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/getMasterdata',
    data:{'session_utype':session_utype,'session_stid':session_stid},
    dataType:'json',
    success:function(result){
      $("#stations").html(result.stns);
      $("#sap_notification").val(result.sap_notification);
      $("#comp_equip").html(result.comp_equip);
      $("#equip_make").html(result.equip_make);
      $("#comp_prob").html(result.comp_prob);
    }    
  });
});
function get_equip(){
  var ce = $('#comp_equip').val();
  var stp = $('#stations').val();
  if(stp==''){
    app.dialog.alert("Select station");
  }else if(ce==''){
    app.dialog.alert("Select complaint equipment");
  }else{
    $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/get_eqp_make',
    data:{'ce':ce,'stp':stp},
    dataType:'json',
    success:function(result){
      $("#equip_make").html(result.html);
      $("#comp_prob").html(result.html_cp);
    }    
  });
  }
}
function edit_get_equip(){
  var ce = $('#comp_equip_edit').val();
  var stp = $('#stations_edit').val();
  if(stp==''){
    app.dialog.alert("Select station");
  }else if(ce==''){
    app.dialog.alert("Select complaint equipment");
  }else{
    $.ajax({
    type:'POST', 
    url:base_url+'APP/Appcontroller/get_eqp_make',
    data:{'ce':ce,'stp':stp},
    dataType:'json',
    success:function(result){
      $("#equip_make_edit").html(result.html);
      $("#comp_prob_edit").html(result.html_cp);
    }    
  });
  }
}
function cmsadd(){
  menuload();
  checkConnection();
  var session_uid = window.localStorage.getItem("session_uid");
  var form_cms = $(".form_cms").serialize();
  var stations = $('input[name="stations"]').val();
  var comp_equip = $('input[name="comp_equip"]').val();
  var equip_make = $('input[name="equip_make"]').val();
  var comp_prob = $('input[name="comp_prob"]').val();
  if(stations==''){
    app.dialog.alert("Select station");
    return false;
  }else if(comp_equip==''){
    app.dialog.alert("Select complaint equipment");
    return false;
  }else if(equip_make==''){
    app.dialog.alert("Select equipment make");
    return false;
  }else if(comp_prob==''){
    app.dialog.alert("Select complaint problem");
    return false;
  }else{
    $.ajax({
      type:'POST', 
      url:base_url+'APP/Appcontroller/addCMS',
      data:form_cms+"&session_uid="+session_uid,  
      success:function(res_cms){
        var parse_msg = $.parseJSON(res_cms);
        var msg = parse_msg.msg;
        if(msg=='inserted'){
          app.dialog.alert("Complaint added successfully!");
          mainView.router.navigate("/cms/");
        }else if(msg=='available'){
          app.dialog.alert("Given SAP notification is already available.");
        }
      } 
    });
  }
}
function getcmsdetails(c_id,stname,complainer_nm,status,clr){
  app.preloader.show();   
  var session_uid = window.localStorage.getItem("session_uid");
  var sess_designation = window.localStorage.getItem("sess_designation");
  var session_utype = window.localStorage.getItem("session_utype");
  mainView.router.navigate("/cms_details/"+c_id+"/"+stname+"/"+complainer_nm+"/"+status+"/"+clr+"/");
  app.preloader.hide();
}
$(document).on('page:init', '.page[data-name="cms_details"]', function (page) {
  menuload();
  checkConnection();
  app.panel.close();
  app.preloader.show();
  var c_id = page.detail.route.params.c_id; 
  var st_name = page.detail.route.params.st_name; 
  var complainer_nm = page.detail.route.params.complainer_nm;
  var status = page.detail.route.params.status;
  var clr = page.detail.route.params.clr;
  var sess_designation = window.localStorage.getItem("sess_designation");
  $.ajax({
    type:'POST',  
    url:base_url+'APP/Appcontroller/getcmsdata',
    data:{'c_id':c_id,'stname':st_name,'complainer_nm':complainer_nm,'status':status,'clr':clr,'sess_designation':sess_designation},
    dataType:'json',
    success:function(result){    
      //console.log(result.cms_list);
      var comp_det = result.comp_det;
      var html = result.html;
      $(".comp_det").html(comp_det); 
      $(".replace_tbl").html(html);
    }
  });
  app.preloader.hide();
});
function editcomplain(c_id){
  checkConnection();
  mainView.router.navigate("/edit_cms/"+c_id+"/");
}
$(document).on('page:init', '.page[data-name="edit_cms"]', function (page) {
  menuload();
  app.panel.close();
  checkConnection();  
  var c_id = page.detail.route.params.c_id;
  var session_utype = window.localStorage.getItem("session_utype");
  var session_stid = window.localStorage.getItem("session_stid");  
  app.preloader.show();
  $.ajax({
    type:'POST',  
    url:base_url+'APP/Appcontroller/editcmsdata',
    data:{'c_id':c_id,'session_utype':session_utype,'session_stid':session_stid},
    dataType:'json',
    success:function(result){    
      //console.log(result.cms_list);            
      var edit_cmt_det = result.edit_cmt_det;
      $(".editcms_form").html(edit_cmt_det);
      var calendarModal_edit = app.calendar.create({
        inputEl: '#start_dt_edit',
        openIn: 'customModal',
        dateFormat: 'dd-mm-yyyy',
        header: true,
        footer: true,
        renderToolbar: function () {   
          return '<div class="toolbar no-shadow"><div class="toolbar-inner"><div class="calendar-month-selector"><a href="#" class="link icon-only calendar-prev-month-button"><i class="f7-icons ">chevron_left</i></a><span class="current-month-value"></span><a href="#" class="link icon-only calendar-next-month-button"><i class="f7-icons ">chevron_right</i></a></div><div class="calendar-year-selector"><a href="#" class="link icon-only calendar-prev-year-button"><i class="f7-icons ">chevron_left</i></a><span class="current-year-value"></span><a href="#" class="link icon-only calendar-next-year-button"><i class="f7-icons ">chevron_right</i></a></div></div></div>'; 
        }
      });
      var today = new Date();
      var pickerInline = app.picker.create({
        containerEl: '#demo-picker-time-container',
        inputEl: '#start_tm_edit_new',
        toolbar: false,
        rotateEffect: true,
        value: [
          today.getHours(),
          today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
        ],
        formatValue: function (values, displayValues) {
          return displayValues[0] + ':' + values[1];
          //return displayValues[0] +' '+values[3] + ':' + values[4];
        },
        cols: [
          
          // Hours
          {
            values: (function () {
              var arr = [];
              for (var i = 0; i <= 23; i++) { if(i<=9){ i="0"+i;}else{ i=i; } arr.push(i); }
                return arr;
            })(),
          },
          // Divider
          {
            divider: true,
            content: ':'
          },
          // Minutes
          {
            values: (function () {
              var arr = [];
              for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                return arr;
            })(),
          }
        ],
        on: {
          change: function (picker, values, displayValues) {
            var daysInMonth = new Date(picker.value[2], picker.value[0]*1 + 1, 0).getDate();
            if (values[1] > daysInMonth) {
              picker.cols[1].setValue(daysInMonth);
            }
          },
        }
      });
      $("#start_tm_edit_new").val("");
      var ce = $('#comp_equip_edit').val();
      var stp = $('#stations_edit').val();
      var hidd_comp_id = $("#hidd_comp_id").val();
      var hidd_prob_id = $("#hidd_prob_id").val();

      //alert(ce + '==='+stp);
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/get_eqp_make',
        data:{'ce':ce,'stp':stp},
        dataType:'json',
        success:function(result){
          $("#equip_make_edit").html(result.html);
          $("#comp_prob_edit").html(result.html_cp);
          $("#equip_make_edit").val(hidd_comp_id);
          $("#comp_prob_edit").val(hidd_prob_id); 
        }    
      });
      app.preloader.hide(); 
    }
  }); 
});
function cmsedit(){
  checkConnection();
  menuload();  
  var session_uid = window.localStorage.getItem("session_uid");
  var form_cms_edit = $(".form_cms_edit").serialize();
  var sttm = $("#sttm").val();
  var start_tm_edit_new = $("#start_tm_edit_new").val();
  //alert(sttm+"===="+start_tm_edit_new);
  var time1 = sttm.split(':');
  var time2 = start_tm_edit_new.split(':');
  if(eval(time1[0]) > eval(time2[0])){
      app.dialog.alert("Start time must be greater than time");
      return false;
  }else{
    if(eval(time1[0]) == eval(time2[0]) && eval(time1[1]) > eval(time2[1])){
      app.dialog.alert("Start time must be greater than time");
      return false;
    }else{
      app.preloader.show();
      $.ajax({ 
        type:'POST',  
        url:base_url+'APP/Appcontroller/editcms',
        data:form_cms_edit+"&session_uid="+session_uid,
        success:function(result){
          var parseupdate = $.parseJSON(result);
          var msg = parseupdate.msg;
          alert(msg);
          if(msg=='updated'){
            app.dialog.alert("Complaint updated successfully!");
            mainView.router.navigate("/cms/");
          }else if(msg=='not_updated'){
            app.dialog.alert("Problem updating complaint!");
            mainView.router.navigate("/cms/");
          }
        }
      });
      app.preloader.hide();
    }
  }   
}

function receive_comp(complain_id){
  checkConnection();
  menuload();
  app.preloader.show();
  mainView.router.navigate("/receive_cms/");
  var session_uid = window.localStorage.getItem("session_uid");
  $.ajax({
    type:'POST',  
    url:base_url+'APP/Appcontroller/receive_cms',
    data:{'session_uid':session_uid,'complain_id':complain_id},
    success:function(result){
      var parse_res = $.parseJSON(result);
      var msg = parse_res.msg;
      var receive_comp = parse_res.receive_comp;
      /*if(msg=='received'){
        app.dialog.alert("Complaint Received!");
      }*/
      $(".receive_comp").html(receive_comp);
    },
    /*complete: function (data) {
      $(".tab_logic").hide();
    }*/
  });
  app.preloader.hide();
}
function show_block(chkd){
  if($(chkd).prop('checked') === true){
    $(".tab_logic").show();
    $(".divname input").prop('required',true);
    $(".divname select").prop('required',true);
    $(".hidetxtpart_0 input").prop('disabled',true);
    $(".hidetxtmake_0 input").prop('disabled',true); 
    $(".hidetxtpart_0 input").prop('required',false);
    $(".hidetxtmake_0 input").prop('required',false); 
  }else{
    $(".tab_logic").hide();
  }
}
function getotherparts(divid){
  checkConnection();
  app.preloader.show();
  $.ajax({
    type:'POST',  
    url:base_url+'APP/Appcontroller/otherparts',    
    success:function(result){
      var parseRes = $.parseJSON(result);
      var complain_part = parseRes.complain_part;
      var sel_vals='';
      sel_vals+='<option value="">--- SELECT ---</option>';
      for(var i=0;i<complain_part.length;i++){
        var part_name = complain_part[i].part_name;
        sel_vals+='<option value="'+part_name+'">'+part_name+'</option>';
      }
      $(".other_part_"+divid).html(sel_vals);
    }
  })
  app.preloader.hide();
}
var i=1;
var divhtml='';
function addrow(){
  $(".addr"+i).html('<div class="card mt0"><input type="hidden" name="hidd_div_id" id="hidd_div_id_'+i+'" value="'+i+'" /><div class="card-content card-content-padding"><div class="list accordion-list"><ul><li class="accordion-item elevation-9 accordion-item-opened" style="background-color: lightgrey!important"><a href="#" class="item-content item-link"><div class="item-inner"><!--div class="item-title text-uppercase fs-14">replace item - '+(i+1)+'</div--><div class="item-title text-uppercase fs-14">replace item</div><div class="item-title text-uppercase float-right"><span class="fs-12"></span></div></div></a><div class="accordion-item-content" style="background-color: #fff;"><div class="block p-5"><div class="row"><div class="col-90 item-title text-uppercase fs-14 float-left" ></div><div class="col-10 item-title text-uppercase fs-14 float-right" ><i class="txtrd fw-600 f7-icons mr-20 fs-20" onclick="dltdiv('+i+')">trash</i></div></div><div class="row"><div class="col-40"><span class="text-uppercase fs-12 fw-600" style="width:55%;padding-right: 0px!important">sap code <label class="item-checkbox item-content"><input type="checkbox" name="na_sap_check[]" id="na_sap_check_'+i+'" onchange="readonly_saptxt(this,'+i+')" novalidate/><i class="icon icon-checkbox"></i><div class="item-inner"><div class="item-title">NA</div></div></label></span></div><div class="col-60 rep_txt"><input type="text" name="sap_code[]" id="sap_code_'+i+'" class="sapcode" required /></div></div><div class="row"><div class="col-40"><span class="text-uppercase fs-12 fw-600" style="width:55%;padding-right: 0px!important">Part<label class="item-checkbox item-content"><input type="checkbox" name="other_part_check[]" id="other_part_check_'+i+'" onchange="show_oparttxt(this,'+i+')" novalidate/><i class="icon icon-checkbox"></i><div class="item-inner min-w-auto"><div class="item-title">Other</div></div></label></span></div><div class="col-60 rep_txt hideselpart_'+i+'"><select class="form-control otherpart_sel" name="other_part[]" id="other_part_'+i+'" required></select></div>    <div class="col-60 rep_txt txthidepart hidetxtpart_'+i+'"><input type="text" name="other_part[]" id="other_part_'+i+'" /></div></div><div class="row"><div class="col-40"><span class="text-uppercase fs-12 fw-600" style="width:55%;padding-right: 0px!important">Make<label class="item-checkbox item-content"><input type="checkbox" name="other_make_check[]" id="other_make_check_'+i+'" onchange="show_maketxt(this,'+i+')" novalidate/><i class="icon icon-checkbox"></i><div class="item-inner min-w-auto"><div class="item-title">Other</div></div></label></span></div><div class="col-60 rep_txt hideselmake_'+i+'"><select class="form-control othermake_sel" name="other_make[]" id="other_make_'+i+'" required></select></div>      <div class="col-60 rep_txt txthidemake hidetxtmake_'+i+'"><input type="text" name="other_make[]" id="other_make_'+i+'"  /></div></div><div class="row"><div class="col-20 mt-10"><span class="">UOM</span></div><div class="col-80 rep_txt"><input type="text" name="uom[]" id="uom_'+i+'" required/></div></div><div class="row"><div class="col-20 mt-10"><span class="">QTY</span></div><div class="col-80 rep_txt"><input type="number" name="qty[]" id="qty_'+i+'" required/></div></div><br/><div class="list"><ul><li class="item-content item-input showtwoBlocks"><div class="item-inner"><span class="item-title item-label floatlbl_placeholder mb-15">Image</span><div class="item-input-wrap"><div class="uploadDiv w-100 "><div class="col-100"><div class="row"><div class="20"></div><div class="col-50 picbox text-white" ><span onclick="capturePhoto_cms_adddiv('+i+');" ><div class="innerDiv"><img src="img/photo-camera-1.png" height="30" width="30" /><br/><span class="picbox-text">Capture</span></span></div></div><div class="col-50 picbox text-white" ><a onclick="getPhoto_cms_adddiv(pictureSource.PHOTOLIBRARY,'+i+');"><div class="innerDiv"><img src="img/gallery.png" height="30" width="30" /><br/><span class="picbox-text">Photo Gallery</span></div></a></div><div class="20"></div></div></div></div></div></li><li class="item-content item-input imageblock_cms_'+i+' display-none" style="width:100%;" id="imageblock_cms_'+i+'"><div class="item-inner"><div class="item-input-wrap"><img id="image_cms_'+i+'" src="" class="" style="width:100%;"></div></div></li></ul></div></div><!--- block p-5 --></div><!--- accordion-item-content --></li></ul></div><!--- list accordion-list --></div><!--- card-content --></div><!-- first_block -->');   
      $.ajax({ 
        type:'POST',  
        url:base_url+'APP/Appcontroller/otherparts',    
        success:function(result){
          var parseRes = $.parseJSON(result);
          var complain_part = parseRes.complain_part;
          var company = parseRes.company;
          var sel_vals='';
          var sel_comp='';
          sel_vals+='<option value="">--- SELECT ---</option>';
          for(var i1=0;i1<complain_part.length;i1++){
            var part_name = complain_part[i1].part_name;
            var val_part_name = part_name.split(' ').join('_');
            sel_vals+='<option value="'+val_part_name+'">'+part_name+'</option>';
          }
          $("#other_part_"+(i-1)).html(sel_vals);

          sel_comp+='<option value="">--- SELECT ---</option>';
          for(var i2=0;i2<company.length;i2++){
            var comp_name = company[i2].comp_name;
            var val_comp_name = comp_name.split(' ').join('_');
            sel_comp+='<option value="'+val_comp_name+'">'+comp_name+'</option>';
          }
          $("#other_make_"+(i-1)).html(sel_comp);
        }
      });
    $(".hidetxtpart_"+i).hide(); 
    $(".hidetxtmake_"+i).hide();  
    $(".hidetxtpart_"+i+" input").prop('disabled',true);
    $(".hidetxtmake_"+i+" input").prop('disabled',true); 
    $(".hidetxtpart_"+i+" input").prop('required',false);
    $(".hidetxtmake_"+i+" input").prop('required',false); 
    $('#tab_logic').append('<div class="addr'+(i+1)+' mt-5 divname"></tr>');
    i++; 
   // n++;
}

function addrow_change(){
  var divname_len = $(".divname").length-1;
  //alert(divname_len);
  var chnage_div=divname_len;
  $(".addr_change"+chnage_div).html('<div class="card first_block mt'+chnage_div+'"><input type="hidden" name="hidd_div_id_change" id="hidd_div_id_'+chnage_div+'" value="'+chnage_div+'"/><div class="card-content card-content-padding"><div class="list accordion-list"><ul><li class="accordion-item elevation-9 accordion-item-opened" style="background-color: lightgrey!important"><a href="#" class="item-content item-link"><div class="item-inner"><div class="item-title text-uppercase fs-14">replace item</div><div class="item-title text-uppercase float-right"><span class="fs-12"></span></div></div></a><div class="accordion-item-content" style="background-color: #fff;"><div class="block p-5"><div class="row"><div class="col-90 item-title text-uppercase fs-14 float-left" ></div><div class="col-10 item-title text-uppercase fs-14 float-right" ><i class="txtrd fw-600 f7-icons mr-20 fs-20" onclick="dltdiv_change('+chnage_div+',"NULL")">trash</i></div></div><div class="row"><div class="col-40"><span class="text-uppercase fs-12 fw-600" style="width:55%;padding-right: 0px!important">sap code <label class="item-checkbox item-content"><input type="checkbox" name="na_sap_check_change[]" id="na_sap_check_'+chnage_div+'" onchange="readonly_saptxt(this,'+chnage_div+')" novalidate /><i class="icon icon-checkbox"></i><div class="item-inner"><div class="item-title">NA</div></div></label></span></div><div class="col-60 rep_txt"><input type="text" name="sap_code_change[]" id="sap_code_'+chnage_div+'" class="sapcode" required /></div></div><div class="row"><div class="col-40"><span class="text-uppercase fs-12 fw-600" style="width:55%;padding-right: 0px!important">Part<label class="item-checkbox item-content"><input type="checkbox" name="other_part_check_change[]" id="other_part_check_'+chnage_div+'" onchange="show_oparttxt(this,'+chnage_div+')" novalidate/><i class="icon icon-checkbox"></i><div class="item-inner min-w-auto"><div class="item-title">Other</div></div></label></span></div><div class="col-60 rep_txt hideselpart_'+chnage_div+'"><select class="form-control otherpart_sel" name="other_part_change[]" id="other_part_'+chnage_div+'" required><option value="">--- SELECT ---</option></select></div><div class="col-60 rep_txt txthidepart hidetxtpart_'+chnage_div+' "><input type="text" name="other_part_change[]" id="other_part_'+chnage_div+'" class=""/></div></div><div class="row"><div class="col-40"><span class="text-uppercase fs-12 fw-600" style="width:55%;padding-right: 0px!important">Make<label class="item-checkbox item-content"><input type="checkbox" name="other_make_check_change[]" id="other_make_check_'+chnage_div+'" onchange="show_maketxt(this,'+chnage_div+')" novalidate/><i class="icon icon-checkbox"></i><div class="item-inner min-w-auto"><div class="item-title">Other</div></div></label></span></div><div class="col-60 rep_txt hideselmake_'+chnage_div+'"><select class="form-control othermake_sel" name="other_make_change[]" id="other_make_'+chnage_div+'" required><option value="">--- SELECT ---</option></select></div><div class="col-60 rep_txt txthidemake hidetxtmake_'+chnage_div+'"><input type="text" name="other_make_txt_chnage[]" id="other_make_txt_'+chnage_div+'" /></div></div><div class="row"><div class="col-20 mt-10"><span class="">UOM</span></div><div class="col-80 rep_txt"><input type="text" name="uom_change[]" id="uom_'+chnage_div+'" required /></div></div><div class="row"><div class="col-20 mt-10"><span class="">QTY</span></div><div class="col-80 rep_txt"><input type="number" name="qty_change[]" id="qty_'+chnage_div+'" required /></div></div><br/><div class="list"><ul><li class="item-content item-input showtwoBlocks"><div class="item-inner"><span class="item-title item-label floatlbl_placeholder mb-15">Image</span><div class="item-input-wrap"><div class="uploadDiv w-100 "><div class="col-100"><div class="row"><div class="20"></div><div class="col-50 picbox text-white" ><span onclick="capturePhoto_cms_adddiv('+chnage_div+')" ><div class="innerDiv"><img src="img/photo-camera-1.png" height="30" width="30" /><br/><span class="picbox-text">Capture</span></span></div></div><div class="col-50 picbox text-white" ><a onclick="getPhoto_cms_adddiv(pictureSource.PHOTOLIBRARY,'+chnage_div+')"><div class="innerDiv"><img src="img/gallery.png" height="30" width="30" /><br/><span class="picbox-text">Photo Gallery</span></div></a></div><div class="20"></div></div></div></div></div></li><li class="item-content item-input imageblock_cms_'+chnage_div+' display-none" style="width:100%;" id="imageblock_cms_'+chnage_div+'"><div class="item-inner"><div class="item-input-wrap"><img id="image_cms_'+chnage_div+'" src="img/dashboard.jpg" style="width:100%;"></div></div></li><li class="item-content item-input" style="width:100%;" id=""><div class="item-inner"></div></li></ul></div></div><!--- block p-5 --></div><!--- accordion-item-content --></li></ul></div><!--- list accordion-list --></div><!--- card-content --></div><!-- first_block -->'); 
      $.ajax({ 
        type:'POST',  
        url:base_url+'APP/Appcontroller/otherparts',    
        success:function(result){
          var parseRes = $.parseJSON(result);
          var complain_part = parseRes.complain_part;
          var company = parseRes.company;
          var sel_vals='';
          var sel_comp='';
          sel_vals+='<option value="">--- SELECT ---</option>';
          for(var i1=0;i1<complain_part.length;i1++){
            var part_name = complain_part[i1].part_name;
            var val_part_name = part_name.split(' ').join('_');
            sel_vals+='<option value="'+val_part_name+'">'+part_name+'</option>';
          }
          $("#other_part_"+(chnage_div-1)).html(sel_vals);

          sel_comp+='<option value="">--- SELECT ---</option>';
          for(var i2=0;i2<company.length;i2++){
            var comp_name = company[i2].comp_name;
            var val_comp_name = comp_name.split(' ').join('_');
            sel_comp+='<option value="'+val_comp_name+'">'+comp_name+'</option>';
          }
          $("#other_make_"+(chnage_div-1)).html(sel_comp);
        }
      });
    $(".hidetxtpart_"+chnage_div).hide(); 
    $(".hidetxtmake_"+chnage_div).hide();  
    $(".hidetxtpart_"+chnage_div+" input").prop('disabled',true);
    $(".hidetxtmake_"+chnage_div+" input").prop('disabled',true); 
    $(".hidetxtpart_"+chnage_div+" input").prop('required',false);
    $(".hidetxtmake_"+chnage_div+" input").prop('required',false);
    $('#tab_logic').append('<div class="addr_change'+(chnage_div+1)+' mt-5 divname"></tr>');
    chnage_div++;
}
function dltdiv(divid){
    $(".addr"+(divid)).html('');
    divid--;
}
var oldimg_arr=[];
function dltdiv_change(divid,imgold){ 
  //alert(imgold);
  if(imgold!="NULL"){ 
    var todelimg=$("#hidden_old_images_"+divid).val();
    //alert("#hidden_old_images_"+divid+"======="+todelimg);
    oldimg_arr.push(todelimg);
    $("#hidd_old_img_arr").val(oldimg_arr);
  }
  $(".addr_change"+(divid)).html('');
  divid--;
}
function readonly_saptxt(obj,divid){
  if($(obj).prop('checked') === true){
    $("#sap_code_"+divid).val('NA');
    $("#sap_code_"+divid).prop('readonly',true);
    $("#sap_code_"+divid).addClass("readonly");
  }else{
    $("#sap_code_"+divid).val('');
    $("#sap_code_"+divid).prop('readonly',false);
    $("#sap_code_"+divid).removeClass("readonly");
  }
}
function readonly_saptxt_change(obj,divid,sapcode){
  if($(obj).prop('checked') === true){
    $("#sap_code_"+divid).val('NA');
    $("#sap_code_"+divid).prop('readonly',true);
    $("#sap_code_"+divid).addClass("readonly");
  }else{
    $("#sap_code_"+divid).val(sapcode);
    $("#sap_code_"+divid).prop('readonly',false);
    $("#sap_code_"+divid).removeClass("readonly");
  }
}
function show_oparttxt(obj,divid){
  if($(obj).prop('checked') === true){
    $(".hideselpart_"+divid).hide();
    $(".hidetxtpart_"+divid).show();

    $(".hideselpart_"+divid+" select").prop('disabled',true);
    $(".hidetxtpart_"+divid+" input").prop('disabled',false);

    $(".hidetxtpart_"+divid+" input").prop('required',true);
    $(".hideselpart_"+divid+" select").prop('required',false);

  }else{
    $(".hideselpart_"+divid).show(); 
    $(".hidetxtpart_"+divid).hide();

    $(".hideselpart_"+divid+" select").prop('disabled',false);
    $(".hidetxtpart_"+divid+" input").prop('disabled',true);

    $(".hidetxtpart_"+divid+" input").prop('required',false);
    $(".hideselpart_"+divid+" select").prop('required',true);
  }
}
function show_oparttxt_change(obj,divid,part){
  if($(obj).prop('checked') === true){
    $(".hideselpart_"+divid).hide();
    $(".hidetxtpart_"+divid).removeClass('display-none');
    $(".hidetxtpart_"+divid).show();

    $(".hideselpart_"+divid+" select").prop('disabled',true);
    $(".hidetxtpart_"+divid+" input").prop('disabled',false);

    $(".hidetxtpart_"+divid+" input").prop('required',true);
    $(".hideselpart_"+divid+" select").prop('required',false);

  }else{
    $(".hideselpart_"+divid).show(); 
    $(".hidetxtpart_"+divid).hide();

    $(".hideselpart_"+divid+" select").prop('disabled',false);
    $(".hidetxtpart_"+divid+" input").prop('disabled',true);

    $(".hidetxtpart_"+divid+" input").prop('required',false);
    $(".hideselpart_"+divid+" select").prop('required',true);
  }
}
function show_maketxt(obj,divid){
  if($(obj).prop('checked') === true){
    $(".hideselmake_"+divid).hide();
    $(".hidetxtmake_"+divid).show();

    $(".hidetxtmake_"+divid+" input").prop('required',true);
    $(".hideselmake_"+divid+" select").prop('required',false);

    $(".hidetxtmake_"+divid+" input").prop('disabled',false);
    $(".hideselmake_"+divid+" select").prop('disabled',true);
  }else{
    $(".hideselmake_"+divid).show(); 
    $(".hidetxtmake_"+divid).hide();

    $(".hidetxtmake_"+divid+" input").prop('required',false);
    $(".hideselmake_"+divid+" select").prop('required',true);

    $(".hidetxtmake_"+divid+" input").prop('disabled',true); 
    $(".hideselmake_"+divid+" select").prop('disabled',false);      
  }
}
function show_maketxt_change(obj,divid,make){
  if($(obj).prop('checked') === true){
    $(".hideselmake_"+divid).hide();
    $(".hidetxtmake_"+divid).removeClass('display-none');
    $(".hidetxtmake_"+divid).show();

    $(".hidetxtmake_"+divid+" input").prop('required',true);
    $(".hideselmake_"+divid+" select").prop('required',false);

    $(".hidetxtmake_"+divid+" input").prop('disabled',false);
    $(".hideselmake_"+divid+" select").prop('disabled',true);
  }else{
    $(".hideselmake_"+divid).show(); 
    $(".hidetxtmake_"+divid).hide();

    $(".hidetxtmake_"+divid+" input").prop('required',false);
    $(".hideselmake_"+divid+" select").prop('required',true);

    $(".hidetxtmake_"+divid+" input").prop('disabled',true); 
    $(".hideselmake_"+divid+" select").prop('disabled',false);      
  }
}
function edit_cms(){
  checkConnection();
  menuload();
  //app.preloader.show();
  var form_cms_receive = $(".form_cms_receive").serialize();
  var hidd_complain_id = $("#hidd_complain_id").val();
  //console.log(form_cms_receive);
  var total = $(".divname").length-1;  
  var title = [];  
  for (var j=0; j<total; j++) {
    var hidd_div_id = $("#hidd_div_id_"+j).val();
    var sapcode = $("#sap_code_"+j).val();
    var other_part_chk = $('#other_part_check_'+j).prop('checked');
    if(other_part_chk === true){
      var other_part = $(".hidetxtpart_"+j+" input").val();
    }else{
      var other_part = $(".hideselpart_"+j+" select").val();
    }
    var make_chk = $('#other_make_check_'+j).prop('checked');
    if(make_chk === true){
      var ohter_make = $(".hidetxtmake_"+j+" input").val();
    }else{
      var ohter_make = $(".hideselmake_"+j+" select").val();
    }
    var uom = $("#uom_"+j).val();
    var qty = $("#qty_"+j).val();    
    var img = $('#imageblock_cms_'+j+' img').attr('src');
    //alert("@@@@@@@@@@@@@@@@ "+uploadvar);
    title[j] = {
        sapcode: sapcode,
        part: other_part,
        make: ohter_make, 
        uom: uom,
        qty: qty,
        image: img,

    };
  }  
  var arrsend=JSON.stringify(title);
  //console.log(arrsend+"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

  $.ajax({
    type:'POST',  
    dataType: 'json', 
    url:base_url+'APP/Appcontroller/technical_comp_update',
    data:form_cms_receive+"&arr="+arrsend,   
    success:function(result){
      //var resparsejson = $.parseJSON(result);
      //var msg = resparsejson.msg;
      //var img_arr = resparsejson.img_arr;  
      //alert("in success "+result);
      var msg = result.msg;
      var img_arr = result.img_arr; 
      var source = result.source;      
      if(msg=='updated'){        
        app.dialog.alert("Items replaced!");
        for(var j2=0;j2<img_arr.length;j2++){
          var hidd_div = $("#hidd_div_id_"+j2).val();
          //var old_images='NULL';
          //alert("!!!!!!!!! "+source[j2]);
          //uploaditem_images(old_images,img_arr[j2],hidd_div,source[j2]);
          var img = $('#imageblock_cms_'+j2+' img').attr('src');
          var img_div = document.getElementById('image_cms_'+hidd_div);
          var imageURI = img_div.src;
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
          //var imgfilename = params.name;
          var imgfilename = img_arr[j2];
          //var split_imgfilename = imgfilename.split("?");
          var ft = new FileTransfer();
          //console.log("ft :::::::::: "+ft);
          //alert(imageURI);
          /*var actual_imgname1 = split_imgfilename[0];
          var img_filename1 = actual_imgname1.split('%20').join('_');*/
          //alert(img_filename1);
          var upload_itemdets = base_url+"APP/Appcontroller/item_imgsupload/"+imgfilename;
          //alert(upload_itemdets);
          //var uploadvar=ft.upload(imageURI,upload_itemdets,win,fail,options,true);

          ft.upload(imageURI,upload_itemdets,function(r){
            var res_code = r.responseCode;
            if(res_code==200){
              mainView.router.navigate("/cms/");
            }
          } ,fail,options,true);          
        }        
      }else if(msg=='not_updated'){
        app.dialog.alert("Problem in updating complaint");
        mainView.router.navigate("/cms/");
      }
    }
  });
  //app.preloader.hide();
}
function changecomplain(c_id){
  checkConnection();
  mainView.router.navigate("/change_cms_eic/"+c_id+"/");
}
$(document).on('page:init', '.page[data-name="change_cms_eic"]', function (page) {
  menuload();
  app.panel.close();
  checkConnection();  
  var c_id = page.detail.route.params.c_id;
  var session_utype = window.localStorage.getItem("session_utype");
  var session_stid = window.localStorage.getItem("session_stid");  
  app.preloader.show();
  $.ajax({
    type:'POST',  
    url:base_url+'APP/Appcontroller/chnagecmsdata_eic',
    data:{'c_id':c_id,'session_utype':session_utype,'session_stid':session_stid},
    dataType:'json',
    success:function(result){               
      var changecms_form = result.changecms_form;
      $(".changecms_form").html(changecms_form);
      var rep_sttm = $("#rep_sttm").val();
      var rep_endtm = $("#rep_endtm").val();

        var calendarModal_edit = app.calendar.create({
          inputEl: '#rep_start_dt_change',
          openIn: 'customModal',
          dateFormat: 'dd-mm-yyyy',
          header: true,
          footer: true,
          renderToolbar: function () {   
            return '<div class="toolbar no-shadow"><div class="toolbar-inner"><div class="calendar-month-selector"><a href="#" class="link icon-only calendar-prev-month-button"><i class="f7-icons ">chevron_left</i></a><span class="current-month-value"></span><a href="#" class="link icon-only calendar-next-month-button"><i class="f7-icons ">chevron_right</i></a></div><div class="calendar-year-selector"><a href="#" class="link icon-only calendar-prev-year-button"><i class="f7-icons ">chevron_left</i></a><span class="current-year-value"></span><a href="#" class="link icon-only calendar-next-year-button"><i class="f7-icons ">chevron_right</i></a></div></div></div>'; 
          }
        });
        // rep start time picker //
        var today = new Date();
        var pickerInline = app.picker.create({
          containerEl: '#demo-picker-repstarttime-container',
          inputEl: '#repst_tm_change_new',
          toolbar: false,
          rotateEffect: true,
          value: [
            today.getHours(),
            today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
          ],
          formatValue: function (values, displayValues) {            
            return displayValues[0] + ':' + values[1];
            //return displayValues[0] +' '+values[3] + ':' + values[4];
          },
          cols: [
            
            // Hours
            {
              values: (function () {
                var arr = [];
                for (var i = 0; i <= 23; i++) { if(i<=9){ i="0"+i;}else{ i=i; } arr.push(i); }
                  return arr;
              })(),
            },
            // Divider
            {
              divider: true,
              content: ':'
            },
            // Minutes
            {
              values: (function () {
                var arr = [];
                for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                  return arr;
              })(),
            }
          ],
          on: {
            change: function (picker, values, displayValues) {
              var daysInMonth = new Date(picker.value[2], picker.value[0]*1 + 1, 0).getDate();
              if (values[1] > daysInMonth) {
                picker.cols[1].setValue(daysInMonth);                
              }
            },
          }
        });
        // rep end time picker //
        var today = new Date();
        var pickerInline = app.picker.create({
          containerEl: '#demo-picker-rependtime-container',
          inputEl: '#end_tm_rep_change_new',
          toolbar: false,
          rotateEffect: true,
          value: [
          
            today.getHours(),
            today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
          ],

          formatValue: function (values, displayValues) {            
            return displayValues[0] + ':' + values[1];
            //return displayValues[0] +' '+values[3] + ':' + values[4];
          },
          cols: [
            
            // Hours
            {
              values: (function () {
                var arr = [];
                for (var i = 0; i <= 23; i++) { if(i<=9){ i="0"+i;}else{ i=i; } arr.push(i); }
                  return arr;
              })(),
            },
            // Divider
            {
              divider: true,
              content: ':'
            },
            // Minutes
            {
              values: (function () {
                var arr = [];
                for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                  return arr;
              })(),
            }
          ],
          on: {
            change: function (picker, values, displayValues) {
            console.log("called");              
              /*var daysInMonth = new Date(picker.value[2], picker.value[0]*1 + 1, 0).getDate();
              if (values[1] > daysInMonth) {
                picker.cols[1].setValue(daysInMonth);                              
              }*/
            },
          }
        });
        $("#repst_tm_change_new").val("");
        $("#end_tm_rep_change_new").val("");
    }
  });
  app.preloader.hide();
});
function openimage(divid,image){
  var dynamicPopup = app.popup.create({
  content: '<div class="popup popup-img_'+divid+'">'+
            '<div class="block">'+                
              '<p><a href="#" class="link popup-close">Close me</a></p>'+
              '<p><img src="'+base_url+'uploads/cms/'+image+'" /></p>'+
            '</div>'+
          '</div>',
  });
  dynamicPopup.open();
}
function EIC_cmschange(){
  menuload();
  //alert("called");
  var form_cms_chnage = $(".form_cms_chnage").serialize();
  var hidd_cid = $("#hidd_cid").val();
  //alert(form_cms_chnage);
  var total_change = $(".divname").length-1;  
  var title_change = [];  
  for (var j=0; j<total_change; j++) {
    var hidd_div_id = $("#hidd_div_id_"+j).val();
    var sapcode = $("#sap_code_"+j).val();
    var other_part_chk = $('#other_part_check_'+j).prop('checked');
    if(other_part_chk === true){
      var other_part = $(".hidetxtpart_"+j+" input").val();
    }else{
      var other_part = $(".hideselpart_"+j+" select").val();
    }
    var make_chk = $('#other_make_check_'+j).prop('checked');
    if(make_chk === true){
      var ohter_make = $(".hidetxtmake_"+j+" input").val();
    }else{
      var ohter_make = $(".hideselmake_"+j+" select").val();
    }
    var uom = $("#uom_"+j).val();
    var qty = $("#qty_"+j).val();    
    //var img = $('#hidden_old_images_'+j).val();
    //alert("######################## "+img);
    var img = $('#imageblock_cms_'+j+' img').attr('src');
    //alert(img);
    /*if(img==undefined){
      // new image //
      var img_old = 'NULL';
      var upload_new = $('#imageblock_cms_'+j+' img').attr('src');
      var new_image = upload_new;
    }else{
      // old images //
      var img_old = img;
      var new_image = 'NULL';
    }*/
    //alert("sapcode "+sapcode);
    if(img==''){
      var img_old = $('#hidden_old_images_'+j).val();
      var new_image = img_old;
    }else{
      var img_old = 'NULL';
      var upload_new = $('#imageblock_cms_'+j+' img').attr('src');
      var new_image = upload_new;
    }
    if(sapcode!=undefined || sapcode!=null){
    //alert("OLD "+img_old+" @@@@@@@@@@@@@@@@ NEW"+new_image);
      title_change[j] = {
          sapcode: sapcode,
          part: other_part,
          make: ohter_make, 
          uom: uom,
          qty: qty,
          image: img_old,
          newimage:new_image,
      }; 
    } 
  }  
  var arrsend_change=JSON.stringify(title_change);
  //console.log(form_cms_chnage);
  console.log(arrsend_change);
  var hidd_old_img_arr = $("#hidd_old_img_arr").val();
  var unlink_imgs = JSON.stringify(hidd_old_img_arr);
  //alert(arrsend_change);
  $.ajax({
    type:'POST',  
    dataType: 'json', 
    url:base_url+'APP/Appcontroller/eic_comp_update',
    data:form_cms_chnage+"&arr="+arrsend_change+"&unlink_imgs="+unlink_imgs,   
    success:function(result){
      //alert("RESULT "+result);
      var msg = result.msg;
      var new_img_arr = result.new_img_arr;
      //alert(msg+"============= "+new_img_arr);
      if(msg=='updated'){ 
        for(var j2=0;j2<new_img_arr.length;j2++){
          var hidd_div = $("#hidd_div_id_"+j2).val();
          var img_old = $('#hidden_old_images_'+j2).val();
          var img_div = document.getElementById('image_cms_'+hidd_div);
          var imageURI = img_div.src;
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
          //var imgfilename = params.name;
          var imgfilename = new_img_arr[j2];
          //var split_imgfilename = imgfilename.split("?");
          var ft = new FileTransfer();
          //console.log("ft :::::::::: "+ft);
          //alert(imageURI);
          /*var actual_imgname1 = split_imgfilename[0];
          var img_filename1 = actual_imgname1.split('%20').join('_');*/
          //alert(imgfilename+"======="+img_old);
          if(imgfilename!='NA'){ 
            if(img_old!=imgfilename){
              var upload_itemdets = base_url+"APP/Appcontroller/item_imgsupload_change/"+imgfilename;
              ft.upload(imageURI,upload_itemdets,function(r){
                var res_code = r.responseCode;
                //alert(res_code+"res_code");
                if(res_code==200){
                  mainView.router.navigate("/cms/");
                }
              } ,fail,options,true);
            }else{
              mainView.router.navigate("/cms/");
            }
          }else{
            //mainView.router.navigate("/cms/");
          }          
        } 
      }else if(msg=='not_updated'){
        app.dialog.alert("Problem in updating complaint");
        mainView.router.navigate("/cms/");
      }
    } 
  });
}
function approve_comp(approve_comp_id){
  checkConnection();
  menuload();
  app.preloader.show();
  mainView.router.navigate("/approve_cms/");
  var session_uid = window.localStorage.getItem("session_uid");
  $.ajax({
    type:'POST',  
    url:base_url+'APP/Appcontroller/approve_cms',
    data:{'session_uid':session_uid,'complain_id':approve_comp_id},
    success:function(result){
      var parse_res = $.parseJSON(result);
      var approve = parse_res.approve;
      $(".approve_comp").html(approve);
    }
  });
  app.preloader.hide();
}
function apprv_status(status,approve_comp_id){
  checkConnection();
  menuload();
  app.preloader.show();
  $.ajax({
    type:'POST',  
    url:base_url+'APP/Appcontroller/approve_cms_status',
    data:{'status':status,'approve_comp_id':approve_comp_id},
    success:function(result){
      var parse_res = $.parseJSON(result);
      var msg = parse_res.msg;
      if(msg=='updated'){
        if(status==1){
          app.dialog.alert("Complaint approved successfully!");
        }else if(status==2){
          app.dialog.alert("Complaint rejected!");
        }
      }else{
        app.dialog.alert("Problem updating complaint status");
      }
      mainView.router.navigate("/cms/");
    }
  });
  app.preloader.hide();
}
function save_password(){
  checkConnection();
  var form_chnagepass = $(".form_chnagepass").serialize();
  var session_uid = window.localStorage.getItem("session_uid");
  var old_pass = $("#old_pass").val();
  var new_pass = $("#new_pass").val();
  var reent_pass = $("#reent_pass").val();
  if(old_pass==''){
    app.dialog.alert("Old password is required");
    return false;
  }else if(new_pass==''){
    app.dialog.alert("Enter new password");
    return false;
  }else if(reent_pass==''){
    app.dialog.alert("Re-type password is required");
    return false;
  }else{
    var chksamepass=compare_passwords_submit();
    if(chksamepass==false){
      $("#notsame_pass").html("<i class='f7-icons fs-14 mr-5'>xmark_circle_fill</i>Passwords not matched.");
      return false;
    }else{
    app.preloader.show();
      $.ajax({
        type:'POST', 
        url:base_url+'APP/Appcontroller/changepassword',
        data:form_chnagepass+"&session_uid="+session_uid,  
        success:function(authRes){ 
          var parsedata = $.parseJSON(authRes);
          var msg = parsedata.msg;
          if(msg=='updated'){
            app.dialog.alert("Password updated successfully!");
            mainView.router.navigate("/dashboard/");
            return false;
          }else if(msg=='wrong_old'){
            $("#old_pass").val('');
            $("#new_pass").val('');
            $("#reent_pass").val('');
            app.dialog.alert("Incorrect old password");
            return false;
          }
        }
      });
      app.preloader.hide(); 
    }
  }
}
function compare_passwords(){
  checkConnection();  
  var new_pass = $("#new_pass").val();
  var reent_pass = $("#reent_pass").val();
  if(new_pass!='' && reent_pass!=''){
    if(new_pass!=reent_pass){
      $("#notsame_pass").html("<i class='f7-icons fs-14 mr-5'>xmark_circle_fill</i>Passwords not matched.");
      return false;
    }else{
      $("#notsame_pass").html("");
      return false;
    }
  }
}
$(document).on('page:init', '.page[data-name="change_password"]', function (page) {
  menuload();
  checkConnection();
  app.panel.close();
});
function compare_passwords_submit(){
  checkConnection();  
  var new_pass = $("#new_pass").val();
  var reent_pass = $("#reent_pass").val();
  if(new_pass!='' && reent_pass!=''){
    if(new_pass!=reent_pass){
      return false;
    }else{
      return true;
    }
  }
}
function show_cmsimg(sapcode_img,imgpath){
  var dynamicPopup_img = app.popup.create({
  content: '<div class="popup popupsap-img_'+sapcode_img+'">'+
            '<div class="block">'+                
              '<p><a href="#" class="link popup-close">Close me</a></p>'+
              '<p><img src="'+imgpath+'" / width="330"></p>'+
            '</div>'+
          '</div>',
  });
  dynamicPopup_img.open();
}
/*function uploaditem_images(old_images,img_nm,hidd_div,source){
  //alert("******** "+img_nm+'======='+hidd_div);
  var img = document.getElementById('image_cms_'+hidd_div);
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
  //var imgfilename = params.name;  
  var imgfilename = img_nm; 
  //alert("imgfilename "+imgfilename);
  //var split_imgfilename = imgfilename.split("?");
  var ft = new FileTransfer();
  //console.log("ft :::::::::: "+ft);
  //var actual_imgname1 = split_imgfilename[0];
  //var img_filename1 = actual_imgname1.split('%20').join('_');
  //alert(img_filename1);
  var upload_itemdets = base_url+"APP/Appcontroller/item_imgsupload/"+old_images+"/"+imgfilename+"/"+source;
  //alert(upload_itemdets)
  ft.upload(imageURI,upload_itemdets,win,fail,options,true);
}
function upload_itemdetails(hidd_complain_id,old_images,sapcode,other_part,ohter_make,uom,qty,hidd_div_id){
  //alert("called upload_itemdetails "+hidd_div_id);
  var img = document.getElementById('image_cms_'+hidd_div_id);
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
  //alert(img_filename1);
  var upload_itemdets = base_url+"APP/Appcontroller/item_detailsupload/"+hidd_complain_id+"/"+old_images+"/"+sapcode+"/"+other_part+"/"+ohter_make+"/"+uom+"/"+qty+"/"+img_filename1;
  alert(upload_itemdets)
  ft.upload(imageURI,upload_itemdets,win,fail,options,true);
}*/
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
  window.localStorage.removeItem("module_name");
  mainView.router.navigate('/');   
  app.panel.close();
} 