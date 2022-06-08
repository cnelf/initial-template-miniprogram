const computedBehavior = require('miniprogram-computed').behavior;
import { userAgent } from '@/utils/index';

Component({
  behaviors: [computedBehavior],

  properties: {
    pageIndex: {
      // 当前页
      type: Number,
      value: 1
    },
    pageSize: {
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
    showScrollTop: false,
    scrollTop: 0
  },

  computed: {
    // 已加载完
    ended(data) {
      const { pageIndex, pageSize, total } = data;
      return pageIndex * pageSize >= total;
    }
  },

  observers: {
    pageIndex: function () {
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
      if (!this.data.showScrollTop && scrollTop > 500) {
        this.setData({ showScrollTop: true });
      }
      if (this.data.showScrollTop && scrollTop <= 500) {
        this.setData({ showScrollTop: false });
      }
    },

    handleLoadMore() {
      const { loading, ended } = this.data;
      if (!loading && !ended) {
        this.setData({ loading: true });
        this.triggerEvent('load-more');
      }
    },

    handleRefresherRefresh() {
      this.setData({ refresherTriggered: false });
      this.triggerEvent('refresh');
    },

    handleScrollTop() {
      this.setData({ scrollTop: 0 });
    }
  }
});
