/// <reference path="../../@types/jquery/index.d.ts" />
/// <reference path="../../@types/onsenui.d.ts" />

ons.getScriptPage().onInit = function() {

    $('ons-card').on('click' , function(){
        router.pushPage($(this).data('to') , {animation: 'slide'})
    })
    
};