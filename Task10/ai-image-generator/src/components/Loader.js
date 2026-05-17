import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function Loader() {
  return (
    <div className="text-center my-3">
      <Spinner animation="border" role="status" />
      <div className="mt-2 text-muted">Generating image...</div>
    </div>
  );
}
