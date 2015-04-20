'use strict';
import angular from 'angular';
import _ from 'lodash';

export class Storage {

  constructor() {
    this.items = [];
  }

  /**
   * @param {*} item
   * @returns {Promise}
   */
  add(item) {
    return new Promise((resolve, reject) => {
      this.items.push(item);
      this.saveOnStorage(this.items).then((items) => {
        resolve(items);
      });
    });
  }

  /**
   * @param item
   * @returns {Promise}
   */
  save(item) {
    return new Promise((resolve, reject) => {
      this.items[this.items.indexOf(item)] = item;
      this.saveOnStorage(this.items).then((items) => {
        resolve(items);
      });
    });
  }

  /**
   * @param item
   * @returns {Promise}
   */
  remove(item) {
    return new Promise((resolve, reject) => {
      this.items.splice(this.items.indexOf(item), 1);
      this.saveOnStorage(this.items).then((items) => {
        resolve(items);
      });
    });
  }

  /**
   * @returns {*}
   */
  get() {
    this.items = this.getFromStorage();
    return this.items;
  }

  filter(filter) {
    return new Promise((resolve, reject) => {
      let items = _.filter(this.items, (item) => !_.matches(filter)(item));
      angular.copy(items, this.items);
      this.saveOnStorage(this.items).then((items) => {
        resolve(items);
      });
    });
  }

  getFromStorage() {
    throw new Error('getFromStorage Not implemented');
  }

  saveOnStorage(items) {
    throw new Error('saveOnStorage Not implemented');
  }
}