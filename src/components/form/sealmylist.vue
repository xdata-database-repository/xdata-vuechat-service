<template>

<keep-alive>
  <!--首页组件-->
  <div id="seallist" style="margin-top: 0px; background: #fdfdfd;" >

    <header id="wx-header" class="header-menu" v-show="!searchFlag" style="overflow-x: hidden;" >
        <div class="center" style="position:relative;">
            <router-link to="/app" @click="$router.push(`/app`)" tag="div" class="iconfont icon-left">
                <span>返回</span>
            </router-link>
            <span>用印历史</span>
            <van-dropdown-menu id="header-drop-menu" class="header-drop-menu" @change="headDropMenu();" z-index="100" style="position: absolute; width: 45px; height: auto; right: -15px; top: -3px; opacity: 1; background:#1b1b1b; ">
              <van-icon name="weapp-nav" size="1.3rem" @click="headMenuToggle" style="position: absolute; width: 40px; height: auto; right: 0px; top: 16px; opacity: 1; background:#1b1b1b;z-index:10000; " />
              <van-icon name="search" size="1.3rem" @click="searchFlag = true;" style="position: absolute; width: 40px; height: auto; right: 42px; top: 17px; opacity: 1; background:#1b1b1b;z-index:10000;"  />
              <van-dropdown-item v-model="dropMenuValue" ref="headMenuItem" :options="dropMenuOption" @change="headDropMenu();" />
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
          <div class="weui-cell__bd weui-cell_tab" @click="tabname = 7 ; queryTabList(7);" :style="tabname == 7 ? `border-bottom: 2px solid #fe5050;font-weight:600;` : `border-bottom: 0px solid #329ff0;` ">
            已作废
          </div>
        </div>
      </div>

      <div class="wechat-list">
        <van-pull-refresh v-model="isLoading" @refresh="queryFresh(7)">
        <template v-show="tabname == 1 && !loading && !isLoading">
            <van-empty v-if="tabname == 1 && initContractList.length == 0 " description="暂无数据" />
            <van-address-list style="min-height:500px;" v-show="tabname == 1 && !loading && !isLoading" v-model="hContractID" :list="initContractList" default-tag-text="待用印" edit-disabled @select="selectHContract()" />
        </template>
        <template v-show="tabname == 2 && !loading && !isLoading">
            <van-empty v-if="tabname == 2 && sealContractList.length == 0 " description="暂无数据" />
            <van-address-list style="min-height:500px;" v-show="tabname == 2 && !loading && !isLoading" v-model="hContractID" :list="sealContractList" default-tag-text="已用印" edit-disabled @select="selectHContract()" />
        </template>
        <template v-show="tabname == 6 && !loading && !isLoading">
            <van-empty v-if="tabname == 6 && failContractList.length == 0 " description="暂无数据" />
            <van-address-list style="min-height:500px;" v-show="tabname == 6 && !loading && !isLoading" v-model="hContractID" :list="failContractList" default-tag-text="已退回" edit-disabled @select="selectHContract()" />
        </template>
        <template v-show="tabname == 7 && !loading && !isLoading">
            <van-empty v-if="tabname == 7 && endContractList.length == 0 " description="暂无数据" />
            <van-address-list style="min-height:500px;" v-show="tabname == 7 && !loading && !isLoading" v-model="hContractID" :list="endContractList" default-tag-text="已作废" edit-disabled @select="selectHContract()" />
        </template>
        </van-pull-refresh>
      </div>

    </section>

  </div>
</keep-alive>

</template>

<script>

export default {
    mixins: [window.mixin],
    data() {
        return {
            pageName: "用印历史",
            momentNewMsg: true,
            tabname: '1',
            id:'',
            initContractList:[],
            sealContractList:[],
            receiveContractList:[],
            frontContractList:[],
            doneContractList:[],
            failContractList:[],
            endContractList:[],
            hContractID:'',
            tabmap:{
              '1': 'initContractList',
              '2': 'sealContractList',
              '3': 'receiveContractList',
              '4': 'frontContractList',
              '5': 'doneContractList',
              '6': 'failContractList',
              '7': 'endContractList',
            },
            sealType:'',
            searchWord:'',
            searchFlag: false,
            dropMenuOldValue:'',
            dropMenuValue:'',
            dropMenuOption: [
              { text: '刷新', value: 2 , icon: 'replay' },
              { text: '搜索', value: 3 , icon: 'search' },
              { text: '重置', value: 4 , icon: 'aim' },
            ],
            menuCssValue:'',
            isLoading:false,
            loading:false,
        }
    },
    activated() {
        this.queryInfo();
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
      // 查询用户信息 
      async userStatus(){
        try {
          const userinfo = await Betools.storage.getStore('system_userinfo');
          console.log(`userinfo:`, userinfo);
        } catch (error) {
          console.log(error);
        }
      },

      // 刷新页面
      async queryFresh(){
        this.queryTabList(this.tabname); //刷新相应表单
        await Betools.tools.sleep(300); //等待一下
        vant.Toast('刷新成功'); //显示刷新消息
        this.isLoading = false; //设置加载状态
      },

      // 点击显示或者隐藏菜单
      async headMenuToggle(){
        this.$refs.headMenuItem.toggle();
      },

      // 点击顶部搜索
      async headMenuSearch(){
        if(this.searchWord){
          this.queryTabList(this.tabname); //刷新相应表单
          vant.Toast('搜索...'); //显示搜索状态
          await Betools.tools.sleep(300); //等待一下
        }
        this.searchFlag = false; //显示刷新消息
      },

      // 点击右侧菜单
      async headDropMenu(value){
        const val = this.dropMenuValue;
        switch (val) {
          case 2: //刷新数据
            this.dropMenuValue = this.dropMenuOldValue;
            await this.queryFresh();
            break;
          case 3: //查询数据
            this.dropMenuValue = this.dropMenuOldValue;
            this.searchFlag = true;
            break;
          case 4: //重置数据
            this.dropMenuValue = this.dropMenuOldValue = this.sealType = this.searchWord = '';
            this.searchFlag = false;
            await this.queryFresh();
            break;
          default:
            console.log(`no operate. out of switch. `);
        }
      },

      // 点击Tab栏，查询Tab栏对应列表信息
      async queryTabList(tabname, tableName = 'bs_seal_regist'){
        const userinfo = await Betools.storage.getStore('system_userinfo');  // 获取用户信息
        let sealTypeSql = '';
        let searchSql = '';
        if(this.sealType === 0) {
          sealTypeSql = `~and(seal_type,like,合同类)`;
        } else if(this.sealType === 1) {
          sealTypeSql = `~and(seal_type,like,非合同类)`;
        }
        (this.searchWord) ? searchSql = `~and((filename,like,~${this.searchWord}~)~or(serialid,like,~${this.searchWord}~)~or(create_by,like,~${this.searchWord}~)~or(workno,like,~${this.searchWord}~)~or(contract_id,like,~${this.searchWord}~)~or(seal_man,like,~${this.searchWord}~)~or(sign_man,like,~${this.searchWord}~)~or(front_name,like,~${this.searchWord}~)~or(archive_name,like,~${this.searchWord}~)~or(mobile,like,~${this.searchWord}~)~or(deal_depart,like,~${this.searchWord}~)~or(approve_type,like,~${this.searchWord}~))` : null; //如果存在搜索关键字        
        if(tabname == 1){
          this.initContractList = await this.handleList(tableName , '待用印', userinfo, sealTypeSql, searchSql);
        } else if(tabname == 2){
          this.sealContractList = await this.handleList(tableName , '已用印,已领取,移交前台,财务归档,档案归档,已完成', userinfo, sealTypeSql, searchSql);
        } else if(tabname == 6){
          this.failContractList = await this.handleList(tableName , '已退回', userinfo, sealTypeSql, searchSql);
        } else if(tabname == 7){
          this.endContractList = await this.handleList(tableName , '已作废,已测试', userinfo, sealTypeSql, searchSql);
        }
      },

      // 查询用印记录数据
      async handleList(tableName = 'bs_seal_regist', status = '待用印', userinfo, sealTypeSql = '' , searchSql = ''){
          const username = userinfo && userinfo.realname ? userinfo.realname.replace(/\(|\)/g,'_') : '' ;
          const list = await Betools.manage.queryTableData(tableName , `_where=(status,in,${status})~and(create_by,like,${username})${sealTypeSql}${searchSql}&_sort=-create_time&_p=0&_size=1000`);
          list.map((item , index) => {
            item.name = item.filename.slice(0,16) ,
            item.tel = '';
            item.address = item.seal_type == '合同类' ? item.create_by + ' ' + item.filename + ' 序号:' + item.serialid + ' 流程编号:' + item.workno + ' 合同编号:'+ item.contract_id : item.create_by + ' ' + item.filename + ' 序号:' + item.serialid + ' 流程编号:' + item.workno ;
            item.isDefault = true;
          });
          return list;
      },

      // 查询基础信息
      async queryInfo(tableName = 'bs_seal_regist'){
        const userinfo = await Betools.storage.getStore('system_userinfo'); //获取用户信息
        this.tabname = Betools.storage.getStore('system_seal_mylist_tabname') || '1'; //获取tabname
        const month = dayjs().subtract(12, 'months').format('YYYY-MM-DD'); //获取最近N个月对应的日期
        this.initContractList = await this.handleList(tableName, '待用印', userinfo); //获取最近N个月的待用印记录
        this.sealContractList = await this.handleList(tableName, '已用印,已领取,移交前台,财务归档,档案归档,已完成', userinfo); //获取最近N个月的已用印记录
        this.failContractList = await this.handleList(tableName , '已退回', userinfo); //获取最近N个月的已归档记录
        this.endContractList = await this.handleList(tableName , '已作废,已测试', userinfo); //获取最近N个月的已作废记录
      },

      //跳转用印界面详情
      async selectHContract(){
        await Betools.tools.sleep(0); //等待N毫秒
        const id = this.hContractID;  //查询当前用印信息
        const list = this[this.tabmap[this.tabname]];
        const item = list.find((item,index) => {return id == item.id});

        //根据当前状态，跳转到不同页面
        if(this.tabname == '1'){
          Betools.storage.setStore('system_seal_mylist_tabname' , this.tabname);
          this.$router.push(`/app/sealview?id=${id}&statustype=none&type=finish&view=view&back=sealmylist`); //跳转到相应的用印界面
        } else if(this.tabname == '2' && item.seal_type == '非合同类'){
          Betools.storage.setStore('system_seal_mylist_tabname' , this.tabname);
          this.$router.push(`/app/sealreceive?id=${id}&statustype=none&type=receive&view=view&back=sealmylist`); //跳转到相应的用印界面
        } else if(this.tabname == '2' || this.tabname == '3'){
          Betools.storage.setStore('system_seal_mylist_tabname' , this.tabname);
          this.$router.push(`/app/sealview?id=${id}&statustype=none&type=finish&view=view&back=sealmylist`); //跳转到相应的用印界面
        } else if(this.tabname == '6' ){
          Betools.storage.setStore('system_seal_mylist_tabname' , this.tabname);
          this.$router.push(`/app/sealedit?id=${id}&statustype=none&type=done&res=edit&view=edit&back=sealmylist`); //跳转到相应的用印界面
        } else if(this.tabname == '7' ){
          Betools.storage.setStore('system_seal_mylist_tabname' , this.tabname);
          this.$router.push(`/app/sealview?id=${id}&statustype=none&type=finish&view=view&back=sealmylist`);  //跳转到相应的用印界面
        }
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
