import { createRouter, createWebHashHistory } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';
const routes = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
            },
            {
                path: '/table',
                name: 'basetable',
                meta: {
                    title: '渠道商',
                    permiss: '3',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/table.vue'),
            },
            {
                path: '/merTable',
                name: 'merTable',
                meta: {
                    title: '农户管理',
                    permiss: '4',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/merTable.vue'),
            },
            {
                path: '/goods',
                name: 'goods',
                meta: {
                    title: '农产品管理',
                    permiss: '5',
                },
                component: () => import(/* webpackChunkName: "table" */ '../views/goods.vue'),
            },
            {
                path: '/charts',
                name: 'basecharts',
                meta: {
                    title: '行情管理',
                    permiss: '16',
                },
                component: () => import(/* webpackChunkName: "charts" */ '../views/charts.vue'),
            },
            {
                path: '/purchase',
                name: 'purchase',
                meta: {
                    title: '采购申请',
                    permiss: '7',
                },
                component: () => import(/* webpackChunkName: "form" */ '../views/purchase.vue'),
            },
            {
                path: '/purchaseList',
                name: 'purchaseList',
                meta: {
                    title: '采购处理',
                    permiss: '8',
                },
                component: () => import(/* webpackChunkName: "form" */ '../views/purchaseList.vue'),
            },
            {
                path: '/messageList',
                name: 'messageList',
                meta: {
                    title: '信件邮箱',
                    permiss: '15',
                },
                component: () => import(/* webpackChunkName: "form" */ '../views/messageList.vue'),
            },
            {
                path: '/message',
                name: 'message',
                meta: {
                    title: '信件发送',
                    permiss: '14',
                },
                component: () => import(/* webpackChunkName: "form" */ '../views/message.vue'),
            },
            {
                path: '/performKol',
                name: 'performKol',
                meta: {
                    title: '主播信息',
                    permiss: '10',
                },
                component: () => import(/* webpackChunkName: "form" */ '../views/peformKol.vue'),
            },
            {
                path: '/performList',
                name: 'performList',
                meta: {
                    title: '直播广场',
                    permiss: '11',
                },
                component: () => import(/* webpackChunkName: "form" */ '../views/performList.vue'),
            },
            {
                path: '/myPerform',
                name: 'myPerform',
                meta: {
                    title: '我的直播',
                    permiss: '12',
                },
                component: () => import(/* webpackChunkName: "form" */ '../views/myPerform.vue'),
            },
            // {
            //     path: '/form',
            //     name: 'baseform',
            //     meta: {
            //         title: '表单',
            //         permiss: '5',
            //     },
            //     component: () => import(/* webpackChunkName: "form" */ '../views/form.vue'),
            // },
            // {
            //     path: '/tabs',
            //     name: 'tabs',
            //     meta: {
            //         title: 'tab标签',
            //         permiss: '3',
            //     },
            //     component: () => import(/* webpackChunkName: "tabs" */ '../views/tabs.vue'),
            // },
            // {
            //     path: '/donate',
            //     name: 'donate',
            //     meta: {
            //         title: '鼓励作者',
            //         permiss: '14',
            //     },
            //     component: () => import(/* webpackChunkName: "donate" */ '../views/donate.vue'),
            // },
            {
                path: '/permission',
                name: 'permission',
                meta: {
                    title: '权限管理',
                    permiss: '17',
                },
                component: () => import(/* webpackChunkName: "permission" */ '../views/permission.vue'),
            },
            // {
            //     path: '/upload',
            //     name: 'upload',
            //     meta: {
            //         title: '上传插件',
            //         permiss: '6',
            //     },
            //     component: () => import(/* webpackChunkName: "upload" */ '../views/upload.vue'),
            // },
            // {
            //     path: '/icon',
            //     name: 'icon',
            //     meta: {
            //         title: '自定义图标',
            //         permiss: '10',
            //     },
            //     component: () => import(/* webpackChunkName: "icon" */ '../views/icon.vue'),
            // },
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心',
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/user.vue'),
            },
            // {
            //     path: '/editor',
            //     name: 'editor',
            //     meta: {
            //         title: '富文本编辑器',
            //         permiss: '8',
            //     },
            //     component: () => import(/* webpackChunkName: "editor" */ '../views/editor.vue'),
            // },
            // {
            //     path: '/markdown',
            //     name: 'markdown',
            //     meta: {
            //         title: 'markdown编辑器',
            //         permiss: '9',
            //     },
            //     component: () => import(/* webpackChunkName: "markdown" */ '../views/markdown.vue'),
            // },
            // {
            //     path: '/export',
            //     name: 'export',
            //     meta: {
            //         title: '导出Excel',
            //         permiss: '2',
            //     },
            //     component: () => import(/* webpackChunkName: "export" */ '../views/export.vue'),
            // },
            // {
            //     path: '/import',
            //     name: 'import',
            //     meta: {
            //         title: '导入Excel',
            //         permiss: '2',
            //     },
            //     component: () => import(/* webpackChunkName: "import" */ '../views/import.vue'),
            // },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    const permiss = usePermissStore();
    if (!role && to.path !== '/login') {
        next('/login');
    }
    else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
        // 如果没有权限，则进入403
        next('/403');
    }
    else {
        next();
    }
});
export default router;
//# sourceMappingURL=index.js.map