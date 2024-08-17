<script lang="ts" setup>
import type { ConfigProviderProps } from "./types";
import { provideGlobalConfig } from "./hooks";

defineOptions({
  nmae: "ErConfigProvider",
});

const props = defineProps<ConfigProviderProps>();
const config = provideGlobalConfig(props);
</script>

<template>
  <slot name="default" :config="config"></slot>
</template>
