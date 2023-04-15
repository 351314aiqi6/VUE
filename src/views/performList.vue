<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="query.performPlatform" placeholder="直播平台" class="handle-select mr10">
          <el-option key="1" label="抖音" value="抖音"></el-option>
          <el-option key="2" label="快手" value="快手"></el-option>
          <el-option key="3" label="斗鱼" value="斗鱼"></el-option>
        </el-select>
        <el-select v-model="query.kolKey" placeholder="主播选择" class="handle-select mr10">
          <el-option v-for="item in kolList" :label="item.kolName" :value="item.id"
                     :key="item.id"></el-option>
        </el-select>
        <el-input v-model="query.performId" placeholder="直播编号" class="handle-input-180 mr10 wd80"
                  width="100"></el-input>
        <el-input v-model="query.kolKey" placeholder="主播编号" class="handle-input-180 mr10 wd80"
                  width="100"></el-input>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="performList" border class="table" header-cell-class-name="table-header">
        <el-table-column prop="id" width="60" label="序号" align="center"></el-table-column>
        <el-table-column prop="perforId" width="130" label="直播编号" align="center"></el-table-column>
        <el-table-column prop="performPlatform" width="100" label="直播平台" align="center"></el-table-column>
        <el-table-column prop="performTitle" style="width: 12%" label="直播标题" align="center"></el-table-column>
        <el-table-column prop="kolId" width="90" label="主播编号" align="center"></el-table-column>
        <el-table-column prop="performUrl" style="width: 12%" label="直播链接" align="center"></el-table-column>
        <el-table-column prop="applyNumber" width="90" label="预约人数" align="center"></el-table-column>
        <el-table-column prop="applyMaxNumber" width="90" label="最大预约数" align="center"></el-table-column>
        <el-table-column label="添加时间" width="240px">
          <template #default="scope">{{
              formatDate({'date': scope.row.createTime, "formatStr": "yyyy年MM月dd日 HH时mm分ss秒"})
            }}</template>
        </el-table-column>
        <el-table-column  label="最近修改时间" width="240px">
          <template #default="scope">{{
              formatDate({'date': scope.row.updateTime, "formatStr": "yyyy年MM月dd日 HH时mm分ss秒"})
            }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button text :icon="Timer" v-if="scope.row.performStatus=='00' && !(scope.row.applyNumber >= scope.row.applyMaxNumber)" style="color: #ff5900;font-weight: bold"
                       @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
              直播预约
            </el-button>
            <el-button type="primary" :icon="VideoCamera" v-if="scope.row.applyNumber >= scope.row.applyMaxNumber" color="grey" disabled @click="performBook">预
              约 人 数 已 满
            </el-button>
            <el-button text :icon="VideoPlay" v-if="scope.row.performStatus=='01'"
                       style="color: green;font-weight: bold" @click="performShow(scope.$index, scope.row)"
                       v-permiss="15">
              观看直播
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.pageIndex"
            :page-size="query.pageSize"
            :total="query.totalSize"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 详情弹出框 -->
    <el-dialog title="直播详情" v-model="editVisible" width="40%">
      <el-form label-width="250px">
        <el-form-item class="info-name" label="直播ID:">
          {{ bookFormParam.id }}
        </el-form-item>
        <el-form-item class="info-name" label="直播房号:">
          {{ bookFormParam.perforId }}
        </el-form-item>
        <el-form-item class="info-name" label="直播标题:">
          {{ bookFormParam.performTitle }}
        </el-form-item>
        <el-form-item class="info-name" label="主播昵称:">
          {{ bookKol.kolName }}
        </el-form-item>
        <el-form-item class="info-name" label="主播人气:">
          {{ bookKol.kolFollowers }}
        </el-form-item>
        <el-form-item class="info-name" label="主播简介:">
          {{ bookKol.kolIntroduce }}
        </el-form-item>
        <el-form-item class="info-name" label="直播描述:">
          {{ bookFormParam.performGoodsIntroduce }}
        </el-form-item>
        <el-form-item class="info-name" label="直播链接:">
          {{ bookFormParam.performUrl }}
        </el-form-item>
        <el-form-item class="info-name" label="直播预约数:">
          {{ bookFormParam.applyNumber }}
        </el-form-item>
        <el-form-item class="info-name" label="直播开始时间:">
          {{ bookFormParam.performStartDttm }}
        </el-form-item>
        <el-form-item class="info-name" label="直播结束时间:">
          {{ bookFormParam.performEndDttm }}
        </el-form-item>
      </el-form>
      <div style="align-items: center;margin-left: 35%">
        <el-button type="primary" :icon="VideoCamera" v-if="bookFlag!=true" color="orange" @click="performBook">直 播 预
          约
        </el-button>
        <el-button type="primary" :icon="VideoCamera" v-if="bookFlag==true" color="green" @click="editVisible = false">您
          已 预 约 该
          直 播
        </el-button>
      </div>
    </el-dialog>

    <!-- 观看弹出框 -->
    <el-dialog title="直播框" v-model="performVisible" width="60%">
      <div style="align-items: center;">
        直播内容
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="goods">
import {ref, reactive} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Timer, VideoPlay, Search, CloseBold, VideoCamera} from '@element-plus/icons-vue';
import {fetchData} from '../api/index';
import request from "../request";
import type {FormInstance, FormRules} from 'element-plus';
import QS from "qs";
import {formatDate} from '../date.js'

const clean = (obj: any) => {
  for (const objKey in obj) {
    delete obj[objKey]
  }
}

interface Perform {
  id: string;
  perforId: string;
  performTitle: string;
  performPlatform: string;
  performStatus: string;
  kolId: string;
  performGoodsIntroduce: string;
  performUrl: string;
  applyNumber: string;
  applyMaxNumber: string;
  performStartDttm: string;
  performEndDttm: string;
}

interface UserInfo {
  id: string
  userId: string;
  userLoginName: string;
  userEmail: string;
  userMobilePhone: string;
  userRole: string;
  userPassword: string;
  userNewPassword: string;
  userIdNo: string;
  userRealName: string;
  userAddress: string;
  userAdditional: string;
  createTime: string;
  updateTime: string;
}

interface KOL {
  id: string;
  kolId: string;
  userId: string;
  kolName: string;
  performPlatform: string;
  performNumber: string;
  prePerformNumber: string;
  performViewerNumber: string;
  kolAvatar: string;
  kolFollowers: string;
  kolIntroduce: string;
  createTime: string;
  updateTime: string;
}

const userInfo = ref<UserInfo>({
  id: "",
  userId: "",
  userLoginName: "",
  userAdditional: "",
  userAddress: "",
  userIdNo: "",
  userPassword: "",
  userRealName: "",
  userRole: "",
  userEmail: "",
  userMobilePhone: "",
  userNewPassword: "",
  createTime: "",
  updateTime: ""
});

// 商户列表
const kolList = ref<KOL[]>([]);
const performList = ref<Perform[]>();

const initData = () => {
  // 解析用户信息
  const user: string | null = localStorage.getItem('userInfo');
  userInfo.value = <UserInfo>JSON.parse(user ? user : "");
  loadKol()
  loadPerform()
}

// 查询参数
const query = reactive({
  // 用户ID
  kolKey: "",
  // 直播平台
  performPlatform: "",
  // 直播ID
  performId: "",
  // 起始页
  pageIndex: 1,
  // 页面大小
  pageSize: 5,
  // 总条数
  totalSize: 20
});

const loadKol = () => {
  request.post("/kol/queryAll").then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code != 0) {
      // 交易失败
      ElMessage.error('加载主播信息失败' + message);
    } else {
      // 渠道数据初始化
      kolList.value = response.data.result;
    }
  }).catch(function (error) {
    ElMessage.error('加载直播信息失败：系统内部错误！');
  })
}

const loadPerform = () => {
  request.post("/perform/query", QS.stringify(query)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code != 0) {
      // 交易失败
      ElMessage.error('加载数据成功' + message);
    } else {
      // 渠道数据初始化
      performList.value = response.data.result.performList;
      query.totalSize = response.data.result.totalSize;
    }
  }).catch(function (error) {
    ElMessage.error('加载数据失败：系统内部错误！');
  })
}

// 初始化数据
initData()

// 查询操作
const handleSearch = () => {
  query.pageIndex = 1;
  loadPerform();
};

// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val;
  loadPerform();
};

// 预约信息
const bookFormParam = ref<Perform>({
  applyNumber: "",
  id: "",
  kolId: "",
  perforId: "",
  performEndDttm: "",
  performGoodsIntroduce: "",
  performPlatform: "",
  performStartDttm: "",
  performStatus: "",
  applyMaxNumber:"",
  performTitle: "",
  performUrl: ""
});
// 预约的主播信息
let bookKol = ref<KOL>({
  createTime: "",
  id: "",
  kolAvatar: "",
  kolFollowers: "",
  kolId: "",
  kolIntroduce: "",
  kolName: "",
  performNumber: "",
  performPlatform: "",
  performViewerNumber: "",
  prePerformNumber: "",
  updateTime: "",
  userId: ""
});
// 预约标识
const bookFlag = ref(false);
// 预约显示标识
const editVisible = ref(false);
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
  idx = index;
  editVisible.value = true;
  bookFormParam.value = row;
  preBook();
};
const preBook = () => {
  let params = new URLSearchParams();
  params.set("performKey", bookFormParam.value?.id);
  params.set("userId", userInfo.value.id);
  params.set("kolKey", bookFormParam.value.kolId);
  request.post("/perform/preBook", params).then(function (response) {
    // 0代表交易成功
    if (response.data.code == 0) {
      let result = response.data.result;
      // 预约标识
      bookFlag.value = result.bookFlag;
      // 渠道数据初始化
      bookKol.value = result.bookKol;
      editVisible.value = true;
    } else {
      // 交易失败
      ElMessage.error('加载数据成功' + response.data.message);
    }
  }).catch(function (error) {
    ElMessage.error('加载数据失败：系统内部错误！');
  })
}

const performBook = () => {
  let params = new URLSearchParams();
  params.set("performKey", bookFormParam.value?.id);
  params.set("userId", userInfo.value.id);
  params.set("kolKey", bookFormParam.value.kolId);
  request.post("/perform/performBook", params).then(function (response) {
    // 0代表交易成功
    if (response.data.code == 0) {
      alert("已成功预约直播")
      editVisible.value = false;
      initData();
      ElMessage.success("直播预约成功")
    } else {
      // 交易失败
      ElMessage.error('直播预约失败' + response.data.message);
    }
  }).catch(function (error) {
    ElMessage.error('直播预约失败：' + error);
  })
}

// 新增DIV显示标识
const performVisible = ref(false);
const performShow = (index: number, row: any) => {
  idx = index;
  performVisible.value = true;
};
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

.handle-input-180 {
  width: 180px;
}

.handle-input-130 {
  width: 130px;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #F56C6C;
}

.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
