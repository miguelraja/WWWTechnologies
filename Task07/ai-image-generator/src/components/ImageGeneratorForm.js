import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

export default function ImageGeneratorForm({ prompt, setPrompt, onGenerate }) {
  return (
    <Form className="mb-3">
      <Row className="justify-content-center">
        <Col md={6}>
          <Form.Control
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your image..."
          />
        </Col>
        <Col md="auto">
          <Button onClick={onGenerate} variant="primary">
            Generate
          </Button>
        </Col>
      </Row>
    </Form>
  );
}