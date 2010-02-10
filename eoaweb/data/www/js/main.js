/*=============================================================================

  On DOMReady Events

=============================================================================*/
window.addEvent('domready', function(){
    /*Attach events to elements*/
   
    /* Get the logged in user's character position*/
    var char_req = new Request({
        url: '/eoa/get_character_info/',
        onSuccess: function(res){
            var character_color = ''; //Will be overwritten
           
            var character_element = new Element('div', {'id':'character'}); 
            $('camera_container').adopt(character_element);
            
            //Create variables from response
            eval(res);

            $('character').setStyle('background', character_color);
            $('character').setStyle('left', character_pos_x);
            $('character').setStyle('top', character_pos_y);
            $('character').setStyle('position', 'absolute');
        }
    }).send();

    /*Game elements*/
    //Space reserved for buttons to control character, etc
    
    /*================================
     * Heartbeat requests
     * ===============================*/
    var heart_beat = new Request({
        url: '/eoa/heartbeat/',
        initialDelay: 1000,
        delay:200,
        limit:400,
        onSuccess: function(res){
            //Evaluate the response to generate JS objects
            eval(res);

            //We expect back an array of character objects, so let's update them
            for(var i = 0; i < char_array.length; i++){
                if($(char_array[i][0])){
                    $(char_array[i][0]).setStyle('left', char_array[i][1]);
                    $(char_array[i][0]).setStyle('top', char_array[i][2]);
                }
                else{
                    var char_el = new Element('div', {'id':char_array[i][0]});
                    $('camera_container').adopt(char_el);
                    $(char_array[i][0]).setStyle('background', '#' + char_array[i][3]);
                    $(char_array[i][0]).setStyle('position', 'relative');
                    $(char_array[i][0]).setStyle('border', '1px solid #efefef');
                    $(char_array[i][0]).setStyle('width', '20px');
                    $(char_array[i][0]).setStyle('height', '20px');
                }
            }
        }
    }).startTimer();

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

    //For now set amount moved to 5
    amount = 5
    
    /*Set up direction information based on what is passed in*/
    if(dir == 'up'){
        css_direction = 'top'
        amount = amount * -1
    }
    else if(dir == 'right'){
        css_direction = 'left'
    }
    else if(dir == 'down'){
        css_direction = 'top'
    }
    else if(dir == 'left'){
        css_direction = 'left'
        amount = amount * -1
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
