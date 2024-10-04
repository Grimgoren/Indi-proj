import QRCode from 'qrcode';

async function qrCode() {
  const canvas = document.getElementById('canvas');

  QRCode.toCanvas(canvas, 'sample text', function (error) {
    if (error) {
      console.error(error);
    } else {
      console.log('QR code generated successfully!');
    }
  });
}

export default qrCode