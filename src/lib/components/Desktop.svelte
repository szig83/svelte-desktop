<script lang="ts">
  // Desktop component: Main area for windows with WindowManager
  import { WindowManager } from '$lib/classes/WindowManager';
  import Window from './Window.svelte';
  import App1 from './App1.svelte';
  import App2 from './App2.svelte';

  const manager = new WindowManager();
  let openWindows = $state<string[]>([]);
  let windowPositions = $state<Map<string, { x: number; y: number }>>(new Map());

  // Open a window by ID
  function openWindow(id: string, title: string) {
    manager.openWindow(id);
    openWindows = manager.getWindows();
  }

  // Map of app components for dynamic loading
  const appComponents: Record<string, any> = {
    'app1-window': App1,
    'app2-window': App2,
  };

  // Helper function to get window data by ID
  function getWindowData(id: string) {
    type WindowData = {
      [key: string]: { title: string }
    };
    
    const data: WindowData = {
      'test-window': { title: 'Test Window' },
      'app1-window': { title: 'App 1' },
      'app2-window': { title: 'App 2' },
    };
    return data[id] || { title: 'Unknown' };
  }
</script>

<div class="desktop" style="width: 100vw; height: 100vh; position: relative; overflow: hidden;">
  <!-- Button to open test window -->
  <button onclick={() => openWindow('test-window', 'Test Window')} style="position: absolute; top: 10px; left: 10px; z-index: 1000;">Open Test Window</button>

  <!-- Taskbar at the bottom -->
  <div class="taskbar" style="position: absolute; bottom: 0; left: 0; right: 0; height: 40px; background: #f0f0f0; border-top: 1px solid #ccc; display: flex; align-items: center; padding: 0 10px; z-index: 1000;">
    <button onclick={() => openWindow('app1-window', 'App 1')} style="margin-right: 10px; padding: 5px 10px;">App 1</button>
    <button onclick={() => openWindow('app2-window', 'App 2')} style="margin-right: 10px; padding: 5px 10px;">App 2</button>
    <!-- Add more buttons as needed -->
  </div>

  <!-- Render windows -->
  {#each openWindows as id}
    {@const windowData = getWindowData(id)}
    <Window
      {id}
      title={windowData.title}
      zIndex={manager.getZIndex(id)}
      position={windowPositions.get(id) || {x: 100, y: 100}}
      onPositionChange={(newPos) => windowPositions.set(id, newPos)}
      onClose={() => {
        manager.closeWindow(id);
        openWindows = manager.getWindows();
      }}
    >
      {#if appComponents[id]}
        {@const Component = appComponents[id]}
        <Component />
      {:else}
        <p>This is a test window. You can drag it by the header and close it with X.</p>
      {/if}
    </Window>
  {/each}
</div>
