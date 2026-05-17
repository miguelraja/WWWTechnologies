import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import ImageGeneratorForm from './components/ImageGeneratorForm';
import ImageDisplay from './components/ImageDisplay';
import Loader from './components/Loader';

//const { AzureOpenAI } = require('openai');
import OpenAI from 'openai';

const endpoint = process.env.REACT_APP_AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.REACT_APP_AZURE_OPENAI_API_KEY;
//const deploymentName = process.env.REACT_APP_AZURE_OPENAI_DEPLOYMENT_NAME;
//const apiVersion = process.env.REACT_APP_AZURE_OPENAI_API_VERSION;
const deploymentName = "gpt-image-1";
const apiVersion = "";

function getClient() {
//  return new AzureOpenAI({
//    endpoint,
//    apiKey,
//    apiVersion,
//    deployment: deploymentName,
//    dangerouslyAllowBrowser: true,
//  });
  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });
}


function App() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt) return;

    setLoading(true);
    setImageUrl('');

    try {
      const client = getClient();
      console.log('Generating image with prompt:', prompt);

      const results = await client.images.generate({
        prompt: prompt,
        model: deploymentName,
        size: '1024x1024',
        n: 1,
        quality: 'medium'
      });
      
      const image_base64 = results.data[0].b64_json;
      console.log('Received image data (base64):', image_base64);

      const mime = "image/png";

      const image_src = image_base64.startsWith("data:") 
                    ? image_base64 
                    : `data:${mime};base64,${image_base64}`;
      
      setImageUrl(image_src);
    } catch (err) {
      console.error(err);
      alert('Failed to generate image.');
    }

    setLoading(false);
  };


  return (
    <div className="min-vh-100 bg-light text-center py-4 px-2">
      <h1 className="h2 fw-bold mb-4">AI Image Generator with Azure OpenAI</h1>
      <ImageGeneratorForm
        prompt={prompt}
        setPrompt={setPrompt}
        onGenerate={generateImage}
      />
      {loading && <Loader />}
      {imageUrl && <ImageDisplay url={imageUrl} />}
    </div>
  );

}

export default App;
