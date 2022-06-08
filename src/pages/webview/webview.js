Page({
  data: {
    src: ''
  },

  onLoad({ src }) {
    this.setData({ src: decodeURIComponent(src) });
  }
});
