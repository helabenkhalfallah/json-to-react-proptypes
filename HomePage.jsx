import React, { useState } from 'react'
import PropTypes from 'prop-types'
import './ant.less'
import {
  Button,
  Input,
  Layout,
  Row,
  Col,
  Typography,
} from 'antd'

const {
  TextArea,
} = Input

const {
  Title,
} = Typography

const {
  Header,
  Content,
  Footer,
} = Layout

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

const AppHomePage = () => {
  const [sourceText, setSourceText] = useState()
  const [propTypeText, setPropTypeText] = useState()
  return (
    <>
      <Layout>
        <Header>
          <Row>
            <Col span={24}>
              <Title>
                Json to PropTypes
              </Title>
            </Col>
          </Row>
        </Header>
        <Content style={{
          marginTop: '1rem',
          marginRight: '1rem',
          marginLeft: '1rem',
        }}
        >
          <Row
            gutter={16}
            justify="center"
            align="middle"
          >
            <Col
              span={10}
            >
              <TextArea
                rows={25}
                value={sourceText}
                onChange={({ target: { value } }) => setSourceText(value)}
              />
            </Col>
            <Col
              span={2}
              style={{ padding: '0' }}
            >
              <Button
                type="primary"
                shape="round"
                onClick={() => {
                  const propTypes = convertJsonToPropTypes(sourceText)
                  const propsTypeTextDisplay = `
PropTypes : ${JSON.stringify(propTypes[0], null, 4).replace(/"/gi, '')}

DefaultProps : ${JSON.stringify(propTypes[1], null, 4).replace(/"/gi, '')}
                  `
                  setPropTypeText(propsTypeTextDisplay)
                }}
              >
                Convert
              </Button>
            </Col>
            <Col
              span={10}
            >
              <TextArea
                rows={25}
                value={propTypeText}
              />
            </Col>
          </Row>
        </Content>
        <Footer />
      </Layout>
    </>
  )
}

// propsType (validation)
AppHomePage.propTypes = {

}

// default props
AppHomePage.defaultProps = {

}

export default AppHomePage
