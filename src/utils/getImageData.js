const getImageData = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('loadend', event => {
      const img = new Image();

      img.onload = () => {
        resolve({
          src: URL.createObjectURL(file),
          name: file.name,
          type: file.type,
          size: file.size,
          dimensions: {
            width: img.width,
            height: img.height,
          },
        });
      };

      img.onerror = () => reject(new Error('An error occurred when uploading the image'));

      img.src = event.target.result;
    });

    reader.addEventListener('error', reject);
    reader.readAsDataURL(file);
  });

export default getImageData;
