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
    path: '/cms_details/:c_id/:st_name/',
    url: './cms/cms_details.html?c_id={{c_id}}/st_name={{st_name}}',
    name: 'cms_details',
  },
];
