import { SchematicContainer } from './SchematicContainer.js'

class SchematicComponentLibraryContainer extends SchematicContainer {
  constructor(section, slide) {
    super(section, slide, {
      containerType: 'component-library',
    })
  }

  addDropListener() {}
}

Heed.ContentSectionRegistry.register(
  'schematic:component-library',
  SchematicComponentLibraryContainer
)
