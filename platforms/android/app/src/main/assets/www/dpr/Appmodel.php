
<?php 
class Appmodel extends CI_Model{
	public function searchVeh($veh_no,$vehno){
		$a=$this->db->select("*");
		//$this->db->where("trash",0);
		$this->db->where("(vehicle_no LIKE '%$veh_no%' OR vehicle_no2 LIKE '%$vehno%')");
		return $this->db->get("tbl_vst")->result_array();
		echo "<pre>";print_r($a);echo "</pre>";
	} 
	public function Kpi_sale_a_01($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='01:00' ) AS sale_sum_a_one from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_01($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='01:00' ) AS sale_sum_b_one from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_a_02($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='02:00' ) AS sale_sum_a_two from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_02($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='02:00' ) AS sale_sum_b_two from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_a_03($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='03:00' ) AS sale_sum_a_three from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_03($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='03:00' ) AS sale_sum_b_three from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_a_04($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='04:00' ) AS sale_sum_a_four from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_04($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='04:00' ) AS sale_sum_b_four from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_a_05($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='05:00' ) AS sale_sum_a_five from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_05($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='05:00' ) AS sale_sum_b_five from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_a_06($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='06:00' ) AS sale_sum_a_six from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_06($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='06:00' ) AS sale_sum_b_six from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_a_07($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='07:00' ) AS sale_sum_a_seven from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_07($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='07:00' ) AS sale_sum_b_seven from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_a_08($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='08:00' ) AS sale_sum_a_eight from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_08($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='08:00' ) AS sale_sum_b_eight from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_a_09($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='09:00' ) AS sale_sum_a_nine from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_09($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='09:00' ) AS sale_sum_b_nine from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_a_10($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='10:00' ) AS sale_sum_a_ten from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_10($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='10:00' ) AS sale_sum_b_ten from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_a_11($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='11:00' ) AS sale_sum_a_eleven from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_11($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='11:00' ) AS sale_sum_b_eleven from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_a_12($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='12:00' ) AS sale_sum_a_twelve from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_12($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='12:00' ) AS sale_sum_b_twelve from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_a_13($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='13:00' ) AS sale_sum_a_thirteen from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_13($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='13:00' ) AS sale_sum_b_thirteen from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_a_14($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='14:00' ) AS sale_sum_a_fourteen from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_14($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='14:00' ) AS sale_sum_b_fourteen from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_a_15($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='15:00' ) AS sale_sum_a_fifteen from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_15($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='15:00' ) AS sale_sum_b_fifteen from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_a_16($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='16:00' ) AS sale_sum_a_sixteen from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_16($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='16:00' ) AS sale_sum_b_sixteen from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>"; 
	}
	public function Kpi_sale_a_17($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='17:00' ) AS sale_sum_a_seventeen from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_17($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='17:00' ) AS sale_sum_b_seventeen from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>"; 
	}
	public function Kpi_sale_a_18($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='18:00' ) AS sale_sum_a_eighteen from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_18($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='18:00' ) AS sale_sum_b_eighteen from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>"; 
	}
	public function Kpi_sale_a_19($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='19:00' ) AS sale_sum_a_nineteen from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_19($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='19:00' ) AS sale_sum_b_nineteen from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>"; 
	}
	public function Kpi_sale_a_20($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='20:00' ) AS sale_sum_a_twenty from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_20($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='20:00' ) AS sale_sum_b_twenty from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>"; 
	}	
	public function Kpi_sale_a_21($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='21:00' ) AS sale_sum_a_twentyone from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_21($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='21:00' ) AS sale_sum_b_twentyone from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>"; 
	}
	public function Kpi_sale_a_22($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='22:00' ) AS sale_sum_a_twentytwo from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_22($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='22:00' ) AS sale_sum_b_twentytwo from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>"; 
	}
	public function Kpi_sale_a_23($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='23:00' ) AS sale_sum_a_twentythree from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>";
	}
	public function Kpi_sale_b_23($dprID,$where){
		return $a= $this->db->query("select (SELECT SUM(ds.`slot_param_val`) FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id`  AND ($where) AND `time_slot`='23:00' ) AS sale_sum_b_twentythree from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
		//echo "<pre>";print_r($a);echo "</pre>"; 
	}
	public function getLCVSum($dprID,$lcv_where){
		//echo "select $lcv_where as lcv_sale from tbl_dpr as d where d.dpr_id=$dprID";
		return $this->db->query("select $lcv_where as lcv_sale from tbl_dpr as d where d.dpr_id=$dprID")->result_array();
	}
	public function sale_sum($dprID){ 
		return $this->db->query("select 
		((SELECT ds.`slot_param_val` as c10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='01:00')-(SELECT ds.`slot_param_val` as b10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='00:00')) AS comp_suc_one,
		((SELECT ds.`slot_param_val` as d10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='02:00')-(SELECT ds.`slot_param_val` as c10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='01:00')) AS comp_suc_two,
		((SELECT ds.`slot_param_val` as e10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='03:00')-(SELECT ds.`slot_param_val` as d10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='02:00')) AS comp_suc_three,
		((SELECT ds.`slot_param_val` as f10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='04:00')-(SELECT ds.`slot_param_val` as e10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='03:00')) AS comp_suc_four,
		((SELECT ds.`slot_param_val` as g10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='05:00')-(SELECT ds.`slot_param_val` as f10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='04:00')) AS comp_suc_five,
		((SELECT ds.`slot_param_val` as h10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='06:00')-(SELECT ds.`slot_param_val` as g10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='05:00')) AS comp_suc_six,
		((SELECT ds.`slot_param_val` as i10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='07:00')-(SELECT ds.`slot_param_val` as h10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='06:00')) AS comp_suc_seven,
		((SELECT ds.`slot_param_val` as j10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='08:00')-(SELECT ds.`slot_param_val` as i10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='07:00')) AS comp_suc_eight,
		((SELECT ds.`slot_param_val` as k10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='09:00')-(SELECT ds.`slot_param_val` as j10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='08:00')) AS comp_suc_nine,
		((SELECT ds.`slot_param_val` as l10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='10:00')-(SELECT ds.`slot_param_val` as k10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='09:00')) AS comp_suc_ten,
		((SELECT ds.`slot_param_val` as m10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='11:00')-(SELECT ds.`slot_param_val` as l10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='10:00')) AS comp_suc_eleven,
		((SELECT ds.`slot_param_val` as n10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='12:00')-(SELECT ds.`slot_param_val` as m10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='11:00')) AS comp_suc_twelve,
		((SELECT ds.`slot_param_val` as o10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='13:00')-(SELECT ds.`slot_param_val` as n10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='12:00')) AS comp_suc_thirteen,
		((SELECT ds.`slot_param_val` as p10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='14:00')-(SELECT ds.`slot_param_val` as o10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='13:00')) AS comp_suc_fourteen,
		((SELECT ds.`slot_param_val` as q10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='15:00')-(SELECT ds.`slot_param_val` as p10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='14:00')) AS comp_suc_fifteen,
		((SELECT ds.`slot_param_val` as r10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='16:00')-(SELECT ds.`slot_param_val` as q10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='15:00')) AS comp_suc_sixteen,
		((SELECT ds.`slot_param_val` as s10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='17:00')-(SELECT ds.`slot_param_val` as r10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='16:00')) AS comp_suc_seventeen,
		((SELECT ds.`slot_param_val` as t10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='18:00')-(SELECT ds.`slot_param_val` as s10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='17:00')) AS comp_suc_eighteen,
		((SELECT ds.`slot_param_val` as u10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='19:00')-(SELECT ds.`slot_param_val` as t10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='18:00')) AS comp_suc_nineteen,
		((SELECT ds.`slot_param_val` as v10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='20:00')-(SELECT ds.`slot_param_val` as u10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='19:00')) AS comp_suc_twenty,
		((SELECT ds.`slot_param_val` as w10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='21:00')-(SELECT ds.`slot_param_val` as v10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='20:00')) AS comp_suc_twentyone,
		((SELECT ds.`slot_param_val` as x10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='22:00')-(SELECT ds.`slot_param_val` as w10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='21:00')) AS comp_suc_twentytwo,
		((SELECT ds.`slot_param_val` as y10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='23:00')-(SELECT ds.`slot_param_val` as x10 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP SUCTION' AND `time_slot`='22:00')) AS comp_suc_twentythree,  
		
		((SELECT ds.`slot_param_val` as c11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='01:00')-(SELECT ds.`slot_param_val` as b11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='00:00')) AS comp_dischrg_one,
		((SELECT ds.`slot_param_val` as d11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='02:00')-(SELECT ds.`slot_param_val` as c11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='01:00')) AS comp_dischrg_two,
		((SELECT ds.`slot_param_val` as e11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='03:00')-(SELECT ds.`slot_param_val` as d11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='02:00')) AS comp_dischrg_three,
		((SELECT ds.`slot_param_val` as f11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='04:00')-(SELECT ds.`slot_param_val` as e11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='03:00')) AS comp_dischrg_four,
		((SELECT ds.`slot_param_val` as g11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='05:00')-(SELECT ds.`slot_param_val` as f11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='04:00')) AS comp_dischrg_five,
		((SELECT ds.`slot_param_val` as h11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='06:00')-(SELECT ds.`slot_param_val` as g11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='05:00')) AS comp_dischrg_six,
		((SELECT ds.`slot_param_val` as i11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='07:00')-(SELECT ds.`slot_param_val` as h11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='06:00')) AS comp_dischrg_seven,
		((SELECT ds.`slot_param_val` as j11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='08:00')-(SELECT ds.`slot_param_val` as i11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='07:00')) AS comp_dischrg_eight,
		((SELECT ds.`slot_param_val` as k11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='09:00')-(SELECT ds.`slot_param_val` as j11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='08:00')) AS comp_dischrg_nine,
		((SELECT ds.`slot_param_val` as l11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='10:00')-(SELECT ds.`slot_param_val` as k11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='09:00')) AS comp_dischrg_ten,
		((SELECT ds.`slot_param_val` as m11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='11:00')-(SELECT ds.`slot_param_val` as l11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='10:00')) AS comp_dischrg_eleven,
		((SELECT ds.`slot_param_val` as n11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='12:00')-(SELECT ds.`slot_param_val` as m11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='11:00')) AS comp_dischrg_twelve,
		((SELECT ds.`slot_param_val` as o11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='13:00')-(SELECT ds.`slot_param_val` as n11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='12:00')) AS comp_dischrg_thirteen,
		((SELECT ds.`slot_param_val` as p11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='14:00')-(SELECT ds.`slot_param_val` as o11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='13:00')) AS comp_dischrg_fourteen,
		((SELECT ds.`slot_param_val` as q11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='15:00')-(SELECT ds.`slot_param_val` as p11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='14:00')) AS comp_dischrg_fifteen,
		((SELECT ds.`slot_param_val` as r11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='16:00')-(SELECT ds.`slot_param_val` as q11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='15:00')) AS comp_dischrg_sixteen,
		((SELECT ds.`slot_param_val` as s11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='17:00')-(SELECT ds.`slot_param_val` as r11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='16:00')) AS comp_dischrg_seventeen,
		((SELECT ds.`slot_param_val` as t11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='18:00')-(SELECT ds.`slot_param_val` as s11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='17:00')) AS comp_dischrg_eighteen,
		((SELECT ds.`slot_param_val` as u11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='19:00')-(SELECT ds.`slot_param_val` as t11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='18:00')) AS comp_dischrg_nineteen,
		((SELECT ds.`slot_param_val` as v11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='20:00')-(SELECT ds.`slot_param_val` as u11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='19:00')) AS comp_dischrg_twenty,
		((SELECT ds.`slot_param_val` as w11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='21:00')-(SELECT ds.`slot_param_val` as v11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='20:00')) AS comp_dischrg_twentyone,
		((SELECT ds.`slot_param_val` as x11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='22:00')-(SELECT ds.`slot_param_val` as w11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='21:00')) AS comp_dischrg_twentytwo,
		((SELECT ds.`slot_param_val` as y11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='23:00')-(SELECT ds.`slot_param_val` as x11 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='COMP DISCHARGE' AND `time_slot`='22:00')) AS comp_dischrg_twentythree,
		
		
		((SELECT ds.`slot_param_val` as c12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='01:00')-(SELECT ds.`slot_param_val` as b12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='00:00') + (SELECT ds.`slot_param_val` as c13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='01:00')-(SELECT ds.`slot_param_val` as b13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='00:00') + (SELECT ds.`slot_param_val` as c14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='01:00')-(SELECT ds.`slot_param_val` as b14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='00:00') + (SELECT ds.`slot_param_val` as c15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='01:00')-(SELECT ds.`slot_param_val` as b15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='00:00')) as disp_sale_one,
		
		((SELECT ds.`slot_param_val` as d12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='02:00')-(SELECT ds.`slot_param_val` as c12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='01:00') + 
		(SELECT ds.`slot_param_val` as d13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='02:00')-(SELECT ds.`slot_param_val` as c13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='01:00') + 
		(SELECT ds.`slot_param_val` as d14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='02:00')-(SELECT ds.`slot_param_val` as c14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='01:00') + 
		(SELECT ds.`slot_param_val` as d15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='02:00')-(SELECT ds.`slot_param_val` as c15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='01:00')) as disp_sale_two,
		
		((SELECT ds.`slot_param_val` as e12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='03:00')-(SELECT ds.`slot_param_val` as d12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='02:00') + 
		(SELECT ds.`slot_param_val` as e13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='03:00')-(SELECT ds.`slot_param_val` as d13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='02:00') + 
		(SELECT ds.`slot_param_val` as e14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='03:00')-(SELECT ds.`slot_param_val` as d14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='02:00') + 
		(SELECT ds.`slot_param_val` as e15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='03:00')-(SELECT ds.`slot_param_val` as d15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='02:00')) as disp_sale_three,		
		
		((SELECT ds.`slot_param_val` as f12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='04:00')-(SELECT ds.`slot_param_val` as e12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='03:00') + 
		(SELECT ds.`slot_param_val` as f13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='04:00')-(SELECT ds.`slot_param_val` as e13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='03:00') + 
		(SELECT ds.`slot_param_val` as f14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='04:00')-(SELECT ds.`slot_param_val` as e14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='03:00') + 
		(SELECT ds.`slot_param_val` as f15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='04:00')-(SELECT ds.`slot_param_val` as e15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='03:00')) as disp_sale_four,		
		
		((SELECT ds.`slot_param_val` as g12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='05:00')-(SELECT ds.`slot_param_val` as f12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='04:00') + 
		(SELECT ds.`slot_param_val` as g13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='05:00')-(SELECT ds.`slot_param_val` as f13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='04:00') + 
		(SELECT ds.`slot_param_val` as g14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='05:00')-(SELECT ds.`slot_param_val` as f14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='04:00') + 
		(SELECT ds.`slot_param_val` as g15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='05:00')-(SELECT ds.`slot_param_val` as f15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='04:00')) as disp_sale_five, 
		
		((SELECT ds.`slot_param_val` as h12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='06:00')-(SELECT ds.`slot_param_val` as g12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='05:00') + 
		(SELECT ds.`slot_param_val` as h13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='06:00')-(SELECT ds.`slot_param_val` as g13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='05:00') + 
		(SELECT ds.`slot_param_val` as h14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='06:00')-(SELECT ds.`slot_param_val` as g14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='05:00') + 
		(SELECT ds.`slot_param_val` as h15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='06:00')-(SELECT ds.`slot_param_val` as g15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='05:00')) as disp_sale_six,		
		
		((SELECT ds.`slot_param_val` as i12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='07:00')-(SELECT ds.`slot_param_val` as h12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='06:00') + 
		(SELECT ds.`slot_param_val` as i13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='07:00')-(SELECT ds.`slot_param_val` as h13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='06:00') + 
		(SELECT ds.`slot_param_val` as i14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='07:00')-(SELECT ds.`slot_param_val` as h14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='06:00') + 
		(SELECT ds.`slot_param_val` as i15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='07:00')-(SELECT ds.`slot_param_val` as h15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='06:00')) as disp_sale_seven,		
		
		((SELECT ds.`slot_param_val` as j12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='08:00')-(SELECT ds.`slot_param_val` as i12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='07:00') + 
		(SELECT ds.`slot_param_val` as j13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='08:00')-(SELECT ds.`slot_param_val` as i13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='07:00') + 
		(SELECT ds.`slot_param_val` as j14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='08:00')-(SELECT ds.`slot_param_val` as i14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='07:00') + 
		(SELECT ds.`slot_param_val` as j15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='08:00')-(SELECT ds.`slot_param_val` as i15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='07:00')) as disp_sale_eight,		
		
		((SELECT ds.`slot_param_val` as k12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='09:00')-(SELECT ds.`slot_param_val` as j12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='08:00') + 
		(SELECT ds.`slot_param_val` as k13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='09:00')-(SELECT ds.`slot_param_val` as j13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='08:00') + 
		(SELECT ds.`slot_param_val` as k14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='09:00')-(SELECT ds.`slot_param_val` as j14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='08:00') + 
		(SELECT ds.`slot_param_val` as k15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='09:00')-(SELECT ds.`slot_param_val` as j15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='08:00')) as disp_sale_nine,		
		
		((SELECT ds.`slot_param_val` as l12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='10:00')-(SELECT ds.`slot_param_val` as k12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='09:00') + 
		(SELECT ds.`slot_param_val` as l13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='10:00')-(SELECT ds.`slot_param_val` as k13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='09:00') + 
		(SELECT ds.`slot_param_val` as l14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='10:00')-(SELECT ds.`slot_param_val` as k14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='09:00') + 
		(SELECT ds.`slot_param_val` as l15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='10:00')-(SELECT ds.`slot_param_val` as k15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='09:00')) as disp_sale_ten,		
		
		((SELECT ds.`slot_param_val` as m12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='11:00')-(SELECT ds.`slot_param_val` as l12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='10:00') + 
		(SELECT ds.`slot_param_val` as m13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='11:00')-(SELECT ds.`slot_param_val` as l13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='10:00') + 
		(SELECT ds.`slot_param_val` as m14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='11:00')-(SELECT ds.`slot_param_val` as l14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='10:00') + 
		(SELECT ds.`slot_param_val` as m15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='11:00')-(SELECT ds.`slot_param_val` as l15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='10:00')) as disp_sale_eleven,
		
		((SELECT ds.`slot_param_val` as n12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='12:00')-(SELECT ds.`slot_param_val` as m12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='11:00') + 
		(SELECT ds.`slot_param_val` as n13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='12:00')-(SELECT ds.`slot_param_val` as m13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='11:00') + 
		(SELECT ds.`slot_param_val` as n14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='12:00')-(SELECT ds.`slot_param_val` as m14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='11:00') + 
		(SELECT ds.`slot_param_val` as n15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='12:00')-(SELECT ds.`slot_param_val` as m15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='11:00')) as disp_sale_twelve,
		
		((SELECT ds.`slot_param_val` as o12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='13:00')-(SELECT ds.`slot_param_val` as n12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='12:00') + 
		(SELECT ds.`slot_param_val` as o13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='13:00')-(SELECT ds.`slot_param_val` as n13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='12:00') + 
		(SELECT ds.`slot_param_val` as o14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='13:00')-(SELECT ds.`slot_param_val` as n14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='12:00') + 
		(SELECT ds.`slot_param_val` as o15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='13:00')-(SELECT ds.`slot_param_val` as n15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='12:00')) as disp_sale_thirteen,
		
		((SELECT ds.`slot_param_val` as p12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='14:00')-(SELECT ds.`slot_param_val` as o12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='13:00') + 
		(SELECT ds.`slot_param_val` as p13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='14:00')-(SELECT ds.`slot_param_val` as o13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='13:00') + 
		(SELECT ds.`slot_param_val` as p14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='14:00')-(SELECT ds.`slot_param_val` as o14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='13:00') + 
		(SELECT ds.`slot_param_val` as p15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='14:00')-(SELECT ds.`slot_param_val` as o15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='13:00')) as disp_sale_fourteen,
		
		((SELECT ds.`slot_param_val` as q12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='15:00')-(SELECT ds.`slot_param_val` as p12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='14:00') + 
		(SELECT ds.`slot_param_val` as q13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='15:00')-(SELECT ds.`slot_param_val` as p13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='14:00') + 
		(SELECT ds.`slot_param_val` as q14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='15:00')-(SELECT ds.`slot_param_val` as p14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='14:00') + 
		(SELECT ds.`slot_param_val` as q15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='15:00')-(SELECT ds.`slot_param_val` as p15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='14:00')) as disp_sale_fifteen,
		
		((SELECT ds.`slot_param_val` as r12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='16:00')-(SELECT ds.`slot_param_val` as q12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='15:00') + 
		(SELECT ds.`slot_param_val` as r13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='16:00')-(SELECT ds.`slot_param_val` as q13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='15:00') + 
		(SELECT ds.`slot_param_val` as r14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='16:00')-(SELECT ds.`slot_param_val` as q14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='15:00') + 
		(SELECT ds.`slot_param_val` as r15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='16:00')-(SELECT ds.`slot_param_val` as q15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='15:00')) as disp_sale_sixteen,		
		
		((SELECT ds.`slot_param_val` as s12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='17:00')-(SELECT ds.`slot_param_val` as r12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='16:00') + 
		(SELECT ds.`slot_param_val` as s13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='17:00')-(SELECT ds.`slot_param_val` as r13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='16:00') + 
		(SELECT ds.`slot_param_val` as s14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='17:00')-(SELECT ds.`slot_param_val` as r14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='16:00') + 
		(SELECT ds.`slot_param_val` as s15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='17:00')-(SELECT ds.`slot_param_val` as r15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='16:00')) as disp_sale_seventeen,		
		
		((SELECT ds.`slot_param_val` as t12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='18:00')-(SELECT ds.`slot_param_val` as s12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='17:00') + 
		(SELECT ds.`slot_param_val` as t13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='18:00')-(SELECT ds.`slot_param_val` as s13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='17:00') + 
		(SELECT ds.`slot_param_val` as t14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='18:00')-(SELECT ds.`slot_param_val` as s14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='17:00') + 
		(SELECT ds.`slot_param_val` as t15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='18:00')-(SELECT ds.`slot_param_val` as s15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='17:00')) as disp_sale_eighteen,		
		
		((SELECT ds.`slot_param_val` as u12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='19:00')-(SELECT ds.`slot_param_val` as t12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='18:00') + 
		(SELECT ds.`slot_param_val` as u13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='19:00')-(SELECT ds.`slot_param_val` as t13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='18:00') + 
		(SELECT ds.`slot_param_val` as u14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='19:00')-(SELECT ds.`slot_param_val` as t14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='18:00') + 
		(SELECT ds.`slot_param_val` as u15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='19:00')-(SELECT ds.`slot_param_val` as t15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='18:00')) as disp_sale_nineteen,		
		
		((SELECT ds.`slot_param_val` as v12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='20:00')-(SELECT ds.`slot_param_val` as u12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='19:00') + 
		(SELECT ds.`slot_param_val` as v13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='20:00')-(SELECT ds.`slot_param_val` as u13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='19:00') + 
		(SELECT ds.`slot_param_val` as v14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='20:00')-(SELECT ds.`slot_param_val` as u14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='19:00') + 
		(SELECT ds.`slot_param_val` as v15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='20:00')-(SELECT ds.`slot_param_val` as u15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='19:00')) as disp_sale_twenty,		
		
		((SELECT ds.`slot_param_val` as w12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='21:00')-(SELECT ds.`slot_param_val` as v12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='20:00') + 
		(SELECT ds.`slot_param_val` as w13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='21:00')-(SELECT ds.`slot_param_val` as v13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='20:00') + 
		(SELECT ds.`slot_param_val` as w14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='21:00')-(SELECT ds.`slot_param_val` as v14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='20:00') + 
		(SELECT ds.`slot_param_val` as w15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='21:00')-(SELECT ds.`slot_param_val` as v15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='20:00')) as disp_sale_twentyone,
		
		((SELECT ds.`slot_param_val` as x12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='22:00')-(SELECT ds.`slot_param_val` as w12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='21:00') + 
		(SELECT ds.`slot_param_val` as x13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='22:00')-(SELECT ds.`slot_param_val` as w13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='21:00') + 
		(SELECT ds.`slot_param_val` as x14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='22:00')-(SELECT ds.`slot_param_val` as w14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='21:00') + 
		(SELECT ds.`slot_param_val` as x15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='22:00')-(SELECT ds.`slot_param_val` as w15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='21:00')) as disp_sale_twentytwo,		
		
		((SELECT ds.`slot_param_val` as y12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='23:00')-(SELECT ds.`slot_param_val` as x12 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 A' AND `time_slot`='22:00') + 
		(SELECT ds.`slot_param_val` as y13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='23:00')-(SELECT ds.`slot_param_val` as x13 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 1 B' AND `time_slot`='22:00') + 
		(SELECT ds.`slot_param_val` as y14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='23:00')-(SELECT ds.`slot_param_val` as x14 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 A' AND `time_slot`='22:00') + 
		(SELECT ds.`slot_param_val` as y15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='23:00')-(SELECT ds.`slot_param_val` as x15 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='DISP 2 B' AND `time_slot`='22:00')) as disp_sale_twentythree,
		
		
		((SELECT ds.`slot_param_val` as c21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='01:00')-(SELECT ds.`slot_param_val` as b21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='00:00')) * 0.1 as reactive_chrg_one,

		((SELECT ds.`slot_param_val` as d21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='02:00')-(SELECT ds.`slot_param_val` as c21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='01:00')) * 0.1 as reactive_chrg_two,
		
		((SELECT ds.`slot_param_val` as e21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='03:00')-(SELECT ds.`slot_param_val` as d21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='02:00')) * 0.1 as reactive_chrg_three,
		
		((SELECT ds.`slot_param_val` as f21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='04:00')-(SELECT ds.`slot_param_val` as e21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='03:00')) * 0.1 as reactive_chrg_four,
		
		((SELECT ds.`slot_param_val` as g21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='05:00')-(SELECT ds.`slot_param_val` as f21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='04:00')) * 0.1 as reactive_chrg_five,
		
		((SELECT ds.`slot_param_val` as h21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='06:00')-(SELECT ds.`slot_param_val` as g21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='05:00')) * 0.1 as reactive_chrg_six,
		
		((SELECT ds.`slot_param_val` as i21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='07:00')-(SELECT ds.`slot_param_val` as h21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='06:00')) * 0.1 as reactive_chrg_seven,
		
		((SELECT ds.`slot_param_val` as j21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='08:00')-(SELECT ds.`slot_param_val` as i21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='07:00')) * 0.1 as reactive_chrg_eight,
		
		((SELECT ds.`slot_param_val` as k21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='09:00')-(SELECT ds.`slot_param_val` as j21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='08:00')) * 0.1 as reactive_chrg_nine,
		
		((SELECT ds.`slot_param_val` as l21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='10:00')-(SELECT ds.`slot_param_val` as k21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='09:00')) * 0.1 as reactive_chrg_ten,
		
		((SELECT ds.`slot_param_val` as m21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='11:00')-(SELECT ds.`slot_param_val` as l21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='10:00')) * 0.1 as reactive_chrg_eleven,
		
		((SELECT ds.`slot_param_val` as n21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='12:00')-(SELECT ds.`slot_param_val` as m21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='11:00')) * 0.1 as reactive_chrg_twelve,
		
		((SELECT ds.`slot_param_val` as o21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='13:00')-(SELECT ds.`slot_param_val` as n21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='12:00')) * 0.1 as reactive_chrg_thirteen,
		
		((SELECT ds.`slot_param_val` as p21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='14:00')-(SELECT ds.`slot_param_val` as o21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='13:00')) * 0.1 as reactive_chrg_fourteen,
		
		((SELECT ds.`slot_param_val` as q21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='15:00')-(SELECT ds.`slot_param_val` as p21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='14:00')) * 0.1 as reactive_chrg_fifteen,
		
		((SELECT ds.`slot_param_val` as r21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='16:00')-(SELECT ds.`slot_param_val` as q21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='15:00')) * 0.1 as reactive_chrg_sixteen,
		
		((SELECT ds.`slot_param_val` as s21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='17:00')-(SELECT ds.`slot_param_val` as r21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='16:00')) * 0.1 as reactive_chrg_seventeen,
		
		((SELECT ds.`slot_param_val` as t21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='18:00')-(SELECT ds.`slot_param_val` as s21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='17:00')) * 0.1 as reactive_chrg_eighteen,
		
		((SELECT ds.`slot_param_val` as u21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='19:00')-(SELECT ds.`slot_param_val` as t21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='18:00')) * 0.1 as reactive_chrg_nineteen,
		
		((SELECT ds.`slot_param_val` as v21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='20:00')-(SELECT ds.`slot_param_val` as u21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='19:00')) * 0.1 as reactive_chrg_twenty,
		
		((SELECT ds.`slot_param_val` as w21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='21:00')-(SELECT ds.`slot_param_val` as v21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='20:00')) * 0.1 as reactive_chrg_twentyone,
		
		((SELECT ds.`slot_param_val` as x21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='22:00')-(SELECT ds.`slot_param_val` as w21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='21:00')) * 0.1 as reactive_chrg_twentytwo,
		
		((SELECT ds.`slot_param_val` as y21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='23:00')-(SELECT ds.`slot_param_val` as x21 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVRH' AND `time_slot`='22:00')) * 0.1 as reactive_chrg_twentythree,
		
		
		((SELECT ds.`slot_param_val` as c19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='01:00')/(SELECT ds.`slot_param_val` as c20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='01:00')) as pf_one,
		
		((SELECT ds.`slot_param_val` as d19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='02:00')/(SELECT ds.`slot_param_val` as d20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='02:00')) as pf_two,
		
		((SELECT ds.`slot_param_val` as e19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='03:00')/(SELECT ds.`slot_param_val` as e20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='03:00')) as pf_three,
		
		((SELECT ds.`slot_param_val` as f19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='04:00')/(SELECT ds.`slot_param_val` as f20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='04:00')) as pf_four,
		
		((SELECT ds.`slot_param_val` as g19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='05:00')/(SELECT ds.`slot_param_val` as g20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='05:00')) as pf_five,
		
		((SELECT ds.`slot_param_val` as h19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='06:00')/(SELECT ds.`slot_param_val` as h20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='06:00')) as pf_six,
		
		((SELECT ds.`slot_param_val` as i19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='07:00')/(SELECT ds.`slot_param_val` as i20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='07:00')) as pf_seven,
		
		((SELECT ds.`slot_param_val` as j19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='08:00')/(SELECT ds.`slot_param_val` as j20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='08:00')) as pf_eight,
		
		((SELECT ds.`slot_param_val` as k19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='09:00')/(SELECT ds.`slot_param_val` as k20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='09:00')) as pf_nine,
		
		((SELECT ds.`slot_param_val` as l19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='10:00')/(SELECT ds.`slot_param_val` as l20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='10:00')) as pf_ten,
		
		((SELECT ds.`slot_param_val` as m19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='11:00')/(SELECT ds.`slot_param_val` as m20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='11:00')) as pf_eleven,
		
		((SELECT ds.`slot_param_val` as n19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='12:00')/(SELECT ds.`slot_param_val` as n20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='12:00')) as pf_twelve,
		
		((SELECT ds.`slot_param_val` as o19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='13:00')/(SELECT ds.`slot_param_val` as o20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='13:00')) as pf_thirteen,
		
		((SELECT ds.`slot_param_val` as p19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='14:00')/(SELECT ds.`slot_param_val` as p20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='14:00')) as pf_fourteen,
		
		((SELECT ds.`slot_param_val` as q19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='15:00')/(SELECT ds.`slot_param_val` as p20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='15:00')) as pf_fifteen, 
		
		((SELECT ds.`slot_param_val` as r19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='16:00')/(SELECT ds.`slot_param_val` as r20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='16:00')) as pf_sixteen, 
		
		((SELECT ds.`slot_param_val` as s19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='17:00')/(SELECT ds.`slot_param_val` as s20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='17:00')) as pf_seventeen,

		((SELECT ds.`slot_param_val` as t19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='18:00')/(SELECT ds.`slot_param_val` as t20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='18:00')) as pf_eighteen,
		
		((SELECT ds.`slot_param_val` as u19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='19:00')/(SELECT ds.`slot_param_val` as u20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='19:00')) as pf_nineteen,
		
		((SELECT ds.`slot_param_val` as v19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='20:00')/(SELECT ds.`slot_param_val` as v20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='20:00')) as pf_twenty,
		
		((SELECT ds.`slot_param_val` as w19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='21:00')/(SELECT ds.`slot_param_val` as w20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='21:00')) as pf_twentyone,
		
		((SELECT ds.`slot_param_val` as x19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='22:00')/(SELECT ds.`slot_param_val` as x20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='22:00')) as pf_twentytwo,
		
		((SELECT ds.`slot_param_val` as y19 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KWH' AND `time_slot`='23:00')/(SELECT ds.`slot_param_val` as y20 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='GEB Energy Meter KVAH' AND `time_slot`='23:00')) as pf_twentythree,
		
		
		((SELECT ds.`slot_param_val` as c18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='01:00')-(SELECT ds.`slot_param_val` as b18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='00:00')) as cmp_runhrs_one,
		
		((SELECT ds.`slot_param_val` as d18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='02:00')-(SELECT ds.`slot_param_val` as c18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='01:00')) as cmp_runhrs_two,
		
		((SELECT ds.`slot_param_val` as e18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='03:00')-(SELECT ds.`slot_param_val` as d18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='02:00')) as cmp_runhrs_three,
		
		((SELECT ds.`slot_param_val` as f18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='04:00')-(SELECT ds.`slot_param_val` as e18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='03:00')) as cmp_runhrs_four,
		
		((SELECT ds.`slot_param_val` as g18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='05:00')-(SELECT ds.`slot_param_val` as f18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='04:00')) as cmp_runhrs_five,
		
		((SELECT ds.`slot_param_val` as h18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='06:00')-(SELECT ds.`slot_param_val` as g18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='05:00')) as cmp_runhrs_six,
		
		((SELECT ds.`slot_param_val` as i18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='07:00')-(SELECT ds.`slot_param_val` as h18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='06:00')) as cmp_runhrs_seven,
		
		((SELECT ds.`slot_param_val` as j18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='08:00')-(SELECT ds.`slot_param_val` as i18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='07:00')) as cmp_runhrs_eight,
		
		((SELECT ds.`slot_param_val` as k18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='09:00')-(SELECT ds.`slot_param_val` as j18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='08:00')) as cmp_runhrs_nine,
		
		((SELECT ds.`slot_param_val` as l18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='10:00')-(SELECT ds.`slot_param_val` as k18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='09:00')) as cmp_runhrs_ten,
		
		((SELECT ds.`slot_param_val` as m18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='11:00')-(SELECT ds.`slot_param_val` as l18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='10:00')) as cmp_runhrs_eleven,
		
		((SELECT ds.`slot_param_val` as n18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='12:00')-(SELECT ds.`slot_param_val` as m18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='11:00')) as cmp_runhrs_twelve,
		
		((SELECT ds.`slot_param_val` as o18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='13:00')-(SELECT ds.`slot_param_val` as n18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='12:00')) as cmp_runhrs_thirteen,
		
		((SELECT ds.`slot_param_val` as p18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='14:00')-(SELECT ds.`slot_param_val` as o18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='13:00')) as cmp_runhrs_fourteen,
		
		((SELECT ds.`slot_param_val` as q18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='15:00')-(SELECT ds.`slot_param_val` as p18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='14:00')) as cmp_runhrs_fifteen,
		
		((SELECT ds.`slot_param_val` as r18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='16:00')-(SELECT ds.`slot_param_val` as q18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='15:00')) as cmp_runhrs_sixteen,
		
		((SELECT ds.`slot_param_val` as s18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='17:00')-(SELECT ds.`slot_param_val` as r18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='16:00')) as cmp_runhrs_seventeen,
		
		((SELECT ds.`slot_param_val` as t18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='18:00')-(SELECT ds.`slot_param_val` as s18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='17:00')) as cmp_runhrs_eighteen,
		
		((SELECT ds.`slot_param_val` as u18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='19:00')-(SELECT ds.`slot_param_val` as t18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='18:00')) as cmp_runhrs_nineteen,
		
		((SELECT ds.`slot_param_val` as v18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='20:00')-(SELECT ds.`slot_param_val` as u18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='19:00')) as cmp_runhrs_twenty,
		
		((SELECT ds.`slot_param_val` as w18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='21:00')-(SELECT ds.`slot_param_val` as v18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='20:00')) as cmp_runhrs_twentyone,
		
		((SELECT ds.`slot_param_val` as x18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='22:00')-(SELECT ds.`slot_param_val` as w18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='21:00')) as cmp_runhrs_twentytwo,
		
		((SELECT ds.`slot_param_val` as y18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='23:00')-(SELECT ds.`slot_param_val` as x18 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp HMR Counter' AND `time_slot`='22:00')) as cmp_runhrs_twentythree,
		
		((SELECT ds.`slot_param_val` as c38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='01:00')) as suc_prsr_one,		
		((SELECT ds.`slot_param_val` as d38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='02:00')) as suc_prsr_two,
		((SELECT ds.`slot_param_val` as e38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='03:00')) as suc_prsr_three,
		((SELECT ds.`slot_param_val` as f38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='04:00')) as suc_prsr_four,
		((SELECT ds.`slot_param_val` as g38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='05:00')) as suc_prsr_five,
		((SELECT ds.`slot_param_val` as h38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='06:00')) as suc_prsr_six,
		((SELECT ds.`slot_param_val` as i38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='07:00')) as suc_prsr_seven,
		((SELECT ds.`slot_param_val` as j38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='08:00')) as suc_prsr_eight,
		((SELECT ds.`slot_param_val` as k38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='09:00')) as suc_prsr_nine,
		((SELECT ds.`slot_param_val` as l38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='10:00')) as suc_prsr_ten,
		((SELECT ds.`slot_param_val` as m38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='11:00')) as suc_prsr_eleven,
		((SELECT ds.`slot_param_val` as n38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='12:00')) as suc_prsr_twelve,
		((SELECT ds.`slot_param_val` as o38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='13:00')) as suc_prsr_thirteen,
		((SELECT ds.`slot_param_val` as p38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='14:00')) as suc_prsr_fourteen,
		((SELECT ds.`slot_param_val` as q38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='15:00')) as suc_prsr_fifteen,
		((SELECT ds.`slot_param_val` as r38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='16:00')) as suc_prsr_sixteen,
		((SELECT ds.`slot_param_val` as s38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='17:00')) as suc_prsr_seventeen,
		((SELECT ds.`slot_param_val` as t38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='18:00')) as suc_prsr_eighteen,
		((SELECT ds.`slot_param_val` as u38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='19:00')) as suc_prsr_nineteen,
		((SELECT ds.`slot_param_val` as v38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='20:00')) as suc_prsr_twenty,
		((SELECT ds.`slot_param_val` as w38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='21:00')) as suc_prsr_twentyone,
		((SELECT ds.`slot_param_val` as x38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='22:00')) as suc_prsr_twentytwo,
		((SELECT ds.`slot_param_val` as y38 FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Suction Pressure' AND `time_slot`='23:00')) as suc_prsr_twentythree,


		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='00:00')) as b22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='01:00')) as c22,		
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='02:00')) as d22,		
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='03:00')) as e22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='04:00')) as f22,		
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='05:00')) as g22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='06:00')) as h22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='07:00')) as i22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='08:00')) as j22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='09:00')) as k22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='10:00')) as l22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='11:00')) as m22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='12:00')) as n22,		
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='13:00')) as o22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='14:00')) as p22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='15:00')) as q22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='16:00')) as r22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='17:00')) as s22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='18:00')) as t22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='19:00')) as u22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='20:00')) as v22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='21:00')) as w22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='22:00')) as x22,
		((SELECT ds.`slot_param_val` FROM `tbl_dpr_sheet` as ds WHERE d.`dpr_id`=ds.`dpr_id` AND ds.`dpr_params`='Comp Energy Meter' AND `time_slot`='23:00')) as y22	
		from tbl_dpr as d where d.dpr_id=$dprID")->result_array(); 
	} 
	public function getTotalDPREntry($station_id,$dpr_mnth,$dpr_year){
		$this->db->select("*");
		$this->db->where("station_id",$station_id);
		$this->db->where("MONTH(dpr_date)",$dpr_mnth);
		$this->db->where("YEAR(dpr_date)",$dpr_year);
		return $this->db->get("tbl_dpr")->result_array();
	}
}
?>