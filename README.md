# 2captcha

识别图片验证码 api

## 使用方法

Api: `http://www.imyangyong.com:3005`

Method: post

Request body:

| Param   | Value          |
| ------- | -------------- |
| captcha | 图片验证码文件 |

Response body:

| Key     | Value           |
| ------- | --------------- |
| status  | 1: 成功 0: 失败 |
| request | 结果值          |

