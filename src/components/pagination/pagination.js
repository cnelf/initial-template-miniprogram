const computedBehavior = require('miniprogram-computed').behavior;
import { userAgent } from '@/utils/index';

Component({
  behaviors: [computedBehavior],

  properties: {
    current: {
      // 当前页
      type: Number,
      value: 1
    },
    size: {
      // 每页条数
      type: Number,
      value: 10
    },
    total: {
      // 总条数
      type: Number,
      value: 0
    },
    scrollTopEnabled: {
      // 开启回到顶部按钮
      type: Boolean,
      value: true
    },
    refresherEnabled: {
      // 开启下拉刷新
      type: Boolean,
      value: true
    },
    openSafeBottom: {
      // 开启底部安全距离
      type: Boolean,
      value: true
    }
  },

  data: {
    safeBottom: 0,
    loading: false, // 正在加载
    refresherTriggered: false,
    scrollTopTriggered: false,
    scrollTop: 0
  },

  computed: {
    ended(data) {
      // 已加载完
      const { current, size, total } = data;
      return current * size >= total;
    }
  },

  observers: {
    current: function () {
      this.setData({ loading: false });
    }
  },

  lifetimes: {
    attached() {
      this.setData({ safeBottom: userAgent.safeBottom });
    }
  },

  methods: {
    handleScroll(e) {
      const { scrollTop } = e.detail;
      if (!this.data.scrollTopTriggered && scrollTop > 500) {
        this.setData({ scrollTopTriggered: true });
      }
      if (this.data.scrollTopTriggered && scrollTop <= 500) {
        this.setData({ scrollTopTriggered: false });
      }
    },

    handleLoadMore() {
      const { loading, ended } = this.data;
      if (!loading && !ended) {
        this.setData({ loading: true });
        this.triggerEvent('load-more', { pageIndex: this.data.current + 1, size: this.data.size });
      }
    },

    async handleRefresherRefresh() {
      const curPage = getCurrentPages().pop();
      // 当前页面必须实现initData方法
      typeof curPage.initData === 'function' && (await curPage.initData());
      this.setData({ refresherTriggered: false });
    },

    handleScrollTop() {
      this.setData({ scrollTop: 0 });
    }
  }
});
