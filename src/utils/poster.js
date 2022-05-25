export default class Poster {
  constructor({ canvas, width = 375, height = 812 } = {}) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
  }

  async create(config) {
    this.config = config;
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    } else {
      this.ctx = this.canvas.getContext('2d');
      const dpr = wx.getSystemInfoSync().pixelRatio;
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.ctx.scale(dpr, dpr);
    }
    return this.drawByConfig();
  }

  async drawByConfig() {
    const cloneConfig = JSON.parse(JSON.stringify(this.config));
    for (const config of cloneConfig) {
      switch (config.type.toLowerCase()) {
        case 'background':
          this.drawBackground(config);
          break;
        case 'image':
          await this.drawImage(config);
          break;
        case 'text':
          this.drawText(config);
          break;
        case 'line':
          this.drawLine(config);
          break;
        case 'border':
          this.drawBorder(config);
          break;
        case 'arc':
          this.drawCircle(config);
          break;
      }
    }
    // 注：使用canvas 2d时传入canvas实例即可，不需要传canvasId
    const { tempFilePath } = await wx.canvasToTempFilePath({ canvas: this.canvas });
    return tempFilePath;

    // 导出base64格式图片
    // return this.canvas.toDataURL();
  }

  // 绘制背景
  drawBackground(config) {
    const { top, left, width, height, color } = config;
    this.ctx.save();
    this.clipRound(config);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(left, top, width, height);
    this.ctx.restore();
  }

  // 绘制图片
  async drawImage(config) {
    if (!config.url) {
      throw new Error('图片不能为空');
    }
    const { top, left, width, height, url, mode } = config;
    const img = await this.loadImage(url);
    this.ctx.save();
    this.clipRound(config);
    if (mode === 'aspectFill') {
      let clipLeft;
      let clipTop;
      let clipWidth;
      let clipHeight;
      clipHeight = img.width * (height / width);
      if (clipHeight > img.height) {
        clipHeight = img.height;
        clipWidth = clipHeight * (width / height);
        clipLeft = (img.width - clipWidth) / 2;
        clipTop = 0;
      } else {
        clipLeft = 0;
        clipTop = (img.height - clipHeight) / 2;
        clipWidth = img.width;
      }
      this.ctx.drawImage(img, clipLeft, clipTop, clipWidth, clipHeight, left, top, width, height);
    } else {
      this.ctx.drawImage(img, left, top, width, height);
    }
    this.ctx.restore();
  }

  async loadImage(url) {
    const img = this.canvas.createImage();
    img.src = url;

    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }

  // 绘制文字
  drawText(config) {
    if (config.text instanceof Array) {
      const textArr = config.text;
      delete config.text;
      textArr.forEach((textObj) => {
        const newConfig = { ...config, ...textObj };
        const { left, textWidth, margin = 0 } = this.handleDrawText(newConfig);
        config.left = config.textAlign === 'right' ? left - textWidth - margin : left + textWidth + margin;
      });
    } else {
      this.handleDrawText(config);
    }
  }

  handleDrawText(config) {
    const {
      text,
      fontSize = 20,
      fontWeight,
      textDecoration,
      maxRow = 10,
      maxWidth = 375,
      paddingTop = 0,
      paddingRight = 0,
      paddingLeft = 0,
      ellipsis = true,
      top,
      left,
      margin = 0,
      color,
      textAlign,
      baseline = 'top'
    } = config;
    let { lineHeight } = config;
    lineHeight = lineHeight || fontSize * 1.5;
    this.ctx.save();
    this.ctx.textAlign = textAlign;
    this.ctx.fillStyle = color;
    this.ctx.textBaseline = 'middle';
    this.ctx.font =
      fontWeight === 'bold'
        ? `bold ${fontSize}px/${lineHeight}px sans-serif`
        : `${fontSize}px/${lineHeight}px sans-serif`;

    const textArr = [];
    for (let i = 0; i < text.length; i++) {
      const textLine = (textArr[Math.max(textArr.length - 1, 0)] || '') + text[i];
      const { width: textWidth } = this.ctx.measureText(textLine);
      const index = Math.max(textWidth > maxWidth ? textArr.length : textArr.length - 1, 0);
      textArr[index] = (textArr[index] || '') + text[i];
    }

    if (textArr.length > maxRow) {
      textArr.length = maxRow;
      if (ellipsis) {
        textArr[maxRow - 1] = textArr[maxRow - 1].slice(0, -2) + '...';
      }
    }

    let textWidth = 0;
    textArr.forEach((item, index) => {
      const x = textAlign === 'right' ? left - margin : left + margin;
      let y = top + index * lineHeight;
      if (baseline === 'top') {
        y = top + index * lineHeight + lineHeight / 2;
      } else if (baseline === 'bottom') {
        y = top + index * lineHeight - lineHeight / 2;
      }
      const { width } = this.ctx.measureText(item);
      textWidth = width;
      this.ctx.fillText(item || '', x + paddingLeft, y + paddingTop);
      if (textDecoration === 'line-through') {
        const lineConfig = {
          startX: x - 2,
          startY: y,
          endX: left + textWidth + 6,
          endY: y,
          strokeStyle: color
        };
        this.drawLine(lineConfig);
      }
    });
    this.ctx.restore();

    return { ...config, textWidth: textWidth + paddingLeft + paddingRight };
  }

  // 绘制线条
  drawLine(config) {
    const { startX, startY, endX, endY, strokeStyle, dash } = config;
    this.ctx.save();
    this.ctx.beginPath();
    dash && this.ctx.setLineDash(dash, 0);
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.stroke();
    this.ctx.restore();
  }

  // 绘制边框
  drawBorder(config) {
    const { width, top, left, height, borderRadius, borderColor, borderWidth = 1 } = config;
    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = borderWidth;
    if (borderRadius) {
      // 画圆角矩形边框
      this.drawRadiusRect(config);
    } else {
      this.ctx.strokeRect(left, top, width, height);
    }
    this.ctx.stroke();
  }

  // 画圆角矩形
  drawRadiusRect(config) {
    const { left, top, width, height, borderRadius } = config;
    const br = borderRadius / 2;
    this.ctx.beginPath();
    this.ctx.moveTo(left + br, top); // 移动到左上角的点
    this.ctx.lineTo(left + width - br, top);
    this.ctx.arc(left + width - br, top + br, br, 2 * Math.PI * (3 / 4), 2 * Math.PI * (4 / 4));
    this.ctx.lineTo(left + width, top + height - br);
    this.ctx.arc(left + width - br, top + height - br, br, 0, 2 * Math.PI * (1 / 4));
    this.ctx.lineTo(left + br, top + height);
    this.ctx.arc(left + br, top + height - br, br, 2 * Math.PI * (1 / 4), 2 * Math.PI * (2 / 4));
    this.ctx.lineTo(left, top + br);
    this.ctx.arc(left + br, top + br, br, 2 * Math.PI * (2 / 4), 2 * Math.PI * (3 / 4));
  }

  drawCircle(config) {
    const {
      top,
      left,
      r,
      sAngle = 0,
      eAngle = 2 * Math.PI,
      counterclockwise = false,
      color = '#ffffff',
      alpha = 1
    } = config;
    this.ctx.save();
    this.fillStyle = color;
    this.globalAlpha = alpha;
    this.ctx.arc(top, left, r, sAngle, eAngle, counterclockwise);
    this.ctx.fill();
    this.ctx.restore();
  }

  // 绘制圆角
  clipRound(config) {
    const {
      top,
      left,
      width,
      height,
      borderRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomRightRadius,
      borderBottomLeftRadius
    } = config;
    const getArcRadius = (radius) => {
      const minSize = Math.min(width, height);
      return radius > minSize / 2 ? minSize / 2 : radius;
    };
    if (borderTopLeftRadius) {
      const r = getArcRadius(borderTopLeftRadius);
      this.ctx.beginPath();
      this.ctx.moveTo(left, top + height);
      this.ctx.arcTo(left, top, left + width, top, r);
      this.ctx.lineTo(left + width, top);
      this.ctx.lineTo(left + width, top + height);
      this.ctx.clip();
    }
    if (borderTopRightRadius) {
      const r = getArcRadius(borderTopRightRadius);
      this.ctx.beginPath();
      this.ctx.moveTo(left, top);
      this.ctx.arcTo(left + width, top, left + width, top + height, r);
      this.ctx.lineTo(left + width, top + height);
      this.ctx.lineTo(left, top + height);
      this.ctx.clip();
    }
    if (borderBottomRightRadius) {
      const r = getArcRadius(borderBottomRightRadius);
      this.ctx.beginPath();
      this.ctx.moveTo(left + width, top);
      this.ctx.arcTo(left + width, top + height, left, top + height, r);
      this.ctx.lineTo(left, top + height);
      this.ctx.lineTo(left, top);
      this.ctx.clip();
    }
    if (borderBottomLeftRadius) {
      const r = getArcRadius(borderBottomLeftRadius);
      this.ctx.beginPath();
      this.ctx.moveTo(left + width, top + height);
      this.ctx.arcTo(left, top + height, left, top, r);
      this.ctx.lineTo(left, top);
      this.ctx.lineTo(left + width, top);
      this.ctx.clip();
    }
    if (borderRadius) {
      const r = getArcRadius(borderRadius);
      this.ctx.beginPath();
      this.ctx.moveTo(left + r, top);
      this.ctx.arcTo(left + width, top, left + width, top + height, r);
      this.ctx.arcTo(left + width, top + height, left, top + height, r);
      this.ctx.arcTo(left, top + height, left, top, r);
      this.ctx.arcTo(left, top, left + width, top, r);
      this.ctx.clip();
    }
  }
}
