import Schema from 'async-validator';
import { autoLoading } from '@/utils/index';
import { fetchActComplainInfo } from '@/api/index';

Page({
  data: {
    form: {
      type: 0,
      activityName: '',
      complainContent: '',
      tel: ''
    },
    errorMessage: {
      complainContent: '',
      tel: ''
    }
  },

  onLoad({ type, name }) {
    this.setData({
      'form.type': type ? Number(type) : 0,
      'form.activityName': name ? name : ''
    });
  },

  handleInput(e) {
    const { key } = e.target.dataset;
    const { value } = e.detail;
    this.setData({ [`form.${key}`]: value });
  },

  async handleSubmit() {
    this.clearErrorMessage();
    const descriptor = {
      complainContent: { required: true, message: '请填写投诉描述/联系方式' },
      tel: {
        required: true,
        pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
        message: '请填写正确的联系方式'
      }
    };
    const validator = new Schema(descriptor);
    await validator.validate(this.data.form).catch(({ errors }) => {
      errors.forEach((error) => {
        const { field, message } = error;
        this.setData({ [`errorMessage.${field}`]: message });
      });
      throw new Error('校验失败');
    });
    await autoLoading(fetchActComplainInfo({ ...this.data.form }));
    wx.$router.redirectTo({ url: '/pagesExtra/complaints/success/success' });
  },

  clearErrorMessage() {
    this.setData({
      errorMessage: {
        complainContent: '',
        tel: ''
      }
    });
  },

  handleNavBack() {
    wx.$router.navigateBack();
  }
});
