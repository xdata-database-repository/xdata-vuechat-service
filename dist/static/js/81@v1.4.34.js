webpackJsonp([81],{"D3P/":function(e,t,s){"use strict";var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"profile"},[s("header",{attrs:{id:"wx-header"}},[s("div",{staticClass:"center"},[s("router-link",{staticClass:"iconfont icon-left",attrs:{to:"/contact",tag:"div"}},[s("span",[e._v("联系人")])]),e._v(" "),s("span",[e._v("详细资料")])],1)]),e._v(" "),s("div",{staticClass:"weui-cells"},[s("div",{staticClass:"weui-cell"},[s("div",{staticClass:"weui-cell__hd"},[s("img",{staticClass:"self-header",staticStyle:{width:"60px"},attrs:{src:e.userinfo.avatar,alt:""}})]),e._v(" "),s("div",{staticClass:"weui-cell__bd"},[s("h4",{staticClass:"self-nickname"},[e._v(" "+e._s(e.userinfo.nickname)+" "),s("span",{staticClass:"gender",class:[1==e.userinfo.gender?"gender-male":"gender-female"]})]),e._v(" "),s("p",{staticClass:"self-wxid",staticStyle:{"font-size":"13px",color:"#999"}},[e._v("账号: "+e._s(e.userinfo.wxid))]),e._v(" "),s("p",{staticClass:"nickname",staticStyle:{"font-size":"13px",color:"#999"}},[e._v("昵称:"+e._s(e.userinfo.nickname||"无")+" - "+e._s(e.userinfo.position))])])])]),e._v(" "),e._m(0),e._v(" "),s("div",{staticClass:"weui-cells"},[s("div",{staticClass:"weui-cell"},[e._m(1),e._v(" "),s("div",{staticClass:"weui-cell__ft",staticStyle:{"-webkit-flex":"4","text-align":"left"}},e._l(e.userinfo.area,function(t){return s("span",{key:t},[e._v(e._s(t)+"   ")])}),0)]),e._v(" "),s("div",{staticClass:"weui-cell weui-cell_access"},[e._m(2),e._v(" "),s("div",{staticClass:"weui-cell__ft",staticStyle:{"-webkit-flex":"4","text-align":"left"}},[s("div",{staticClass:"album-list"},e._l(e.userinfo.album,function(e){return s("img",{key:e.imgSrc,staticStyle:{width:"50px",margin:"0 5px"},attrs:{src:e.imgSrc}})}),0)])]),e._v(" "),e._m(3)]),e._v(" "),s("a",{staticClass:"weui-btn weui-btn_primary",staticStyle:{width:"90%","margin-top":"20px"},attrs:{href:"javascript:;"},on:{click:function(t){return e.sendMessage(e.userinfo)}}},[e._v("发消息")]),e._v(" "),s("a",{staticClass:"weui-btn weui-btn_default",staticStyle:{width:"90%"},attrs:{href:"javascript:;"}},[e._v("视频")])])},a=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"weui-cells"},[s("div",{staticClass:"weui-cell weui-cell_access"},[s("div",{staticClass:"weui-cell__bd"},[s("p",[e._v("设置备注和标签")])]),e._v(" "),s("div",{staticClass:"weui-cell__ft"})])])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"weui-cell__bd"},[s("p",[e._v("地区")])])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"weui-cell__bd"},[s("p",[e._v("动态")])])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"weui-cell weui-cell_access"},[s("div",{staticClass:"weui-cell__bd"},[s("p",[e._v("更多")])]),e._v(" "),s("div",{staticClass:"weui-cell__ft"})])}],n={render:i,staticRenderFns:a};t.a=n},Mzyz:function(e,t,s){"use strict";function i(e){s("pjDh")}Object.defineProperty(t,"__esModule",{value:!0});var a=s("V2xp"),n=s("D3P/"),c=s("VU/8"),r=i,l=c(a.a,n.a,!1,r,null,null);t.default=l.exports},V2xp:function(e,t,s){"use strict";var i=s("Xxa5"),a=s.n(i),n=s("exGp"),c=s.n(n);t.a={data:function(){return{pageName:"",userinfo:{avatar:"",area:[],birthday:"",sex:0,gender:1,nickname:""}}},created:function(){var e=this;return c()(a.a.mark(function t(){return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.queryInfo();case 2:case"end":return t.stop()}},t,e)}))()},computed:{},methods:{queryInfo:function(){var e=this;return c()(a.a.mark(function t(){var s,i,n;return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return s=e.$route.query.wxid,t.next=3,Betools.contact.queryContacts();case 3:i=t.sent,n=i.find(function(e){return e.userid==s}),e.userinfo=n;case 6:case"end":return t.stop()}},t,e)}))()},sendMessage:function(e){var t=this;return c()(a.a.mark(function s(){return a.a.wrap(function(s){for(;;)switch(s.prev=s.next){case 0:t.$router.push("/wechat/dialogue?mid=1&group_num=1&mobile="+e.mobile+"&wxid="+t.$route.query.wxid+"&username="+e.name);case 1:case"end":return s.stop()}},s,t)}))()}}}},pjDh:function(e,t,s){var i=s("sak7");"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);s("rjj0")("24468638",i,!0,{})},sak7:function(e,t,s){t=e.exports=s("FZ+f")(!0),t.push([e.i,"","",{version:3,sources:[],names:[],mappings:"",file:"details.vue",sourceRoot:""}])}});