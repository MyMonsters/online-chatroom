// 处理所有后端返回的数据
export function processReturn(res: any) {
  // code 0:成功 1:错误 2:后端报错
  let { code, msg, data } = res;
  const toast = useToast();
  if (code) {
    // Vue.prototype.$message.error(msg);
    toast.add({
      title: msg,
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
    });
    return;
  }
  if (msg) {
    // Vue.prototype.$message.success(msg);
    toast.add({
      title: msg,
      icon: 'i-heroicons-check-circle',
    });
  }
  return data;
}
