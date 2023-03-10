<template>
	<div>
		<!-- 甘特图的容器 -->
		<div v-show="runVisible" style="background-color: white;">
			<el-container id="myChart1" style="width: 300px; height: 100px; float: left;">
			</el-container>
			<el-container id="myChart2" style="width: 300px; height: 100px; float: left;">
			</el-container>
			<el-container id="myChart3" style="width: 300px; height: 100px; float: left;">
			</el-container>
			<el-container id="myChart4" style="width: 300px; height: 100px;">
			</el-container>
			<el-container id="myChart" style="width: 1200px; height: 400px;">
			</el-container>
		</div>

		<div class="container" v-show="fromVisible">
			<div class="handle-box">
				<el-input v-model="query.batchid" placeholder="Sample Type" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" :icon="Plus" @click="handleadd">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="batchid" label="batchid" width="150" align="center"></el-table-column>
				<el-table-column prop="productid" label="ProductID" width="150" align="center"></el-table-column>
				<el-table-column prop="arrivaldate" label="Arrive Data" align="center"></el-table-column>
				<el-table-column prop="createby" label="是否为手动添加" width="150" align="center">
					<template #default="scope">
						<el-tag
							:type="scope.row.createby === true ? 'success' : scope.row.createby === false ? 'danger' : ''">
							{{ scope.row.createby }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="hasduedate" label="是否为紧急批次" width="150" align="center">
					<template #default="scope">
						<el-tag
							:type="scope.row.hasduedate === true ? 'success' : scope.row.hasduedate === false ? 'danger' : ''">
							{{ scope.row.hasduedate }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="220" align="center">
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleEdit(scope.row.id,scope.row)" v-permiss="15">编辑</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.row.id)" v-permiss="16" :disabled="scope.row.createby === false">删除</el-button>
					</template>
				</el-table-column>
			</el-table>



			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
					:page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
				<el-button id="run" type="primary" style="position: relative;" @click="runBtn()"
					v-loading.fullscreen.lock="fullscreenLoading">运行</el-button>
			</div>

		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" v-model="editVisible" width="30%">
			<el-form label-width="150px">
				<el-form-item label="BatchID">
					<el-input prop="batchid" v-model="form.BatchId"></el-input>
				</el-form-item>
				<el-form-item label="productID">
					<el-input prop="productid" v-model="form.ProductID"></el-input>
				</el-form-item>
				<el-form-item label="Arrive Data">
					<el-input prop="arrivaldate" v-model="form.ArriveData"></el-input>
				</el-form-item>
				<!-- 				<el-form-item label="是否手动添加">
					<el-select prop="createby" v-model="form.CreateBy" placeholder="请选择">
						<el-option label="true" value="true"></el-option>
						<el-option label="fasle" value="fasle"></el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="是否为紧急批次">
					<el-select prop="hasduedate" v-model="form.select" placeholder="请选择">
						<el-option label="true" value="true"></el-option>
						<el-option label="fasle" value="fasle"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
			</template>
		</el-dialog>

		<!-- 新增弹出框 -->
		<el-dialog title="新增" v-model="addVisible" width="30%">
			<el-form label-width="150px" :model="form">
				<el-form-item prop="productid" label="ProductID">
					<el-input v-model="form.ProductID"></el-input>
				</el-form-item>
				<el-form-item label="Arrive Data">
					<el-input prop="arrivedata" v-model="form.ArriveData"></el-input>
				</el-form-item>
				<el-form-item label="是否为紧急批次">
					<el-select prop="hasduedate" v-model="form.select" placeholder="请选择">
						<el-option label="true" value="true"></el-option>
						<el-option label="fasle" value="fasle"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="addVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveAdd(form)">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="tabs">
	import {ref,reactive} from 'vue';
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus';
	import {
		Delete,
		Edit,
		Search,
		Plus
	} from '@element-plus/icons-vue';
	import {
		onMounted,
		getCurrentInstance
	} from 'vue'
	import type {
		TableItem,
		TableRunItem
	} from "../type/login";
	import {
		FindData,
		DelData,
		UpData,
		RunData,
		AddData
	} from '../api/index';
	import axios from 'axios';
	import {
		number
	} from 'echarts';
	//import { id } from 'element-plus/es/locale';
	//import { number } from 'echarts';
	//import Table from 'wangeditor/dist/menus/table';
	//const { defineConfig } = require('@vue/cli-service')

	const pageTotal = ref(0);
	const tableData = ref < TableItem[] > ([]);
	//const tableRunData = ref < TableRunItem[] > ([]);

	//查询
	const onsubmit = () => {
		FindData().then(res => {
			console.log(res)
			tableData.value = res.data;
			pageTotal.value = res.data.pageTotal || 10;
		})
	}
	onsubmit()

	// 删除操作
	const handleDelete = (index: number) => {
		//console.log()
		// 二次确认删除
		ElMessageBox.confirm('确定要删除吗？', '提示', {
				type: 'warning'
			})
			.then(res => {
				console.log(res)
				ElMessage.success('删除成功');
				tableData.value.splice(index, 1); //1的意思是一次删一行
				DelData(index);
			})
			.catch(() => {});
	};
	// 分页导航
	const handlePageChange = (val: number) => {
		query.pageIndex = val;
		onsubmit();
	};
	const query = reactive({
		arrivaldate: '',
		batchid: '',
		createby: '',
		duedate: '',
		hasduedate: '',
		id: '',
		productfamily: '',
		productid: '',
		productname: '',
		pageIndex: 1,
		pageSize: 100,
		value: true
	});

	const queryrun = reactive({
		StartTime: '',
		EndTime: '',
		RunTime: '',
		Comment: '',
		value: true
	});

	let form = reactive({
		ArriveData: '',
		BatchId: '',
		CreateBy: true,
		DueDate: '',
		select: true,
		Id: '',
		ProductFamily: '',
		ProductID: '',
		productname: '',
		value: true
	});

	let forms = reactive({
		StartTime: '',
		EndTime: '',
		RunTime: '',
		Comment: '',
	})


	// 查询操作
	const handleSearch = () => {
		query.pageIndex = 1;
		onsubmit();
	};

	//新增的v-model事件，默认不显示
	const addVisible = ref(false);

	//点击新增时弹框
	const handleadd = () => {
		addVisible.value = true;
	}
	/* 
	 tableData.value[idx].arrivaldate = form.ArriveData;
	 tableData.value[idx].batchid = form.BatchId;
	 tableData.value[idx].createby = form.CreateBy;
	 tableData.value[idx].duedate = form.DueDate;
	 tableData.value[idx].hasduedate = form.select;
	 tableData.value[idx].id = form.Id;
	 tableData.value[idx].productfamily = form.ProductFamily;
	 tableData.value[idx].productid = form.ProductID;
	 tableData.value[idx].productname = form.productname;*/
	//点击新增弹出框的保存,调用接口
	const saveAdd = () => {
		//console.log(	{'productid':form.ProductID,'arrivaldate':form.ArriveData ,'hasduedate':form.select})
		axios.post(
			"http://10.204.16.53:8020/QCLab/simio/arrival_table/add", {
				'arrivaldate': form.ArriveData,
				'batchid': '20L2-2-1-23',
				'createby': false,
				'duedate': "2022-12-23 12:23:00",
				'hasduedate': form.select,
				'productfamily': "2",
				'productid': form.ProductID,
				'productname': "2"
			}
		).then(response => {
			addVisible.value = false;
			ElMessage.success(`新增成功`);
			onsubmit()
			console.log(response.data);
		});


	};

	// 编辑的弹出框，默认不显示
	const editVisible = ref(false);

	let idx: number = -1;

	//点击编辑时，同时把值同时显示在input框
	const handleEdit = (index: number, row: any) => {
		idx = index;
		form.ArriveData = row.arrivaldate
		form.BatchId = row.batchid
		form.DueDate = row.duedate
		form.select = row.hasduedate
		form.Id = row.idx
		form.CreateBy = row.createby
		form.ProductFamily = row.productfamily
		form.ProductID = row.productid
		form.productname = row.productname
		editVisible.value = true;

	};

	// tableData.value.splice(index, 1)
	//点击编辑（确定）时调用接口
	const saveEdit = () => {
		/* 	UpData(index).then(res => {
			console.log(res.data)	
			})
			editVisible.value = false;
			ElMessage.success(`修改第 ${idx + 1} 行成功`);
			console.log(
			{"id": idx,
			"productid":form.ProductID,
			"productname":"2",
			"productfamily":"2",
			"batchid":form.BatchId,
			"arrivaldate":form.ArriveData,
			"duedate":"2022-12-23 12:23:00",
			"hasduedate":form.select,
			"createby":form.CreateBy}
			) */

		axios.put(
			"http://10.204.16.53:8020/QCLab/simio/arrival_table/update",
			//{"id": idx,"productid":form.ProductID,"batchid":form.BatchId,"arrivaldate":form.ArriveData,"hasduedate":form.select,"createby":false}
			//{"id":index,"productid":form.ProductID,"productname":"Tramadol HCL","productfamily":"84","batchid":"2200099133","arrivaldate":"2022-09-26 09:39:00","duedate":"2022-09-26 09:39:00","hasduedate":false,"createby":true}
			/* 		{
					'id':index,
					'arrivaldate': form.ArriveData,
					'batchid':'20L2-2-1-23',
					'createby': false,
					'duedate': "2022-12-23 12:23:00",
					'hasduedate': form.select,
					'productfamily': "2",
					'productid': form.ProductID,
					'productname': "2"
					}	 */
			{
				id: idx,
				productid: form.ProductID,
				productname: 'Water',
				productfamily: 'WATER',
				batchid: '20L2-2-1-M',
				arrivaldate: '2021-01-12 00:00:00',
				duedate: '2021-03-22 00:00:00',
				hasduedate: null,
				createby: null
			}

		).then(response => {
			editVisible.value = false;
			ElMessage.success(`修改成功`);
			onsubmit()
			console.log(response.data + "1111111111111");
		});
	};


	// 点击运行显示甘特图
	const runVisible = ref(false);
	const fromVisible = ref(true);
	const fullscreenLoading = ref(false);
	const runBtn = () => {

		axios.post(
			"http://10.204.16.53:8020/QCLab/simio/run", {
				"startTime": "2022-10-09 12:00:00",
				"endTime": "2022-10-09 12:00:00",
				"runTime": "2022-10-09  12:00:00",
				"comment": "test comments  12:00:00"
			}).then(response => {
			console.log(response.data + "1111111111111");
			fromVisible.value = false;
			fullscreenLoading.value = true;
			runVisible.value = true;
			setTimeout(() => {
				axios.get("http://10.204.16.53:8020/QCLab/simio/run/state", ).then(response => {
					console.log(response.data + "定时请求返回的数据");
				})
				fullscreenLoading.value = false;
			}, 2000);
		});
		/* 	RunData().then(res => {
				console.log(res.data)
			})
			fromVisible.value = false;
			fullscreenLoading.value = true;
			runVisible.value = true;
			setTimeout(() => {
				fullscreenLoading.value = false;
			}, 2000); */
	}







	//下面是甘特图
	onMounted(() => {
		const {
			proxy
		} = getCurrentInstance() as any
		// 配置建议写在 onMount 的外面

		let data = [{
			'value': number,
			'name': String
		}];

		/* 	axios.get("http://10.204.16.53:8020/QCLab/simio/arrival_table/300").then(item=>{
				data[0].value = item.data.id;
				data[0].name = item.data.productname;
			} */


		// 初始化echart
		//var chart = echarts.init(document.getElementById('chart-box'));
		// 各状态的颜色
		var colors = ['red', 'orange', 'yellow'];
		// 状态
		var state = ['正', '负', '大于'];
		const option = {
			color: colors,
			tooltip: {
				formatter: function(params: any) {
					return params.value[1].substr(11) + '~' + params.value[2].substr(11);
				}
			},
			legend: {
				data: state,
				bottom: '1%',
				selectedMode: false, // 图例设为不可点击
				textStyle: {
					color: '#000'
				}
			},
			grid: {
				left: '3%',
				right: '3%',
				top: '1%',
				bottom: '10%',
				containLabel: true
			},
			xAxis: {
				type: 'time',
				//设置横坐标标签格式
				axisLabel: {
					formatter: function(value: any) {
						var date = new Date(value);
						return getzf(date.getFullYear()) + "-" + getzf(date.getMonth() + 1) + "-" + getzf(
								date.getDate())+" " +getzf(date.getHours()) + ':' + getzf(date.getMinutes());

						function getzf(num: any) {
							if (parseInt(num) < 10) {
								num = '0' + num;
							}
							return num;
						}
					}
				}
			},
			yAxis: {
				data: state
			},
			series: [
				// 用空bar来显示图例
				{name: state[0],type: 'bar',data: []},
				{name: state[1],type: 'bar',data: []},
				{name: state[2],type: 'bar',data: []},
				{
					type: 'custom',
					renderItem: function(params: any, api: any) {
						//开发者自定义的图形元素渲染逻辑，是通过书写 renderItem 函数实现的
						var categoryIndex = api.value(0); //这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。
						console.log(categoryIndex)
						var start = api.coord([api.value(1),categoryIndex]); // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。
						console.log(start)
						var end = api.coord([api.value(2), categoryIndex]);
						console.log(end)
						var height = 100;

						return {
							type: 'rect', // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
							shape: echarts.graphic.clipRectByRect({
								// 矩形的位置和大小。
								x: start[0],
								y: start[1] - height / 2,
								width: end[0] - start[0],
								height: height
							}, {
								// 当前坐标系的包围盒。
								x: params.coordSys.x,
								y: params.coordSys.y,
								width: params.coordSys.width,
								height: params.coordSys.height
							}),
							style: api.style()
						};
					},
					encode: {
						x: [1, 2, 3],
						y: 0
					},
					data: [{
							//0表示正常；1表示繁忙
							value: [0, '2021-11-18 05:54:32', '2021-11-18 06:05:32'],
							itemStyle: {
								color: colors[0]
							}
						},
						{
							value: [1, '2021-11-18 06:05:32', '2021-11-18 07:15:32'],
							itemStyle: {
								color: colors[1]
							}
						},
						{
							value: [0, '2021-11-18 07:15:32', '2021-11-18 10:15:59'],
							itemStyle: {
								color: colors[0]
							}
						},
						{
							value: [2, '2021-11-18 07:15:32', '2021-11-18 10:15:59'],
							itemStyle: {
								color: colors[2]
							}
						}
					]
				}
			]
			// title: {
			// 	text: 'Accumulated Waterfall Chart'
			//   },
			//   tooltip: {
			// 	trigger: 'axis',
			// 	axisPointer: {
			// 	  type: 'shadow'
			// 	},
			// 	formatter: function (params: any) {
			// 	  let tar;
			// 	  if (params[1] && params[1].value !== '-') {
			// 		tar = params[1];
			// 	  } else {
			// 		tar = params[2];
			// 	  }
			// 	  return tar && tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
			// 	}
			//   },
			//   legend: {
			// 	data: ['Expenses', 'Income']
			//   },
			//   grid: {
			// 	left: '3%',
			// 	right: '4%',
			// 	bottom: '3%',
			// 	containLabel: true
			//   },
			//   yAxis: {
			// 	type: 'category',
			// 	data: (function () {
			// 	  let list = [];
			// 	  for (let i = 1; i <= 11; i++) {
			// 		list.push('Batch ' + i);
			// 	  }
			// 	  return list;
			// 	})()
			// 	/* data: ['batch1','batch1','batch1','batch1','batch1'] */
			//   },
			//   xAxis: {
			// 	type: 'value'
			//   },
			//   series: [
			// 	{
			// 	  name: 'Placeholder',
			// 	  type: 'bar',
			// 	  stack: 'Total',
			// 	  silent: true,
			// 	  itemStyle: {
			// 		borderColor: 'transparent',
			// 		color: 'transparent'
			// 	  },
			// 	  emphasis: {
			// 		itemStyle: {
			// 		  borderColor: 'transparent',
			// 		  color: 'transparent'
			// 		}
			// 	  },
			// 	  data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
			// 	},
			// 	{
			// 	  name: 'Income',
			// 	  type: 'bar',
			// 	  stack: 'Total',
			// 	  label: {
			// 		show: true,
			// 		position: 'top'
			// 	  },
			// 	  data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-']
			// 	},
			// 	{
			// 	  name: 'Expenses',
			// 	  type: 'bar',
			// 	  stack: 'Total',
			// 	  label: {
			// 		show: true,
			// 		position: 'bottom'
			// 	  },
			// 	  data: ['-', '-', '-', 109, 154, '-', '-', '-', 119, 361, 203]
			// 	}
			//   ]
		}

		const option1 = {
			title: {
				text: '人员利用率',
				//subtext: 'Fake Data',
				left: 'center'
			},
			tooltip: {
				trigger: 'item'
			},
			series: [{
				name: 'Access From',
				type: 'pie',
				radius: '50%',
				label: {
					show: false,
					position: 'center'
				},
				labelLine: {
					show: false
				},
				data: [{
						value: 1048,
						name: 'Search Engine'
					},
					{
						value: 735,
						name: 'Direct'
					},
					{
						value: 580,
						name: 'Email'
					},
					{
						value: 484,
						name: 'Union Ads'
					},
					{
						value: 300,
						name: 'Video Ads'
					}
				]
			}]
		}
		const option2 = {
			title: {
				text: '设备利用率',
				//subtext: 'Fake Data',
				left: 'center'
			},
			tooltip: {
				trigger: 'item'
			},
			series: [{
				name: 'Access From',
				type: 'pie',
				radius: '50%',
				label: {
					show: false,
					position: 'center'
				},
				labelLine: {
					show: false
				},
				data: [{
						value: 1048,
						name: 'Search Engine'
					},
					{
						value: 735,
						name: 'Direct'
					}
				]
			}]
		}

		const option3 = {
			title: {
				text: 'OTD%',
				//subtext: 'Fake Data',
				left: 'center'
			},
			tooltip: {
				trigger: 'item'
			},
			series: [{
				name: 'Access From',
				type: 'pie',
				radius: '50%',
				label: {
					show: false,
					position: 'center'
				},
				labelLine: {
					show: false
				},
				data: [{
						value: 1048,
						name: 'Search Engine'
					},
					{
						value: 735,
						name: 'Direct'
					},
					{
						value: 580,
						name: 'Email'
					},
					{
						value: 484,
						name: 'Union Ads'
					},
					{
						value: 300,
						name: 'Video Ads'
					}
				]
			}]
		}

		const option4 = {
			toolbox: {
				feature: {
					myTool: {
						show: true, //是否显示
						title: "关闭", //鼠标悬空的提示文字
						icon: "path://M511.99429 0C229.224075 0 0 229.224075 0 511.99429S229.224075 1023.98858 511.99429 1023.98858 1023.98858 794.764506 1023.98858 511.99429 794.764506 0 511.99429 0z m212.311762 675.556111a34.258567 34.258567 0 0 1 0 48.453034 34.258567 34.258567 0 0 1-48.441614 0L512.382554 560.527261 348.91209 724.009145a34.258567 34.258567 0 0 1-48.453034 0 34.258567 34.258567 0 0 1 0-48.453034l163.470464-163.470465-163.470464-163.481883a34.261993 34.261993 0 0 1 48.453034-48.453034L512.382554 463.632613l163.481884-163.481884a34.258567 34.258567 0 0 1 48.441614 0 34.258567 34.258567 0 0 1 0 48.453034L560.835588 512.085646z", //这个是阿里icon svg 后 b的全部字符串
						onclick: () => {
							//参数o 是图表的option 我这里并没有用到
							runVisible.value = false;
							fromVisible.value = true;
						},
					},
				},
			},
			title: {
				text: 'Cycle Time',
				//subtext: 'Fake Data',
				left: 'center'
			},
			tooltip: {
				trigger: 'item'
			},
			series: [{
				name: 'Access From',
				type: 'pie',
				radius: '50%',
				label: {
					show: false,
					position: 'center'
				},
				labelLine: {
					show: false
				},
				data: [{
						value: 1048,
						name: 'Search Engine'
					},
					{
						value: 735,
						name: 'Direct'
					},
					{
						value: 580,
						name: 'Email'
					},
					{
						value: 484,
						name: 'Union Ads'
					},
					{
						value: 300,
						name: 'Video Ads'
					}
				]
			}]
		}
		// 获取挂载的组件实例
		const echarts = proxy.$ECharts


		//初始化挂载
		const echartsmain = echarts.init(document.getElementById('myChart'))
		//添加配置
		echartsmain.setOption(option)
		// 自适应
		window.onresize = function() {
			echartsmain.resize()
		}

		//初始化挂载
		const echarts1 = echarts.init(document.getElementById('myChart1'))
		//添加配置
		echarts1.setOption(option1)
		// 自适应
		window.onresize = function() {
			echarts1.resize()
		}
		const echarts2 = echarts.init(document.getElementById('myChart2'))
		//添加配置
		echarts2.setOption(option2)
		// 自适应
		window.onresize = function() {
			echarts2.resize()
		}

		const echarts3 = echarts.init(document.getElementById('myChart3'))
		//添加配置
		echarts3.setOption(option3)
		// 自适应
		window.onresize = function() {
			echarts3.resize()
		}

		const echarts4 = echarts.init(document.getElementById('myChart4'))
		//添加配置
		echarts4.setOption(option4)
		// 自适应
		window.onresize = function() {
			echarts4.resize()
		}
		return {}
	})

	const pickerOptions = () => {
		return {
			value1: '',
		};
	}
	// export default {
	//     data() {
	//       return {
	//         pickerOptions: {

	//         },
	//         value1: ''
	//       };
	//     }
	//   };
</script>

<style scoped>
	.handle-box {
		margin-bottom: 20px;
	}

	.handle-select {
		width: 120px;
	}

	.handle-input {
		width: 300px;
	}

	.table {
		width: 100%;
		font-size: 14px;
	}

	.red {
		color: #ff0000;
	}

	.mr10 {
		margin-right: 10px;
	}
</style>
