Component({
  properties: {
    bgColor: {
      type: String,
      value: '#FFFFFF'
    },
    elColor: {
      type: String,
      value: '#e5e5e5'
    },
    animation: {
      type: Boolean,
      value: false
    },
    borderRadius: {
      type: [String, Number],
      value: '10'
    },
    loading: {
      type: Boolean,
      value: true
    }
  },

  data: {
    top: 0,
		left: 0,
    windowWidth: 375, // 骨架屏宽度
		windowHeight: 750, // 骨架屏高度
		circleNodes: [], // 圆形元素
		RectNodes: [], // 矩形元素
		filletNodes: [], // 圆角元素
  },

  lifetimes: {
    ready() {
      this.selectorQueryInfo();
    }
  },

  methods: {
    // 查询各节点的信息
    selectorQueryInfo() {
      const query = wx.createSelectorQuery();
      query.selectAll('.page-skeleton').boundingClientRect().exec((res) => {
        this.setData({
          windowWidth: res[0][0].width,
          windowHeight: res[0][0].height,
          top: res[0][0].bottom - res[0][0].height,
          left: res[0][0].left
        });
      });
      // 圆形骨架元素
			this.getCircleEls();
      // 矩形骨架元素
			this.getRectEls();
			// 圆角骨架元素
			this.getFilletEls();
    },

    // 圆形元素列表
		getCircleEls() {
			const query = wx.createSelectorQuery();
			query.selectAll('.el-skeleton-circle').boundingClientRect().exec((res) => {
        this.setData({ circleNodes: res[0] });
			});
		},

    // 矩形元素列表
		getRectEls() {
			const query = wx.createSelectorQuery();
			query.selectAll('.el-skeleton-rect').boundingClientRect().exec((res) => {
        this.setData({ RectNodes: res[0] });
			});
		},

    // 圆角元素列表
		getFilletEls() {
			const query = wx.createSelectorQuery();
			query.selectAll('.el-skeleton-fillet').boundingClientRect().exec((res) => {
        this.setData({ filletNodes: res[0] });
			});
		},

    noop() {} // 阻止滚动穿透
  },
});
