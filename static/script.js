function getBathValue() {
    var uiBath = document.getElementsByName("uiBath");
    for (var radio of uiBath) {
        if (radio.checked) {
            return parseInt(radio.value);
        }
    }
    return -1;
}

function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (var radio of uiBHK) {
        if (radio.checked) {
            return parseInt(radio.value);
        }
    }
    return -1;
}

function formatPrice(price) {
    if (price >= 100) {
        return (price / 100).toFixed(2) + " Crore";
    }
    return price.toFixed(2) + " Lakh";
}

function onClickedEstimatedPrice() {
    console.log("Estimated price button clicked");

    var sqft = document.getElementById("uiSqft");
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations");
    var estPrice = document.getElementById("uiEstimatedPrice");
    var btn = document.querySelector(".btn-estimate");

    if (!sqft.value || isNaN(parseFloat(sqft.value)) || parseFloat(sqft.value) <= 0) {
        estPrice.innerHTML = "<h2 style='color: #dc2626;'>Please enter a valid area</h2>";
        sqft.focus();
        return;
    }

    if (bhk === -1) {
        estPrice.innerHTML = "<h2 style='color: #dc2626;'>Please select BHK</h2>";
        return;
    }

    if (bathrooms === -1) {
        estPrice.innerHTML = "<h2 style='color: #dc2626;'>Please select bathrooms</h2>";
        return;
    }

    if (!location.value) {
        estPrice.innerHTML = "<h2 style='color: #dc2626;'>Please select a location</h2>";
        return;
    }

    var requestData = {
        total_sqft: parseFloat(sqft.value),
        bhk: bhk,
        bath: bathrooms,
        location: location.value
    };

    console.log("Request Payload:", requestData);

    btn.disabled = true;
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spinner"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg> Estimating...';

    $.ajax({
        type: "POST",
        url: "/predict_home_price",
        contentType: "application/json",
        data: JSON.stringify(requestData),
        success: function(data, status, xhr) {
            if (xhr.status === 200) {
                if ("estimated_price" in data) {
                    console.log(data.estimated_price);
                    var price = data.estimated_price;
                    estPrice.innerHTML = "<h2>" + formatPrice(price) + "</h2>";
                } else {
                    estPrice.innerHTML = "<h2 style='color: #dc2626;'>Invalid response</h2>";
                }
            } else {
                estPrice.innerHTML = "<h2 style='color: #dc2626;'>Error: " + xhr.status + "</h2>";
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            console.error("Error in the AJAX request:", textStatus, errorThrown);
            estPrice.innerHTML = "<h2 style='color: #dc2626;'>Something went wrong. Try again.</h2>";
        },
        complete: function() {
            btn.disabled = false;
            btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> Estimate Price';
        }
    });
}

function onPageLoad() {
    console.log("document loaded");
    $.get("/get_location_names", function(data, status) {
        console.log("got response for get_location_names request:", data, status);
        if (data && data.locations) {
            var locations = data.locations;
            var uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty();
            var defaultOption = new Option("Choose a Location", "", true, true);
            defaultOption.disabled = true;
            $('#uiLocations').append(defaultOption);
            for (var i in locations) {
                var opt = new Option(locations[i]);
                $('#uiLocations').append(opt);
            }
        } else {
            console.error("Invalid response format or missing locations field.");
        }
    })
    .fail(function(xhr, textStatus, errorThrown) {
        console.error("Error in the AJAX request:", textStatus, errorThrown);
    });
}

$(document).ready(onPageLoad);
