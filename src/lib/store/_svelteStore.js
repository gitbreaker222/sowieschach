import { dev } from '$app/environment';
import { useStore as debugStore } from "./_svelteStore.debug"
import { useStore as prodStore } from "./_svelteStore.prod"

export const useStore = dev ? debugStore : prodStore