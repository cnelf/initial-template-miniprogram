Page({
  data: {},

  handleConfirm() {
    wx.$history.navigateBack({ delta: 2 });
  }
});
