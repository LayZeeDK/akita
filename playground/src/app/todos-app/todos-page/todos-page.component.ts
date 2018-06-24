import { Component, OnInit } from '@angular/core';
import { initialFilters, VISIBILITY_FILTER } from '../filter/filter.model';
import { Todo } from '../state/todo.model';
import { TodosQuery } from '../state/todos.query';
import { TodosService } from '../state/todos.service';
import { Observable } from 'rxjs';
import { ID } from '@datorama/akita';
import { map } from 'rxjs/operators';
import { snapshotManager } from '../../../../../akita/src/api/snapshot-manager';

@Component({
  selector: 'app-todos-page',
  templateUrl: './todos-page.component.html',
  styleUrls: ['./todos-page.component.css']
})
export class TodosPageComponent implements OnInit {
  todos$: Observable<Todo[]>;
  activeFilter$: Observable<VISIBILITY_FILTER>;

  filters = initialFilters;
  checkAll$: Observable<boolean>;

  constructor(private todosQuery: TodosQuery, private todosService: TodosService) {}

  ngOnInit() {
    this.todos$ = this.todosQuery.selectVisibleTodos$;
    this.activeFilter$ = this.todosQuery.selectVisibilityFilter$;
    this.checkAll$ = this.todosQuery.checkAll$.pipe(map(numCompleted => numCompleted && numCompleted === this.todosQuery.getCount()));
    // snapshotManager.setStoresSnapshot({
    //   "todos": {
    //     "ui": {
    //       "filter": "SHOW_ALL"
    //     },
    //     "entities": {
    //       "0.5666823893391795": {
    //         "id": 0.5666823893391795,
    //         "title": "ds",
    //         "completed": true
    //       },
    //       "0.16954788680591548": {
    //         "id": 0.16954788680591548,
    //         "title": "ds",
    //         "completed": false
    //       }
    //     },
    //     "ids": [
    //       0.5666823893391795,
    //       0.16954788680591548
    //     ],
    //     "loading": true,
    //     "error": null
    //   }
    // });
  }

  /**
   *
   * @param {HTMLInputElement} input
   */
  add(input: HTMLInputElement) {
    this.todosService.add(input.value);
    input.value = '';
  }

  /**
   *
   * @param {Todo} todo
   */
  complete(todo: Todo) {
    this.todosService.complete(todo);
  }

  /**
   *
   * @param {ID} id
   */
  delete(id: ID) {
    this.todosService.delete(id);
  }

  /**
   *
   * @param {VISIBILITY_FILTER} filter
   */
  changeFilter(filter: VISIBILITY_FILTER) {
    this.todosService.updateFilter(filter);
  }

  /**
   *
   * @param {any} target
   */
  checkAll({ target }) {
    this.todosService.checkAll(target.checked);
  }
}
