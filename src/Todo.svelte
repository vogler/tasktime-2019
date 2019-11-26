<script>
    export let todo;

    import { Firestore } from './firebase';

    function toggle() {
        // const ref = Firestore.doc(`todos/${id}`);
        // ref.update({ complete: !complete });
        todo.complete = !todo.complete
    }
</script>

<style>
    .complete { text-decoration: line-through; color: crimson; }
</style>

<b class:complete={todo.complete}>{todo.name}</b>

<button on:click={toggle} class="button">Mark { todo.complete ? 'Incomplete' : 'Complete' }</button>
