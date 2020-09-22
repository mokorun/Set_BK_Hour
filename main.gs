function doPost(e) {
  try {
    /*conf読み込み*/
    var confData = getConf();
    
    e.method = "POST";
    var param = e.parameter;
    var contents = JSON.parse(e.postData.contents);
    
    var body = contents.webhook_event.body; //本文
    var keyword_est = body.indexOf("[予定時間入力]", 1);
    var keyword_act = body.indexOf("[実績時間入力]", 1);
    
    if ( keyword_est == -1 && keyword_act == -1){
      var keyword = -1;
    }
    
    if (keyword_est !== -1){
      doSetEstimatedHours(body);
    }else if(keyword_act !== -1){
      doSetActualHours(body);
    }else{
    }
    
    if(keyword == -1){
      var retBody = "ボクわかんない ;(";
      sendMessage(retBody);
      return "エラー";
    }
  } catch(ex) {
    //errer log
    var err_msg = "障害が発生";
    toErr(err_msg);
    return false;
  }
}
