// client.ts
import type { App } from '@/src/types/app'
import { treaty } from '@elysia/eden'

export const app = treaty<App>("https://cukkr-backend-dev.fire.my.id")
