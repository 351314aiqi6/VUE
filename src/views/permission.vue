<template>
	<div class="container">
		<div class="plugins-tips"></div>
		<div class="mgb20">
			<span class="label">角色：</span>
			<el-select v-model="role" @change="handleChange">
				<el-option label="超级管理员" value="admin"></el-option>
				<el-option label="普通用户" value="user"></el-option>
			</el-select>
		</div>
		<div class="mgb20 tree-wrapper">
			<el-tree
				ref="tree"
				:data="data"
        node-key="id"
				default-expand-all
				show-checkbox
				:default-checked-keys="checkedKeys"
			/>
		</div>
		<el-button type="primary" @click="onSubmit">保存权限</el-button>
	</div>
</template>

<script setup lang="ts" name="permission">
import { ref } from 'vue';
import {ElMessage, ElTree} from 'element-plus';
import { usePermissStore } from '../store/permiss';
import request from "../request";
import QS from "qs";

const role = ref<string>('admin');

interface Tree {
	id: string;
	label: string;
	children?: Tree[];
}

const data: Tree[] = [
	{
		id: '1',
		label: '系统首页'
	},
	{
		id: '2',
		label: '销售管理',
		children: [
			{
				id: '3',
				label: '渠道商'
			},
			{
				id: '4',
				label: '农户管理'
			},
      {
        id:'5',
        label: '农产品管理'
      },
		]
	},
  {
    id: '6',
    label: '采购管理',
    children: [
      {
        id: '7',
        label: '采购申请'
      },
      {
        id: '8',
        label: '采购处理'
      },
    ]
  },
	{
		id: '9',
		label: '直播管理',
		children: [
			{
				id: '10',
				label: '主播信息'
			},
			{
				id: '11',
				label: '直播广场'
			},
      {
        id:'12',
        label:'我的直播'
      },
		]
	},
  {
    id: '13',
    label: '邮箱管理',
    children: [
      {
        id: '14',
        label: '信件发送'
      },
      {
        id: '15',
        label: '信件邮箱'
      },
    ]
  },
	{
		id: '16',
		label: '行情管理'
	},
	{
		id: '17',
		label: '权限管理'
	},
];


const permiss = usePermissStore();

// 获取当前权限
const checkedKeys = ref<string[]>([]);
const getPremission = () => {
	// 请求接口返回权限
	checkedKeys.value = permiss.defaultList[role.value];
};
getPremission();

// 保存权限
const tree = ref<InstanceType<typeof ElTree>>();
const onSubmit = () => {
	// 获取选中的权限
	console.log(tree.value!.getCheckedKeys(false));
};

const handleChange = (val: string[]) => {
	tree.value!.setCheckedKeys(permiss.defaultList[role.value]);
};

</script>

<style scoped>
.tree-wrapper {
	max-width: 500px;
}
.label {
	font-size: 14px;
}
</style>
