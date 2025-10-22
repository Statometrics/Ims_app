// global.d.ts — refined Luxon shim for Vercel builds

declare module 'luxon' {
  export class DateTime {
    static now(): DateTime
    static fromJSDate(date: Date, options?: Record<string, any>): DateTime
    static fromMillis(ms: number, options?: Record<string, any>): DateTime
    static local(): DateTime
    static utc(): DateTime
  }
}

