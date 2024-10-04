import QRCode from 'qrcode';

async function qrCode(projURL: string) {
  const canvas = document.getElementById('canvas');

  QRCode.toCanvas(canvas, projURL, function (error) {
    if (error) {
      console.error(error);
    } else {
      console.log('QR code generated for: ', projURL);
    }
  });
}

export default qrCode