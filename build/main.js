var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.arrayIteratorImpl=function(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}};$jscomp.arrayIterator=function(a){return{next:$jscomp.arrayIteratorImpl(a)}};$jscomp.makeIterator=function(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):$jscomp.arrayIterator(a)};$jscomp.arrayFromIterator=function(a){for(var b,c=[];!(b=a.next()).done;)c.push(b.value);return c};
$jscomp.arrayFromIterable=function(a){return a instanceof Array?a:$jscomp.arrayFromIterator($jscomp.makeIterator(a))};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};
$jscomp.getGlobal=function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global&&null!=global?global:a};$jscomp.global=$jscomp.getGlobal(this);$jscomp.polyfill=function(a,b,c,d){if(b){c=$jscomp.global;a=a.split(".");for(d=0;d<a.length-1;d++){var e=a[d];e in c||(c[e]={});c=c[e]}a=a[a.length-1];d=c[a];b=b(d);b!=d&&null!=b&&$jscomp.defineProperty(c,a,{configurable:!0,writable:!0,value:b})}};
$jscomp.polyfill("Number.isNaN",function(a){return a?a:function(a){return"number"===typeof a&&isNaN(a)}},"es6","es3");
var App={elements:null,state:{offset:{x:0,y:0},mouse:{isDown:!1,start:{x:0,y:0},current:{x:0,y:0}},grid:[]},settings:{countX:5,countY:5,scale:1,scaleStep:.8,gridElementSize:30},OnCountXChanged:function(a){a=/\d*/g.exec(a.target.value);App.SetCountX(a[0]?+a[0]:void 0)},OnCountYChanged:function(a){a=/\d*/g.exec(a.target.value);App.SetCountY(a[0]?+a[0]:void 0)},OnScaleWheel:function(a){return(0<a.deltaY?App.OnScaleDown:App.OnScaleUp)()},OnScaleChanged:function(a){a=/[0-9\.]*/g.exec(a.target.value);App.SetScale(a[0]?
.01*+a[0]:void 0)},OnScaleUp:function(){return App.SetScale(App.settings.scale/App.settings.scaleStep)},OnScaleDown:function(){return App.SetScale(App.settings.scale*App.settings.scaleStep)},OnScaleReset:function(){return App.SetScale(1)},OnMovingDown:function(a){if(0===a.button){var b=App.state.mouse;b.start.x=a.screenX;b.start.y=a.screenY;b.current.x=b.start.x;b.current.y=b.start.y;b.isDown=!0}},OnMovingMove:function(a){var b=App.state,c=b.mouse;b=b.offset;if(c.isDown){c.current.x=a.screenX;c.current.y=
a.screenY;a=c.start;var d=c.current.y-a.y;App.Var("offset-x",b.x+(c.current.x-a.x)+"px");App.Var("offset-y",b.y+d+"px")}},OnMovingUp:function(a){if(0===a.button){var b=App.state;a=b.mouse;b=b.offset;a.isDown&&(a.isDown=!1,App.SetOffset(b.x+a.current.x-a.start.x,b.y+a.current.y-a.start.y))}},OnMovingReset:function(){return App.SetOffset(0,0)},OnCellClick:function(){var a=this.element;App.SetGridElement(a,{direction:a.direction+1})},OnCellContext:function(a){a.preventDefault();a=this.element;App.SetGridElement(a,
{direction:a.direction-1})},OnGenerate:function(){return App.Generate()},SetScale:function(a){a||(a=App.settings.scale);App.settings.scale=a;App.elements.scaleInput.value=(100*a).toFixed(2)+"%";App.Var("scale",a)},SetOffset:function(a,b){a=Number.isNaN(+a)?App.state.offset.x:a;b=Number.isNaN(+b)?App.state.offset.y:b;App.state.offset.x=a;App.state.offset.y=b;App.Var("offset-x",a+"px");App.Var("offset-y",b+"px")},SetCountX:function(a){a||(a=App.settings.countX);App.settings.countX=a;App.elements.countXInput.value=
a},SetCountY:function(a){a||(a=App.settings.countY);App.settings.countY=a;App.elements.countYInput.value=a},SetGridElement:function(a,b){var c=b.direction;void 0!==c&&(c=Number.isNaN(+c)?0:+c,App.VarElem(a.arrow,"r",90*c+"deg"),App.VarElem(a.number,"r",90*-c+"deg"),a.direction=c);c=b.index;void 0!==c&&(c=Number.isNaN(+c)?0:+c,a.index=c);b=b.count;void 0!==b&&(b=Number.isNaN(+b)?0:+b,a.count=b);a.number.innerText=a.index+","+a.count},SetGridElementXY:function(a,b,c){return App.SetGridElement(App.state.grid[b][a],
c)},Generate:function(){var a=App.settings;App.state.grid=App.CreateGrid({gridElementSize:a.gridElementSize,countX:a.countX,countY:a.countY,articleObject:App.elements.articleObject})},CreateArrowElement:function(){var a=App.Create("span"),b=App.Create("span"),c=App.Create("span");a.className="arrow";b.className="arrow__icon";c.className="arrow__number";a.appendChild(b);b.appendChild(c);a.addEventListener("click",App.OnCellClick,!0);a.addEventListener("contextmenu",App.OnCellContext,!0);b={span:a,
arrow:b,number:c,direction:0,index:0,count:0};return a.element=b},CreateGrid:function(a){var b=a.articleObject,c=a.gridElementSize,d=a.countX;a=a.countY;b.innerHTML="";b.style.width=d*c+"px";b.style.height=a*c+"px";b=Array(a);for(var e=c=0;c<a;c++){b[c]=Array(d);for(var f=0;f<d;f++,e++){var g=App.CreateArrowElement();App.elements.articleObject.appendChild(g.span);App.SetGridElement(g,{index:e});b[c][f]=g}}return b},GetElements:function(){var a={};[].concat($jscomp.arrayFromIterable(App.Tag("input")),
$jscomp.arrayFromIterable(App.Tag("button")),$jscomp.arrayFromIterable(App.Tag("article")),$jscomp.arrayFromIterable(App.Tag("main"))).forEach(function(b){return a[b.id]=b});return a},PrepareElements:function(){var a=App.elements,b=a.countXInput,c=a.countYInput,d=a.scaleInput,e=a.scaleUpButton,f=a.scaleDownButton,g=a.scaleResetButton,k=a.offsetResetButton,h=a.mainObject;a.generateButton.addEventListener("click",App.OnGenerate);b.addEventListener("change",App.OnCountXChanged,!0);c.addEventListener("change",
App.OnCountYChanged,!0);d.addEventListener("change",App.OnScaleChanged,!0);e.addEventListener("click",App.OnScaleUp);f.addEventListener("click",App.OnScaleDown);g.addEventListener("click",App.OnScaleReset);k.addEventListener("click",App.OnMovingReset);h.addEventListener("wheel",App.OnScaleWheel,!0);h.addEventListener("mousedown",App.OnMovingDown,!0);window.addEventListener("mouseup",App.OnMovingUp,!0);h.addEventListener("mousemove",App.OnMovingMove,!0);App.SetScale(App.state.scale);App.Generate()},
Tag:function(a){return document.getElementsByTagName(a)},Class:function(a){return document.getElementsByClassName(a)},Get:function(a){return document.getElementById(a)},Var:function(a,b){return document.documentElement.style.setProperty("--"+a,b)},VarElem:function(a,b,c){return a.style.setProperty("--"+b,c)},Create:function(a){return document.createElement(a)},Start:function(){App.elements=App.GetElements();App.PrepareElements()}};window.onload=App.Start;