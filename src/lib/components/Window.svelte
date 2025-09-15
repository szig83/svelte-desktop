<script lang="ts">
  // Window component: Represents a draggable window with state managed by Svelte 5 runes
  let { id, title = 'Window', zIndex = 1, onClose, position, onPositionChange }: { id: string; title?: string; zIndex?: number; onClose?: () => void; position: {x: number, y: number}; onPositionChange: (pos: {x: number, y: number}) => void } = $props();

  // Local state for position to handle reactivity
  let localPosition = $state(position);
  let isDragging = $state(false);
  let dragOffset = $state({ x: 0, y: 0 });
  let size = $state({ width: 400, height: 300 });

  // Update local position when prop changes
  $effect(() => {
    localPosition = position;
  });

  // Drag functionality using pointer events
  function handlePointerDown(event: PointerEvent) {
    if (event.target === event.currentTarget) { // Only on the header
      isDragging = true;
      dragOffset = {
        x: event.clientX - localPosition.x,
        y: event.clientY - localPosition.y
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  function handlePointerMove(event: PointerEvent) {
    if (isDragging) {
      localPosition = {
        x: event.clientX - dragOffset.x,
        y: event.clientY - dragOffset.y
      };
      onPositionChange(localPosition);
    }
  }

  function handlePointerUp() {
    isDragging = false;
  }

  // Close window
  function closeWindow() {
    if (onClose) onClose();
  }
</script>

<div
  class="window"
  style="position: absolute; left: {localPosition.x}px; top: {localPosition.y}px; width: {size.width}px; height: {size.height}px; border: 1px solid #ccc; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); z-index: {zIndex};"
>
  <!-- Window header for dragging -->
  <div
    class="window-header"
    style="padding: 10px; background: #f0f0f0; cursor: move; display: flex; justify-content: space-between; align-items: center;"
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
  >
    <span>{title}</span>
    <button onclick={closeWindow} style="border: none; background: none; cursor: pointer;">X</button>
  </div>
  <!-- Window content -->
  <div class="window-content" style="padding: 10px; height: calc(100% - 40px); overflow: auto;">
    <slot />
  </div>
</div>
