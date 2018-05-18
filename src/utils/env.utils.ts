/** 完整路径 */
export function getFullSrc(path: string, placeholder: string = '') {
  let pathFull = placeholder;
  if (path && path.length > 0) {
    if (path.startsWith('http')) {
      pathFull = path;
    } else {
      pathFull = window.location.origin + '/' + path;
    }
  }
  return pathFull;
}
