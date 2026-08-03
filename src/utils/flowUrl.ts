import { DEFAULT_FLOW_ID, resolveFlowId } from '../config/flows'

export const FLOW_URL_PARAM = 'flow'
export const FLOW_STORAGE_KEY = 'class-notes-prototype-flow-id'
export const SETTINGS_URL_PARAM = 'showSettings'

export function getFlowIdFromUrl(search = window.location.search): string | null {
  const params = new URLSearchParams(search)
  const flowId = params.get(FLOW_URL_PARAM)
  return flowId ? resolveFlowId(flowId) : null
}

/** Keeps the flow-switcher settings button hidden from shared links unless explicitly unlocked. */
export function isSettingsUnlocked(search = window.location.search): boolean {
  const params = new URLSearchParams(search)
  return params.get(SETTINGS_URL_PARAM) === 'true'
}

function readStoredFlowId(): string | null {
  try {
    const stored = localStorage.getItem(FLOW_STORAGE_KEY)
    if (!stored) {
      return null
    }

    const resolved = resolveFlowId(stored)
    if (resolved && resolved !== stored) {
      localStorage.setItem(FLOW_STORAGE_KEY, resolved)
    }
    return resolved
  } catch {
    // ignore storage errors in prototype
  }
  return null
}

export function resolveInitialFlowId(): string {
  const fromUrl = getFlowIdFromUrl()
  if (fromUrl) {
    return fromUrl
  }

  const fromStorage = readStoredFlowId()
  if (fromStorage) {
    return fromStorage
  }

  return DEFAULT_FLOW_ID
}

export function buildFlowShareUrl(flowId: string): string {
  const url = new URL(window.location.href)
  url.searchParams.set(FLOW_URL_PARAM, flowId)
  return url.toString()
}

export function setFlowInUrl(flowId: string): void {
  const url = new URL(window.location.href)
  url.searchParams.set(FLOW_URL_PARAM, flowId)
  window.history.replaceState(null, '', url)
}

/** Strip unknown `flow` params; rewrite legacy aliases to their canonical ids. */
export function stripInvalidFlowParam(): void {
  const params = new URLSearchParams(window.location.search)
  const rawFlow = params.get(FLOW_URL_PARAM)
  if (!rawFlow) {
    return
  }

  const resolved = resolveFlowId(rawFlow)
  if (!resolved) {
    params.delete(FLOW_URL_PARAM)
    const url = new URL(window.location.href)
    url.search = params.toString()
    window.history.replaceState(null, '', url)
    return
  }

  if (resolved !== rawFlow) {
    setFlowInUrl(resolved)
  }
}
