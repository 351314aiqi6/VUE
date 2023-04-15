<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>基础信息</span>
            </div>
          </template>
          <div class="info">
            <div class="info-image" @click="showDialog">
              <el-avatar :size="100" :src="avatarImg"/>
              <span class="info-edit">
								<i class="el-icon-lx-camerafill"></i>
							</span>
            </div>
            <div class="info-name">用户名：{{ param.userLoginName }}</div>
            <div>用户证件：{{ param.userIdNo }}</div>
            <div>真实姓名：{{ param.userRealName }}</div>
            <div>用户邮箱：{{ param.userEmail }}</div>
            <div>用户地址：{{ param.userAddress }}</div>
            <div class="info-name">个人简介：{{ param.userAdditional }}</div>
            <div class="info-name">用户创建时间：{{
                formatDate({'date': param.createTime, "formatStr": "yyyy年MM月dd日 HH时mm分ss秒"})
              }}
            </div>
            <div class="info-name">用户最近修改时间：{{
                formatDate({'date': param.updateTime, "formatStr": "yyyy年MM月dd日 HH时mm分ss秒"})
              }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>账户编辑</span>
            </div>
          </template>
          <el-form :model="param" label-width="90px">
            <el-form-item label="用户名："> {{ param.userLoginName }}</el-form-item>
            <el-form-item label="用户证件：">{{ param.userIdNo }}</el-form-item>
            <el-form-item label="真实姓名：">{{ param.userRealName }}</el-form-item>
            <el-form-item label="用户手机：">
              <el-input v-model="param.userMobilePhone"></el-input>
            </el-form-item>
            <el-form-item label="用户邮箱：" prop="userEmail">
              <el-input v-model="param.userEmail">
              </el-input>
            </el-form-item>
            <el-form-item label="用户住址：">
              <el-input v-model="param.userAddress">
              </el-input>
            </el-form-item>
            <el-form-item label="当前密码：">
              <el-input type="password" v-model="param.userPassword" placeholder="请输入当前密码"></el-input>
            </el-form-item>
            <el-form-item label="更新密码：">
              <el-input type="password" v-model="param.userNewPassword" placeholder="请输入更新后的密码"></el-input>
            </el-form-item>
            <el-form-item label="个人简介：">
              <el-input v-model="param.userAdditional"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">提交</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="裁剪图片" v-model="dialogVisible" width="600px">
      <vue-cropper
          ref="cropper"
          :src="imgSrc"
          :ready="cropImage"
          :zoom="cropImage"
          :cropmove="cropImage"
          style="width: 100%; height: 400px"
      ></vue-cropper>

      <template #footer>
				<span class="dialog-footer">
					<el-button class="crop-demo-btn" type="primary"
          >选择图片
						<input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
					</el-button>
					<el-button type="primary" @click="saveAvatar">上传并保存</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="user">
import {reactive, ref} from 'vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import avatar from '../assets/img/img.jpg';
import request from "../request";
import {formatDate} from '../date.js'
import {ElMessage} from "element-plus";
import {User} from '@element-plus/icons-vue';
import QS from "qs";

interface UserInfo {
  id: string
  userId: string;
  userLoginName: string;
  userEmail: string;
  userAvatar: string;
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

const param = reactive<UserInfo>({
  userAvatar: "",
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
// 头像图片
const avatarImg = ref(avatar);
const dbUser = <UserInfo>JSON.parse(localStorage.getItem('userInfo'));
// 解析用户信息
param.id = dbUser.id;
param.userId = dbUser.id;
param.userAvatar = dbUser.userAvatar;
param.userLoginName = dbUser.userLoginName;
param.userAdditional = dbUser.userAdditional;
param.userAddress = dbUser.userAddress;
param.userIdNo = dbUser.userIdNo;
param.userRole = dbUser.userRole;
param.userRealName = dbUser.userRealName;
param.userEmail = dbUser.userEmail;
param.userMobilePhone = dbUser.userMobilePhone;
param.createTime = dbUser.createTime;
param.updateTime = dbUser.updateTime;
if (dbUser.userAvatar != null) {
  avatarImg.value = dbUser.userAvatar;
}
// 获取用户名
const name = localStorage.getItem('ms_username');

// const getUserAvatar = () => {
//   request.post("/user/getUserAvatar", new URLSearchParams(param)).then(function (response) {
//     // 返回响应码
//     const code = response.data.code;
//     // 返回响应描述
//     const message = response.data.message;
//     // 返回数据
//     const result = response.data.result;
//     // 0代表交易成功
//     if (code == 0) {
//       ElMessage.success('加载个人信息成功');
//       avatarImg.value = result;
//     } else {
//       // 交易失败
//       ElMessage.error('加载个人信息失败:' + message);
//     }
//   }).catch(function (error) {
//     ElMessage.error('加载个人信息失败：系统内部错误！');
//   })
// }
//
// getUserAvatar();

const onSubmit = () => {
  request.post("/user/update", new URLSearchParams(param)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 返回数据
    const result = response.data.result;
    // 0代表交易成功
    if (code == 0) {
      ElMessage.success('修改成功');
      // 用户信息
      localStorage.setItem('userInfo', JSON.stringify(result));
    } else {
      // 交易失败
      ElMessage.error('修改失败:' + message);
    }
  }).catch(function (error) {
    ElMessage.error('修改失败：系统内部错误！');
  })
};

// 图像来源
const imgSrc = ref('');
const cropImg = ref('');
const dialogVisible = ref(false);
const cropper: any = ref();

const showDialog = () => {
  dialogVisible.value = true;
  imgSrc.value = avatarImg.value;
};

const setImage = (e: any) => {
  const file = e.target.files[0];
  if (!file.type.includes('image/')) {
    return;
  }
  const reader = new FileReader();
  reader.onload = (event: any) => {
    dialogVisible.value = true;
    imgSrc.value = event.target.result;
    cropper.value && cropper.value.replace(event.target.result);

  };
  reader.readAsDataURL(file);
};

const cropImage = () => {
  cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
};

const saveAvatar = () => {
  param.userAvatar = cropImg.value;
  request.post("/user/replaceUserAvatar", new URLSearchParams(param)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 返回数据
    const result = response.data.result;
    // 0代表交易成功
    if (code == 0) {
      ElMessage.success('修改成功');
      avatarImg.value = cropImg.value;
      dbUser.userAvatar = cropImg.value;
      dialogVisible.value = false;
      // 用户信息
      localStorage.setItem('userInfo', JSON.stringify(dbUser));
    } else {
      // 交易失败
      ElMessage.error('修改失败:' + message);
    }
  }).catch(function (error) {
    ElMessage.error('修改失败:' + JSON.stringify(error));
  })

};
</script>

<style scoped>
.info {
  text-align: center;
  padding: 35px 0;
}

.info-image {
  position: relative;
  margin: auto;
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 50px;
  overflow: hidden;
}

.info-edit {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.info-edit i {
  color: #eee;
  font-size: 25px;
}

.info-image:hover .info-edit {
  opacity: 1;
}

.info-name {
  margin: 15px 0 10px;
  font-size: 24px;
  font-weight: 500;
  color: #262626;
}

.crop-demo-btn {
  position: relative;
}

.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
