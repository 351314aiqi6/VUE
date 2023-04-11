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
          <el-button type="primary" :icon="Pointer" @click="submitForm(login)">用 户 登 录</el-button>
        </div>

        <div class="login-btn">
          <el-button type="primary" :icon="Avatar" @click="isshow">用 户 注 册</el-button>
        </div>
      </el-form>
    </div>

    <!--注册-->
    <!-- 编辑弹出框 -->
    <el-dialog title="用户注册页" v-model="show.isShow" width="40%">
      <el-form ref="register" :model="registerParam" :rules="registerRule" label-width="100px" class="rs-content">
        <el-form-item label="用户名：" prop="userLoginName">
          <el-input v-model="registerParam.userLoginName" placeholder="用户名">
          </el-input>
        </el-form-item>

        <el-form-item label="用户密码：" prop="userPassword">
          <el-input v-model="registerParam.userPassword" placeholder="用户密码" type="password">
          </el-input>
        </el-form-item>

        <el-form-item label="用户角色" prop="userRole">
          <el-select v-model="registerParam.userRole" placeholder="用户角色">
            <el-option label="普通用户" value="02"></el-option>
            <el-option label="超级管理员" value="01"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="证件类型" prop="userIdType">
          <el-select v-model="registerParam.userIdType" placeholder="证件类型">
            <el-option label="居民身份证" value="00"></el-option>
            <el-option label="其他证件" value="99"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="证件号码" prop="userIdNo">
          <el-input v-model="registerParam.userIdNo" placeholder="证件号码">
          </el-input>
        </el-form-item>

        <el-form-item label="真实姓名" prop="userRealName">
          <el-input v-model="registerParam.userRealName" placeholder="真实姓名">
          </el-input>
        </el-form-item>

        <el-form-item label="邮箱地址" prop="userEmail">
          <el-input v-model="registerParam.userEmail" placeholder="邮箱地址">
          </el-input>
        </el-form-item>

        <el-form-item label="电话号码" prop="userMobilePhone">
          <el-input v-model="registerParam.userMobilePhone" placeholder="电话号码">
          </el-input>
        </el-form-item>

        <el-form-item label="居住地址" prop="userAddress">
          <el-input v-model="registerParam.userAddress" placeholder="居住地址">
          </el-input>
        </el-form-item>

        <el-form-item label="个人简介" prop="desc">
          <el-input type="textarea" rows="3" v-model="registerParam.userAdditional"></el-input>
        </el-form-item>
        <el-form-item prop="desc">
          <span class="dialog-footer">
					<el-button type="primary" :icon="CloseBold" color="red" @click="show.isShow = false">取 消 注 册</el-button>
					<el-button type="primary" :icon="Select" color="green" @click="registerSubmit(register)">注 册 申 请</el-button>
				</span>
        </el-form-item>
      </el-form>
      <!--      <template #footer>-->

      <!--      </template>-->
    </el-dialog>
  </div>


</template>

<script setup lang="ts">
import {ref, reactive} from 'vue';
import {useTagsStore} from '../store/tags';
import {usePermissStore} from '../store/permiss';
import {useRouter} from 'vue-router';
import {ElMessage} from 'element-plus';
import type {FormInstance, FormRules} from 'element-plus';
import {Lock, User, Avatar, Pointer, Select, CloseBold} from '@element-plus/icons-vue';
import axios from "axios";
import request from "../request";
import QS from "qs";

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
  isShow: false
});
const isshow = (rsshow: boolean) => {
//要取到show的值取反
  show.isShow = true;
};
const registerSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      request.post("/user/register", QS.stringify(registerParam)).then(function (response) {
        if (response.data.code == 0) {
          alert("恭喜您，注册成功！")
          // 关闭注册按钮
          show.isShow = false;
          ElMessage.success("恭喜您，注册成功！")
        } else {
          ElMessage.success("注册失败，" + QS.stringify(response.data.message))
        }
      }).catch(function (error) {
        ElMessage.error('注册失败，' + error);
      })
    } else {
      ElMessage.error('注册失败，注册参数不合法!');
      return false;
    }
  });
}
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
          if (result.lastLoginInfo != null) {
            // 用户总登录次数
            localStorage.setItem('lastLoginInfo', JSON.stringify(result.lastLoginInfo));
          }
          // 用户信息
          localStorage.setItem('userId', result.userInfo.id);
          // 用户信息
          localStorage.setItem('userInfo', JSON.stringify(result.userInfo));
          if (result.messageList != null) {
            // 用户信息列表
            localStorage.setItem('messageList', JSON.stringify(result.messageList));
          }
          // 默认全是管理权限
          const keys = permiss.defaultList[result.userInfo.userRole == '01' ? 'admin' : 'user'];
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


// 用户信息
interface UserInfo {
  id: string
  userId: string;
  userLoginName: string;
  userEmail: string;
  userMobilePhone: string;
  userRole: string;
  userPassword: string;
  userIdNo: string;
  userIdType: string;
  userRealName: string;
  userAddress: string;
  userAdditional: string;
}

const registerParam = reactive<UserInfo>({
  id: '',
  userId: '',
  userLoginName: '',
  userEmail: '',
  userMobilePhone: '',
  userRole: '',
  userIdType: '',
  userPassword: '',
  userIdNo: '',
  userRealName: '',
  userAddress: '',
  userAdditional: ''
})


const registerRule: FormRules = {
  userLoginName: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 5, max: 16, message: '用户名长度为5-15位之间', trigger: 'blur'},
  ],
  userPassword: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 5, max: 15, message: '密码长度为5-15为之间', trigger: 'blur'},
  ],
  userRole: [
    {required: true, message: '请选择注册角色', trigger: 'blur'},
  ],
  userIdNo: [
    {required: true, message: '请输入证件号码', trigger: 'blur'},
    {min: 15, max: 18, message: '身份证号码长度为18位', trigger: 'blur'},
  ],
  userIdType: [
    {required: true, message: '请选择证件类型', trigger: 'blur'},
    // {min: 2, max: 2, message: '证件类型为00', trigger: 'blur'},
  ],
  userRealName: [
    {required: true, message: '请输入真实姓名', trigger: 'blur'},
    {min: 2, max: 10, message: '真实姓名的长度为2-10之间', trigger: 'blur'},
  ],
  userEmail: [
    {required: true, message: '请输入邮箱地址', trigger: 'blur'},
  ],
  userMobilePhone: [
    {required: true, message: '请输入电话号码', trigger: 'blur'},
  ],
  userAddress: [
    {required: true, message: '请输入居住地址', trigger: 'blur'},
    {min: 2, max: 50, message: '居住地址长度为2-50位之间', trigger: 'blur'},
  ]
};
const register = ref<FormInstance>()

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
  rename: '',
  repassword: '',
  userrole: '',
  idno: '',
  idtype: '',
  realname: '',
  email: '',
  phone: '',
  address: ''
});


const ruless: FormRules = {
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
      register.append("userLoginName", paramm.rename);
      register.append("userPassword", paramm.repassword);
      register.append("userRole", paramm.userrole);
      register.append("userIdNo", paramm.idno);
      register.append("userIdType", paramm.idtype);
      register.append("userRealName", paramm.realname);
      register.append("userEmail", paramm.email);
      register.append("userMobilePhone", paramm.phone);
      register.append("userAddress", paramm.address);
      request.post("/user/register", register).then(function (response) {
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

.rs-title {
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

.rs-login {
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

.rs-content {
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

.register-btn {
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
