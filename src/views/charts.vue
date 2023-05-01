<template>
	<div class="container">
    <div class="plugins-tips">
      <div>
        产品名称<el-input class="quoinfo" v-model="query.goodsName"></el-input>
        <el-button icon="Search" @click="quosearch">搜索</el-button>
      </div>
    </div>
    <div id="chart" style="width:800px;height:400px;">

    </div>
	</div>
</template>

<script setup lang="ts" name="basecharts">
import * as echarts from 'echarts';
import $ from 'jQuery';
import request from "../request";
import QS from "qs";
import {ElMessage} from "element-plus";
import {reactive, ref} from 'vue';
import {data} from "jquery";

const query = reactive({
  goodsName:"",
  quotationValue:""
});

interface goodsInfo{
  goodsName:string;
  quotationValue:string
}


const goodsselect = ref<goodsInfo[]>([]);
const quotation = () => {
  request.get(`/quotation/selquoList?${QS.stringify(query)}`).then(function (response){

  const code = response.data.code;
  const message = response.data.message;
    if (code != 0) {
      ElMessage.error('请求错误' + message);
    }else{
      let result = response.data.result;
      console.log("result",result);
      goodsselect.value = response.data.result;
      console.log(response.data.result);
      if (query.goodsName == result.goodsName){
        query.quotationValue = result.quotationValue;
        ElMessage.success('搜索行情成功');
      }
      if(result[0]?.quotationValue){
        let arr =  result[0].quotationValue.split(/[,，]/g)
        updateChartData(arr)
      }

      // console.log(result.goodsName);
    }
  }).catch(function (error) {
    console.log(error);
    ElMessage.error('行情请求失败：系统内部错误！');
  });
}

const quosearch = () =>{
  const data = quotation();

}

const updateChartData = (data:number[]= Array.from({length:7},()=>0))=>{
    const option = {
      title: {
        text: '周期行情图'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          },
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '价格波动',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: data
        },
      ],
    };
    let chart = echarts.getInstanceByDom(document.getElementById("chart") as HTMLEmbedElement)
    if (chart == null){
      chart = echarts.init(document.getElementById('chart') as HTMLDivElement);
    }
    chart.setOption(option);
}

// 初始化
// updateChartData()

</script>
<style scoped>
.quoinfo{
  width: 20%;
}
</style>
