<script setup>
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';

const windowRef = ref(null);
const parentElement = ref(null);
const position = reactive({ x: 0, y: 0 });
const isVisible = ref(false);
let isDragging = false;
let startPosition = { x: 0, y: 0 };
let floatingWindowObserver = null;
let resizeObserver = null;
let mutationObserver = null;

const updateWindowPosition = () => {
    if (!windowRef.value || !parentElement.value) {
   
        position.x = 0;
        position.y = 0;
        return
    }

    const parentRect = parentElement.value.getBoundingClientRect();
    const windowRect = windowRef.value.getBoundingClientRect();    

    if(isVisible.value) {
        position.x = Math.max(
            Math.min(position.x, 0),
            windowRect.width - parentRect.width
        );
    }

    position.y = Math.min(
        Math.max(position.y, 0),
        parentRect.height - windowRect.height
    );
}

const onDragStart = (event) => {
    if (event.touches && event.touches.length !== 1) return; 

    isDragging = true;
    startPosition.x = event.clientX || event.touches[0].clientX;
    startPosition.y = event.clientY || event.touches[0].clientY;
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);
};

const onDragMove = (event) => {
    if (!isDragging) return;

    if (!windowRef.value || !parentElement.value) {
        position.x = 0;
        position.y = 0;
        return;
    }

    const parentRect = parentElement.value.getBoundingClientRect();
    const windowRect = windowRef.value.getBoundingClientRect();

    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;

    if (isVisible.value) {
        const moveX = clientX - startPosition.x;
        position.x += moveX;

        position.x = -Math.min(
            Math.max(-position.x, 0),
            parentRect.width - windowRect.width
        );
    }

    const moveY = clientY - startPosition.y;
    position.y += moveY;

    position.y = Math.min(
        Math.max(position.y, 0),
        parentRect.height - windowRect.height
    );

    startPosition = { x: clientX, y: clientY };
};

const onDragEnd = () => {
    isDragging = false;
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('touchend', onDragEnd);
};

const toggleVisibility = () => {
    isVisible.value = !isVisible.value;
};

const computedStyle = computed(() => ({
    transform: isVisible.value ? `translate(${position.x}px, ${position.y}px)` : `translate(0px, ${position.y}px)`,
    right: 0,
    top: 0,
}));

// 查找最近的 position 父元素
const getPositionParent = (element) => {
    if (!element) return null;

    element = element.parentElement;

    while (element) {
        const position = window.getComputedStyle(element).position;
        if (position === 'relative' || position === 'absolute' || position === 'fixed' || position === 'sticky') {
            return element;
        }
        element = element.parentElement;
    }
    return null;
};

// 观察父元素的变化
const observeParent = () => {
  if (windowRef.value) {
    const newParent = getPositionParent(windowRef.value);

    if (parentElement.value !== newParent) {
        parentElement.value = newParent;

      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      if (newParent) {
        resizeObserver.observe(newParent);

        updateWindowPosition();
      }
    } 
  }
};

onMounted(() => {
    floatingWindowObserver = new ResizeObserver(updateWindowPosition);

    if(windowRef.value) {
        floatingWindowObserver.observe(windowRef.value);
    }

    resizeObserver = new ResizeObserver(updateWindowPosition);

    mutationObserver = new MutationObserver(observeParent);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // 初始观察
    observeParent();

    if (!windowRef.value || !parentElement.value) {
        position.x = 0;
        position.y = 0;

        return
    } else {
        const parentRect = parentElement.value.getBoundingClientRect();
        const windowRect = windowRef.value.getBoundingClientRect();
        position.x = 0;
        position.y = (parentRect.height - windowRect.height) / 2;
    }
});

onBeforeUnmount(() => {
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('touchend', onDragEnd);

    if (floatingWindowObserver) {
        if (windowRef.value) {
            floatingWindowObserver.unobserve(windowRef.value);
        }

        floatingWindowObserver.disconnect();
    }

    if (resizeObserver) {
        resizeObserver.disconnect();
    }

    if (mutationObserver) {
        mutationObserver.disconnect();
    }
});

</script>

<template>
    <div
      class="floating-window"
      :style="computedStyle"
      @mousedown="onDragStart"
      @touchstart="onDragStart"
      ref="windowRef"
    >
      <div class="controls" @click="toggleVisibility" :style="isVisible ? 'width: 25px;' : 'width: 100%;'">
        <arrow-left v-if="!isVisible" class="arrow"/>
        <arrow-right v-else class="arrow"/>
      </div>
      <div v-if="isVisible" class="content">
        <slot></slot>
      </div>
    </div>
</template>
  
<style scoped>
.floating-window {
    position: absolute;
    background: var(--liyin-floating-window-bg-color);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    display: flex;
    z-index: 999;
    user-select: none;
    min-height: 25px;
    min-width: 25px;
    overflow: hidden;
}

.controls {
    display: flex;
    background: var(--liyin-floating-window-bg-color);
    align-items: center;
    justify-content: center;
}

.content {
    background: var(--liyin-floating-window-bg-color);
}

.arrow {
    width: 20px;
    height: 20px;
    color: var(--liyin-arrow-color);
}
</style>
  