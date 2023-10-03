import type { Dispatch } from 'react'

import { createContext, useContext } from 'react'

import type { LivePreview } from '../../../../../exports/config'
import type { SizeReducerAction } from './sizeReducer'

export interface LivePreviewContextType {
  breakpoint: LivePreview['breakpoints'][number]['name']
  breakpoints: LivePreview['breakpoints']
  deviceFrameRef: React.RefObject<HTMLDivElement>
  iframeHasLoaded: boolean
  iframeRef: React.RefObject<HTMLIFrameElement>
  setBreakpoint: (breakpoint: LivePreview['breakpoints'][number]['name']) => void
  setHeight: (height: number) => void
  setIframeHasLoaded: (loaded: boolean) => void
  setSize: Dispatch<SizeReducerAction>
  setToolbarPosition: (position: { x: number; y: number }) => void
  setWidth: (width: number) => void
  setZoom: (zoom: number) => void
  size: {
    height: number
    width: number
  }
  toolbarPosition: {
    x: number
    y: number
  }
  zoom: number
}

export const LivePreviewContext = createContext<LivePreviewContextType>({
  breakpoint: undefined,
  breakpoints: undefined,
  deviceFrameRef: undefined,
  iframeHasLoaded: false,
  iframeRef: undefined,
  setBreakpoint: () => {},
  setHeight: () => {},
  setIframeHasLoaded: () => {},
  setSize: () => {},
  setToolbarPosition: () => {},
  setWidth: () => {},
  setZoom: () => {},
  size: {
    height: 0,
    width: 0,
  },
  toolbarPosition: {
    x: 0,
    y: 0,
  },
  zoom: 1,
})

export const useLivePreviewContext = () => useContext(LivePreviewContext)