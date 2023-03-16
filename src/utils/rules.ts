/* 银行账户 */
export function validateAccountNumber(str: string) {
  const reg = /^([1-9]{1})(\d{14}|\d{18})$/
  return reg.test(str)
}
// 用户名验证
export function validateUserName(str: string) {
  // 字母开头且6-20个字符
  const reg = /^[a-zA-Z]\w{5,9}$/
  return reg.test(str)
}
// 密码验证
export function validatePassword(str: string) {
  // 密码 6-24 个字符
  const reg = /^\w{6,24}$/
  return reg.test(str)
}
// 昵称验证
export function validateNickName(str: string) {
  // 字母开头且6-20个字符
  const reg = /^\S{5,9}$/
  return reg.test(str)
}
// 标题验证
export function validateTitle(str: string) {
  // 6-20个字符
  const reg = /\S{1,20}$/
  return reg.test(str)
}
// 文章验证
export function validateArticle(str: string) {
  // 6-20个字符
  const reg = /\S{1,300}$/
  return reg.test(str)
}
// 邮箱验证 /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
