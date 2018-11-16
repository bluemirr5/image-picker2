<template>
  <div class="container">
    <h3>Image Picker</h3>
    <hr />
    <div v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="12">
          <div v-for="item in lData" :key="item.location">
            <a @click.stop.prevent="downloadItem(item)">
              <div class="frame">
                <span class="helper"></span>
                <img v-bind:src="item.location" class="thumb">
              </div>
            </a>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-for="item in rData" :key="item.location">
            <a @click.stop.prevent="downloadItem(item)">
              <div class="frame">
                <span class="helper"></span>
                <img v-bind:src="item.location" class="thumb">
              </div>
            </a>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    loading: false,
    lData: [],
    rData: []
  }),
  computed: { },
  created () {
    this.getTabId().then(this.saveAsHtml).then((results) => {
      for (let i = 0; i < results.length; i++) {
        if (i % 2 === 0) {
          this.lData.push(results[i])
        } else {
          this.rData.push(results[i])
        }
      }
    })
  },
  mounted () { },
  methods: {
    getTabId () {
      return new Promise((resolve, reject) => {
        chrome.tabs.getSelected(null, (tab) => {
          resolve(tab.id)
        })
      })
    },
    saveAsHtml (id) {
      return new Promise((resolve, reject) => {
        chrome.pageCapture.saveAsMHTML({ tabId: id }, (htmlData) => {
          const reader = new FileReader()
          reader.addEventListener('loadend', () => {
            const boundary = this.getBoundaryFromBlobStr(reader.result)
            const contents = reader.result.split(boundary)
            let results = []
            for (let i = 0; i < contents.length; i++) {
              const imgUrl = this.getImageUrlFromContents(contents[i])
              if (imgUrl) {
                const viewObject = this.makeViewObjectFromURL(imgUrl)
                results.push(viewObject)
              }
            }
            resolve(results)
          })
          reader.readAsText(htmlData)
        })
      })
    },
    isImageContentsType (contentsString) {
      let retValue = false
      const contentsStringSplited = contentsString.split('Content-Type: ', 2)
      if (contentsStringSplited.length > 1) {
        const newLineSplited = contentsStringSplited[1].split('\n', 2)
        if (newLineSplited.length > 1) {
          const contentsType = newLineSplited[0]
          retValue = (contentsType.indexOf('image/') !== -1)
        }
      }
      return retValue
    },
    getContentsLocation (contentsString) {
      let contentsLocation = ''
      const contentsStringSplited = contentsString.split('Content-Location: ', 2)
      if (contentsStringSplited.length > 1) {
        const newLineSplited = contentsStringSplited[1].split('\n', 2)
        if (newLineSplited.length > 1) {
          contentsLocation = newLineSplited[0]
        }
      }
      return contentsLocation
    },
    getImageUrlFromContents (contentsString) {
      let retUrl
      if (this.isImageContentsType(contentsString)) {
        retUrl = this.getContentsLocation(contentsString)
      }
      return retUrl
    },
    makeViewObjectFromURL (url) {
      const obj = {}
      obj.location = url
      const nameTemps = obj.location.split('/')
      obj.fileName = nameTemps[nameTemps.length - 1]
      obj.fileName = obj.fileName.replace('=', '')
      obj.fileName = obj.fileName.replace('\n', '')
      obj.fileName = obj.fileName.replace(/[\n\r]/g, '')
      obj.fileName = obj.fileName.replace('"', '')
      obj.fileName = obj.fileName.replace(/"/g, '')
      return obj
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
      chrome.downloads.download({url: item.location}, (id) => {})
    }
  }
}
</script>
<style>
  .container {
    width: 500px;
  }
  .container h3 {
    text-align: center;
  }

  .frame {
    height: 70px;      /* equals max image height */
    width: 100%;
    border: 1px solid #999999;
    border-radius: 10px;
    white-space: nowrap;
    text-align: center;
    margin: 5px 0;
  }

  .helper {
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }

  img {
    background: #3A6F9A;
    vertical-align: middle;
    max-height: 70px;
    max-width: 200px;
  }
</style>
