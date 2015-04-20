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
  getFromStorage() {
    return this.collection.find();
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