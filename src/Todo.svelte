<script>
    export let id;
    export let name;
    export let complete;

    import { Firestore } from './firebase';

    function toggle() {
        // const ref = Firestore.doc(`todos/${id}`);
        // ref.update({ complete: !complete });
        complete = !complete
    }
</script>

<style>
    .complete { text-decoration: line-through; color: crimson; }
</style>

<b class:complete>{name}</b>

<button on:click={toggle} class="button">Mark { complete ? 'Incomplete' : 'Complete' }</button>
