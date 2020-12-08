var routes = [
  // Index page
  {
    path: '/',
    url: './index.html',
    name: 'index',
  },
  {
    path: '/internet/',
    url: './internet.html',
    name: 'internet',
  }, 
  {
    path: '/dashboard/',
    url: './dashboard.html',
    name: 'dashboard',
  },
  {
    path: '/dpr_list/',
    url: './dpr/dpr_list.html',
    name: 'dpr_list',
  },
  {
    path: '/veh_search/:veh_msg/:status/:owner_name/:mobile_one/:mob2/:email/:vehicle_type/:att_hydrotest_metal_plate_cirty/:att_rcbook/:att_form24/:att_number_plate/:vehicle_no/:due_yr/:due_mm/:due_dd/:perm_msg/',
    url: './veh_search.html?veh_msg={{veh_msg}}/status={{status}}/owner_name={{owner_name}}/mobile_one={{mobile_one}}/mob2={{mob2}}/email={{email}}/vehicle_type={{vehicle_type}}/att_hydrotest_metal_plate_cirty={{att_hydrotest_metal_plate_cirty}}/att_rcbook={{att_rcbook}}/att_form24={{att_form24}}/att_number_plate={{att_number_plate}}/vehicle_no={{vehicle_no}}/due_yr={{due_yr}}/due_mm={{due_mm}}/due_dd={{due_dd}}/perm_msg={{perm_msg}}',
    //path: '/veh_search/:veh_msg/:status/:owner_name/:mobile_one/',
    //url: './veh_search.html?veh_msg={{veh_msg}}/status={{status}}/owner_name={{owner_name}}/mobile_one={{mobile_one}}',
    name: 'veh_search',
  },
  /*{
    path: '/veh_exists/',
    url: './vst/veh_exists.html',
    name: 'veh_exists',
  },*/
  {
    path: '/veh_exists/:veh_no/',
    url: './vst/veh_exists.html?veh_no={{veh_no}}',
    name: 'veh_exists',
  },
  {
    path: '/vst/',
    url: './vst/vst.html',
    name: 'vst',
  },
  /*{
    path: '/vst_submited/',
    url: './vst/vst_submited.html',
    name: 'vst_submited',
  }, */ 
  {
    path: '/vst_submited/:hidd_vehno/',
    url: './vst/vst_submited.html?hidd_vehno={{hidd_vehno}}',
    name: 'vst_submited',
  },
  {
    path: '/no_vehdata/:qr_code/',
    url: './vst/no_vehdata.html?qr_code={{qr_code}}',
    name: 'no_vehdata',
  },  
  {
    path: '/add_vst/:qr_code_txt/',
    url: './vst/add_vst.html?qr_code_txt={{qr_code_txt}}',
    name: 'add_vst',
  },  
  /*{
    path: '/recheckQR/:qr_code/',
    url: './vst/recheckQR.html?qr_code={{qr_code}}',
    name: 'recheckQR',
  },*/
  {
    path: '/recheckQR/:qr_code/:hidd_vehno/',
    url: './vst/recheckQR.html?qr_code={{qr_code}}/hidd_vehno={{hidd_vehno}}',
    name: 'recheckQR',
  },
  {
    path: '/dpr/',
    url: './dpr/dpr.html',
    name: 'dpr',
  },
  {
    path: '/add_dprcomplain/',
    url: './dpr/add_dprcomplain.html',
    name: 'add_dprcomplain',
  },
  {
    path: '/dpr_view_complain/:dc_id/:stn_name/:dc_dttm/',
    url: './dpr/dpr_view_complain.html?dc_id={{dc_id}}/stn_name={{stn_name}}/dc_dttm={{dc_dttm}}',
    name: 'dpr_view_complain',
  },
  /*{
    path: '/dpr_sheet/',
    url: './dpr/dpr_sheet.html',
    name: 'dpr_sheet',
  },*/ 
  {
    path: '/dpr_sheet/:station_id/:demo_calendar_modal_dpr/:st_name/',
    url: './dpr/dpr_sheet.html?station_id={{station_id}}/demo_calendar_modal_dpr={{demo_calendar_modal_dpr}}/st_name={{st_name}}',
    name: 'dpr_sheet',
  },
  {
    path: '/dpr_kpi_rep/:station_id/:demo_calendar_modal_dpr/:st_name/',
    url: './dpr/dpr_kpi_rep.html?station_id={{station_id}}/demo_calendar_modal_dpr={{demo_calendar_modal_dpr}}/st_name={{st_name}}',
    name: 'dpr_kpi_rep',
  },
  /*{
    path: '/dpr_kpi_rep/',
    url: './dpr/dpr_kpi_rep.html',
    name: 'dpr_kpi_rep',
  },*/
  {
    path: '/dpr_complain/',
    url: './dpr/dpr_complain.html',
    name: 'dpr_complain',
  },

  {
    path: '/jmr/',
    url: './jmr/jmr.html',
    name: 'jmr',
  },
  {
    path: '/jmr_list/:jmr_station_id/',
    url: './jmr/jmr_list.html?jmr_station_id={{jmr_station_id}}',
    name: 'jmr_list',
  },
  {
    path: '/jmr_readings/:station_id/:start_time/:jmr_date/:first_date/:last_date/',
    url: './jmr/jmr_readings.html?station_id={{station_id}}/start_time={{start_time}}/jmr_date={{jmr_date}}/first_date={{first_date}}/last_date={{last_date}}',
    name: 'jmr_readings',
  },
  {
    path: '/jmr_view/:jmr_ID/',
    url: './jmr/jmr_view.html?jmr_ID={{jmr_ID}}',
    name: 'jmr_view',
  },
  /*{
    path: '/dpr_kpi_rep/:station_id/:demo_calendar_modal_dpr/:st_name/',
    url: './dpr/dpr_kpi_rep.html?station_id={{station_id}}/dpr_month={{dpr_month}}/dpr_year={{dpr_year}}/st_name={{st_name}}',
    name: 'dpr_kpi_rep',
  }*/
  {
    path: '/cms/',
    url: './cms/cms.html',
    name: 'cms',
  },
  {
    path: '/add_cms/',
    url: './cms/add_cms.html',
    name: 'add_cms',
  },
  {
    path: '/cms_details/:c_id/:st_name/:complainer_nm/:status/:clr/',
    url: './cms/cms_details.html?c_id={{c_id}}/st_name={{st_name}}/complainer_nm={{complainer_nm}}/status={{status}}/clr={{clr}}',
    name: 'cms_details',
  },
  {
    path: '/edit_cms/:c_id/',
    url: './cms/edit_cms.html?c_id={{c_id}}',
    name: 'edit_cms',
  },
  {
    path: '/pending_cms/',
    url: './cms/pending_cms.html',
    name: 'pending_cms',
  },
  {
    path: '/receive_cms/',
    url: './cms/receive_cms.html',
    name: 'receive_cms',
  },
  {
    path: '/change_cms_eic/:c_id/',
    url: './cms/change_cms_eic.html?c_id={{c_id}}',
    name: 'change_cms_eic',
  },
  {
    path: '/approve_cms/',
    url: './cms/approve_cms.html',
    name: 'approve_cms',
  },  
  {
    path: '/change_password/',
    url: './change_password.html',
    name: 'change_password',
  },
  {
    path: '/hcv_view/',
    url: './hcv/hcv_view.html',
    name: 'hcv_view',
  },
  
  {
    path: '/hcv/',
    url: './hcv/hcv.html',
    name: 'hcv',
  },
  {
    path: '/view_mother_hcv/:hr_id/',
    url: './hcv/view_mother_hcv.html?hr_id={{hr_id}}',
    name: 'view_mother_hcv',
  },
  {
    path: '/reg_vehicle/',
    url: './hcv/reg_vehicle.html',
    name: 'reg_vehicle',
  },
  {
    path: '/edit_regveh/:hr_id/',
    url: './hcv/edit_regveh.html?hr_id={{hr_id}}',
    name: 'edit_regveh',
  },
  {
    path: '/add_hcvtime/:hr_id/',
    url: './hcv/add_hcvtime.html?hr_id={{hr_id}}',
    name: 'add_hcvtime',
  },
  {
    path: '/hcvedit_time/:hinfo_id/:hr_id/',
    url: './hcv/hcvedit_time.html?hinfo_id={{hinfo_id}}/hr_id={{hr_id}}',
    name: 'hcvedit_time',
  },
  {
    path: '/hcv_db/',
    url: './hcv/hcv_db.html',
    name: 'hcv_db',
  },
  {
    path: '/hcv_db_details/:hi_id/',
    url: './hcv/hcv_db_details.html?hi_id={{hi_id}}',
    name: 'hcv_db_details',
  },
  {
    path: '/edit_dbinfo/:hi_id/',
    url: './hcv/edit_dbinfo.html?hi_id={{hi_id}}',
    name: 'edit_dbinfo',
  },
  {
    path: '/edit_dryout/:hi_id/',
    url: './hcv/edit_dryout.html?hi_id={{hi_id}}',
    name: 'edit_dryout',
  },
  {
    path: '/mrs/',
    url: './mrs/mrs.html',
    name: 'mrs',
  },
  {
    path: '/add_mrs/', 
    url: './mrs/add_mrs.html',
    name: 'add_mrs',
  },
  {
    path: '/mrs_details/:mrs_id/',
    url: './mrs/mrs_details.html?mrs_id={{mrs_id}}',
    name: 'mrs_details',
  },
  {
    path: '/edit_mrs/:mrs_id/',
    url: './mrs/edit_mrs.html?mrs_id={{mrs_id}}',
    name: 'edit_mrs',
  },
];
