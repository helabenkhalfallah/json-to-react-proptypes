import React, { useState } from 'react'
import 'antd/dist/antd.css'
import {
  Button,
  Input,
  Layout,
  Row,
  Col,
  Typography,
} from 'antd'
import JPTransformer from './JPTransformer'

const {
  formatPropTypes,
  formatDefaultPropTypes,
  convertJsonToPropTypes,
} = JPTransformer

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


const JPHomePage = () => {
  const [sourceText, setSourceText] = useState()
  const [propTypeText, setPropTypeText] = useState()
  return (
    <>
      <Layout>
        <Header
        style={{ backgroundColor : 'white'}}
        >
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
            >
              <Button
                type="danger"
                shape="round"
                onClick={() => {
                  const propTypes = convertJsonToPropTypes(sourceText)
                  const propsTypeTextDisplay = `
import PropTypes from 'prop-types'

// propsType (validation)
MyComponent.propTypes = ${formatPropTypes(propTypes[0])}

// default props
MyComponent.defaultProps = ${formatDefaultPropTypes(propTypes[1])}
                  `
                  setPropTypeText(propsTypeTextDisplay)
                }}
              >
                J2P >>
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
JPHomePage.propTypes = {

}

// default props
JPHomePage.defaultProps = {

}

export default JPHomePage
