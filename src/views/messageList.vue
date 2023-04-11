<template>
  <div class="container">
    <el-tabs v-model="message" @click="clickPane">
      <el-tab-pane :label="`未读信件(${noReadList.length})`" name="first">
        <el-table :data="noReadList" :show-header="false" style="width: 100%">
          <el-table-column>
            <template #default="scope">
              <span class="message-title">
                信件标题【{{ scope.row.messageTitle }}】,信件编号【{{ scope.row.messageId }}】,发送人【{{
                  scope.row.sendUserId
                }}】,发送时间【{{ scope.row.createTime }}】</span>
            </template>
          </el-table-column>
          <el-table-column width="120">
            <template #default="scope">
              <el-button type="primary" :icon="Search" color="green" @click="handle(scope.$index,scope.row)">读取信件
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="handle-row">
          <el-button type="primary" :icon="List" color="green" @click="handleReadAll()">一键处理
          </el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="`已读信件(${readedList.length})`" name="second">
        <template v-if="message === 'second'">
          <el-table :data="readedList" :show-header="false" style="width: 100%">
            <el-table-column>
              <template #default="scope">
                <span class="message-title">
                信件标题【{{ scope.row.messageTitle }}】,信件编号【{{ scope.row.messageId }}】,发送人【{{
                    scope.row.sendUserId
                  }}】,发送时间【{{ scope.row.createTime }}】</span>
              </template>
            </el-table-column>
            <el-table-column width="100">
              <template #default="scope">
                <el-button type="primary" :icon="Delete" color="Orange" @click="handleDelete(scope.row)">删除信件</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="handle-row">
            <el-button type="danger" :icon="Delete" color="Orange" @click="handleDeleteAll">删除全部</el-button>
          </div>
        </template>
      </el-tab-pane>

      <el-tab-pane :label="`回收站(${retrieveList.length})`" name="third">
        <template v-if="message === 'third'">
          <el-table :data="retrieveList" :show-header="false" style="width: 100%">
            <el-table-column>
              <template #default="scope">
                <span class="message-title">
                信件标题【{{ scope.row.messageTitle }}】,信件编号【{{ scope.row.messageId }}】,发送人【{{
                    scope.row.sendUserId
                  }}】,发送时间【{{ scope.row.createTime }}】</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" width="150"></el-table-column>
            <el-table-column width="120">
              <template #default="scope">
                <el-button type="danger" color="red" :icon="DeleteFilled" @click="handleRetrieve(scope.row)">清理信件</el-button>
              </template>
            </el-table-column>
          </el-table>
                    <div class="handle-row">
                      <el-button type="primary" color="red" :icon="DeleteFilled" @click="handleRetrieveAll">清空回收站</el-button>
                    </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <div id="readFrame" style="display: none">
      <div class="container">
        <div>
          <el-button type="primary" :icon="Promotion" color="red"
                     style="margin-bottom: 15px;margin-left: 91.7%;background-color: #ff5900"
                     @click="handleRead">确认已读
          </el-button>
        </div>

        <div class="plugins-tips" style="font-weight: bold">
          信件标题：{{ operateParam.messageTitle }}
        </div>
        <div class="mgb20" ref="editor" disabled=""></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="tabs">
import WangEditor from 'wangeditor';
import {ref, reactive, onMounted, onBeforeUnmount} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Delete, Edit, Search, Plus, Promotion,DeleteFilled,List} from '@element-plus/icons-vue';
import {fetchData} from '../api/index';
import request from "../request";
import type {FormInstance, FormRules} from 'element-plus';
import QS from "qs";

const viewVisible = ref(true);

// 申购单信息
interface Message {
  id: string;
  messageId: string;
  messageTitle: string;
  sendUserId: string
  recvUserId: string;
  createTime: string;
  updateTime: string;
}

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

const user: string | null = localStorage.getItem('userInfo');
const userInfo = <UserInfo>JSON.parse(user ? user : "");
const operateParam = reactive({
  id: "",
  userId: userInfo.id,
  messageTitle: ""
});

// 未读信息列表
const noReadList = ref<Message[]>([]);
// 已读信息列表
const readedList = ref<Message[]>([]);
// 回收站信息列表
const retrieveList = ref<Message[]>([]);
const initData = () => {
  request.post("/message/queryReceive", QS.stringify(operateParam)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code == 0) {
      let result = response.data.result;
      noReadList.value = result.noReadList;
      readedList.value = result.readedList;
      retrieveList.value = result.retrieveList;
      ElMessage.success('信息列表读取成功' + message);
    } else {
      // 交易失败
      ElMessage.error('信息列表读取失败' + message);
    }
  }).catch(function (error) {
    ElMessage.error('信息列表读取失败：系统内部错误！');
  })
}
initData();


const editor = ref(null);
const content = reactive({
  html: '',
  text: ''
});
let instance: any;
onMounted(() => {
  instance = new WangEditor(editor.value);
  instance.config.zIndex = 1;
  instance.create();
});
onBeforeUnmount(() => {
  instance.destroy();
  instance = null;
});


const handle = (index: number, row: Message) => {
  request.post("/message/queryContent", QS.stringify(row)).then(function (response) {
    let elementById = document.getElementById("readFrame");
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code == 0) {
      operateParam.messageTitle = response.data.result.messageTitle;
      instance.txt.html(response.data.result.messageContent);
      operateParam.id = response.data.result.id;
      elementById.setAttribute("style", "display: run-in")
    } else {
      // 交易失败
      ElMessage.error('信件读取失败' + message);
    }
  }).catch(function (error) {
    ElMessage.error('信件读取失败：系统内部错误！');
  })
};
const closeFrame = () => {
  let elementById = document.getElementById("readFrame");
  elementById.setAttribute("style", "display: none")
}

const message = ref('first');

const handleRead = () => {
  request.post("/message/read", QS.stringify(operateParam)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code == 0) {
      operateParam.id = "";
      operateParam.messageTitle = "";
      closeFrame()
      initData();
    } else {
      // 交易失败
      ElMessage.error('信件读取失败' + message);
    }
  }).catch(function (error) {
    ElMessage.error('信件读取失败：系统内部错误！');
  })
}

const handleReadAll = () => {
  request.post("/message/readAll", QS.stringify(operateParam)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code == 0) {
      operateParam.id = "";
      operateParam.messageTitle = "";
      closeFrame()
      initData();
      // 交易失败
      ElMessage.success('完成[' + response.data.result+"]封信件的读取");
    } else {
      // 交易失败
      ElMessage.error('信件读取失败' + message);
    }
  }).catch(function (error) {
    ElMessage.error('信件读取失败：系统内部错误！');
  })
}

const handleDeleteAll = () => {
  request.post("/message/deleteAll", QS.stringify(operateParam)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code == 0) {
      operateParam.id = "";
      operateParam.messageTitle = "";
      closeFrame()
      initData();
      // 交易失败
      ElMessage.success('完成[' + response.data.result+"]封信件的删除");
    } else {
      // 交易失败
      ElMessage.error('信件一键删除失败' + message);
    }
  }).catch(function (error) {
    ElMessage.error('信件一键删除失败：系统内部错误！');
  })
}

const handleRetrieveAll = () => {
  request.post("/message/retrieveAll", QS.stringify(operateParam)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code == 0) {
      operateParam.id = "";
      operateParam.messageTitle = "";
      closeFrame()
      initData();
      // 交易失败
      ElMessage.success('完成[' + response.data.result+"]封信件清理");
    } else {
      // 交易失败
      ElMessage.error('清空回收站失败' + message);
    }
  }).catch(function (error) {
    ElMessage.error('清空回收站失败：系统内部错误！');
  })
}


const handleDelete = (row: Message) => {
  operateParam.id = row.id;
  request.post("/message/delete", QS.stringify(operateParam)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code == 0) {
      operateParam.id = "";
      operateParam.messageTitle = "";
      closeFrame()
      initData();
    } else {
      // 交易失败
      ElMessage.error('信件删除失败' + message);
    }
  }).catch(function (error) {
    ElMessage.error('信件删除失败：系统内部错误！');
  })
}

const handleRetrieve = (row: Message) => {
  operateParam.id = row.id;
  request.post("/message/retrieve", QS.stringify(operateParam)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code == 0) {
      operateParam.id = "";
      operateParam.messageTitle = "";
      closeFrame()
      initData();
    } else {
      // 交易失败
      ElMessage.error('信件清理失败' + message);
    }
  }).catch(function (error) {
    ElMessage.error('信件清理失败：系统内部错误！');
  })
}


const clickPane = () => {
  closeFrame();
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
