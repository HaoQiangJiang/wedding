Component({
  data: {
    gridConfig: {
      column: 1,
      width: 150,
      height: 150
    },
    fileList: [],
  },
  methods: {
    handleAdd(e) {
      const {
        fileList
      } = this.data;
      const {
        files
      } = e.detail;
      files.forEach(file => this.onUpload(file))
    },
    onUpload(file) {
      const {
        fileList
      } = this.data;

      this.setData({
        fileList: [...fileList, {
          ...file,
          status: 'loading'
        }],
      });
      const {
        length
      } = fileList;

      const task = wx.uploadFile({
        url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
        filePath: file.url,
        name: 'file',
        formData: {
          user: 'test'
        },
        success: () => {
          this.setData({
            [`fileList[${length}].status`]: 'done',
          });
        },
      });
      task.onProgressUpdate((res) => {
        this.setData({
          [`fileList[${length}].percent`]: res.progress,
        });
      });
    },
    handleRemove(e) {
      const {
        index
      } = e.detail;
      const {
        fileList
      } = this.data;

      fileList.splice(index, 1);
      this.setData({
        fileList,
      });
    },
  },
});