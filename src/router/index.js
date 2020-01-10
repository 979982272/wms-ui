import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: '登录页面',
      component: Login
    },
    {
      path: '/',
      component: resolve => require(['@/pages/system/System'], resolve),
      meta: {
        title: '主框架'
      },
      children: [
        {
          path: '/index',
          name: '系统首页',
          component: resolve => require(['@/pages/index'], resolve)
        },
        {
          path: '/base/menu/listMenu',
          name: '菜单管理',
          component: resolve => require(['@/pages/base/menu/listMenu'], resolve),
          children: [
            {
              path: '/base/menu/editMenu',
              name: '编辑菜单',
              component: resolve => require(['@/pages/base/menu/editMenu'], resolve)
            }
          ]
        },
        {
          path: '/base/organization/listOrganization',
          name: '组织机构',
          component: resolve => require(['@/pages/base/organization/listOrganization'], resolve)
        },
        {
          path: '/base/organization/editOrganization',
          name: '编辑组织机构',
          component: resolve => require(['@/pages/base/organization/editOrganization'], resolve)
        },
        {
          path: '/base/development/development',
          name: '程序制作',
          component: resolve => require(['@/pages/base/development/development'], resolve),
          children: [
            {
              path: '/base/development/entityDevelopment',
              name: '实体类开发',
              component: resolve => require(['@/pages/base/development/entityDevelopment'], resolve)
            },
            {
              path: '/base/development/listDevelopment',
              name: '表格开发',
              component: resolve => require(['@/pages/base/development/listDevelopment'], resolve)
            },
            {
              path: '/base/development/formDevelopment',
              name: '表单开发',
              component: resolve => require(['@/pages/base/development/formDevelopment'], resolve)
            }
          ]
        },
        {
          path: '/base/role/listRole',
          name: '用户角色',
          component: resolve => require(['@/pages/base/role/listRole'], resolve),
          children: [
            {
              path: '/base/role/editRole',
              name: '编辑用户角色',
              component: resolve => require(['@/pages/base/role/editRole'], resolve)
            }
          ]
        },
        {
          path: '/base/emp/listEmp',
          name: '用户管理',
          component: resolve => require(['@/pages/base/emp/listEmp'], resolve)
        },
        {
          path: '/base/emp/editEmp',
          name: '编辑用户',
          component: resolve => require(['@/pages/base/emp/editEmp'], resolve)
        },
        {
          path: '/base/goods/listGoods',
          name: '产品档案',
          component: resolve => require(['@/pages/base/goods/listGoods'], resolve)
        },
        {
          path: '/base/goods/editGoods',
          name: '编辑产品档案',
          component: resolve => require(['@/pages/base/goods/editGoods'], resolve)
        },
        {
          path: '/base/goodBrand/listGoodsBrand',
          name: '产品品牌',
          component: resolve => require(['@/pages/base/goodBrand/listGoodsBrand'], resolve),
          children: [
            {
              path: '/base/goodBrand/editGoodsBrand',
              name: '编辑产品品牌',
              component: resolve => require(['@/pages/base/goodBrand/editGoodsBrand'], resolve)
            }
          ]
        },
        {
          path: '/base/goodsUnit/listGoodsUnit',
          name: '产品单位',
          component: resolve => require(['@/pages/base/goodsUnit/listGoodsUnit'], resolve),
          children: [
            {
              path: '/base/goodsUnit/editGoodsUnit',
              name: '编辑产品单位',
              component: resolve => require(['@/pages/base/goodsUnit/editGoodsUnit'], resolve)
            }
          ]
        },
        {
          path: '/base/goodsType/listGoodsType',
          name: '产品类型',
          component: resolve => require(['@/pages/base/goodsType/listGoodsType'], resolve),
          children: [
            {
              path: '/base/goodsType/editGoodsType',
              name: '编辑产品类型',
              component: resolve => require(['@/pages/base/goodsType/editGoodsType'], resolve)
            }
          ]
        },
        {
          path: '/base/vendor/listVendor',
          name: '供应商',
          component: resolve => require(['@/pages/base/vendor/listVendor'], resolve)
        },
        {
          path: '/base/vendor/editVendor',
          name: '编辑供应商',
          component: resolve => require(['@/pages/base/vendor/editVendor'], resolve),
          children: [
            {
              path: '/base/emp/selectEmp',
              name: '选择负责人',
              component: resolve => require(['@/pages/base/emp/selectEmp'], resolve)
            }
          ]
        },
        {
          path: '/base/customer/listCustomer',
          name: '客户',
          component: resolve => require(['@/pages/base/customer/listCustomer'], resolve)
        },
        {
          path: '/base/customer/editCustomer',
          name: '编辑客户',
          component: resolve => require(['@/pages/base/customer/editCustomer'], resolve)
        },
        {
          path: '/base/warehouse/listWarehouse',
          name: '仓库',
          component: resolve => require(['@/pages/base/warehouse/listWarehouse'], resolve)
        },
        {
          path: '/base/warehouse/editWarehouse',
          name: '编辑仓库',
          component: resolve => require(['@/pages/base/warehouse/editWarehouse'], resolve)
        },
        {
          path: '/base/monitor/registry',
          name: '注册中心',
          component: resolve => require(['@/pages/base/monitor/registry'], resolve)
        },
        {
          path: '/crm/purchase/purchaseOrder/listPurchaseOrder',
          name: '采购订单',
          component: resolve => require(['@/pages/crm/purchase/purchaseOrder/listPurchaseOrder'], resolve)
        },
        {
          path: '/crm/purchase/purchaseOrder/editPurchaseorder',
          name: '编辑采购订单',
          component: resolve => require(['@/pages/crm/purchase/purchaseOrder/editPurchaseOrder'], resolve)
        },
        {
          path: '/crm/purchase/purchaseApply/listPurchaseApply',
          name: '采购申请',
          component: resolve => require(['@/pages/crm/purchase/purchaseApply/listPurchaseApply'], resolve)
        },
        {
          path: '/crm/purchase/purchaseApply/editPurchaseapply',
          name: '编辑采购申请',
          component: resolve => require(['@/pages/crm/purchase/purchaseApply/editPurchaseApply'], resolve)
        },
        {
          path: '/crm/purchase/purchaseApply/pushPurchaseOrder',
          name: '下推采购订单',
          component: resolve => require(['@/pages/crm/purchase/purchaseApply/pushPurchaseOrder'], resolve)
        },
        {
          path: '/crm/purchase/purchaseOrderPart/listPurchaseOrderPart',
          name: '采购台账',
          component: resolve => require(['@/pages/crm/purchase/purchaseOrderPart/listPurchaseOrderPart'], resolve)
        },
        {
          path: '/crm/stock/stockPart/listStockPart',
          name: '库存管理',
          component: resolve => require(['@/pages/crm/stock/stockPart/listStockPart'], resolve)
        },
        {
          path: '/crm/stock/stockTrade/listStockTrade',
          name: '库存交易日志',
          component: resolve => require(['@/pages/crm/stock/stockTrade/listStockTrade'], resolve)
        },
        {
          path: '/crm/sales/salesOrderPart/listSalesOrderPart',
          name: '销售台账',
          component: resolve => require(['@/pages/crm/sales/salesOrderPart/listSalesOrderPart'], resolve)
        },
        {
          path: '/crm/sales/salesOrder/listSalesOrder',
          name: '销售订单',
          component: resolve => require(['@/pages/crm/sales/salesOrder/listSalesOrder'], resolve)
        },
        {
          path: '/crm/sales/salesOrder/editSalesOrder',
          name: '编辑销售订单',
          component: resolve => require(['@/pages/crm/sales/salesOrder/editSalesOrder'], resolve)
        },
        {
          path: '/crm/stock/stockBegin/listStockBegin',
          name: '库存期初',
          component: resolve => require(['@/pages/crm/stock/stockBegin/listStockBegin'], resolve)
        },
        {
          path: '/crm/stock/stockBegin/editStockBegin',
          name: '编辑库存期初',
          component: resolve => require(['@/pages/crm/stock/stockBegin/editStockBegin'], resolve)
        },
        {
          path: '/crm/storage/outStorage/listOutStorageWork',
          name: '出库作业',
          component: resolve => require(['@/pages/crm/storage/outStorage/listOutStorageWork'], resolve)
        },
        {
          path: '/crm/storage/outStorage/editOutStorageWork',
          name: '编辑出库作业',
          component: resolve => require(['@/pages/crm/storage/outStorage/editOutStorageWork'], resolve)
        },
        {
          path: '/crm/storage/inStorage/listInStorageWork',
          name: '入库作业',
          component: resolve => require(['@/pages/crm/storage/inStorage/listInStorageWork'], resolve)
        },
        {
          path: '/crm/storage/inStorage/editInStorageWork',
          name: '编辑入库作业',
          component: resolve => require(['@/pages/crm/storage/inStorage/editInStorageWork'], resolve)
        },
        {
          path: '/base/monitor/interfaceDoc',
          name: '接口文档',
          component: resolve => require(['@/pages/base/monitor/interfaceDoc'], resolve)
        },
        {
          path: '/base/monitor/zipkin',
          name: '链路跟踪',
          component: resolve => require(['@/pages/base/monitor/zipkin'], resolve)
        },
        {
          path: '/base/monitor/admin',
          name: '微服务监控',
          component: resolve => require(['@/pages/base/monitor/admin'], resolve)
        },
        {
          path: '/base/monitor/basicDruid',
          name: '基础服务监控',
          component: resolve => require(['@/pages/base/monitor/basicDruid'], resolve)
        },
        {
          path: '/base/monitor/crmDruid',
          name: '进销存服务监控',
          component: resolve => require(['@/pages/base/monitor/crmDruid'], resolve)
        }
      ]
    }
  ]
})
