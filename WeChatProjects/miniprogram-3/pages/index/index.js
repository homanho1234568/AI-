Page({
  data: {
    messages: [{ role: 'system', content: 'You are a helpful assistant powered by DeepSeek.' }],
    userInput: '',
    isThinking: false,
    isR1Enabled: false,
    isSearchEnabled: false,
  },

  // Update input value
  updateInput(e) {
    this.setData({ userInput: e.detail.value });
  },

  // Send message
  sendMessage() {
    const inputText = this.data.userInput.trim();
    if (!inputText) return;

    const messages = this.data.messages.concat({ role: 'user', content: inputText });
    this.setData({ messages, userInput: '', isThinking: true });
    this.callAPI(inputText); // Call callAPI here
  },

  // API call to backend
  callAPI(inputText) {
    const that = this;
    console.log('API Request Data:', {
      url: 'https://api.nineonepassword.online/api/chat',
      messages: this.data.messages,
      input: inputText,
      r1: this.data.isR1Enabled,
      search: this.data.isSearchEnabled
    });
    wx.request({
      url: 'http://52.196.248.204:6505/api/chat', // Use public IP if needed
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: {
        messages: this.data.messages,
        input: inputText,
        r1: this.data.isR1Enabled,
        search: this.data.isSearchEnabled,
      },
      success(res) {
        console.log('API Success:', res);
        const response = res.data;
        const newMessage = { role: 'assistant', content: response.content || 'Response from AI' };
        that.setData({
          messages: that.data.messages.concat(newMessage),
          isThinking: false,
        });
        that.scrollToBottom();
      },
      fail(err) {
        console.error('API Fail Details:', err);
        that.setData({
          messages: that.data.messages.concat({ role: 'assistant', content: 'API调用失败: ' + (err.errMsg || '未知错误') }),
          isThinking: false,
        });
      },
    });
  },
  
  // Start new chat
  startNewChat() {
    this.setData({
      messages: [{ role: 'system', content: 'You are a helpful assistant powered by DeepSeek.' }],
      isR1Enabled: false,
      isSearchEnabled: false,
      isThinking: false,
    });
  },

  // Toggle R1 reasoning
  toggleR1() {
    this.setData({ isR1Enabled: !this.data.isR1Enabled, isSearchEnabled: false });
  },

  // Toggle search
  toggleSearch() {
    this.setData({ isSearchEnabled: !this.data.isSearchEnabled, isR1Enabled: false });
  },

  // Scroll to bottom
  scrollToBottom() {
    wx.createSelectorQuery().select('#chat-history').boundingClientRect((rect) => {
      wx.pageScrollTo({ scrollTop: rect.height });
    }).exec();
  },

  // Lifecycle method
  onShow() {
    this.scrollToBottom();
  },
});