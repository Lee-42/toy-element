<script setup lang="ts">
import type { IconProps } from "./types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { omit } from "lodash-es";
import { computed } from "vue";

defineOptions({
  name: "ErIcon",
  inheritAttrs: false, // 使用组件时<ErIcon name='123'/> 这个name='123'不会被添加到ErIcon这个组件的属性上
});

const props = defineProps<IconProps>();

const filterProps = computed(() => omit(props, ["type", "color"])); // 返回一个没有列入排除key属性的对象, 也就是排除type、color属性
const customStyles = computed(() => ({ color: props.color ?? void 0 }));
</script>

<template>
  <i
    class="er-icon"
    :class="{ [`er-icon--${type}`]: type }"
    :style="customStyles"
    v-bind="$attrs"
  >
    <font-awesome-icon v-bind="filterProps" />
  </i>
</template>

<style scoped>
@import "./style.css";
</style>
