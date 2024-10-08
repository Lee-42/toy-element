<script setup lang="ts">
import type { AlertProps, AlertEmits, AlertInstance } from "./types";
import { ref, computed } from "vue";
import { typeIconMap } from "@toy-element/utils";
import ErIcon from "../Icon/Icon.vue";

defineOptions({
  name: "ErAlert",
});

const props = withDefaults(defineProps<AlertProps>(), {
  effect: "light",
  type: "info",
  closeable: true,
});

const emits = defineEmits<AlertEmits>();
const slots = defineSlots();

const visiable = ref(true);

const iconName = computed(() => typeIconMap.get(props.type) ?? "circle-info");
const withDescription = computed(() => props.description || slots.default); // 是否有描述

function close() {
  emits("close");
}

function open() {
  visiable.value = true;
}

defineExpose<AlertInstance>({
  close,
  open,
});
</script>

<template>
  <transition name="er-alert-fade">
    <div
      v-show="visiable"
      class="er-alert"
      role="alert"
      :class="{
        [`er-alert__${type}`]: type,
        [`er-alert__${effect}`]: effect,
        'text-center': center,
      }"
    >
      <er-icon
        v-if="showIcon"
        class="er-alert__icon"
        :class="{ 'big-icon': withDescription }"
        :icon="iconName"
      />
      <div class="er-alert__content">
        <span
          class="er-alert__title"
          :class="{ 'with-desc': withDescription }"
          :style="{ display: center && !showIcon ? 'flow' : 'inline' }"
        >
          <slot name="title">{{ title }}</slot>
        </span>
        <p class="er-alert__description">
          <slot>{{ description }}</slot>
        </p>
        <div class="er-alert__close" v-if="closable">
          <er-icon @click.stop="close" icon="xmark" />
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
@import "./style.css";
</style>
