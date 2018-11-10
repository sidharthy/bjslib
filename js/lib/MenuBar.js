/*
 * MenuBar class under ui package of Bracket Javascript Library.
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
NS_BKTJSLIB1dot0_UI.MenuBar = NS_BKTJSLIB1dot0_UI.MenuBar || (function() {

     function MenuBar()
     {
          this.children = new Array();
          this.materializedDiv = null;
     };

     MenuBar.prototype.getMenu = function(index)
     {
          if (index >=0 && index < this.children.length)
          {
               return this.children[index];
          }
          return null;
     };

     MenuBar.prototype.addMenu = function(menu)
     {
          this.children.push(menu);
     };

     MenuBar.prototype.removeMenu = function(index)
     {
          var m = this.getMenu(index);
          if (m != null)
          {
               this.children.splice(index, 1);
          }
          return m;
     };

     MenuBar.prototype.removeAll = function(index)
     {
          for (var i = 0; i < this.children.length; i++)
          {
               this.removeMenu(0);
          }
     };

     MenuBar.prototype.getNumChildren = function()
     {
          return this.children.length;
     };

     MenuBar.prototype.getMaterializedDiv = function()
     {
          return this.materializedDiv;
     };

     MenuBar.prototype.materialize = function(containerDomElement, menubarDecoratorCallback, registerEventsCallback, menuDecoratorCallback)
     {
          if (this.materializedDiv)
               return;

          var divE = document.createElement("div");
          containerDomElement.appendChild(divE);
          //divE.style.display = (this.parent == null)? "block": "none";
          //divE.style.visibility = (this.parent == null)? "visible": "hidden";
          this.materializedDiv = divE;
          menubarDecoratorCallback(this);

          var numChildren = this.getNumChildren();
          for (var i = 0; i < numChildren; i++)
          {
               var childrenDiv = document.createElement("div");
               childrenDiv.style.cssFloat = "left";
               childrenDiv.style.display = "inline";
               divE.appendChild(childrenDiv);
               this.children[i].materialize(childrenDiv, registerEventsCallback, menuDecoratorCallback);

               //honour min and max width/height
               var minWidth = this.children[i].getMinimumWidth();
               var minHeight = this.children[i].getMinimumHeight();
               var maxWidth = this.children[i].getMaximumWidth();
               var maxHeight = this.children[i].getMaximumHeight();

               var _width = childrenDiv.offsetWidth;
               var _height = childrenDiv.offsetHeight;

               /************************************************************/
               /***** Take min and max width/height into consideration *****/
               /************************************************************/
               var __width = _width;
               var __height = _height;
               if (minWidth != -1)
                    __width = Math.max(__width, minWidth);
               if (minHeight != -1)
                    __height = Math.max(__height, minHeight);

               if (maxWidth != -1)
                    __width = Math.min(__width, maxWidth);
               if (maxHeight != -1)
                    __height = Math.max(__height, maxHeight);

               if (_width != __width)
               {
                    _width = __width;
                    childrenDiv.style.width = _width + "px";
               }
               if (_height != __height)
               {
                    _height = __height;
                    childrenDiv.style.height = _height + "px";
               }
               /************************************************************/
               /************************************************************/
               /************************************************************/
          }
     };

     return {
          //export any public methods and variables
          instance : MenuBar     //constructor
     };

}());