<script setup lang="ts">
  import { ref, reactive, onBeforeMount, onMounted,toRefs } from 'vue'
  import COS from 'cos-js-sdk-v5';
  import useLoginStore from '@/store/modules/login'
  import useCos from '@/utils/cos'
  const loginStore = useLoginStore()
  const {userInfo} = loginStore

var Bucket = 'cy-1314976122';  /* 存储桶，必须字段 */
var Region = 'ap-chengdu';     /* 存储桶所在地域，必须字段 */
var data:any
// 目录为 type/username/filename
var directory = ''
var filename = ''
var type = 'article'
const dateDirectory = (type:string,directory:string,fileName:string):string => {
  return type+"/"+directory+"/"+new Date().getTime()+"-"+fileName
}
var cos = new COS({})

function handleFileInUploading(file:any,directory:any) {
  cos.uploadFile({
    Bucket: Bucket, /* 填写自己的 bucket，必须字段 */
    Region: Region,     /* 存储桶所在地域，必须字段 */
    Key: directory,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
    Body: file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
    onTaskReady: function(taskId) {                   /* 非必须 */
        console.log(taskId);
    },
    onHashProgress: function (progressData) {       /* 非必须 */
        console.log(JSON.stringify(progressData));
    },
    onProgress: function (progressData) {           /* 非必须 */
        console.log(JSON.stringify(progressData));
    }
  
    }, function(err, data) {
        console.log(err || data);
        const start = data.Location.split("/",1)[0].length + 1
        const end = data.Location.length
        
        const location = data.Location.substring(start,end)
        console.log('data.Location', location)
    }
  );
}
const getImgUrl = (directory:string) => {
  cos.getObjectUrl(
  {
    Bucket: Bucket, /* 填写自己的 bucket，必须字段 */
    Region: Region,     /* 存储桶所在地域，必须字段 */
    Key: directory,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
    Sign: true, /* 获取带签名的对象 URL */
  },
    function (err, data) {
      if (err) return console.log(err);
      /* url为对象访问 url */
      var url = data.Url;
      console.log('url', url)
      /* 复制 downloadUrl 的值到浏览器打开会自动触发下载 */
      var downloadUrl =
        url +
        (url.indexOf('?') > -1 ? '&' : '?') +
        'response-content-disposition=attachment'; // 补充强制下载的参数
    }
  );
}
onMounted(()=>{
  /* 选择文件 */
  const btn = document.getElementById('submitBtn') as HTMLElement | null;
  const msg = document.getElementById('msg') as HTMLElement;
  if(btn!=null){
    btn.onclick = function (e) {
      console.log('btn点击')
      cos = new COS({
        // getAuthorization 必选参数
        getAuthorization: function (options, callback) {
            // 服务端例子：https://github.com/tencentyun/qcloud-cos-sts-sdk/blob/master/scope.md
            // 异步获取临时密钥
            var url = 'http://localhost:8049/cos/secret'; // url 替换成您自己的后端服务
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function (e:any) {
                try {
                    data = JSON.parse(e.target.responseText);
                    directory = data.data.directory
                    console.log('data:', data)
                    var credentials = data.credentials;
                } catch (e) {
                }
                if (!data || !credentials) {
                    return console.error('credentials invalid:\n' + JSON.stringify(data, null, 2))
                };
                callback({
                    TmpSecretId: credentials.tmpSecretId,
                    TmpSecretKey: credentials.tmpSecretKey,
                    SecurityToken: credentials.sessionToken,
                    // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                    StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
                    ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
                    ScopeLimit: true, // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
                });
            };
            // xhr.send(JSON.stringify(options.Scope));
            
            const params = JSON.stringify({"directory":directory,"filename":filename,"bucketName":`${Bucket}`})
            console.log('params:', params)
            xhr.send(params);

            
        }
      });
      console.log('123', 123)
      const input = document.getElementById('fileSelector') as HTMLInputElement | null;

      if(input!=null && input.files!=null){
        filename = input.files[0].name
          var file = input.files[0];
        if (!file) {
          

          msg.innerText = '提示：未选择上传文件';
          return;
        }
        msg.innerText = '';
        directory = dateDirectory(type,userInfo.data.username,filename)
        console.log('directory:', directory)
        handleFileInUploading(file,directory);
      };
    }
  }

  const btn2 = document.getElementById('submitBtn2') as HTMLElement;
  btn2.onclick = function (e) {
    directory = "article/aa/1677197236138-85fd56e0f3491e2617ea9971b57f0e0a.png"
    cos = new COS({
        // getAuthorization 必选参数
        getAuthorization: function (options, callback) {
            // 服务端例子：https://github.com/tencentyun/qcloud-cos-sts-sdk/blob/master/scope.md
            // 异步获取临时密钥
            var url = 'http://localhost:8049/cos/secret'; // url 替换成您自己的后端服务
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function (e:any) {
                try {
                    data = JSON.parse(e.target.responseText);
                    directory = data.data.directory
                    console.log('data:', data)
                    var credentials = data.credentials;
                } catch (e) {
                }
                if (!data || !credentials) {
                    return console.error('credentials invalid:\n' + JSON.stringify(data, null, 2))
                };
                callback({
                    TmpSecretId: credentials.tmpSecretId,
                    TmpSecretKey: credentials.tmpSecretKey,
                    SecurityToken: credentials.sessionToken,
                    // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                    StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
                    ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
                    ScopeLimit: true, // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
                });
            };
            // xhr.send(JSON.stringify(options.Scope));
            
            const params = JSON.stringify({"directory":directory,"filename":filename,"bucketName":Bucket})
            console.log('params:', params)
            xhr.send(params);

            
        }
      });
    console.log('btn2点击')
    const input = document.getElementById('fileSelector') as HTMLInputElement | null;

      if(input!=null && input.files!=null){
        filename = input.files[0].name
          var file = input.files[0];
        if (!file) {
          

          msg.innerText = '提示：未选择上传文件';
          return;
        }
        msg.innerText = '';
        
        getImgUrl(directory)

      };

  }









  
})


</script>

<template>
  <div class="containers">
    <!-- html 页面 DOM 元素 -->

    <!-- 选择要上传的文件 -->
    <input id="fileSelector" type="file" />
    <!-- 点击按钮上传 -->
    <input id="submitBtn" type="submit" />
    <div id="msg"></div>
     <!-- 点击按钮获取图片url -->
     <input id="submitBtn2" type="submit" />
    <div id="msg2"></div>
  </div>
</template>

<style scoped>
  
</style>
