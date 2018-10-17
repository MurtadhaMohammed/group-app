
$(document).ready(function () {
    if (location.hash) {
        link = parseLink(location.hash);
    } else {
        link = "people"
    }
    $.ajax({
        url: './src/pages/' + link + '.html',
        dataType: 'html',
        success: function (data) {
            $('#app').html(data);
            //$('[route=' + link + ']').find('button').addClass('active').parent().siblings().children().removeClass('active');
        }
    });
});
$(document).on('click', '[route]', function () {

    var link = $(this).attr('route');
    location.hash = link
    $.ajax({
        url: './src/pages/' + parseLink(location.hash) + '.html',
        dataType: 'html',
        success: function (data) {
            $('#app').html(data);
            //$('[route=' + link + ']').find('button').addClass('active').parent().siblings().children().removeClass('active');
        }
    });
});

$(window).on('hashchange',function(){
    $.ajax({
        url: './src/pages/' + parseLink(location.hash) + '.html',
        dataType: 'html',
        success: function (data) {
            $('#app').html(data);
            //$('[route=' + link + ']').find('button').addClass('active').parent().siblings().children().removeClass('active');
        }
    });
})

function parseLink(link) {
    var link = link.substr(1);
    var link = link.split('?')[0];
    return link;
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(location.hash.split('?')[1]),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};