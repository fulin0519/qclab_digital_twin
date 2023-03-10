<template>
	<div>
		<el-container id="myChart1" style="width: 300px; height: 100px;"></el-container>
		<el-container id="myChartgantt" style="width: 1200px; height: 400px;"></el-container>
	</div>
</template>


<script setup lang="ts" name="test">
	import {
		onMounted,
		getCurrentInstance
	} from 'vue';
	import axios from 'axios';
	import {
		number
	} from 'echarts';

	// 配置建议写在 onMount 的外面
	const {
		proxy
	} = getCurrentInstance() as any

	//将时间戳转换成年月日
	const formatDate = (datetime: any, type: number) => {
		var date = new Date(datetime); //这句就需要添加在这里面

		var year = date.getFullYear(); //年
		var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1; //月
		var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(); //日
		var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); //时
		var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(); //分
		var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); //秒
		var milliseconds = date.getMilliseconds() < 10 ? "0" + date.getMilliseconds() : date.getMilliseconds() //毫秒
		if (type == 1) {
			return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds + "." + milliseconds;
		} else if (type == 2) {
			return year + "" + month + "" + day + "" + hour + "" + minutes + "" + seconds;
		} else if (type == 3) {
			return year + "-" + month + "-" + day;
		} else {
			return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
		}
	}

	onMounted(() => {
		// 获取挂载的组件实例
		const echarts = proxy.$ECharts

		let data = [{
			'value': number,
			'name': String
		}];

		//初始化挂载
		axios.get("http://10.204.16.53:8020/QCLab/simio/arrival_table/300").then(item => {
			data[0].value = item.data.id;
			data[0].name = item.data.productname;
			//console.log(data)
			//添加配置
			echartsmain.setOption({
				title: {
					text: '人员利用率',
					//subtext: 'Fake Data',
					left: 'center'
				},
				tooltip: {
					trigger: 'item'
				},
				series: {
					name: 'Access From',
					type: 'pie',
					radius: '50%',
					data: data
				},
				label: {
					show: false,
					position: 'center'
				},
				labelLine: {
					show: false
				},
			});
		})

		const echartsmain = echarts.init(document.getElementById('myChart1'));
		// 自适应
		window.onresize = function() {
			echartsmain.resize()
		}


		// let startValue = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
		// let endValue = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');

		//let time = new Date(newValue).getTime()



		//下面是甘特图的数据
		const echartsgantt = echarts.init(document.getElementById('myChartgantt'))


		const gettabledata = async () => {
			//worker
			let workResult = await axios.get(
				"http://opcitsapw005l:8020/QCLab/simio/gantt/analyst/TestEntity1.1421/95")
			let ganttWorkData = []; //该test为TestEntity1.1913
			ganttWorkData.push(0);
			ganttWorkData.push(formatDate(workResult.data[0].timeseized, 4));
			ganttWorkData.push(formatDate(workResult.data[0].timereleased, 4));

			//resource
			// let testResult = await axios.get("http://opcitsapw005l:8020/QCLab/simio/gantt/test/221234739/95")
			// let ganttTestData = [];
			// ganttTestData.push(0);
			// ganttTestData.push(formatDate(testResult.data[3].timearrival, 4));
			// ganttTestData.push(formatDate(testResult.data[3].timereleased, 4));

			//equipment
			let equipmentResult = await axios.get(
				"http://opcitsapw005l:8020/QCLab/simio/gantt/equipment/TestEntity1.1421/95")
			let ganttEquipmentData = [];
			ganttEquipmentData.push(1);
			ganttEquipmentData.push(formatDate(equipmentResult.data[0].timeseized, 4));
			ganttEquipmentData.push(formatDate(equipmentResult.data[0].timereleased, 4));

			// //test   sampleid: "221266529"     sampletype: "Raw Material"        testentity: "TestEntity1.1913"
			// let testResult = await axios.get("http://opcitsapw005l:8020/QCLab/simio/gantt/test/221234739/95")
			// let ganttTestData = [];
			// ganttTestData.push(2);
			// ganttTestData.push(formatDate(testResult.data[0].timearrival, 4));
			// ganttTestData.push(formatDate(testResult.data[0].timereleased, 4));

			// //sample  sampleentity: "Raw Material.1912"   sampleid: "221266529"    sampletype: "Raw Material"
			// let sampleResult = await axios.get("http://opcitsapw005l:8020/QCLab/simio/gantt/sample/221234739/95")
			// let ganttsampleData = [];
			// ganttsampleData.push(3);
			// ganttsampleData.push(formatDate(sampleResult.data[0].timearrival, 4));
			// ganttsampleData.push(formatDate(sampleResult.data[0].timereleased, 4));

			//batch  batchentity: "Products.1911"  batchid: "2200099133"
			let batchResult = await axios.get("http://opcitsapw005l:8020/QCLab/simio/gantt/batch/95")
			let BatchStartData = [];
			let BatchEndData = [];
			let BatchId = [];
			for(let i = 0; i < batchResult.data.length; i++){
				BatchStartData.push(formatDate(batchResult.data[i].timearrival,4))
			}
			for(let i = 0; i < batchResult.data.length; i++){
				BatchEndData.push(formatDate(batchResult.data[i].timereleased,4))
			}
			for(let i = 0; i < batchResult.data.length; i++){
				BatchId.push(batchResult.data[i].batchid)
			}
			console.log("BatchStartData")
			console.log(BatchStartData)
			console.log("---------------------------------------------")
			
			// BatchStartData.push(4);
			// BatchStartData.push(formatDate(batchResult.data[0].timearrival, 4));
			// BatchStartData.push(formatDate(batchResult.data[0].timereleased, 4));

			// console.log(ganttBatchData)

			let projectItem = BatchId,
				projectItemStart = BatchStartData,
				projectItemEnd = BatchEndData;
			let projectItemStartValue = projectItemStart.map((item) => {
				return new Date(item).valueOf() // 在这把日期转换成数字
			})
			let projectItemDuringValue = projectItemEnd.map((item, i) => {
				return new Date(item).valueOf() - projectItemStartValue[i]
			})

			let dateMin = projectItemStartValue[0];
			echartsgantt.setOption({
				title: {
					subtext: '任务日期'
				},
				tooltip: {
					trigger: 'axis',
					formatter: function(params: any) {
						const tar = params[1];
						let start;
						let enDate;
						for (let i = 0; i < projectItem.length; i++) {
							if (tar.axisValue === projectItem[i]) {
								start = projectItemStart[i];
								enDate = projectItemEnd[i];
							}
						}
						return tar.name + '<br/>' 
						+ tar.seriesName + ' : ' + Math.round(tar.value / (1000 * 60 * 60 * 24)) + '天' 
						+ '<br/>' +'开始：' + start 
						+ '<br/>' +	'结束：' + enDate;
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '15%',
					containLabel: true
				},
				yAxis: {
					type: 'category',
					splitLine: {
						show: false
					},
					data: projectItem
				},
				xAxis: {
					type: 'value',
					min: dateMin,
					axisLabel: {
						color: '#333', // 坐标轴文字颜色
						formatter: function(param: any) {
							let date = new Date(param);
							let dateLabel = date.getFullYear() + '-' + (date.getMonth() + 1) +
								'-' + date.getDate(); //x轴显示的日期格式
							return dateLabel;
						}
					}
				},
				series: [{
						name: 'Placeholder',
						type: 'bar',
						stack: 'Total',
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
						data: projectItemStartValue
					},
					{
						name: '周期',
						type: 'bar',
						stack: 'Total',
						barWidth: '30%',
						itemStyle: {
							normal: {
								color: function(params:any) {
									var dater = params.data / (1000 * 60 * 60 * 24)
									//自定义颜色
									let number;
									if (dater < 3) {
										number = 0
									} else if (dater < 5) {
										number = 1
									} else {
										number = 2
									}
									const colorList = [
										'#f6071c', '#faa019', '#0aeabc'
									];
									return colorList[number]
								}
							}
						},
						data: projectItemDuringValue
					}
				]

			});
		}
		gettabledata()


		//const { data:res }= await axios.get("http://10.204.16.53:8020/QCLab/simio/arrival_table/341")
		// let result = await axios.get("http://10.204.16.53:8020/QCLab/simio/arrival_table/300")
		// console.log(result.data)


		/* 	//循环取值
			let arr = []
			for(let i = 0; i < result.data.length; i++){
				arr.push({
					value: result.data[i].id,
					name: result.data[i].productname
				})
			}
			console.log(arr) */

		//不循环取值
		// opt.series.data.push({'value': result.data.id,'name': result.data.productname,})

		//console.log(arr[0])

		//return arr[0]
		/* 		axios.get("http://opcitsapw005l:8020/QCLab/simio/gantt/equipment/24").then(item => {
					//这样子可以拿到想要的值
					console.log(item.data[0].timereleased)
					//把拿到的值push到刚新建的数组中
					ganttData.push(item.data[0].timereleased)
					//console.log(ganttData[])
				}) */
		// 自适应
		window.onresize = function() {
			echartsgantt.resize()
		}

		return {}

	});

	const equipmentRunTest = () => {
		axios.get("http://opcitsapw005l:8020/QCLab/simio/gantt/equipment/TestEntity1.1421/95", ).then(response => {
			console.log("equipment")
			console.log(response)
			console.log("------------------")
		})

	}
	equipmentRunTest()


	const reviewerRunTest = () => {
		axios.get("http://opcitsapw005l:8020/QCLab/simio/gantt/reviewer/TestEntity1.1421/95", ).then(response => {
			console.log("reviewer")
			console.log(response)
			console.log("------------------")
		})
	}
	reviewerRunTest()


	const sampleRunTest = () => {
		axios.get("http://opcitsapw005l:8020/QCLab/simio/gantt/sample/221234739/95", ).then(response => {
			console.log("sample")
			console.log(response)
			console.log("------------------")
		})
	}
	sampleRunTest()


	const batchRunTest = () => {
		axios.get("http://opcitsapw005l:8020/QCLab/simio/gantt/batch/95", ).then(response => {
			console.log("batch")
			console.log(response)
			console.log("------------------")
		})
	}
	batchRunTest()

	const testRunTest = () => {
		axios.get("http://opcitsapw005l:8020/QCLab/simio/gantt/test/221234739/95", ).then(response => {
			console.log("test")
			console.log(response) //值为空
			console.log("------------------")
		})
	}
	testRunTest()

	const analystRunTest = () => {
		axios.get("http://opcitsapw005l:8020/QCLab/simio/gantt/analyst/TestEntity1.1421/95", ).then(response => {
			console.log("analyst")
			console.log(response)
			console.log("------------------")
		})
	}
	analystRunTest()


	const resourceRunTest = () => {
		axios.get("http://opcitsapw005l:8020/QCLab/simio/gantt/equipment/TestEntity1.1421/95", ).then(response => {
			console.log("resource")
			console.log(response)
			console.log("------------------")
		})
	}
	resourceRunTest()



	// const gettabledata = async() => {

	//const { data:res }= await axios.get("http://10.204.16.53:8020/QCLab/simio/arrival_table/341")
	// let result = await axios.get("http://10.204.16.53:8020/QCLab/simio/arrival_table/300")
	// console.log(result.data)


	/* 	//循环取值
		let arr = []
		for(let i = 0; i < result.data.length; i++){
			arr.push({
				value: result.data[i].id,
				name: result.data[i].productname
			})
		}
		console.log(arr) */

	//不循环取值
	// opt.series.data.push({'value': result.data.id,'name': result.data.productname,})

	//console.log(arr[0])

	//return arr[0]
	// }
	// gettabledata()

	//var getdata = []; //先定义一个空数组，然后把从后台获取到的data转换成value:...;name:....形式，在存到空数组中

	/* 	var getdata = [];
		var getLegend = [];
		
		var obj = new Object();
		var arr = new Array();
		
		obj.name = restult.data.option1.data.name */



	/* 	for(let i=0; i<restult.data.length; i++){
			var obj = new Object();
			var arr = new Array();
			
		} */
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
