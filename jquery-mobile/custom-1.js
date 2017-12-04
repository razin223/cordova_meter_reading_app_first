// JavaScript Document
$(document).ready(function () {
    
    $(document).on('scroll','#page2',function (el) { $('input').blur(); } ,true); 

    if (window.localStorage.getItem("login") === undefined || window.localStorage.getItem("login") === null) {
        Logout();
    }
    $("#user_name").html("Welcome " + window.localStorage.getItem("name"));

    $(".logout").click(function () {
        window.localStorage.removeItem("login");
        window.localStorage.removeItem("name");
        window.localStorage.removeItem("user_id");
        window.localStorage.clear();
        window.location = "index.html";
    });

    $("#search_customer").click(function () {
        var CustomerCode = $("#customer_code_search").val();
        if (CustomerCode !== "") {
            Reset_Meter_Reading_Field();
            $("#search_customer").attr("disabled", true).html("Loading...");
            $.ajax({
                url: "http://arsolutionbd.com/meter_reading/api/customer_details.php",
                crossDomain: true,
                type: "POST",
                async: true,
                data: {customer_code: CustomerCode},
                success: function (data) {
                    $("#search_customer").attr("disabled", false).html("Search");
                    data = JSON.parse(data);
                    if (data.status) {
                        $("#customer_id").val(data.customer_id);
                        $("#customer_code").val(data.customer_code);
                        $("#name").val(data.name);
                        $("#mobile").val(data.mobile);
                        $("#address").val(data.address);
                        $("#meter_no").val(data.meter_no);
                    } else {
                        alert("Error:Invalid customer code given.");
                        $("#search_customer").attr("disabled", false).html("Search");
                    }
                },
                error: function (error) {
                    var ErrorMsg = "";
                    for (var i in error) {
                        ErrorMsg += i + ":" + error[i] + "\n";
                    }
                    alert("Error:" + ErrorMsg);
                    $("#search_customer").attr("disabled", false).html("Search");
                }

            });
        } else {
            alert("Error:Empty Customer Code");
        }
    });

    $("#capture_image").click(function () {
        navigator.camera.getPicture(onSuccess, onFail,
                {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    targetWidth: 200,
                    targetHeight: 200
                }
        );
    });

    function onSuccess(imageData) {
        var image = document.getElementById('image_preview');
        image.src = "data:image/jpeg;base64," + imageData;
        document.getElementById("image_data").innerHTML = imageData;
    }
    function onFail(message) {
        alert('Error:Failed because: ' + message);
    }

    $("#submit_meter_reading").click(function () {
        var CustomerId = $("#customer_id").val();
        var Unit = $("#unit").val();
        var ImageData = $("#image_data").html();
        var MeterReaderId = window.localStorage.getItem("user_id");
        var Pin = $("#pin").val();
        if (MeterReaderId !== undefined && MeterReaderId !== null && MeterReaderId !== "") {

            if (CustomerId !== "" && Unit !== "" && Pin !== "") {
                if (ImageData !== "") {
                    $("#submit_meter_reading").attr("disabled", true).html("Saving...");
                    $.ajax({
                        url: "http://arsolutionbd.com/meter_reading/api/submit_meter_reading.php",
                        crossDomain: true,
                        async: true,
                        type: "POST",
                        data: {
                            customer_id: CustomerId,
                            unit: Unit,
                            image: ImageData,
                            meter_reader_id: MeterReaderId,
                            pin: Pin
                        },
                        success: function (data) {
                            $("#submit_meter_reading").attr("disabled", false).html("Submit Meter Reading");
                            data = JSON.parse(data);
                            if (data.status) {
                                alert("Success:Meter reading submitted successfully.");
                                Reset_Meter_Reading_Field();
                            } else {
                                alert("Error:Cannot update reading." + data.msg);
                            }
                        },
                        error: function (error) {
                            var ErrorMsg = "";
                            for (var i in error) {
                                ErrorMsg += i + ":" + error[i] + "\n";
                            }
                            alert("Error:" + ErrorMsg);
                            $("#submit_meter_reading").attr("disabled", false).html("Submit Meter Reading");
                        }
                    });
                } else {
                    alert("Error:Image not captured.");
                }
            } else {
                alert("Error:Empty Customer Code/Meter Reading");
            }
        } else {
            Logout();
        }
    });

    $("#update_password").click(function () {
        var Password = $("#password").val();
        var NewPassword = $("#new_password").val();
        var ReNewPassword = $("#re_new_password").val();
        var MeterReaderId = window.localStorage.getItem("user_id");
        if (MeterReaderId !== undefined && MeterReaderId !== null && MeterReaderId !== "") {
            if (Password !== "" && NewPassword !== "" && ReNewPassword !== "") {
                if (NewPassword === ReNewPassword) {
                    $("#update_password").attr("disabled", true).html("Saving...");
                    $.ajax({
                        url: "http://arsolutionbd.com/meter_reading/api/change_password.php",
                        crossDomain: true,
                        async: true,
                        type: "POST",
                        data: {
                            password: Password,
                            new_password: NewPassword,
                            re_new_password: ReNewPassword,
                            user_id: MeterReaderId
                        },
                        success: function (data) {
                            $("#update_password").attr("disabled", false).html("Change Password");
                            data = JSON.parse(data);
                            if (data.status) {
                                alert("Password change successful.");
                                $(".password").val("");
                            } else {
                                alert("Error:" + data.msg);
                            }
                        },
                        error: function (error) {
                            var ErrorMsg = "";
                            for (var i in error) {
                                ErrorMsg += i + ":" + error[i] + "\n";
                            }
                            alert("Error:" + ErrorMsg);
                            $("#update_password").attr("disabled", false).html("Change Password");
                        }
                    });
                } else {
                    alert("New Password & Retyped New Password doesn't match.");
                }
            } else {
                alert("Error:Empty field(s)");
            }
        } else {
            alert("Error:You've been logged out.Please login again.");
            Logout();
        }
    });

});

function Logout() {
    alert("Error:You are not logged in.");
    window.location = "index.html";
}

function Reset_Meter_Reading_Field() {
    $(".customer-reset").val("");
    $("#image_data").html("");
    $("#image_preview").attr("src", "");
}