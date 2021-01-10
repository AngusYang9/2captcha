const express = require('express')
const multer  = require('multer')
const fetch = require('node-fetch')
const FormData = require('form-data')
const qs = require('qs')
const fs = require('fs')
const path = require('path')

const app = express()
const upload = multer({ dest: 'captcha-files/' })

app.post('/', upload.single('captcha'), function (req, res, next) {
  // req.file 是 `captcha` 文件的信息
  // req.body 将具有文本域数据，如果存在的话
  sendCaptcha(req.file.path, function (ret) {
    if (ret && !ret['error_text']) {
      setTimeout(function () {
        fetchResponseById(ret.request, function (codeRet) {
          res.end(JSON.stringify(codeRet))
        })
      }, 1000)
    } else {
      res.end(JSON.stringify(ret))
    }
  })
})

function sendCaptcha(captchaFilePath, callback) {
  const form = new FormData()
  form.append('key', 'e608e3872caa13244813d9e4d3c78ddd')
  form.append('json', '1')
  form.append('file', fs.createReadStream(path.resolve(__dirname, captchaFilePath)))
  fetch('https://2captcha.com/in.php', {
    method: 'post',
    body:    form
  })
    .then(res => res.json())
    .then(json => callback(json));
}

function fetchResponseById(id, callback) {
  const param = {
    key: 'e608e3872caa13244813d9e4d3c78ddd',
    action: 'get',
    json: '1',
    id
  }
  fetch('https://2captcha.com/res.php?' + qs.stringify(param))
    .then(res => res.json())
    .then(json => {
      if (json.request === 'CAPCHA_NOT_READY') {
        setTimeout(fetchResponseById.bind(null, ...arguments), 800)
      } else {
        callback(json)
      }
    });
}

const server = app.listen(3005, function () {
  const host = server.address().address
  const port = server.address().port
  
  console.log("应用实例，访问地址为 http://localhost:" + port)
})
