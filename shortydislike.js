var shorty_dislike = {
    
    dislike_image: (proboards.plugin.get('dislike_plugin').settings.dislike_image == '')? proboards.plugin.get('dislike_plugin').images.iconlikebutton1:proboards.plugin.get('dislike_plugin').settings.dislike_image,
    
    dislike_key: pb.plugin.key('shorty_dislike_key'),
    
    init: function() {
        this.dislike_setup();
        this.dislike_post();
    },
    
    dislikekey_setup: function(postid) {
        if(this.dislike_key.get(postid) == undefined) {
            var dislike_key = {
                "n": 0,
                "d2": [],
                "di":[]
            };
        }
        else {
            var dislike_key = JSON.parse(this.dislike_key.get(postid));
        }
        return dislike_key;
    },
    
    dislike_words: function(post_id,key) {
        if(key.d2.length == 1 && key.n == 1) {
            $('span.dislikes-'+post_id+'').show();
            $('span.dislikes-'+post_id+' > .dislike-users').html('<a href="/user/'+key.d2[0].id+'" class="user-link user-'+key.d2[0].id+'" title="@'+key.d2[0].un+'"><span itemprop="name">'+key.d2[0].dn+'</span></a>');
            $('span.dislikes-'+post_id+' > .dislike-s').html('s');
        }
        else if(key.d2.length == 1 && key.n > 1) {
            $('span.dislikes-'+post_id+'').show();
            $('span.dislikes-'+post_id+' > .dislike-users').html('<a href="/user/'+key.d2[0].id+'" class="user-link user-'+key.d2[0].id+'" title="@'+key.d2[0].un+'"><span itemprop="name">'+key.d2[0].dn+'</span></a> and '+(parseInt(key.n-1))+' other'+( (parseInt(key.n-1) == 1)? '':'s')+'');
            $('span.dislikes-'+post_id+' > .dislike-s').html('');
        }
        else if(key.d2.length == 2 && key.n == 2) {
            $('span.dislikes-'+post_id+'').show();
            $('span.dislikes-'+post_id+' > .dislike-users').html('<a href="/user/'+key.d2[1].id+'" class="user-link user-'+key.d2[1].id+'" title="@'+key.d2[1].un+'"><span itemprop="name">'+key.d2[1].dn+'</span></a> and <a href="/user/'+key.d2[0].id+'" class="user-link user-'+key.d2[0].id+'"title="@'+key.d2[0].un+'"><span itemprop="name">'+key.d2[0].dn+'</span></a>');
            $('span.dislikes-'+post_id+' > .dislike-s').html('');
        }
        else if(key.d2.length == 2 && key.n > 2) {
            $('span.dislikes-'+post_id+'').show();
            $('span.dislikes-'+post_id+' > .dislike-users').html('<a href="/user/'+key.d2[1].id+'" class="user-link user-'+key.d2[1].id+'" title="@'+key.d2[1].un+'"><span itemprop="name">'+key.d2[1].dn+'</span></a>, <a href="/user/'+key.d2[0].id+'" class="user-link user-'+key.d2[0].id+'"title="@'+key.d2[0].un+'"><span itemprop="name">'+key.d2[0].dn+'</span></a>, and '+(parseInt(key.n-2))+' other'+( (parseInt(key.n-2) == 1)? '':'s')+'');
            $('span.dislikes-'+post_id+' > .dislike-s').html('');
        }
        else if(key.d2.length == 0 && key.n > 0) {
            $('span.dislikes-'+post_id+'').show();
            $('span.dislikes-'+post_id+' > .dislike-users').html(key.n+' people');
        }
        else if(key.d2.length == 0 && key.n == 0) {
            $('span.dislikes-'+post_id+'').hide();
        }
    },
    
    dislike_setup: function() {
        var self = this;
        $('tr[id^="post-"]').each(function() {
            var post_id = $(this).attr('id').split('post-')[1];
            $(this).find('div.content-head div.controls a.button.likes-button').attr('id','like-'+post_id+'').after('<a id="dislike-'+post_id+'" style="padding: '+$('a.button.likes-button').css('padding-top')+' '+$('a.button.likes-button').css('padding-right')+' '+$('a.button.likes-button').css('padding-bottom')+' '+$('a.button.likes-button').css('padding-left')+';" class="button dislikes-button enabled" role="button"><img style="margin-top: 2px;" src="'+self.dislike_image+'" alt="dislike"></a>');
        	$(this).find('span.likes').after(' <span style="display:none;font-size: '+$('span.likes').css('font-size')+';vertical-align:'+$('span.likes').css('vertical-align')+';" class="dislikes-'+post_id+'"><span class="dislike-users"></span> dislike<span class="dislike-s"></span> this.</span>');
            var key = self.dislikekey_setup(post_id);
            if(key.n >= 0) {
                for(i=0;i<key.di.length;i++) {
                    if(key.di[i] == proboards.data('user').id) {
                        $('a.button.dislikes-button#dislike-'+post_id+'').addClass('disliked');
                    }
                }
                self.dislike_words(post_id,key);
            }
        });
    },
    
    dislike_post: function() {
        var self = this;
        $('a.button.dislikes-button.enabled').on('click',function() {
            if($(this).hasClass('enabled')) {
                var rthis = $(this);
                rthis.removeClass('enabled');
                var post_id = $(this).attr('id').split('dislike-')[1];
                var key = self.dislikekey_setup(post_id);
                if($(this).hasClass('disliked')) {
                    $(this).removeClass('disliked');
                    key.n = parseInt(parseInt(key.n)-1);
                    for(i=0;i<key.d2.length;i++) {
                        if(key.d2[i].id == proboards.data('user').id) {
                            key.d2.splice(i,1);
                            break;
                        }
                    }
                    for(i=0;i<key.di.length;i++) {
                        if(key.di[i] == proboards.data('user').id) {
                            key.di.splice(i,1);
                            break;
                        }
                    }
                }
                else if(!$(this).hasClass('disliked')) {
                    $(this).addClass('disliked');
                    key.n = parseInt(parseInt(key.n)+1);
                    if(key.d2[1] == undefined){
                        key.d2.push({
                            'id': proboards.data('user').id,
                            'dn': proboards.data('user').name,
                            'un': proboards.data('user').username
                        });
                    }
                    else if(key.d2[1] != undefined) {
                        key.d2.shift();
                        key.d2.push({
                            'id': proboards.data('user').id,
                            'dn': proboards.data('user').name,
                            'un': proboards.data('user').username
                        });
                    }
                    key.di.push(""+proboards.data('user').id+"");
                }
                self.dislike_key.set({object_id: post_id, value: JSON.stringify(key), success: function() {
                    self.dislike_words(post_id,key);
                    rthis.addClass('enabled');
                }});
            }
        });
    }
};

$(document).ready(function() {
    shorty_dislike.init();
    proboards.on('afterSearch',function() {
     	shorty_dislike.init()
	});
});