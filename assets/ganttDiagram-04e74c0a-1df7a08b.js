import{J as Yt,K as O,L as Ht,c as j,s as Qt,g as Jt,B as Kt,C as Zt,b as $t,a as te,m as ee,D as ie,j as se,l as kt,h as ct,M as ne,N as re,O as ae,i as ce,P as oe,Q as le,R as ue,S as Lt,T as Ft,U as Mt,V as zt,W as Ot,X as Vt,Y as fe,k as de,A as he}from"./index-2af7e354.js";var gt={},me={get exports(){return gt},set exports(t){gt=t}};(function(t,u){(function(s,i){t.exports=i()})(Yt,function(){var s="day";return function(i,n,h){var d=function(w){return w.add(4-w.isoWeekday(),s)},v=n.prototype;v.isoWeekYear=function(){return d(this).year()},v.isoWeek=function(w){if(!this.$utils().u(w))return this.add(7*(w-this.isoWeek()),s);var C,_,L,V,F=d(this),b=(C=this.isoWeekYear(),_=this.$u,L=(_?h.utc:h)().year(C).startOf("year"),V=4-L.isoWeekday(),L.isoWeekday()>4&&(V+=7),L.add(V,s));return F.diff(b,"week")+1},v.isoWeekday=function(w){return this.$utils().u(w)?this.day()||7:this.day(this.day()%7?w:w-7)};var E=v.startOf;v.startOf=function(w,C){var _=this.$utils(),L=!!_.u(C)||C;return _.p(w)==="isoweek"?L?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):E.bind(this)(w,C)}}})})(me);const ke=gt;var yt={},ge={get exports(){return yt},set exports(t){yt=t}};(function(t,u){(function(s,i){t.exports=i()})(Yt,function(){return function(s,i){var n=i.prototype,h=n.format;n.format=function(d){var v=this,E=this.$locale();if(!this.isValid())return h.bind(this)(d);var w=this.$utils(),C=(d||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,function(_){switch(_){case"Q":return Math.ceil((v.$M+1)/3);case"Do":return E.ordinal(v.$D);case"gggg":return v.weekYear();case"GGGG":return v.isoWeekYear();case"wo":return E.ordinal(v.week(),"W");case"w":case"ww":return w.s(v.week(),_==="w"?1:2,"0");case"W":case"WW":return w.s(v.isoWeek(),_==="W"?1:2,"0");case"k":case"kk":return w.s(String(v.$H===0?24:v.$H),_==="k"?1:2,"0");case"X":return Math.floor(v.$d.getTime()/1e3);case"x":return v.$d.getTime();case"z":return"["+v.offsetName()+"]";case"zzz":return"["+v.offsetName("long")+"]";default:return _}});return h.bind(this)(C)}}})})(ge);const ye=yt;var pt=function(){var t=function(m,c,o,f){for(o=o||{},f=m.length;f--;o[m[f]]=c);return o},u=[1,3],s=[1,5],i=[7,9,11,12,13,14,15,16,17,18,19,20,21,23,25,26,28,35,40],n=[1,15],h=[1,16],d=[1,17],v=[1,18],E=[1,19],w=[1,20],C=[1,21],_=[1,22],L=[1,23],V=[1,24],F=[1,25],b=[1,26],tt=[1,27],et=[1,29],it=[1,31],st=[1,34],nt=[5,7,9,11,12,13,14,15,16,17,18,19,20,21,23,25,26,28,35,40],H={trace:function(){},yy:{},symbols_:{error:2,start:3,directive:4,gantt:5,document:6,EOF:7,line:8,SPACE:9,statement:10,NL:11,dateFormat:12,inclusiveEndDates:13,topAxis:14,axisFormat:15,tickInterval:16,excludes:17,includes:18,todayMarker:19,title:20,acc_title:21,acc_title_value:22,acc_descr:23,acc_descr_value:24,acc_descr_multiline_value:25,section:26,clickStatement:27,taskTxt:28,taskData:29,openDirective:30,typeDirective:31,closeDirective:32,":":33,argDirective:34,click:35,callbackname:36,callbackargs:37,href:38,clickStatementDebug:39,open_directive:40,type_directive:41,arg_directive:42,close_directive:43,$accept:0,$end:1},terminals_:{2:"error",5:"gantt",7:"EOF",9:"SPACE",11:"NL",12:"dateFormat",13:"inclusiveEndDates",14:"topAxis",15:"axisFormat",16:"tickInterval",17:"excludes",18:"includes",19:"todayMarker",20:"title",21:"acc_title",22:"acc_title_value",23:"acc_descr",24:"acc_descr_value",25:"acc_descr_multiline_value",26:"section",28:"taskTxt",29:"taskData",33:":",35:"click",36:"callbackname",37:"callbackargs",38:"href",40:"open_directive",41:"type_directive",42:"arg_directive",43:"close_directive"},productions_:[0,[3,2],[3,3],[6,0],[6,2],[8,2],[8,1],[8,1],[8,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,2],[10,2],[10,1],[10,1],[10,1],[10,2],[10,1],[4,4],[4,6],[27,2],[27,3],[27,3],[27,4],[27,3],[27,4],[27,2],[39,2],[39,3],[39,3],[39,4],[39,3],[39,4],[39,2],[30,1],[31,1],[34,1],[32,1]],performAction:function(c,o,f,r,k,e,T){var a=e.length-1;switch(k){case 2:return e[a-1];case 3:this.$=[];break;case 4:e[a-1].push(e[a]),this.$=e[a-1];break;case 5:case 6:this.$=e[a];break;case 7:case 8:this.$=[];break;case 9:r.setDateFormat(e[a].substr(11)),this.$=e[a].substr(11);break;case 10:r.enableInclusiveEndDates(),this.$=e[a].substr(18);break;case 11:r.TopAxis(),this.$=e[a].substr(8);break;case 12:r.setAxisFormat(e[a].substr(11)),this.$=e[a].substr(11);break;case 13:r.setTickInterval(e[a].substr(13)),this.$=e[a].substr(13);break;case 14:r.setExcludes(e[a].substr(9)),this.$=e[a].substr(9);break;case 15:r.setIncludes(e[a].substr(9)),this.$=e[a].substr(9);break;case 16:r.setTodayMarker(e[a].substr(12)),this.$=e[a].substr(12);break;case 17:r.setDiagramTitle(e[a].substr(6)),this.$=e[a].substr(6);break;case 18:this.$=e[a].trim(),r.setAccTitle(this.$);break;case 19:case 20:this.$=e[a].trim(),r.setAccDescription(this.$);break;case 21:r.addSection(e[a].substr(8)),this.$=e[a].substr(8);break;case 23:r.addTask(e[a-1],e[a]),this.$="task";break;case 27:this.$=e[a-1],r.setClickEvent(e[a-1],e[a],null);break;case 28:this.$=e[a-2],r.setClickEvent(e[a-2],e[a-1],e[a]);break;case 29:this.$=e[a-2],r.setClickEvent(e[a-2],e[a-1],null),r.setLink(e[a-2],e[a]);break;case 30:this.$=e[a-3],r.setClickEvent(e[a-3],e[a-2],e[a-1]),r.setLink(e[a-3],e[a]);break;case 31:this.$=e[a-2],r.setClickEvent(e[a-2],e[a],null),r.setLink(e[a-2],e[a-1]);break;case 32:this.$=e[a-3],r.setClickEvent(e[a-3],e[a-1],e[a]),r.setLink(e[a-3],e[a-2]);break;case 33:this.$=e[a-1],r.setLink(e[a-1],e[a]);break;case 34:case 40:this.$=e[a-1]+" "+e[a];break;case 35:case 36:case 38:this.$=e[a-2]+" "+e[a-1]+" "+e[a];break;case 37:case 39:this.$=e[a-3]+" "+e[a-2]+" "+e[a-1]+" "+e[a];break;case 41:r.parseDirective("%%{","open_directive");break;case 42:r.parseDirective(e[a],"type_directive");break;case 43:e[a]=e[a].trim().replace(/'/g,'"'),r.parseDirective(e[a],"arg_directive");break;case 44:r.parseDirective("}%%","close_directive","gantt");break}},table:[{3:1,4:2,5:u,30:4,40:s},{1:[3]},{3:6,4:2,5:u,30:4,40:s},t(i,[2,3],{6:7}),{31:8,41:[1,9]},{41:[2,41]},{1:[2,1]},{4:30,7:[1,10],8:11,9:[1,12],10:13,11:[1,14],12:n,13:h,14:d,15:v,16:E,17:w,18:C,19:_,20:L,21:V,23:F,25:b,26:tt,27:28,28:et,30:4,35:it,40:s},{32:32,33:[1,33],43:st},t([33,43],[2,42]),t(i,[2,8],{1:[2,2]}),t(i,[2,4]),{4:30,10:35,12:n,13:h,14:d,15:v,16:E,17:w,18:C,19:_,20:L,21:V,23:F,25:b,26:tt,27:28,28:et,30:4,35:it,40:s},t(i,[2,6]),t(i,[2,7]),t(i,[2,9]),t(i,[2,10]),t(i,[2,11]),t(i,[2,12]),t(i,[2,13]),t(i,[2,14]),t(i,[2,15]),t(i,[2,16]),t(i,[2,17]),{22:[1,36]},{24:[1,37]},t(i,[2,20]),t(i,[2,21]),t(i,[2,22]),{29:[1,38]},t(i,[2,24]),{36:[1,39],38:[1,40]},{11:[1,41]},{34:42,42:[1,43]},{11:[2,44]},t(i,[2,5]),t(i,[2,18]),t(i,[2,19]),t(i,[2,23]),t(i,[2,27],{37:[1,44],38:[1,45]}),t(i,[2,33],{36:[1,46]}),t(nt,[2,25]),{32:47,43:st},{43:[2,43]},t(i,[2,28],{38:[1,48]}),t(i,[2,29]),t(i,[2,31],{37:[1,49]}),{11:[1,50]},t(i,[2,30]),t(i,[2,32]),t(nt,[2,26])],defaultActions:{5:[2,41],6:[2,1],34:[2,44],43:[2,43]},parseError:function(c,o){if(o.recoverable)this.trace(c);else{var f=new Error(c);throw f.hash=o,f}},parse:function(c){var o=this,f=[0],r=[],k=[null],e=[],T=this.table,a="",M=0,z=0,J=2,l=1,g=e.slice.call(arguments,1),y=Object.create(this.lexer),p={yy:{}};for(var x in this.yy)Object.prototype.hasOwnProperty.call(this.yy,x)&&(p.yy[x]=this.yy[x]);y.setInput(c,p.yy),p.yy.lexer=y,p.yy.parser=this,typeof y.yylloc>"u"&&(y.yylloc={});var A=y.yylloc;e.push(A);var D=y.options&&y.options.ranges;typeof p.yy.parseError=="function"?this.parseError=p.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function dt(){var N;return N=r.pop()||y.lex()||l,typeof N!="number"&&(N instanceof Array&&(r=N,N=r.pop()),N=o.symbols_[N]||N),N}for(var I,R,W,ht,G={},rt,P,It,at;;){if(R=f[f.length-1],this.defaultActions[R]?W=this.defaultActions[R]:((I===null||typeof I>"u")&&(I=dt()),W=T[R]&&T[R][I]),typeof W>"u"||!W.length||!W[0]){var mt="";at=[];for(rt in T[R])this.terminals_[rt]&&rt>J&&at.push("'"+this.terminals_[rt]+"'");y.showPosition?mt="Parse error on line "+(M+1)+`:
`+y.showPosition()+`
Expecting `+at.join(", ")+", got '"+(this.terminals_[I]||I)+"'":mt="Parse error on line "+(M+1)+": Unexpected "+(I==l?"end of input":"'"+(this.terminals_[I]||I)+"'"),this.parseError(mt,{text:y.match,token:this.terminals_[I]||I,line:y.yylineno,loc:A,expected:at})}if(W[0]instanceof Array&&W.length>1)throw new Error("Parse Error: multiple actions possible at state: "+R+", token: "+I);switch(W[0]){case 1:f.push(I),k.push(y.yytext),e.push(y.yylloc),f.push(W[1]),I=null,z=y.yyleng,a=y.yytext,M=y.yylineno,A=y.yylloc;break;case 2:if(P=this.productions_[W[1]][1],G.$=k[k.length-P],G._$={first_line:e[e.length-(P||1)].first_line,last_line:e[e.length-1].last_line,first_column:e[e.length-(P||1)].first_column,last_column:e[e.length-1].last_column},D&&(G._$.range=[e[e.length-(P||1)].range[0],e[e.length-1].range[1]]),ht=this.performAction.apply(G,[a,z,M,p.yy,W[1],k,e].concat(g)),typeof ht<"u")return ht;P&&(f=f.slice(0,-1*P*2),k=k.slice(0,-1*P),e=e.slice(0,-1*P)),f.push(this.productions_[W[1]][0]),k.push(G.$),e.push(G._$),It=T[f[f.length-2]][f[f.length-1]],f.push(It);break;case 3:return!0}}return!0}},ft=function(){var m={EOF:1,parseError:function(o,f){if(this.yy.parser)this.yy.parser.parseError(o,f);else throw new Error(o)},setInput:function(c,o){return this.yy=o||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var o=c.match(/(?:\r\n?|\n).*/g);return o?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var o=c.length,f=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-o),this.offset-=o;var r=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),f.length-1&&(this.yylineno-=f.length-1);var k=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:f?(f.length===r.length?this.yylloc.first_column:0)+r[r.length-f.length].length-f[0].length:this.yylloc.first_column-o},this.options.ranges&&(this.yylloc.range=[k[0],k[0]+this.yyleng-o]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),o=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+o+"^"},test_match:function(c,o){var f,r,k;if(this.options.backtrack_lexer&&(k={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(k.yylloc.range=this.yylloc.range.slice(0))),r=c[0].match(/(?:\r\n?|\n).*/g),r&&(this.yylineno+=r.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:r?r[r.length-1].length-r[r.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],f=this.performAction.call(this,this.yy,this,o,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),f)return f;if(this._backtrack){for(var e in k)this[e]=k[e];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,o,f,r;this._more||(this.yytext="",this.match="");for(var k=this._currentRules(),e=0;e<k.length;e++)if(f=this._input.match(this.rules[k[e]]),f&&(!o||f[0].length>o[0].length)){if(o=f,r=e,this.options.backtrack_lexer){if(c=this.test_match(f,k[e]),c!==!1)return c;if(this._backtrack){o=!1;continue}else return!1}else if(!this.options.flex)break}return o?(c=this.test_match(o,k[r]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var o=this.next();return o||this.lex()},begin:function(o){this.conditionStack.push(o)},popState:function(){var o=this.conditionStack.length-1;return o>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(o){return o=this.conditionStack.length-1-Math.abs(o||0),o>=0?this.conditionStack[o]:"INITIAL"},pushState:function(o){this.begin(o)},stateStackSize:function(){return this.conditionStack.length},options:{"case-insensitive":!0},performAction:function(o,f,r,k){switch(r){case 0:return this.begin("open_directive"),40;case 1:return this.begin("type_directive"),41;case 2:return this.popState(),this.begin("arg_directive"),33;case 3:return this.popState(),this.popState(),43;case 4:return 42;case 5:return this.begin("acc_title"),21;case 6:return this.popState(),"acc_title_value";case 7:return this.begin("acc_descr"),23;case 8:return this.popState(),"acc_descr_value";case 9:this.begin("acc_descr_multiline");break;case 10:this.popState();break;case 11:return"acc_descr_multiline_value";case 12:break;case 13:break;case 14:break;case 15:return 11;case 16:break;case 17:break;case 18:break;case 19:this.begin("href");break;case 20:this.popState();break;case 21:return 38;case 22:this.begin("callbackname");break;case 23:this.popState();break;case 24:this.popState(),this.begin("callbackargs");break;case 25:return 36;case 26:this.popState();break;case 27:return 37;case 28:this.begin("click");break;case 29:this.popState();break;case 30:return 35;case 31:return 5;case 32:return 12;case 33:return 13;case 34:return 14;case 35:return 15;case 36:return 16;case 37:return 18;case 38:return 17;case 39:return 19;case 40:return"date";case 41:return 20;case 42:return"accDescription";case 43:return 26;case 44:return 28;case 45:return 29;case 46:return 33;case 47:return 7;case 48:return"INVALID"}},rules:[/^(?:%%\{)/i,/^(?:((?:(?!\}%%)[^:.])*))/i,/^(?::)/i,/^(?:\}%%)/i,/^(?:((?:(?!\}%%).|\n)*))/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:#[^\n]*)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^#\n;]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^#:\n;]+)/i,/^(?:[^#:\n;]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[10,11],inclusive:!1},acc_descr:{rules:[8],inclusive:!1},acc_title:{rules:[6],inclusive:!1},close_directive:{rules:[],inclusive:!1},arg_directive:{rules:[3,4],inclusive:!1},type_directive:{rules:[2,3],inclusive:!1},open_directive:{rules:[1],inclusive:!1},callbackargs:{rules:[26,27],inclusive:!1},callbackname:{rules:[23,24,25],inclusive:!1},href:{rules:[20,21],inclusive:!1},click:{rules:[29,30],inclusive:!1},INITIAL:{rules:[0,5,7,9,12,13,14,15,16,17,18,19,22,28,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48],inclusive:!0}}};return m}();H.lexer=ft;function Q(){this.yy={}}return Q.prototype=H,H.Parser=Q,new Q}();pt.parser=pt;const pe=pt;O.extend(ke);O.extend(Ht);O.extend(ye);let Y="",Tt="",_t,wt="",K=[],Z=[],Dt={},Ct=[],ut=[],q="",Et="";const Pt=["active","done","crit","milestone"];let St=[],$=!1,At=!1,vt=0;const ve=function(t,u,s){ee.parseDirective(this,t,u,s)},xe=function(){Ct=[],ut=[],q="",St=[],ot=0,bt=void 0,lt=void 0,S=[],Y="",Tt="",Et="",_t=void 0,wt="",K=[],Z=[],$=!1,At=!1,vt=0,Dt={},ie()},be=function(t){Tt=t},Te=function(){return Tt},_e=function(t){_t=t},we=function(){return _t},De=function(t){wt=t},Ce=function(){return wt},Ee=function(t){Y=t},Se=function(){$=!0},Ae=function(){return $},Ie=function(){At=!0},Le=function(){return At},Fe=function(t){Et=t},Me=function(){return Et},ze=function(){return Y},Oe=function(t){K=t.toLowerCase().split(/[\s,]+/)},Ve=function(){return K},We=function(t){Z=t.toLowerCase().split(/[\s,]+/)},Ye=function(){return Z},Pe=function(){return Dt},Ne=function(t){q=t,Ct.push(t)},Be=function(){return Ct},Re=function(){let t=Wt();const u=10;let s=0;for(;!t&&s<u;)t=Wt(),s++;return ut=S,ut},Nt=function(t,u,s,i){return i.includes(t.format(u.trim()))?!1:t.isoWeekday()>=6&&s.includes("weekends")||s.includes(t.format("dddd").toLowerCase())?!0:s.includes(t.format(u.trim()))},Bt=function(t,u,s,i){if(!s.length||t.manualEndTime)return;let n;t.startTime instanceof Date?n=O(t.startTime):n=O(t.startTime,u,!0),n=n.add(1,"d");let h;t.endTime instanceof Date?h=O(t.endTime):h=O(t.endTime,u,!0);const[d,v]=Ge(n,h,u,s,i);t.endTime=d.toDate(),t.renderEndTime=v},Ge=function(t,u,s,i,n){let h=!1,d=null;for(;t<=u;)h||(d=u.toDate()),h=Nt(t,s,i,n),h&&(u=u.add(1,"d")),t=t.add(1,"d");return[u,d]},xt=function(t,u,s){s=s.trim();const n=/^after\s+([\d\w- ]+)/.exec(s.trim());if(n!==null){let d=null;if(n[1].split(" ").forEach(function(v){let E=U(v);E!==void 0&&(d?E.endTime>d.endTime&&(d=E):d=E)}),d)return d.endTime;{const v=new Date;return v.setHours(0,0,0,0),v}}let h=O(s,u.trim(),!0);if(h.isValid())return h.toDate();{kt.debug("Invalid date:"+s),kt.debug("With date format:"+u.trim());const d=new Date(s);if(d===void 0||isNaN(d.getTime()))throw new Error("Invalid date:"+s);return d}},Rt=function(t){const u=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return u!==null?[Number.parseFloat(u[1]),u[2]]:[NaN,"ms"]},Gt=function(t,u,s,i=!1){s=s.trim();let n=O(s,u.trim(),!0);if(n.isValid())return i&&(n=n.add(1,"d")),n.toDate();let h=O(t);const[d,v]=Rt(s);if(!Number.isNaN(d)){const E=h.add(d,v);E.isValid()&&(h=E)}return h.toDate()};let ot=0;const X=function(t){return t===void 0?(ot=ot+1,"task"+ot):t},je=function(t,u){let s;u.substr(0,1)===":"?s=u.substr(1,u.length):s=u;const i=s.split(","),n={};Ut(i,n,Pt);for(let d=0;d<i.length;d++)i[d]=i[d].trim();let h="";switch(i.length){case 1:n.id=X(),n.startTime=t.endTime,h=i[0];break;case 2:n.id=X(),n.startTime=xt(void 0,Y,i[0]),h=i[1];break;case 3:n.id=X(i[0]),n.startTime=xt(void 0,Y,i[1]),h=i[2];break}return h&&(n.endTime=Gt(n.startTime,Y,h,$),n.manualEndTime=O(h,"YYYY-MM-DD",!0).isValid(),Bt(n,Y,Z,K)),n},Xe=function(t,u){let s;u.substr(0,1)===":"?s=u.substr(1,u.length):s=u;const i=s.split(","),n={};Ut(i,n,Pt);for(let h=0;h<i.length;h++)i[h]=i[h].trim();switch(i.length){case 1:n.id=X(),n.startTime={type:"prevTaskEnd",id:t},n.endTime={data:i[0]};break;case 2:n.id=X(),n.startTime={type:"getStartDate",startData:i[0]},n.endTime={data:i[1]};break;case 3:n.id=X(i[0]),n.startTime={type:"getStartDate",startData:i[1]},n.endTime={data:i[2]};break}return n};let bt,lt,S=[];const jt={},qe=function(t,u){const s={section:q,type:q,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:u},task:t,classes:[]},i=Xe(lt,u);s.raw.startTime=i.startTime,s.raw.endTime=i.endTime,s.id=i.id,s.prevTaskId=lt,s.active=i.active,s.done=i.done,s.crit=i.crit,s.milestone=i.milestone,s.order=vt,vt++;const n=S.push(s);lt=s.id,jt[s.id]=n-1},U=function(t){const u=jt[t];return S[u]},Ue=function(t,u){const s={section:q,type:q,description:t,task:t,classes:[]},i=je(bt,u);s.startTime=i.startTime,s.endTime=i.endTime,s.id=i.id,s.active=i.active,s.done=i.done,s.crit=i.crit,s.milestone=i.milestone,bt=s,ut.push(s)},Wt=function(){const t=function(s){const i=S[s];let n="";switch(S[s].raw.startTime.type){case"prevTaskEnd":{const h=U(i.prevTaskId);i.startTime=h.endTime;break}case"getStartDate":n=xt(void 0,Y,S[s].raw.startTime.startData),n&&(S[s].startTime=n);break}return S[s].startTime&&(S[s].endTime=Gt(S[s].startTime,Y,S[s].raw.endTime.data,$),S[s].endTime&&(S[s].processed=!0,S[s].manualEndTime=O(S[s].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),Bt(S[s],Y,Z,K))),S[s].processed};let u=!0;for(const[s,i]of S.entries())t(s),u=u&&i.processed;return u},He=function(t,u){let s=u;j().securityLevel!=="loose"&&(s=se(u)),t.split(",").forEach(function(i){U(i)!==void 0&&(qt(i,()=>{window.open(s,"_self")}),Dt[i]=s)}),Xt(t,"clickable")},Xt=function(t,u){t.split(",").forEach(function(s){let i=U(s);i!==void 0&&i.classes.push(u)})},Qe=function(t,u,s){if(j().securityLevel!=="loose"||u===void 0)return;let i=[];if(typeof s=="string"){i=s.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let h=0;h<i.length;h++){let d=i[h].trim();d.charAt(0)==='"'&&d.charAt(d.length-1)==='"'&&(d=d.substr(1,d.length-2)),i[h]=d}}i.length===0&&i.push(t),U(t)!==void 0&&qt(t,()=>{he.runFunc(u,...i)})},qt=function(t,u){St.push(function(){const s=document.querySelector(`[id="${t}"]`);s!==null&&s.addEventListener("click",function(){u()})},function(){const s=document.querySelector(`[id="${t}-text"]`);s!==null&&s.addEventListener("click",function(){u()})})},Je=function(t,u,s){t.split(",").forEach(function(i){Qe(i,u,s)}),Xt(t,"clickable")},Ke=function(t){St.forEach(function(u){u(t)})},Ze={parseDirective:ve,getConfig:()=>j().gantt,clear:xe,setDateFormat:Ee,getDateFormat:ze,enableInclusiveEndDates:Se,endDatesAreInclusive:Ae,enableTopAxis:Ie,topAxisEnabled:Le,setAxisFormat:be,getAxisFormat:Te,setTickInterval:_e,getTickInterval:we,setTodayMarker:De,getTodayMarker:Ce,setAccTitle:Qt,getAccTitle:Jt,setDiagramTitle:Kt,getDiagramTitle:Zt,setDisplayMode:Fe,getDisplayMode:Me,setAccDescription:$t,getAccDescription:te,addSection:Ne,getSections:Be,getTasks:Re,addTask:qe,findTaskById:U,addTaskOrg:Ue,setIncludes:Oe,getIncludes:Ve,setExcludes:We,getExcludes:Ye,setClickEvent:Je,setLink:He,getLinks:Pe,bindFunctions:Ke,parseDuration:Rt,isInvalidDate:Nt};function Ut(t,u,s){let i=!0;for(;i;)i=!1,s.forEach(function(n){const h="^\\s*"+n+"\\s*$",d=new RegExp(h);t[0].match(d)&&(u[n]=!0,t.shift(1),i=!0)})}const $e=function(){kt.debug("Something is calling, setConf, remove the call")},ti=(t,u)=>{let s=[...t].map(()=>-1/0),i=[...t].sort((h,d)=>h.startTime-d.startTime||h.order-d.order),n=0;for(const h of i)for(let d=0;d<s.length;d++)if(h.startTime>=s[d]){s[d]=h.endTime,h.order=d+u,d>n&&(n=d);break}return n};let B;const ei=function(t,u,s,i){const n=j().gantt,h=j().securityLevel;let d;h==="sandbox"&&(d=ct("#i"+u));const v=h==="sandbox"?ct(d.nodes()[0].contentDocument.body):ct("body"),E=h==="sandbox"?d.nodes()[0].contentDocument:document,w=E.getElementById(u);B=w.parentElement.offsetWidth,B===void 0&&(B=1200),n.useWidth!==void 0&&(B=n.useWidth);const C=i.db.getTasks();let _=[];for(const m of C)_.push(m.type);_=Q(_);const L={};let V=2*n.topPadding;if(i.db.getDisplayMode()==="compact"||n.displayMode==="compact"){const m={};for(const o of C)m[o.section]===void 0?m[o.section]=[o]:m[o.section].push(o);let c=0;for(const o of Object.keys(m)){const f=ti(m[o],c)+1;c+=f,V+=f*(n.barHeight+n.barGap),L[o]=f}}else{V+=C.length*(n.barHeight+n.barGap);for(const m of _)L[m]=C.filter(c=>c.type===m).length}w.setAttribute("viewBox","0 0 "+B+" "+V);const F=v.select(`[id="${u}"]`),b=ne().domain([re(C,function(m){return m.startTime}),ae(C,function(m){return m.endTime})]).rangeRound([0,B-n.leftPadding-n.rightPadding]);function tt(m,c){const o=m.startTime,f=c.startTime;let r=0;return o>f?r=1:o<f&&(r=-1),r}C.sort(tt),et(C,B,V),ce(F,V,B,n.useMaxWidth),F.append("text").text(i.db.getDiagramTitle()).attr("x",B/2).attr("y",n.titleTopMargin).attr("class","titleText");function et(m,c,o){const f=n.barHeight,r=f+n.barGap,k=n.topPadding,e=n.leftPadding,T=oe().domain([0,_.length]).range(["#00B9FA","#F95002"]).interpolate(le);st(r,k,e,c,o,m,i.db.getExcludes(),i.db.getIncludes()),nt(e,k,c,o),it(m,r,k,e,f,T,c),H(r,k),ft(e,k,c,o)}function it(m,c,o,f,r,k,e){const a=[...new Set(m.map(l=>l.order))].map(l=>m.find(g=>g.order===l));F.append("g").selectAll("rect").data(a).enter().append("rect").attr("x",0).attr("y",function(l,g){return g=l.order,g*c+o-2}).attr("width",function(){return e-n.rightPadding/2}).attr("height",c).attr("class",function(l){for(const[g,y]of _.entries())if(l.type===y)return"section section"+g%n.numberSectionStyles;return"section section0"});const M=F.append("g").selectAll("rect").data(m).enter(),z=i.db.getLinks();if(M.append("rect").attr("id",function(l){return l.id}).attr("rx",3).attr("ry",3).attr("x",function(l){return l.milestone?b(l.startTime)+f+.5*(b(l.endTime)-b(l.startTime))-.5*r:b(l.startTime)+f}).attr("y",function(l,g){return g=l.order,g*c+o}).attr("width",function(l){return l.milestone?r:b(l.renderEndTime||l.endTime)-b(l.startTime)}).attr("height",r).attr("transform-origin",function(l,g){return g=l.order,(b(l.startTime)+f+.5*(b(l.endTime)-b(l.startTime))).toString()+"px "+(g*c+o+.5*r).toString()+"px"}).attr("class",function(l){const g="task";let y="";l.classes.length>0&&(y=l.classes.join(" "));let p=0;for(const[A,D]of _.entries())l.type===D&&(p=A%n.numberSectionStyles);let x="";return l.active?l.crit?x+=" activeCrit":x=" active":l.done?l.crit?x=" doneCrit":x=" done":l.crit&&(x+=" crit"),x.length===0&&(x=" task"),l.milestone&&(x=" milestone "+x),x+=p,x+=" "+y,g+x}),M.append("text").attr("id",function(l){return l.id+"-text"}).text(function(l){return l.task}).attr("font-size",n.fontSize).attr("x",function(l){let g=b(l.startTime),y=b(l.renderEndTime||l.endTime);l.milestone&&(g+=.5*(b(l.endTime)-b(l.startTime))-.5*r),l.milestone&&(y=g+r);const p=this.getBBox().width;return p>y-g?y+p+1.5*n.leftPadding>e?g+f-5:y+f+5:(y-g)/2+g+f}).attr("y",function(l,g){return g=l.order,g*c+n.barHeight/2+(n.fontSize/2-2)+o}).attr("text-height",r).attr("class",function(l){const g=b(l.startTime);let y=b(l.endTime);l.milestone&&(y=g+r);const p=this.getBBox().width;let x="";l.classes.length>0&&(x=l.classes.join(" "));let A=0;for(const[dt,I]of _.entries())l.type===I&&(A=dt%n.numberSectionStyles);let D="";return l.active&&(l.crit?D="activeCritText"+A:D="activeText"+A),l.done?l.crit?D=D+" doneCritText"+A:D=D+" doneText"+A:l.crit&&(D=D+" critText"+A),l.milestone&&(D+=" milestoneText"),p>y-g?y+p+1.5*n.leftPadding>e?x+" taskTextOutsideLeft taskTextOutside"+A+" "+D:x+" taskTextOutsideRight taskTextOutside"+A+" "+D+" width-"+p:x+" taskText taskText"+A+" "+D+" width-"+p}),j().securityLevel==="sandbox"){let l;l=ct("#i"+u);const g=l.nodes()[0].contentDocument;M.filter(function(y){return z[y.id]!==void 0}).each(function(y){var p=g.querySelector("#"+y.id),x=g.querySelector("#"+y.id+"-text");const A=p.parentNode;var D=g.createElement("a");D.setAttribute("xlink:href",z[y.id]),D.setAttribute("target","_top"),A.appendChild(D),D.appendChild(p),D.appendChild(x)})}}function st(m,c,o,f,r,k,e,T){const a=k.reduce((p,{startTime:x})=>p?Math.min(p,x):x,0),M=k.reduce((p,{endTime:x})=>p?Math.max(p,x):x,0),z=i.db.getDateFormat();if(!a||!M)return;const J=[];let l=null,g=O(a);for(;g.valueOf()<=M;)i.db.isInvalidDate(g,z,e,T)?l?l.end=g:l={start:g,end:g}:l&&(J.push(l),l=null),g=g.add(1,"d");F.append("g").selectAll("rect").data(J).enter().append("rect").attr("id",function(p){return"exclude-"+p.start.format("YYYY-MM-DD")}).attr("x",function(p){return b(p.start)+o}).attr("y",n.gridLineStartPadding).attr("width",function(p){const x=p.end.add(1,"day");return b(x)-b(p.start)}).attr("height",r-c-n.gridLineStartPadding).attr("transform-origin",function(p,x){return(b(p.start)+o+.5*(b(p.end)-b(p.start))).toString()+"px "+(x*m+.5*r).toString()+"px"}).attr("class","exclude-range")}function nt(m,c,o,f){let r=ue(b).tickSize(-f+c+n.gridLineStartPadding).tickFormat(Lt(i.db.getAxisFormat()||n.axisFormat||"%Y-%m-%d"));const e=/^([1-9]\d*)(minute|hour|day|week|month)$/.exec(i.db.getTickInterval()||n.tickInterval);if(e!==null){const T=e[1];switch(e[2]){case"minute":r.ticks(Vt.every(T));break;case"hour":r.ticks(Ot.every(T));break;case"day":r.ticks(zt.every(T));break;case"week":r.ticks(Mt.every(T));break;case"month":r.ticks(Ft.every(T));break}}if(F.append("g").attr("class","grid").attr("transform","translate("+m+", "+(f-50)+")").call(r).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),i.db.topAxisEnabled()||n.topAxis){let T=fe(b).tickSize(-f+c+n.gridLineStartPadding).tickFormat(Lt(i.db.getAxisFormat()||n.axisFormat||"%Y-%m-%d"));if(e!==null){const a=e[1];switch(e[2]){case"minute":T.ticks(Vt.every(a));break;case"hour":T.ticks(Ot.every(a));break;case"day":T.ticks(zt.every(a));break;case"week":T.ticks(Mt.every(a));break;case"month":T.ticks(Ft.every(a));break}}F.append("g").attr("class","grid").attr("transform","translate("+m+", "+c+")").call(T).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}function H(m,c){let o=0;const f=Object.keys(L).map(r=>[r,L[r]]);F.append("g").selectAll("text").data(f).enter().append(function(r){const k=r[0].split(de.lineBreakRegex),e=-(k.length-1)/2,T=E.createElementNS("http://www.w3.org/2000/svg","text");T.setAttribute("dy",e+"em");for(const[a,M]of k.entries()){const z=E.createElementNS("http://www.w3.org/2000/svg","tspan");z.setAttribute("alignment-baseline","central"),z.setAttribute("x","10"),a>0&&z.setAttribute("dy","1em"),z.textContent=M,T.appendChild(z)}return T}).attr("x",10).attr("y",function(r,k){if(k>0)for(let e=0;e<k;e++)return o+=f[k-1][1],r[1]*m/2+o*m+c;else return r[1]*m/2+c}).attr("font-size",n.sectionFontSize).attr("class",function(r){for(const[k,e]of _.entries())if(r[0]===e)return"sectionTitle sectionTitle"+k%n.numberSectionStyles;return"sectionTitle"})}function ft(m,c,o,f){const r=i.db.getTodayMarker();if(r==="off")return;const k=F.append("g").attr("class","today"),e=new Date,T=k.append("line");T.attr("x1",b(e)+m).attr("x2",b(e)+m).attr("y1",n.titleTopMargin).attr("y2",f-n.titleTopMargin).attr("class","today"),r!==""&&T.attr("style",r.replace(/,/g,";"))}function Q(m){const c={},o=[];for(let f=0,r=m.length;f<r;++f)Object.prototype.hasOwnProperty.call(c,m[f])||(c[m[f]]=!0,o.push(m[f]));return o}},ii={setConf:$e,draw:ei},si=t=>`
  .mermaid-main-font {
    font-family: "trebuchet ms", verdana, arial, sans-serif;
    font-family: var(--mermaid-font-family);
  }
  .exclude-range {
    fill: ${t.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${t.sectionBkgColor};
  }

  .section2 {
    fill: ${t.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${t.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${t.titleColor};
  }

  .sectionTitle1 {
    fill: ${t.titleColor};
  }

  .sectionTitle2 {
    fill: ${t.titleColor};
  }

  .sectionTitle3 {
    fill: ${t.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    // font-size: ${t.ganttFontSize};
    // text-height: 14px;
    font-family: 'trebuchet ms', verdana, arial, sans-serif;
    font-family: var(--mermaid-font-family);

  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${t.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
    text {
      font-family: ${t.fontFamily};
      fill: ${t.textColor};
    }
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${t.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: 'trebuchet ms', verdana, arial, sans-serif;
    font-family: var(--mermaid-font-family);
  }

  // .taskText:not([font-size]) {
  //   font-size: ${t.ganttFontSize};
  // }

  .taskTextOutsideRight {
    fill: ${t.taskTextDarkColor};
    text-anchor: start;
    // font-size: ${t.ganttFontSize};
    font-family: 'trebuchet ms', verdana, arial, sans-serif;
    font-family: var(--mermaid-font-family);

  }

  .taskTextOutsideLeft {
    fill: ${t.taskTextDarkColor};
    text-anchor: end;
    // font-size: ${t.ganttFontSize};
  }

  /* Special case clickable */
  .task.clickable {
    cursor: pointer;
  }
  .taskText.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${t.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${t.taskBkgColor};
    stroke: ${t.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${t.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${t.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${t.activeTaskBkgColor};
    stroke: ${t.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${t.doneTaskBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.textColor}    ;
    font-family: 'trebuchet ms', verdana, arial, sans-serif;
    font-family: var(--mermaid-font-family);
  }
`,ni=si,ai={parser:pe,db:Ze,renderer:ii,styles:ni};export{ai as diagram};
