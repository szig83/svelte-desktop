<script lang="ts">
	// Desktop component: Main area for windows with WindowManager
	import { WindowManager } from '$lib/classes/WindowManager';
	import Window from './Window.svelte';

	const manager = new WindowManager();
	let openWindows = $state<string[]>([]);
	let windowPositions = $state<Map<string, { x: number; y: number }>>(new Map());

	// Open a window by ID
	async function openWindow(id: string) {
		manager.openWindow(id);
		openWindows = manager.getWindows();

		// Load app component if it's an app window
		if (id.endsWith('-window') && !appComponents[id]) {
			await loadAppComponent(id);
		}
	}

	// Map of app components for dynamic loading
	const appModules = import.meta.glob('./apps/*.svelte');
	const appComponents: Record<string, any> = {};
	const appTitles: Record<string, { title: string }> = {};
	const loadingStates: Record<string, boolean> = {};

	// Function to load app component asynchronously
	async function loadAppComponent(id: string) {
		if (appComponents[id]) return; // Already loaded

		loadingStates[id] = true;
		const name = id.replace('-window', '');
		const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
		const path = `./apps/${capitalizedName}.svelte`;
		const module = appModules[path];
		if (module) {
			const loaded = await module() as { default: any; meta?: { title: string } };
			appComponents[id] = loaded.default;
			appTitles[id] = { title: loaded.meta?.title || id };
		}
		loadingStates[id] = false;
	}
	//console.log(appTitles);

	// Helper function to get window data by ID
	function getWindowData(id: string) {
		type WindowData = {
			[key: string]: { title: string };
		};

		const data: WindowData = {
			'test-window': { title: 'Test Window' },
			...appTitles
		};

		console.log(id, data);
		return data[id] || { title: 'Unknown' };
	}
</script>

<div class="desktop" style="width: 100vw; height: 100vh; position: relative; overflow: hidden;">
	<!-- Button to open test window -->
	<button
		onclick={() => openWindow('test-window')}
		style="position: absolute; top: 10px; left: 10px; z-index: 1000;">Open Test Window</button
	>

	<!-- Taskbar at the bottom -->
	<div
		class="taskbar"
		style="position: absolute; bottom: 0; left: 0; right: 0; height: 40px; background: #f0f0f0; border-top: 1px solid #ccc; display: flex; align-items: center; padding: 0 10px; z-index: 1000;"
	>
		<!-- Add more buttons as needed -->
		<button onclick={() => openWindow('app1-window')}>Open Test Window</button>
	</div>

	<!-- Render windows -->
	{#each openWindows as id}
		{@const windowData = getWindowData(id)}
		<Window
			{id}
			title={windowData.title}
			zIndex={manager.getZIndex(id)}
			position={windowPositions.get(id) || { x: 100, y: 100 }}
			onPositionChange={(newPos) => windowPositions.set(id, newPos)}
			onClose={() => {
				manager.closeWindow(id);
				openWindows = manager.getWindows();
			}}
		>
			{#if loadingStates[id]}
				<p>Loading...</p>
			{:else if appComponents[id]}
				{@const Component = appComponents[id]}
				<Component />
			{:else}
				<p>This is a test window. You can drag it by the header and close it with X.</p>
			{/if}
		</Window>
	{/each}
</div>
