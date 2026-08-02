// Pure path/tree operations over the in-universe virtual filesystem.

export interface FsFile {
  type: 'file'
  content: string
  /** Present on encrypted files; names the effect fired on successful decrypt. */
  encrypted?: boolean
  onDecrypt?: 'dossier'
}

export interface FsDir {
  type: 'dir'
  children: Record<string, FsNode>
}

export type FsNode = FsFile | FsDir

export const HOME = '/home/commander'

/** Normalize `arg` relative to `cwd` into an absolute path. */
export function resolvePath(cwd: string, arg?: string): string {
  const raw = !arg || arg === '' ? cwd : arg.startsWith('/') ? arg : `${cwd}/${arg}`
  const parts: string[] = []
  for (const seg of raw.split('/')) {
    if (seg === '' || seg === '.') continue
    if (seg === '..') parts.pop()
    else parts.push(seg)
  }
  return '/' + parts.join('/')
}

export function getNode(root: FsDir, path: string): FsNode | null {
  if (path === '/') return root
  let node: FsNode = root
  for (const seg of path.split('/').filter(Boolean)) {
    if (node.type !== 'dir' || !(seg in node.children)) return null
    node = node.children[seg]
  }
  return node
}

/** Directory listing: dirs get a trailing slash, encrypted files a lock tag. */
export function listDir(dir: FsDir): string[] {
  return Object.entries(dir.children)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, node]) =>
      node.type === 'dir' ? `${name}/` : node.encrypted ? `${name}  [ENCRYPTED]` : name,
    )
}

/** All child names under `path` that start with `prefix` (for tab completion). */
export function completePath(root: FsDir, cwd: string, partial: string): string[] {
  const slash = partial.lastIndexOf('/')
  const dirPart = slash >= 0 ? partial.slice(0, slash + 1) : ''
  const namePart = slash >= 0 ? partial.slice(slash + 1) : partial
  const dirNode = getNode(root, resolvePath(cwd, dirPart || undefined))
  if (!dirNode || dirNode.type !== 'dir') return []
  return Object.entries(dirNode.children)
    .filter(([name]) => name.startsWith(namePart))
    .map(([name, node]) => dirPart + name + (node.type === 'dir' ? '/' : ''))
    .sort()
}
