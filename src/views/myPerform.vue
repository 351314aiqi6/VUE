<template>
  <div class="container">
    <el-tabs v-model="message" @click="clickPane">
      <el-tab-pane :label="`我的直播(${myPerformList.length})`" name="first">
        <el-table :data="myPerformList" :show-header="false" style="width: 100%">
          <el-table-column>
            <template #default="scope">
              <span class="message-title">
                直播主题【{{ scope.row.performTitle }}】,直播开始时间【{{
                  scope.row.performStartDttm
                }}】,直播结束时间【{{ scope.row.performEndDttm }}】</span>
            </template>
          </el-table-column>
          <el-table-column width="280">
            <template #default="scope">
              <el-button type="primary" :icon="Remove" v-if="scope.row.performStatus=='00'" color="green"
                         @click="performCancel(scope.$index,scope.row)">取 消
                直 播
              </el-button>
              <el-button type="primary" :icon="VideoPlay" v-if="scope.row.performStatus=='00'" color="orange"
                         @click="performStart(scope.row)">
                开 始 直 播
              </el-button>
              <el-button type="primary" :icon="CircleCloseFilled" v-if="scope.row.performStatus=='01'" color="red"
                         @click="performEnd(scope.row)">
                直 播 结 束
              </el-button>
              <el-button type="primary" :icon="VideoCameraFilled" v-if="scope.row.performStatus=='01'" color="orange"
                         @click="showPerform = true">
                重 新 连 接
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="handle-row">
          <el-button type="primary" :icon="List" color="green" @click="performCancelAll()">一 键 取 消
          </el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="`已预约(${bookPerformList.length})`" name="second">
        <template v-if="message === 'second'">
          <el-table :data="bookPerformList" :show-header="false" style="width: 100%">
            <el-table-column>
              <template #default="scope">
                <span class="message-title">
                预约编号【{{ scope.row.book.applyId }}】,直播主题【{{
                    scope.row.perform.performTitle
                  }}】主播昵称【{{ scope.row.kolInfo.kolName }}】,直播开始时间【{{
                    scope.row.perform.performStartDttm
                  }}】,直播结束时间【{{ scope.row.perform.performEndDttm }}】</span>
              </template>
            </el-table-column>
            <el-table-column width="280">
              <template #default="scope">
                <el-button type="primary" :icon="Delete" color="Orange" @click="showPerform = true">观 看 直 播
                </el-button>
                <el-button type="primary" :icon="Delete" color="red"
                           @click="handleCancel(scope.row.book,scope.row.kolInfo)">取 消 预 约
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="handle-row">
            <el-button type="danger" :icon="DeleteFilled" color="red" @click="handleCancelAll">取 消 全 部</el-button>
          </div>
        </template>
      </el-tab-pane>

      <el-tab-pane :label="`回收站(${recoverList.length})`" name="third">
        <template v-if="message === 'third'">
          <el-table :data="recoverList" :show-header="false" style="width: 100%">
            <el-table-column>
              <template #default="scope">
                <span class="message-title">
                直播主题【{{ scope.row.performTitle }}】,直播开始时间【{{
                    scope.row.performStartDttm
                  }}】,直播结束时间【{{ scope.row.performEndDttm }}】</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" width="150"></el-table-column>
            <el-table-column width="120">
              <template #default="scope">
                <el-button type="danger" color="red" :icon="Delete" @click="handleDelete(scope.row)">清 理 直 播
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="handle-row">
            <el-button type="primary" color="red" :icon="DeleteFilled" @click="handleDeleteAll">清 空 回 收 站</el-button>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <!-- 观看弹出框 -->
    <el-dialog title="直播框" v-model="showPerform" width="70%" style="height: 50%">
      <div style="align-items: center; height: 50%">
        这是一个直播的视频
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="tabs">
import WangEditor from 'wangeditor';
import {ref, reactive, onMounted, onBeforeUnmount} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {
  Delete,
  Remove,
  CircleCloseFilled,
  VideoCameraFilled,
  VideoPlay,
  Promotion,
  DeleteFilled,
  List
} from '@element-plus/icons-vue';
import {fetchData} from '../api/index';
import request from "../request";
import type {FormInstance, FormRules} from 'element-plus';
import QS from "qs";

const viewVisible = ref(true);

// 用户信息
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
  performStartDttm: string;
  performEndDttm: string;
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

interface Book {
  id: string;
  applyId: string;
  performId: string;
  userId: string;
  applyStatus: string;
}

interface BookPerform {
  kolInfo: KOL;
  perform: Perform;
  book: Book;
}

const user: string | null = localStorage.getItem('userInfo');
const userInfo = <UserInfo>JSON.parse(user ? user : "");
const operateParam = reactive({
  id: "",
  userId: userInfo.id,
  messageTitle: ""
});
const showPerform = ref(false);
const message = ref('first');

const myPerformList = ref<Perform[]>([]);
const recoverList = ref<Perform[]>([]);
const bookPerformList = ref<BookPerform[]>([]);

const queryMyPerform = () => {
  request.post("/perform/queryByUserId", QS.stringify(operateParam)).then(function (response) {
    if (response.data.code == 0) {
      // 0代表交易成功
      myPerformList.value = response.data.result;
    } else {
      // 交易失败
      ElMessage.error('加载信息失败:' + response.data.message);
    }
  }).catch(function (error) {
    ElMessage.error('加载信息失败：' + error);
  })
}

const queryRecover = () => {
  request.post("/perform/queryRecover", QS.stringify(operateParam)).then(function (response) {
    if (response.data.code == 0) {
      // 0代表交易成功
      recoverList.value = response.data.result;
    } else {
      // 交易失败
      ElMessage.error('加载信息失败:' + response.data.message);
    }
  }).catch(function (error) {
    ElMessage.error('加载信息失败：' + error);
  })
}

const queryBook = () => {
  request.post("/perform/queryBook", QS.stringify(operateParam)).then(function (response) {
    if (response.data.code == 0) {
      // 0代表交易成功
      bookPerformList.value = response.data.result;
    } else {
      // 交易失败
      ElMessage.error('加载信息失败:' + response.data.message);
    }
  }).catch(function (error) {
    ElMessage.error('加载信息失败：' + error);
  })
}


const initData = () => {
  queryMyPerform();
  queryRecover();
  queryBook();
}
initData();

const performCancel = (index: number, row: Perform) => {
  request.post("/perform/cancel", QS.stringify(row)).then(function (response) {
    if (response.data.code == 0) {
      initData();
    } else {
      // 交易失败
      ElMessage.error('加载信息失败:' + response.data.message);
    }
  }).catch(function (error) {
    ElMessage.error('加载信息失败：' + error);
  })
}

const performCancelAll = () => {
  request.post("/perform/cancelAll", QS.stringify(operateParam)).then(function (response) {
    if (response.data.code == 0) {
      initData();
    } else {
      // 交易失败
      ElMessage.error('加载信息失败:' + response.data.message);
    }
  }).catch(function (error) {
    ElMessage.error('加载信息失败：' + error);
  })
}

const performStart = (row: Perform) => {
  request.post("/perform/start", QS.stringify(row)).then(function (response) {
    if (response.data.code == 0) {
      initData();
      showPerform.value = true;
    } else {
      // 交易失败
      ElMessage.error('加载信息失败:' + response.data.message);
    }
  }).catch(function (error) {
    ElMessage.error('加载信息失败：' + error);
  })
}

const handleDelete = (row: Perform) => {
  request.post("/perform/delete", QS.stringify(row)).then(function (response) {
    if (response.data.code == 0) {
      initData();
      ElMessage.success("直播信息已删除")
    } else {
      // 交易失败
      ElMessage.error('加载信息失败:' + response.data.message);
    }
  }).catch(function (error) {
    ElMessage.error('加载信息失败：' + error);
  })
}

const handleDeleteAll = () => {
  request.post("/perform/deleteAll", QS.stringify(operateParam)).then(function (response) {
    if (response.data.code == 0) {
      initData();
      ElMessage.success("直播信息已删除")
    } else {
      // 交易失败
      ElMessage.error('加载信息失败:' + response.data.message);
    }
  }).catch(function (error) {
    ElMessage.error('加载信息失败：' + error);
  })
}

const handleCancel = (book: Book, kolInfo: KOL) => {
  let param = new URLSearchParams();
  param.set("id", book.id);
  param.set("kolKey", kolInfo.id);
  param.set("performKey", book.performId);
  alert(QS.stringify(book.performId))
  request.post("/perform/bookCancel", param).then(function (response) {
    if (response.data.code == 0) {
      initData();
      ElMessage.success("直播预约已取消")
    } else {
      // 交易失败
      ElMessage.error('直播预约已取消:' + response.data.message);
    }
  }).catch(function (error) {
    ElMessage.error('直播预约已取消：' + error);
  })
}

const handleCancelAll = () => {
  request.post("/perform/bookCancelAll", QS.stringify(operateParam)).then(function (response) {
    if (response.data.code == 0) {
      initData();
      ElMessage.success("直播预约已取消")
    } else {
      // 交易失败
      ElMessage.error('直播预约已取消:' + response.data.message);
    }
  }).catch(function (error) {
    ElMessage.error('直播预约已取消：' + error);
  })
}

const performEnd = (row: Perform) => {
  request.post("/perform/end", QS.stringify(row)).then(function (response) {
    if (response.data.code == 0) {
      initData();
      ElMessage.success("直播已结束")
    } else {
      // 交易失败
      ElMessage.error('加载信息失败:' + response.data.message);
    }
  }).catch(function (error) {
    ElMessage.error('加载信息失败：' + error);
  })
}

</script>

<style>
.message-title {
  cursor: pointer;
}

.handle-row {
  margin-top: 30px;
}
</style>
