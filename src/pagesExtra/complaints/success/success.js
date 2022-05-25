Page({
  data: {},

  handleConfirm() {
    wx.$router.navigateBack({ delta: 2 });
  }
});
