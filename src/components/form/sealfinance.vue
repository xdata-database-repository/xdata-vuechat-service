<template>
<keep-alive>
    <div id="content" style="margin-top: 0px;">
        <header id="wx-header" style="overflow-x: hidden;">
            <div class="center">
                <router-link :to="back" @click="$router.push(`/app`)" tag="div" class="iconfont icon-left">
                    <span>返回</span>
                </router-link>
                <span>{{ item.type }}</span>
            </div>
        </header>

        <section>
            <div class="weui-cells" style="margin-top:0px;">
                <div class="weui-cells" style="margin-top:0px;border-bottom:0px solid #fefefe;">
                    <van-notice-bar v-show=" title!='' && title != null && typeof title != 'undefined' " left-icon="volume-o" color="#1989fa" background="#ecf9ff" :text="title" />
                </div>
                <div class="" id="scanCell" style="padding: 8px 10px 4px 10px;">
                    <van-row>
                        <van-col span="8"></van-col>
                        <van-col span="8" style="text-align: center;font-size:1.15rem;">{{ item.type }}申请</van-col>
                        <van-col span="8"></van-col>
                    </van-row>
                </div>
            </div>

            <van-tag style="position: absolute; top: 54px; right: 0px; z-index: 1000; border-radius: 30px 0px 0px 30px;" :type="status_type"> {{ ` ${status}` }}</van-tag>

            <div class="wechat-list" style="background-color:#fefefe;margin-top:0px;border-bottom:0px solid #fefefe;">
                <div class="weui-cells" style="margin-top:0px;border-bottom:0px solid #fefefe;"> </div>
                <div class="weui-cells" style="margin-top:0px;margin-left:0px;padding-top:5px;padding-bottom:15px;border-bottom:0px solid #fefefe;">

                    <van-cell-group style="margin-top:10px;">
                        <van-cell value="基本信息" style="margin-left:0px;margin-left:-3px;font-size: 0.95rem;" />
                        <van-field v-show="item.serialid" clearable label="申请序号" v-model="item.serialid" placeholder="系统自动生成序号！" readonly />
                        <van-field required readonly clearable label="填报日期" v-model="item.createtime" placeholder="请输入登记日期" />
                        <single-select required label="申请类型" placeholder="请选择申请类型" v-model="item.type" @confirm="typeConfirm" :columns="typeColumns" :option="{ label:'name',value:'name',title:'',all: false , search: false , margin:'0px 0px' , classID:'',}" />
                        <check-select required label="归档人员" placeholder="请选择归档人员" v-model="item.receive_name" :columns="vlist" :option="{ label:'name',value:'name',title:'title',all:false, search:true, margin:'35px 3px 0px 0px' , classID:'van-field-check-select'}" @confirm="vuserConfirm" />
                        <check-select required label="移交文件" placeholder="请选择移交文件" v-model="item.filenamelist" :columns="fileColumns" :option="{ label:'name',value:'name',title:'title',all:false, search:true , search_emit:true , margin:'35px 3px 0px 0px' , classID:'van-field-check-select'}" @confirm="fileConfirm" @search="fileSearch" />
                        <van-address-list v-show="flist.length > 0" :list="flist" default-tag-text="已用印" edit-disabled @select="selectHContract" />
                    </van-cell-group>

                    <van-cell-group style="margin-top:10px;">
                        <van-cell value="移交说明" style="margin-left:0px;margin-left:-3px;font-size: 0.95rem;" />
                        <van-field required label="备注信息" v-model="item.message" rows="2" autosize clickable clearable type="textarea" maxlength="1000" placeholder="请输入移交备注说明事项！" show-word-limit />
                    </van-cell-group>

                    <van-cell-group style="margin-top:10px;" v-show="processLogList.length > 0">
                        <van-cell value="处理记录" style="margin-left:0px;margin-left:-3px;font-size: 0.95rem;" />
                        <div>
                            <van-steps direction="vertical" :active="processLogList.length - 1">
                                <template v-for="value in processLogList">
                                    <van-step :key="value.id">
                                        <h3>{{ value.action + ' ' + value.employee + ' ' + value.action_opinion }}</h3>
                                        <p>{{ value.create_time }}</p>
                                    </van-step>
                                </template>
                            </van-steps>
                        </div>
                    </van-cell-group>

                    <div v-show=" view != 'view' " id="van-finance-apply" style="margin:30px 0px 10px; border-top:0px solid #fcfcfc;">
                        <download-excel :data="flist" :fields="json_fields" worksheet="移交台账" name="移交台账.xls" style="width:42%;font-size:14px;margin-left:10px;margin:0px 0px 0px 10px; height:42px; text-align: center; border-radius:10px;color:#fefefe;float:left;background: linear-gradient(to right,#ffd01e,#ff8917);">
                            <div style="margin-top:12px;">导出</div>
                        </download-excel>
                        <van-goods-action-button type="danger" text="提交" @click="handleAgree();" style="width:42%;float:right;height:42px;font-size:14px;border-radius:10px;" />
                    </div>

                    <div v-show=" view == 'view' " id="van-finance-apply" style="margin:30px 0px 10px; border-top:0px solid #fcfcfc;">
                        <download-excel :data="flist" :fields="json_fields" worksheet="移交台账" name="移交台账.xls" style="width:94.25%;font-size:14px;margin:0px 0px 0px 12px; height:42px; text-align: center; border-radius:10px;color:#fefefe;float:left;background: linear-gradient(to right,#ffd01e,#ff8917);">
                            <div style="margin-top:12px;">导出</div>
                        </download-excel>
                    </div>

                    <van-loading v-show="loading" size="24px" vertical style="position: absolute; margin: 0px 40%; width: 20%; top: 42%;">加载中...</van-loading>
                    <div style="height:100px;"></div>
                </div>
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
            pageName: "详情",
            momentNewMsg: true,
            tabname: '1',
            active: 1,
            id: '',
            type: '',
            title: '合同资料移交申请',
            content: '',
            files: '',
            from: '',
            tname: '',
            bname: '',
            tasktype: 'done',
            previewurl: '',
            purl: '',
            tableInfo: '',
            orderInfo: '',
            status: '',
            status_type: '',
            fields: [],
            sealuserid: '',
            iswechat: false,
            agroup: [],
            back: '/app',
            hContractID: '',
            item: {
                id: '',
                createtime: dayjs().format('YYYY-MM-DD'),
                serialid: '',
                type: [],
                filename: '',
                flist: [],
                remark: '',
                message: '',
                status: 100,
                receive_name: [],
                receive_ids: [],
            },
            backPath: '/app',
            loading: false,
            hContractList: [],
            processLogList: [],
            vlist: [],
            typeColumns: [{
                    name: '档案移交',
                    code: '1',
                },
                {
                    name: '财务移交',
                    code: '2',
                },
            ],
            fileColumns: [],
            flist: [],
            view: '',
            readonly: true,
            zonename: '',
            json_fields: {
                '序号': 'serialid',
                '登记时间': 'create_time',
                '文件名称': 'filename',
                '数量': 'count',
                '经办部门': 'deal_depart',
                '经办人员': 'deal_manager',
                '用印公司': 'company',
                '合同编号': 'contract_id',
                '签收人员': 'sign_man',
                '审批类型': 'approve_type',
                '关联流程': 'workno',
                '用印类型': 'seal_type',
                '印章类型': 'seal_category',
                '排序类型': 'order_type',
                '盖章人员': 'seal_man',
                '用印状态': 'status',
                '合作方': 'partner',
                '备注信息': 'message',
            },
        }
    },
    activated() {
        this.queryInfo();
    },
    mounted() {
        this.queryInfo();
    },
    methods: {
        async selectHContract(value, index, key) {
            console.log('value:' + JSON.stringify(value));
            console.log('index:' + (index));
            await vant.Dialog.confirm({ //提示确认用印操作
                title: '温馨提示',
                message: `确认移除合同编号为${value.contract_id}的合同文件吗？`,
            });
            if (this.flist && this.flist.length > 0) {
                this.flist.splice(index, 1);
                this.item.flist = this.flist;
            }
        },
        async typeConfirm(value, index, resp) {
            console.log(value + ' ' + resp);
            const transfer_type = resp == '档案移交' ? 'archive' : 'finance';
            const userinfo = await Betools.storage.getStore('system_userinfo'); // 获取当前用户信息
            const month = dayjs().subtract(36, 'months').format('YYYY-MM-DD'); // 获取最近12个月对应的日期 ~and(${transfer_type}_status,in,0,99,100,200,300,1000)
            const clist = await Betools.manage.queryTableData('bs_seal_regist', `_where=(status,in,已用印,已领取,移交前台,档案归档,财务归档,已完成)~and(create_time,gt,${month})~and(seal_type,like,合同类)&_sort=-create_time&_p=0&_size=20`); // 获取最近12个月的已用印记录
            clist.map((item, index) => {
                item.title = item.filename.slice(0, 16);
                item.code = item.id;
                item.tel = '';
                item.name = item.seal_type == '合同类' ? item.create_by + ' ' + item.filename + ' 序号:' + item.serialid + ' 流程编号:' + item.workno + ' 合同编号:' + item.contract_id : item.create_by + ' ' + item.filename + ' 序号:' + item.serialid + ' 流程编号:' + item.workno;
                item.isDefault = true;
            });
            this.fileColumns = clist;
        },
        /** 合同文件搜索 */
        async fileSearch(data, key) {
            const transfer_type = Betools.tools.queryUrlString('transfer_type');
            const userinfo = await Betools.storage.getStore('system_userinfo'); // 获取当前用户信息
            const month = dayjs().subtract(36, 'months').format('YYYY-MM-DD'); // 获取最近12个月对应的日期 ~and(${transfer_type}_status,in,0,99,100,200,300,1000)~and
            data = await Betools.manage.queryTableData('bs_seal_regist', `_where=(status,in,已用印,已领取,移交前台,档案归档,财务归档,已完成)~and(create_time,gt,${month})~and(seal_type,like,合同类)~and((company,like,~${key}~)~or(mobile,like,~${key}~)~or(sign_man,like,~${key}~)~or(seal_category,like,~${key}~)~or(seal_man,like,~${key}~)~or(id,like,~${key}~)~or(contract_id,like,~${key}~)~or(filename,like,~${key}~)~or(create_by,like,~${key}~)~or(serialid,like,~${key}~)~or(workno,like,~${key}~))&_sort=-create_time&_p=0&_size=20`); // 获取最近12个月的已用印记录
            data.map((item, index) => {
                item.title = item.filename.slice(0, 16);
                item.code = item.id;
                item.tel = '';
                item.name = item.seal_type == '合同类' ? item.create_by + ' ' + item.filename + ' 序号:' + item.serialid + ' 流程编号:' + item.workno + ' 合同编号:' + item.contract_id : item.create_by + ' ' + item.filename + ' 序号:' + item.serialid + ' 流程编号:' + item.workno;
                item.isDefault = true;
            });
            this.fileColumns = data;
        },
        /** 确认选择合同文件 */
        async fileConfirm(data, value, index) {
            if (Betools.tools.isNull(this.flist) || !this.flist || this.flist.length == 0) {
                this.flist = this.item.flist = value;
            } else if (this.flist && this.flist.length > 0) {
                this.flist = this.item.flist = this.flist.concat(value);
            }

            this.flist = this.flist.filter((item, index) => {
                let findex = this.flist.findIndex(elem => {
                    return elem.serialid == item.serialid;
                });
                return findex == index;
            });
            this.flist.sort((a, b) => {
                return a.timestamp - b.timestamp;
            })
        },
        /** 确认选择合同文件 */
        async vuserConfirm(data, value, index) {
            console.log(this.item.receive_name);
            console.log(data, value, index);
            this.item.receive_ids = value.map(item => {
                return item.loginid
            });
        },
        /** 查询初始化信息 */
        async queryInfo() {
            try {
                console.log('seal queryinfo');
                const transferType = await Betools.tools.queryUrlString('transfer_type');
                const userinfo = await Betools.storage.getStore('system_userinfo'); // 获取当前用户信息
                const month = dayjs().subtract(36, 'months').format('YYYY-MM-DD'); // 获取最近12个月对应的日期
                this.item.type = transferType == 'archive' ? '档案移交' : transferType == 'finance' ? '财务移交' : ''; 
                this.fileColumns = await this.queryContractList('已用印,已领取,移交前台,档案归档,财务归档,已完成' , '合同类' , month , transferType , 0 , 20); // 查询待移交合同记录
                await this.queryUserList(); //查询归档人员（档案管理员）
            } catch (error) {
                console.log(error);
            }
        },
        /** 查询合同列表 */
        async queryContractList( status = '已用印,已领取,移交前台,档案归档,财务归档,已完成', type = '合同类' , month , transfer_type , page = 0 , size = 20) {
            let clist = await Betools.storage.getStore(`system_seal_finance_contract_clist`);
            if (Betools.tools.isNull(clist) || clist.length == 0) { //~and(${transfer_type}_status,in,0,99,100,200,300,1000)
                clist = await Betools.manage.queryTableData('bs_seal_regist', `_where=(status,in,${status})~and(create_time,gt,${month})~and(seal_type,like,${type})&_sort=-create_time&_p=${page}&_size=${size}`); // 获取最近12个月的已用印记录
                clist.map((item, index) => {
                    item.title = item.filename.slice(0, 16);
                    item.code = item.id;
                    item.tel = '';
                    item.name = item.seal_type == '合同类' ? item.create_by + ' ' + item.filename + ' 序号:' + item.serialid + ' 流程编号:' + item.workno + ' 合同编号:' + item.contract_id : item.create_by + ' ' + item.filename + ' 序号:' + item.serialid + ' 流程编号:' + item.workno;
                    item.isDefault = true;
                });
                Betools.storage.setStore(`system_seal_finance_contract_clist`, JSON.stringify(clist), 100);
            }
            return clist;
        },
        /** 查询归档人员列表 */
        async queryUserList() {
            let vlist = await Betools.storage.getStore(`system_seal_finance_vlist`);
            if (Betools.tools.isNull(vlist) || vlist.length == 0) {
                let userlist = await Betools.manage.queryTableData('bs_admin_group', `_where=(groupname,eq,SEAL_ARCHIVE_ADMIN)&_fields=userlist&_sort=-create_time&_p=0&_size=1000`); // 查询归档人员
                userlist = userlist.map(item => {
                    return item.userlist
                }).toString();
                vlist = await Betools.manage.queryTableData('bs_hrmresource', `_where=(loginid,in,${userlist})&_fields=id,lastname,company,loginid,mobile,textfield1&_sort=-id&_p=0&_size=1000`);
                vlist.map((item, index) => {
                    try {
                        item.code = item.id;
                        item.tel = '';
                        item.name = item.lastname;
                        item.isDefault = true;
                        item.title = item.lastname + ' ' + item.textfield1.split('||')[1];
                    } catch (error) {
                        console.log(error);
                    }
                });
                vlist = vlist.filter((item, index) => {
                    const findex = vlist.findIndex(elem => {
                        return elem.name == item.name
                    })
                    return index == findex;
                })
                Betools.storage.setStore(`system_seal_finance_vlist`, JSON.stringify(vlist), 3600);
            }
            this.vlist = vlist;
        },
        /** 处理同意/提交操作 */
        async handleAgree() {
            try {
                const id = Betools.tools.queryUniqueID();
                const userinfo = await Betools.storage.getStore('system_userinfo');
                const time = dayjs().format('YYYY-MM-DD HH:mm:ss');
                
                if (!this.flist || this.flist.length <= 0) {
                    return await vant.Dialog.confirm({ //提示确认用印操作
                        title: '温馨提示',
                        message: '请选择移交文件！',
                    });
                }
                if (!this.item.message) {
                    return await vant.Dialog.confirm({ //提示确认用印操作
                        title: '温馨提示',
                        message: '请输入备注信息！',
                    });
                }

                const fileidlist = this.flist.map(obj => {
                    return obj.id;
                }).toString();

                const filenamelist = this.flist.map(obj => {
                    return obj.filename;
                }).toString();

                const elem = {
                    id,
                    create_by: userinfo.username,
                    create_name: userinfo.realname,
                    create_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    type: this.item.type,
                    flist: this.flist && this.flist.length > 0 ? JSON.stringify(this.flist) : '',
                    fileidlist,
                    filenamelist,
                    pid: id,
                    status: 100,
                    receive_ids: this.item.receive_ids.toString(),
                    receive_name: this.item.receive_name.toString(),
                    message: this.item.message,
                };

                // 根据移交类型不同，选择不同的移交接收人员
                if (this.item.type == '财务移交') {
                    userinfo.receive_name = `zhaozy1028,${this.item.receive_ids.toString()}`;
                } else if (this.item.type == '档案移交') {
                    userinfo.receive_name = `zhaozy1028,${this.item.receive_ids.toString()}`;
                }

                const result = await Betools.manage.postTableData('bs_contract_transfer_apply', elem);
                await superagent.get(Betools.workconfig.queryAPI.autoSerialAPI.replace('bs_seal_regist', 'bs_contract_transfer_apply')).set('xid', Betools.tools.queryUniqueID()).set('accept', 'json'); //发送自动设置排序号请求

                if (result.protocol41 == true && result.affectedRows > 0) {

                    this.view = 'view';
                    const url = encodeURIComponent(`${window.BECONFIG.domain.replace('www','wechat')}/#/app/sealfinanceview?id=${elem.id}&statustype=none`);

                    for (const elem of this.flist) {
                        let node = null;
                        if (this.item.type == '财务移交') {
                            node = {
                                id: elem.id,
                                status: '移交前台',
                                finance_status: 100,
                                finance_time: time
                            };
                        } else if (this.item.type == '档案移交') {
                            node = {
                                id: elem.id,
                                status: '移交前台',
                                archive_status: 100,
                                doc_time: time
                            };
                        }
                        await Betools.manage.patchTableData(`bs_seal_regist`, elem.id, node);
                    }

                    await superagent.get(`${window.BECONFIG['restAPI']}/api/v1/weappms/${userinfo.receive_name}/亲爱的同事,您已收到合同资料移交申请，请及时处理?rurl=${url}`).set('xid', Betools.tools.queryUniqueID()).set('accept', 'json');

                    await vant.Dialog.alert({
                        title: '温馨提示',
                        message: '您的文件移交申请已经提交成功！',
                    });
                }
            } catch (error) {
                console.log(error);
            }
        },
    }
}
</script>

<style>
</style>
<style scoped>
@import "../../assets/css/explore.css";
@import "../../assets/css/sealview.css";
@import "../../assets/css/sealview.global.css";
</style>
