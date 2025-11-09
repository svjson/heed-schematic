export const addDomObserver = ({ el, onChildRemoved, onChildAdded }) => {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (node.classList?.contains('heed-schematic-item-container')) {
            onChildAdded(el, node)
          }
        }

        for (const node of mutation.removedNodes) {
          if (node.classList?.contains('heed-schematic-item-container')) {
            onChildRemoved(el, node)
          }
        }
      }
    }
  })

  observer.observe(el, { childList: true })
  el._observer = observer
}

export const rectsIntersect = (a, b) => {
  return !(
    a.left > b.right ||
    a.right < b.left ||
    a.top > b.bottom ||
    a.bottom < b.top
  )
}

export const rectCenter = (rect) => {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  }
}

export const rectOffset = (a, b) => {
  const bCenter = rectCenter(b)
  return {
    x: bCenter.x - a.x,
    y: bCenter.y - a.y,
  }
}

export const rectOffsetPc = (a, b) => {
  const bCenter = rectCenter(b)
  return {
    x: ((bCenter.x - a.x) / a.width) * 100,
    y: ((bCenter.y - a.y) / a.height) * 100,
  }
}

export const mostSpecificIntersection = (rect, candidates) => {
  // pick the smallest area among those
  return (
    candidates.sort(
      (a, b) => a.rect.width * a.rect.height - b.rect.width * b.rect.height
    )[0] || null
  )
}
