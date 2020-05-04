import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {Notice, Spin} from 'iview';
import router from '../router';

Vue.use(VueAxios, axios)
let baseURLStr = window.g.ApiUrl
axios.defaults.baseURL = baseURLStr
let showMsg = window.g.isShowErrMsg
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000;
axios.defaults.retry = 2;
axios.defaults.retryDelay = 1000;

var flag = true
let reqCount = 0

export function showLoading() {
  if (reqCount === 0) {
    Spin.show({
      render: h => {
        return h("VmLoading")
      }
    })
  }
  reqCount++
}

export function hideLoading() {
  if (reqCount <= 0) return
  reqCount--
  if (reqCount === 0) {
    // Spin.hide();
    setTimeout(() => {
      closeLoading()
    }, 300)
  }
}

const closeLoading = () => {
  if (reqCount === 0) {
    Spin.hide();
  }
}
axios.interceptors.request.use(config => {
  if (config.showLoading) {
    // showLoading()
  }
  return config;
}, err => {
  return Promise.reject(err);
});

axios.interceptors.response.use(res => {
  // hideLoading()
  return res;
}, err => {
  setTimeout(() => {
    Spin.hide();
    reqCount = 0
  }, 1000)
  if (err && err.response) {
    switch (err.response.status) {
      case 302:
        router.replace("/login")
        localStorage.setItem("isLogin", false)
        break
      case 401:
        router.replace("/login")
        localStorage.setItem("isLogin", false)
        break
      case 403:
        Notice.error({
          title: "无权限",
          desc: `${err.response.data.msg}`,
          duration: 0,
        });
        // router.replace("/403")
        break
      case 500:
        let url = err.response.request.responseURL;
        let reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/);
        let result = url.match(reg);
        Notice.error({
          title: "服务器错误",
          desc: `访问${err.response.request.responseURL.split(result[0])[1]}失败`,
          duration: 0
        });
        // router.replace("/500")
        break
    }
  }
  else if (err && err.code === "ECONNABORTED") {
    let config = err.config;
    if (!config || !config.retry) {
      return Promise.reject(err);
    }
    config.__retryCount = config.__retryCount || 0
    if (config.__retryCount >= config.retry) {
      if (flag === true) {
        Notice.warning({
          title: `请求超时`,
          duration: 0,
          onClose: function close(name) {
            Notice.destroy()
            flag = true
          }
        });
        flag = false
      }
      return Promise.reject(err);
    }
    config.__retryCount += 1;
    let backoff = new Promise(function (resolve) {
      setTimeout(() => {
        resolve();
      }, config.retryDelay || 1);
    });
    return backoff.then(function () {
      return axios(config);
    });
  }
  return Promise.reject(err);
});

/**
 * 封装get请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url, params = {}, config = {showLoading: false}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }, config)
      .then(response => {
        if(response.data.success === 0 && showMsg) {
          switch (response.data.message.errorLevel) {
            case "error":
              Notice.error({
                desc: response.data.message.errorMsg,
                duration: 0
              })
              break
            case "warning":
              Notice.warning({
                desc: response.data.message.errorMsg,
                duration: 2
              })
              break
            case "info":
              Notice.info({
                desc: response.data.message.errorMsg,
                duration: 2
              })
              break
          }
        }
        else {
          resolve(response.data);
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}, config = {showLoading: false}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, config)
      .then(response => {
        if(response.data.success === 0 && showMsg) {
          switch (response.data.message.errorLevel) {
            case "error":
              Notice.error({
                desc: response.data.message.errorMsg,
                duration: 0
              })
              break
            case "warning":
              Notice.warning({
                desc: response.data.message.errorMsg,
                duration: 2
              })
              break
            case "info":
              Notice.info({
                desc: response.data.message.errorMsg,
                duration: 2
              })
              break
          }
        }
        else {
          resolve(response.data);
        }
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}, config = {showLoading: false}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data, config)
      .then(response => {
        if(response.data.success === 0 && showMsg) {
          switch (response.data.message.errorLevel) {
            case "error":
              Notice.error({
                desc: response.data.message.errorMsg,
                duration: 0
              })
              break
            case "warning":
              Notice.warning({
                desc: response.data.message.errorMsg,
                duration: 2
              })
              break
            case "info":
              Notice.info({
                desc: response.data.message.errorMsg,
                duration: 2
              })
              break
          }
        }
        else {
          resolve(response.data);
        }
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}, config = {showLoading: false}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data, config)
      .then(response => {
        if(response.data.success === 0 && showMsg) {
          switch (response.data.message.errorLevel) {
            case "error":
              Notice.error({
                desc: response.data.message.errorMsg,
                duration: 0
              })
              break
            case "warning":
              Notice.warning({
                desc: response.data.message.errorMsg,
                duration: 2
              })
              break
            case "info":
              Notice.info({
                desc: response.data.message.errorMsg,
                duration: 2
              })
              break
          }
        }
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function del(url, data = {}, config = {showLoading: false}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, data, config)
      .then(response => {
        if(response.data.success === 0 && showMsg) {
          switch (response.data.message.errorLevel) {
            case "error":
              Notice.error({
                desc: response.data.message.errorMsg,
                duration: 0
              })
              break
            case "warning":
              Notice.warning({
                desc: response.data.message.errorMsg,
                duration: 2
              })
              break
            case "info":
              Notice.info({
                desc: response.data.message.errorMsg,
                duration: 2
              })
              break
          }
        }
        else {
          resolve(response.data);
        }
      }, err => {
        reject(err)
      })
  })
}
