/**
 * 通用js方法封装处理
 * Copyright (c) 2019 ruoyi
 */
import {Notification} from 'element-ui'

import axios from 'axios'

import Vue from "vue"


const baseURL = process.env.VUE_APP_BASE_API

// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

// 添加日期范围
export function addDateRange(params, dateRange) {
  var search = params;
  search.beginTime = "";
  search.endTime = "";
  if (null != dateRange && '' != dateRange) {
    search.beginTime = this.dateRange[0];
    search.endTime = this.dateRange[1];
  }
  return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  var actions = [];
  Object.keys(datas).map((key) => {
    if (datas[key].dictValue === ('' + value)) {
      actions.push(datas[key].dictLabel);
      return false;
    }
  })
  return actions.join('');
}

// 通用下载方法
export function download(fileName) {
  window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

// 字符串格式化(%s )
export function sprintf(str) {
  var args = arguments, flag = true, i = 1;
  str = str.replace(/%s/g, function () {
    var arg = args[i++];
    if (typeof arg === 'undefined') {
      flag = false;
      return '';
    }
    return arg;
  });
  return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function parseStrEmpty(str) {
  if (!str || str === "undefined" || str === "null") {
    return "";
  }
  return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  //循环所有项
  const treeData = cloneData.filter(father => {
    let branchArr = cloneData.filter(child => {
      //返回每一项的子级数组
      return father[id] === child[parentId]
    });
    branchArr.length > 0 ? father.children = branchArr : '';
    //返回第一层
    return father[parentId] === rootId;
  });
  return treeData !== '' ? treeData : data;
}

/**
 * 导出excelFile文件
 * @param url 下载路径
 * @param data 参数
 * @param fileName
 */
export const exportExcelFile = async (url, data = {}, fileName = 'statistics.xls') => {
  //调用方法
  const result = await postDownloadFile(url, data);
  let blob = new Blob([result]);
  let eLink = document.createElement('a');
  eLink.download = fileName + '.xls';
  eLink.style.display = 'none';
  eLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eLink);
  eLink.click();
  URL.revokeObjectURL(eLink.href); // 释放URL 对象
  document.body.removeChild(eLink);
}

/**
 * 校验图片文件类型
 * @param file 文件
 */
export const checkPhoneFileTypeAndFileSize = (file) => {
  const maxFileSize = 2 * 1024 * 1024;
  const fileTypes = 'jpeg,png,gif,jpg';
  return checkFileTypeAndFileSize(file.name, file.size, fileTypes, "图片", maxFileSize);
};

/**
 * 处理音频文件和大小
 * @param file
 * @returns {boolean}
 */
export const checkAudioFileTypeAndFileSize = (file) => {
  const fileTypes = 'amr';
  const maxFileSize = 2 * 1024 * 1024; // 2m
  return checkFileTypeAndFileSize(file.name, file.size, fileTypes, "语音", maxFileSize);
};
/**
 * 校验文件类型和大小
 * @param fileName 文件名
 * @param fileSize 文件大小
 * @param fileTypes 文件类型
 * @param fileTypeName 文件类型名称
 * @param maxFileSize 最大文件大小
 * @returns {boolean}
 */
export const checkFileTypeAndFileSize = (fileName, fileSize, fileTypes, fileTypeName, maxFileSize) => {

  // 获取文件类型
  const fileType = fileName.substr(fileName.lastIndexOf('.') + 1);
  // 判断当前文件类型是否在允许范围类
  const index = fileTypes.split(',').findIndex(item => {
    return item === fileType;
  });
  if (index === -1) {
    Notification.error({
      title: `${fileTypeName}上传失败，${fileTypeName}只能是${fileTypes}格式!`
    })
    return false;
  }
  if (fileSize > maxFileSize) {
    Notification.error({
      title: `${fileTypeName}文件大小不能超过${maxFileSize / 1024 / 1024}MB!`
    })
    return false;
  }
  return true;
};

/**
 * 解析xml
 * @param content
 */
export const parseXml = (content) => {
  return new Promise(((resolve, reject) => {
    const xmlParser = new Parser();
    xmlParser.parseString(content, (err, result) => {
      err ? reject(err) : resolve(result);
    })
  }))
};


const postDownloadFile = (url, data) => {
  const BASE_URL = process.env.VUE_APP_BASE_API;

  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: BASE_URL + url, // 请求地址
      data, // 参数
      responseType: 'blob', // 表明返回服务器返回的数据类型
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      resolve(res);
    }).catch(err => {
      Vue.prototype.$message.error("导出错误~~~");
      reject(err);
    });
  })
}

/**
 * 获取地址栏参数
 * @param paramName
 * @returns {string|null}
 */
export const getUrlParam = paramName => {
  const url = window.location.search.substring(1);
  const vars = url.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] === paramName) {
      return pair[1];
    }
  }
  return null;
}
