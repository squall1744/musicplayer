var EventCenter = {
  on: function(type, handler) {
    $(document).on(type, handler)
  },
  fire: function(type, data) {
    return $(document).trigger(type, data)
  }
}


var Footer = {
  init: function() {
    this.$footer = $('.footer')
    this.$pre = $('.pre')
    this.$next = $('.next')
    this.$footerLayout = $('.footer .layout')
    this.end = false
    this.start = true
    this.bind()
    this.render()
  },

  bind: function() {
    var _this = this
    $(window).on('resize', function() {
      _this.setStyle()
    })

    _this.$next.on('click', function() {
      var count = Math.floor(_this.$footerLayout.width()/_this.$footer.find('li').outerWidth(true))
      _this.start = false
      if(!_this.end) {
        _this.$footer.find('ul').animate({
          left: '-=' + count * _this.$footer.find('li').outerWidth(true)
        },500, function() {
          console.log(parseInt(_this.$footerLayout.width()))
          console.log(parseInt(_this.$footer.find('ul').css('left')))
          console.log(parseInt(_this.$footer.find('li').length * _this.$footer.find('li').outerWidth(true)))
          if(parseInt(_this.$footerLayout.width())- parseInt(_this.$footer.find('ul').css('left')) >= parseInt(_this.$footer.find('li').length * _this.$footer.find('li').outerWidth(true))) {
            _this.end = true
          }
        })
      }
    })

    _this.$pre.on('click', function() {
      _this.end = false
      var count = Math.floor(_this.$footerLayout.width()/_this.$footer.find('li').outerWidth(true))
      if(!_this.start) {
        _this.$footer.find('ul').animate({
          left: '+=' + count * _this.$footer.find('li').outerWidth(true)
        },500, function(){
          if(parseInt(_this.$footer.find('ul').css('left')) >= 0) {
            _this.start = true
          }
        })
      }
    })
  },

  render: function() {
    var _this = this
    $.getJSON('http://api.jirengu.com/fm/getChannels.php')
      .done(function(ret){
        _this.renderFooter(ret.channels)
        _this.setStyle()
      }).fail(function(){
        console.log('error')
      })
  },

  renderFooter: function(channels) {

    var html = ''
    channels.forEach(function(channel){
      html += '<li class="group" data-channel-id=' + channel.channel_id + '>'
      html += '<div class="content">'
      html += '<div class="img" style ="background-image:url('+ channel.cover_small + ')"></div>'
      html += '<p>' + channel.name + '</p>'
      html += '</div></li>'
    })
    this.$footer.find('ul').html(html)
  },

  setStyle: function() {
    var count = this.$footer.find('li').length
    var width = this.$footer.find('li').outerWidth(true)
    var len = width * count
    this.$footer.find('ul').css({
      width: len
    })
  }

}

Footer.init()
