<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let todo;

    import { Firestore } from './firebase';

    function toggle() {
        // const ref = Firestore.doc(`todos/${id}`);
        // ref.update({ complete: !complete });
        todo.done= !todo.done
    }
    const del = (todo) => () => {
      console.log('Todo.del', todo)
      dispatch('delete', { todo });
    }
</script>

<style>
	.done {
		opacity: 0.4;
	}
</style>

<div class:done={todo.done}>
  <input type=checkbox bind:checked={todo.done}>
  <input placeholder="What needs to be done?" bind:value={todo.text}>
  <button on:click={del(todo)}>x</button>
</div>
