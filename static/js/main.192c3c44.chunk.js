(this["webpackJsonpyorkie-codepair"]=this["webpackJsonpyorkie-codepair"]||[]).push([[0],{195:function(e,t,n){},196:function(e,t,n){},197:function(e,t,n){},20:function(e,t,n){"use strict";(function(e){function a(e,t,n,a){return e.addEventListener(t,n,a)}function r(e,t,n,a){return e.removeEventListener(t,n,a)}n.d(t,"a",(function(){return a})),n.d(t,"b",(function(){return r})),n.d(t,"c",(function(){return s}));var o={mouseup:"touchend",mouseout:"touchend",mousedown:"touchstart",mousemove:"touchmove"},i={mouseup:"pointerup",mouseout:"pointerup",mousedown:"pointerdown",mousemove:"pointermove"},c={mouseup:"MSPointerUp",mouseout:"MSPointerUp",mousedown:"MSPointerDown",mousemove:"MSPointerMove"};function s(t,n,a,r){e.navigator.pointerEnabled?n(t,i[a],r):e.navigator.msPointerEnabled?n(t,c[a],r):(n(t,o[a],r),n(t,a,r))}}).call(this,n(50))},200:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(11),i=n.n(o),c=n(10),s=n(254),u=n(125),l=n(17),d=n(123),h=n(249),m=n(251),v=n(126),f=n(250),p=n(239),g=n(262),b=n(243),y=n(244),E=n(241),j=n(21),O=n(207),k=n(242),x=n(260),w=n(69),C=n.n(w),S=n(257);function M(e){var t=e.anchorEl,n=e.onClose,a=e.children,o=Boolean(t);return r.a.createElement(S.a,{id:o?"simple-popover":void 0,open:o,anchorEl:t,onClose:n,anchorOrigin:{vertical:"bottom",horizontal:"center"},transformOrigin:{vertical:"top",horizontal:"center"}},a)}var N=n(240),T=n(204),D=Object(p.a)((function(){return{root:function(e){return{color:e.peer.metadata.color}}}}));function L(e){var t=D(e),n=e.peer;return r.a.createElement(T.a,{className:t.root},n.metadata.username)}var R,I=n(25);!function(e){e.Connected="connected",e.Disconnected="disconnected"}(R||(R={}));var z=Object(I.c)({name:"peer",initialState:{peers:{}},reducers:{syncPeer:function(e,t){for(var n=t.payload,a=n.myClientID,r=n.changedPeers,o=e.peers,i=0,c=Object.keys(o);i<c.length;i++){var s=c[i];r[s]||(o[s].status=R.Disconnected)}for(var u=0,l=Object.entries(r);u<l.length;u++){var d=Object(j.a)(l[u],2),h=d[0],m=d[1];if(!o[h]||o[h].status===R.Disconnected){var v={id:h,status:R.Connected,metadata:m,isMine:a===h};e.peers[h]=v}}}}}),A=z.actions.syncPeer,P=z.reducer;function B(){var e=Object(c.c)((function(e){return e.docState.client})),t=Object(c.c)((function(e){return e.peerState.peers}));return{activePeers:Object(a.useMemo)((function(){return e?Object.values(t).filter((function(e){return e.status===R.Connected})):[]}),[e,t])}}function W(){var e=B().activePeers;return r.a.createElement(N.a,null,r.a.createElement(T.a,null,r.a.createElement(E.a,null,"Total ",e.length)),e.map((function(e){return r.a.createElement(L,{key:e.id,peer:e})})))}var K=Object(p.a)((function(e){return{group:{"& > *":{cursor:"pointer"}},myAvatar:{borderColor:e.palette.secondary.main}}}));function V(){var e=K(),t=Object(c.c)((function(e){return e.docState.client})),n=B().activePeers,o=Object(a.useState)(),i=Object(j.a)(o,2),s=i[0],u=i[1],l=Object(a.useCallback)((function(e){e.target.getAttribute("data-id")||u(e.currentTarget)}),[u]),d=Object(a.useCallback)((function(){u(void 0)}),[u]);return t?r.a.createElement(r.a.Fragment,null,r.a.createElement(k.a,{className:e.group,max:4,onClick:l},n.map((function(t){var n=t.metadata,a=n.username,o=n.color,i=n.image;return r.a.createElement(x.a,{key:t.id,title:t.isMine?"[ME] ".concat(a):a,"data-id":t.id,arrow:!0},r.a.createElement(O.a,{alt:"Peer Image",className:t.isMine?e.myAvatar:"",style:{backgroundColor:o},src:C.a.getImage(i)}))}))),r.a.createElement(M,{anchorEl:s,onClose:d},r.a.createElement(W,null))):null}var F=Object(p.a)((function(e){return Object(g.a)({root:{flexGrow:1},appBar:{backgroundColor:"black"},menuButton:{marginRight:e.spacing(2)},title:{flexGrow:1,fontWeight:"bold",color:e.palette.primary.main}})}));function Y(){var e=F();return r.a.createElement("div",{className:e.root},r.a.createElement(b.a,{position:"static",className:e.appBar},r.a.createElement(y.a,null,r.a.createElement(E.a,{variant:"h6",className:e.title},"Yorkie CodePair"),r.a.createElement(V,null))))}var H,X,U,G=Object(a.memo)(Y),J=n(255),$=n(246),_=n(245),q=n(247),Q=n(117),Z=n.n(Q),ee=n(256),te=n(33),ne=n(34),ae=function(){function e(t){Object(te.a)(this,e),this.key=void 0,this.storage=void 0,this.key=t,this.storage=window.localStorage}return Object(ne.a)(e,[{key:"getValue",value:function(e){try{return JSON.parse(this.storage[this.key])}catch(t){return e}}},{key:"setValue",value:function(e){this.storage[this.key]=JSON.stringify(e)}}]),e}();!function(e){e.Material="material",e.Monokai="monokai"}(H||(H={})),function(e){e.Sublime="sublime",e.Vim="vim",e.Emacs="emacs"}(X||(X={})),function(e){e.Two="2",e.Four="4",e.Eight="8"}(U||(U={}));var re,oe=new ae("$$codepair$$setting"),ie=oe.getValue({menu:{codeTheme:H.Monokai,codeKeyMap:X.Sublime,tabSize:U.Two}}),ce=Object(I.c)({name:"setting",initialState:ie,reducers:{setCodeTheme:function(e,t){e.menu.codeTheme=t.payload,oe.setValue(e)},setCodeKeyMap:function(e,t){e.menu.codeKeyMap=t.payload,oe.setValue(e)},setTabSize:function(e,t){e.menu.tabSize=t.payload,oe.setValue(e)}}}),se=ce.actions,ue=se.setCodeTheme,le=se.setCodeKeyMap,de=se.setTabSize,he=ce.reducer,me=Object(p.a)((function(e){return Object(g.a)({root:{width:"400px",minWidth:"320px",borderRadius:"4px"},header:{borderBottom:"1px solid ".concat(e.palette.text.disabled)},title:{padding:"12px 16px"},list:{padding:"12px 24px",lineHeight:"19px"},item:{display:"flex",justifyContent:"space-between",fontSize:"15px",marginTop:"12px"},itemTitle:{whiteSpace:"nowrap",display:"flex",alignItems:"center"},itemInfo:{minWidth:140,paddingLeft:"12px",border:"1px solid #aaa",borderRadius:"4px",textAlign:"left"}})})),ve=function(){var e=Object(c.b)(),t=me(),n=Object(c.c)((function(e){return e.settingState.menu}));function a(t){return function(n){e(t(n.target.value))}}return r.a.createElement("div",{className:t.root},r.a.createElement(ee.a,null,r.a.createElement("header",{className:t.header},r.a.createElement(E.a,{className:t.title,variant:"h6"},"Settings"))),r.a.createElement("div",{className:t.list},r.a.createElement("div",{className:t.item},r.a.createElement("div",{className:t.itemTitle},"Theme"),r.a.createElement(_.a,{className:t.itemInfo},r.a.createElement(J.a,{value:n.codeTheme,onChange:a(ue),disableUnderline:!0,displayEmpty:!0},Object.entries(H).map((function(e){var t=Object(j.a)(e,2),n=t[0],a=t[1];return r.a.createElement($.a,{value:a,key:a},n)}))))),r.a.createElement("div",{className:t.item},r.a.createElement("div",{className:t.itemTitle},"Key binding"),r.a.createElement(_.a,{className:t.itemInfo},r.a.createElement(J.a,{value:n.codeKeyMap,onChange:a(le),disableUnderline:!0,displayEmpty:!0},Object.entries(X).map((function(e){var t=Object(j.a)(e,2),n=t[0],a=t[1];return r.a.createElement($.a,{value:a,key:a},n)}))))),r.a.createElement("div",{className:t.item},r.a.createElement("div",{className:t.itemTitle},"Tab Size"),r.a.createElement(_.a,{className:t.itemInfo},r.a.createElement(J.a,{value:n.tabSize,onChange:a(de),disableUnderline:!0,displayEmpty:!0},Object.entries(U).map((function(e){var t=Object(j.a)(e,2),n=t[0],a=t[1];return r.a.createElement($.a,{value:a,key:n},"".concat(a," spaces"))})))))))},fe=n(40),pe=n.n(fe),ge=n(66),be=n(87),ye=n.n(be),Ee=n(116),je=n.n(Ee);!function(e){e.Markdown="gfm",e.Go="go",e.JavaScript="javascript",e.Clojure="clojure",e.Dart="dart",e.Python="python",e.Ruby="ruby",e.Rust="rust"}(re||(re={}));var Oe={mode:re.Markdown,loading:!0,errorMessage:""},ke=Object(I.b)("doc/activate",function(){var e=Object(ge.a)(pe.a.mark((function e(t,n){var a,r,o,i;return pe.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,a=C.a.generate(),r=a.name,o=a.animal,i=ye.a.createClient("".concat("/api"),{metadata:{username:r,image:o,color:je()()}}),e.next=5,i.activate();case 5:return e.abrupt("return",{client:i});case 8:return e.prev=8,e.t0=e.catch(0),e.abrupt("return",n.rejectWithValue(e.t0.message));case 11:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(t,n){return e.apply(this,arguments)}}()),xe=Object(I.b)("doc/attach",function(){var e=Object(ge.a)(pe.a.mark((function e(t,n){var a,r;return pe.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=t.client,r=t.doc,e.prev=1,e.next=4,a.attach(r);case 4:return r.update((function(e){e.content||e.createText("content"),e.shapes||(e.shapes=[])})),e.next=7,a.sync();case 7:return e.abrupt("return",{doc:r,client:a});case 10:return e.prev=10,e.t0=e.catch(1),e.abrupt("return",n.rejectWithValue(e.t0.message));case 13:case"end":return e.stop()}}),e,null,[[1,10]])})));return function(t,n){return e.apply(this,arguments)}}()),we=Object(I.c)({name:"doc",initialState:Oe,reducers:{deactivateClient:function(e){var t=e.client;e.client=void 0,null===t||void 0===t||t.deactivate()},createDocument:function(e,t){e.doc=ye.a.createDocument("codepairs",t.payload)},detachDocument:function(e){var t=e.doc,n=e.client;e.doc=void 0,null===n||void 0===n||n.detach(t)},attachDocLoading:function(e,t){e.loading=t.payload},setCodeMode:function(e,t){e.mode=t.payload}},extraReducers:function(e){e.addCase(ke.fulfilled,(function(e,t){var n=t.payload;e.client=n.client})),e.addCase(ke.rejected,(function(e,t){var n=t.payload;e.errorMessage=n})),e.addCase(xe.fulfilled,(function(e,t){var n=t.payload;e.doc=n.doc,e.client=n.client})),e.addCase(xe.rejected,(function(e,t){var n=t.payload;e.errorMessage=n}))}}),Ce=we.actions,Se=Ce.deactivateClient,Me=Ce.createDocument,Ne=Ce.detachDocument,Te=Ce.attachDocLoading,De=Ce.setCodeMode,Le=we.reducer,Re=Object(p.a)((function(e){return Object(g.a)({root:{padding:"6px",position:"relative"},formControl:{minWidth:140,border:"1px solid ".concat(e.palette.grey[800]),borderRadius:"4px"},selectEmpty:{paddingLeft:"12px"},rightButtonControl:{float:"right"},rightButton:{padding:"7px"}})}));function Ie(){var e=Re(),t=Object(c.b)(),n=Object(c.c)((function(e){return e.docState.doc})),o=Object(c.c)((function(e){return e.docState.mode})),i=Object(a.useState)(),s=Object(j.a)(i,2),u=s[0],l=s[1];Object(a.useEffect)((function(){if(!n)return function(){};var e=n.subscribe((function(e){"remote-change"===e.type&&t(De(n.getRoot().mode||re.Markdown))}));return function(){e()}}),[n]);var d=Object(a.useCallback)((function(e){if(n){var a=e.target.value;n.update((function(e){e.mode=a})),t(De(a))}}),[n,t]),h=Object(a.useCallback)((function(e){l(e.currentTarget)}),[]),m=Object(a.useCallback)((function(){l(void 0)}),[]);return r.a.createElement("div",{className:e.root},r.a.createElement(_.a,{className:e.formControl},r.a.createElement(x.a,{title:"Syntax",arrow:!0},r.a.createElement(J.a,{name:"codeMode",value:o,onChange:d,className:e.selectEmpty,disableUnderline:!0,displayEmpty:!0},Object.entries(re).map((function(e){var t=Object(j.a)(e,2),n=t[0],a=t[1];return r.a.createElement($.a,{value:a,key:a},n)}))))),r.a.createElement("div",{className:e.rightButtonControl},r.a.createElement(x.a,{className:e.rightButton,title:"Settings",arrow:!0},r.a.createElement(q.a,{"aria-label":"settings",onClick:h},r.a.createElement(Z.a,{fontSize:"small"})))),r.a.createElement(M,{anchorEl:u,onClose:m},r.a.createElement(ve,null)))}var ze,Ae=n(261),Pe=n(258),Be=n(248),We=n(46),Ke=n(118),Ve=n(119),Fe=n.n(Ve);!function(e){e.Deactivated="deactivated",e.Activated="activated"}(ze||(ze={}));var Ye=function(){function e(t,n){Object(te.a)(this,e),this.id=void 0,this.username=void 0,this.color=void 0,this.height=void 0,this.marker=void 0,this.lineMarker=void 0,this.status=void 0,this.nameRemoveTimeMap=void 0,this.nameAnimationDelay=void 0,this.nameAnimationDuration=void 0,this.nameRemoveTime=void 0,this.id=t,this.username=n.username,this.color=n.color,this.height=0,this.status=ze.Deactivated,this.nameRemoveTimeMap=new Map,this.nameAnimationDelay=1,this.nameAnimationDuration=.2,this.nameRemoveTime=1e3*(this.nameAnimationDuration+this.nameAnimationDelay)}return Object(ne.a)(e,[{key:"updateCursor",value:function(e,t){this.removeCursor(),this.status=ze.Activated;var n=e.cursorCoords(t),a=document.createElement("span");this.height=n.bottom-n.top,a.classList.add("codePair-cursor"),a.style.borderLeftColor=this.color,a.style.height="".concat(this.height,"px"),this.marker=e.setBookmark(t,{widget:a,insertLeft:!0}),this.showCursorNameReserve(a)}},{key:"updateLine",value:function(e,t,n){this.removeLine(),this.status=ze.Activated,this.lineMarker=e.getDoc().markText(t,n,{css:"background-color : ".concat(this.color,"; opacity:0.7")})}},{key:"showCursorNameReserve",value:function(e){var t=this,n=document.createElement("span");n.classList.add("codePair-name"),e.addEventListener("mouseenter",(function(){t.nameRemoveTimeMap.has(t.id)&&clearTimeout(t.nameRemoveTimeMap.get(t.id)),n.textContent=t.username,n.style.top="-".concat(t.height,"px"),n.style.backgroundColor=t.color,n.style.color=Fe()(t.color,!0),n.classList.remove("text-remove"),e.appendChild(n)})),e.addEventListener("mouseleave",(function(){n.classList.add("text-remove"),n.style.animationDuration="".concat(t.nameAnimationDuration,"s"),n.style.animationDelay="".concat(t.nameAnimationDelay,"s"),t.removeNameReserve(n)}))}},{key:"removeNameReserve",value:function(e){var t=this,n=setTimeout((function(){e.parentNode.removeChild(e),t.nameRemoveTimeMap.delete(t.id)}),this.nameRemoveTime);this.nameRemoveTimeMap.set(this.id,n)}},{key:"removeCursor",value:function(){this.marker&&(this.marker.clear(),this.marker=void 0)}},{key:"removeLine",value:function(){this.lineMarker&&(this.lineMarker.clear(),this.lineMarker=void 0)}},{key:"clear",value:function(){this.removeCursor(),this.removeLine()}},{key:"isActive",value:function(){return this.status===ze.Activated}}]),e}();n(171),n(172),n(174),n(179),n(180),n(182),n(183),n(185),n(186),n(187),n(188),n(189),n(190),n(192),n(193),n(194),n(195);function He(){var e=Object(c.c)((function(e){return e.docState.doc})),t=Object(c.c)((function(e){return e.docState.mode})),n=Object(c.c)((function(e){return e.docState.client})),o=Object(c.c)((function(e){return e.peerState.peers})),i=Object(c.c)((function(e){return e.settingState.menu})),s=Object(a.useRef)(new Map),u=Object(a.useCallback)((function(e,t){s.current.set(e,new Ye(e,t))}),[o]),l=Object(a.useCallback)((function(e){s.current.has(e)&&(s.current.get(e).clear(),s.current.delete(e))}),[]);return Object(a.useEffect)((function(){for(var e=0,t=Object.entries(o);e<t.length;e++){var n=Object(j.a)(t[e],2),a=n[0],r=n[1];s.current.has(a)&&r.status===R.Disconnected?l(a):s.current.has(a)||r.status!==R.Connected||u(a,r.metadata)}}),[o]),n&&e?r.a.createElement(Ke.UnControlled,{className:"CodeMirror",options:{mode:t,theme:i.codeTheme,keyMap:i.codeKeyMap,tabSize:Number(i.tabSize),lineNumbers:!0,lineWrapping:!0,autoCloseTags:!0,autoCloseBrackets:!0},editorDidMount:function(t){t.focus();var a=function(e,n){var a=s.current.get(e);null===a||void 0===a||a.updateCursor(t,n)};e.subscribe((function(e){if("remote-change"===e.type){var r,o=Object(We.a)(e.value);try{for(o.s();!(r=o.n()).done;){var i=r.value.change.getID().getActorID();if(i!==n.getID()){if(!s.current.has(i))return;if(s.current.get(i).isActive())return;a(i,t.posFromIndex(0))}}}catch(c){o.e(c)}finally{o.f()}}}));var r=e.getRoot();r.content.onChanges((function(e){e.forEach((function(e){var r=e.actor,o=e.from,i=e.to;if("content"===e.type){var c=e.content||"";if(r!==n.getID()){var u=t.posFromIndex(o),l=t.posFromIndex(i);t.replaceRange(c,u,l,"yorkie")}}else if("selection"===e.type&&r!==n.getID()){var d=t.posFromIndex(o),h=t.posFromIndex(i);if(a(r,h),o>i){var m=[d,h];h=m[0],d=m[1]}!function(e,n,a){var r=s.current.get(e);null===r||void 0===r||r.updateLine(t,n,a)}(r,d,h)}}))})),t.setValue(r.content.getValue())},onSelection:function(t,n){if(n.origin){var a=t.indexFromPos(n.ranges[0].anchor),r=t.indexFromPos(n.ranges[0].head);e.update((function(e){e.content.updateSelection(a,r)}))}},onBeforeChange:function(t,n){if("yorkie"!==n.origin&&"setValue"!==n.origin){var a=t.indexFromPos(n.from),r=t.indexFromPos(n.to),o=n.text.join("\n");e.update((function(e){e.content.edit(a,r,o)}))}}}):null}var Xe,Ue=n(120),Ge=n.n(Ue),Je=n(121),$e=n.n(Je);!function(e){e[e.None=0]="None",e[e.Line=1]="Line",e[e.Eraser=2]="Eraser"}(Xe||(Xe={}));var _e={isOpen:!1,tool:Xe.None},qe=Object(I.c)({name:"board",initialState:_e,reducers:{toggleBoard:function(e){e.isOpen=!e.isOpen},setTool:function(e,t){e.tool=t.payload}}}),Qe=qe.actions,Ze=(Qe.toggleBoard,Qe.setTool),et=qe.reducer,tt=function(){function e(t){Object(te.a)(this,e),this.canvas=void 0,this.context=void 0,this.width=0,this.height=0,this.canvas=t,this.context=t.getContext("2d"),this.resize()}return Object(ne.a)(e,[{key:"getCanvas",value:function(){return this.canvas}},{key:"getContext",value:function(){return this.context}},{key:"getWidth",value:function(){return this.width}},{key:"getHeight",value:function(){return this.height}},{key:"setWidth",value:function(e,t){this.width=e,this.canvas.width=t?e*t:e,this.canvas.style.width="".concat(e,"px")}},{key:"setHeight",value:function(e,t){this.height=e,this.canvas.height=t?e*t:e,this.canvas.style.height="".concat(e,"px")}},{key:"setSize",value:function(e,t,n){this.setWidth(e,n),this.setHeight(t,n)}},{key:"clear",value:function(){this.getContext().clearRect(0,0,this.getWidth(),this.getHeight())}},{key:"resize",value:function(){var e=window.devicePixelRatio;e?(this.setSize(this.canvas.width,this.canvas.height,e),this.context.scale(e,e)):this.setSize(this.canvas.width,this.canvas.height)}}]),e}();function nt(e,t,n){e.beginPath();var a=e.strokeStyle;e.strokeStyle=t;var r,o=!1,i=Object(We.a)(n.points);try{for(i.s();!(r=i.n()).done;){var c=r.value;!1===o?(o=!0,e.moveTo(c.x,c.y)):e.lineTo(c.x,c.y)}}catch(s){i.e(s)}finally{i.f()}e.lineWidth=3,e.stroke(),e.strokeStyle=a}function at(e){return{y:e.y+8,x:e.x+6}}var rt=n(127);function ot(e,t){var n=e.x-t.x,a=e.y-t.y;return n*n+a*a}function it(e,t,n){var a=t.x,r=t.y,o=n.x-a,i=n.y-r;if(0!==o||0!==i){var c=((e.x-a)*o+(e.y-r)*i)/(o*o+i*i);c>1?(a=n.x,r=n.y):c>0&&(a+=o*c,r+=i*c)}return(o=e.x-a)*o+(i=e.y-r)*i}function ct(e,t,n,a,r){for(var o=a,i=0,c=t+1;c<n;c+=1){var s=it(e[c],e[t],e[n]);s>o&&(i=c,o=s)}o>a&&(t+1<i&&ct(e,t,i,a,r),r.push(e[i]),i+1<n&&ct(e,i,n,a,r))}function st(e,t){var n=e.length-1,a=[];return a.push(e[0]),ct(e,0,n,t,a),a.push(e[n]),a}function ut(e,t){for(var n=e[0],a=n,r=[a],o=1,i=e.length;o<i;o+=1)ot(n=e[o],a)>t&&(r.push(n),a=n);return a!==n&&r.push(n),r}function lt(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:10;return st(ut(e,t),t)}function dt(e,t,n,a){var r,o,i={x:0,y:0,onLine1:!1,onLine2:!1},c=(a.y-n.y)*(t.x-e.x)-(a.x-n.x)*(t.y-e.y);if(0===c)return i;r=e.y-n.y,o=e.x-n.x;var s=(a.x-n.x)*r-(a.y-n.y)*o,u=(t.x-e.x)*r-(t.y-e.y)*o;return r=s/c,o=u/c,i.x=e.x+r*(t.x-e.x),i.y=e.y+r*(t.y-e.y),r>0&&r<1&&(i.onLine1=!0),o>0&&o<1&&(i.onLine2=!0),i}var ht,mt,vt=[];var ft,pt=function(){function e(t){Object(te.a)(this,e),this.update=void 0,this.update=t}return Object(ne.a)(e,[{key:"isRecordWork",value:function(e){return e===Xe.Line||e===Xe.Eraser}},{key:"createShape",value:function(e,t){var n;return this.update((function(a){if(e===Xe.Line){var r=function(e){return{type:"line",points:[e]}}(t);a.shapes.push(r)}else if(e===Xe.Eraser){var o=function(e){return{type:"eraser",points:[e]}}(t);a.shapes.push(o)}var i=a.shapes.getLast();n=i.getID()})),n}},{key:"executeTask",value:function(e,t,n){var a=this;!function(e){mt=function(){vt.length>0&&(e(vt),vt=[])},ht=setInterval(mt,50)}((function(r){a.update((function(a){if(t===Xe.Line){var o,i=lt(r.map((function(e){return e.point})));(o=a.shapes.getElementByID(e).points).push.apply(o,Object(rt.a)(i)),n(a.shapes)}else if(t===Xe.Eraser){if(r.length<2)return;var c=lt(r.map((function(e){return e.point}))),s=at(c[0]),u=at(c[c.length-1]),l=a.shapes.getElementByID(e),d=function(e,t){var n,r=Object(We.a)(a.shapes);try{for(r.s();!(n=r.n()).done;)for(var o=n.value,i=1;i<o.points.length;i+=1){var c=dt(e,t,o.points[i-1],o.points[i]);if(c.onLine1&&c.onLine2){a.shapes.deleteByID(o.getID());break}}}catch(s){r.e(s)}finally{r.f()}};if(l.points.length>0)d(l.points[l.points.length-1],s);d(s,u),l.points=[s,u],n(a.shapes)}}))}))}},{key:"reserveTask",value:function(e){!function(e){vt.push(e)}(e)}},{key:"flushTask",value:function(e,t,n){clearInterval(ht),"function"===typeof mt&&mt(),mt=void 0,e&&this.update((function(a){t===Xe.Line?a.shapes.getElementByID(e).points.length<2&&(a.shapes.deleteByID(e),n(a.shapes)):t===Xe.Eraser&&(a.shapes.deleteByID(e),n(a.shapes))}))}}]),e}(),gt=n(20);!function(e){e[e.Drag=0]="Drag",e[e.Stop=1]="Stop"}(ft||(ft={}));var bt=function(){function e(t,n,a){Object(te.a)(this,e),this.pointY=void 0,this.pointX=void 0,this.offsetY=void 0,this.offsetX=void 0,this.scene=void 0,this.tool=void 0,this.createId=void 0,this.dragStatus=void 0,this.update=void 0,this.options=void 0,this.worker=void 0,this.pointY=0,this.pointX=0,this.tool=Xe.Line,this.dragStatus=ft.Stop,this.update=n,this.options=a,this.scene=new tt(t);var r=this.scene.getCanvas().getBoundingClientRect(),o=r.y,i=r.x;this.offsetY=o,this.offsetX=i,this.init(),this.worker=new pt(this.update)}return Object(ne.a)(e,[{key:"init",value:function(){this.scene.getContext().strokeStyle=this.options.color,this.drawAll=this.drawAll.bind(this),this.onmouseup=this.onmouseup.bind(this),this.onmousedown=this.onmousedown.bind(this),this.onmousemove=this.onmousemove.bind(this),Object(gt.c)(this.scene.getCanvas(),gt.a,"mouseup",this.onmouseup),Object(gt.c)(this.scene.getCanvas(),gt.a,"mouseout",this.onmouseup),Object(gt.c)(this.scene.getCanvas(),gt.a,"mousedown",this.onmousedown)}},{key:"destroy",value:function(){Object(gt.c)(this.scene.getCanvas(),gt.b,"mouseup",this.onmouseup),Object(gt.c)(this.scene.getCanvas(),gt.b,"mouseout",this.onmouseup),Object(gt.c)(this.scene.getCanvas(),gt.b,"mousedown",this.onmousedown)}},{key:"setTool",value:function(e){this.setMouseClass(e),this.tool=e}},{key:"setMouseClass",value:function(e){this.scene.getCanvas().className="",e===Xe.Line?this.scene.getCanvas().classList.add("crosshair","canvas-touch-none"):e===Xe.Eraser&&this.scene.getCanvas().classList.add("eraser","canvas-touch-none")}},{key:"getMouse",value:function(e){var t,n;return e instanceof TouchEvent?(t=e.touches[0].clientY,n=e.touches[0].clientX):(t=e.clientY,n=e.clientX),t+=window.scrollY,n+=window.scrollX,{y:t-this.offsetY,x:n-this.offsetX}}},{key:"onmousedown",value:function(e){Object(gt.c)(this.scene.getCanvas(),gt.a,"mousemove",this.onmousemove),this.dragStatus=ft.Drag;var t=this.getMouse(e);this.worker.isRecordWork(this.tool)&&(this.createId=this.worker.createShape(this.tool,t),this.worker.executeTask(this.createId,this.tool,this.drawAll))}},{key:"onmousemove",value:function(e){var t=this.getMouse(e);this.isOutSide(t)||this.dragStatus!==ft.Stop&&this.worker.isRecordWork(this.tool)&&this.worker.reserveTask({point:t})}},{key:"onmouseup",value:function(){Object(gt.c)(this.scene.getCanvas(),gt.b,"mousemove",this.onmousemove),this.dragStatus=ft.Stop,this.worker.isRecordWork(this.tool)&&(this.worker.flushTask(this.createId,this.tool,this.drawAll),this.createId=void 0)}},{key:"isOutSide",value:function(e){return(e.y<0||e.x<0||e.y>this.scene.getHeight()||e.x>this.scene.getWidth())&&(this.onmouseup(),!0)}},{key:"drawAll",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.scene;t.clear();var n,a=Object(We.a)(e);try{for(a.s();!(n=a.n()).done;){var r=n.value;this.draw(r,t)}}catch(o){a.e(o)}finally{a.f()}}},{key:"draw",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.scene;"line"===e.type?nt(t.getContext(),this.options.color,e):"eraser"===e.type&&nt(t.getContext(),this.options.eraserColor,e)}},{key:"clear",value:function(){this.scene.clear()}}]),e}();n(196);function yt(e){var t=e.width,n=e.height,o=Object(a.useRef)(null),i=Object(a.useRef)(null),s=Object(c.c)((function(e){return e.docState.doc})),u=Object(c.c)((function(e){return e.boardState.tool}));return Object(a.useEffect)((function(){if(!o.current||!s)return function(){};var e={color:Ge.a[500],eraserColor:$e.a[400]};o.current.width=t,o.current.height=n;var a=new bt(o.current,s.update.bind(s),e);return i.current=a,i.current.setTool(u),i.current.drawAll(s.getRoot().shapes),function(){a.destroy()}}),[t,n,s,u]),Object(a.useEffect)((function(){if(!s)return function(){};var e=s.subscribe((function(e){var t;"remote-change"===e.type&&(null===(t=i.current)||void 0===t||t.drawAll(s.getRoot().shapes))}));return function(){e()}}),[s]),Object(a.useEffect)((function(){var e;null===(e=i.current)||void 0===e||e.setTool(u)}),[s,u]),r.a.createElement("canvas",{ref:o})}var Et=n(122),jt=n.n(Et),Ot=n(79);function kt(e){var t=e.fontSize;return r.a.createElement(Ot.a,{fontSize:t},r.a.createElement("svg",{version:"1.1",id:"Layer_1",x:"0px",y:"0px",viewBox:"0 0 480.001 480.001"},r.a.createElement("g",null,r.a.createElement("g",null,r.a.createElement("path",{d:"M333.142,350.846c0.115-0.115,0.215-0.239,0.323-0.357l129.681-129.706c10.878-10.878,16.864-25.368,16.855-40.8 c-0.01-15.409-5.999-29.865-16.854-40.694l-97.844-97.874c-10.853-10.845-25.326-16.817-40.75-16.817 c-15.426,0-29.895,5.974-40.741,16.82L16.855,308.329C5.974,319.21-0.012,333.713,0,349.168 c0.013,15.425,6.002,29.884,16.854,40.7l62.592,62.606c0.061,0.061,0.127,0.112,0.188,0.171c0.174,0.165,0.349,0.331,0.534,0.483 c0.082,0.067,0.171,0.126,0.255,0.19c0.175,0.135,0.349,0.271,0.532,0.395c0.07,0.047,0.145,0.085,0.215,0.13 c0.205,0.131,0.412,0.26,0.627,0.376c0.051,0.026,0.103,0.048,0.154,0.074c0.239,0.123,0.482,0.241,0.732,0.346 c0.033,0.014,0.067,0.024,0.101,0.037c0.269,0.108,0.54,0.208,0.819,0.293c0.034,0.011,0.07,0.017,0.104,0.027 c0.276,0.081,0.556,0.154,0.841,0.211c0.082,0.017,0.165,0.023,0.247,0.038c0.239,0.041,0.479,0.084,0.724,0.107 c0.33,0.033,0.663,0.051,0.998,0.051h137.91h159.308c5.522,0,10-4.478,10-10c0-5.522-4.478-10-10-10H248.566l84.22-84.236 C332.904,351.06,333.027,350.96,333.142,350.846z M220.285,435.404H90.66l-59.675-59.689 c-7.076-7.054-10.977-16.487-10.985-26.563c-0.008-10.106,3.897-19.582,10.996-26.681l129.825-129.803l151.091,151.091 L220.285,435.404z M174.965,178.527L297.953,55.56c7.069-7.069,16.516-10.963,26.6-10.963c10.085,0,19.536,3.895,26.609,10.962 l97.85,97.88c7.08,7.063,10.982,16.493,10.989,26.557c0.006,10.085-3.899,19.547-10.998,26.645l-122.95,122.974L174.965,178.527z"})))))}function xt(e){var t=e.fontSize;return r.a.createElement(Ot.a,{fontSize:t},r.a.createElement("svg",{version:"1.1",id:"Capa_1",xmlns:"http://www.w3.org/2000/svg",x:"0px",y:"0px",viewBox:"0 0 297 297"},r.a.createElement("g",null,r.a.createElement("path",{d:"M247.094,297c-2.831,0-5.549-1.125-7.551-3.129l-82.835-82.868l-34.905,60.448c-2.046,3.544-5.936,5.61-10.017,5.31 c-4.081-0.296-7.634-2.896-9.148-6.697L0.825,14.632c-1.58-3.965-0.648-8.489,2.369-11.505C6.212,0.108,10.735-0.82,14.7,0.761 l255.317,101.86c3.799,1.515,6.397,5.067,6.693,9.148c0.295,4.079-1.766,7.968-5.308,10.015l-60.435,34.929l82.839,82.878 c4.168,4.169,4.168,10.926,0.001,15.096l-39.162,39.186C252.643,295.873,249.927,297,247.094,297z M154.422,182.934 c2.813,0,5.534,1.112,7.551,3.129l85.121,85.156l24.067-24.082l-85.126-85.162c-2.347-2.348-3.469-5.651-3.036-8.941 c0.433-3.291,2.371-6.191,5.244-7.852l53.427-30.879L29.86,29.801l84.462,211.902l30.853-53.433 c1.66-2.874,4.563-4.813,7.854-5.246C153.494,182.964,153.959,182.934,154.422,182.934z"}))))}var wt=Object(p.a)((function(e){return Object(g.a)({root:{display:"flex",flexDirection:"column"},select:{color:e.palette.primary.main}})}));function Ct(){var e=wt(),t=Object(c.b)(),n=Object(c.c)((function(e){return e.boardState.tool})),a=function(e){return function(){t(Ze(e))}};return r.a.createElement("div",{className:e.root},r.a.createElement(x.a,{title:"Text",arrow:!0},r.a.createElement(q.a,{"aria-label":"Text",className:n===Xe.None?e.select:"",onClick:a(Xe.None)},r.a.createElement(xt,{fontSize:"small"}))),r.a.createElement(x.a,{title:"Pencel",arrow:!0},r.a.createElement(q.a,{"aria-label":"Pencel",className:n===Xe.Line?e.select:"",onClick:a(Xe.Line)},r.a.createElement(jt.a,{fontSize:"small"}))),r.a.createElement(x.a,{title:"Eraser",arrow:!0},r.a.createElement(q.a,{"aria-label":"eraser",className:n===Xe.Eraser?e.select:"",onClick:a(Xe.Eraser)},r.a.createElement(kt,{fontSize:"small"}))))}var St=110,Mt=Object(p.a)((function(){return Object(g.a)({root:{flexGrow:1,display:"flex"},editor:{width:"calc(100% - ".concat(48,"px)")},codeEditor:{width:"100%",height:"calc(100vh - ".concat(St,"px)")},canvas:{top:St,height:"calc(100vh - ".concat(St,"px)"),width:"calc(100% - ".concat(48,"px)"),position:"fixed",zIndex:function(e){return e===Xe.None?1:10}}})}));function Nt(e){var t=e.tool,n=Mt(t),o=Object(a.useState)(0),i=Object(j.a)(o,2),c=i[0],s=i[1],u=Object(a.useState)(0),l=Object(j.a)(u,2),d=l[0],h=l[1],m=Object(a.useRef)(null);return Object(a.useEffect)((function(){var e=function(){var e;if(m.current){var t=null===(e=m.current)||void 0===e?void 0:e.getBoundingClientRect();s(t.width),h(t.height)}};return e(),window.addEventListener("resize",e),function(){window.removeEventListener("resize",e)}}),[]),r.a.createElement("div",{className:n.root},r.a.createElement("div",{className:n.editor,ref:m},r.a.createElement("div",{className:n.codeEditor},r.a.createElement(He,null)),r.a.createElement("div",{className:n.canvas},r.a.createElement(yt,{width:c,height:d}))),r.a.createElement(Ct,null))}var Tt=Object(p.a)((function(){return Object(g.a)({loading:{display:"flex",height:"calc(100vh - ".concat(St,"px)"),alignItems:"center",justifyContent:"center"}})})),Dt=function(e){var t=e.docKey,n=Tt(),o=Object(c.b)(),i=Object(c.c)((function(e){return e.docState.client})),s=Object(c.c)((function(e){return e.docState.doc})),u=Object(c.c)((function(e){return e.boardState.tool})),l=Object(c.c)((function(e){return e.docState.loading})),d=Object(c.c)((function(e){return e.docState.errorMessage}));return Object(a.useEffect)((function(){return o(ke()),function(){o(Se())}}),[]),Object(a.useEffect)((function(){if(!i||!s)return function(){};var e=i.subscribe((function(e){if("peers-changed"===e.type){var t=s.getKey().toIDString(),n=e.value[t];o(A({myClientID:i.getID(),changedPeers:n}))}}));return function(){e()}}),[i,s]),Object(a.useEffect)((function(){return o(Me(t)),function(){o(Ne())}}),[t]),Object(a.useEffect)((function(){function e(){return(e=Object(ge.a)(pe.a.mark((function e(){return pe.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(i&&s){e.next=2;break}return e.abrupt("return");case 2:return o(Te(!0)),e.next=5,o(xe({client:i,doc:s}));case 5:o(De(s.getRoot().mode||re.Markdown)),o(Te(!1));case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return function(){e.apply(this,arguments)}(),function(){o(Te(!0))}}),[t,i,s]),d?r.a.createElement("div",null,r.a.createElement(Ae.a,{open:!0,anchorOrigin:{vertical:"top",horizontal:"center"}},r.a.createElement(Pe.a,{severity:"warning"},d||"fail to attach document"))):l?r.a.createElement(ee.a,{className:n.loading},r.a.createElement(Be.a,{color:"inherit"})):r.a.createElement(Nt,{tool:u})},Lt=Object(p.a)((function(){return Object(g.a)({root:{flexGrow:1}})}));function Rt(e){var t=Lt(),n=e.match.params.docKey;return r.a.createElement("div",{className:t.root},r.a.createElement(G,null),r.a.createElement(Ie,null),r.a.createElement(Dt,{docKey:n}))}n(197);var It=function(){var e=Object(h.a)("(prefers-color-scheme: dark)"),t=Object(a.useMemo)((function(){return Object(v.a)({palette:{type:e?"dark":"light",primary:{main:"#d8b01a"},secondary:{main:"#e6b602"}}})}),[e]),n=Object(a.useCallback)((function(){return r.a.createElement(l.a,{to:"/".concat(Math.random().toString(36).substring(7))})}),[]);return r.a.createElement(f.a,{theme:t},r.a.createElement(m.a,null),r.a.createElement(d.a,null,r.a.createElement(l.b,{path:"/",exact:!0,render:n}),r.a.createElement(l.b,{path:"/:docKey",exact:!0,component:Rt})))},zt=n(24),At=Object(zt.c)({docState:Le,peerState:P,settingState:he,boardState:et}),Pt=Object(I.a)({reducer:At,middleware:Object(I.d)({serializableCheck:{ignoredActions:["doc/attach/fulfilled","doc/activate/fulfilled"],ignoredPaths:["docState.client","docState.doc"]},immutableCheck:{ignoredPaths:["docState.client","docState.doc"]}})});Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a({dsn:"https://d287d6df8c6f423189266360055e6ca7@o553194.ingest.sentry.io/5680102",integrations:[new u.a.BrowserTracing],tracesSampleRate:1}),i.a.render(r.a.createElement(c.a,{store:Pt},r.a.createElement(It,null)),document.querySelector("#root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[200,1,2]]]);
//# sourceMappingURL=main.192c3c44.chunk.js.map