Component({
  externalClasses: ['body-class', 'content-class'],

  options: {
    multipleSlots: true
  },

  properties: {
    show: {
      type: Boolean,
      value: false
    },
    maskStyle: {
      type: String,
      value: 'background: rgba(0, 0, 0, .45);'
    },
    mask: {
      type: Boolean,
      value: true
    },
    showButton: {
      type: Boolean,
      value: false
    }
  },

  data: {
    animate: '',
    showComponent: false
  },

  observers: {
    show: function (newVal) {
      this.applyAnimate(newVal);
    }
  },

  methods: {
    applyAnimate(newVal) {
      if (newVal) {
        this.setData({ animate: 'open', showComponent: true });
      } else {
        this.setData({ showComponent: false });
      }
    },

    handleClose() {
      this.triggerEvent('close');
    }
  }
});
