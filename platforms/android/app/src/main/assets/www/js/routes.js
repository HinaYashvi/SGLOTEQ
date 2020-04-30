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
    path: '/veh_search/:veh_msg/:status/:owner_name/:mobile_one/:mob2/:email/:vehicle_type/:att_hydrotest_metal_plate_cirty/:att_rcbook/:att_form24/:att_number_plate/:vehicle_no/:due_yr/:due_mm/:due_dd/',
    url: './veh_search.html?veh_msg={{veh_msg}}/status={{status}}/owner_name={{owner_name}}/mobile_one={{mobile_one}}/mob2={{mob2}}/email={{email}}/vehicle_type={{vehicle_type}}/att_hydrotest_metal_plate_cirty={{att_hydrotest_metal_plate_cirty}}/att_rcbook={{att_rcbook}}/att_form24={{att_form24}}/att_number_plate={{att_number_plate}}/vehicle_no={{vehicle_no}}/due_yr={{due_yr}}/due_mm={{due_mm}}/due_dd={{due_dd}}',
    //path: '/veh_search/:veh_msg/:status/:owner_name/:mobile_one/',
    //url: './veh_search.html?veh_msg={{veh_msg}}/status={{status}}/owner_name={{owner_name}}/mobile_one={{mobile_one}}',
    name: 'veh_search',
  },
  {
    path: '/veh_exists/',
    url: './vst/veh_exists.html',
    name: 'veh_exists',
  },
  {
    path: '/vst/',
    url: './vst/vst.html',
    name: 'vst',
  },
  {
    path: '/vst_submited/',
    url: './vst/vst_submited.html',
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
  {
    path: '/recheckQR/:qr_code/',
    url: './vst/recheckQR.html?qr_code={{qr_code}}',
    name: 'recheckQR',
  },
  {
    path: '/dpr/',
    url: './dpr/dpr.html',
    name: 'dpr',
  }, 
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
    path: '/dpr_kpi_rep/:station_id/:demo_calendar_modal_dpr/:st_name/',
    url: './dpr/dpr_kpi_rep.html?station_id={{station_id}}/dpr_month={{dpr_month}}/dpr_year={{dpr_year}}/st_name={{st_name}}',
    name: 'dpr_kpi_rep',
  }*/
  
];
