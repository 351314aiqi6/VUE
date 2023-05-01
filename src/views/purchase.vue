<template>
  <div class="container">
    <div class="form-box-all">
      <el-form ref="formRef" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="检索方式" prop="resourceType">
          <el-radio-group v-model="form.resourceType" @change="selectGoods">
            <el-radio label="01">按类型</el-radio>
            <el-radio label="02">按供应商</el-radio>
            <el-radio label="03">按农产品ID</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="农产品选择" prop="options" v-model="selectFrameVisible" v-if="selectFrameVisible==true">
          <el-cascader :options="goodsOptions.value" v-model="form.goodsOption" @change="queryOneGoods1"
                       style="width: 70%"></el-cascader>
        </el-form-item>
        <el-form-item v-model="inputGoodsIdVisible" v-if="inputGoodsIdVisible==true" label="农产品ID" prop="goodsId">
          <el-input v-model="form.goodsId" placeholder="请输入农产品ID" @change="queryOneGoods"
                    style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item v-model="goodsInfoVisible" v-if="goodsInfoVisible==true" label="被采购方">
          <el-input v-model="form.payeeUserId" style="width: 70%" disabled="true"></el-input>
        </el-form-item>
        <el-form-item v-model="goodsInfoVisible" v-if="goodsInfoVisible==true" label="农产品单价">
          <el-input v-model="form.goodsPrice" style="width: 70%" disabled="true"></el-input>
        </el-form-item>
        <el-form-item v-model="goodsInfoVisible" v-if="goodsInfoVisible==true" label="农产品库存">
          <el-input v-model="form.goodsStock" style="width: 70%" disabled="true"></el-input>
        </el-form-item>
        <el-form-item v-model="goodsInfoVisible" v-if="goodsInfoVisible==true" label="农产品名称">
          <el-input v-model="form.goodsName" style="width: 70%" disabled="true"></el-input>
        </el-form-item>
        <el-form-item v-model="goodsInfoVisible" v-if="goodsInfoVisible==true" label="农产品归属">
          <el-input v-model="form.merchantId" style="width: 70%" disabled="true"></el-input>
        </el-form-item>
        <el-form-item v-model="goodsInfoVisible" v-if="goodsInfoVisible==true" label="采购数量" prop="purchaseNumber">
          <el-input v-model="form.purchaseNumber" @change="countTotalPrice" style="width: 70%"></el-input>
        </el-form-item>
        <el-form-item label="采购总金额" prop="totalPrice" v-model="goodsInfoVisible" v-if="goodsInfoVisible==true">
          <el-input v-model="form.totalPrice" disabled="true" style="width: 70%" readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="收货人地址" prop="receiveAddress">
          <el-input v-model="form.receiveAddress" style="width: 70%"></el-input>
        </el-form-item>
        <el-form-item label="收货人姓名" prop="receiveName">
          <el-input v-model="form.receiveName" style="width: 70%"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话" prop="receivePhone">
          <el-input v-model="form.receivePhone" style="width: 70%"></el-input>
        </el-form-item>
        <el-form-item label="采购备注信息" prop="desc">
          <el-input type="textarea" rows="3" style="width: 70%" v-model="form.purchaseAdditional"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(formRef)">采购单提交</el-button>
          <el-button @click="onReset(formRef)">采购单重制</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts" name="purchase">
import {reactive, ref} from 'vue';
import {ElMessage} from 'element-plus';
import type {FormInstance, FormRules} from 'element-plus';
import request from "../request";
import {tryCall} from "element-plus/es/components/table-v2/src/utils";
import QS from "qs";

// 获取用户名
const userId = localStorage.getItem('userId');

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

// 新增DIV显示标识
const selectFrameVisible = ref(false);
// 新增DIV显示标识
const inputGoodsIdVisible = ref(false);

// 商品信息显示标识
const goodsInfoVisible = ref(false);
const goodsOptions = reactive({
  value: []
});
const rules: FormRules = {
  goodsId: [{required: true, message: '请选择采购农产品', trigger: 'blur'}],
  purchaseNumber: [{required: true, message: '请输入采购数量', trigger: 'blur'}],
  totalPrice: [{required: true, message: '请输入采购数量', trigger: 'blur'}],
  receiveAddress: [{required: true, message: '请输入收货地址', trigger: 'blur'}],
  receiveName: [{required: true, message: '请输入收货人姓名', trigger: 'blur'}],
  receivePhone: [{required: true, message: '请输入收货人电话', trigger: 'blur'}],
};
const formRef = ref<FormInstance>();
const form = reactive({
  goodsId: '',
  // 检索方式
  resourceType: '01',
  purchaseNumber: "",
  purchaseUserId: userId,
  totalPrice: "",
  goodsOption: [""],
  goodsPrice: '',
  goodsStock: '',
  goodsName: '',
  merchantId: '',
  payeeUserId: '',
  receiveAddress: '',
  purchaseAdditional: '',
  receiveName: '',
  receivePhone: '',
});
const user: string | null = localStorage.getItem('userInfo');
if (user != null) {
  // 解析用户信息
  const dbUser = <UserInfo>JSON.parse(user);
  form.receiveName = dbUser.userRealName;
  form.receivePhone = dbUser.userMobilePhone;
  form.receiveAddress = dbUser.userAddress;
}
const selectGoods = () => {
  if (form.resourceType == "01" || form.resourceType == "02") {
    selectFrameVisible.value = true;
    inputGoodsIdVisible.value = false;
    request.post("/goods/selectGoods", new URLSearchParams({"selectType": form.resourceType})).then(
        function (response) {
          let code = response.data.code;
          let message = response.data.message;
          if (code == 0) {
            goodsOptions.value = response.data.result;
          } else {
            ElMessage.error("检索商品失败：" + message)
          }
        }
    ).catch(function (error) {
      ElMessage.error("检索商品失败：" + error);
    })
  } else {
    selectFrameVisible.value = false;
    inputGoodsIdVisible.value = true;
  }
}
selectGoods();

const queryOneGoods1 = () => {
  let goodsId = form.goodsOption.pop();
  if (goodsId) form.goodsId = goodsId;
  queryOneGoods();
}
const queryOneGoods = () => {
  request.post("/goods/queryOne", new URLSearchParams({"id": form.goodsId})).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code != 0) {
      // 交易失败
      ElMessage.error('加载商品数据失败' + message);
    } else {
      let result = response.data.result;
      form.goodsName = result.goodsName;
      form.goodsPrice = result.goodsPrice;
      form.goodsStock = result.goodsStock;
      form.payeeUserId = result.chnlUserId;
      form.merchantId = result.merchantId;
      // 隐藏格子注意可见
      goodsInfoVisible.value = true;
      ElMessage.success('加载农产品数据成功');
    }
  }).catch(function (error) {
    ElMessage.error('加载渠道农产品数据失败：系统内部错误！');
  })
}

// 结算商品总金额
const countTotalPrice = () => {
  try {
    let goodsPrice = Number(form.goodsPrice);
    let purchaseNumber = Number(form.purchaseNumber);
    if (purchaseNumber > Number(form.goodsStock)) {
      form.purchaseNumber = "";
      form.totalPrice="";
      ElMessage.error('采购数量不能大于库存数！');
    } else {
      form.totalPrice = String(goodsPrice * purchaseNumber);
    }
  } catch (error) {
    ElMessage.error('采购数仅能输入数字！');
  }
}

// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
  // 表单校验
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      request.post("/purchase/apply", QS.stringify(form)).then(
          function (response) {
            let code = response.data.code;
            let message = response.data.message;
            if (code == 0) {
              // 清空表格
              form.totalPrice='';
              form.purchaseNumber='';
              form.purchaseAdditional='';
              alert("采购单申请成功,请及时关注后续状态");
              ElMessage.success("采购单申请成功")
            } else {
              ElMessage.error("采购单申请失败：" + message)
            }
          }
      ).catch(function (error) {
        ElMessage.error("采购单申请失败：" + error);
      })
    } else {
      return false;
    }
  });
};
// 重置
const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
