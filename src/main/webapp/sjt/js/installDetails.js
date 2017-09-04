/**
 *
 */

loadCombobox("cashSystem", "cash_system");
// loadCombobox("cashBrand", "cash_brand");
loadCombobox("cashPort", "cash_port");

loadCombobox("printerPort", "printer_port");
loadCombobox("installState", "install");
loadCombobox("installData", "install_data");
/*====安装cynthia ，获得安装编号 start0619===*/         
// function getproId()
// {  
	
// 	$.ajax({
//     url:domainName + "/hdk/project/getFormCode",
//     dataType:"jsonp",
//     jsonp:"callback",
//     data:{
//         formType:"install",
//         proId:proId_name
//     },
//    type:"get",
//    success:function(res){
//     console.log(res);
//       $("#installCode").val(res.code);
//    },
//    error:function(res){    
// 	   console.log(res);
//    } 
//   });
// }           
/*====安装cynthia ，获得安装编号 end===*/
var time = new Date().getTime();
$.ajax({
  url: domainName +  '/hdk/project/getSome',
  type: 'get',
  data: {
    time: time
  },
  jsonpCallback: "project_" + time + "_getSome",
  jsonp: "callback",
  dataType: 'jsonp',
  success: function(rs) {
    var str = '';
    var i = 0;
    $.each(rs, function(index, item) {

      if (0 == i) {
        i++;
        str = str + item.proName;
      } else {
        str = str + "," + item.proName;
      }
    });
    $('#proName').attr("data-select", str);
  },
  error: function(rs) {
    console.log(rs);
  }
});
//
//$.ajax({
//  url:domainName +   '/hdk/state/getSome',
//  type: 'get',
//  data: {
//    'ownerTable': "install"
//  },
//  jsonpCallback: "state_getSome",
//  jsonp: "callback",
//  dataType: 'jsonp',
//  success: function(rs) {
//    /*            alert(JSON.stringify(rs)); */
//    var str = '';
//    var i = 0;
//    $.each(rs, function(index, item) {
//
//      if (0 == i) {
//        i++;
//        str = str + item.staName;
//      } else {
//        str = str + "," + item.staName;
//      }
//    });
//    $('#installState').attr("data-select", str);
//  },
//  error: function(rs) {}
//});


Window.selected = function() {
	$("#shopName").html('');
    $("#shopState").html('');
    $('#shopPosition').html('');
    $('#shopType').html('');
    $('#shopSecType').html('');
    $('#shopCode').html('');
  $.ajax({
    url:domainName +  '/hdk/shops/selectForCombobox',
    type: 'get',
    data: {
      'proId': $('#proName').html()
    },
    jsonpCallback: "shops_selectForCombobox",
    jsonp: "callback",
    dataType: 'jsonp',
    success: function(rs) {
      var str = '';
      var i = 0;
      var has = new Array();

      /*====数组排序 start====*/ 
      var result = rs.sort(function(a,b){  
                    return a.installExist-b.installExist;  
       });   
       installexArr=result;
       console.log(result.length);
      /*====数组排序 end====*/
      $.each(rs, function(index, item) {
        //去重数据 start
         // if (-1 == $.inArray(item.shopName, has)) {
          has.push(item.shopName);
          if (0 == i) {
            i++;
            str = str + item.shopName;
          } else {
            str = str + "," + item.shopName;
          }
         // }
      });
      $("#shopName").attr("data-select", str);

    },
    error: function(rs) {}
  });
}
Window.shopSelected = function() {
	if(""==$('#shopName').html()){
		return;
	}
  $.ajax({
    url:domainName +   '/hdk/shops/selectForCombobox',
    type: 'get',
    data: {
      'shopName': $('#shopName').html()
    },
    jsonpCallback: "shops_selectForCombobox",
    jsonp: "callback",
    dataType: 'jsonp',
    success: function(rs) {
      var str = '';
      var i = 0;
      $.each(rs, function(index, item) {
        $("#shopState").html(item.shopMerStation);
        $('#shopPosition').html(item.shopPosition);
        $('#shopType').html(item.shopType);
        $('#shopSecType').html(item.shopSecType);
        $('#shopCode').html(item.shopId);
      });

    },
    error: function(rs) {}
  });
  //如果这个门店已经调研了，与此门店相关的打印机和收银机信息都已经存在，所以在这样情况下
  //需要将收银机和打印机的信息加载过来。
  $.ajax({
    url:domainName +  '/hdk/survey/getSome',
    type: 'get',
    data: {
      'shopName': $('#shopName').html(),
      'proName': $('#proName').html()
    },
    dataType: 'jsonp',
    jsonpCallback: "getSome",
    jsonp: "callback",
    success: function(rs) {
      console.log("rs"+rs);
      if (null != rs && undefined != rs && rs.length > 0) {
    	  if( 1 ==rs.length ){
    		  loadPrinterAndCasher(rs[0].surId);
    	  }
      } else {
        $.each(rs, function(index, item) {
          surId = item.surId
        });
      }
    },
    error: function(rs) {}
  });
}
var loadInstall = function(allThing){   
    m_loading.remove();    
    if(null != allThing && undefined !=allThing){
        
        allObjs =allThing;
        $('#proNameDiv').html(
                '<div class="g-importList-content">'+
                '<div class="i-text" id = "proName" >未选择</div>'+
        '</div>'
        );
        $('#shopNameDiv').html(
                '<div class="g-importList-content">'+
                '<div class="i-text" id = "shopName" >未选择</div>'+
        '</div>'
        );
        
        if(undefined != allObjs.install){
        	
	        $('#installCode').val(isUndefined(allObjs.install["installId"]));
	        readOnly("installCode");
	        $('#shopCode').html(isUndefined(allObjs.install["shopId"]));
	        $('#cashCode').html(isUndefined(allObjs.install["cashId"]));
	        $('#printCode').html(isUndefined(allObjs.install["printerId"]));
	        $('#equipmentCode').html(isUndefined(allObjs.install["eqId"]));
	        $('#installStation').html(isUndefined(allObjs.install["installStation"]));
	        $('#installData').html(isUndefined(allObjs.install["installData"]));
	        
	        if(!!isUndefined(allObjs.install['attachmentUrl'])){
	         imgs = files = allObjs.install['attachmentUrl'].split(',');
	            
	            for(var i = 0 ; i <files.length ; i ++){
	              $("#imgShow").append('<div ></div>');
	              app.addImg(files[i]);
	            }
	            
	            $('.fullimg').remove();
	        }
        
        	$('#installRemote').val(isUndefined(allObjs.install.installRemote));
        
            //其他
            console.log(allObjs.install.installNetwork);
            if(isUndefined(allObjs.install.installNetwork).indexOf('外网')){
                $('#installNetworkHard').attr("class",'off' );
            }
            if(isUndefined(allObjs.install.installNetwork).indexOf('wifi')){
            	$('#installNetworkSoft').attr("class",'off' );
            }
            /*====安装详情  客户网络情况 start====*/
            window.setTimeout('loadnetwork(allObjs.install.installNetwork)',500);
             /*====安装详情  客户网络情况 end====*/

            // 附件
            //$('#installNetworkHard').val(isUndefined(allObjs.equipment.installTime));
        	
        }
        //var i = new Date(isUndefined()).Format("yyyy-MM-dd");
        
        $("#installCode").attr("readonly","readonly"); 

        
        $('#proName').html(isUndefined(allObjs.project.proName));
        $('#installTime').val(allObjs.install["installTime"]);
        // 门店信息     
        $('#shopName').html(isUndefined(allObjs.shop.shopName));
        $('#shopState').html(isUndefined(allObjs.shop.shopMerStation));
        $('#shopPosition').html(isUndefined(allObjs.shop.shopPosition));
        $('#shopType').html(isUndefined(allObjs.shop.shopType));
        $('#shopSecType').html(isUndefined(allObjs.shop.shopSecType));
        $('#installState').html(isUndefined(allObjs.install.installStation));        
        //收银机信息
        if(undefined != allObjs.cash){
        	
        $('#cashId').val(isUndefined(allObjs.cash.cashId));
        $('#cashSystem').html(isUndefined(allObjs.cash.cashSystem));
        
        $('#cashBrand').val(isUndefined(allObjs.cash.cashBrand));
        $('#cashPort').html(isUndefined(allObjs.cash.cashPort));
      
        if( "是" == isUndefined(allObjs.cash.printerDriver)){
            $('#f').attr('class','off');
            $('#t').attr('class','on');
        }else{
            $('#t').attr('class','off');
            $('#f').attr('class','on');
        }
        
        }
        
        // 打印机
        if(undefined != allObjs.printer){

        	$('#priId').val(isUndefined(allObjs.printer.printerId));
            $('#priBrand').val(isUndefined(allObjs.printer.printerBrand));
            $("#dyjxh").val(isUndefined(allObjs.printer.printerModel));
            $('#printerPort').html(isUndefined(allObjs.printer.printerPort));

        }
        // 采集点

        if(undefined != allObjs.equipment){
        	
        $('#eqId').val(isUndefined(allObjs.equipment.eqId));
        // if("硬件" == isUndefined(allObjs.equipment.eqType)){
        //     $('#eqTypeHard').attr("class",'on');
        //     $('#eqTypeSoft').attr("class",'off');
        // }else{
        //     $('#eqTypeHard').attr("class",'off');
        //     $('#eqTypeSoft').attr("class",'on');
        // }
       
        $("#eqTypeHard").html(isUndefined(allObjs.equipment.eqType));
        $('#eqStyle').html(isUndefined(allObjs.equipment.eqStyle));
        var software_txt;
        if($("#eqTypeHard").html()=="硬件数据通")
          {$("#softCodeOrVersion").html("硬件编号");}
        else if($("#eqTypeHard").html()=="软件数据通")
          {$("#softCodeOrVersion").html("软件版本");}
        else
          {$("#softCodeOrVersion").parents("li").css("display","none");}
        if(isUndefined(allObjs.equipment.softwareVersion))
            {software_txt=allObjs.equipment.softwareVersion;}
         if(isUndefined(allObjs.equipment.hardwareId))
            {software_txt=allObjs.equipment.hardwareId;}

        $('#softwareVersion').val(software_txt);
        /* $('#installTime').val(isUndefined(allObjs.equipment.installTime)); */
        
        }

    }
}      
 function loadnetwork(network)
 { $("#getnetwork .i-choice-rowchk").each(function(i){
           var objp=$(this).find("p");
           var objdiv=$(this).find("div");
           if(network.indexOf(objp.html())!=-1){
            objdiv.addClass('on');
           }

        })
}   
function loadPrinterAndCasher(surId) {
	
	
  $.ajax({
  url:domainName +   '/hdk/survey/gotoModify',
  type: 'get',
  data: {
    'surId': surId,
  },
  jsonp: "callback",
  dataType: 'jsonp',
  success: function(rs) {
      console.log(rs);
      
      if(undefined != rs.printer){
        $('#priId').val(rs.printer.printerId);
        $('#priBrand').val(rs.printer.printerBrand);
        $("#dyjxh").val(rs.printer.printerModel);
        $('#prinPort').val(rs.printer.printerPort);
      }
      
      if(undefined != rs.survey){
          if(isUndefined(rs.survey.surNetwork).indexOf('外网')){
              $('#installNetworkHard').attr("class",'on' );
          }
          if(isUndefined(rs.survey.surNetwork).indexOf('wifi')){
          	$('#installNetworkSoft').attr("class",'on' );
          }
      }
      
      if(undefined != rs.cash){
        $('#cashId').val(rs.cash.cashId);
        $('#cashSystem').html(rs.cash.cashSystem);
        $('#cashBrand').val(rs.cash.cashBrand);
        $('#cashPort').html(rs.cash.cashPort);

        if (undefined == rs.cash.printerDriver || "" == rs.cash.printerDriver) {
          $('#t').attr("class", "off");
          $('#f').attr("class", "on");
        } else {
          $('#t').attr("class", "on");
          $('#f').attr("class", "off");

        }
      }
      
  },
  error:function(rs){
	  app.alert("网络出错",1);
  }	
  });
//  $.ajax({
//    url: ctx + '/printer/getSome',
//    type: 'post',
//    data: {
//      'surId': surId,
//    },
//    jsonpCallback: "printer_getSome",
//    jsonp: "callback",
//    dataType: 'jsonp',
//    success: function(rs) {
//      if (null != rs && undefined != rs && rs.length > 0) {
//        $.each(rs, function(index, item) {
//          $('#priId').val(item.printerId);
//          $('#priBrand').val(item.printerBrand);
//          $('#prinPort').val(item.printerPort);
//        });
//      }
//    },
//    error: function(rs) {}
//  });
//  $.ajax({
//    url: ctx + '/cash/getSome',
//    type: 'post',
//    data: {
//      'surId': surId,
//    },
//    jsonpCallback: "cash_getSome",
//    jsonp: "callback",
//    dataType: 'jsonp',
//    success: function(rs) {
//      if (null != rs && undefined != rs && rs.length > 0) {
//        $.each(rs, function(index, item) {
//          $('#cashId').html(item.cashId);
//          $('#cashSystem').html(item.cashSystem);
//          $('#cashBrand').html(item.cashBrand);
//          $('#cashPort').html(item.cashPort);
//
//          if (undefined == item.printerDriver || "" == item.printerDriver) {
//            $('#t').attr("class", "off");
//            $('#f').attr("class", "on");
//          } else {
//            $('#t').attr("class", "on");
//            $('#f').attr("class", "off");
//
//          }
//
//        });
//      }
//    },
//    error: function(rs) {}
//  });
}


function setCashidOnInstall(obj,label) {
	checkCode(obj,label);
  $('#cashCode').html($('#cashId').val());
}


function setpriIdOnInstall(obj,label) {
	checkCode(obj,label);
  $('#printCode').html($('#priId').val());

}

function seteqIdOnInstall(obj,label) {
	checkCode(obj,label);
  $('#equipmentCode').html($('#eqId').val());

}

var params = function() {
  var query = {},
    search = window.location.search.substring(1),
    parts = search.split('&'),
    pairs = [];

  for (var i = 0, len = parts.length; i < len; i++) {
    pairs = parts[i].split('=');
    query[pairs[0]] = (pairs.length > 1 ? decodeURIComponent(pairs[1]) : null);
  }

  return query;
}();

if(undefined != params["installId"] && "" != params["installId"]){
	$.ajax({
		url:domainName + "/hdk/install/gotoModify",
		data:{
			installId:params["installId"]
		},
		dataType:'jsonp',
		type:'get',
		jsonp:"callback",
		success:function(res){
			if(undefined !=res && null != res && 'success' == res.message){
				allThing = res;
				loadInstall(res);
			}else{
				app.alert("网络出现问题",1);
			}
		},
		error:function(rs){
			console.log(rs);
		}
	});
}
else
{    var time = new Date().getTime();
            var proId_name="";
            $.ajax({
              url: domainName +  '/hdk/project/getSome',
              type: 'get',
              data: {
                time: time
              },
              jsonpCallback: "project_" + time + "_getSome",
              jsonp: "callback",
              dataType: 'jsonp',
              success: function(rs) {
                var str = '';
                var i = 0;
                $.each(rs, function(index, item) {
                  if(item.proName==params["pproName"])
                   {proId_name=item.proId;}
                });
               /*====获得编号 start=====*/
               getproId()
              /*====获得编号 end=====*/
              },
              error: function(rs) {
                console.log(rs);
              }
            });  
  }

      function xgid()
      {var xgcashid=""
        if(allObjs.cash)
        {xgcashid=allObjs.cash.id }
       return xgcashid;
      }
      function printid()
      {
        var printerid="";
        if(allObjs.printer)
        {printerid=allObjs.printer.id;}
        return printerid;
      }
var submit = function() {
  //  app.saveDate();
  // 在没有调研的情况下要进行一下动作
  //保存收银机
  // 保存打印机
  // 采集点
  //验证
  m_loading.html();
   if(form_empty({code:$('#installCode').val(), which:"安装编号"}))
      {return;}
    if(form_empty({code:$('#proName').html(), which:"项目名称"}))
      {return;}
    if(form_empty({code:$('#shopName').html(), which:"商铺名称"}))
      {swiper2.slideTo(1, 0, true);
        return;}
      if(form_empty({code:$('#installState').html(), which:"安装状态"}))
      {swiper2.slideTo(1, 0, true);
        return;}
         if(chk_equipment())
        {
            return;          
        }
        if(form_empty({code:$('#installState').html(), which:"安装状态"}))
       {swiper2.slideTo(4, 0, true);
        return;
        }
        if(form_empty({code:$('#eqTypeHard').html(), which:"采集接口类型"}))
        {swiper2.slideTo(4, 0, true); 
        return;
         }     
        if(form_empty({code:$('#eqStyle').html(), which:"采集方式"}))
        {swiper2.slideTo(4, 0, true); 
        return;
         }   
         if(form_empty({code:$('#installTime').val(), which:"安装日期"}))
        {swiper2.slideTo(4, 0, true); 
        return;
         }   
         if(form_empty({code:$('#priBrand').val(), which:"打印机品牌"}))
        {swiper2.slideTo(3, 0, true);
           $("#g-popupOk").bind("click",function(){ $('#priBrand').focus();})  
        return;}
         if(form_empty({code:$('#dyjxh').val(), which:"打印机型号"}))
        {swiper2.slideTo(3, 0, true);
          $("#g-popupOk").bind("click",function(){ $('#dyjxh').focus();})  
        return;}
     //验证收银机编号和打印机编号 start
         var cashSystem_txt=$("#cashSystem").html();
         var cashBrand_txt=$("#cashBrand").val();
         var cashPort_txt=$("#cashPort").html();
        if(chk_brand(cashSystem_txt,cashBrand_txt,cashPort_txt,"#cashId"))
           {swiper2.slideTo(2, 0, true);
            return;
           }
  if (null != allThing && undefined !=allThing) {

    $.ajax({
      url:domainName +  '/hdk/install/modify',
      type: 'post',
      beforeSend:ajaxLoading(),
      complete:ajaxLoadEnd(),
      dataType: 'json',
      data: {
    	  files:JSON.stringify(imgs),	
        'install.installId': $("#installCode").val(),
        'install.id': (undefined == allObjs.install?"":allObjs.install.id),
        'install.installStation': $('#installStation').html(),
        'install.proId': (undefined == allObjs.install?"":allObjs.install.proId),
        'install.shopId': $('#shopCode').html(),
        'install.cashId': $('#cashCode').html(),
        'install.printerId': $('#printCode').html(),
        'install.eqId': $('#eqId').val(),
        'install.installData': $('#installData').html(),
        'install.installTime': $('#installTime').val()
          //,'install.installUser':''
          ,
        'install.installNetwork': qt.selectedItem(),
        'install.installRemote': $('#installRemote').val()
          //,'install.installEndtime':
          //,'install.install.createdAt':''
          //,'install.updatedAt':''
          //,'install.installRemarks':''
          //收银机
          ,
        "cash.id": xgid(),
        'cash.cashId': $("#cashId").val(),
        'cash.cashBrand': $("#cashBrand").val()
          //,'cashRegister':''
          ,
        'cash.cashSystem': $("#cashSystem").html(),
        'cash.cashPort': $("#cashPort").html(),
        'cash.printerDriver': ($("#t").attr("class") == "off" ? "否" : "是"),
        'cash.surId': surId,
        'cash.installId': $("#installCode").val(),          
        'printer.id': printid(),
        'printer.printerId': $('#priId').val(),
        'printer.printerBrand': $('#priBrand').val(),
        'printer.printerModel':$("#dyjxh").val(),    //打印机型号
        'printer.printerPort': $('#printerPort').html(),
        'printer.surId': surId,
        'printer.installId': $("#installCode").val()
          //          ,'createdAt':''
          //          ,'updatedAt':''
          //采集点
          ,
        'equipment.id': (undefined == allObjs.equipment?"":allObjs.equipment.id),
        'equipment.eqId': $("#eqId").val(),
        'equipment.eqType': $('#eqTypeHard').html(),
        'equipment.eqStyle': $("#eqStyle").html()
          //          ,'hardwareId':
          ,
        'equipment.softwareVersion': ($('#eqTypeHard').html()=="软件数据通" ? $('#softwareVersion').val():""),
        'equipment.hardwareId': ($('#eqTypeHard').html()=="硬件数据通"? $('#softwareVersion').val():""),
        'equipment.proId':( undefined == allObjs.project?"":allObjs.project.proId),
        'equipment.shopId': $('#shopCode').html(),
        'userName': params.userName,
        'userNum': params.userNums
        //          ,'remark1':''
        //          ,'remark2':''
        //          ,'createdAt':''
        //          ,'updatedAt':''
      },
      success: function(result) {
        m_loading.remove();
    	  if("success" == result.message){
     
    			  window.SYP.showAlertAndRedirectWithCleanStack("温馨提示", "保存成功"
    					  ,domainName + "/hdk/sjt/installList.html?syp_user_num="+params["userNum"]+"&syp_user_name="+params["userName"]);
 
    	  }else{
    		  app.alert("保存失败，请重试",1);
    		  
    	  }
      },
      error: function(result) {
        m_loading.remove();
    	  app.alert("保存失败，请重试",1);
      }
    });


  } else {
	 
        
        // var priBrand_txt=$("#priBrand").val();
        //  var dyjxh_txt=$("#dyjxh").html();
        //  var dyjPort_txt=$("#printerPort").html();
        // if(chk_print(priBrand_txt,dyjxh_txt,dyjPort_txt,"#priId"))
        //   {return;}    
        
         //验证收银机编号和打印机编号 end 
         
	 $.when(
    codeUnique({
		 tableName:"install"
								         ,codeField:"install_id"
								         ,code:$('#installCode').val()
								         , which:"安装编码"
								        ,extra:true
	 				} )			      
            )
	 .done(function(){ 
    m_loading.html();

    $.ajax({
      url:domainName +   '/hdk/install/submit', //用于文件上传的服务器端请求地址
      dataType: 'json', //返回值类型 一般设置为json
      type:'post',
      beforeSend:ajaxLoading(),
      complete:ajaxLoadEnd(),
      data: {
    	  files:JSON.stringify(imgs),
        'install.installId': $("#installCode").val(),
          //          ,'install.id':allObjs.install.id,
        'install.installStation': $('#installStation').html(),
        'install.proId': $('#proName').html(),
        'install.shopId': $('#shopCode').html(),
        'install.cashId': $('#cashCode').html(),
        'install.printerId': $('#printCode').html(),
        'install.eqId': $('#eqId').val(),
        'install.installData': $('#installData').html(),
        'install.installTime': $('#installTime').val()  ,
          //,'install.installUser':''
        
        'install.installNetwork': qt.selectedItem(),
        'install.installRemote': $('#installRemote').val() ,
          //,'install.installEndtime':
          //,'install.install.createdAt':''
          //,'install.updatedAt':''
          //,'install.installRemarks':''
          //收银机
          //          ,"cash.id":allObjs.cash.id
         
        'cash.cashId': $("#cashId").val(),
        'cash.cashBrand': $("#cashBrand").val()  ,
          //,'cashRegister':''
        
        'cash.cashSystem': $("#cashSystem").html(),
        'cash.cashPort': $("#cashPort").html(),
        'cash.printerDriver': ($("#t").attr("class") == "off" ? "否" : "是"),
        'cash.surId': surId,
        'cash.installId': $("#installCode").val(),
          //打印机
          //          ,'printer.id':allObjs.printer.id
       
        'printer.printerId': $('#priId').val(),
        'printer.printerBrand': $('#priBrand').val(),
        'printer.printerModel':$("#dyjxh").val(), //打印机型号
        'printer.printerPort': $('#printerPort').html(),
        'printer.surId': surId,
        'printer.installId': $("#installCode").val(),
          //          ,'createdAt':''
          //          ,'updatedAt':''
          //采集点
          //          ,'equipment.id':allObjs.equipment.id
     
        'equipment.eqId': $("#eqId").val(),
        'equipment.eqType': $('#eqTypeHard').html(),
        'equipment.eqStyle': $("#eqStyle").html()
          //          ,'hardwareId':
          ,
         'equipment.softwareVersion': ($('#eqTypeHard').html()=="软件数据通" ? $('#softwareVersion').val():""),
        'equipment.hardwareId': ($('#eqTypeHard').html()=="硬件数据通"? $('#softwareVersion').val():""),
        'equipment.proId': $('#proName').html(),
        'equipment.shopId': $('#shopCode').html(),
        'userName': params.userName,
        'userNum': params.userNum
        //          ,'remark1':''
        //          ,'remark2':''
        //          ,'createdAt':''
        //          ,'updatedAt':''
      },
      success: function(data, status) //服务器成功响应处理函数
      {m_loading.remove();
        console.log(data);
        
        if(data.message == "success"){
   
  
  			window.SYP.showAlertAndRedirectWithCleanStack("温馨提示", "保存成功"
  					,domainName + "/hdk/sjt/installList.html?syp_user_num="+params["userNum"]+"&syp_user_name="+params["userName"]);
 
        }else{
        	app.alert("保存失败",1);
        	
        }
        
      },
      error: function(data, status, e) //服务器响应失败处理函数
      {m_loading.remove();
        console.log(e);
        console.log(data);
        console.log(status);

      }
      //ajax end
    });
   //done end 
	 }).fail(function(){m_loading.remove();

    alert("网路原因未请求成功")});
	 
	 
  }
}

var onSetupState = function() {
  $('#installStation').html($('#installState').html());
}
$(function(){
    if($("#installCode").val()=="" || $("#installCode").val()==undefined)
      {m_loading.html();}  
       /*===保存返回 start===*/
        window.SYP.saveParam (false,1);
        $("input,textarea").bind("focus",function(){
             window.SYP.saveParam (true,1);
         })  
        $(".i-text,.i-choice-row,.i-choice-rowchk").bind("click",function(){
             window.SYP.saveParam (true,1);
         }) 
         $(".i-choicechk").on("click",".i-choice-rowchk",function(){
             window.SYP.saveParam (true,1);
         })       
        /*===保存返回 end===*/        
   //img start
                $("#imgShow").on("click","div",function(){
                    var i=$(this).index();
                    app.fullImg(i);
                })
  //img end
})
/*====安装cynthia ，获得安装编号 start0619===*/         
            function getproId()
            {  $.ajax({
                url:domainName + "/hdk/project/getFormCode",
                dataType:"jsonp",
                jsonp:"callback",
                data:{
                    formType:"install",
                    proId:proId_name
                },
               type:"get",
               success:function(res){
                m_loading.remove();
                console.log(res);
                  $("#installCode").val(res.code);
               },
               error:function(res){                   
               } 
              });}           
            /*====安装cynthia ，获得安装编号 end===*/



var oneqTypeSelected = function(){
	
	
	 $.ajax({ 
		 url: domainName + '/hdk/state/getSome',
		 type:'get',
		 data:{
				'ownerTable':'equipment_type',
				'parentId':$('#eqTypeHard').html(),

		 },
	 		//jsonpCallback:"state_"+time+"_getSome",
	 		jsonp: "callback",
		 dataType:'jsonp',
		 success:function(rs){     
      	 
			 $("#eqStyle").html("");
			 var stack = new Array();
			 $.each(rs ,function(index,item){
				 stack.push(item.staName);
			 });
			 $("#eqStyle").attr("data-select",stack.join(","));
        $("#eqStyle").click(function() {
          eqstyle_click();
           })
		 },
		 error:function(){
			 
		 }
	 });
}
function eqstyle_click()
{
        if($("#eqStyle").attr("data-select")=="")
          {   
           app.alert("采集点为空"); 
          } 
          else{ 
            app.select($("#eqStyle"),2,null);
          }
}
 function loadCombobox_s(id , table,isAll,includeDefault){
 // m_loading.remove();
  m_loading.html();
   var time = (new Date().getTime());
   $.ajax({ 
     url: domainName + '/hdk/state/getSome',
     type:'get',
     data:{
        'ownerTable':table,
        'time':time,
        'isAll':isAll,
        'parentId':$('#eqTypeHard').html()
     },
      //jsonpCallback:"state_"+time+"_getSome",
      jsonp: "callback",
     dataType:'jsonp',
     success:function(rs){
       var str = '';
       var i = 0 ;
       $.each(rs,function(index,item){
         
         if(0  == i){
           i++;
           str = str + item.staName;
         }else{
           str = str + ","+item.staName;
         }
         if(includeDefault == true || undefined == includeDefault ){
         if(undefined!=item.isDefault&& 1==item.isDefault){
           if($('#'+id).is('div')){
             $('#'+id).html(item.staName);
           }else if($('#'+id).is('input')){
             $('#'+id).val(item.staName);
           }
         }
         }
       });
       $('#'+id).attr("data-select",str);
       m_loading.remove();
       if(id=="install_getdata")
        {getnewwork();}
       state_getSome = null ;
     },
     error:function(rs){
     }
   });  
 }

