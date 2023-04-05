<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username">
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              placeholder="password"
              v-model="param.password"
              @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm(login)">登录</el-button>
        </div>
        <p class="login-tips">Tips : 用户名和密码随便填。</p>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue';
import {useTagsStore} from '../store/tags';
import {usePermissStore} from '../store/permiss';
import {useRouter} from 'vue-router';
import {ElMessage} from 'element-plus';
import type {FormInstance, FormRules} from 'element-plus';
import {Lock, User} from '@element-plus/icons-vue';
import axios from "axios";
import request from "../request";

interface LoginInfo {
  username: string;
  password: string;
}

const router = useRouter();
const param = reactive<LoginInfo>({
  username: '351314aiqi6',
  password: '351315'
});

const rules: FormRules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [{required: true, message: '请输入密码', trigger: 'blur'}]
};
const permiss = usePermissStore();
const login = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      const params = new URLSearchParams();
      params.append('userLoginName', param.username);
      params.append('userPassword', param.password);
      request.post("/user/login", params).then(function (response) {
        // 返回响应码
        const code = response.data.code;
        // 返回响应描述
        const message = response.data.message;
        // 返回数据
        const result = response.data.result;
        // 0代表交易成功
        if (code == 0) {
          ElMessage.success('登录成功');
          // 用户名
          localStorage.setItem('ms_username', param.username);
          // 用户商户数
          localStorage.setItem('merchantNum', result.merchantNum);
          // 用户商品数
          localStorage.setItem('goodsNum', result.goodsNum);
          // 用户渠道数
          localStorage.setItem('chnlNum', result.chnlNum);
          // 用户待接收信息数
          localStorage.setItem('messageNum', result.messageNum);
          // 用户总登录次数
          localStorage.setItem('loginNum', result.loginNum);
          if(result.lastLoginInfo!=null){
            // 用户总登录次数
            localStorage.setItem('lastLoginInfo', JSON.stringify(result.lastLoginInfo));
          }
          // 用户信息
          localStorage.setItem('userInfo', JSON.stringify(result.userInfo));
          if(result.messageList!=null){
            // 用户信息列表
            localStorage.setItem('messageList', JSON.stringify(result.messageList));
          }
          const keys = permiss.defaultList[param.username == 'admin' ? 'admin' : 'user'];
          permiss.handleSet(keys);
          localStorage.setItem('ms_keys', JSON.stringify(keys));
          router.push('/');
        } else {
          // 交易失败
          ElMessage.error('登录失败:' + message);
        }
      }).catch(function (error) {
        ElMessage.error('登录失败：系统内部错误！');
      })
    } else {
      ElMessage.error('登录成功');
      return false;
    }
  });
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.ms-content {
  padding: 30px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
