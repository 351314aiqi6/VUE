<template>
  <div class="sidebar">
    <el-menu
        class="sidebar-el-menu"
        :default-active="onRoutes"
        :collapse="sidebar.collapse"
        background-color="#324157"
        text-color="#bfcbd9"
        active-text-color="#20a0ff"
        unique-opened
        router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-sub-menu :index="item.index" :key="item.index" v-permiss="item.permiss">
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-sub-menu
                  v-if="subItem.subs"
                  :index="subItem.index"
                  :key="subItem.index"
                  v-permiss="item.permiss"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.index" v-permiss="item.permiss">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" v-permiss="item.permiss">
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {useSidebarStore} from '../store/sidebar';
import {useRoute} from 'vue-router';

const items = [
  {
    icon: 'Odometer',
    index: '/dashboard',
    title: '系统首页',
    permiss: '1',
  },
  {
    icon: 'Calendar',
    index: '1',
    title: '销售管理',
    permiss: '2',
    subs: [
      {
        index: '/table',
        title: '渠道商',
        permiss: '3',
      },
      {
        index: '/merTable',
        title: '农户管理',
        permiss: '4',
      },
      // {
      //   index: '/import',
      //   title: '商户管理',
      //   permiss: '2',
      // },
      {
        index: '/goods',
        title: '农产品管理',
        permiss: '5',
      },
      // {
      //   index: '/export',
      //   title: '商品管理',
      //   permiss: '2',
      // },
    ],
  },

  {
    icon: 'Edit',
    index: '3',
    title: '采购管理',
    permiss: '6',
    subs: [
      {
        index: '/purchase',
        title: '采购申请',
        permiss: '7',
      },
      {
        index: '/purchaseList',
        title: '采购处理',
        permiss: '8',
      },
      // {
      //   index: '/form',
      //   title: '基本表单',
      //   permiss: '5',
      // },
      // {
      //   index: '/upload',
      //   title: '文件上传',
      //   permiss: '6',
      // },
      // {
      //   index: '4',
      //   title: '三级菜单',
      //   permiss: '7',
      //   subs: [
      //     {
      //       index: '/editor',
      //       title: '富文本编辑器',
      //       permiss: '8',
      //     },
      //     {
      //       index: '/markdown',
      //       title: 'markdown编辑器',
      //       permiss: '9',
      //     },
      //   ],
      // },
    ],
  },
  {
    icon: 'VideoCameraFilled',
    index: '4',
    title: '直播管理',
    permiss: '9',
    subs: [
      {
        index: '/performKol',
        title: '主播信息',
        permiss: '10',
      },
      {
        index: '/performList',
        title: '直播广场',
        permiss: '11',
      },
      {
        index: '/myPerform',
        title: '我的直播',
        permiss: '12',
      },
    ],
  },
  {
    icon: 'DocumentCopy',
    index: '2',
    title: '服务评价',
    permiss: '13',
    subs: [
      {
        index: '/message',
        title: '信件发送',
        permiss: '14',
      },
      {
        index: '/messageList',
        title: '信件邮箱',
        permiss: '15',
      },
    ],
  },

  // {
  //   icon: 'Setting',
  //   index: '/icon',
  //   title: '自定义图标',
  //   permiss: '10',
  // },
  {
    icon: 'PieChart',
    index: '/charts',
    title: '行情管理',
    permiss: '16',
  },
  {
    icon: 'Warning',
    index: '/permission',
    title: '权限管理',
    permiss: '17',
  },
  // {
  //   icon: 'CoffeeCup',
  //   index: '/donate',
  //   title: '支持作者',
  //   permiss: '14',
  // },
];

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}
</style>
