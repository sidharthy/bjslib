/*
 * DomUtilities class under util package of Bracket Javascript Library.
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
NS_BKTJSLIB1dot0_Util.DomUtilities = NS_BKTJSLIB1dot0_Util.DomUtilities || (function() {

     //short hand names for external classes used inside this class
     var isIE = NS_BKTJSLIB1dot0_Util.BrowserUtilities.isIE;
     var isIENew = NS_BKTJSLIB1dot0_Util.BrowserUtilities.isIENew;
     var isIEOld = NS_BKTJSLIB1dot0_Util.BrowserUtilities.isIEOld;
     var isFirefoxNew = NS_BKTJSLIB1dot0_Util.BrowserUtilities.isFirefoxNew;
     var isFirefoxOld = NS_BKTJSLIB1dot0_Util.BrowserUtilities.isFirefoxOld;
     var isChrome = NS_BKTJSLIB1dot0_Util.BrowserUtilities.isChrome;
     var isOperaOld = NS_BKTJSLIB1dot0_Util.BrowserUtilities.isOperaOld;
     var isWebKit = NS_BKTJSLIB1dot0_Util.BrowserUtilities.isWebKit;

     //Works only for border width set in pixels. If the border width is not in pixels then exception would be thrown.
     function ParsePixelBorderWidth(swidth)
     {
          var _parsedWidth = 0;
          if (swidth != null && typeof(swidth) == "string")
          {
               var p = swidth.indexOf("px");
               if (p >= 0)
               {
                    _parsedWidth = parseInt(swidth.substring(0, p));
               }
               else
               {
                    throw "Border width passed is not in pixels. This method works only for pixeled borders";
               }
          }
          return _parsedWidth;
     };

     function ParseBorderWidth(width)
     {
          //TODO parse border widths set in units other than pixels
          return ParsePixelBorderWidth(width);
     };

     //Returns border width (if in pixels) for some element. If the border width is not in pixels then exception would be thrown.
     function GetPixelBorderWidth(element)
     {
          var bw = {};
          bw.left = 0; bw.right = 0; bw.top = 0; bw.bottom = 0;
          if (window.getComputedStyle)
          {
               //for Firefox
               var elStyle = window.getComputedStyle(element, null);
               bw.top = parseInt(elStyle.borderTopWidth.slice(0, -2));
               bw.bottom = parseInt(elStyle.borderBottomWidth.slice(0, -2));
               bw.left = parseInt(elStyle.borderLeftWidth.slice(0, -2));
               bw.right = parseInt(elStyle.borderRightWidth.slice(0, -2));
          }
          else
          {
               //for other browsers
               try
               {
                    bw.top = ParsePixelBorderWidth(element.style.borderTopWidth);
                    bw.bottom = ParsePixelBorderWidth(element.style.borderBottomWidth);
                    bw.left = ParsePixelBorderWidth(element.style.borderLeftWidth);
                    bw.right = ParsePixelBorderWidth(element.style.borderRightWidth);
               }
               catch(e)
               {
                    //border width likely was not in pixels
                    throw e;
               }
          }

          return bw;
     };

     function GetBorderWidth(width)
     {
          //TODO return border widths set in units other than pixels
          return GetPixelBorderWidth(width);
     };

     //Returns the rectangle bounds (x, y, width, height) of an element within the document.
     function GetElementBounds(elemID)
     {
          var element;
          if (typeof(elemID) == "string")
          {
               element = document.getElementById(elemID);
          }
          else
          {
               element = elemID;
          }

          var res = new Object();
          res.x = 0; res.y = 0; res.width=element.offsetWidth; res.height=element.offsetHeight;
          if (element !== null)
          {
               res.x = element.offsetLeft;

               var offsetParent = element.offsetParent;
               var offsetParentTagName = offsetParent != null ? offsetParent.tagName.toLowerCase() : "";

               //if (isIENew  && offsetParentTagName == 'td') {
               if (isIEOld  && offsetParentTagName == 'td') {  //Sidharth: I changed the previous commented line to this
                    res.y = element.scrollTop;
               }
               else
               {
                    res.y = element.offsetTop;
               }

               var parentNode = element.parentNode;
               var borderWidth = null;

               while (offsetParent != null)
               {
                    res.x += offsetParent.offsetLeft;
                    res.y += offsetParent.offsetTop;

                    var parentTagName = offsetParent.tagName.toLowerCase();

                    if ((isIEOld && parentTagName != "table") || (isFirefoxNew && parentTagName == "td")  || isChrome)
                    {
                         borderWidth = GetBorderWidth(offsetParent);
                         //res.x += borderWidth.left;
                         //res.y += borderWidth.top;
                    }

                    if (offsetParent != document.body && offsetParent != document.documentElement)
                    {
                         res.x -= offsetParent.scrollLeft;
                         res.y -= offsetParent.scrollTop;
                    }

                    //next lines are necessary to fix the problem with offsetParent
                    if (!isIE && !isOperaOld || isIENew)
                    {
                         while (offsetParent != parentNode && parentNode != null)
                         {
                              res.x -= parentNode.scrollLeft;
                              res.y -= parentNode.scrollTop;
                              if (isFirefoxOld || isWebKit)
                              {
                                   borderWidth = GetBorderWidth(parentNode);
                                   //res.x += borderWidth.left;
                                   //res.y += borderWidth.top;
                              }
                              parentNode = parentNode.parentNode;
                         }
                    }

                    parentNode = offsetParent.parentNode;
                    offsetParent = offsetParent.offsetParent;
               }
          }
          return res;
     };

     return {
          //export any public methods and variables
          ParseBorderWidth : ParseBorderWidth,
          GetBorderWidth : GetBorderWidth,
          GetElementBounds : GetElementBounds
     };

}());