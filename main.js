window.addEvent('keydown', function(event){
    if(event.key == "right"){
        move_char();
    }
});

function move_char(){
    var req = new Request({
        url: 'test.txt',
        onSuccess: function(res){
            var char_left = parseInt($('character').getStyle("left"))
            $('character').setStyle('left', char_left + 1 + "px")
        }
    }).send();
}

function create_char(){
    //$('map_container')

}