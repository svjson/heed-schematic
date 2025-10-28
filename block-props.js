export const getAttribute = (typeDef, overrides, attr, defaultValue) => {
  const typeVal = typeDef?.attributes?.[attr]
  const instVal = overrides?.[attr]

  return instVal || typeVal || defaultValue
}

export const getListAttribute = (typeDef, overrides, attr, defaultValue) => {
  const val = getAttribute(typeDef, overrides, attr, defaultValue)
  if (typeof val === 'string') {
    return val.split(',').map((s) => s.trim())
  }

  return defaultValue
}

export const getAttributes = (typeDef, overrides) => {
  return {
    color: getAttribute(typeDef, overrides, 'color', 'gray'),
    draggable: getAttribute(typeDef, overrides, 'draggable', true),
    shape: getAttribute(typeDef, overrides, 'shape', 'rectangle'),
    size: getAttribute(typeDef, overrides, 'size', 2),
    width: getAttribute(typeDef, overrides, 'width'),
    height: getAttribute(typeDef, overrides, 'height'),
  }
}

export const acceptsDropOfType = (mainType, subType, payload, slide) => {
  if (!subType) return true

  const cType = slide.getCustomType(
    { container: 'schematic:container-type', block: 'schematic-block-type' }[
      mainType
    ],
    subType
  )

  if (cType) {
    const accept = getListAttribute(cType, slide, 'drop.accept')
    if (Array.isArray(accept) && !accept.includes(payload.blockType)) {
      return false
    }
  }

  return true
}

export const applyBlockAttributes = (sectionEl, blockEl, section, slide) => {
  const { blockType } = section

  const typeDef = slide.getCustomType('schematic:block-type', blockType)

  const { color, draggable, width, height, size, shape } = getAttributes(
    typeDef,
    section
  )

  if (color) {
    blockEl.style.backgroundColor = color
  }
  if (width) {
    blockEl.style.width = width
  }
  if (height) {
    blockEl.style.height = height
  }
  if (shape) {
    sectionEl.classList.add(`heed-schematic-shape-${shape}`)
  }
  if (size) {
    sectionEl.classList.add(`heed-schematic-size-${size}`)
  }

  if (draggable !== false && draggable !== 'false') {
    blockEl.classList.add('hs-draggable')
    blockEl.setAttribute('draggable', true)
  }

  blockEl.innerText = section.content ?? ''
}
