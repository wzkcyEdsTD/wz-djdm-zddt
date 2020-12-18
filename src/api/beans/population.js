import axios from "axios";
import crypto from "crypto";
/**
 * 实时人口对接
 */
//获取token
const url = "https://webapi.getui.com/api/";
const appKey = "wenzhou_PAPI_wzsjj";
const masterSecret =
  "dfd28b6141e6b19e7a20f7dde4a0020ec626034f7379abc79a8312a0f0a668f1470d26258f296cb3bd5c808bb3608d713d58d238a60569aa98bfa0b3fcb793ac";
const timestamp = Math.round(new Date() / 1000);
const version = "v1.0";
export async function creditAuth() {
  const instance = axios.create();
  const md5Time = appKey + setMd5(timestamp.toString()) + masterSecret;
  const sign = setSha(md5Time) + masterSecret;
  try {
    const { data } = await instance.post(url + "auth/creditAuth", {
      appKey: appKey,
      sign: sign,
      timestamp: timestamp,
      version: version,
    });
    console.log(data);
    //return data.length && data[0].au_username == username;
  } catch (err) {
    console.log(err);
    return false;
  }
}
//md5加密
function setMd5(time) {
  var md5 = crypto.createHash("md5");
  md5.update(time); //this.pw2这是你要加密的密码
  return md5.digest("hex"); //this.pw这就是你加密完的密码，这个往后台传就行了
}
//sha256加密
function setSha(md5Time) {
  let sha256 = require("js-sha256").sha256; //这里用的是require方法，所以没用import
  return sha256(md5Time); //要加密的密码
}
