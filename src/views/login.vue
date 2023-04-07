<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">农产品多渠道销售服务管理平台</div>
<!--      登录-->
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="用户名">
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              placeholder="密码"
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

        <div class="login-btn">
          <el-button type="primary" @click="isshow">注册</el-button>
        </div>
      </el-form>
    </div>

<!--注册-->

    <div class="rs-login" v-show="show.isShow" id="vshow">
      <div class="rs-title">用户注册</div>
      <el-form ref="relogin" :model="paramm" :rules="ruless" label-width="80px" class="rs-content">
        <el-form-item label="用户名" prop="rename">
          <el-input v-model="paramm.rename" placeholder="用户名">
          </el-input>
        </el-form-item>

        <el-form-item label="密码" prop="repassword">
          <el-input v-model="paramm.repassword" placeholder="密码" type="password" @keyup.enter="submitForm(relogin)">
          </el-input>
        </el-form-item>

        <el-form-item label="用户角色" prop="userrole">
          <el-select v-model="paramm.userrole" placeholder="用户角色">
            <el-option label="用户" value="01"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="证件类型" prop="idtype">
          <el-select v-model="paramm.idtype" placeholder="证件类型">
            <el-option label="居民身份证" value="00"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="证件号码" prop="idno">
          <el-input v-model="paramm.idno" placeholder="证件号码">
          </el-input>
        </el-form-item>

        <el-form-item label="真实姓名" prop="realname">
          <el-input v-model="paramm.realname" placeholder="真实姓名">
          </el-input>
        </el-form-item>

        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="paramm.email" placeholder="邮箱地址">
          </el-input>
        </el-form-item>

        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="paramm.phone" placeholder="电话号码">
          </el-input>
        </el-form-item>

        <el-form-item label="居住地址" prop="address">
          <el-input v-model="paramm.address" placeholder="居住地址">
          </el-input>
        </el-form-item>

        <el-form-item>
          <div class="register-btn">
            <el-button type="primary" @click="submitFormm(relogin)">注册</el-button>
          </div>
        </el-form-item>

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
  username: '',
  password: ''
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

//通过点击事件控制注册页面的显示与隐藏
interface ShowMode {
  isShow: boolean
}
const show = reactive<ShowMode>({
  isShow:false
});
const isshow = (rsshow : boolean) =>{
//要取到show的值取反
  show.isShow=true;
};

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
      ElMessage.error('登录失败');
      return false;
    }
  });
};


//注册
interface ReLoginInfo {
  rename: string;
  repassword: string;
  userrole: string;
  idno: string;
  idtype: string;
  realname: string;
  email: string;
  phone: string;
  address: string;
}

const relogin = ref<FormInstance>()
const paramm = reactive<ReLoginInfo>({
  rename:'',
  repassword:'',
  userrole:'',
  idno:'',
  idtype:'',
  realname:'',
  email:'',
  phone:'',
  address:''
});

const ruless : FormRules ={
  rename: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 5, max: 16, message: '用户名长度为5-15位之间', trigger: 'blur'},
  ],
  repassword: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 5, max: 15, message: '密码长度为5-15为之间', trigger: 'blur'},
  ],
  userrole: [
    {required: true, message: '请选择注册角色', trigger: 'blur'},
    // {min: 2, max: 2, message: '用户角色默认为01', trigger: 'blur'},
  ],
  idno: [
    {required: true, message: '请输入证件号码', trigger: 'blur'},
    {min: 18, max: 18, message: '身份证号码长度为18位', trigger: 'blur'},
  ],
  idtype: [
    {required: true, message: '请选择证件类型', trigger: 'blur'},
    // {min: 2, max: 2, message: '证件类型为00', trigger: 'blur'},
  ],
  realname: [
    {required: true, message: '请输入真实姓名', trigger: 'blur'},
    {min: 2, max: 10, message: '真实姓名的长度为2-10之间', trigger: 'blur'},
  ],
  email: [
    {required: true, message: '请输入邮箱地址', trigger: 'blur'},
    {min: 17, max: 17, message: '邮箱地址长度为17位', trigger: 'blur'},
  ],
  phone: [
    {required: true, message: '请输入电话号码', trigger: 'blur'},
    {min: 11, max: 11, message: '电话号码长度为11位', trigger: 'blur'},
  ],
  address: [
    {required: true, message: '请输入居住地址', trigger: 'blur'},
    {min: 2, max: 20, message: '居住地址长度为2-20位之间', trigger: 'blur'},
  ]
};

const submitFormm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const register = new URLSearchParams();
      register.append("userLoginName",paramm.rename);
      register.append("userPassword",paramm.repassword);
      register.append("userRole",paramm.userrole);
      register.append("userIdNo",paramm.idno);
      register.append("userIdType",paramm.idtype);
      register.append("userRealName",paramm.realname);
      register.append("userEmail",paramm.email);
      register.append("userMobilePhone",paramm.phone);
      register.append("userAddress",paramm.address);
      request.post("/user/register",register).then(function (response){
        // 返回响应码
        const code = response.data.code;
        // 返回响应描述
        const message = response.data.message;
        // 返回数据
        const result = response.data.result;
        // 0代表交易成功
        if (code == 0) {
          ElMessage.success('注册成功');

          const keys = permiss.defaultList[param.username == 'admin' ? 'admin' : 'user'];
          permiss.handleSet(keys);
          localStorage.setItem('ms_keys', JSON.stringify(keys));
          location.reload();
        } else {
          // 交易失败
          ElMessage.error('注册失败:' + message);
        }
      }).catch(function (error) {
        ElMessage.error('登录失败：系统内部错误！');
      });
    } else {
      console.log('注册失败!', fields)
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
  background-image: url(../assets/img/780.jpg);
  background-size: 100%;
}


.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #000000;
  border-bottom: 1px solid #ddd;
}

.rs-title{
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #000000;
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
  /*z-index: 2;*/
}

.rs-login{
  position: absolute;
  left: 50%;
  top: 35%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 1);
  overflow: hidden;
  /*z-index: 1;*/
  /*opacity: 0;*/
}

.ms-content {
  padding: 30px 30px;
}

.rs-content{
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

.register-btn{
  text-align: center;
}

.register-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.register-login {
  font-size: 12px;
  line-height: 30px;
  color: #000000;
  /*border: none;*/
  background: rgba(255, 255, 255, 0);
}
</style>
