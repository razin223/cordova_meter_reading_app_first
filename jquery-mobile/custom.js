// JavaScript Document
$(document).ready(function (e) {
    $("#login").click(function () {
        var Username = $("#username").val();
        var Password = $("#password").val();
        if (Username !== "" && Password !== "") {
            $("#login").attr("disabled", true).html("Loading...");
            $.ajax({
                url: "http://arsolutionbd.com/meter_reading/api/login.php",
                crossDomain: true,
                async: true,
                type: "POST",
                data: {username: Username, password: Password},
                success: function (data) {
                    data = JSON.parse(data);
                    if (data.status) {
                        window.localStorage.setItem("login", "1");
                        window.localStorage.setItem("name", data.name);
                        window.localStorage.setItem("user_id", data.id);
                        window.location = "dashboard.html";
                    } else {
                        alert("Error:Cannot login.".data.msg);
                    }
                },
                error: function (error) {
                    var Data = "";
                    for (var i in error) {
                        Data += i + ":" + error[i];
                    }
                    alert("Error:" + Data);
                    $("#login").attr("disabled", false).html("Login");
                }
            });
        } else {
            alert("Error:Empty username/password");
        }
    });

});