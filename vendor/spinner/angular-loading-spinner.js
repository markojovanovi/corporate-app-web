;(function(root,factory){if(typeof module=='object'&&module.exports)module.exports=factory()
else if(typeof define=='function'&&define.amd)define(factory)
else root.Spinner=factory()}(this,function(){"use strict"
var prefixes=['webkit','Moz','ms','O'],animations={},useCssAnimations,sheet
function createEl(tag,prop){var el=document.createElement(tag||'div'),n
for(n in prop)el[n]=prop[n]
return el}
function ins(parent){for(var i=1,n=arguments.length;i<n;i++){parent.appendChild(arguments[i])}
return parent}
function addAnimation(alpha,trail,i,lines){var name=['opacity',trail,~~(alpha*100),i,lines].join('-'),start=0.01+i/lines*100,z=Math.max(1-(1-alpha)/trail*(100-start),alpha),prefix=useCssAnimations.substring(0,useCssAnimations.indexOf('Animation')).toLowerCase(),pre=prefix&&'-'+prefix+'-'||''
if(!animations[name]){sheet.insertRule('@'+pre+'keyframes '+name+'{'+'0%{opacity:'+z+'}'+start+'%{opacity:'+alpha+'}'+(start+0.01)+'%{opacity:1}'+(start+trail)%100+'%{opacity:'+alpha+'}'+'100%{opacity:'+z+'}'+'}',sheet.cssRules.length)
animations[name]=1}
return name}
function vendor(el,prop){var s=el.style,pp,i
prop=prop.charAt(0).toUpperCase()+prop.slice(1)
if(s[prop]!==undefined)return prop
for(i=0;i<prefixes.length;i++){pp=prefixes[i]+prop
if(s[pp]!==undefined)return pp}}
function css(el,prop){for(var n in prop){el.style[vendor(el,n)||n]=prop[n]}
return el}
function merge(obj){for(var i=1;i<arguments.length;i++){var def=arguments[i]
for(var n in def){if(obj[n]===undefined)obj[n]=def[n]}}
return obj}
function getColor(color,idx){return typeof color=='string'?color:color[idx%color.length]}
var defaults={lines:12,length:7,width:5,radius:10,scale:1.0,corners:1,color:'#000',opacity:1/4,rotate:0,direction:1,speed:1,trail:100,fps:20,zIndex:2e9,className:'spinner',top:'50%',left:'50%',shadow:false,hwaccel:false,position:'absolute'}
function Spinner(o){this.opts=merge(o||{},Spinner.defaults,defaults)}
Spinner.defaults={}
merge(Spinner.prototype,{spin:function(target){this.stop()
var self=this,o=self.opts,el=self.el=createEl(null,{className:o.className})
css(el,{position:o.position,width:0,zIndex:o.zIndex,left:o.left,top:o.top})
if(target){target.insertBefore(el,target.firstChild||null)}
el.setAttribute('role','progressbar')
self.lines(el,self.opts)
if(!useCssAnimations){var i=0,start=(o.lines-1)*(1-o.direction)/2,alpha,fps=o.fps,f=fps/o.speed,ostep=(1-o.opacity)/(f*o.trail/100),astep=f/o.lines;(function anim(){i++
for(var j=0;j<o.lines;j++){alpha=Math.max(1-(i+(o.lines-j)*astep)%f*ostep,o.opacity)
self.opacity(el,j*o.direction+start,alpha,o)}
self.timeout=self.el&&setTimeout(anim,~~(1000/fps))})()}
return self},stop:function(){var el=this.el
if(el){clearTimeout(this.timeout)
if(el.parentNode)el.parentNode.removeChild(el)
this.el=undefined}
return this},lines:function(el,o){var i=0,start=(o.lines-1)*(1-o.direction)/2,seg
function fill(color,shadow){return css(createEl(),{position:'absolute',width:o.scale*(o.length+o.width)+'px',height:o.scale*o.width+'px',background:color,boxShadow:shadow,transformOrigin:'left',transform:'rotate('+~~(360/o.lines*i+o.rotate)+'deg) translate('+o.scale*o.radius+'px'+',0)',borderRadius:(o.corners*o.scale*o.width>>1)+'px'})}
for(;i<o.lines;i++){seg=css(createEl(),{position:'absolute',top:1+~(o.scale*o.width/2)+'px',transform:o.hwaccel?'translate3d(0,0,0)':'',opacity:o.opacity,animation:useCssAnimations&&addAnimation(o.opacity,o.trail,start+i*o.direction,o.lines)+' '+1/o.speed+'s linear infinite'})
if(o.shadow)ins(seg,css(fill('#000','0 0 4px #000'),{top:'2px'}))
ins(el,ins(seg,fill(getColor(o.color,i),'0 0 1px rgba(0,0,0,.1)')))}
return el},opacity:function(el,i,val){if(i<el.childNodes.length)el.childNodes[i].style.opacity=val}})
function initVML(){function vml(tag,attr){return createEl('<'+tag+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',attr)}
sheet.addRule('.spin-vml','behavior:url(#default#VML)')
Spinner.prototype.lines=function(el,o){var r=o.scale*(o.length+o.width),s=o.scale*2*r
function grp(){return css(vml('group',{coordsize:s+' '+s,coordorigin:-r+' '+-r}),{width:s,height:s})}
var margin=-(o.width+o.length)*o.scale*2+'px',g=css(grp(),{position:'absolute',top:margin,left:margin}),i
function seg(i,dx,filter){ins(g,ins(css(grp(),{rotation:360/o.lines*i+'deg',left:~~dx}),ins(css(vml('roundrect',{arcsize:o.corners}),{width:r,height:o.scale*o.width,left:o.scale*o.radius,top:-o.scale*o.width>>1,filter:filter}),vml('fill',{color:getColor(o.color,i),opacity:o.opacity}),vml('stroke',{opacity:0}))))}
if(o.shadow)
for(i=1;i<=o.lines;i++){seg(i,-2,'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')}
for(i=1;i<=o.lines;i++)seg(i)
return ins(el,g)}
Spinner.prototype.opacity=function(el,i,val,o){var c=el.firstChild
o=o.shadow&&o.lines||0
if(c&&i+o<c.childNodes.length){c=c.childNodes[i+o];c=c&&c.firstChild;c=c&&c.firstChild
if(c)c.opacity=val}}}
if(typeof document!=='undefined'){sheet=(function(){var el=createEl('style',{type:'text/css'})
ins(document.getElementsByTagName('head')[0],el)
return el.sheet||el.styleSheet}())
var probe=css(createEl('group'),{behavior:'url(#default#VML)'})
if(!vendor(probe,'transform')&&probe.adj)initVML()
else useCssAnimations=vendor(probe,'animation')}
return Spinner}));