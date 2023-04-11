<template>
  <div class="container">
    <el-form ref="formRef" :rules="sendRule" :model="form" label-width="120px">
      <div class="plugins-tips">
        <!--			wangEditor：轻量级 web 富文本编辑器，配置方便，使用简单。 访问地址：-->
        <!--			<a href="https://www.wangeditor.com/doc/" target="_blank">wangEditor</a>-->
        <el-form-item label="检索方式" >
          <el-radio-group v-model="form.resourceType" @change="changeType">
            <el-radio label="01">列表搜索</el-radio>
            <el-radio label="02">用户ID搜索</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户选择" prop="options" v-model="selectFrameVisible" v-if="selectFrameVisible==true">
          <el-select v-model="form.recvUserId" placeholder="请选择用户" class="handle-select mr10" prop="recvUserId">
            <el-option v-for="item in userInfoList" :label="item.userRealName" :value="item.id"
                       :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-model="inputUserIdVisible" v-if="inputUserIdVisible==true" label="用户编号" prop="recvUserId">
          <el-input v-model="form.recvUserId" placeholder="请输入用户ID" @change="queryUser"
                    style="width: 215px"></el-input>
        </el-form-item>
        <el-form-item v-model="inputUserIdVisible1" v-if="inputUserIdVisible1==true" label="用户姓名" >
          {{ form.userRealName }}
        </el-form-item>
        <el-form-item  label="信件标题" prop="messageTitle">
          <el-input v-model="form.messageTitle" placeholder="请输入标题"
                    style="width: 215px"></el-input>
        </el-form-item>
      </div>
      <div class="mgb20" ref="editor"></div>
      <el-button type="primary" @click="syncHTML(formRef)">提交</el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="editor">
import WangEditor from 'wangeditor';
import {ref, reactive, onMounted, onBeforeUnmount} from 'vue';
import {ElMessage} from 'element-plus';
import type {FormInstance, FormRules} from 'element-plus';
import request from "../request";
import {tryCall} from "element-plus/es/components/table-v2/src/utils";
import QS from "qs";


const clean = (obj: any) => {
  for (const objKey in obj) {
    delete obj[objKey]
  }
}


interface UserInfo {
  id: string
  userEmail: string;
  userRealName: string;
}

// 用户信息
interface SendUserInfo {
  id: string
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

const sendRule: FormRules = {
  messageTitle: [
    {required: true, message: '请输入信件标题', trigger: 'blur'}
  ],
  recvUserId: [
    {required: true, message: '请选择收件人', trigger: 'blur'}
  ],
  messageContent: [
    {required: true, message: '信件内容不能为空', trigger: 'blur'},
  ]
};
// 表单对象
const formRef = ref<FormInstance>();
const user: string | null = localStorage.getItem('userInfo');
const sendUserInfo = <SendUserInfo>JSON.parse(user ? user : "");


const form = reactive({
  resourceType: '01',
  messageTitle: '',
  recvUserId: '',
  sendUserId: sendUserInfo.id,
  userRealName: '',
  messageContent: '',
});
// 收件人
const receiveUserInfo = ref<UserInfo>()
// 用户列表
const userInfoList = ref<UserInfo[]>()
// 下拉框显示标识
const selectFrameVisible = ref(true);
const inputUserIdVisible = ref(false);
const inputUserIdVisible1 = ref(false);
const changeType = () => {
  if (form.resourceType == "01") {
    selectFrameVisible.value = true;
    inputUserIdVisible1.value = false;
    inputUserIdVisible.value = false;
  } else {
    selectFrameVisible.value = false;
    inputUserIdVisible.value = true;
  }
}

// 初始化用户信息
const initUser = () => {
  request.post("/user/query").then(
      function (response) {
        let code = response.data.code;
        let message = response.data.message;
        if (code == 0) {
          userInfoList.value = response.data.result;
          ElMessage.success("加载用户列表成功")
        } else {
          ElMessage.error("加载用户：" + message)
        }
      }
  ).catch(function (error) {
    ElMessage.error("加载用户失败：" + error);
  })
}
initUser();

// 初始化用户信息
const queryUser = () => {
  request.post("/user/queryOne", QS.stringify(form)).then(
      function (response) {
        let code = response.data.code;
        let message = response.data.message;
        if (code == 0) {
          inputUserIdVisible1.value = true;
          form.userRealName = response.data.result.userRealName;
          ElMessage.success("加载用户成功")
        } else {
          ElMessage.error("加载用户失败：" + message)
        }
      }
  ).catch(function (error) {
    ElMessage.error("加载用户失败：" + error);
  })
}

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
const syncHTML = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  form.messageContent = instance.txt.html();
  formEl.validate((valid: boolean) => {
    if(valid){
      form.sendUserId = sendUserInfo.id;
      request.post("/message/send", QS.stringify(form)).then(
          function (response) {
            let code = response.data.code;
            let message = response.data.message;
            if (code == 0) {
              alert("信件发送成功！")
              instance.txt.clear();
              clean(form)
              form.resourceType="01";
              ElMessage.success("发送信息成功")
            } else {
              ElMessage.error("发送信息失败：" + message)
            }
          }
      ).catch(function (error) {
        ElMessage.error("发送信息失败：" + error);
      })
    }
  })
};
</script>

<style></style>
