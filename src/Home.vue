<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        autocomplete="off"
        v-model="newTodo"
        @keyup.enter="addTodo"
      />
    </header>
    <section class="main" v-show="todos.length">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        v-model="allDone"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          class="todo"
          v-for="todo in filteredTodos"
          :key="todo.id"
          :class="{ completed: todo.completed, editing: todo == editedTodo }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input
            class="edit"
            type="text"
            v-model="todo.title"
            v-todo-focus="todo == editedTodo"
            @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)"
            @keyup.esc="cancelEdit(todo)"
          />
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong>{{ remaining }}</strong> left
      </span>
      <ul class="filters">
        <li>
          <a href="#/all" :class="{ selected: visibility == 'all' }">All</a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: visibility == 'active' }"
            >Active</a
          >
        </li>
        <li>
          <a href="#/completed" :class="{ selected: visibility == 'completed' }"
            >Completed</a
          >
        </li>
      </ul>
      <button
        class="clear-completed"
        @click="removeCompleted"
        v-show="todos.length > remaining"
      >
        Clear completed
      </button>
    </footer>
  </section>
</template>

<script>
import { reactive, computed, ref, toRefs, watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const route = useRoute();
    //route.hash
    const state = reactive({
      newTodo: '',
      editedTodo: null,
      todos: [
        // { id: "1", title: "xxxx", completed: false },
      ],
    });

    // filters by state
    const filters = {
      all(todos) {
        return todos;
      },
      active(todos) {
        return todos.filter(function (todo) {
          return !todo.completed;
        });
      },
      completed(todos) {
        return todos.filter(function (todo) {
          return todo.completed;
        });
      },
    };

    // cache brefore edit
    const beforeEditCache = ref('');

    // cache curr hash value
    const visibility = ref('all');

    // filter state todo
    const filteredTodos = computed(() =>
      filters[visibility.value](state.todos)
    );

    // not done yet
    const remaining = computed(
      () => state.todos.filter((todo) => !todo.completed).length
    );

    // done
    const allDone = computed({
      get: function () {
        return remaining.value === 0;
      },
      set: function (value) {
        state.todos.forEach(function (todo) {
          todo.completed = value;
        });
      },
    });

    watch(
      () => route.hash,
      (newParams) => {
        if (newParams) {
          // hash: #/xxxx
          visibility.value = newParams.slice(2);
        }
      }
    );

    // add to todo list
    function addTodo() {
      let value = state.newTodo && state.newTodo.trim();
      if (!value) {
        return;
      }
      state.todos.push({
        id: state.todos.length + 1,
        title: value,
        completed: false,
      });
      state.newTodo = '';
    }

    // edit
    function editTodo(todo) {
      beforeEditCache.value = todo.title;
      state.editedTodo = todo;
    }

    // remove
    function removeTodo(todo) {
      const index = this.todos.indexOf(todo);
      state.todos.splice(index, 1);
    }

    // edit done
    function doneEdit(todo) {
      if (!state.editedTodo) {
        return;
      }
      state.editedTodo = null;
      todo.title = todo.title.trim();
      if (!todo.title) {
        removeTodo(todo);
      }
    }

    // cancel edit and back
    function cancelEdit(todo) {
      state.editedTodo = null;
      todo.title = beforeEditCache.value;
    }

    // filters that remove todo which is completed
    function removeCompleted() {
      state.todos = filters.active(this.todos);
    }

    return {
      ...toRefs(state),
      addTodo,
      remaining,
      allDone,
      editTodo,
      removeTodo,
      doneEdit,
      cancelEdit,
      visibility,
      removeCompleted,
      filteredTodos,
    };
  },

  directives: {
    'todo-focus': function (el, binding) {
      if (binding.value) {
        el.focus();
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
