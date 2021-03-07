<script lang="ts">
	export let person: { name: string, age: number }
	
	export let callback: () => void
</script>

<main>
	<h1>Hello {person.name}, how is it being {person.age} years old?</h1>
	<button on:click={callback}>Click it</button>
	<p>This is a paragraph.</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>