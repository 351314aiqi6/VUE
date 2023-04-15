<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.chnlAgentId" placeholder="请输入渠道商ID" class="handle-input-180 mr10 wd80"
                  width="100"></el-input>
        <el-input v-model="query.userId" placeholder="请输入用户ID" class="handle-input-180 mr10 wd80"
                  width="100"></el-input>
        <el-input v-model="query.merchantId" placeholder="请输入商户ID" class="handle-input-180 mr10 wd80"
                  width="100"></el-input>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜 索</el-button>
        <el-button type="primary" :icon="Plus" @click="handleAdd">新 增</el-button>
      </div>
      <el-table :data="merList" border class="table" header-cell-class-name="table-header">
        <el-table-column prop="id" label="序号" width="55" align="center"></el-table-column>
        <el-table-column prop="merchantId" width="100" label="商户号"></el-table-column>
        <el-table-column prop="merchantName" width="100" label="商户名称"></el-table-column>
        <el-table-column prop="userId" width="100" label="所属用户"></el-table-column>
        <el-table-column prop="chnlAgentId" width="100" label="所属渠道"></el-table-column>
        <el-table-column prop="merchantAdress" width="100" label="商户地址"></el-table-column>
        <el-table-column prop="merchantPrivatId" width="100" label="商户证件"></el-table-column>
        <el-table-column prop="merchantAdress" width="100" label="商户地址"></el-table-column>
        <el-table-column prop="merchantEmail" width="100" label="商户邮箱"></el-table-column>
        <el-table-column prop="merchantPhone" width="100" label="商户电话"></el-table-column>
        <el-table-column prop="merchantStatus" width="100" label="商户状态"></el-table-column>
        <el-table-column label="注册时间" width="240px">
          <template #default="scope">{{
              formatDate({'date': scope.row.createTime, "formatStr": "yyyy年MM月dd日 HH时mm分ss秒"})
            }}</template>
        </el-table-column>
        <el-table-column  label="最近修改时间" width="240px">
          <template #default="scope">{{
              formatDate({'date': scope.row.updateTime, "formatStr": "yyyy年MM月dd日 HH时mm分ss秒"})
            }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15"
                       v-model:disabled="scope.row.canOperate">
              编辑
            </el-button>
            <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index, scope.row.id)"
                       v-permiss="16"
                       v-model:disabled="scope.row.canOperate">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.pageIndex"
            :page-size="query.pageSize"
            :total="query.totalSize"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="40%">
      <el-form label-width="120px">
        <el-form-item class="info-name" label="用户编号:">
          {{ editFormParam.userId }}
        </el-form-item>
        <el-form-item class="info-name" label="渠道商编号:">
          {{ editFormParam.chnlAgentId }}
        </el-form-item>
        <el-form-item class="info-name" label="商户编号:">
          {{ editFormParam.merchantId }}
        </el-form-item>
        <el-form-item class="info-name" label="商户证件:">
          {{ editFormParam.merchantPrivatId }}
        </el-form-item>
        <el-form-item label="商户名称:">
          <el-input v-model="editFormParam.merchantName"></el-input>
        </el-form-item>
        <el-form-item label="商户地址:">
          <el-input v-model="editFormParam.merchantAdress"></el-input>
        </el-form-item>
        <el-form-item label="商户邮箱:">
          <el-input v-model="editFormParam.merchantEmail"></el-input>
        </el-form-item>
        <el-form-item label="商户电话:">
          <el-input v-model="editFormParam.merchantPhone"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">修 改</el-button>
				</span>
      </template>
    </el-dialog>

    <!-- 新增弹出框 -->
    <el-dialog title="商户新增" v-model="addVisible" width="40%">
      <el-form :model="addFormParam" :rules="addRule" ref="addForm" label-width="120px">
        <el-form-item class="info-name" label="用户编号:">
          {{ addFormParam.userId }}
        </el-form-item>
        <el-form-item class="info-name" label="渠道商编号:" prop="chnlAgentId">
          <el-select v-model="addFormParam.chnlAgentId" placeholder="请选择渠道商" class="handle-select-140 mr10">
            <el-option v-for="item in chnlList" :label="item.chnlAgentName" :value="item.chnlAgentId"
                       :key="item.id"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="商户名称:" prop="merchantName">
          <el-input v-model="addFormParam.merchantName"></el-input>
        </el-form-item>
        <el-form-item label="商户地址:" prop="merchantAdress">
          <el-input v-model="addFormParam.merchantAdress"></el-input>
        </el-form-item>
        <el-form-item label="商户邮箱:" prop="merchantEmail">
          <el-input v-model="addFormParam.merchantEmail"></el-input>
        </el-form-item>
        <el-form-item label="商户电话:" prop="merchantPhone">
          <el-input v-model="addFormParam.merchantPhone"></el-input>
        </el-form-item>
        <el-form-item label="商户证件:" prop="merchantPhone">
          <el-input v-model="addFormParam.merchantPrivatId"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="addVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveAdd(addForm)">添 加</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="merTable">
import {ref, reactive} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Delete, Edit, Search, Plus} from '@element-plus/icons-vue';
import {fetchData} from '../api/index';
import request from "../request";
import type {FormInstance, FormRules} from 'element-plus';
import QS from "qs";
import {formatDate} from '../date.js'

const clean = (obj: any) => {
  for (const objKey in obj) {
    delete obj[objKey]
  }
}
// 获取用户名
const userId = localStorage.getItem('userId');

// 查询参数
const query = reactive({
  // 用户ID
  userId: "",
  // 渠道商ID
  chnlAgentId: "",
  // 商户ID
  merchantId: "",
  // 起始页
  pageIndex: 1,
  // 页面大小
  pageSize: 5,
  // 总条数
  totalSize: 20
});

const pageTotal = ref(0);

// 商户信息对象
interface MerItem {
  id: number;
  merchantId: string;
  userId: string;
  merchantName: string;
  chnlAgentId: string;
  merchantPrivatId: string;
  merchantAdress: string;
  merchantPhone: string;
  merchantEmail: string;
  merchantStatus: string;
  createTime: string;
  updateTime: string;
  canOperate: boolean;
}

// 商户列表
const merList = ref<MerItem[]>([]);
const loadMer = () => {
  let params = new URLSearchParams();
  params.set("userId", query.userId);
  params.set("chnlAgentId", query.chnlAgentId);
  params.set("merchantId", query.merchantId);
  params.set("pageIndex", String(query.pageIndex));
  params.set("pageSize", String(query.pageSize));
  request.post("/merchant/query", new URLSearchParams(params)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code != 0) {
      // 交易失败
      ElMessage.error('加载商户数据失败' + message);
    } else {
      // 渠道数据初始化
      merList.value = response.data.result.merList;
      for (const index in merList.value) {
        if (merList.value[index].userId !== userId) {
          merList.value[index].canOperate = true;
        }
      }
      query.totalSize = response.data.result.totalSize;
      ElMessage.success('加载商户数据成功');
    }
  }).catch(function (error) {
    ElMessage.error('加载渠道商户数据失败：系统内部错误！');
  })
}

// 加载商户数据
loadMer()

// 查询操作
const handleSearch = () => {
  loadMer();
};

// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val;
  loadMer();
};

// 新增DIV显示标识
const addVisible = ref(false);
// 表单对象
const addForm = ref<FormInstance>();
// 表单对象校验规则
const addRule: FormRules = {
  merchantName: [
    {required: true, message: '请输入商户名称', trigger: 'blur'}
  ],
  merchantPrivatId: [
    {required: true, message: '请输入商户证件号', trigger: 'blur'}
  ],
  merchantAdress: [
    {required: true, message: '请输入商户地址', trigger: 'blur'},
  ],
  merchantPhone: [
    {required: true, message: '请输入商户手机', trigger: 'blur'},
  ],
  merchantEmail: [
    {required: true, message: '请输入商户邮箱', trigger: 'blur'},
  ]
};
// 表单属性
let addFormParam = reactive({
  userId: userId != null ? userId : "",
  merchantId: "",
  chnlAgentId: "",
  merchantName: "",
  merchantPrivatId: "",
  merchantAdress: "",
  merchantPhone: "",
  merchantEmail: "",
});
// 新增按钮事件
const handleAdd = () => {
  // 加载渠道信息
  loadChnl()
  // 显示新增视窗
  addVisible.value = true;
};

// 渠道对象
interface ChnlItem {
  id: number;
  chnlAgentId: string;
  chnlAgentName: string;
  userId: string;
  chnlAgentEmail: string;
  chnlAgentAddress: string;
  chnlAgentMobilePhone: string;
  createTime: string;
  updateTime: string;
  canOperate: boolean;
}

// 渠道列表
const chnlList = ref<ChnlItem[]>();
// 加载渠道信息
const loadChnl = () => {
  let params = new URLSearchParams();
  if (userId) params.set("userId", userId);
  request.post("/chnl/queryChnlAgentList", params).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code != 0) {
      // 交易失败
      ElMessage.error('加载渠道商数据失败' + message);
    } else {
      // 渠道数据初始化
      chnlList.value = response.data.result;
    }
  }).catch(function (error) {
    ElMessage.error('加载渠道商数据失败：系统内部错误！');
  })
}
const saveAdd = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      request.post("/merchant/register", new URLSearchParams(addFormParam)).then(function (response) {
        // 返回响应码
        const code = response.data.code;
        // 返回响应描述
        const message = response.data.message;
        // 0代表交易成功
        if (code == 0) {
          addVisible.value = false;
          loadMer();
          ElMessage.success(`新增商户成功`);
        } else {
          // 交易失败
          ElMessage.error(`新增商户失败：` + message);
        }
        clean(addFormParam)
      }).catch(function (error) {
        ElMessage.error(`新增商户失败：系统内部错误`);
      })
    } else {
      ElMessage.error(`新增商户失败：必填信息缺失`);
      clean(addFormParam)
    }
  })
};

let editFormParam = reactive<MerItem>({
  canOperate: false,
  chnlAgentId: "",
  createTime: "",
  id: 0,
  merchantAdress: "",
  merchantEmail: "",
  merchantId: "",
  merchantName: "",
  merchantPhone: "",
  merchantPrivatId: "",
  merchantStatus: "",
  updateTime: "",
  userId: userId != null ? userId : ""
});
// 修改显示标识
const editVisible = ref(false);
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
  idx = index;
  editVisible.value = true;
  editFormParam = row;
};

const saveEdit = () => {
  editVisible.value = false;
  request.post("/merchant/update", QS.stringify(editFormParam)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code == 0) {
      merList.value[idx] = editFormParam;
      ElMessage.success(`修改渠道商[${editFormParam.chnlAgentId} ]成功`);
    } else {
      // 交易失败
      ElMessage.error(`修改渠道商[${editFormParam.chnlAgentId} ]失败：` + message);
    }
    clean(editFormParam)
  }).catch(function (error) {
    ElMessage.error(`修改渠道商[${editFormParam.chnlAgentId} ]失败：`);
    clean(editFormParam)
  })
  // ElMessage.success(`修改第 ${idx + 1} 行成功`);

};

// 删除操作
const handleDelete = (index: number, id: bigint) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  }).then(() => {
    request.post("/merchant/delete", new URLSearchParams({"id": String(id).toString()})).then(function (response) {
      // 返回响应码
      const code = response.data.code;
      // 返回响应描述
      const message = response.data.message;
      // 0代表交易成功
      if (code == 0) {
        merList.value.splice(index, 1);
        ElMessage.success("删除商户成功");
      } else {
        // 交易失败
        ElMessage.error("删除商户失败：" + message);
      }
    }).catch(function (error) {
      ElMessage.error("删除商户失败：系统内部错");
    })
  }).catch(() => {
  });
};

</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
}

.handle-input-180 {
  width: 180px;
}

.handle-input-130 {
  width: 130px;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #F56C6C;
}

.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
