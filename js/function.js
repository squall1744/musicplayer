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
	this.isAnimatie = false
	
    this.bind()
    this.render()
  },

  bind: function() {
    var _this = this
    $(window).on('resize', function() {
      _this.setStyle()
    })

    _this.$next.on('click', function() {
		if(_this.isAnimatie) return
      var count = Math.floor(_this.$footerLayout.width()/_this.$footer.find('li').outerWidth(true))
      _this.start = false
      if(!_this.end) {
		  _this.isAnimatie = true
        _this.$footer.find('ul').animate({
          left: '-=' + count * _this.$footer.find('li').outerWidth(true)
        },500, function() {
			_this.isAnimatie = false
          if(parseInt(_this.$footerLayout.width())- parseInt(_this.$footer.find('ul').css('left')) >= parseInt(_this.$footer.find('li').length * _this.$footer.find('li').outerWidth(true))) {
            _this.end = true
          }
        })
      }
    })

    _this.$pre.on('click', function() {
      _this.end = false
	  if(_this.isAnimatie) return
      var count = Math.floor(_this.$footerLayout.width()/_this.$footer.find('li').outerWidth(true))
      if(!_this.start) {
		  _this.isAnimatie = true
        _this.$footer.find('ul').animate({
          left: '+=' + count * _this.$footer.find('li').outerWidth(true)
        },500, function(){
			_this.isAnimatie = false
          if(parseInt(_this.$footer.find('ul').css('left')) >= 0) {
            _this.start = true
          }
        })
      }
    })
	
	_this.$footer.on('click', 'li', function() {
		EventCenter.fire('select-album', {
		  channelId: $(this).attr('data-channel-id'),
		  channelName: $(this).attr('data-channel-name')
		  })
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
      html += '<li class="group" data-channel-id=' + channel.channel_id + ' data-channel-name=' + channel.name +'>'
      html += '<div class="content">'
      html += '<div class="albumImg" style ="background-image:url('+ channel.cover_small + ')"></div>'
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



var Fm = {
	init: function() {
	  this.$container = $('.wrap')
	  this.bind()
	  this.audio = new Audio()
	  this.audio.autoplay = true
	},
	
	bind: function() {
	  var _this = this
	  EventCenter.on('select-album', function(event, channelObj){
		  _this.channelId = channelObj.channelId
		  _this.channelName = channelObj.channelName
		  _this.loadMusic(function(){
			  _this.setMusic()
		  })
	  })
	  
	 _this.$container.find('.btn-play').on('click', function(){
		 if($(this).hasClass('icon-play')) {
			 $(this).removeClass('icon-play').addClass('icon-stop')
			 _this.audio.pause()
		 }else {
			$(this).removeClass('icon-stop').addClass('icon-play')
			_this.audio.play()
		 } 	  
	  })
	  
	  _this.$container.find('.icon-forward').on('click', function(){
		  _this.loadMusic(function(){
			  _this.setMusic()
		  })
	  })
	  
	  
	},
	
	loadMusic: function(callback) {
		var _this = this
	  $.getJSON('http://api.jirengu.com/fm/getSong.php',{channel: this.channelId})
	  .done(function(ret){
		  _this.song = ret['song'][0]
		  callback()
	  }).fail(function(){
		  console.log('error')
	    })
	},
	
	setMusic: function(){
	  this.audio.src = this.song.url
	  $('.img').css('background-image', 'url(' + this.song.picture + ')')
	  $('.player h3').text(this.song.title)
	  $('.player .singer').text(this.song.artist)
	  $('.player .tag').text(this.channelName)
	},
}


Footer.init()
Fm.init()


