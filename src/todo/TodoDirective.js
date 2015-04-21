'use strict';
import template from './template.jade!';
import 'todomvc-common';
import 'todomvc-common/base.css!';
import 'todomvc-app-css/index.css!';
import './style.css!';
import todoModule from './module';
import angular from 'angular';

todoModule.directive('todo', function (StorageFactory) {
  return {
    restrict: 'E',
    template: template,
    scope: {
      storage: '@'
    },

    controller: ($scope, $filter) => {

      let storage = new StorageFactory($scope.storage).get();

      function load() {
        // TODO why it does not work?
        //return Promise.all(storage.get(), storage.count()).then(function(results) {
        //  let [todos, count] = results;
        //  $scope.todos = todos;
        //  $scope.totalCount = count;
        //  $scope.$apply();
        //  return todos;
        //});

        return storage.count().then(function (totalCount) {
          return storage.count({completed: true}).then(function (completedCount) {
            return storage.find($scope.filter, 5).then(function (todos) {
              $scope.filter = {};
              $scope.todos = todos;
              $scope.totalCount = totalCount;
              $scope.completedCount = completedCount;
              $scope.remainingCount = totalCount - completedCount;
              $scope.allChecked = !$scope.remainingCount;
              $scope.$apply();
            });
          });
        });
      }

      $scope.todos = [];
      $scope.totalCount = 0;
      $scope.completedCount = 0;
      $scope.remainingCount = 0;

      load();

      $scope.newTodo = '';
      $scope.editedTodo = null;

      $scope.onStatusChange = (status) => {
          $scope.filter = (status === 'active') ?
          {completed: false} : (status === 'completed') ?
          {completed: true} : {};
          load();
      };

      $scope.addTodo = () => {
        if (!$scope.newTodo) {
          return;
        }
        let newTodo = {
          title: $scope.newTodo.trim(),
          completed: false
        };

        storage.add(newTodo).then(function success() {
          load().then(function () {
            $scope.newTodo = null;
            $scope.$apply();
          });
        });
      };

      $scope.editTodo = (todo) => {
        $scope.editedTodo = todo;
        $scope.originalTodo = angular.extend({}, todo);
      };

      $scope.saveEdits = (todo, event) => {
        if (event === 'blur' && $scope.saveEvent === 'submit') {
          $scope.saveEvent = null;
          return;
        }

        $scope.saveEvent = event;

        if ($scope.reverted) {
          $scope.reverted = null;
          return;
        }

        todo.title = todo.title.trim();

        if (todo.title === $scope.originalTodo.title) {
          $scope.editedTodo = null;
          return;
        }

        storage.save(todo).catch(() => {
          todo.title = $scope.originalTodo.title;
        }).then(() => {
          $scope.editedTodo = null;
        });
      };

      $scope.revertEdits = (todo) => {
        $scope.todos[$scope.todos.indexOf(todo)] = $scope.originalTodo;
        $scope.editedTodo = null;
        $scope.originalTodo = null;
        $scope.reverted = true;
      };

      $scope.removeTodo = (todo) => {
        storage.remove(todo).then(load);
      };

      $scope.toggleCompleted = (todo) => {
        storage.save(todo)
          .catch((error) => {
            throw error;
          }).then(load);
      };

      $scope.clearCompletedTodos = () => {
        storage.removeBy({completed: true}).then(load);
      };

      $scope.markAll = (completed) => {
        $scope.todos.forEach((todo) => {
          if (todo.completed !== completed) {
            todo.completed = !todo.completed;
            $scope.toggleCompleted(todo);
          }
        });
      };

      $scope.addRandomCount = 5;

      $scope.addRandomTodos = (count = 5) => {
        let buffer = [];
        let initial = count;
        while (count-- > 0) {
          buffer.push({
            completed: Math.random() < 0.5,
            title: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 3)
          });
          if (buffer.length === 10) {
            storage.addAll(buffer);
            console.log(`${count}/${initial}`);
            buffer = [];
          }
        }
        if (buffer.length > 0) {
          storage.addAll(buffer);
        }
        load();
      };

    }
  };

});
