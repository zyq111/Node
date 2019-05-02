function regiset () {
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: 'doregister',
        data: $('#form').serialize(),
        success: function (result) {
            console.log(result)
            if (result.result === 'SUCCESS') {
                window.location.href = '/'
            } else {
                alert('服务器响应失败!')
            }
        }
    })
}
function login() {
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: 'dologin',
        data: $('#form').serialize(),
        success: function (result) {
            console.log(result)
            if (result.result === 'SUCCESS') {
                window.location.href = 'mybbs'
            } else {
                alert('服务器响应失败!')
            }
        }
    })
}
function publish() {
    fetch('dopublish', {
        method: 'post',
        body: $('#form').serialize(),
        credentials: 'include' 
    }).then((Response) => {
        if (Response.status === 200) {
            $('#form').find('textarea').val('')
            alert('留言成功')
        } else {
            alert('留言失败')
        }
    })
}
$(function() {
    $('.header-menu').click(function() {
        $(this).find('.header-menu-list').slideToggle()
    })
    $('.comment-bbs').click(function() {
        const id = $(this).attr('data-id')
        const fragment = document.createDocumentFragment()
        console.log(fragment)
        const div = document.createElement('div')
        div.setAttribute('id', 'comment')
        div.innerHTML = '<div class="comment">'+
            '<div class="comment-box">'+
                '<form id="form" method="post" onsubmit="return false">'+
                    '<div class="publish-texarea">'+
                        '<textarea name="comment" id="" cols="30" rows="10"></textarea>'+
                        '<input name="id" value="'+id+'" readonly="true" type="hidden" />'+
                    '</div>'+
                    '<div class="publist-submit">'+
                        '<input type="submit" value="评论" id="submit-comment">'+
                    '</div>'+
                '</form>'+
            '</div>'+
        '</div>';
        fragment.appendChild(div)
        $('body').append(fragment)
        $('#submit-comment').click(function() {
            fetch('docomment', {
                method: 'post',
                body: $('#form').serialize(),
                credentials: 'include'
            }).then((data) => {
                if (data.status === 200) {
                    console.log(data)
                    $('#comment').remove()
                }
            })
        })
    })
})