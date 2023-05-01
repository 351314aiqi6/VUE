<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="query.goodsTypeId" placeholder="请选择农产品类型" class="handle-select mr10">
          <el-option v-for="item in goodsTypeList" :label="item.goodsTypeName" :value="item.goodsTypeId"
                     :key="item.id"></el-option>
        </el-select>
        <el-input v-model="query.chnlAgentId" placeholder="请输入渠道商编号" class="handle-input-180 mr10 wd80"
                  width="100"></el-input>
        <el-input v-model="query.userId" placeholder="请输入用户编号" class="handle-input-180 mr10 wd80"
                  width="100"></el-input>
        <el-input v-model="query.merchantId" placeholder="请输入农户编号" class="handle-input-180 mr10 wd80"
                  width="100"></el-input>
        <el-input v-model="query.goodsId" placeholder="请输入农产品编号" class="handle-input-180 mr10 wd80"
                  width="100"></el-input>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
      </div>
      <el-table :data="goodsList" border class="table" header-cell-class-name="table-header">
<!--        <el-table-column prop="id" label="序号" align="center"></el-table-column>-->
        <el-table-column prop="goodsId" width="100" label="农产品编号"></el-table-column>
        <el-table-column prop="merchantId" width="100" label="农户编号"></el-table-column>
        <el-table-column prop="chnlAgentId" width="100" label="渠道商号"></el-table-column>
        <el-table-column prop="chnlUserId" width="100" label="用户编号"></el-table-column>

        <el-table-column prop="goodsImage" class="upload" label="农产品图片">
          <template #default="scope">
            <div class="info-image">
              <el-avatar :size="45" :src="scope.row.goodsImage" shape="square"/>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="goodsName" width="100" label="农产品名称"></el-table-column>
        <el-table-column prop="goodsType" width="100" label="农产品类型"></el-table-column>
        <el-table-column prop="goodsDesc" width="100" label="农产品描述"></el-table-column>
        <el-table-column prop="goodsPrice" width="100" label="农产品价格"></el-table-column>
        <el-table-column prop="goodsStock" width="100" label="农产品库存"></el-table-column>
        <el-table-column label="添加时间" width="240px">
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
            <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index, scope.row)"
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
        <el-form-item class="info-name" label="农产品编号:">
          {{ editFormParam.goodsId }}
        </el-form-item>
        <el-form-item class="info-name" label="农产品类型:">
          {{ editFormParam.goodsType }}
        </el-form-item>
        <el-form-item class="info-name" label="用户编号:">
          {{ editFormParam.chnlUserId }}
        </el-form-item>
        <el-form-item class="info-name" label="渠道商编号:">
          {{ editFormParam.chnlAgentId }}
        </el-form-item>
        <el-form-item class="info-name" label="农户编号:">
          {{ editFormParam.merchantId }}
        </el-form-item>
<!--编辑图片-->
        <el-form-item prop="img" class="upload" label="农产品图片:">
          <div class="info-image" @click="showImglog">
            <el-avatar :size="45" :src="editFormParam.goodsImage"/>
          </div>
            <el-button size="small" type="primary" @click="showImglog">上传图片</el-button>
        </el-form-item>

        <el-form-item label="农产品名称:">
          <el-input v-model="editFormParam.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="农产品描述:">
          <el-input v-model="editFormParam.goodsDesc"></el-input>
        </el-form-item>
        <el-form-item label="农产品价格:">
          <el-input v-model="editFormParam.goodsPrice"></el-input>
        </el-form-item>
        <el-form-item label="农产品库存:">
          <el-input v-model="editFormParam.goodsStock"></el-input>
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
    <el-dialog title="农产品新增" v-model="addVisible" width="40%">
      <el-form :model="addFormParam" :rules="addRule" ref="addForm" label-width="120px">
        <el-form-item class="info-name" label="用户编号:">
          {{ addFormParam.userId }}
        </el-form-item>
        <el-form-item class="info-name" label="农户编号:" prop="merchantId">
          <el-select v-model="addFormParam.merchantId" placeholder="请选择农户" class="handle-select-140 mr10">
            <el-option v-for="item in merList" :label="item.merchantName" :value="item.merchantId"
                       :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="info-name" label="农产品类型:" prop="goodsTypeId">
          <el-select v-model="addFormParam.goodsTypeId" placeholder="请选择农产品类型" class="handle-select-140 mr10">
            <el-option v-for="item in goodsTypeList" :label="item.goodsTypeName" :value="item.goodsTypeId"
                       :key="item.id"></el-option>
          </el-select>
        </el-form-item>
<!--新增图片-->
        <el-form-item prop="img" class="upload" label="农产品图片:">
          <div class="info-image"  @click="showAddImglog">
            <el-avatar :size="45" :src="addFormParam.goodsImage"/>
          </div>
          <el-button size="small" type="primary" @click="showAddImglog">点击上传</el-button>
        </el-form-item>

        <el-form-item label="农产品名称:" prop="goodsName">
          <el-input v-model="addFormParam.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="农产品描述:" prop="goodsDesc">
          <el-input v-model="addFormParam.goodsDesc"></el-input>
        </el-form-item>
        <el-form-item label="农产品价格:" prop="goodsPrice">
          <el-input v-model="addFormParam.goodsPrice"></el-input>
        </el-form-item>
        <el-form-item label="农品库存:" prop="goodsStock">
          <el-input v-model="addFormParam.goodsStock"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="addVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveAdd(addForm)">添 加</el-button>
				</span>
      </template>
    </el-dialog>

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
					<el-button class="crop-demo-btn" type="primary" @change="setImage">选择图片
						<input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
					</el-button>
					<el-button type="primary" @click="saveAvatar">上传并保存</el-button>
				</span>
      </template>
    </el-dialog>

    <el-dialog title="裁剪图片" v-model="addImageVisible" width="600px">
      <vue-cropper
          ref="addCropper"
          :src="addImgSrc"
          :ready="addCropImage"
          :zoom="addCropImage"
          :cropmove="addCropImage"
          style="width: 100%; height: 400px"
      ></vue-cropper>

      <template #footer>
				<span class="dialog-footer">
					<el-button class="crop-demo-btn" type="primary" @change="setAddImage">选择图片
						<input class="crop-input" type="file" name="image" accept="image/*" @change="setAddImage"/>
					</el-button>
					<el-button type="primary" @click="saveAddAvatar">上传并保存</el-button>
				</span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup lang="ts" name="goods">
import {ref, reactive} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Delete, Edit, Search, Plus} from '@element-plus/icons-vue';
import {fetchData} from '../api/index';
import request from "../request";
import type {FormInstance, FormRules} from 'element-plus';
import QS from "qs";
import {formatDate} from '../date.js'
import goods from "../assets/img/2.png";
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

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
  // 商品类型
  goodsTypeId: "",
  // 渠道商ID
  chnlAgentId: "",
  // 商户ID
  merchantId: "",
  // 商品ID
  goodsId: "",
  // 起始页
  pageIndex: 1,
  // 页面大小
  pageSize: 5,
  // 总条数
  totalSize: 20
});

const pageTotal = ref(0);

// 商户信息对象
interface GoodsTypeItem {
  id: number;
  goodsTypeId: string;
  goodsTypeName: string;
  goodsTypeNumber: string;
  createTime: string;
  updateTime: string;
}

let allGoodsType = <GoodsTypeItem>({
  createTime: "",
  goodsTypeId: "",
  goodsTypeName: "所有",
  goodsTypeNumber: "",
  id: 99999,
  updateTime: ""
});
// 商户列表
const goodsTypeList = ref<GoodsTypeItem[]>([]);
const loadGoodsType = () => {
  request.post("/goodsType/query").then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code != 0) {
      // 交易失败
      ElMessage.error('加载农产品类型失败' + message);
    } else {
      // 渠道数据初始化
      goodsTypeList.value = response.data.result;
      goodsTypeList.value.push(allGoodsType);
    }
  }).catch(function (error) {
    ElMessage.error('加载农产品类型失败：系统内部错误！');
  })
}

// 商品信息对象
interface GoodsItem {
  id: number;
  goodsId: string;
  merchantId: string;
  chnlAgentId: string;
  chnlUserId: string;
  goodsName: string;
  goodsType: string;
  goodsDesc: string;
  goodsPrice: string;
  goodsImage: string;
  goodsStock: string;
  goodsStatus: string;
  createTime: string;
  updateTime: string;
  canOperate: boolean;
}



// 商户列表
const goodsList = ref<GoodsItem[]>([]);
const loadGoods = () => {
  request.post("/goods/query", QS.stringify(query)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code != 0) {
      // 交易失败
      ElMessage.error('加载农产品数据失败' + message);
    } else {
      // 渠道数据初始化
      goodsList.value = response.data.result.goodsList;
      for (const index in goodsList.value) {
        if (goodsList.value[index].chnlUserId !== userId) {
          goodsList.value[index].canOperate = true;
        }
      }
      query.totalSize = response.data.result.totalSize;
      ElMessage.success('加载农产品数据成功');
    }
  }).catch(function (error) {
    ElMessage.error('加载渠道商数据失败：系统内部错误！');
  })
}
// 查询操作
const handleSearch = () => {
  loadGoods();
};

// 分页导航
const handlePageChange = (val: number) => {
  query.pageIndex = val;
  loadGoods();
};

const initData = () => {
  // 加载商品类型
  loadGoodsType()
  // 加载商品
  loadGoods()
}

// 加载初始数据
initData();


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
  params.set("userId", userId != null ? userId : "undefine");
  request.post("/merchant/query", new URLSearchParams(params)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code != 0) {
      // 交易失败
      ElMessage.error('加载农户数据失败' + message);
    } else {
      // 渠道数据初始化
      merList.value = response.data.result.merList;
    }
  }).catch(function (error) {
    ElMessage.error('加载渠道商数据失败：系统内部错误！');
  })
}


// 新增DIV显示标识
const addVisible = ref(false);
// 表单对象
const addForm = ref<FormInstance>();
// 表单对象校验规则
const addRule: FormRules = {
  merchantId: [
    {required: true, message: '请选择农户', trigger: 'blur'}
  ],
  goodsName: [
    {required: true, message: '请输入农产品名称', trigger: 'blur'}
  ],
  goodsTypeId: [
    {required: true, message: '请选择农产品类型', trigger: 'blur'},
  ],
  goodsDesc: [
    {required: true, message: '请输入农产品描述', trigger: 'blur'},
  ],
  goodsPrice: [
    {required: true, message: '请输入农产品价格', trigger: 'blur'},
  ],
  goodsStock: [
    {required: true, message: '请输入农产品库存', trigger: 'blur'},
  ]
};
// 表单属性
let addFormParam = reactive({
  userId: userId,
  goodsId: "",
  goodsTypeId: "",
  merchantId: "",
  goodsName: "",
  goodsType: "",
  goodsDesc: "",
  goodsPrice: "",
  goodsImage: "",
  goodsStock: "",
});
// 新增按钮事件
const handleAdd = () => {
  // 加载渠道信息
  loadMer()
  // 显示新增视窗
  addFormParam.goodsImage = goodsImg.value;
  addVisible.value = true;
};

const saveAdd = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      // addFormParam.goodsImage = goodsImg.value;
      request.post("/goods/add", QS.stringify(addFormParam)).then(function (response) {
        // 返回响应码
        const code = response.data.code;
        // 返回响应描述
        const message = response.data.message;
        // 0代表交易成功
        if (code == 0) {
          addVisible.value = false;
          loadGoods();
          ElMessage.success(`新增农产品成功`);
        } else {
          // 交易失败
          ElMessage.error(`新增农产品失败：` + message);
        }
        addFormParam.goodsName = "";
        clean(addFormParam);
        addFormParam.userId = userId;
      }).catch(function (error) {
        ElMessage.error(`新增农产品失败：系统内部错误`);
        clean(addFormParam);
      })
    } else {
      ElMessage.error(`新增农产品失败：必填信息缺失`);
    }
  })
};

let editFormParam = reactive<GoodsItem>({
  id: 0,
  goodsId: '',
  merchantId: '',
  chnlAgentId: '',
  chnlUserId: '',
  goodsName: '',
  goodsType: '',
  goodsDesc: '',
  goodsPrice: '',
  goodsImage: '',
  goodsStock: '',
  goodsStatus: '',
  createTime: '',
  updateTime: '',
  canOperate: false
});



// 修改显示标识
const editVisible = ref(false);
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
  idx = index;
  editVisible.value = true;
  editFormParam = row;
  imgSrc.value = editFormParam.goodsImage;
};

const saveEdit = () => {
  editVisible.value = false;
  request.post("/goods/update", QS.stringify(editFormParam)).then(function (response) {
    // 返回响应码
    const code = response.data.code;
    // 返回响应描述
    const message = response.data.message;
    // 0代表交易成功
    if (code == 0) {
      goodsList.value[idx] = editFormParam;
      ElMessage.success(`修改农产品[${editFormParam.chnlAgentId} ]成功`);
    } else {
      // 交易失败
      ElMessage.error(`修改农产品[${editFormParam.chnlAgentId} ]失败：` + message);
    }
    clean(editFormParam);
    loadGoods();
  }).catch(function (error) {
    ElMessage.error(`修改农产品[${editFormParam.chnlAgentId} ]失败：`);
    clean(editFormParam);
  })
};

// 删除操作
const handleDelete = (index: number, row: GoodsItem) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  }).then(() => {
    request.post("/goods/delete", QS.stringify(row)).then(function (response) {
      // 返回响应码
      const code = response.data.code;
      // 返回响应描述
      const message = response.data.message;
      // 0代表交易成功
      if (code == 0) {
        loadGoods();
        ElMessage.success("删除农产品成功");
      } else {
        // 交易失败
        ElMessage.error("删除农产品失败：" + message);
      }
    }).catch(function (error) {
      ElMessage.error("删除农产品失败：系统内部错");
    })
  }).catch(() => {
  });
};


// const Image = reactive<GoodsItem>({
//   id: 0,
//   goodsId: '',
//   merchantId: '',
//   chnlAgentId: '',
//   chnlUserId: '',
//   goodsName: '',
//   goodsType: '',
//   goodsDesc: '',
//   goodsPrice: '',
//   goodsImage: '',
//   goodsStock: '',
//   goodsStatus: '',
//   createTime: '',
//   updateTime: '',
//   canOperate: false
// });

// 默认图片
const goodsImg = ref(goods);
// const dbGoods = <GoodsItem>JSON.parse(localStorage.getItem('goodsItem'));
//
// editFormParam.id = dbGoods.id;
// editFormParam.goodsId = dbGoods.goodsId;
// editFormParam.goodsImage = dbGoods.goodsImage;
// editFormParam.merchantId = dbGoods.merchantId;
// editFormParam.chnlAgentId = dbGoods.chnlAgentId;
// editFormParam.chnlUserId = dbGoods.chnlUserId;
// editFormParam.goodsName = dbGoods.goodsName;
// editFormParam.goodsType = dbGoods.goodsType;
// editFormParam.goodsDesc = dbGoods.goodsDesc
// editFormParam.goodsPrice = dbGoods.goodsPrice;
// editFormParam.goodsStock = dbGoods.goodsStock;
// editFormParam.goodsStatus = dbGoods.goodsStatus;
// editFormParam.createTime = dbGoods.createTime;
// editFormParam.updateTime = dbGoods.updateTime;
// editFormParam.canOperate = dbGoods.canOperate;
// if (dbGoods.goodsImage != null) {
//   goodsImg.value = dbGoods.goodsImage;
// }

// 图像来源
const imgSrc = ref('');
const cropImg = ref('');
const dialogVisible = ref(false);
const cropper: any = ref();

const showImglog = () => {
  dialogVisible.value = true;
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

const saveAvatar = () =>{
  goodsImg.value = cropImg.value;
  dialogVisible.value = false;
  editFormParam.goodsImage = goodsImg.value;
};


// 图像来源
const addImgSrc = ref('');
const addCropImg = ref('');
const addImageVisible = ref(false);
const addCropper: any = ref();

const showAddImglog = () => {
  addImgSrc.value = goodsImg.value;
  addImageVisible.value = true;
};

const setAddImage = (e: any) => {
  const file = e.target.files[0];
  if (!file.type.includes('image/')) {
    return;
  }
  const reader = new FileReader();
  reader.onload = (event: any) => {
    addImageVisible.value = true;
    addImgSrc.value = event.target.result;
    addCropper.value && addCropper.value.replace(event.target.result);
  };
  reader.readAsDataURL(file);
};

const addCropImage = () => {
  addCropImg.value = addCropper.value.getCroppedCanvas().toDataURL();
};

const saveAddAvatar = () =>{
  addImageVisible.value = false;
  addFormParam.goodsImage = addCropImg.value;
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

.info-image{
  overflow: hidden
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
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
