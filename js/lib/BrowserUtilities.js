/*
 * BrowserUtilities class under util package of Bracket Javascript Library.
 * This class provides implicit support to declare methods/fields as public or private.The public methods/fields are to be exported 
 * through the return statement at the end of the file.
 * 
 * @author Sidharth Yadav
 * Email: sidharth_08@yahoo.com, sidharth@bracket.co.in
 * Copyright protected file. All rights reserved.
 *
 * You may use this script in your application/web pages provided you don't modify any part of this file, including the comments. If you wish to use a modified version 
 * of this script then you must first get the approval from the author. Also you use this script purely at your own risk and the author doesn't take any 
 * responsibility whatsoever if you face any issue(s) as a result of using this script.
 */
NS_BKTJSLIB1dot0_Util.BrowserUtilities = NS_BKTJSLIB1dot0_Util.BrowserUtilities || (function() {

     function getIEVersion()
     {
          var versionNum = -1;  //-1 indicates failure.
          if (navigator.appName == 'Microsoft Internet Explorer')
          {
               var ua = navigator.userAgent;
               var rexp = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
               if (rexp.exec(ua) != null)
                    versionNum = parseFloat(RegExp.$1);
          }
          return versionNum;
     };

     function getOperaVersion()
     {
          var versionNum = 0;  //default
          if (window.opera)
          {
               var versionNumAsString = window.opera.version();
               versionNum = parseFloat(versionNumAsString);
          }
          return versionNum;
     };

     function isSupportsRGBA()
     {
          var scriptElement = document.getElementsByTagName('script')[0];
          var prevColor = scriptElement.style.color;
          var rgbaTestColor = 'rgba(0, 0, 0, 0.1)';  //any rgba test color
          if (prevColor == rgbaTestColor)
          {
               return true;  //already supports rgba
          }
          try
          {
               scriptElement.style.color = rgbaTestColor;
          }
          catch(e)
          {
               //rgba not supported.
          }
          var _supportsRGBA = scriptElement.style.color != prevColor;
          scriptElement.style.color = prevColor;  //restore the property
          return _supportsRGBA;
     };

     var userAgent = navigator.userAgent;
     var isIE =  navigator.appVersion.match(/MSIE/) != null;
     var IEVersion = getIEVersion();
     var isIE8AndAbove = isIE && IEVersion >= 8;
     var isIE9AndAbove = isIE && IEVersion >= 9;
     var isIEOld = isIE && !isIE8AndAbove;

     var isFirefox = userAgent.match(/firefox/i) != null;
     var isFirefoxOld = isFirefox && ((userAgent.match(/firefox\/2./i) != null) || (userAgent.match(/firefox\/1./i) != null));
     var isFirefoxNew = isFirefox && !isFirefoxOld;

     var isWebKit =  navigator.appVersion.match(/WebKit/) != null;
     var isChrome =  navigator.appVersion.match(/Chrome/) != null;
     var isOpera =  window.opera != null;
     var operaVersion = getOperaVersion();
     var isOperaVersionBelow10 = isOpera && (operaVersion < 10);
     var isOperaOld = isOperaVersionBelow10;  //version less than 10

     var supportsRGBAColors = isSupportsRGBA();

     return {
          //export any public methods and variables
          userAgent: userAgent,
          isIE : isIE,
          IEVersion : IEVersion,
          isIE8AndAbove : isIE8AndAbove,
          isIE9AndAbove : isIE9AndAbove,
          isIEOld : isIEOld,
          isFirefox : isFirefox,
          isFirefoxOld : isFirefoxOld,
          isFirefoxNew : isFirefoxNew,
          isWebKit : isWebKit,
          isChrome : isChrome,
          isOpera : isOpera,
          isOperaVersionBelow10 : isOperaVersionBelow10,
          isOperaOld : isOperaOld,
          isSupportsRGBAColors : supportsRGBAColors
     };

}());