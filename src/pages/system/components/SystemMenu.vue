<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu" :collapse="collapse" background-color="#324157"
      text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened :default-active="this.$route.path" router
    >
      <el-menu-item index="/index">
        <i class="el-icon-setting"></i>
        <span slot="title">系统首页</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>系统管理</span>
        </template>
        <el-submenu index="1-1">
          <template slot="title">开发平台</template>
          <el-menu-item index="/base/menu/listMenu">菜单管理</el-menu-item>
          <el-menu-item index="/base/organization/listOrganization">组织机构</el-menu-item>
          <el-menu-item index="/base/development/development">程序制作</el-menu-item>
          <el-menu-item index="/base/role/listRole">用户角色</el-menu-item>
          <el-menu-item index="/base/emp/listEmp">用户管理</el-menu-item>
        </el-submenu>
        <el-submenu index="1-2">
          <template slot="title">主数据</template>
          <el-menu-item index="/base/goods/listGoods">产品档案</el-menu-item>
          <el-menu-item index="/base/goodsType/listGoodsType">产品类型</el-menu-item>
          <el-menu-item index="/base/goodBrand/listGoodsBrand">产品品牌</el-menu-item>
          <el-menu-item index="/base/goodsUnit/listGoodsUnit">产品单位</el-menu-item>
        </el-submenu>
        <el-submenu index="1-3">
          <template slot="title">来往单位</template>
          <el-menu-item index="/base/vendor/listVendor">供应商</el-menu-item>
          <el-menu-item index="/base/customer/listCustomer">客户</el-menu-item>
        </el-submenu>
        <el-submenu index="1-4">
          <template slot="title">资源</template>
          <el-menu-item index="/base/warehouse/listWarehouse">仓库</el-menu-item>
        </el-submenu>
        <el-submenu index="1-5">
          <template slot="title">系统监控</template>
          <el-menu-item index="/base/monitor/admin">微服务监控</el-menu-item>
          <el-menu-item index="/base/monitor/registry">注册中心</el-menu-item>
          <el-menu-item index="/base/monitor/interfaceDoc">接口文档</el-menu-item>
          <el-menu-item index="/base/monitor/zipkin">链路跟踪</el-menu-item>

          <el-menu-item index="/base/monitor/basicDruid">基础服务监控</el-menu-item>

          <el-menu-item index="/base/monitor/crmDruid">进销存服务监控</el-menu-item>

        </el-submenu>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-goods"></i>
          <span>进销存</span>
        </template>
        <el-submenu index="1-1">
          <template slot="title">采购</template>
          <el-menu-item index="/crm/purchase/purchaseOrder/listPurchaseOrder">采购订单</el-menu-item>
          <el-menu-item index="/crm/purchase/purchaseApply/listPurchaseApply">采购申请</el-menu-item>
          <el-menu-item index="/crm/purchase/purchaseOrderPart/listPurchaseOrderPart">采购台账</el-menu-item>
        </el-submenu>
        <el-submenu index="1-2">
          <template slot="title">销售</template>
          <el-menu-item index="/crm/sales/salesOrder/listSalesOrder">销售订单</el-menu-item>
          <el-menu-item index="/crm/sales/salesOrderPart/listSalesOrderPart">销售台账</el-menu-item>
        </el-submenu>
        <el-submenu index="1-3">
          <template slot="title">库存</template>
          <el-menu-item index="/crm/stock/stockPart/listStockPart">库存管理</el-menu-item>
          <el-menu-item index="/crm/stock/stockTrade/listStockTrade">库存交易日志</el-menu-item>
          <el-menu-item index="/crm/stock/stockBegin/listStockBegin">库存期初</el-menu-item>
        </el-submenu>
        <el-submenu index="1-4">
          <template slot="title">仓储</template>
          <el-menu-item index="/crm/storage/outStorage/listOutStorageWork">出库作业</el-menu-item>
          <el-menu-item index="/crm/storage/inStorage/listInStorageWork">入库作业</el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import axios from 'axios'

export default {
  name: 'system-menu',
  data () {
    return {}
  },
  methods: {
    getUserMenu () {
      let param = new URLSearchParams()
      param.append('token', this.token)
      axios.post('/base/menu/getMenusByEmpOrOrganization', param).then(this.userMenuResult)
    },
    userMenuResult (res) {
      // 菜单的查询结果
    }
  },
  computed: {
    ...mapState({
      collapse: 'collapse',
      token: 'token'
    })
  },
  mounted () {
    // this.getUserMenu()
  }
}
</script>

<style scoped lang="stylus">
  .sidebar::-webkit-scrollbar {
    width: 0;
  }

  .sidebar-el-menu:not(.el-menu--collapse) {
    width: 199px;
  }

  .sidebar > ul {
    height: 100%;
  }

  .sidebar > ul > li {
    text-align left
  }
</style>
