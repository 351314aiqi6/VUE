<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <!--				<el-select v-model="query.address" placeholder="地址" class="handle-select mr10">-->
        <!--					<el-option key="1" label="广东省" value="广东省"></el-option>-->
        <!--					<el-option key="2" label="湖南省" value="湖南省"></el-option>-->
        <!--				</el-select>-->
        <el-input v-model="query.userId" placeholder="请输入用户编号" class="handle-input mr10"></el-input>
        <el-input v-model="query.chnlAgentId" placeholder="请输入渠道编号" class="handle-input mr10"></el-input>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
<!--        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>-->
        <el-table-column prop="chnlAgentId" width="140" label="渠道商编号"></el-table-column>
        <el-table-column label="渠道商名称" width="150px">
          <template #default="scope">{{ scope.row.chnlAgentName }}</template>
        </el-table-column>
        <!--				<el-table-column label="头像(查看大图)" align="center">-->
        <!--					<template #default="scope">-->
        <!--						<el-image-->
        <!--							class="table-td-thumb"-->
        <!--							:src="scope.row.thumb"-->
        <!--							:z-index="10"-->
        <!--							:preview-src-list="[scope.row.thumb]"-->
        <!--							preview-teleported-->
        <!--						>-->
        <!--						</el-image>-->
        <!--					</template>-->
        <!--				</el-table-column>-->
        <el-table-column prop="userId" width="100px" label="所属用户"></el-table-column>
        <el-table-column prop="chnlAgentEmail" width="200px" label="渠道商邮箱"></el-table-column>
        <el-table-column prop="chnlAgentAddress" width="150px" label="渠道商地址"></el-table-column>
        <el-table-column prop="chnlAgentMobilePhone" width="120px" label="渠道商电话"></el-table-column>
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
        <!--				<el-table-column label="状态" align="center">-->
        <!--					<template #default="scope">-->
        <!--						<el-tag-->
        <!--							:type="scope.row.state === '成功' ? 'success' : scope.row.state === '失败' ? 'danger' : ''"-->
        <!--						>-->
        <!--							{{ scope.row.state }}-->
        <!--						</el-tag>-->
        <!--					</template>-->
        <!--				</el-table-column>-->
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15"
                       v-model:disabled="scope.row.canOperate">
              编辑
            </el-button>
            <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index, scope.row.chnlAgentId)"
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
        <el-form-item class="info-name" label="渠道商编号:">
          {{ form.chnlAgentId }}
        </el-form-item>
        <el-form-item class="info-name" label="渠道商归属:">
          {{ form.userId }}
        </el-form-item>
        <el-form-item label="渠道商名称:">
          <el-input v-model="form.chnlAgentName"></el-input>
        </el-form-item>
        <el-form-item label="渠道商地址:">
          <el-input v-model="form.chnlAgentAddress"></el-input>
        </el-form-item>
        <el-form-item label="渠道商邮箱:">
          <el-input v-model="form.chnlAgentEmail"></el-input>
        </el-form-item>
        <el-form-item label="渠道商电话:">
          <el-input v-model="form.chnlAgentMobilePhone"></el-input>
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
    <el-dialog title="渠道商新增" v-model="addVisible" width="40%">
      <el-form :model="addFormParam" :rules="addRule" ref="addForm" label-width="120px">
        <el-form-item class="info-name" label="用户编号:">
          {{ addFormParam.id }}
        </el-form-item>
        <el-form-item label="渠道商名称:" prop="chnlAgentName">
          <el-input v-model="addFormParam.chnlAgentName"></el-input>
        </el-form-item>
        <el-form-item label="渠道商地址:" prop="chnlAgentAddress">
          <el-input v-model="addFormParam.chnlAgentAddress"></el-input>
        </el-form-item>
        <el-form-item label="渠道商邮箱:" prop="chnlAgentEmail">
          <el-input v-model="addFormParam.chnlAgentEmail"></el-input>
        </el-form-item>
        <el-form-item label="渠道商电话:" prop="chnlAgentMobilePhone">
          <el-input v-model="addFormParam.chnlAgentMobilePhone"></el-input>
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

<script setup lang="ts" name="basetable">
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

interface TableItem {
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

const query = reactive({
  userId: '',
  chnlAgentId: '',
  pageIndex: 1,
  pageSize: 5,
  totalSize: 20
});

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
  let params = new URLSearchParams();
  params.set("userId", query.userId);
  request.post("/chnl/query", QS.stringify(query)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;

    // 0代表交易成功
    if (code == 0) {
      // 返回数据
      tableData.value = response.data.result.chnlList;
      for (const index in tableData.value) {
        if (tableData.value[index].userId !== userId) {
          tableData.value[index].canOperate = true;
        }
      }
      query.totalSize = response.data.result.totalSize;
      ElMessage.success('查询成功');
    } else {
      // 交易失败
      ElMessage.error('渠道商查询失败:' + message);
    }
  }).catch(function (error) {
    ElMessage.error('渠道商查询失败：系统内部错误！');
  })
};
getData();

// 查询操作
const handleSearch = () => {
  query.pageIndex = 1;
  getData();
};

// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val;
  getData();
};

// 删除操作
const handleDelete = (index: number, chnlAgentId: string) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  }).then(() => {
    request.post("/chnl/delete", new URLSearchParams({"chnlAgentId": chnlAgentId})).then(function (response) {
      // 返回响应码
      const code = response.data.code;
      // 返回响应描述
      const message = response.data.message;
      // 0代表交易成功
      if (code == 0) {
        tableData.value.splice(index, 1);
        ElMessage.success("删除渠道商" + chnlAgentId + "成功");
      } else {
        // 交易失败
        ElMessage.error("删除渠道商" + chnlAgentId + "失败：" + message);
      }
    }).catch(function (error) {
      ElMessage.error("删除渠道商" + chnlAgentId + "失败：系统内部错");
    })
  }).catch(() => {
  });
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
  chnlAgentId: '',
  chnlAgentName: '',
  userId: '',
  chnlAgentEmail: '',
  chnlAgentAddress: '',
  chnlAgentMobilePhone: '',
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
  idx = index;
  editVisible.value = true;
  form.chnlAgentId = row.chnlAgentId;
  form.chnlAgentName = row.chnlAgentName;
  form.userId = row.userId;
  form.chnlAgentEmail = row.chnlAgentEmail;
  form.chnlAgentAddress = row.chnlAgentAddress;
  form.chnlAgentMobilePhone = row.chnlAgentMobilePhone;
};

const saveEdit = () => {
  editVisible.value = false;
  request.post("/chnl/update", new URLSearchParams(form)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code == 0) {
      getData();
      ElMessage.success(`修改渠道商[${form.chnlAgentId} ]成功`);
    } else {
      // 交易失败
      ElMessage.error(`修改渠道商[${form.chnlAgentId} ]失败：` + message);
    }
    clean(form)
  }).catch(function (error) {
    ElMessage.error(`修改渠道商[${form.chnlAgentId} ]失败：`);
    clean(form)
  })
};

// 表格编辑时弹窗和保存
const addVisible = ref(false);
const addForm = ref<FormInstance>();
const addRule: FormRules = {
  chnlAgentName: [
    {required: true, message: '请输入渠道商名称', trigger: 'blur'},
    {min: 5, max: 60, message: '渠道商名称5-50位之间', trigger: 'blur'},
  ],
  chnlAgentEmail: [
    {required: true, message: '请输入渠道商邮箱', trigger: 'blur'},
    {min: 5, max: 15, message: '渠道商邮箱为5-45为之间', trigger: 'blur'},
  ],
  chnlAgentAddress: [
    {required: true, message: '请输入渠道商地址', trigger: 'blur'},
  ],
  chnlAgentMobilePhone: [
    {required: true, message: '请输入渠道商手机', trigger: 'blur'},
  ]
};

let addFormParam = reactive({
  id: "",
  chnlAgentName: "",
  chnlAgentEmail: "",
  chnlAgentAddress: "",
  chnlAgentMobilePhone: "",
});

const handleAdd = () => {
  if (userId) {
    addFormParam.id = userId;
  }
  addVisible.value = true;
};

const saveAdd = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      let param = new URLSearchParams(addFormParam);
      param.set("userId", addFormParam.id);
      request.post("/chnl/addChnl", param).then(function (response) {
        // 返回响应码
        const code = response.data.code;
        // 返回响应描述
        const message = response.data.message;
        // 0代表交易成功
        if (code == 0) {
          addVisible.value = false;
          getData();
          ElMessage.success(`新增渠道商成功`);
        } else {
          // 交易失败
          ElMessage.error(`新增渠道商失败：` + message);
        }
        clean(addFormParam)
      }).catch(function (error) {
        ElMessage.error(`新增渠道商失败：`);
        clean(addFormParam)
      })
    }
  })
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-select-140 {
  width: 120px;
}

.handle-input {
  width: 300px;
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
