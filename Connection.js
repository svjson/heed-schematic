import { getAttribute } from './block-props.js'

export const parseConnectionTypes = (element) => {
  const section = element.model.section
  const typeAttributes = element.customType?.attributes ?? {}

  const connectKeys = new Set()
  Object.keys(section).forEach((key) => {
    if (key.startsWith('connect.')) {
      connectKeys.add(key)
    }
  })
  Object.keys(typeAttributes).forEach((key) => {
    if (key.startsWith('connect.')) {
      connectKeys.add(key)
    }
  })

  const connectionTypes = {}

  connectKeys.forEach((key) => {
    const val = getAttribute(element.customType, section, key)
    const [_, targetType, targetIdentifier, property] = key.split('.')
    const entry = _ensureEntry(connectionTypes, targetType, targetIdentifier)
    entry[property] = val
  })

  return connectionTypes
}

const _parseTargetIdentifier = (identifier) => {
  const match = identifier.match(/^([^\[\]]+)(?:\[([^\[\]]+)\])?$/)
  return {
    type: match ? match[1] : null,
    blockType: match && match[2] ? match[2] : null,
  }
}

const _ensureEntry = (connTypes, targetType, targetIdentifier) => {
  const typeMap = (connTypes[targetType] ??= {})
  const identifier = _parseTargetIdentifier(targetIdentifier)
  const identMap = (typeMap[identifier.type] ??= { subTypes: {} })

  if (identifier.blockType) {
    const subTypeMap = (identMap.subTypes[identifier.blockType] ??= {})
    return subTypeMap
  }
  return identMap
}

export const findConnections = (block, others) => {
  const result = []
  others.forEach((target) => {
    if (block === target) return
    const schemTypeConns = block.connectionTypes[target.schematicType]
    if (schemTypeConns) {
      const typeConns = schemTypeConns[target.type]
      if (typeConns) {
        if (
          Object.keys(typeConns.subTypes).length &&
          !typeConns.subTypes[target.id]
        )
          return
        const conn = {
          from: block,
          to: target,
          props: {},
        }

        const propSource = typeConns.subTypes[target.id] ?? typeConns

        conn.props.auto = Boolean(propSource.auto)

        result.push(conn)
      }
    }
  })
  return result
}
