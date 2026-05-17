import React from 'react';
import { Image } from 'react-bootstrap';

export default function ImageDisplay({ url }) {
  return (
    <div className="text-center">
      <Image src={url} alt="AI Generated" fluid rounded className="shadow" />
    </div>
  );
}
