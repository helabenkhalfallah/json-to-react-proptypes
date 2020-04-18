
const isValidJSONString = (str) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

const formatPropTypes = (data) => JSON.stringify(data, null, 4)
  .replace(/"/gi, '')
  .replace(/\[/gi, 'PropTypes.arrayOf(')
  .replace(/PropTypes.arrayOf\(\n {7} {/gi, 'PropTypes.arrayOf(\n       PropTypes.shape({')
  .replace(/\]/gi, ')')
  .replace(/: {/gi, ': PropTypes.shape({')
  .replace(/}\n/gi, '},')
  .replace(/},/gi, '}),')
  .replace(/}\),\n {4}\),/gi, '}),\n')
  .replace(/}\), {12}}\),/gi, '}),\n            }),')
  .replace(/}\), {4}\),/gi, '}),\n    ),')

const formatDefaultPropTypes = (data) => JSON.stringify(data, null, 4)
  .replace(/"/gi, '')

const propTypesForObject = (
  propTypes = {},
  defaultPropTypes = {},
  data = {},
) => {
  if (!data
    || !Object.keys(data)
    || !Object.keys(data).length) {
    return [
      propTypes,
      defaultPropTypes,
    ]
  }
  const propTypesCopy = {
    ...propTypes,
  }
  const defaultPropTypesCopy = {
    ...defaultPropTypes,
  }
  const key = Object.keys(data)[0]
  const value = data[key]

  if (typeof value === 'string') {
    defaultPropTypesCopy[key] = null
    propTypesCopy[key] = 'PropTypes.string'
  }

  if (typeof value === 'number') {
    defaultPropTypesCopy[key] = 0
    propTypesCopy[key] = 'PropTypes.number'
  }

  if (typeof value === 'boolean') {
    defaultPropTypesCopy[key] = false
    propTypesCopy[key] = 'PropTypes.bool'
  }

  if (typeof value === 'object') {
    const [
      firstPropType,
      firstDefaultPropType,
    ] = propTypesForObject(
      {},
      {},
      value,
    )
    defaultPropTypesCopy[key] = firstDefaultPropType
    propTypesCopy[key] = firstPropType
  }

  if (value && Array.isArray(value)) {
    const [
      first,
    ] = value

    if (typeof first === 'string') {
      defaultPropTypesCopy[key] = null
      propTypesCopy[key] = ['PropTypes.string']
    }

    if (typeof first === 'number') {
      defaultPropTypesCopy[key] = 0
      propTypesCopy[key] = ['PropTypes.number']
    }

    if (typeof first === 'boolean') {
      defaultPropTypesCopy[key] = false
      propTypesCopy[key] = ['PropTypes.bool']
    }

    if (typeof first === 'object') {
      const [
        firstPropType,
      ] = propTypesForObject(
        {},
        {},
        first,
      )
      defaultPropTypesCopy[key] = []
      propTypesCopy[key] = [firstPropType]
    }
  }

  const restData = Object.keys(data).reduce((acc, next) => {
    if (next !== key) {
      return {
        ...acc,
        [next]: data[next],
      }
    }
    return acc
  }, {})
  return propTypesForObject(
    propTypesCopy,
    defaultPropTypesCopy,
    restData,
  )
}

const convertJsonToPropTypes = (sourceText) => {
  if (!isValidJSONString(sourceText)) return null

  const data = JSON.parse(sourceText)

  // a valid json string :
  // {"isConnected": true} => the minimal valid json
  // parent node must be an object
  // propTypes are object, we should have :
  // {"user" :  {"name": "XXX"}} or {"users": [{"user" :  {"name": "XXX"}}]}
  // or
  /* {
    "users": [{
      "user": {
        "name": "XXX"
      }
    }],
    "isEmpty": false
   } */
  // or {notes: ["AA", "BBB"]} or {notes: [1, 2]}
  // we take first element and check it type
  if (!data
      || typeof data !== 'object'
      || !Object.keys(data)
      || !Object.keys(data).length) {
    return null
  }

  // propTypes object
  return propTypesForObject({}, {}, data)
}


const ValidatorUtils = {
  formatPropTypes,
  formatDefaultPropTypes,
  convertJsonToPropTypes,
}

export default ValidatorUtils
