<template>
  <div class="container">
    <h3>Image Picker</h3>
    <hr />
    <div v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="card" :body-style="{ padding: '0px' }" v-for="item in lData" :key="item.location" v-bind:title="item.fileName">
            <div class="header" @click.stop.prevent="downloadItem(item)">
              <img v-bind:src="item.location" class="image" @load="onloadImage($event, item)" alt="target">
            </div>
            <div class="desc" @click.stop.prevent="downloadItem(item)">
              <span>[ <strong>{{ item.imageInfo.width }}</strong> X <strong>{{ item.imageInfo.height }}</strong> ] </span> type:   <strong>{{ item.ext  }}</strong>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="card" :body-style="{ padding: '0px' }" v-for="item in rData" :key="item.location" v-bind:title="item.fileName">
            <div class="header" @click.stop.prevent="downloadItem(item)">
              <img v-bind:src="item.location" class="image" @load="onloadImage($event, item)" alt="target">
            </div>
            <div class="desc" @click.stop.prevent="downloadItem(item)">
              <span>[ <strong>{{ item.imageInfo.width }}</strong> X <strong>{{ item.imageInfo.height }}</strong> ] </span> type:   <strong>{{ item.ext  }}</strong>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    loading: false,
    oData: null
  }),
  computed: {
    lData: function () {
      if (this.oData && this.oData.length > 0) return this.oData.filter((item, index) => index % 2 === 0)
      else return []
    },
    rData: function () {
      if (this.oData && this.oData.length > 0) return this.oData.filter((item, index) => index % 2 === 1)
      else return []
    }
  },
  created () {
    chrome.tabs.getSelected(null, (tab) => {
      chrome.pageCapture.saveAsMHTML({ tabId: tab.id }, (htmlData) => {
        const reader = new FileReader()
        reader.addEventListener('loadend', () => {
          const boundary = this.getBoundaryFromBlobStr(reader.result)
          const contents = reader.result.split(boundary)
          this.oData = contents.map(it => this.parseContents(it)).filter(it => !!it)
        })
        reader.readAsText(htmlData)
      })
    })
  },
  mounted () { },
  methods: {
    parseContents (contentsString) {
      // const me = this
      const newLineSplited = contentsString.split('\n', 5)
      const contentTypeStr = newLineSplited[1].split('Content-Type: ', 2)
      if (contentTypeStr[1] && (contentTypeStr[1].indexOf('image/') !== -1)) {
        const ret = {}
        const contentsStringSplited = newLineSplited[3].split('Content-Location: ', 2)
        const temp = contentsStringSplited[1].split('\n', 2)
        if (newLineSplited.length > 1) {
          ret.location = temp[0]
          ret.fileName = this.filterFileName(ret.location)
          ret.ext = ret.fileName.slice(ret.fileName.indexOf('.') + 1).toLowerCase()
          ret.imageInfo = {
            width: 0,
            height: 0
          }
        }
        return ret
      } else {
        return null
      }
    },
    filterFileName (name) {
      const nameTemps = name.split('/')
      let ret = nameTemps[nameTemps.length - 1]
      ret = ret.replace('=', '').replace('\n', '').replace(/[\n\r]/g, '').replace('"', '').replace(/"/g, '')
      return ret
    },
    getBoundaryFromBlobStr (str) {
      const tempArray = str.split('\tboundary="')
      if (tempArray.length > 0) {
        const boundaryTempArray = tempArray[1].split('\n')
        if (boundaryTempArray.length > 0) {
          let boundary = boundaryTempArray[0]
          const temp = boundary.split('"')
          boundary = temp[0]
          return boundary
        } else {
          return null
        }
      } else {
        return null
      }
    },
    downloadItem (item) {
      chrome.downloads.download({url: item.location}, () => {})
    },
    onloadImage (evt, item) {
      if (evt.path[0]) {
        this.$nextTick().then(() => {
          item.imageInfo.width = evt.path[0].naturalWidth
          item.imageInfo.height = evt.path[0].naturalHeight
        })
      }
    }
  }
}
</script>
<style lang="scss">
  body {
    color: #999;
  }
  .container {
    width: 500px;
  }
  .container h3 {
    text-align: center;
    position: relative;
    span {
      position: absolute;
      right: 12px;
    }
  }

  .card {
    .header {
      text-align: center;
    }
    margin-bottom: 10px;
    img {
      height: 70px
    }
    .desc {
      color: #999;
      text-align: center;
      padding: 4px;
      span {
        text-overflow:ellipsis;
        white-space:nowrap;
        word-wrap:normal;
        width:100%;
        overflow:hidden;
      }
    }
  }
  img {
    /*background: #3A6F9A;*/
    vertical-align: middle;
    max-height: 70px;
    max-width: 200px;
  }
</style>
