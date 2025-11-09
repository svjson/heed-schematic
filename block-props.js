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
    left: getAttribute(typeDef, overrides, 'left'),
    top: getAttribute(typeDef, overrides, 'top'),
    right: getAttribute(typeDef, overrides, 'right'),
    bottom: getAttribute(typeDef, overrides, 'bottom'),
  }
}

export const acceptsDropOfType = (slide, targetModel, dropModel) => {
  if (targetModel?.schematicType === 'component-library') return false
  const isContainer = targetModel?.schematicType === 'container'

  const targetType = targetModel
    ? slide.getCustomType(
        `schematic:${targetModel.schematicType}-type`,
        targetModel.type
      )
    : null

  const dropType = dropModel
    ? slide.getCustomType(
        `schematic:${dropModel.schematicType}-type`,
        dropModel.type
      )
    : null

  if (!targetType) return isContainer

  const accept = getListAttribute(targetType, slide, 'drop.accept')
  if (Array.isArray(accept)) {
    if (!dropType) return false
    return accept.includes(dropModel.type)
  }

  return true
}

export const applyBlockAttributes = (sectionEl, blockEl, section, slide) => {
  const { customType } = section

  const typeDef = slide.getCustomType('schematic:block-type', customType)

  const { color, draggable, left, top, bottom, right, shape, size } =
    getAttributes(typeDef, section)

  if (left) {
    sectionEl.style.left = left
  }
  if (right) {
    sectionEl.style.right = right
  }

  if (top) {
    sectionEl.style.top = top
  }
  if (bottom) {
    sectionEl.style.bottom = bottom
  }

  if (color) {
    blockEl.style.backgroundColor = color
    blockEl.style.setProperty('--elm-bg', color)
  }
  if (shape) {
    sectionEl.classList.add(`heed-schematic-shape-${shape}`)
  }

  if (draggable !== false && draggable !== 'false') {
    blockEl.classList.add('hs-draggable')
    //blockEl.setAttribute('draggable', true)
  }

  blockEl.innerText = section.content ?? ''
}

export const updateBlockAttributes = (parentEl, blockEl, _, slide) => {
  const controller = blockEl._controller
  const section = controller.section
  const { customType } = section

  const typeDef = slide.getCustomType('schematic:block-type', customType)
  const { size } = getAttributes(typeDef, section)

  const blockSectionEl = blockEl.parentElement

  if (size) {
    const parentRect = parentEl.getBoundingClientRect()
    const containerRect =
      controller.model.dimensionContextRect ??
      controller.getRootContainerRect() ??
      parentRect
    const sizeAttr = Number.parseInt(size)
    const pcw = (sizeAttr + 1) * 0.05
    const pxw = containerRect.width * pcw
    blockSectionEl.style.width = `${pxw}px`

    const ui = controller.model.ui
    ui.pcw = pcw
    ui.w = pxw
    ui.x = parseFloat(blockSectionEl.style.left)
    ui.y = parseFloat(blockSectionEl.style.top)
    ui.pcx = (ui.x + ui.w / 2) / parentRect.width
  }
}
