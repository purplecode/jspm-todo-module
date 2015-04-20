'use strict';
import {Storage} from './Storage';

const STORAGE_ID = 'todo-module';

export default class CookieStorage extends Storage {

  constructor() {
    super(this);
  }

  /**
   * @returns {Promise}
   */
  getFromStorage(limit=10) {
    return new Promise((resolve, reject) => {
      let result = document.cookie.match(new RegExp(STORAGE_ID + '=([^;]+)'));
      result = result && JSON.parse(result[1]);
      resolve(result.slice(limit) || []);
    });
  }

  /**
   * @returns {Promise}
   */
  saveOnStorage(items) {
    return new Promise((resolve, reject) => {
      document.cookie = STORAGE_ID + '=' + JSON.stringify(items);
      resolve(items);
    });
  }
}