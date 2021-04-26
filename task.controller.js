var otaskController;
sap.ui.controller("EVALUATION.Controller.task", 
{
	onInit : function ()  {               
		otaskController=this;
		
		
	},
	onAfterRendering: function(){

		otaskController.GraphColumn();;
		otaskController.GraphLine();
		otaskController.setProductDetail();
		otaskController.AutoRefresh();

		//date and time
			var today = new Date();
			var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
			var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
			var dateTime = date+' '+time;
     		       	otaskController.getView().byId("date").setText(dateTime);
		//time and date

		//login user
			var firstName = document.getElementById("hidden_firstname").value;
			var lastName = document.getElementById("hidden_lastname").value;
			if (firstName.includes("firstname")) 
				firstName = "";
			 else 
				firstName;
			firstName = "Hello," + firstName + "     " + lastName+" ";
			otaskController.getView().byId("userName").setText(firstName);
		//login user
		

	}, 
onPressRefresh: function(){
            location.reload();
        },

              
        logout: function () {
            var _URL = window.location.href;
            var urlArray = _URL.split("/");
             var newURL = "http://" + urlArray[2].concat("/manufacturing/index.jsp");
            localStorage.setItem("LastLoggedInPage", _URL);
            sap.m.URLHelper.redirect("/XMII/Illuminator?service=logout&target=" + _URL, false);
        },
		

AutoRefresh :  function(){
        var duration=120;
         var timer = duration, minutes, seconds,auto;
        setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);
        if(minutes < 10){
		minutes= "0" + minutes ; 
        }
        else{
	    minutes=minutes;
          }        
        if(seconds < 10){
		seconds= "0" + seconds ; 
        }
        else{
	    seconds=seconds;
          }  
         auto="Page Refreshed After "+minutes + ":" + seconds;
			otaskController.getView().byId("autorefresh").setText(auto);
        if (--timer < 0) {
            timer = duration;
            location.reload();
        }
    }, 1000);
},



SearchRecord: function(){
	//START
var city;
	 city = otaskController.getView().byId("productInput").getValue();
	
	var productDetail;
		var url = "/XMII/Illuminator?QueryTemplate=SMT_TRAINING/Vignesh/TASKS/EVALUATION/SQL_EV_FIND&Content-Type=text/json&Param.1="+city

		$.ajax({
			url: url,
			type: "POST",
			success: function (data, txt, jqXHR) {
				if(data.Rowsets.Rowset != undefined){					
					productDetail = data.Rowsets.Rowset[0].Row
					var oModel = new sap.ui.model.json.JSONModel(productDetail);
					otaskController.getView().setModel(oModel);
					//start tempvalue
						TEMP = data.Rowsets.Rowset[0].Row[0].TEMP;	
           						otaskController.getView().byId("TEMP").setText(TEMP);
					//end temptvalue
					
					//start HUMI
						HUMIDITY = data.Rowsets.Rowset[0].Row[0].HUMIDITY;	
						
						otaskController.getView().byId("microchart").setPercentage(HUMIDITY);
					//end HUMI
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
			}
		});
	//END
},
	setProductDetail : function(){
		var productDetail;
		var url = "/XMII/Illuminator?QueryTemplate=SMT_TRAINING/Vignesh/TASKS/EVALUATION/SQL_EV_FIND&Content-Type=text/json&Param.1="+"Pune"

		$.ajax({
			url: url,
			type: "POST",
			success: function (data, txt, jqXHR) {
				if(data.Rowsets.Rowset != undefined){
					productDetail = data.Rowsets.Rowset[0].Row
					var oModel = new sap.ui.model.json.JSONModel(productDetail);
					otaskController.getView().setModel(oModel);
					//start currentvalue
						TEMP = data.Rowsets.Rowset[0].Row[0].TEMP;	
           						otaskController.getView().byId("TEMP").setText(TEMP);
					//end currentvalue
					//start HUMI
						HUMIDITY = data.Rowsets.Rowset[0].Row[0].HUMIDITY;	
						otaskController.getView().byId("microchart").setPercentage(HUMIDITY);
					//end HUMI
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
			}
		});
	},




     
	GraphLine : function() {	

		var productDetail;
		var url = "/XMII/Illuminator?QueryTemplate=SMT_TRAINING/Vignesh/TASKS/EVALUATION/SQL_EV_FIND&Content-Type=text/json&Param.1="+"Pune"

		$.ajax({
			url: url,
			type: "POST",
			async : true,
			success: function (data, txt, jqXHR) {
				if(data.Rowsets.Rowset != undefined){
					productDetail = data.Rowsets.Rowset[0].Row
					var oModel = new sap.ui.model.json.JSONModel(productDetail);
					otaskController.getView().setModel(oModel);
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
			}
		});
		var oVizFrame = otaskController.getView().byId("VizframelinenId");
		oVizFrame.setVizType("line");
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions: [{
				name: "DATE",
				value: "{DATE}"
			}],
			measures: [{
				name: 'Humidity',
				value: "{HUMIDITY}"
			}],
			data: {
				path: "/"
			}
		});
		oVizFrame.setDataset(oDataset);

		 feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
			"uid": "valueAxis",
			"type": "Measure",
			"values": ["Humidity"]
		}),
		  feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
			"uid": "categoryAxis",
			"type": "Dimension",
			"values": ["DATE"]
		});
		oVizFrame.addFeed(feedValueAxis);
		oVizFrame.addFeed(feedCategoryAxis);
		oVizFrame.setVizProperties({
			plotArea: {
					colorPalette: ['#eb3434','#6ffc03'],
					dataLabel: {showTotal: true,visible:true,hideWhenOverlap:true},
					//dataShape: {primaryAxis: ["bar", "bar"]}
				   },
				   legend: {visible: true},
				   legendGroup: {
					   layout: { position: "bottom"}
				   },
			valueAxis: {label: { },title: {visible: false}},
			categoryAxis: {title: {visible: false}},
			tooltip: {visible: true},
			title: {visible: true, text: "" }
		});


	},


	GraphColumn : function() {	
	
	var productDetail;
	var url = "/XMII/Illuminator?QueryTemplate=SMT_TRAINING/Vignesh/TASKS/EVALUATION/SQL_EV_FIND&Content-Type=text/json&Param.1="+"Pune"

	$.ajax({
		url: url,
		type: "POST",
		async : true,
		success: function (data, txt, jqXHR) {
			if(data.Rowsets.Rowset != undefined){
				productDetail = data.Rowsets.Rowset[0].Row
				var oModel = new sap.ui.model.json.JSONModel(productDetail);
				otaskController.getView().setModel(oModel);
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
		}
	});
		var oVizFrame = otaskController.getView().byId("VizframestackId");
		oVizFrame.setVizType("column");
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions: [{
				name: "DATE",
				value: "{DATE}"
			}],
			measures: [{
				name: 'TEMPERATURE_MIN',
				value: "{TEMP_MIN}"
			},{
				name: 'TEMPERATURE_MAX',
				value: "{TEMP_MAX}"
			}],
			data: {
				path: "/"
			}
		});
		oVizFrame.setDataset(oDataset);
		 feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
			"uid": "valueAxis",
			"type": "Measure",
			"values": ["TEMPERATURE_MIN"]
		}),
		 feedValueAxis1 = new sap.viz.ui5.controls.common.feeds.FeedItem({
			"uid": "valueAxis",
			"type": "Measure",
			"values": ["TEMPERATURE_MAX"]
		}),
		  feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
			"uid": "categoryAxis",
			"type": "Dimension",
			"values": ["DATE"]
		});
		oVizFrame.addFeed(feedValueAxis);
		oVizFrame.addFeed(feedValueAxis1);
		oVizFrame.addFeed(feedCategoryAxis);


		oVizFrame.setVizProperties({
			plotArea: {
					colorPalette: ['#44C1E8','#8F00FF'],
					dataLabel: {showTotal: true,visible:true,hideWhenOverlap:true},
					//dataShape: {primaryAxis: ["bar", "bar"]}
				   },
				   legend: {visible: true},
				   legendGroup: {
					   layout: { position: "top"}
				   },
			valueAxis: {label: { },title: {visible: false}},
			categoryAxis: {title: {visible: false}},
			tooltip: {visible: true},
			title: {visible: true, text: "" }
		});
	},


});
