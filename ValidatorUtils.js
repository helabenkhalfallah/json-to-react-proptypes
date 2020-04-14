
const isValidJSONString = (str) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
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

  // iterate throw key and check types

  const propTypes = {}
  const defaultPropTypes = {}
  Object.keys(data).forEach((key) => {
    const value = data[key]

    // we test simple case then we handle edge case like :
    // an array of different values types
    // we assume at this step that array contains
    // same values types

    // default null for all we can enhance
    defaultPropTypes[key] = null

    // if value is type of Array
    if (Array.isArray(value)) {
      const [
        first,
      ] = value || []
      if (typeof first === 'string') {
        propTypes[key] = 'PropTypes.arrayOf(PropTypes.string)'
      }

      if (typeof first === 'number') {
        propTypes[key] = 'PropTypes.arrayOf(PropTypes.number)'
      }

      if (typeof first === 'boolean') {
        propTypes[key] = 'PropTypes.arrayOf(PropTypes.bool)'
      }

      if (typeof first === 'object') {
        // TODO nested
        propTypes[key] = 'PropTypes.shape({}))'
      }
    }

    // if value is type of object
    // TODO nested
    if (typeof value === 'object') {
      propTypes[key] = 'PropTypes.shape({})'
    }

    // if value is type of string
    if (typeof value === 'string') {
      propTypes[key] = 'PropTypes.arrayOf(PropTypes.string)'
    }

    // if value is type of number
    if (typeof value === 'number') {
      propTypes[key] = 'PropTypes.arrayOf(PropTypes.number)'
    }

    // if value is type of bool
    if (typeof value === 'boolean') {
      propTypes[key] = 'PropTypes.arrayOf(PropTypes.bool)'
    }
  })


  return [
    propTypes,
    defaultPropTypes,
  ]
}


const ValidatorUtils = {
  convertJsonToPropTypes,
}

export default ValidatorUtils
