// backGroundImgURL PhoneButtonIcon  WeChatShareButtonIcon  CompanyLogoFile
// setBookLargeLogo  appLargeLogoIcon isFixLogoSize appLargeLogoURL LargeLogoTarget logoFixWidth logoFixHeight
// setPageCaption   totalPagesCaption pageNumberCaption
function Preview(options) {
    // console.log(this);
    // console.log(bookConfig);
    var self = this;
    $(window).on("message.endhtml5", function (event) {
      var data = event.originalEvent.data;
      // console.log(data);
      if (data.hasOwnProperty("type")) {
        var type = data.type.toString();
        if (data.showAlert) {
          BookPreview.isShowAlert = false;
        }
        switch (type) {
          case "previewBook":
            self.viewBook(data.key, data.value, data.showAlert);
            break;
          case "previewBook_back":
            self.back(data.showAlert);
            break;
          case "previewBook_forward":
            self.next(data.showAlert);
            break;
          case "previewBook_restore":
            self.restore();
            break;
          default:
            break;
        }
      }
    });
    this.yunzhan_host = options.yunzhan_host;
    this.book_host = options.book_host;
    this.init();
  }
  //ä½¿ç”¨å®žä¾‹
  // new KeyBridge({bgBeginColor:"#ffffff"});
  //è¿˜åŽŸçš„æ—¶å€™ä¸å¼¹å‡ºæç¤º
  //BookPreview.isShowAlert = false;
  Preview.prototype = {
    init: function () {
      try {
        checkBookConfig();
      } catch (err) {
        console.log(err);
      }
      this.bookConfig = JSON.parse(JSON.stringify(bookConfig));
      this.newBookConfig = JSON.parse(JSON.stringify(bookConfig));
      this.temporaryData = [];
      this.temporaryItem = {};
      this.step = 0;
    },
    changeView: function (key, params, configs, showAlert) {
      //éƒ¨åˆ†æ˜¾ç¤ºéšè—æŒ‰é’®çŠ¶æ€ä¼šå½±å“ç›¸å…³å‚æ•°çš„è®¾ç½®ï¼Œéœ€è¦å¸¦ä¸ŠæŒ‰é’®å‚æ•°
      if (
        key == "bgSoundVol" ||
        key == "FlipSound" ||
        key == "BackgroundSoundURL"
      )
        params["BackgroundSoundButtonVisible"] =
          configs["BackgroundSoundButtonVisible"];
      if (key == "PhoneButtonIcon" || key == "PhoneNumbers")
        params["PhoneButtonVisible"] = configs["PhoneButtonVisible"];
      var keyBridge = new KeyBridge(params);
  
      if (showAlert) {
        // console.log(keyBridge);
        // console.log(keyBridge.functionName);
  
        if (keyBridge.functionName != "showAlert") {
          top.postMessage(true, "*");
          keyBridge;
        } else {
          top.postMessage(false, "*");
        }
      }
    },
    viewBook: function (key, val, showAlert) {
      var changed = {},
        before = {};
      changed[key] = val;
      before[key] = this.newBookConfig[key];
      this.temporaryItem = {
        newParams: changed,
        oldParams: before,
      };
      this.changeView(key, changed, this.newBookConfig, showAlert);
      if (this.temporaryData.length !== this.step) {
        this.temporaryData = this.temporaryData.splice(0, this.step);
      }
      this.temporaryItem.key = key;
      this.temporaryItem.newVal = val;
      this.temporaryItem.oldVal = this.newBookConfig[key];
      this.temporaryData.push(this.temporaryItem);
      this.newBookConfig[key] = val;
      this.step++;
      // } catch (e) {
      //     console.log(e, 'error')
      // }
    },
    back: function (showAlert) {
      if (this.step == 0) return;
  
      var item = this.temporaryData[this.step - 1];
      this.changeView(item.key, item.oldParams, this.newBookConfig, showAlert);
      // console.log("back");
      // new KeyBridge(item.oldParams);
      this.step--;
      this.newBookConfig[item.key] = item.oldVal;
      window.postMessage(
        {
          type: "previewBook_back_return",
          key: item.key,
          value: item.oldVal,
          step: this.step == 0 ? "last" : "",
          referrer: "",
        },
        "*"
      );
      if (window.parent) {
        window.parent.postMessage(
          {
            type: "previewBook_back_return",
            key: item.key,
            value: item.oldVal,
            step: this.step == 0 ? "last" : "",
            referrer: "",
          },
          "*"
        );
      }
    },
  
    next: function (showAlert) {
      if (this.step == this.temporaryData.length) return;
  
      var item = this.temporaryData[this.step];
      this.changeView(item.key, item.newParams, this.newBookConfig, showAlert);
      // new KeyBridge(item.newParams);
      this.step++;
      this.newBookConfig[item.key] = item.newVal;
      window.postMessage(
        {
          type: "previewBook_next_return",
          key: item.key,
          value: item.newVal,
          step: this.step == this.temporaryData.length ? "first" : "",
          referrer: "",
        },
        "*"
      );
      if (window.parent) {
        window.parent.postMessage(
          {
            type: "previewBook_next_return",
            key: item.key,
            value: item.newVal,
            step: this.step == this.temporaryData.length ? "first" : "",
            referrer: "",
          },
          "*"
        );
      }
    },
    restore: function () {
      BookPreview.isShowAlert = false;
      for (var prop in this.bookConfig) {
        var changeItem = {};
        changeItem[prop] = this.bookConfig[prop];
        this.changeView(prop, changeItem, this.bookConfig);
        // new KeyBridge(changeItem);
      }
      BookPreview.isShowAlert = true;
      window.postMessage(
        {
          type: "previewBook_restore_return",
          value: this.bookConfig,
          referrer: "",
        },
        "*"
      );
      if (window.parent) {
        window.parent.postMessage(
          {
            type: "previewBook_restore_return",
            value: this.bookConfig,
            referrer: "",
          },
          "*"
        );
      }
      this.init();
    },
  };
  new Preview({
    yunzhan_host: "https://test.yunzhan365.com",
    book_host: "https://test2.yunzhan365.com",
  });