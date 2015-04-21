'use strict';
import angular from 'angular';
import _ from 'lodash';

export class Storage {

  constructor() {
    this.items = [];
  }

  /**
   * @returns {Promise}
   */
  count(filter = null) {
    return this.find(filter).then((results) => {
      return results.length;
    });
  }

  /**
   * @returns {Promise}
   */
  find(filter = null, limit = null) {
    return new Promise((resolve, reject) => {
      var results = filter ? _.filter(this.items, (item) => _.matches(filter)(item)) : this.items;
      if (limit) {
        resolve(results.slice(limit));
      } else {
        resolve(results);
      }
    });
  }

  /**
   * @param {*} item
   * @returns {Promise}
   */
  add(item) {
    return new Promise((resolve, reject) => {
      this.items.push(item);
      resolve(items);
    });
  }

  /**
   * @param {Array} items
   * @returns {Promise}
   */
  addAll(items) {
    return new Promise((resolve, reject) => {
      this.items.concat(items);
      resolve(items);
    });
  }

  /**
   * @param item
   * @returns {Promise}
   */
  save(item) {
    return new Promise((resolve, reject) => {
      this.items[this.items.indexOf(item)] = item;
      resolve(items);
    });
  }

  /**
   * @param item
   * @returns {Promise}
   */
  remove(item) {
    return new Promise((resolve, reject) => {
      this.items.splice(this.items.indexOf(item), 1);
      resolve(items);
    });
  }

  /**
   * @param filter
   * @returns {Promise}
   */
  removeBy(filter) {
    return new Promise((resolve, reject) => {
      let items = _.filter(this.items, (item) => !_.matches(filter)(item));
      angular.copy(items, this.items);
      resolve(items);
    });
  }

  drop() {
    return new Promise((resolve, reject) => {
      this.items = [];
      resolve(items);
    });
  }

}