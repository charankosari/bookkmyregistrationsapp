import React, { useEffect } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import {  useRoute } from "@react-navigation/native";

export default function ViewScreen({  }) {
  const route=useRoute();
  const { uri } = route.params;
  

  useEffect(() => {
    fetchAndDisplayPDF();
  }, [uri]);

  const fetchAndDisplayPDF = () => {
  
    const pdfUrl = `https://server.bookmyappointments.in/api/bma/downloadb?url=${uri}`;

    if (!pdfUrl) {
      console.error('PDF URL not provided.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Display PDF from Server</title>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
              overflow: hidden;
            }
            .loader {
              border: 8px solid #f3f3f3; /* Light grey */
              border-top: 8px solid #2BB673; /* Blue */
              border-radius: 50%;
              width: 50px;
              height: 50px;
              animation: spin 1s linear infinite;
              margin: auto;
              margin-top: 20px;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            #pdf-container {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            #pdf-viewer {
              width: 100%;
              height: auto;
              display: none;
              border: none;
            }
          </style>
      </head>
      <body>
        <div id="pdf-container">
          <div id="loading-indicator" class="loader"></div>
          <canvas id="pdf-viewer"></canvas>
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.min.js"></script>
        <script>
          async function fetchAndDisplayPDF() {
            try {
              const apiUrl = '${pdfUrl}';
              const response = await fetch(apiUrl);
              
              if (!response.ok) {
                throw new Error(\`HTTP error! Status: \${response.status}\`);
              }
              
              const pdfData = await response.arrayBuffer();
              const loadingIndicator = document.getElementById('loading-indicator');
              const canvas = document.getElementById('pdf-viewer');
              const context = canvas.getContext('2d');
              
              loadingIndicator.style.display = 'block';
              
              const pdf = await pdfjsLib.getDocument({data: pdfData}).promise;
              const page = await pdf.getPage(1);
              
              const viewport = page.getViewport({scale: 1});
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              
              await page.render({
                canvasContext: context,
                viewport: viewport
              }).promise;
              
              loadingIndicator.style.display = 'none';
              canvas.style.display = 'block';
            } catch (error) {
              console.error('Error fetching or displaying PDF:', error);
            }
          }
          fetchAndDisplayPDF();
        </script>
      </body>
      </html>
    `;

    return { html: htmlContent };
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        source={fetchAndDisplayPDF()}
        style={{ flex: 1 }}
      />
    </View>
  );
}