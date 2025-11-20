Component({
  properties: {
    value: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'text'
    },
    password: {
      type: Boolean,
      value: false
    },
    placeholder: {
      type: String,
      value: '请输入'
    },
    maxlength: {
      type: Number,
      value: 140
    },
    disabled: {
      type: Boolean,
      value: false
    },
    label: {
      type: String,
      value: ''
    },
    required: {
      type: Boolean,
      value: false
    },
    errorMessage: {
      type: String,
      value: ''
    },
    hasError: {
      type: Boolean,
      value: false
    },
    confirmType: {
      type: String,
      value: 'done'
    },
    focus: {
      type: Boolean,
      value: false
    }
  },
  
  data: {
    showClear: false,
    isFocus: false
  },
  
  methods: {
    handleInput(e) {
      const value = e.detail.value;
      this.setData({
        showClear: !!value
      });
      this.triggerEvent('input', { value });
    },
    
    handleFocus(e) {
      this.setData({
        isFocus: true,
        showClear: !!e.detail.value
      });
      this.triggerEvent('focus', e.detail);
    },
    
    handleBlur(e) {
      this.setData({
        isFocus: false,
        showClear: false
      });
      this.triggerEvent('blur', e.detail);
    },
    
    handleClear() {
      this.setData({
        showClear: false
      });
      this.triggerEvent('input', { value: '' });
      this.triggerEvent('clear');
    },
    
    handleConfirm(e) {
      this.triggerEvent('confirm', e.detail);
    }
  }
}); 