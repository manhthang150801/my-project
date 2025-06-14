import{k as P,u as $,r as a,j as e,S as F,M as H}from"./index-Zlyefp4M.js";const U=()=>{const u="/api/v1",{id:h}=P(),g=$(),[s,m]=a.useState({educationCode:"",educationName:""}),[o,d]=a.useState({educationCode:"",educationName:""}),[j,f]=a.useState(!1),[v,b]=a.useState(""),[C,k]=a.useState(""),[p,S]=a.useState(!1),[w,r]=a.useState(!1),[x,y]=a.useState("");a.useEffect(()=>{(async()=>{r(!0);try{const t=localStorage.getItem("token"),n=await fetch(`${u}/educations/${h}`,{method:"GET",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"}});if(n.status===401){const L=await n.json();y(L.detail),i("Thông báo","Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.",!0),r(!1);return}const l=await n.json();l?m({educationCode:l.educationCode,educationName:l.educationName}):i("Lỗi","Không tìm thấy thông tin học vấn.",!0)}catch{i("Lỗi","Có lỗi xảy ra khi tải dữ liệu.",!0)}finally{r(!1)}})()},[h,u]);const N=c=>{const{name:t,value:n}=c.target;m({...s,[t]:n}),d({...o,[t]:""})},T=()=>s.educationCode.trim()?s.educationName.trim()?s.educationName.length>100?(d({...o,educationName:"Tên học vấn không được dài quá 100 ký tự."}),!1):!0:(d({...o,educationName:"Tên học vấn không được để trống."}),!1):(d({...o,educationCode:"Mã học vấn không được để trống."}),!1),M=async()=>{if(T()){r(!0);try{const c=localStorage.getItem("token"),t=await fetch(`${u}/educations`,{method:"PUT",headers:{Authorization:`Bearer ${c}`,"Content-Type":"application/json"},body:JSON.stringify({id:h,...s})});if(t.status===401){const l=await t.json();y(l.detail),i("Thông báo","Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.",!0),r(!1);return}const n=await t.json();n&&n.message==="updated"?i("Thành công","Cập nhật thành công!",!1):i("Lỗi","Cập nhật không thành công.",!0)}catch{i("Lỗi","Có lỗi xảy ra khi cập nhật.",!0)}finally{r(!1)}}},E=()=>{g(-1)},i=(c,t,n)=>{b(c),k(t),S(n),f(!0)},I=()=>{f(!1),p||g(-1),(x=="invalid_token"||x=="jwt_error")&&(localStorage.removeItem("token"),localStorage.removeItem("username"),localStorage.removeItem("roles"),g("/"))};return e.jsxs("div",{className:"flex items-center justify-center min-h-screen p-4 bg-gray-100 relative",children:[w&&e.jsx("div",{className:"fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50",children:e.jsx(F,{})}),e.jsxs("div",{className:"bg-white rounded-lg shadow-lg p-6 w-full max-w-md",children:[e.jsx("h2",{className:"text-2xl font-bold mb-4 text-gray-800 text-center",children:"Cập Nhật Học Vấn"}),e.jsxs("div",{children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{htmlFor:"educationCode",className:"block text-gray-700 font-medium mb-2",children:"Mã Học Vấn"}),e.jsx("input",{type:"text",id:"educationCode",name:"educationCode",value:s.educationCode,onChange:N,className:"w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300",placeholder:"Nhập mã học vấn"}),o.educationCode&&e.jsx("p",{className:"text-red-500 text-sm mt-2",children:o.educationCode})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{htmlFor:"educationName",className:"block text-gray-700 font-medium mb-2",children:"Tên Học Vấn"}),e.jsx("input",{type:"text",id:"educationName",name:"educationName",value:s.educationName,onChange:N,className:"w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300",placeholder:"Nhập tên học vấn"}),o.educationName&&e.jsx("p",{className:"text-red-500 text-sm mt-2",children:o.educationName})]}),e.jsxs("div",{className:"flex justify-center gap-4",children:[e.jsx("button",{type:"button",onClick:M,className:"px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300",children:"Cập Nhật"}),e.jsx("button",{type:"button",onClick:E,className:"px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-200",children:"Hủy"})]})]})]}),e.jsx(H,{isOpen:j,onClose:I,title:v,message:C,isError:p})]})};export{U as default};
