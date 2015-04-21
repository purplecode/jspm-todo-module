'use strict';
import {Storage} from './Storage';
import lodash from 'lodash';
import lokijs from 'lokijs';

const DATABASE = 'todo-module';
const COLLECTION = 'todos';

export default
class LokiStorage extends Storage {

  constructor() {
    super(this);

    var database = new lokijs(DATABASE);
    this.collection = database.addCollection(COLLECTION, {indices: []});
  }

  /**
   * @returns {Promise}
   */
  find(filter = null, limit = null) {
    return new Promise((resolve, reject) => {
      let result = this.collection.find(null);
      if (filter) {
        result = result.find(filter);
      }
      if (limit) {
        result = result.limit(limit);
      }
      resolve(result.data());
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
   * @param {Array} items
   * @returns {Promise}
   */
  addAll(items) {
    return new Promise((resolve, reject) => {
      this.collection.insert(items);
      resolve(items);
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
  getFromStorage(limit = 10) {
    return new Promise((resolve, reject) => {
      let result = this.collection.find(null /* happy debugging */);
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