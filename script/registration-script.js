/**
 * Created by Karina on 19.04.2018.
 */
"use strict";
$(document).ready(() => {
    $("#form_post").submit( e => {
        e.preventDefault();
        let name = $("input#username").val();
        let secondname = $("input#usersecondname").val();
        let email = $("input#email").val();
        let gender = $("select#sex").val();
        let pass = $("input#password").val();
        let data = {
            name: name,
            secondname: secondname,
            email: email,
            gender: gender,
            pass: pass
        };

        $.ajax({
            type: "Post",
            url: "http://codeit.pro/codeitCandidates/serverFrontendTest/user/registration",
            data: data,
            success: res => {
                console.log(res);
                if (res.status === 'OK') window.location.href = 'company-page.html';
                else{
                    switch (res.message){
                        case 'Creating user error. Email already exists.':alert('Email already exists!'); break ;
                        case 'Wrong route':alert('Wrong route');break
                    }
                    }
                }
        });
        return false;

    });
});
