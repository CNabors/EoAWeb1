/*=============================================================================

  On DOMReady Events

=============================================================================*/
    /* ===================================
     * Login elements
     * ===================================*/

    //Login Submit Button
    if($('login_submit')){
        //If a login_submit element exists on the page (it may not if the user
        //  is already logged in
        
        $('login_submit').addEvent('click', function(){
            /*Make a request to the login page*/
            var req = new Request({
                url: '/eoa/account_login/',
                data: 'username=' + $('login_username').value + 
                        '&password=' + $('login_password').value,
                method: 'post',

                //Correct username / pw
                onSuccess: function(res){
                    //Update the login wrapper to let them know they've logged in
                    //  this should just call a function to load a new page here
                    $('login_wrapper').innerHTML = "Logged in as " + res +
                                "<br />" +
                                "<a href='/eoa/logout/' title='logout'>Logout</a>"
                    $('login_wrapper').highlight('#22aa22');
                    
                    //Hide and destroy the register wrapper
                    $('register_wrapper').fade(0)
                    $('register_wrapper').destroy()

                    //Create the character from the DB
                    var character_element = new Element('div', {'id': 'character' });
                    $('camera_container').adopt(character_element);
                    eval(res);
                },
                
                //Wrong username / pw
                onFailure: function(res){
                    $('login_error_message').innerHTML = "<br />" + 
                                                    "Invalid username or password"
                    $('login_wrapper').highlight('#aa2222');
                }
            }).send();
        })
    };

    //Register Submit Button
    if($('register_submit')){
        $('register_submit').addEvent('click', function(){
            /*Make a request to the login page*/
            var req = new Request({
                url: '/eoa/account_register/',
                data: 'username=' + $('register_username').value + 
                        '&email=' + $('register_email').value + 
                        '&color=' + $('register_color').value + 
                        '&password=' + $('register_password').value,
                method: 'post',

                //Correct username / pw
                onSuccess: function(res){
                    //Update the login wrapper to let them know they've logged in
                    //  this should just call a function to load a new page here
                    $('register_wrapper').innerHTML = "Account created! " + res +
                                "<br />" +
                                "<a href='/eoa/logout/' title='logout'>Logout</a>"
                    $('register_wrapper').highlight('#22aa22');
                },
                
                //Wrong username / pw
                onFailure: function(res){
                    $('register_error_message').innerHTML = "<br />" + 
                                                    "Username already exists"
                    $('register_wrapper').highlight('#aa2222');
                }
            }).send();
        })
    };
   
})
