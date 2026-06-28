/* Lightweight shims for editor/TS server when node_modules aren't installed.
   These declare common packages and JSX intrinsic elements as `any` so
   the project can be edited before running `npm install`.
   Remove or replace with proper @types packages after installing deps. */

declare module 'react'
declare module 'react/jsx-runtime'
declare module 'react-dom/client'
declare module 'react-router-dom'

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

export {}
