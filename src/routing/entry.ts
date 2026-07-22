const RESTORED_WORKFLOW_PATHS = new Set(['/journal', '/reading', '/iching/reading'])

export function shouldBeginAtHome(isFreshTab: boolean, pathname: string) {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'
  return isFreshTab && RESTORED_WORKFLOW_PATHS.has(normalizedPath)
}
