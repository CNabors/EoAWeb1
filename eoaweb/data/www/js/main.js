/*=============================================================================

  On DOMReady Events

=============================================================================*/
window.addEvent('domready', function(){
    /*Attach events to elements*/
    
    /*Game elements*/
    //Space reserved for buttons to control character, etc
});


/*=============================================================================
Handle Input
=============================================================================*/
window.addEvent('keydown', function(event){  
    /*Define our entity*/
    var element = $('character')

    /*Handle movement keys*/
    if(event.key == 'up'){
        //move_pc('up');
        move_entity(element, 'up', -10)
    }
    if(event.key == 'right'){
        //move_pc('right');
        move_entity(element, 'right', -10)
    }
    if(event.key == 'down'){
        //move_pc('down');
        move_entity(element, 'down', -10)
    }
    if(event.key == 'left'){
        //move_pc('left');
        move_entity(element, 'left', -10)
    }
    
    /*Handle command keys*/
    if(event.key == "i"){
        //sample command key event
        //alert("Inventory");
    }        
});

/*=============================================================================

  Function calls

=============================================================================*/
function move_pc(dir, amount){
    /*Moves an entity based on the direction passed in
    
    element is the HTML element of the entity
    dir is the direction
    amount is the amount to the move the character
    */
    
    //css_direction is the CSS property; either top or left
    var css_direction = ''
    
    //amount is the amount to move the character
    if (amount == undefined || amount == null){
        var amount = 10
    }
    else {
        var amounnt = amount
    }
    
    /*Set up direction information based on what is passed in*/
    if(dir == 'up'){
        css_direction = 'top'
    }
    else if(dir == 'right'){
        css_direction = 'left'
        amount = amount * -1
    }
    else if(dir == 'down'){
        css_direction = 'top'
        amount = amount * -1
    }
    else if(dir == 'left'){
        css_direction = 'left'
    }
    
    /*set the variable zone as the zone_container div element*/
    var zone = $('zone_container')
    
    /*Make the request to the server*/
    var req = new Request({
        url: 'test.txt',
        onSuccess: function(res){
            var movement_bound = false
            
            //Check up bounds
            if(dir == 'up' && parseInt($(zone).getStyle('top')) >= 0){
                movement_bound = true
            }
            if(dir == 'right' && (-1 * (parseInt($(zone).getStyle('left'))) >= ( parseInt($(zone).getStyle('width')) - parseInt($('camera_container').getStyle('width')))) ){
                movement_bound = true
            }
            if(dir == 'down' && (-1 * (parseInt($(zone).getStyle('top'))) >= (parseInt($(zone).getStyle('height')) - parseInt($('camera_container').getStyle('height')))) ){
                movement_bound = true
            }
            if(dir == 'left' && parseInt($(zone).getStyle('left')) >= 0){
                movement_bound = true
            }
            
            //We can freely move both the zone_container and the PC
            if(!movement_bound){
                var zone_position = parseInt($(zone).getStyle(css_direction))
                $(zone).setStyle(css_direction, zone_position + amount + 'px')
            }
            /*See if character is centered on the camera*/
            if( parseInt($('character').getStyle('left')) <= parseInt($('camera_container').getStyle('width')) / 2 && 
                parseInt($('character').getStyle('top')) <= parseInt($('camera_container').getStyle('height')) / 2){
                amount = amount * -1
                var pc_position = parseInt($('character').getStyle(css_direction))
                $('character').setStyle(css_direction, pc_position + amount + 'px')
            }
            
            
        }
    }).send();
}

/*move_entity - moves an arbitrary entity*/
function move_entity(element, dir, amount){
    /*Moves an entity based on the direction passed in
    
    element is the HTML element of the entity
    dir is the direction
    amount is the amount to the move the character
    */
    
    //css_direction is the CSS property; either top or left
    var css_direction = ''
    
    //amount is the amount to move the character
    if (amount == undefined || amount == null){
        var amount = 1
    }
    else {
        var amount = amount
    }
    amount = 5 * -1
    
    /*Set up direction information based on what is passed in*/
    if(dir == 'up'){
        css_direction = 'top'
    }
    else if(dir == 'right'){
        css_direction = 'left'
        amount = amount * -1
    }
    else if(dir == 'down'){
        css_direction = 'top'
        amount = amount * -1
    }
    else if(dir == 'left'){
        css_direction = 'left'
    }
    
    /*Make the request to the server*/
    var req = new Request({
        url: '/eoa/move/',
        data: 'dir=' + dir,
        method: 'post',
        onSuccess: function(res){
            if (res != 'error'){
                var entity_position = parseInt($(element).getStyle(css_direction))
                $(element).setStyle(css_direction, entity_position + amount + 'px')
            }
            
        }
    }).send();
}

function create_char(){
    //$('map_container')

}
