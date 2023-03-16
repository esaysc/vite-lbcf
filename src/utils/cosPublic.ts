import COS from 'cos-js-sdk-v5'
import { toRefs } from 'vue'
import useCosStore from '@/store/modules/cosStore'
const cosStore = useCosStore()
const { imgUrl } = toRefs(cosStore)
const { setImgUrl } = cosStore

var data: any
var filename = ''

// 创建时间戳命名目录
// 目录为 type/username/time-filename
const dateDirectory = (
  type: string,
  directory: string,
  fileName: string
): string => {
  return type + '/' + directory + '/' + new Date().getTime() + '-' + fileName
}

var cos = new COS({})
// 上传文件
async function handleFileInUploading(
  bucket: string,
  region: string,
  directory: any,
  file: any
): Promise<string> {
  const temp = cos.uploadFile(
    {
      Bucket: bucket /* 填写自己的 bucket，必须字段 */,
      Region: region /* 存储桶所在地域，必须字段 */,
      Key: directory /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
      Body: file /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */,
      onTaskReady: function (taskId) {
        /* 非必须 */
        console.log(taskId)
      },
      onHashProgress: function (progressData) {
        /* 非必须 */
        console.log(JSON.stringify(progressData))
      },
      onProgress: function (progressData) {
        /* 非必须 */
        console.log(JSON.stringify(progressData))
      },
    }
    // function (err, data) {
    //   console.log(err || data)
    //   setImgUrl(data.Location)
    //   console.log('imgUrl', imgUrl.value)
    // }
  )
  const res = await temp
  return res.Location
}
// 获取指定图片临时url
const getImgUrl = (bucket: string, region: string, directory: string) => {
  cos.getObjectUrl(
    {
      Bucket: bucket /* 填写自己的 bucket，必须字段 */,
      Region: region /* 存储桶所在地域，必须字段 */,
      Key: directory /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
      Sign: true /* 获取带签名的对象 URL */,
    },
    function (err, data) {
      if (err) return console.log(err)
      /* url为对象访问 url */
      var url = data.Url
      console.log('url', url)
      /* 复制 downloadUrl 的值到浏览器打开会自动触发下载 */
      var downloadUrl =
        url +
        (url.indexOf('?') > -1 ? '&' : '?') +
        'response-content-disposition=attachment' // 补充强制下载的参数
    }
  )
}
// 创建 COS 对象
const createCos = (bucket: string, directory: string): COS => {
  cos = new COS({
    getAuthorization: function (options, callback) {
      var url = 'http://localhost:8049/cos/secret' // url 替换成您自己的后端服务
      var xhr = new XMLHttpRequest()
      xhr.open('POST', url, true)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.onload = function (e: any) {
        try {
          data = JSON.parse(e.target.responseText)
          directory = data.data.directory
          console.log('data:', data)
          var credentials = data.credentials
        } catch (e) {}
        if (!data || !credentials) {
          return console.error(
            'credentials invalid:\n' + JSON.stringify(data, null, 2)
          )
        }
        callback({
          TmpSecretId: credentials.tmpSecretId,
          TmpSecretKey: credentials.tmpSecretKey,
          SecurityToken: credentials.sessionToken,
          // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
          StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
          ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
          ScopeLimit: true, // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
        })
      }
      // xhr.send(JSON.stringify(options.Scope));

      const params = JSON.stringify({
        directory: directory,
        filename: filename,
        bucketName: bucket,
      })
      xhr.send(params)
    },
  })
  return cos
}

export default { dateDirectory, handleFileInUploading, getImgUrl, createCos }
