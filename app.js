import { KancilComponent, KancilStore } from './node_modules/kanciljs/src/kancil.js';

// Global store to store global states
const todoStore = KancilStore(
    {
        input: '',
        todos: [],
    },
    'kancil-todo'
);

// Form component
const form = new KancilComponent({
    target: '#todo-form',
    state: todoStore.state,
    template: `
        <input type="text" placeholder="What is to do?" @input="input" />
        <button @click="add">Tambah</button>
      `,
    events: {
        'click@button': function () {
            const text = this.state.input.trim();
            if (text) {
                const newTodos = [...this.state.todos, { id: Date.now(), text }];
                todoStore.set('todos', newTodos);
                todoStore.set('input', '');
            }
        },
    },
});
form.render();

// List component
const list = new KancilComponent({
    target: '#todo-list',
    state: todoStore.state,
    template: `
        {{#if todos.length === 0}}
            <div class="empty">Todo is empty</div>
        {{/if}}

        {{#if todos.length > 0}}
            <ul>
              {{#for todo in todos}}
                <li>
                  <span>{{todo.text}}</span>
                  <button class="btn-delete" data-id="{{todo.id}}">❌</button>
                </li>
              {{/for}}
            </ul>
        {{/if}}
  `,
    events: {
        'click@button': function (e, el) {
            const id = parseInt(el.dataset.id);
            if (!isNaN(id)) {
                const newTodos = this.state.todos.filter(todo => todo.id !== id);
                todoStore.set('todos', newTodos);
            }
        },
    },
});
list.render();

// Subscribe to global store
todoStore.subscribe('*', state => {
    form.setState(state);
    list.setState(state);
});
