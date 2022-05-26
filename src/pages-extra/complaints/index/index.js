import { COMPLAINTS_REASON_LIST } from '@/constants/index';

Page({
  data: {
    COMPLAINTS_REASON_LIST
  },

  onLoad({ name }) {
    this.name = name; // 活动名称
  },

  handleSelectReason(e) {
    const { type } = e.currentTarget.dataset;
    wx.$router.nav(`/pages-extra/complaints/form/form?type=${type}&name=${this.name}`);
  }
});
