webpackJsonp([74],{"0UDB":function(e,t,o){"use strict";function n(e){o("r7G/")}Object.defineProperty(t,"__esModule",{value:!0});var a=o("X3CU"),s=o("1K9P"),i=o("VU/8"),r=n,l=i(a.a,s.a,!1,r,"data-v-ec931764",null);t.default=l.exports},"1K9P":function(e,t,o){"use strict";var n=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[o("div",{staticStyle:{width:"calc(100% - 0px)",height:"calc(100vh - 0px)"}},[o("SeeksRelationGraph",{ref:"seeksRelationGraph",attrs:{options:e.userGraphOptions}})],1)])},a=[],s={render:n,staticRenderFns:a};t.a=s},X3CU:function(e,t,o){"use strict";var n=o("Xxa5"),a=o.n(n),s=o("exGp"),i=o.n(s);t.a={name:"SeeksRelationGraphDemo",data:function(){return{g_loading:!0,userGraphOptions:{backgrounImage:"",backgrounImageNoRepeat:!0,layouts:[{label:"手工",layoutName:"fixed",layoutClassName:"seeks-layout-fixed",defaultJunctionPoint:"border",defaultNodeShape:0,defaultLineShape:2,allowSwitchLineShape:!0,allowSwitchJunctionPoint:!0,useLayoutStyleOptions:!1,max_per_width:"150",min_per_height:"250"}],defaultNodeBorderWidth:0,defaultNodeShape:1,allowShowMiniNameFilter:!1,allowShowMiniToolBar:!1,defaultJunctionPoint:"lr",defaultLineShape:1,defaultExpandHolderPosition:"bottom"},graphOptions:{layouts:[{label:"中心",layoutName:"center",layoutClassName:"seeks-layout-center",allowSwitchLineShape:!0,allowSwitchJunctionPoint:!0,useLayoutStyleOptions:!0}],defaultExpandHolderPosition:"bottom",defaultLineShape:2,defaultNodeShape:0,defaultNodeWidth:"120",defaultNodeHeight:"120",defaultNodeBorderWidth:1}}},created:function(){},mounted:function(){this.setGraphData()},methods:{setGraphData:function(){var e=this;return i()(a.a.mark(function t(){var o,n,s,i,r,l,d,c,u,h,p,f,y,m,x;return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return o=25,t.next=3,Betools.query.queryTableDataByWhereSQL("bs_company_flow_base","_where=(id,eq,25)~and(status,eq,0)&_sort=-id");case 3:return n=t.sent,t.next=6,Betools.query.queryTableDataByWhereSQL("bs_company_stockholder","_where=(company_id,eq,25)~and(status,eq,valid)&_sort=-id");case 6:return s=t.sent,t.next=9,Betools.query.queryTableDataByWhereSQL("bs_company_senior_executive","_where=(company_id,eq,25)~and(status,eq,valid)&_sort=-id");case 9:return i=t.sent,t.next=12,Betools.query.queryTableDataByWhereSQL("bs_company_branch","_where=(company_id,eq,25)&_sort=-id");case 12:return r=t.sent,t.next=15,Betools.query.queryTableDataByWhereSQL("bs_company_investments","_where=(relation_company_id,eq,25)&_sort=-id");case 15:l=t.sent,s.map(function(e){e.id="invs_"+e.id,e.text=e.holder_name,e.desc="控股: "+e.ratio+"%"}),i.map(function(e){e.id="persons_"+e.id,e.text=e.holder_name,e.desc=e.position}),r.map(function(e){e.id="branchs_"+e.id,e.text=e.name,e.desc="法人: "+e.principal}),l.map(function(e){e.id="asInvs_"+e.id,e.text=e.company_name,e.desc="法人: "+e.legal_person}),d={entname:n&&n.length>0?n[0].name:"",invs:s,persons:i,asInvs:l,branchs:r},c=e.$refs.seeksRelationGraph.graphSetting,e.$refs.seeksRelationGraph.graphSetting.defaultLineShape=1,u={x:c.viewSize.width/2-c.canvasOffset.x,y:c.viewSize.height/2-c.canvasOffset.y},h={rootId:"root",nodes:[],links:[]},p={id:h.rootId,name:d.entname,styleClass:"c-g-center",color:"#A4C1FF",width:250,height:50,x:u.x-125,y:u.y-25},f={id:"invRoot",name:"股东",styleClass:"c-g-group-node",color:"#FFC5A6",width:100,height:50},y={id:"personRoot",name:"高管",styleClass:"c-g-group-node",color:"#B9FFA7",width:100,height:50},m={id:"asinvRoot",name:"对外投资",styleClass:"c-g-group-node",color:"#FFBEC1",width:100,height:50},x={id:"branchRoot",name:"分支机构",styleClass:"c-g-group-node",color:"#FFA1F8",width:100,height:50},f.x=u.x-200-f.width,f.y=u.y-130,y.x=u.x-200-y.width,y.y=u.y+90,m.x=u.x+200,m.y=u.y-130,x.x=u.x+200,x.y=u.y+90,h.nodes.push(p),h.nodes.push(f),h.nodes.push(y),h.nodes.push(m),h.nodes.push(x),h.links.push({from:p.id,to:f.id,styleClass:"c-g-l-group",color:"#C7E9FF",lineShape:2}),h.links.push({from:p.id,to:y.id,styleClass:"c-g-l-group",color:"#C7E9FF",lineShape:2}),h.links.push({from:p.id,to:m.id,styleClass:"c-g-l-group",color:"#C7E9FF",lineShape:2}),h.links.push({from:p.id,to:x.id,styleClass:"c-g-l-group",color:"#C7E9FF",lineShape:2}),d.invs.forEach(function(e,t){e.width=200,e.x=f.x-300-e.width,e.y=f.y+35*t*-1+50,h.nodes.push(e),h.links.push({from:f.id,to:e.id,text:e.desc,color:"#FFC5A6",arrow:"none",lineShape:1})}),d.persons.forEach(function(e,t){e.width=200,e.x=y.x-200-e.width,e.y=y.y+35*t,h.nodes.push(e),h.links.push({from:y.id,to:e.id,text:e.desc,color:"#B9FFA7",arrow:"none",lineShape:4})}),d.asInvs.forEach(function(e,t){e.x=m.x+300,e.y=m.y+35*t*-1+50,h.nodes.push(e),h.links.push({from:m.id,to:e.id,text:e.desc,color:"#FFBEC1",lineShape:4})}),d.branchs.forEach(function(e,t){e.x=x.x+300,e.y=x.y+35*t,h.nodes.push(e),h.links.push({from:x.id,to:e.id,text:e.desc,color:"#FFA1F8",lineShape:4})}),e.$refs.seeksRelationGraph.setJsonData(h,function(e){});case 52:case"end":return t.stop()}},t,e)}))()}}}},njUW:function(e,t,o){t=e.exports=o("FZ+f")(!0),t.push([e.i,"","",{version:3,sources:[],names:[],mappings:"",file:"stockscene.vue",sourceRoot:""}])},"r7G/":function(e,t,o){var n=o("njUW");"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);o("rjj0")("23ffe46c",n,!0,{})}});