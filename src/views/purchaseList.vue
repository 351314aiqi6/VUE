<template>
  <div class="container">
    <el-tabs v-model="message">
      <el-tab-pane :label="`采购申请单(${payerPurchaseList.length})`" name="first">
        <el-table :data="payerPurchaseList" :show-header="false" style="width: 100%">
          <el-table-column>
            <template #default="scope">
              <span class="message-title" @click="showDetail(scope.row)">
                【我发起的采购单】采购时间【{{ scope.row.createTime }}】,采购商品【{{ scope.row.goodsId }}】,当前状态【{{
                  scope.row.purchaseStatus
                }}】,采购数量【{{ scope.row.purchaseNumber }}】,采购总金额【{{ scope.row.totalPrice }}】</span>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="120"></el-table-column>
          <el-table-column width="120">
            <template #default="scope">
              <el-button size="small" color="green" disabled v-if="scope.row.purchaseStatus=='00'
              || scope.row.purchaseStatus=='02' " @click="handleRead(scope.$index)">对方处理
              </el-button>
              <el-button size="small" color="red" v-if="scope.row.purchaseStatus=='01'"
                         @click="handle(scope.$index,scope.row,'02')">发起支付
              </el-button>
              <el-button size="small" color="red" v-if="scope.row.purchaseStatus=='03'"
                         @click="handle(scope.$index,scope.row,'04')">确认收货
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--        <div class="handle-row">-->
        <!--          <el-button type="primary">一键处理</el-button>-->
        <!--        </div>-->
      </el-tab-pane>
      <el-tab-pane :label="`采购受理单(${payeePurchaseList.length})`" name="second">
        <template v-if="message === 'second'">
          <el-table :data="payeePurchaseList" :show-header="false" style="width: 100%">
            <el-table-column>
              <template #default="scope">
                <span class="message-title" @click="showDetail(scope.row)">
                【我受理的采购单】采购时间【{{ scope.row.createTime }}】,采购商品【{{ scope.row.goodsId }}】,当前状态【{{
                    scope.row.purchaseStatus
                  }}】,采购数量【{{ scope.row.purchaseNumber }}】,采购总金额【{{ scope.row.totalPrice }}】</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" width="150"></el-table-column>
            <el-table-column width="120">
              <template #default="scope">
                <el-button size="small" color="green" disabled
                           v-if="scope.row.purchaseStatus=='01' || scope.row.purchaseStatus=='03' ">对方处理
                </el-button>
                <el-button size="small" color="red" v-if="scope.row.purchaseStatus=='00'"
                           @click="handle(scope.$index,scope.row,'01')">采购受理
                </el-button>
                <el-button size="small" color="red" v-if="scope.row.purchaseStatus=='02'"
                           @click="handle(scope.$index,scope.row,'03')">订单发货
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--          <div class="handle-row">-->
          <!--            <el-button type="danger">删除全部</el-button>-->
          <!--          </div>-->
        </template>
      </el-tab-pane>
      <el-tab-pane :label="`已结束(${closePurchaseList.length})`" name="third">
        <template v-if="message === 'third'">
          <el-table :data="closePurchaseList" :show-header="false" style="width: 100%">
            <el-table-column>
              <template #default="scope">
                <span class="message-title" @click="showDetail(scope.row)">
                【已结束的采购单】采购时间【{{ scope.row.createTime }}】,采购商品【{{ scope.row.goodsId }}】,当前状态【{{
                    scope.row.purchaseStatus
                  }}】,采购数量【{{ scope.row.purchaseNumber }}】,采购总金额【{{ scope.row.totalPrice }}】</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" width="150"></el-table-column>
            <el-table-column width="120">
              <template #default="scope">
                <el-button color="red" @click="appeal(scope.row)">发起申诉</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--          <div class="handle-row">-->
          <!--            <el-button type="danger">清空回收站</el-button>-->
          <!--          </div>-->
        </template>
      </el-tab-pane>

      <el-tab-pane :label="`申诉中(${appealPurchaseList.length})`" name="fourth">
        <template v-if="message === 'fourth'">
          <el-table :data="appealPurchaseList" :show-header="false" style="width: 100%">
            <el-table-column>
              <template #default="scope">
                <span class="message-title" @click="showDetail(scope.row)">
                【已结束的采购单】采购时间【{{ scope.row.createTime }}】,采购商品【{{ scope.row.goodsId }}】,当前状态【{{
                    scope.row.purchaseStatus
                  }}】,采购数量【{{ scope.row.purchaseNumber }}】,采购总金额【{{ scope.row.totalPrice }}】</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" width="150"></el-table-column>
            <el-table-column width="120">
              <template #default="scope">
                <el-button disabled>平台申诉处理中</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--          <div class="handle-row">-->
          <!--            <el-button type="danger">清空回收站</el-button>-->
          <!--          </div>-->
        </template>
      </el-tab-pane>
    </el-tabs>

    <!-- 支付弹出框 -->
    <el-dialog title="确认支付" v-model="payVisible" width="40%">
      <el-form label-width="120px">
        <el-form-item class="info-name" label="采购单序号:">
          {{ purchaseDetail.id }}
        </el-form-item>
        <el-form-item class="info-name" label="收款人账号:">
          {{ purchaseDetail.payeeUserId }}
        </el-form-item>
        <el-form-item class="info-name" label="采购商品数量:">
          {{ purchaseDetail.purchaseNumber }}
        </el-form-item>
        <el-form-item class="info-name" label="采购单总金额:">
          {{ purchaseDetail.totalPrice }}
        </el-form-item>
        <el-form-item class="info-name" label="采购单备注信息:">
          {{ purchaseDetail.purchaseAdditional }}
        </el-form-item>
        <el-form-item class="info-name" label="采购单创建时间:">
          {{ purchaseDetail.createTime }}
        </el-form-item>
        <el-form-item class="info-name" label="采购单处理时间:">
          {{ purchaseDetail.updateTime }}
        </el-form-item>
        <el-form-item label="请选择支付方式" prop="resource">
          <el-radio-group v-model="purchaseDetail.payType">
            <el-radio label="支付宝" selected="true"></el-radio>
            <el-radio label="微信"></el-radio>
            <el-radio label="银联"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="payVisible = false">关 闭</el-button>
				</span>
        <span class="dialog-footer">
					<el-button @click="paymentConfirm(purchaseDetail)">确认支付</el-button>
				</span>
      </template>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="采购单详情" v-model="detailVisible" width="40%">
      <el-form label-width="120px">
        <el-form-item class="info-name" label="采购单序号:">
          {{ purchaseDetail.id }}
        </el-form-item>
        <el-form-item class="info-name" label="采购单编号:">
          {{ purchaseDetail.purchaseId }}
        </el-form-item>
        <el-form-item class="info-name" label="采购商品号:">
          {{ purchaseDetail.goodsId }}
        </el-form-item>
        <el-form-item class="info-name" label="采购发起人:">
          {{ purchaseDetail.purchaseUserId }}
        </el-form-item>
        <el-form-item class="info-name" label="采购受理人:">
          {{ purchaseDetail.payeeUserId }}
        </el-form-item>
        <el-form-item class="info-name" label="采购商品数量:">
          {{ purchaseDetail.purchaseNumber }}
        </el-form-item>
        <el-form-item class="info-name" label="采购单总金额:">
          {{ purchaseDetail.totalPrice }}
        </el-form-item>
        <el-form-item class="info-name" label="收货人姓名:">
          {{ purchaseDetail.receiveName }}
        </el-form-item>
        <el-form-item class="info-name" label="收货人地址:">
          {{ purchaseDetail.receiveAddress }}
        </el-form-item>
        <el-form-item class="info-name" label="收货人电话:">
          {{ purchaseDetail.receivePhone }}
        </el-form-item>
        <el-form-item class="info-name" label="采购单备注信息:">
          {{ purchaseDetail.purchaseAdditional }}
        </el-form-item>
        <el-form-item class="info-name" label="采购单创建时间:">
          {{ purchaseDetail.createTime }}
        </el-form-item>
        <el-form-item class="info-name" label="采购单处理时间:">
          {{ purchaseDetail.updateTime }}
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="detailVisible = false">关 闭</el-button>
				</span>
      </template>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="发起申诉" v-model="appealVisible" width="40%">
      <el-form label-width="120px">
        <el-form-item class="info-name" label="采购单序号:">
          {{ purchaseDetail.id }}
        </el-form-item>
        <el-form-item class="info-name" label="采购单编号:">
          {{ purchaseDetail.purchaseId }}
        </el-form-item>
        <el-form-item class="info-name" label="采购商品号:">
          {{ purchaseDetail.goodsId }}
        </el-form-item>
        <el-form-item class="info-name" label="采购发起人:">
          {{ purchaseDetail.purchaseUserId }}
        </el-form-item>
        <el-form-item class="info-name" label="采购受理人:">
          {{ purchaseDetail.payeeUserId }}
        </el-form-item>
        <el-form-item class="info-name" label="采购商品数量:">
          {{ purchaseDetail.purchaseNumber }}
        </el-form-item>
        <el-form-item class="info-name" label="采购单总金额:">
          {{ purchaseDetail.totalPrice }}
        </el-form-item>
        <el-form-item class="info-name" label="收货人姓名:">
          {{ purchaseDetail.receiveName }}
        </el-form-item>
        <el-form-item class="info-name" label="收货人地址:">
          {{ purchaseDetail.receiveAddress }}
        </el-form-item>
        <el-form-item class="info-name" label="收货人电话:">
          {{ purchaseDetail.receivePhone }}
        </el-form-item>
        <el-form-item class="info-name" label="采购单备注信息:">
          {{ purchaseDetail.purchaseAdditional }}
        </el-form-item>
        <el-form-item class="info-name" label="采购单创建时间:">
          {{ purchaseDetail.createTime }}
        </el-form-item>
        <el-form-item class="info-name" label="采购单完成时间:">
          {{ purchaseDetail.updateTime }}
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="appealVisible = false">关 闭</el-button>
				</span>
        <span class="dialog-footer">
					<el-button @click="appealConfirm(purchaseDetail)">确认申诉</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="tabs">
import {ref, reactive} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Delete, Edit, Search, Plus} from '@element-plus/icons-vue';
import {fetchData} from '../api/index';
import request from "../request";
import type {FormInstance, FormRules} from 'element-plus';
import QS from "qs";

// 申购单信息
interface Purchase {
  id: string;
  purchaseId: string;
  payeeUserId: string
  purchaseUserId: string;
  goodsId: string;
  purchaseNumber: string;
  totalPrice: string,
  receiveAddress: string,
  receiveName: string,
  receivePhone: string,
  purchaseAdditional: string,
  purchaseStatus: string,
  createTime: string,
  updateTime: string,
  payType: string
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
const operateParam = {
  userId: userInfo.id,
};

// 采购申请单列表
const payerPurchaseList = ref<Purchase[]>([]);
// 采购受理单列表
const payeePurchaseList = ref<Purchase[]>([]);
// 已完成的采购单列表
const closePurchaseList = ref<Purchase[]>([]);
// 申诉中的采购单列表
const appealPurchaseList = ref<Purchase[]>([]);
const initData = () => {
  request.post("/purchase/query", QS.stringify(operateParam)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code == 0) {
      let result = response.data.result;
      closePurchaseList.value = result.closePurchaseList;
      payerPurchaseList.value = result.payerPurchaseList;
      payeePurchaseList.value = result.payeePurchaseList;
      appealPurchaseList.value = result.appealPurchaseList;
      ElMessage.success('采购单加载成功' + message);
    } else {
      // 交易失败
      ElMessage.error('采购单加载成功' + message);
    }
  }).catch(function (error) {
    ElMessage.error('加载商品类型失败：系统内部错误！');
  })
}
initData();

// 采购申请单列表
const purchaseDetail = ref<Purchase>();
const detailVisible = ref(false);
const payVisible = ref(false);
const appealVisible = ref(false);
const showDetail = (purchase: Purchase) => {
  detailVisible.value = true;
  purchaseDetail.value = purchase
}

const payment = (purchase: Purchase) => {
  payVisible.value = true;
  purchaseDetail.value = purchase
}

const appeal = (purchase: Purchase) => {
  appealVisible.value = true;
  purchaseDetail.value = purchase
}

const appealConfirm = (purchase: Purchase) => {
  purchase.purchaseStatus = "05";
  request.post("/purchase/handle", QS.stringify(purchase)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code == 0) {
      payVisible.value = false;
      // 重新加载数据
      initData();
      ElMessage.success('采购单申诉成功' + message);
    } else {
      // 交易失败
      ElMessage.error('采购单申诉失败' + message);
    }
  }).catch(function (error) {
    ElMessage.error('采购单申诉失败：系统内部错误！');
  })
}


const paymentConfirm = (purchase: Purchase) => {
  purchase.purchaseStatus = "02";
  request.post("/purchase/handle", QS.stringify(purchase)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code == 0) {
      payVisible.value = false;
      // 重新加载数据
      initData();
      ElMessage.success('采购单支付成功' + message);
    } else {
      // 交易失败
      ElMessage.error('采购单支付失败' + message);
    }
  }).catch(function (error) {
    ElMessage.error('采购单支付失败：系统内部错误！');
  })
}

const handle = (index: number, row: Purchase, status: string) => {
  if (status == "02") {
    payment(row)
  } else {
    row.purchaseStatus = status;
    request.post("/purchase/handle", QS.stringify(row)).then(function (response) {
      // 返回响应码
      const code = response.data.code;
      // 返回响应描述
      const message = response.data.message;
      // 0代表交易成功
      if (code == 0) {
        // 重新加载数据
        initData();
        ElMessage.success('采购单处理成功' + message);
      } else {
        // 交易失败
        ElMessage.error('采购单处理失败' + message);
      }
    }).catch(function (error) {
      ElMessage.error('采购单处理失败：系统内部错误！');
    })
  }
};


const message = ref('first');
const state = reactive({
  unread: [
    {
      date: '2018-04-19 20:00:00',
      title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
    },
    {
      date: '2018-04-19 21:00:00',
      title: '今晚12点整发大红包，先到先得'
    }
  ],
  read: [
    {
      date: '2018-04-19 20:00:00',
      title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
    }
  ],
  recycle: [
    {
      date: '2018-04-19 20:00:00',
      title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
    }
  ]
});

const handleRead = (index: number) => {
  const item = state.unread.splice(index, 1);
  state.read = item.concat(state.read);
};
const handleDel = (index: number) => {
  const item = state.read.splice(index, 1);
  state.recycle = item.concat(state.recycle);
};
const handleRestore = (index: number) => {
  const item = state.recycle.splice(index, 1);
  state.read = item.concat(state.read);
};
</script>

<style>
.message-title {
  cursor: pointer;
}

.handle-row {
  margin-top: 30px;
}
</style>
