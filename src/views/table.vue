<!-- <template>
	<div class="container">
		<el-tabs v-model="message">
			<el-tab-pane :label="`未读消息(${state.unread.length})`" name="first">
				<el-table :data="state.unread" :show-header="false" style="width: 100%">
					<el-table-column>
						<template #default="scope">
							<span class="message-title">{{ scope.row.title }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="date" width="180"></el-table-column>
					<el-table-column width="120">
						<template #default="scope">
							<el-button size="small" @click="handleRead(scope.$index)">标为已读</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="handle-row">
					<el-button type="primary">全部标为已读</el-button>
				</div>
			</el-tab-pane>
			<el-tab-pane :label="`已读消息(${state.read.length})`" name="second">
				<template v-if="message === 'second'">
					<el-table :data="state.read" :show-header="false" style="width: 100%">
						<el-table-column>
							<template #default="scope">
								<span class="message-title">{{ scope.row.title }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="date" width="150"></el-table-column>
						<el-table-column width="120">
							<template #default="scope">
								<el-button type="danger" @click="handleDel(scope.$index)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="handle-row">
						<el-button type="danger">删除全部</el-button>
					</div>
				</template>
			</el-tab-pane>
			<el-tab-pane :label="`回收站(${state.recycle.length})`" name="third">
				<template v-if="message === 'third'">
					<el-table :data="state.recycle" :show-header="false" style="width: 100%">
						<el-table-column>
							<template #default="scope">
								<span class="message-title">{{ scope.row.title }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="date" width="150"></el-table-column>
						<el-table-column width="120">
							<template #default="scope">
								<el-button @click="handleRestore(scope.$index)">还原</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="handle-row">
						<el-button type="danger">清空回收站</el-button>
					</div>
				</template>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts" name="tabs">
import { ref, reactive } from 'vue';

const message = ref('first');
const state = reactive({
	unread: [
		{
			date: '2018-04-19 20:00:00',
			title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
		},
		{
			date: '2018-04-19 21:00:00',
			title: '今晚12点整发大红包，先到先得'
		}
	],
	read: [
		{
			date: '2018-04-19 20:00:00',
			title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
		}
	],
	recycle: [
		{
			date: '2018-04-19 20:00:00',
			title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
		}
	]
});

const handleRead = (index: number) => {
	const item = state.unread.splice(index, 1);
	state.read = item.concat(state.read);
};
const handleDel = (index: number) => {
	const item = state.read.splice(index, 1);
	state.recycle = item.concat(state.recycle);
};
const handleRestore = (index: number) => {
	const item = state.recycle.splice(index, 1);
	state.read = item.concat(state.read);
};
</script>

<style>
.message-title {
	cursor: pointer;
}
.handle-row {
	margin-top: 30px;
}
</style>
 -->
 
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
 				<!-- <el-select v-model="query.ArriveData" placeholder="地址" class="handle-select mr10">
 					<el-option key="1" label="广东省" value="广东省"></el-option>
 					<el-option key="2" label="湖南省" value="湖南省"></el-option>
 				</el-select> -->
 				<el-input v-model="query.name" placeholder="Sample Type" class="handle-input mr10"></el-input>
 				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
 				<el-button type="primary" :icon="Plus">新增</el-button>
 			</div>
 			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
 				<el-table-column prop="BatchID" label="BatchID" width="100" align="center"></el-table-column>
 				<el-table-column prop="ProductID" label="ProductID" width="150" align="center"></el-table-column>
 				<!-- 				<el-table-column label="账户余额">
 					<template #default="scope">￥{{ scope.row.money }}</template>
 				</el-table-column> -->
 				<!-- 				<el-table-column label="头像(查看大图)" align="center">
 					<template #default="scope">
 						<el-image
 							class="table-td-thumb"
 							:src="scope.row.thumb"
 							:z-index="10"
 							:preview-src-list="[scope.row.thumb]"
 							preview-teleported
 						>
 						</el-image>
 					</template>
 				</el-table-column> -->
 				<el-table-column prop="ArriveData" label="Arrive Data" align="center"></el-table-column>
 				<el-table-column prop="state" label="是否为紧急批次" width="150" align="center">
 					<template #default="scope">
 						<el-tag :type="scope.row.state === '是' ? 'success' : scope.row.state === '否' ? 'danger' : ''">
 							{{ scope.row.state }}
 						</el-tag>
 					</template>
 				</el-table-column>
 
 				<!-- <el-table-column prop="date" label="注册时间"></el-table-column> -->
 				<el-table-column label="操作" width="220" align="center">
 					<template #default="scope">
 						<el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">编辑</el-button>
 						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">删除</el-button>
 					</template>
 				</el-table-column>
 			</el-table>
 
 			<el-button id="run" type="primary" style="position: absolute;right: 80px;margin: 20px;" @click="runBtn()" v-loading.fullscreen.lock="fullscreenLoading">运行</el-button>
 
 			<div class="pagination">
 				<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
 					:page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
 
 			</div>
 		</div>
 
 		<!-- 编辑弹出框 -->
 		<el-dialog title="编辑" v-model="editVisible" width="30%">
 			<el-form label-width="150px">
 				<el-form-item label="productID">
 					<el-input v-model="form.ProductID"></el-input>
 				</el-form-item>
 				<el-form-item label="Arrive Data">
 					<!-- <el-input v-model="form.ArriveData"></el-input> -->
 					<!-- 下面注释的是时间选择器 -->
 					    <el-date-picker v-model="value1" 
 						type="daterange" 
 						range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" 
 						:picker-options="pickerOptions">
 					    </el-date-picker>
 <!-- 					          <el-date-picker
 					              v-model="value1"
 					              type="datetimerange"
 					              :disabled-hours="disabledHours"
 					              range-separator="To"
 					              start-placeholder="Start date"
 					              end-placeholder="End date"
 					              :disablesDate="disablesDate"
 					
 					          /> -->
 				</el-form-item>
 				<el-form-item label="是否为紧急批次">
 					<el-select v-model="form.select" placeholder="请选择">
 						<el-option label="是" value="是"></el-option>
 						<el-option label="否" value="否"></el-option>
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
 	</div>
 </template>
 
 <script setup lang="ts" name="tabs">
 import {ref,reactive} from 'vue';
 import {ElMessage,ElMessageBox} from 'element-plus';
 import {Delete,Edit,Search,Plus, SetUp} from '@element-plus/icons-vue';
 import {fetchData} from '../api/index';
 import {defineComponent,onMounted,getCurrentInstance} from 'vue'
 //import axios from 'axios'
 
 	// const disablesDate = (time) => {
 	// /*  const _minTime = Date.now() + 24 * 60 * 60 * 1000 * 7 //最小时间可选前七天
 	//   const _maxTime = Date.now() - 24 * 60 * 60 * 1000 * 1 //最大时间可选今天
 	//   return time.getTime() <= _maxTime || time.getTime() > _minTime*/
 	//   const _minTime = 1648636781006 //
 	//   const _maxTime = 1648637497427 //
 	//   // console.log(time)
 	//   // console.log(moment(time.getTime()).format('YYYY-MM-DD HH:mm:ss') )
 	//   return time.getTime() <= _maxTime || time.getTime() > _minTime
 	// }
 	
 	const pickerOptions = () => {
 		console.log("aaaa")
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
 
 	onMounted(() => {
 		const { proxy } = getCurrentInstance() as any
 		// 配置建议写在 onMount 的外面
 		const option = {
 			title: {
 			    text: 'Accumulated Waterfall Chart'
 			  },
 			  tooltip: {
 			    trigger: 'axis',
 			    axisPointer: {
 			      type: 'shadow'
 			    },
 			    formatter: function (params: any) {
 			      let tar;
 			      if (params[1] && params[1].value !== '-') {
 			        tar = params[1];
 			      } else {
 			        tar = params[2];
 			      }
 			      return tar && tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
 			    }
 			  },
 			  legend: {
 			    data: ['Expenses', 'Income']
 			  },
 			  grid: {
 			    left: '3%',
 			    right: '4%',
 			    bottom: '3%',
 			    containLabel: true
 			  },
 			  yAxis: {
 			    type: 'category',
 			    data: (function () {
 			      let list = [];
 			      for (let i = 1; i <= 11; i++) {
 			        list.push('Nov ' + i);
 			      }
 			      return list;
 			    })()
 			  },
 			  xAxis: {
 			    type: 'value'
 			  },
 			  series: [
 			    {
 			      name: 'Placeholder',
 			      type: 'bar',
 			      stack: 'Total',
 			      silent: true,
 			      itemStyle: {
 			        borderColor: 'transparent',
 			        color: 'transparent'
 			      },
 			      emphasis: {
 			        itemStyle: {
 			          borderColor: 'transparent',
 			          color: 'transparent'
 			        }
 			      },
 			      data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
 			    },
 			    {
 			      name: 'Income',
 			      type: 'bar',
 			      stack: 'Total',
 			      label: {
 			        show: true,
 			        position: 'top'
 			      },
 			      data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-']
 			    },
 			    {
 			      name: 'Expenses',
 			      type: 'bar',
 			      stack: 'Total',
 			      label: {
 			        show: true,
 			        position: 'bottom'
 			      },
 			      data: ['-', '-', '-', 109, 154, '-', '-', '-', 119, 361, 203]
 			    }
 			  ]
 		}
 		
 		const option1 = {
 			  title: {
 			    text: '人员利用',
 			    //subtext: 'Fake Data',
 			    left: 'center'
 			  },
 			  tooltip: {
 			    trigger: 'item'
 			  },
 			  series: [
 			    {
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
 			      data: [
 			        { value: 1048, name: 'Search Engine' },
 			        { value: 735, name: 'Direct' },
 			        { value: 580, name: 'Email' },
 			        { value: 484, name: 'Union Ads' },
 			        { value: 300, name: 'Video Ads' }
 			      ]
 			    }
 			  ]
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
 			  series: [
 			    {
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
 			      data: [
 			        { value: 1048, name: 'Search Engine' },
 			        { value: 735, name: 'Direct' }
 			      ]
 			    }
 			  ]
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
 			  series: [
 			    {
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
 			      data: [
 			        { value: 1048, name: 'Search Engine' },
 			        { value: 735, name: 'Direct' },
 			        { value: 580, name: 'Email' },
 			        { value: 484, name: 'Union Ads' },
 			        { value: 300, name: 'Video Ads' }
 			      ]
 			    }
 			  ]
 		}
 		
 		const option4 = {
 			toolbox: {
 				feature: {
 			            myTool: {
 			              show: true, //是否显示
 			              title: "关闭",  //鼠标悬空的提示文字
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
 			  series: [
 			    {
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
 			      data: [
 			        { value: 1048, name: 'Search Engine' },
 			        { value: 735, name: 'Direct' },
 			        { value: 580, name: 'Email' },
 			        { value: 484, name: 'Union Ads' },
 			        { value: 300, name: 'Video Ads' }
 			      ]
 			    }
 			  ]
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
 
 	interface TableItem {
 		BatchID: number;
 		ProductID: string;
 		//money: string;
 		state: string;
 		//date: string;
 		ArriveData: string;
 	}
 
 	const query = reactive({
 		ArriveData: '',
 		ProductID: '',
 		state: '',
 		pageIndex: 1,
 		pageSize: 10,
 		value: true
 	});
 
 	const tableData = ref < TableItem[] > ([]);
 	const pageTotal = ref(0);
 	// 获取表格数据
 	const getData = () => {
 		fetchData().then(res => {
 			tableData.value = res.data.list;
 			pageTotal.value = res.data.pageTotal || 50;
 		});
 	};
 	getData();
 
 	// 查询操作
 	const handleSearch = () => {
 		query.pageIndex = 1;
 		getData();
 	};
 	// 分页导航
 	const handlePageChange = (val: number) => {
 		query.pageIndex = val;
 		getData();
 	};
 
 	// 删除操作
 	const handleDelete = (index: number) => {
 		// 二次确认删除
 		ElMessageBox.confirm('确定要删除吗？', '提示', {
 				type: 'warning'
 			})
 			.then(() => {
 				ElMessage.success('删除成功');
 				tableData.value.splice(index, 1);
 			})
 			.catch(() => {});
 	};
 
 	// 表格编辑时弹窗和保存
 	const editVisible = ref(false);
 	let form = reactive({
 		select: '',
 		ProductID: '',
 		ArriveData: '',
 		state: '',
 		value: true
 
 	});
 	let idx: number = -1;
 	const handleEdit = (index: number, row: any) => {
 		idx = index;
 		form.ProductID = row.ProductID;
 		form.ArriveData = row.ArriveData;
 		form.select = row.state;
 		editVisible.value = true;
 	};
 	const saveEdit = () => {
 		editVisible.value = false;
 		ElMessage.success(`修改第 ${idx + 1} 行成功`);
 		tableData.value[idx].ProductID = form.ProductID;
 		tableData.value[idx].ArriveData = form.ArriveData;
 		tableData.value[idx].state = form.select;
 	};
 	// 点击运行显示甘特图
 	const runVisible = ref(false);
 	const fromVisible = ref(true);
	const fullscreenLoading = ref(false);
 	const runBtn = () => {
 		fromVisible.value = false;
		fullscreenLoading.value = true;
		runVisible.value = true;
		setTimeout(() => {
		    fullscreenLoading.value = false;
		}, 2000);
 	} 
 
 	  
 	
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
 
/* 	.table-td-thumb {
 		display: block;
 		margin: auto;
 		width: 40px;
 		height: 40px;
 	} */
 </style>
 