$(document).on('page:init', '.page[data-name="dpr_sheet"]', function (page) {
  menuload();
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
      //alert(st_start_time);

      $("#hidd_dispcnt").val(dispanser_count);
      //console.log("ENABLE:: "+enable_disps);
      //console.log("TODAY ENABLE:: "+today_enable_arr);      
      
      var disp_html = '';
      for(var i=1;i<=dispanser_count;i++){
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
                //console.log("ARE --- "+addzero_a);
                if(enable_disps.indexOf(i) != -1){
                  //console.log("if "+enable_disps+"---"+i);
                  disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
                }else{
                  disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
                }
              }else if(addzero_a >= today_slot){ 
                //console.log("OH --- "+addzero_a);
                if(today_enable_arr.indexOf(i) != -1){
                  disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
                }else{
                  //console.log("else "+disable_disps+"---"+i);
                  disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
                }  
              }
            }else{ 
              //alert("hi");
              //console.log("HINA");
              //console.log(enable_disps.length);
              //alert(dpr_date+"======="+cur_date);
              if(dpr_date==cur_date){
                console.log("current day multiple entry");
              
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
              console.log("not same" +"cur_date====="+cur_date+"------dbdate "+dbdate);
                //console.log("in cond "+dbdate+"====="+to_dt_slot);
                aa=to_dt_slot; 
                enble_prev=enable;
                //if(from_datetm!=final_todt && final_todt!="00-00-0000"){
/*                if(from_datetm!=final_todt){
                  //console.log("IF "+from_datetm+" "+enble_prev +"----"+ d_a +"===="+aa);
                  if(d_a < aa){
                    //console.log(enble_prev +" "+ d_a+ "===="+aa);
                    if(enble_prev.indexOf(i) != -1){
                     //console.log(d_a+"========"+i+"====enable prev"+enble_prev);
                     enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
                    }else{
                      //console.log(d_a+"*******"+i+"====  prev disabled");
                      enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
                    }
                  }
                  if(final_todt=="00-00-0000"){
                  console.log("FROM "+from_dt_slot+" TO "+to_dt_slot+" AA "+aa+" ==> "+d_a);
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
                } */
                /*if(from_datetm==final_todt){
                  console.log(final_todt);
                  console.log("ELSE "+from_dt_slot+" TO "+to_dt_slot+ " "+enble_prev +" "+ d_a+ "===="+aa);
                  if(to_dt_slot >= d_a && from_dt_slot <= d_a){
                      //console.log(to_dt_slot+" >= "+d_a +" && "+from_dt_slot+" <= "+d_a + " enable "+enable);
                      //console.log("IN ELSE'S IF");
                      if(enable.indexOf(i) != -1){
                      //console.log(d_a+"========"+i+"====enable "+enable);
                      enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
                      }else{
                        //console.log(d_a+"*******"+i+"==== disabled");
                        enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
                      }
                      //console.log("IF-----"+d_a+" from date "+from_dt_slot +"to date "+to_dt_slot+ "enable "+enable );
                    }else{
                      //console.log(to_dt_slot+" <= "+d_a +" && "+from_dt_slot+" >= "+d_a + " enable "+enable);
                      //console.log("IN ELSE'S IF'S ELSE");
                      if(to_dt_slot <= d_a && from_dt_slot <= d_a){
                        console.log("ELSE ======"+d_a+" from date "+from_dt_slot +"to date "+to_dt_slot+ "enable "+enable);
                        if(enable.indexOf(i) != -1){
                        //console.log(d_a+"========"+i+"====enable "+enable);
                        enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
                        }else{
                          //console.log(d_a+"*******"+i+"==== disabled");
                          enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
                        }
                      }


                      //console.log("ELSE ======"+d_a+" from date "+from_dt_slot +"to date "+to_dt_slot+ "enable "+enable);
                    } 
                } */

              }       
               //0000-00-00 00:00:00
              //console.log('outside '+aa);
              if(cur_date === dbdate){ 
               console.log("~~~~ same dates"+final_todt);
                //console.log(dbdate+"====="+z);
                if(final_todt=="00-00-0000"){
                  console.log("FROM "+from_dt_slot+" TO "+to_dt_slot+" AA "+aa+" ==> "+d_a+" enable "+enable);
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
                    //console.log("IF "+dbdate+"==== loop tm :"+d_a+"--frm "+from_dt_slot+" to "+to_dt_slot + "---"+enable);
                    //console.log("IF "+" FROM "+from_dt_slot+" TO "+to_dt_slot + "---  ENABLE "+enble_prev);
                    if(enble_prev.indexOf(i) != -1){
                     //console.log(d_a+"========"+i+"====enable prev"+enble_prev);
                     enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
                    }else{
                      //console.log(d_a+"*******"+i+"====  prev disabled");
                      enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
                    }                    
                  }else{
                    //console.log("ELSE "+" FROM "+from_dt_slot+" TO "+to_dt_slot + "---  ENABLE"+enable);
                      //console.log("ENABLE "+enable+" to_dt_slot "+to_dt_slot); 
                    if(to_dt_slot >= d_a && from_dt_slot <= d_a){
                      //console.log(to_dt_slot+" >= "+d_a +" && "+from_dt_slot+" <= "+d_a + " enable "+enable);
             //         console.log("ELSE "+" FROM "+from_dt_slot+" TO "+to_dt_slot + "---  ENABLE "+enable);
                      //console.log("IN ELSE'S IF");
                      if(enable.indexOf(i) != -1){
                      //console.log(d_a+"========"+i+"====enable "+enable);
                      enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+' id="DISP_'+i+'_A_'+d_a+'"></td>';
                      }else{
                        //console.log(d_a+"*******"+i+"==== disabled");
                        enable_html='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-10 disp_th_'+arr_ser[d_a]+'">--</td>';
                      }
                      //console.log("IF-----"+d_a+" from date "+from_dt_slot +"to date "+to_dt_slot+ "enable "+enable );
                    }else{
                      //console.log(to_dt_slot+" <= "+d_a +" && "+from_dt_slot+" >= "+d_a + " enable "+enable);
                      //console.log("IN ELSE'S IF'S ELSE"); 

                      
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


                      //console.log("ELSE ======"+d_a+" from date "+from_dt_slot +"to date "+to_dt_slot+ "enable "+enable);
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
                    console.log("IN "+past_from_dt_slot+" TO "+past_to_dt_slot+" AA "+past_aa+" ==> "+d_a+" enable "+past_enable);
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
                }/*else if(past_from_datetm < past_final_todt){
                  alert(past_from_datetm +" is samller than "+past_final_todt);
                }*/
                //console.log("FROM "+past_from_datetm+" TO "+past_final_todt);
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
                                
                console.log("*** FROM "+past_from_dt_slot+ " TO "+past_to_dt_slot+" enable "+past_enable+" d_a "+d_a+" aa "+past_to_dt_slot);
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


//         disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_1'+'_'+d_a+'" '+read_only+'></td>'; 
        }
        disp_html+='</tr>';
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
              //console.log("ARE --- "+addzero_b);
              //alert("hello");
              if(enable_disps.indexOf(i) != -1){
                //console.log("if "+enable_disps+"---"+i);
                disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+' id="DISP_'+i+'_B_'+d_b+'"></td>';
              }else{
                disp_html+='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-9 disp_th_'+arr_ser[d_b]+'">--</td>';
              }
            }else if(addzero_b >= today_slot){ 
              //console.log("OH --- "+addzero_b);
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
/*                if(from_datetm_b!=final_todt_b){
                  if(d_b < bb){
                    if(enble_prev_b.indexOf(i) != -1){
                     enable_html_b='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+' id="DISP_'+i+'_B_'+d_b+'"></td>';
                    }else{
                      enable_html_b='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-9 disp_th_'+arr_ser[d_b]+'">--</td>';
                    }
                  }
                  if(final_todt_b=="00-00-0000"){
                    if(from_dt_slot_b <= d_b){
                    if(enable_b.indexOf(i) != -1){
                     enable_html_b='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+' id="DISP_'+i+'_B_'+d_b+'"></td>';
                    }else{
                      enable_html_b='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-9 disp_th_'+arr_ser[d_b]+'">--</td>';
                    }
                   }   
                  }
                }else if(from_datetm_b==final_todt_b){
                  if(to_dt_slot_b >= d_b && from_dt_slot_b <= d_b){
                      if(enable_b.indexOf(i) != -1){
                      enable_html_b='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+' id="DISP_'+i+'_B_'+d_b+'"></td>';
                      }else{
                        enable_html_b='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-9 disp_th_'+arr_ser[d_b]+'">--</td>';
                      }
                    }else{
                      if(to_dt_slot_b <= d_b && from_dt_slot_b <= d_b){
                        if(enable_b.indexOf(i) != -1){
                        enable_html_b='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+' id="DISP_'+i+'_B_'+d_b+'"></td>';
                        }else{
                          enable_html_b='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-9 disp_th_'+arr_ser[d_b]+'">--</td>';
                        }
                      }
                    } 
                }
*/
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
                }/*else if(past_from_datetm_b < past_final_todt_b){
                  alert(past_from_datetm_b +" is samller than "+past_final_todt_b);
                }*/
                //console.log("FROM "+past_from_datetm_b+" TO "+past_final_todt_b);
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
          if(st_start_date == dpr_date){
            for(var col=0;col<st_start_time;col++){
              $(".disp_th_"+col).html("---");
              $(".disp_th_"+col).removeClass("pl-0");
              $(".disp_th_"+col).addClass("text-center pl-9");
            }
          }

            disp_html+=enable_html_b;
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

         

   //       disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+'></td>';
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
          disp_html+='<td class="text-uppercase '+dis_a+' pl-0 disp_th_'+arr_ser[d_a]+' disp_th_'+[d_a]+'"><input type="number" name="para[DISP_'+i+'_A]['+addzero_a+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_a_'+d_a+' val_disp_'+i+'_'+d_a+'" '+read_only+'></td>';
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
          disp_html+='<td class="text-uppercase '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+' disp_th_'+[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_'+i+'_'+d_b+'" '+read_only+'></td>';
        }        
        disp_html+='</tr>';
      }
      $(".disp_data").html(disp_html); 
    }
  });*/
  app.preloader.hide();
  $.ajax({
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
  });
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
              $(".comp_suc_"+cs).val(cs_slot_param_val);
            }            
          }
          for(var cd=0;cd<COMP_DISCHARGE.length;cd++){
            if(COMP_DISCHARGE[cd]!=''){
              var cd_slot_param_val = COMP_DISCHARGE[cd][0].slot_param_val;
              $(".comp_dis_"+cd).val(cd_slot_param_val);
            }            
          }
          for(var lcv1=0;lcv1<LCV_1_MFM.length;lcv1++){
            if(LCV_1_MFM[lcv1]!=''){
              var lcv1_mfm = LCV_1_MFM[lcv1][0].slot_param_val;
              $(".lcv1_mfm_"+lcv1).val(lcv1_mfm);
            }
          }
          for(var lcv2=0;lcv2<LCV_2_MFM.length;lcv2++){
            if(LCV_2_MFM[lcv2]!=''){
              var lcv2_mfm = LCV_2_MFM[lcv2][0].slot_param_val;
              $(".lcv2_mfm_"+lcv2).val(lcv2_mfm);
            }
          }
          for(var lcv3=0;lcv3<LCV_3_MFM.length;lcv3++){
            if(LCV_3_MFM[lcv3]!=''){
              var lcv3_mfm = LCV_3_MFM[lcv3][0].slot_param_val;
              $(".lcv3_mfm_"+lcv3).val(lcv3_mfm);
            }
          }
          for(var lcv4=0;lcv4<LCV_4_MFM.length;lcv4++){
            if(LCV_4_MFM[lcv4]!=''){
              var lcv4_mfm = LCV_4_MFM[lcv4][0].slot_param_val;
              $(".lcv4_mfm_"+lcv4).val(lcv4_mfm);
            }
          }
          for(var chc=0;chc<COMP_HMR_COUNTER.length;chc++){
            if(COMP_HMR_COUNTER[chc]!=''){
              var chc_val = COMP_HMR_COUNTER[chc][0].slot_param_val;
              $(".comp_hmr_cnt_"+chc).val(chc_val);
            }
          }
          for(var cem=0;cem<COMP_ENR_METER.length;cem++){
            if(COMP_ENR_METER[cem]!=''){
              var cem_val = COMP_ENR_METER[cem][0].slot_param_val;
              $(".comp_energy_met_"+cem).val(cem_val);
            }
          }
          for(var isp=0;isp<I_stg_prs.length;isp++){
            if(I_stg_prs[isp]!=''){
              var isp_val = I_stg_prs[isp][0].slot_param_val;
              $(".I_stg_prs_"+isp).val(isp_val);
            }
          }
          for(var iisp=0;iisp<II_stg_prs.length;iisp++){
            if(II_stg_prs[iisp]!=''){
              var iisp_val = II_stg_prs[iisp][0].slot_param_val;
              $(".II_stg_prs_"+iisp).val(iisp_val);
            }
          }
          for(var iiips=0;iiips<III_stg_prs.length;iiips++){
            if(III_stg_prs[iiips]!=''){
              var iiips_val = III_stg_prs[iiips][0].slot_param_val;
              $(".III_stg_prs_"+iiips).val(iiips_val);
            }
          }
          for(var ist=0;ist<I_stg_TEMP.length;ist++){
            if(I_stg_TEMP[ist]!=''){
              var ist_val = I_stg_TEMP[ist][0].slot_param_val;
              $(".I_stg_temp_"+ist).val(ist_val);
            }
          }
          for(var iist=0;iist<II_stg_TEMP.length;iist++){
            if(II_stg_TEMP[iist]!=''){
              var iist_val = II_stg_TEMP[iist][0].slot_param_val;
              $(".II_stg_temp_"+iist).val(iist_val);
            }
          }
          for(var iiist=0;iiist<III_stg_TEMP.length;iiist++){
            if(III_stg_TEMP[iiist]!=''){
              var iiist_val = III_stg_TEMP[iiist][0].slot_param_val;
              $(".III_stg_temp_"+iiist).val(iiist_val);
            }
          }
          for(var lpo=0;lpo<LP_OIL.length;lpo++){
            if(LP_OIL[lpo]!=''){
              var lpo_val = LP_OIL[lpo][0].slot_param_val;
              $(".lp_oil_"+lpo).val(lpo_val);
            }
          }
          for(var hpo=0;hpo<HP_OIL.length;hpo++){
            if(HP_OIL[hpo]!=''){
              var hpo_val = HP_OIL[hpo][0].slot_param_val;
              $(".hp_oil_"+hpo).val(hpo_val);
            }
          }
          for(var lbp=0;lbp<LOW_BANK_PRS.length;lbp++){
            if(LOW_BANK_PRS[lbp]!=''){
              var lbp_val = LOW_BANK_PRS[lbp][0].slot_param_val;
              $(".low_bank_prs_"+lbp).val(lbp_val);
            }
          }
          for(var mbp=0;mbp<MED_BANK_PRS.length;mbp++){
            if(MED_BANK_PRS[mbp]!=''){
              var mbp_val = MED_BANK_PRS[mbp][0].slot_param_val;
              $(".med_bank_prs_"+mbp).val(mbp_val);
            }
          }
          for(var hbp=0;hbp<HIGH_BANK_PRS.length;hbp++){
            if(HIGH_BANK_PRS[hbp]!=''){
              var hbp_val = HIGH_BANK_PRS[hbp][0].slot_param_val;
              $(".high_bank_prs_"+hbp).val(hbp_val);
            }
          }
          for(var wl=0;wl<WATER_LVL.length;wl++){
            if(WATER_LVL[wl]!=''){
              var wl_val = WATER_LVL[wl][0].slot_param_val;
              $(".water_lvl_"+wl).val(wl_val);
            }
          }
          for(var ol=0;ol<OIL_LVL.length;ol++){
            if(OIL_LVL[ol]!=''){
              var ol_val = OIL_LVL[ol][0].slot_param_val;
              $(".oil_lvl_"+ol).val(ol_val);
            }
          }
          for(var nocs=0;nocs<NO_OF_COMP_STARTS.length;nocs++){
            if(NO_OF_COMP_STARTS[nocs]!=''){
              var nocs_val = NO_OF_COMP_STARTS[nocs][0].slot_param_val;
              $(".comp_starts_"+nocs).val(nocs_val);
            }
          }
          for(var sucp=0;sucp<SUC_PRS.length;sucp++){
            if(SUC_PRS[sucp]!=''){
              var sucp_val = SUC_PRS[sucp][0].slot_param_val;
              $(".suc_prs_"+sucp).val(sucp_val);
            }
          }
                    

          for(var disp_aa=0;disp_aa<dispanser_count;disp_aa++){
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
                    //console.log(txtbox_id+" "+time_slot_b+" ("+'.disp'+(disp_bb+1)+'_a_'+timeslot_b+").val="+disp_b_val);
                    $(".disp_"+(disp_bb+1)+"_b_"+timeslot_b).val(disp_b_val);
                  }
                }
            }
          }
           

          for(var gmk=0;gmk<GEB_MET_KWH.length;gmk++){
            if(GEB_MET_KWH[gmk]!=''){
              var gmk_slot_param_val = GEB_MET_KWH[gmk][0].slot_param_val;
              $(".GEB_energy_mtr_KWH_"+gmk).val(gmk_slot_param_val);
            }
          }
          for(var gmk=0;gmk<GEB_MET_KVAH.length;gmk++){
            if(GEB_MET_KVAH[gmk]!=''){
              var gmk_slot_param_val = GEB_MET_KVAH[gmk][0].slot_param_val;
              $(".GEB_energy_met_KVAH_"+gmk).val(gmk_slot_param_val);
            }
          }
          for(var gmkrh=0;gmkrh<GEB_MET_KVRH.length;gmkrh++){
            if(GEB_MET_KVRH[gmkrh]!=''){
              var gmkrh_slot_param_val = GEB_MET_KVRH[gmkrh][0].slot_param_val;
              $(".GEB_energy_met_KVRH_"+gmkrh).val(gmkrh_slot_param_val);
            }
          }
          for(var dro=0;dro<DELAR_RO.length;dro++){
            if(DELAR_RO[dro]!=''){
              var dro_slot_param_val = DELAR_RO[dro][0].slot_param_val;
              $(".delar_ro_"+dro).val(dro_slot_param_val);
            }
          }
          for(var vltg=0;vltg<VLTG.length;vltg++){
            if(VLTG[vltg]!=''){
              var vltg_slot_param_val = VLTG[vltg][0].slot_param_val;
              $(".voltage_"+vltg).val(vltg_slot_param_val);
            }
          }
          for(var amp=0;amp<AMP.length;amp++){
            if(AMP[amp]!=''){
              var amp_slot_param_val = AMP[amp][0].slot_param_val;
              $(".amp_"+amp).val(amp_slot_param_val);
            }
          }
          for(var pf=0;pf<PF.length;pf++){
            if(PF[pf]!=''){
              var pf_slot_param_val = PF[pf][0].slot_param_val;
              $(".pf_"+pf).val(pf_slot_param_val);
            }
          }



        }else{         
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
          /*for(var lcvmfm=0;lcvmfm<LCV_MFM.length;lcvmfm++){
            var cnt_lcv = LCV_MFM[lcvmfm].length;
            for(var lc=0;lc<cnt_lcv;lc++){            
              var lcv_val = LCV_MFM[lcvmfm][lc].slot_param_val; 
              $(".lcv"+(lcvmfm+1)+"_mfm_"+lc).val(lcv_val);
            }
          } // DYNAMIC //*/
          for(var lcv1=0;lcv1<LCV_1_MFM.length;lcv1++){
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
          /*for(var lcv5=0;lcv5<LCV_5_MFM.length;lcv5++){
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
          console.log(DISP_A);
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
                    //console.log(disptm_b+" "+timeslot_b);
                    //console.log(txtbox_id_b+" "+time_slot_b+" ("+'.disp'+(disp_bb+1)+'_b_'+timeslot_b+").val="+disp_b_val);
                    $(".disp_"+(disp_bb+1)+"_b_"+timeslot_b).val(disp_b_val);
                  }
                }
              }

            }
            //console.log("----------------------------------");
          }

          //console.log(DISP_B);
          // for(var disp_bb=0;disp_bb<DISP_B.length;disp_bb++){
          //   var cnt_b = DISP_B[disp_bb].length;
          //   for(var d_bb=0;d_bb<cnt_b;d_bb++){            
          //     var disp_b_val = DISP_B[disp_bb][d_bb].slot_param_val;
          //     var time_slot_b = DISP_B[disp_bb][d_bb].time_slot;
          //     var txtbox_id_b = $(".disp_"+(disp_bb+1)+"_a_"+d_bb).attr('id');

          //     //console.log("DISP "+(disp_bb+1)+" B --- "+ time_slot_b + (".disp_"+(disp_bb+1)+"_b_"+d_bb) +" => "+disp_b_val); 

          //     if(txtbox_id_b!=undefined) {
          //       //alert(txtbox_id); 
          //       var split_txt_b = txtbox_id_b.split("_");
          //       var dispno_b = split_txt_b[1];
          //       var disptm_b = split_txt_b[3];
          //       var d_no_b=disp_bb+1; 
          //       //console.log(dispno_b+"=="+d_no_b+" "+disptm_b+"=="+d_bb+" =>"+disp_b_val+" "+".disp_"+d_no_b+"_b_"+d_bb);
          //       if(dispno_b == d_no_b && disptm_b == d_bb){
          //         //console.log("DISP "+d_no_b+" B ---- "+ d_bb+":00 "+(".disp_"+d_no_b+"_b_"+d_bb) +" => "+disp_b_val);
          //         //$(".disp_"+d_no_b+"_b_"+d_bb).val(disp_b_val); 
          //       }     
          //     }
          //     //$(".disp_"+(disp_bb+1)+"_b_"+d_bb).val(disp_b_val);
          //   }
          //   console.log("________________________");
          // }

   



          /*for(var dloop_b=0;dloop_b<23;dloop_b++){
            if(dloop_b <= 9){
              var addzero_disp_b="0"+dloop_b;
            }else{
              var addzero_disp_b=dloop_b;
            }
            for(var disp_bb=0;disp_bb<DISP_B.length;disp_bb++){
              //console.log(disp_bb);
              var cnt_d = DISP_B[disp_bb].length;
              for(var d_bb=0;d_bb<cnt_d;d_bb++){
                var disp_b_val = DISP_B[disp_bb][d_bb].slot_param_val;
                var slot_b=DISP_B[disp_bb][d_bb].time_slot;
                var split_slot_b=slot_b.split(":");
                if(split_slot_b[0]==addzero_disp_b){
                  $(".disp_"+(disp_bb+1)+"_b_"+d_bb).val(disp_b_val);
                }
              }
            }
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
    //var quarter_minutes = ["00:55:00","01:55:00","02:55:00","03:55:00","04:55:00","05:55:00","06:55:00","07:55:00","08:55:00","09:55:00","10:55:00","11:55:00","12:55:00","13:55:00","14:55:00","15:55:00","16:55:00","17:55:00","18:55:00","19:55:00","20:55:00","21:55:00","22:55:00","23:55:00"];
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
          if(empty_slot=="00"){
            empty_slot=12;
            var alert_hr = empty_slot+":00 "+time_string;
          }else{
            var oneless_hr = hour - 1;
            var alert_hr = oneless_hr+":00 "+time_string;
          }
          if(slotcnt >= 1){
            alert("Please fill all required values for "+alert_hr);
          }else{
            alert("Please fill all required values for "+alert_hr);
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
  //alert(g1+"======"+g2);
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