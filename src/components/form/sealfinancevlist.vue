<template>
<keep-alive>
    <div id="seallist" style="margin-top: 0px; background: #fdfdfd;">
        <header id="wx-header" class="header-menu" v-show="!searchFlag" style="overflow-x: hidden;">
            <div class="center" style="position:relative;">
                <router-link to="/app" @click="$router.push(`/app`)" tag="div" class="iconfont icon-left">
                    <span>返回</span>
                </router-link>
                <span>财务归档</span>
                <van-dropdown-menu id="header-drop-menu" class="header-drop-menu" @change="headDropMenu();" z-index="100" style="position: absolute; width: 45px; height: auto; right: -15px; top: -3px; opacity: 1; background:#1b1b1b; ">
                    <van-icon name="weapp-nav" size="1.3rem" @click="headMenuToggle" style="position: absolute; width: 40px; height: auto; right: 0px; top: 16px; opacity: 1; background:#1b1b1b;z-index:10000; " />
                    <van-icon name="search" size="1.3rem" @click="searchFlag = true;" style="position: absolute; width: 40px; height: auto; right: 42px; top: 17px; opacity: 1; background:#1b1b1b;z-index:10000;" />
                    <van-dropdown-item v-model="dropMenuValue" ref="headMenuItem" :options="dropMenuOption" @change="headDropMenu();">
                        <van-cell id="van-cell-export" class="van-cell-export" title="移交台账" icon="balance-list-o">
                            <template #title>
                                <span class="custom-title">
                                    <download-excel :data="json_data" :fields="json_fields" worksheet="移交台账" name="移交台账(合同类).xls">
                                        归档台账
                                    </download-excel>
                                </span>
                            </template>
                        </van-cell>
                    </van-dropdown-item>
                </van-dropdown-menu>
            </div>
        </header>

        <header id="wx-header" class="header-search" v-show="!!searchFlag" style="padding:0px 0px 1px 0px; border-bottom:1px solid #cecece;">
            <div>
                <van-search v-model="searchWord" show-action placeholder="请输入搜索关键词">
                    <template #action>
                        <div @click="headMenuSearch();">搜索</div>
                    </template>
                </van-search>
            </div>
        </header>

        <section>

            <div class="weui-cells" style="margin-top: 0px;">
                <div class="weui-cell weui-cell_access" id="scanCell" style="padding: 8px 10px 4px 10px;">
                    <div class="weui-cell__bd weui-cell_tab" @click="tabname = 2 ; queryTabList(2);" :style="tabname == 2 ? `border-bottom: 2px solid #fe5050;font-weight:600;` : `border-bottom: 0px solid #329ff0;` ">
                        待归档
                    </div>
                    <div class="weui-cell__bd weui-cell_tab" @click="tabname = 4 ; queryTabList(4);" :style="tabname == 4 ? `border-bottom: 2px solid #fe5050;font-weight:600;` : `border-bottom: 0px solid #329ff0;` ">
                        已归档
                    </div>
                    <div class="weui-cell__bd weui-cell_tab" @click="tabname = 3 ; queryTabList(3);" :style="tabname == 3 ? `border-bottom: 2px solid #fe5050;font-weight:600;` : `border-bottom: 0px solid #329ff0;` ">
                        已驳回
                    </div>
                </div>
            </div>

            <div class="wechat-list">
                <van-pull-refresh v-model="isLoading" @refresh="queryFresh()">
                    <van-empty v-if=" (tabname == 2 || tabname == 3 || tabname == 4) && initContractList.length == 0 " description="暂无数据" />
                    <van-address-list style="min-height:500px;" v-show="tabname == 2 && !loading && !isLoading" v-model="hContractID" :list="initContractList" default-tag-text="待归档" edit-disabled @select="selectHContract" />
                    <van-address-list style="min-height:500px;" v-show="tabname == 4 && !loading && !isLoading" v-model="hContractID" :list="initContractList" default-tag-text="已归档" edit-disabled @select="selectHContract" />
                    <van-address-list style="min-height:500px;" v-show="tabname == 3 && !loading && !isLoading" v-model="hContractID" :list="initContractList" default-tag-text="已驳回" edit-disabled @select="selectHContract" />
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
            pageName: "用印移交",
            momentNewMsg: true,
            tabname: 2,
            id: '',
            initContractList: [],
            sealContractList: [],
            receiveContractList: [],
            frontContractList: [],
            doneContractList: [],
            failContractList: [],
            hContractID: '',
            tabmap: {
                '1': 'initContractList',
                '2': 'sealContractList',
                '3': 'receiveContractList',
                '4': 'frontContractList',
                '5': 'doneContractList',
                '6': 'failContractList',
            },
            sealType: 0,
            searchWord: '',
            searchFlag: false,
            dropMenuOldValue: '',
            dropMenuValue: '',
            dropMenuOption: [
                { text: '刷新', value: 2, icon: 'replay' },
                { text: '搜索', value: 3, icon: 'search' },
                { text: '重置', value: 4, icon: 'aim' }, ],
            menuCssValue: '',
            isLoading: false,
            loading: false,
            json_fields: {
                '排序编号': 'serialid',
                '登记时间': 'create_time',
                '文件名称': 'filename',
                '用印数量': 'count',
                '用印部门': 'deal_depart',
                '经办人员': 'deal_manager',
                '合同编号': 'contract_id',
                '签收人员': 'signman',
                '审批类型': 'approve_type',
                '关联流程': 'workno',
                '用印类型': 'seal_type',
                '排序类型': 'order_type',
                '盖章人员': 'seal_man',
                '用印状态': 'status',
            },
            json_data: [],
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
        tabname() {
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
            }, 500);
        }
    },
    methods: {
        
        // 刷新页面
        async queryFresh() {
            this.queryTabList(this.tabname); //刷新相应表单
            await Betools.tools.sleep(300); //等待一下
            vant.Toast('刷新成功'); //显示刷新消息
            this.isLoading = false; //设置加载状态
        },

        // 点击显示或者隐藏菜单
        async headMenuToggle() {
            this.$refs.headMenuItem.toggle();
        },

        // 点击顶部搜索
        async headMenuSearch() {
            if (this.searchWord) {
                this.queryTabList(this.tabname); //刷新相应表单
                vant.Toast('搜索...'); //显示搜索状态
                await Betools.tools.sleep(300); //等待一下
            }
            this.searchFlag = false; //显示刷新消息
        },

        // 点击右侧菜单
        async headDropMenu(value) {
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
                    this.dropMenuValue = this.dropMenuOldValue = this.sealType = this.searchWord = '', this.searchFlag = false;
                    await this.queryFresh();
                    break;
                default:
                    console.log(`no operate. out of switch. `);
            }
        },

        // 点击Tab栏，查询Tab栏对应详情信息
        async queryTabList(tabname, page) {
            const userinfo = await Betools.storage.getStore('system_userinfo'); //获取当前用户信息
            let month = dayjs().subtract(12, 'months').format('YYYY-MM-DD');
            let sealTypeSql = '';
            let searchSql = '';
            this.currentPage = page + 1; // 设置当前页为第一页
            if (this.searchWord) { //如果存在搜索关键字
                searchSql = `~and((create_time,like,~${this.searchWord}~)~or(serialid,like,~${this.searchWord}~)~or(type,like,~${this.searchWord}~)~or(fileidlist,like,~${this.searchWord}~)~or(filenamelist,like,~${this.searchWord}~)~or(remark,like,~${this.searchWord}~)~or(status,like,~${this.searchWord}~)~or(flist,like,~${this.searchWord}~)~or(create_name,like,~${this.searchWord}~)~or(message,like,~${this.searchWord}~)~or(receive_name,like,~${this.searchWord}~))`;
            }
            const status = tabname == 2 || tabname == '2' ? '100' : (tabname == 3 || tabname == '3' ? '99':'200');
            this.initContractList = await Betools.manage.queryTableData('bs_contract_transfer_apply', `_where=(status,eq,${status})~and(create_time,gt,${month})~and(type,like,~财务移交~)~and(receive_ids,like,~${userinfo.username}~)${sealTypeSql}${searchSql}&_sort=-create_time&_p=0&_size=1000`);
            this.initContractList.map((item, index) => {
                item.name = item.filenamelist.slice(0, 16) + '...';
                item.tel = '';
                item.address = item.type + ' ' + item.create_name + ' ' + item.filenamelist.slice(0, 64) + '...' + ' 序号:' + item.serialid;
                item.isDefault = true;
            });
        },

        // 查询基础信息
        async queryInfo() {
            //获取tabname
            this.tabname = Betools.storage.getStore('system_seal_finance_vlist_tabname') || '2';
            //查询列表数据
            this.queryTabList(this.tabname, 0);
        },

        // 跳转到相应详情页面
        async selectHContract(elem) {
            const id = elem.id || this.hContractID ; 
            Betools.storage.setStore('system_seal_finance_vlist_tabname', this.tabname);
            this.$router.push(`/app/sealfinanceview?id=${id}&statustype=none&back=/app/sealfinancevlist`);
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
