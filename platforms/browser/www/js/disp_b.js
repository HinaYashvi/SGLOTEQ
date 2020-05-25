if(today_enable_arr!='') { 
          if(typeof today_enable_arr==='string'){          
            if(addzero_b < today_slot){
              console.log("ARE --- "+addzero_b);
              //alert("hello");
              if(enable_disps.indexOf(i) != -1){
                //console.log("if "+enable_disps+"---"+i);
                disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+'></td>';
              }else{
                disp_html+='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-10 disp_th_'+arr_ser[d_b]+'">--</td>';
              }
            }else if(addzero_b >= today_slot){ 
              console.log("OH --- "+addzero_b);
              if(today_enable_arr.indexOf(i) != -1){
                //console.log("if "+enable_disps+"---"+i);
                //alert("hi");
                disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+'></td>';
              }else{
                //console.log("else "+disable_disps+"---"+i);
                disp_html+='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-10 disp_th_'+arr_ser[d_b]+'">--</td>';
              }
            } 
          }else{
            /*if(addzero_b < today_slot){
              // single entry for current day //
              //console.log("ARE --- "+addzero_b);
              //alert("hello");
              if(enable_disps.indexOf(i) != -1){
                //console.log("if "+enable_disps+"---"+i);
                disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+'></td>';
              }else{
                disp_html+='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-10 disp_th_'+arr_ser[d_b]+'">--</td>';
              }
            }else{
              // multiple entries for current day //
              $.each(today_enable_arr, function( key_tm_b, disparr_dis_b ) {
                //console.log(key_tm_b+"-----"+disparr_dis_b);      
                if(addzero_b >= key_tm_b){ 
                  //console.log("OH MULTIPLE --- "+addzero_b);
                  if(disparr_dis_b.indexOf(i) != -1){
                    //console.log("if "+enable_disps+"---"+i);
                    //alert("hi");
                    disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+'></td>';
                  }else{
                    //console.log("else "+disable_disps+"---"+i);
                    disp_html+='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-10 disp_th_'+arr_ser[d_b]+'">--</td>';
                  }
                }
              });
            }  */
          }          
        }else{
          if(sel_dpr > fromdttm) {
            if(enable_disps.indexOf(i) != -1){
                //console.log("if "+enable_disps+"---"+i);
                disp_html+='<td class="text-uppercase disp_tr_'+i+' '+dis_b+' pl-0 disp_th_'+arr_ser[d_b]+'"><input type="number" name="para[DISP_'+i+'_B]['+addzero_b+'_00]" class="td_txt '+readonly_cls+' disp_'+i+'_b_'+d_b+' val_disp_1'+'_'+d_b+'" '+read_only+'></td>';
              }else{
                //console.log("else "+disable_disps+"---"+i);
                disp_html+='<td class="text-center text-uppercase disp_tr_'+i+' '+dis_b+' pl-10 disp_th_'+arr_ser[d_b]+'">--</td>';
              }
           }
        }