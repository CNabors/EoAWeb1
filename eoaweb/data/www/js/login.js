/*=============================================================================

  On DOMReady Events

=============================================================================*/
    /* ===================================
     * Login elements
     * ===================================*/
window.addEvent('domready', function(){

    //Login Submit Button
    if($('login_submit')){
        $('login_submit').addEvent('click', function(){
            /*Make a request to the login page*/
            var req = new Request({
                url: '/eoa/account_login/',
                data: 'username=' + $('login_username').value + 
                        '&password=' + $('login_password').value,
                method: 'post',

                //Correct username / pw
                onSuccess: function(res){
                    window.location = '/eoa/index/';
                },
                
                //Wrong username / pw
                onFailure: function(res){
                    $('login_error_message').innerHTML = "<br />" + 
                                                    "Invalid username or password"
                    $('login_wrapper').highlight('#aa2222');
                }
            }).send();
        })
    }

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
                                "<br />" + "Log in above"
                    $('register_wrapper').highlight('#22aa22');
                    
                    //Send a request to log the user in
                    //This should probably be handled better ><
                    var login_register_req = new Request({
                        url:'/eoa/account_login/',
                        data: 'username=' + $('register_username').value + 
                        '&password=' + $('register_password').value,
                        method:'post',
                        onSuccess: function(res){window.location='/eoa/index/';}
                    }).send();
                },
                
                //Wrong username / pw
                onFailure: function(res){
                    $('register_error_message').innerHTML = "<br />" + 
                                                    "Username already exists"
                    $('register_wrapper').highlight('#aa2222');
                }
            }).send();
        })
    }
});
