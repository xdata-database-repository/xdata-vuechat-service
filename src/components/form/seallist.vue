<template>

<keep-alive>
  <!--首页组件-->
  <div id="seallist" style="margin-top: 0px; background: #fdfdfd;" >

    <header id="wx-header" class="header-menu" v-show="!searchFlag" style="overflow-x: hidden;" >
        <div class="center" style="position:relative;">
            <router-link to="/app" @click="$router.push(`/app`)" tag="div" class="iconfont icon-left">
                <span>返回</span>
            </router-link>
            <span>用印审批</span>
            <van-dropdown-menu id="header-drop-menu" class="header-drop-menu" @change="headDropMenu();" z-index="100" style="position: absolute; width: 55px; height: auto; right: -15px; top: -3px; opacity: 1; background:#1b1b1b; ">
              <van-icon name="weapp-nav" size="1.3rem" @click="headMenuToggle" style="position: absolute; width: 40px; height: auto; right: 0px; top: 16px; opacity: 1; background:#1b1b1b;z-index:10000; " />
              <van-icon name="search" size="1.3rem" @click="searchFlag = true;" style="position: absolute; width: 40px; height: auto; right: 42px; top: 17px; opacity: 1; background:#1b1b1b;z-index:10000;"  />
              <van-dropdown-item v-model="dropMenuValue" ref="headMenuItem" :options="dropMenuOption" @change="headDropMenu();" >
              </van-dropdown-item>
            </van-dropdown-menu>
        </div>
    </header>
    <header id="wx-header" class="header-search" v-show="!!searchFlag" style="padding:0px 0px 1px 0px; border-bottom:1px solid #cecece;">
       <div>
          <van-search
            v-model="searchWord"
            show-action
            placeholder="请输入搜索关键词"
          >
            <template #action>
              <div @click="headMenuSearch();" >搜索</div>
            </template>
          </van-search>
        </div>
    </header>

    <section>

      <div class="weui-cells" style="margin-top: 0px;">
        <div class="weui-cell weui-cell_access" id="scanCell" style="padding: 8px 10px 4px 10px;">
          <div class="weui-cell__bd weui-cell_tab" @click="tabname = 1 ; queryTabList(1);" :style="tabname == 1 ? `border-bottom: 2px solid #fe5050;font-weight:600;` : `border-bottom: 0px solid #329ff0;` ">
            待用印
          </div>
          <div class="weui-cell__bd weui-cell_tab" @click="tabname = 2 ; queryTabList(2);" :style="tabname == 2 ? `border-bottom: 2px solid #fe5050;font-weight:600;` : `border-bottom: 0px solid #329ff0;` ">
            已用印
          </div>
          <div class="weui-cell__bd weui-cell_tab" @click="tabname = 6 ; queryTabList(6);" :style="tabname == 6 ? `border-bottom: 2px solid #fe5050;font-weight:600;` : `border-bottom: 0px solid #329ff0;` ">
            已退回
          </div>
        </div>
      </div>

      <div class="wechat-list">
        <van-pull-refresh v-model="isLoading" @refresh="queryFresh(7)">
        <template v-show="tabname == 1 && !loading && !isLoading">
            <van-empty v-if="tabname == 1 && initContractList.length == 0 " description="暂无数据" />
            <van-address-list style="min-height:500px;" v-show="tabname == 1 && !loading && !isLoading" v-model="hContractID" :list="initContractList" default-tag-text="待用印" edit-disabled @select="selectHContract" />
        </template>
        <template v-show="tabname == 2 && !loading && !isLoading">
            <van-empty v-if="tabname == 2 && sealContractList.length == 0 " description="暂无数据" />
            <van-address-list style="min-height:500px;" v-show="tabname == 2 && !loading && !isLoading" v-model="hContractID" :list="sealContractList" default-tag-text="已用印" edit-disabled @select="selectHContract" />
        </template>
        <template v-show="(tabname == 6 || tabname == 0) && !loading && !isLoading">
            <van-empty v-if="(tabname == 6 || tabname == 0) && failContractList.length == 0 " description="暂无数据" />
            <van-address-list style="min-height:500px;" v-show="tabname == 6 && !loading && !isLoading" v-model="hContractID" :list="failContractList" default-tag-text="已退回" edit-disabled @select="selectHContract" />
        </template>
        </van-pull-refresh>
      </div>

      <div class="pagination-div" v-show="!loading && !isLoading && totalpages > 0" style="margin-top:10px;margin-bottom:10px;">
        <van-pagination v-model="currentPage" prev-text="<" next-text=">" @change="changePage" :items-per-page="10" :total-items="totalpages" :show-page-size="5">
          <template #prev-text>
            <van-icon name="arrow-left" />
          </template>
          <template #next-text>
            <van-icon name="arrow" />
          </template>
          <template #page="{ text }">{{ text }}</template>
        </van-pagination>
      </div>

    </section>

  </div>
</keep-alive>
</template>
<script>
const limiter = new Betools.limiter.getLimiterInstance({ tokensPerInterval: 1, interval: 15000 , fireImmediately:true });

export default {
    mixins: [window.mixin],
    data() {
        return {
            pageName: "用印审批",
            momentNewMsg: true,
            tabname: '1',
            id:'',
            initContractList:[],
            sealContractList:[],
            receiveContractList:[],
            frontContractList:[],
            doneContractList:[],
            failContractList:[],
            hContractID:'',
            tabmap: Betools.sealapply.querySealExportFields().sealApplyATypeList,
            json_fields: Betools.sealapply.querySealExportFields().json_fields,
            json_fields_common: Betools.sealapply.querySealExportFields().json_fields_common,
            json_data: [],
            json_data_common: [],
            sealType:'',
            searchWord:'',
            totalpages:5,
            searchFlag: false,
            dropMenuOldValue:'',
            dropMenuValue:'',
            dropMenuOption: [
              { text: '合同类', value: 0 , icon: 'records' },
              { text: '非合同', value: 1 , icon: 'description' },
              { text: '刷新', value: 2 , icon: 'replay' },
              { text: '搜索', value: 3 , icon: 'search' },
            ],
            menuCssValue:'',
            isLoading:false,
            loading:false,
            currentPage:1,
        }
    },
    activated() {
    },
    mounted() {
      this.queryInfo();
    },
    watch: {
      $route(to, from) {

      },
      tabname(){
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
        },500);
      }
    },
    methods: {
      
      //刷新页面
      async queryFresh(){
        this.queryTabList(this.tabname , this.currentPage - 1); //刷新相应表单
        vant.Toast('刷新成功'); //显示刷新消息
        this.isLoading = false; //设置加载状态
      },

      //点击显示或者隐藏菜单
      async headMenuToggle(){
        this.$refs.headMenuItem.toggle();
      },

      //点击顶部搜索
      async headMenuSearch(){
        this.queryTabList(this.tabname); //刷新相应表单
        vant.Toast('搜索...'); //显示搜索状态
        await Betools.storage.setStore('system_search_word_v1', this.searchWord, 100);
        this.searchFlag = false; //显示刷新消息
      },

      //点击右侧菜单
      async headDropMenu(value){
        const val = this.dropMenuValue;
        switch (val) {
          case 0: //只显示合同类信息
            this.dropMenuOldValue = this.sealType = val;
            await this.queryFresh();
            break;
          case 1: //只显示非合同类信息
            this.dropMenuOldValue = this.sealType = val;
            await this.queryFresh();
            break;
          case 2: //刷新数据
            this.dropMenuValue = this.dropMenuOldValue;
            await this.queryFresh();
            break;
          case 3: //查询数据
            this.dropMenuValue = this.dropMenuOldValue;
            this.searchFlag = true;
            break;
          default:
            console.log(`no operate. out of switch. `);
        }
      },

      //点击Tab栏
      async queryTabList(tabname , page = 0 , whereSQL = '',  resp = ''){
        const response = await Betools.sealapply.querySealApplyTabList(tabname, page, whereSQL, resp, this.searchWord , this.sealType);
        this.initContractList = response.initContractList;
        this.sealContractList = response.sealContractList;
        this.failContractList = response.failContractList;
        this.json_data = response.json_data;
        this.json_data_common = response.json_data_common;
        this.totalpages = response.resp.size;
        this.currentPage = page + 1; //设置当前页为第一页
        Betools.storage.setStore('system_seal_list_tabname' , tabname);
        this.refreshTabList();
      },

      async refreshTabList() {
        const remainingRequests = await limiter.removeTokens(1);
        if (remainingRequests >= 0) {
          await Betools.sealapply.refreshSealApplyTabList();
          console.log(`Betools.sealapply.refreshSealApplyTabList`);
        } else {
          console.log(`Block Betools.sealapply.refreshSealApplyTabList`);
        }
      },

      //查询用印列表信息
      async queryInfo(){
        const queryTabListInfo = this.queryTabList;
        this.searchWord = await Betools.storage.getStore('system_search_word_v1');
        this.tabname = (Betools.storage.getStore('system_seal_list_tabname') || '1') % 10 ; //获取tabname
        this.tabname = this.tabname >= 3 ? 6 : this.tabname <= 1 ? 1 : 2;
        const tabname = this.tabname ;
        queryTabListInfo(tabname, 0); //查询列表数据
      },

      //跳转到用印合同详情
      async selectHContract(item , value , index ){
        Betools.sealapply.redirectSealContractInfo(item , this.tabname , this.$router);
      },

      //分页查询并跳转下一页
      async changePage(){
        await this.queryTabList( this.tabname , this.currentPage - 1 );
      },
    }
}
</script>
<style>
</style>
<style scoped>
    @import "../../assets/css/explore.css";
    @import "../../assets/css/seallist.css";
</style>
