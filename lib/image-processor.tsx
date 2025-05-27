/**
 * Process an image to create a light concentration heatmap
 * 
 * This function:
 * 1. Converts the image to grayscale
 * 2. Normalizes brightness values
 * 3. Applies a JET colormap for visualization
 * 
 * @param file The image file to process
 * @returns A Promise that resolves to a data URL of the processed image
 */
export async function processImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Create an image element to load the file
        const img = new Image();
        img.onload = () => {
          // Create canvas for processing
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          // Set canvas dimensions to match image
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw the original image to canvas
          ctx.drawImage(img, 0, 0);
          
          // Get image data for processing
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Convert to grayscale and find min/max values for normalization
          let min = 255;
          let max = 0;
          const grayscaleValues = new Uint8Array(data.length / 4);
          
          for (let i = 0; i < data.length; i += 4) {
            // Convert RGB to grayscale using luminance formula
            const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
            grayscaleValues[i / 4] = gray;
            
            // Track min and max values for normalization
            if (gray < min) min = gray;
            if (gray > max) max = gray;
          }
          
          // Apply JET colormap (blue → cyan → green → yellow → red)
          for (let i = 0; i < data.length; i += 4) {
            const idx = i / 4;
            
            // Normalize value between 0 and 1
            const normalizedValue = (grayscaleValues[idx] - min) / (max - min || 1);
            
            // Apply JET colormap transformation
            let r, g, b;
            
            if (normalizedValue < 0.125) {
              r = 0;
              g = 0;
              b = 0.5 + 4 * normalizedValue;
            } else if (normalizedValue < 0.375) {
              r = 0;
              g = 4 * (normalizedValue - 0.125);
              b = 1;
            } else if (normalizedValue < 0.625) {
              r = 4 * (normalizedValue - 0.375);
              g = 1;
              b = 1 - 4 * (normalizedValue - 0.375);
            } else if (normalizedValue < 0.875) {
              r = 1;
              g = 1 - 4 * (normalizedValue - 0.625);
              b = 0;
            } else {
              r = 1 - 4 * (normalizedValue - 0.875);
              g = 0;
              b = 0;
            }
            
            // Set the new RGB values
            data[i] = Math.round(r * 255);
            data[i + 1] = Math.round(g * 255);
            data[i + 2] = Math.round(b * 255);
            // Keep the original alpha channel
          }
          
          // Put the modified image data back on the canvas
          ctx.putImageData(imageData, 0, 0);
          
          // Convert canvas to data URL and resolve the promise
          const dataUrl = canvas.toDataURL('image/png');
          resolve(dataUrl);
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load the image'));
        };
        
        // Set the source of the image to the file
        img.src = URL.createObjectURL(file);
      } catch (error) {
        reject(error);
      }
    });
  }