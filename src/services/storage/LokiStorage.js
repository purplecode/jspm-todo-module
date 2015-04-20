'use strict';
import {Storage} from './Storage';
import lodash from 'lodash';
import lokijs from 'lokijs';

const DATABASE = 'todo-module';
const COLLECTION = 'todos';

export default class LokiStorage extends Storage {

  constructor() {
    super(this);

    var database =  new lokijs(DATABASE);
    this.collection = database.addCollection(COLLECTION, { indices: [] });
  }

  /**
   * @returns {Promise}
   */
  count() {
    return new Promise((resolve, reject) => {
      // TODO any better idea?
      let all = this.collection.find() || [];
      resolve(all.length);
    });
  }

  /**
   * @param {*} item
   * @returns {Promise}
   */
  add(item) {
    return new Promise((resolve, reject) => {
      this.collection.insert(item);
      resolve(item);
    });
  }

  /**
   * @param item
   * @returns {Promise}
   */
  save(item) {
    return new Promise((resolve, reject) => {
      this.collection.update(item);
      resolve(item);
    });
  }

  /**
   * @param item
   * @returns {Promise}
   */
  remove(item) {
    return new Promise((resolve, reject) => {
      this.collection.remove(item);
      resolve(item);
    });
  }

  /**
   * @returns {*}
   */
  get() {
    return this.getFromStorage();
  }

  filter(filter) {
    return new Promise((resolve, reject) => {
      this.collection.removeWhere(filter);
      resolve();
    });
  }

  /**
   * @returns {Array}
   */
  getFromStorage(limit=10) {
    return new Promise((resolve, reject) => {
      window.collection = this.collection;
      let result = this.collection.find(null /* happy debugging */);
      window.result = result;
      resolve(result.limit(limit).data());
    });
  }

  /**
   * @returns {Promise}
   */
  saveOnStorage(items) {
    return new Promise((resolve, reject) => {
      this.collection.insert(items);
      resolve(items);
    });
  }
}