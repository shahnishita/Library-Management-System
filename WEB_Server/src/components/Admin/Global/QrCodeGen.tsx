import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  url: string;
  identifier: string;
  width?: number;
  height?: number;
}

const QRCodeGenerator = async ({ url, identifier, width = 300, height = 300 }: QRCodeGeneratorProps): Promise<string> => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) throw new Error('Failed to get canvas context');

  const stickerWidth = width - 70; 
  const stickerHeight = height + 10; 
  canvas.width = stickerWidth;
  canvas.height = stickerHeight;

  const radius = 20; 

  const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  context.clearRect(0, 0, stickerWidth, stickerHeight);

  context.fillStyle = '#fff';
  drawRoundedRect(context, 0, 0, stickerWidth, stickerHeight, radius);
  context.fill();

  const qrCodeCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCodeCanvas, url, { width: width - 40 });

  context.drawImage(qrCodeCanvas, -20, 15); 

  context.fillStyle = '#000';
  context.font = 'bold 35px sans-serif'; 
  context.textAlign = 'center';
  const text = identifier;
  const letterSpacing = 8; 
  let startX = (stickerWidth - (context.measureText(text).width + (letterSpacing * (text.length - 1)))) / 2;

  for (const char of text) {
    context.fillText(char, startX, height - 25);
    startX += context.measureText(char).width + letterSpacing;
  }

  return canvas.toDataURL();
};

export default QRCodeGenerator;

