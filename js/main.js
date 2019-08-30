window.onload = function() {
    // TODO:: Do your initialization job

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });

    // Sample code
    var mainPage = document.querySelector('#main');
    mainPage.addEventListener("click", function() {
        // main page click event
    });
};

function writeItemData(itemData) {
	var $area = $("#list_area");
	var $box = $("<li class='ccal_item'/>");
	var $def = $("<div class='def'/>");
	var $def_ul = $("<ul/>");
	var $stat = $("<div class='stat'/>");

	// add datetime
	$stat.text("Created at " + itemData.datetime);

	// add title and description
	$def_ul.append("<li class='title'>" + itemData.identifier + "<li>");
	$def_ul.append("<li class='desc'>" + itemData.description + "</li>");

	// add hidden details
	for(var key in itemData) {
		$def_ul.append("<li class='desc hidden'><strong>" + key + "</strong> " + itemData[key] + "</li>");
	}

	// make def
	$def.append($def_ul);

	// make box contents
	$box.append($def);
	$box.append($stat);

	// add box event
	$box.click(function() {
		$(this).find(".def ul li").toggleClass("hidden");
	});
	
	// add to area
	$area.append($box);
}

function writeNoData() {
	var itemData = {
		"identifier": "NODATA",
		"description": "No data found.",
		"datetime": moment().format("YYYY-MM-DD HH:mm:ss")
	};
	writeItemData(itemData);
}

function queryData() {
	$.ajax({
		type: "GET",
		url: "https://catswords.re.kr/ep/",
		data:{
			"route": "extlist.index",
			"format": "xml",
			"q": $("#txt_keyword").val()
		},
		dataType: "text",
		success: function(req) {
			$("#list_area").empty();

			var xmlDoc = $.parseXML(req);
			var $xml = $(xmlDoc);
			var $claw = $xml.find("claw");
			var $list = $claw.find("list");
			var $items = $list.find("item");
			if($items.length > 0) {
				console.log("No error. found data.")
				$.each($items, function(index, item) {
					var $item = $(item);
					var itemData = {
						"id": $item.find("id").text(),
						"prefix": $item.find("prefix").text(),
						"identifier": $item.find("identifier").text(),
						"content": $item.find("content").text(),
						"flag": $item.find("flag").text(),
						"description": $item.find("description").text(),
						"execution": $item.find("execution").text(),
						"mime": $item.find("mime").text(),
						"signature": $item.find("signature").text(),
						"programid": $item.find("programid").text(),
						"openwith": $item.find("openwith").text(),
						"link1": $item.find("link1").text(),
						"link2": $item.find("link2").text(),
						"datetime": $item.find("datetime").text(),
						"last": $item.find("last").text()
					};
					writeItemData(itemData);
				});
			} else {
				console.log("No error. but no data.");
				writeNoData();
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log("Failed to initalize. status is " + textStatus + ", thrown is " + errorThrown);
			writeNoData();
		}
	});
}

$(document).ready(function() {
	$("#btn_submit").click(function() {
		queryData();
	});
	$("#btn_submit").trigger("click");
});
