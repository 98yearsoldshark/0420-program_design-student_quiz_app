Component({
  properties: {
    text: {
      type: String,
      value: '按钮'
    },
    type: {
      type: String,
      value: 'primary'
    },
    size: {
      type: String,
      value: 'normal'
    },
    disabled: {
      type: Boolean,
      value: false
    },
    loading: {
      type: Boolean,
      value: false
    },
    block: {
      type: Boolean,
      value: false
    },
    round: {
      type: Boolean,
      value: false
    }
  },
  
  methods: {
    handleTap(e) {
      if (this.data.disabled || this.data.loading) return;
      this.triggerEvent('tap', e);
    }
  }
}); 