<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height: 272px">
          <div class="user-info">
            <el-avatar :size="120" :src="imgurl"/>
            <div class="user-info-cont">
              <div class="user-info-name">{{ name }}</div>
              <div>{{ role }}</div>
            </div>
          </div>
          <div class="user-info-list">
            总计登录次数：
            <span>{{ loginNum }}</span>
          </div>
          <div class="user-info-list">
            上次登录地点：
            <span>{{ lastLoginInfo.loginAddressDesc }}</span>
          </div>
          <div class="user-info-list">
            上次登录ip地：
            <span>{{ lastLoginInfo.loginIpAddress }}</span>
          </div>
        </el-card>
        <el-card shadow="hover" style="height: 232px">
          <template #header>
            <div class="clearfix">
              <span>商品类别</span>
            </div>
          </template>
          食品
          <el-progress :percentage="35.6" color="#FF0000"></el-progress>
          百货
          <el-progress :percentage="24" color="#f1e05a"></el-progress>
          家电
          <el-progress :percentage="41.4"></el-progress>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <el-icon class="grid-con-icon">
                  <User/>
                </el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ chnlNum }}</div>
                  <div>渠道商数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <el-icon class="grid-con-icon">
                  <User/>
                </el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ merchantNum }}</div>
                  <div>商户数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <el-icon class="grid-con-icon">
                  <Goods/>
                </el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">{{ goodsNum }}</div>
                  <div>商品数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card shadow="hover" style="height: 403px">
          <template #header>
            <div class="clearfix">
              <span>待处理信件 [{{ messageNum }}] 封</span>
            </div>
          </template>

          <el-table :show-header="false" :data="messageList" style="width: 100%">
            <el-table-column width="40">
              <template #default="scope">
                <el-checkbox v-model="scope.row.status"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column style="width: 50%">
              <template #default="scope">
                <div
                    class="todo-item"
                    :class="{
										'todo-item-del': scope.row.status
									}"
                >
                  信件标题【{{ scope.row.messageTitle }}】,发送时间【{{ scope.row.createTime }}】
                </div>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template #default="scope">
                <div
                    class="todo-item"
                    :class="{
										'todo-item-del': scope.row.status
									}"
                >
                  发送人ID:{{ scope.row.sendUserId }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="dashboard">
import Schart from 'vue-schart';
import {reactive} from 'vue';
import imgurl from '../assets/img/img.jpg';

const name = localStorage.getItem('ms_username');
const loginNum = localStorage.getItem('loginNum');
const merchantNum = localStorage.getItem('merchantNum');
const goodsNum = localStorage.getItem('goodsNum');
const chnlNum = localStorage.getItem('chnlNum');
const messageNum = localStorage.getItem('messageNum');
let lastLoginInfo = {};
const tmpInfo: string | null = localStorage.getItem('lastLoginInfo');
if (tmpInfo != null) {
  lastLoginInfo = JSON.parse(tmpInfo)
}
let messageList = [];
const message: string | null = localStorage.getItem('messageList');
if (message != null) {
  messageList = JSON.parse(message);
}

const options = {
  type: 'bar',
  title: {
    text: '最近一周各品类销售图'
  },
  xRorate: 25,
  labels: ['周一', '周二', '周三', '周四', '周五'],
  datasets: [
    {
      label: '家电',
      data: [234, 278, 270, 190, 230]
    },
    {
      label: '百货',
      data: [164, 178, 190, 135, 160]
    },
    {
      label: '食品',
      data: [144, 198, 150, 235, 120]
    }
  ]
};
const options2 = {
  type: 'line',
  title: {
    text: '最近几个月各品类销售趋势图'
  },
  labels: ['6月', '7月', '8月', '9月', '10月'],
  datasets: [
    {
      label: '家电',
      data: [234, 278, 270, 190, 230]
    },
    {
      label: '百货',
      data: [164, 178, 150, 135, 160]
    },
    {
      label: '食品',
      data: [74, 118, 200, 235, 90]
    }
  ]
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 15px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
