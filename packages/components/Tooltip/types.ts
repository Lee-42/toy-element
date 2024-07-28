import type { Placement, Options } from "@popperjs/core";

export interface TooltipProps {
  content?: string;
  trigger?: "hover" | "click" | "contextmenu";
  placement?: Placement;
  manual?: boolean;  // 手动控制
  disabled?: boolean;
  popperOptions?: Partial<Options>; // Partial 部分的
  transition?: string;
  showTimeout?: number;
  hideTimeout?: number;
}

export interface TooltipEmits {
  (e: "visible-change", value: boolean): void;
  (e: "click-outside"): void;
}

export interface TooltipInstance {
  show(): void;
  hide(): void;
}