import{a as x,B as b,r as l,e as d,P as j,j as o,g as k,h as v,k as B,l as H,m as I,A as E,n as g}from"./sanity-3c473299.js";import{useDeskTool as y}from"./index-37eb7c2e-5856a91a.js";import"./json-inspector-a8bb93a6.js";var u;function C(t,e){return e||(e=t.slice(0)),Object.freeze(Object.defineProperties(t,{raw:{value:Object.freeze(e)}}))}function O(t){const{actionHandlers:e,index:s,menuItems:n,menuItemGroups:r,title:i}=t,{features:a}=y();return!(n!=null&&n.length)&&!i?null:o(v,{actions:o(B,{menuItems:n,menuItemGroups:r,actionHandlers:e}),backButton:a.backButton&&s>0&&o(H,{as:I,"data-as":"a",icon:E,mode:"bleed"}),title:i})}const A=x(b)(u||(u=C([`
  position: relative;
`])));function L(t){const{children:e}=t,{collapsed:s}=g();return o(A,{hidden:s,height:"fill",overflow:"auto",children:e})}function G(t){const{index:e,pane:s,paneKey:n,...r}=t,{child:i,component:a,menuItems:m,menuItemGroups:p,title:f="",type:T,...P}=s,[c,h]=l.useState(null);return d(j,{id:n,minWidth:320,selected:r.isSelected,children:[o(O,{actionHandlers:c==null?void 0:c.actionHandlers,index:e,menuItems:m,menuItemGroups:p,title:f}),d(L,{children:[k.isValidElementType(a)&&l.createElement(a,{...r,...P,ref:h,child:i,paneKey:n}),l.isValidElement(a)&&a]})]})}export{G as default};
