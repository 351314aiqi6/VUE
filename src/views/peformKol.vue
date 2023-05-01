<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>主播信息</span>
            </div>
          </template>
          <div class="info">
            <div class="info-image" @click="showDialog">
              <el-avatar :size="100" :src="avatarImg"/>
              <span class="info-edit">
								<i class="el-icon-lx-camerafill"></i>
							</span>
            </div>
            <div v-if="showRegisterStartCard==true">
              <div style="margin: 15px 0 10px;font-size: 20px;font-weight: 500;color: #ff5900;">您还不是主播
              </div>
              <div class="info-name" color="red">
                <el-button type="primary" :icon="VideoCameraFilled" color="Orange" @click="showRegisterCard">点击成为主播
                </el-button>
              </div>
            </div>

            <div v-if="showKolInfo==true">
              <el-form :model="kolParam" :rules="registerRule" class="info-name" ref="registerForm" label-width="49%">
                <el-form-item class="info-name" label="用户名：" style="height: 15px"> {{
                    userInfo.userLoginName
                  }}
                </el-form-item>
                <el-form-item label="真实姓名：" style="height: 10px">{{ userInfo.userRealName }}</el-form-item>
                <el-form-item label="主播昵称：" style="height: 10px">{{ kolInfo.kolName }}</el-form-item>
                <el-form-item label="直播平台：" style="height: 10px">{{ kolInfo.performPlatform }}</el-form-item>
                <el-form-item label="入驻时间：" style="height: 10px">{{
                    formatDate({'date': kolInfo.createTime, "formatStr": "yyyy年MM月dd日 HH时mm分ss秒"})
                  }}</el-form-item>
                <el-form-item label="个人简介：" style="height: 25px">{{ kolInfo.kolIntroduce }}</el-form-item>
              </el-form>
              <div style="margin: 15px 0 10px;font-size: 18px;font-weight: 500; color: #262626;">您已经完成了 <span
                  style="color: red;font-size: 26px">{{ kolInfo.performNumber }}</span> 场直播，共有
                <span style="color: red;font-size: 26px">{{ kolInfo.performViewerNumber }}</span> 人观看了您的直播，您还有 <span
                    style="color: red;font-size: 26px">{{ kolInfo.prePerformNumber }}</span> 场待直播，期待您的表现!
              </div>
<!--              <div class="info-name" color="red">-->
<!--                <el-button type="primary" :icon="VideoCameraFilled" color="green" @click="showRegisterCard">点击修改信息-->
<!--                </el-button>-->
<!--              </div>-->
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" v-model="showRegister" v-if="showRegister==true">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>主播入驻</span>
            </div>
          </template>
          <el-form :model="kolParam" :rules="registerRule" ref="registerForm" label-width="110px">
            <el-form-item label="用户名："> {{ userInfo.userLoginName }}</el-form-item>
            <el-form-item label="用户证件：">{{ userInfo.userIdNo }}</el-form-item>
            <el-form-item label="真实姓名：">{{ userInfo.userRealName }}</el-form-item>
            <el-form-item label="主播昵称：" prop="kolName">
              <el-input v-model="kolParam.kolName"></el-input>
            </el-form-item>
            <el-form-item label="粉丝数量：" prop="kolFollowers">
              <el-input v-model="kolParam.kolFollowers">
              </el-input>
            </el-form-item>
            <el-form-item label="直播平台：" prop="performPlatform">
              <el-radio-group v-model="kolParam.performPlatform">
                <el-radio label="斗鱼"></el-radio>
                <el-radio label="抖音"></el-radio>
                <el-radio label="快手"></el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="个人简介" prop="desc">
              <el-input type="textarea" rows="3" style="width: 100%" v-model="kolParam.kolIntroduce"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :icon="CircleCheckFilled" @click="register(registerForm)">主 播 入 驻</el-button>
              <el-button type="primary" color="red" :icon="CircleCloseFilled" @click="closeRegisterCard">取 消 入 驻
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="12" v-model="showKolInfo" v-if="showKolInfo==true">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>直播申请</span>
            </div>
          </template>
          <el-form :model="performParam" :rules="performRule" ref="performForm" label-width="110px">
            <el-form-item label="真实姓名："><span style="margin-left: 10px">{{ userInfo.userRealName }}</span></el-form-item>
            <el-form-item label="主播昵称："><span style="margin-left: 10px">{{ kolInfo.kolName }}</span></el-form-item>
            <el-form-item label="直播平台："><span style="margin-left: 10px">{{ kolInfo.performPlatform }}</span>
            </el-form-item>
            <el-form-item label="直播标题：" prop="performTitle">
              <el-input v-model="performParam.performTitle" style="margin-left: 10px" placeholder="请输入直播标题"></el-input>
            </el-form-item>
            <el-form-item label="最大预约人数：" >
              <el-input v-model="performParam.applyMaxNumber" style="margin-left: 10px" placeholder="100"></el-input>
            </el-form-item>
            <el-form-item label="直播链接：" prop="performUrl">
              <el-input v-model="performParam.performUrl" style="margin-left: 10px" placeholder="请输入直播链接"></el-input>
            </el-form-item>
            <el-form-item label="开始时间：" prop="startDate">
              <el-col :span="11">
                <el-form-item prop="startDate">
                  <el-date-picker
                      type="date"
                      placeholder="选择开始日期"
                      value-format="YYYY-MM-DDTHH:mm:ss.000Z"
                      v-model="performParam.startDate"
                      style="width: 100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="startTime">
                  <el-time-picker value-format="YYYY-MM-DDTHH:mm:ss.000Z" placeholder="选择开始时间"
                                  v-model="performParam.startTime" style="width: 100%">
                  </el-time-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="结束时间：" prop="startDate">
              <el-col :span="11">
                <el-form-item prop="endDate">
                  <el-date-picker
                      type="date"
                      placeholder="选择结束日期"
                      value-format="YYYY-MM-DDTHH:mm:ss.000Z"
                      v-model="performParam.endDate"
                      style="width: 100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="endTime">
                  <el-time-picker value-format="YYYY-MM-DDTHH:mm:ss.000Z" placeholder="选择结束时间"
                                  v-model="performParam.endTime" style="width: 100%">
                  </el-time-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="直播简介：" prop="performGoodsIntroduce">
              <el-input type="textarea" rows="3" style="width: 100%;margin-left: 10px"
                        v-model="performParam.performGoodsIntroduce"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :icon="CircleCheckFilled" @click="perform(performForm)">直 播 申 请</el-button>
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
import {ElMessage, extractDateFormat} from "element-plus";
import {
  Delete,
  Edit,
  Search,
  Plus,
  Promotion,
  User,
  CircleCloseFilled,
  CircleCheckFilled,
  VideoCameraFilled
} from '@element-plus/icons-vue';
import QS from 'qs';
import type {FormInstance, FormRules} from 'element-plus';
import {formatDate} from '../date.js'

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

// 主播信息注册参数
const kolParam = reactive({
  id: '',
  kolId: '',
  userId: userInfo.value.id,
  kolName: '',
  performPlatform: '斗鱼',
  kolAvatar: '',
  kolFollowers: '',
  kolIntroduce: '',
  startDate: ''
});

// 直播申请参数
const performParam = reactive({
  id: '',
  kolKey: '',
  performPlatform: '',
  userId: userInfo.value.id,
  performGoodsIntroduce: '',
  performUrl: '',
  applyMaxNumber: '',
  performTitle:'',
  performStartDttm: '',
  performEndDttm: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: ''
});

// 表单校验规则
const performRule: FormRules = {
  performGoodsIntroduce: [
    {required: true, message: '请输入直播简介', trigger: 'blur'}
  ],
  performUrl: [
    {required: true, message: '请输入直播链接', trigger: 'blur'}
  ],
  startDate: [
    {required: true, message: '请选择开始日期', trigger: 'blur'},
  ],
  startTime: [
    {required: true, message: '请选择开始时间', trigger: 'blur'},
  ],
  endDate: [
    {required: true, message: '请选择结束日期', trigger: 'blur'},
  ],
  endTime: [
    {required: true, message: '请选择结束时间', trigger: 'blur'},
  ],
  performTitle: [
    {required: true, message: '请输入直播名称', trigger: 'blur'},
  ]

};

const kolInfo = ref<KOL>({
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
// 表单对象
const registerForm = ref<FormInstance>();
// 表单对象
const performForm = ref<FormInstance>();

// 表单校验规则
const registerRule: FormRules = {
  kolName: [
    {required: true, message: '请输入主播昵称', trigger: 'blur'}
  ],
  performPlatform: [
    {required: true, message: '请选择直播平台', trigger: 'blur'}
  ],
  kolFollowers: [
    {required: true, message: '请输入粉丝数', trigger: 'blur'},
  ]
};
const clean = (obj: any) => {
  for (const objKey in obj) {
    delete obj[objKey]
  }
  obj.userId = userInfo.value.id;
}
const showRegisterStartCard = ref<boolean>(false);
const showRegister = ref<boolean>(false);
const showKolInfo = ref<boolean>(true);
const initData = () => {
  const user: string | null = localStorage.getItem('userInfo');
  // 解析用户信息
  userInfo.value = <UserInfo>JSON.parse(user ? user : "");
  kolParam.userId = userInfo.value.id;
  request.post("/kol/query", QS.stringify(kolParam)).then(function (response) {
    // 0代表交易成功
    if (response.data.code == 0) {
      if (!response.data.result) {
        // 关闭信息页
        showKolInfo.value = false;
        // 打开注册按钮
        showRegisterStartCard.value = true;
      } else {
        // 关闭注册按钮
        showRegisterStartCard.value = false;
        // 打开信息展示
        showKolInfo.value = true;
        kolInfo.value = response.data.result;
      }
      ElMessage.success('加载数据成功');
    } else {
      ElMessage.error('加载数据失败:' + response.data.message);
    }
  }).catch(function (error) {
    ElMessage.error('加载数据失败：' + error);
  })
}
// 加载数据
initData();
const showRegisterCard = () => {
  showRegister.value = true;
}
// 关闭注册面板
const closeRegisterCard = () => {
  showRegister.value = false;
  clean(kolParam)
}

// 主播注册
const register = (formEl: FormInstance) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      request.post("/kol/register", QS.stringify(kolParam)).then(function (response) {
        // 0代表交易成功
        if (response.data.code == 0) {
          // 关闭注册页面
          closeRegisterCard();
          // 加载数据
          initData();
          ElMessage.success('入驻成功');
        } else {
          // 清理表单数据
          clean(kolParam);
          ElMessage.error('入驻失败:' + response.data.message);
        }
      }).catch(function (error) {
        // 清理表单数据
        clean(kolParam);
        ElMessage.error('入驻失败：' + error);
      })
    } else {
      ElMessage.error('请正确填写入驻参数');
    }
  })
}

// 直播申请
const perform = (formEl: FormInstance) => {
  if (!formEl) return;
  performParam.kolKey = kolInfo.value.id;
  performParam.performPlatform = kolInfo.value.performPlatform;
  performParam.performStartDttm = (JSON.stringify(performParam.startDate).substring(1, 11).replaceAll("-", "")
      + JSON.stringify(performParam.startTime).substring(12, 20).replaceAll(":", ""));
  performParam.performEndDttm = (JSON.stringify(performParam.endDate).substring(1, 11).replaceAll("-", "")
      + JSON.stringify(performParam.endTime).substring(12, 20).replaceAll(":", ""));
  if (performParam.performStartDttm > performParam.performEndDttm) {
    ElMessage.error('直播开始时间不能晚于结束时间');
    return;
  }
  formEl.validate((valid: boolean) => {
    if (valid) {
      request.post("/perform/apply", new URLSearchParams(performParam)).then(function (response) {
        // 0代表交易成功
        if (response.data.code == 0) {
          alert('直播申请成功')
          clean(performParam);
          initData();
          ElMessage.success('直播申请成功');
        } else {
          ElMessage.error('直播申请失败:' + response.data.message);
        }
      }).catch(function (error) {
        // 清理表单数据
        clean(kolParam);
        ElMessage.error('直播申请失败：' + error);
      })
    } else {
      ElMessage.error('请正确填写申请参数');
    }
  })
}

const avatarImg = ref(avatar);
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
  avatarImg.value = cropImg.value;
  dialogVisible.value = false;
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
