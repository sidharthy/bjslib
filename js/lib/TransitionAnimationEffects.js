/*
 * TransitionAnimationEffects class under util package of Bracket Javascript Library. It can be used to transition from one html element/image to another.
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
NS_BKTJSLIB1dot0_Util.TransitionAnimationEffects = NS_BKTJSLIB1dot0_Util.TransitionAnimationEffects || (function() {

     //shorthand names of the external classes used inside this class.
     var KeyValueMap = NS_BKTJSLIB1dot0_Collections.KeyValueMap.instance;
     var Animator = NS_BKTJSLIB1dot0_Util.Animator.instance;
     var State = NS_BKTJSLIB1dot0_Util.Animator.State;
     var SourceWrapper = NS_BKTJSLIB1dot0_Util.Animator.SourceWrapper;

     function AnimatorWrapper(startElementObj, endElementObj, animator, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          this.startElementObj = startElementObj;
          this.endElementObj = endElementObj;
          this.animator = animator;
          this.deltaKVMap = deltaKVMap;
          this.speedKVMap = speedKVMap;
          this.onCompleteCallback = onCompleteCallback;
          this.onStopCallback = onStopCallback;
          this.onApplyStateToSourceCallback_PostProcessing = onApplyStateToSourceCallback_PostProcessing;
          this.start = function()
          {
               this.animator.start(this.deltaKVMap, this.speedKVMap);
          };
          this.stop = function()
          {
               this.animator.stop();
          };
          var onComplete = function(animator)
          {
               _onComplete.call(this, this);
          };
          var onStop = function(animator, stateAtStop)
          {
               _onStop.call(this, this, stateAtStop);
          };
          var applyStateToSource = function(typeOfAnimationBeingPlayed, source, state, attribute, isAttributeTransitionComplete)
          {
               _applyStateToSource(typeOfAnimationBeingPlayed, source, state, attribute, isAttributeTransitionComplete, this);
          };
          this.animator.setOnCompleteCallback(onComplete, this);
          this.animator.setOnStopCallback(onStop, this);
          this.animator.setApplyStateToSourceCallback(applyStateToSource, this);
     }

     var getUnitValue = function(unit, forAttrib)
     {
          if (!isNaN(unit))
               return unit;
          if (unit instanceof KeyValueMap)
          {
               return unit.get(forAttrib, true);
          }
          if (unit[forAttrib])
               return unit[forAttrib];
          return unit;     //the caller doesn't seem to have passed a valid numeric value and we will return it as is. If the script runs into errors then so be it.
     };

     var getAnimatableElement = function(elemObj)
     {
          if (elemObj instanceof SourceWrapper)
               return elemObj.getAnimatableElement();
          return elemObj;
     };

     function FadeTransition(startElementObj, endElementObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var startElement = getAnimatableElement(startElementObj);
          var endElement = getAnimatableElement(endElementObj);

          startElement.style.zIndex = 2;
          endElement.style.zIndex = 1;
          endElement.style.opacity = 0.0;
          endElement.style.visibility = "visible";

          var start = new State();
          start.setAttribute('opacity', 1.0);

          var end = start.clone();
          end.setAttribute('opacity', 0.0);

          //var a = new Animator(startElement, start, end);
          var a = new Animator(startElementObj, start, end);
          a.setTypeOfAnimation('Fade');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put('opacity', getUnitValue(deltaUnit, 'opacity'));
          var speedKVMap = new KeyValueMap();
          speedKVMap.setDefault('default', getUnitValue(transitionDelay, 'opacity'));

          return new AnimatorWrapper(startElementObj, endElementObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     function SlideTo(direction, startElementObj, endElementObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var currentVisibleElement = getAnimatableElement(startElementObj);
          var nextVisibleElement = getAnimatableElement(endElementObj);
          nextVisibleElement.style.opacity="1.0";
          nextVisibleElement.style.visibility="visible";
          currentVisibleElement.style.zIndex = 1;
          nextVisibleElement.style.zIndex = 2;

          var startValue = direction == 'left'? _getWidth(nextVisibleElement): 
                           direction == 'right'? 0 - _getWidth(nextVisibleElement): 
                           direction == 'top'? _getHeight(nextVisibleElement): 
                           direction == 'bottom'? 0 - _getHeight(nextVisibleElement): 0;
          var endValue = 0;
          var attribute = direction == 'left'? 'left': 
                          direction == 'right'? 'left': 
                          direction == 'top'? 'top': 
                          direction == 'bottom'? 'top': 'left';

          if (attribute == 'left')
               nextVisibleElement.style.left = _getWidth(nextVisibleElement) + "px";
          else if (attribute == 'top')
               nextVisibleElement.style.top = _getHeight(nextVisibleElement) + "px";

          var start = new State();
          start.setAttribute(attribute, startValue);

          var end = start.clone();
          end.setAttribute(attribute, endValue);

          //var a = new Animator(nextVisibleElement, start, end);
          var a = new Animator(endElementObj, start, end);
          a.setTypeOfAnimation('Slide');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put(attribute, getUnitValue(deltaUnit, attribute));
          var speedKVMap = new KeyValueMap();
          speedKVMap.setDefault('default', getUnitValue(transitionDelay, attribute));

          return new AnimatorWrapper(startElementObj, endElementObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     function PushSlideTo(direction, startElementObj, endElementObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var currentVisibleElement = getAnimatableElement(startElementObj);
          var nextVisibleElement = getAnimatableElement(endElementObj);
          nextVisibleElement.style.opacity="1.0";
          nextVisibleElement.style.visibility="visible";
          currentVisibleElement.style.zIndex = 2;
          nextVisibleElement.style.zIndex = 2;

          var startValue = 0;
          var endValue = direction == 'left'? 0 - _getWidth(currentVisibleElement): 
                         direction == 'right'? _getWidth(currentVisibleElement): 
                         direction == 'top'? 0 - _getHeight(currentVisibleElement): 
                         direction == 'bottom'? _getHeight(currentVisibleElement): 0;
          var attribute = direction;

          if ((attribute == 'left') || (attribute == 'right'))
               nextVisibleElement.style.top = "0px";
          else if ((attribute == 'top') || (attribute == 'bottom'))
               nextVisibleElement.style.left = "0px";

          var start = new State();
          start.setAttribute(attribute, startValue);

          var end = start.clone();
          end.setAttribute(attribute, endValue);

          //var a = new Animator(currentVisibleElement, start, end);
          var a = new Animator(startElementObj, start, end);
          a.setTypeOfAnimation('PushSlide');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put(attribute, getUnitValue(deltaUnit, attribute));
          var speedKVMap = new KeyValueMap();
          speedKVMap.setDefault('default', getUnitValue(transitionDelay, attribute));

          return new AnimatorWrapper(startElementObj, endElementObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     function CollapseToMiddleVerticalLine(startElementObj, endElementObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var currentVisibleElement = getAnimatableElement(startElementObj);
          var nextVisibleElement = getAnimatableElement(endElementObj);
          nextVisibleElement.style.opacity="1.0";
          nextVisibleElement.style.visibility="visible";
          currentVisibleElement.style.zIndex = 2;
          nextVisibleElement.style.zIndex = 1;

          var start = new State();
          start.setAttribute('left', 0);
          start.setAttribute('width', _getWidth(currentVisibleElement));

          var end = start.clone();
          end.setAttribute('left', _getWidth(currentVisibleElement)/2);
          //end.setAttribute('width', 0);

          //var a = new Animator(currentVisibleElement, start, end);
          var a = new Animator(startElementObj, start, end);
          //a.setAnimateAttributesAsGroup(true);
          a.setTypeOfAnimation('CollapseToMiddleVerticalLine');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put('left', getUnitValue(deltaUnit, 'left'));
          //deltaKVMap.put('width', deltaKVMap.get('left') * 2);
          var speedKVMap = new KeyValueMap();
          /* speedKVMap.setDefault('left', 0);
          speedKVMap.setDefault('width', getUnitValue(transitionDelay, 'width')); */
          speedKVMap.setDefault('default', getUnitValue(transitionDelay, 'left'));

          return new AnimatorWrapper(startElementObj, endElementObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     function CollapseToMiddleHorizontalLine(startElementObj, endElementObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var currentVisibleElement = getAnimatableElement(startElementObj);
          var nextVisibleElement = getAnimatableElement(endElementObj);
          nextVisibleElement.style.opacity="1.0";
          nextVisibleElement.style.visibility="visible";
          currentVisibleElement.style.zIndex = 2;
          nextVisibleElement.style.zIndex = 1;

          var start = new State();
          start.setAttribute('top', 0);
          start.setAttribute('height', _getHeight(currentVisibleElement));

          var end = start.clone();
          end.setAttribute('top', _getHeight(currentVisibleElement)/2);
          //end.setAttribute('height', 0);

          //var a = new Animator(currentVisibleElement, start, end);
          var a = new Animator(startElementObj, start, end);
          a.setTypeOfAnimation('CollapseToMiddleHorizontalLine');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put('top', getUnitValue(deltaUnit, 'top'));
          //deltaKVMap.put('height', deltaKVMap.get('top') * 2);
          var speedKVMap = new KeyValueMap();
          speedKVMap.setDefault('default', getUnitValue(transitionDelay, 'top'));

          return new AnimatorWrapper(startElementObj, endElementObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     function CollapseToCenter(startElementObj, endElementObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var currentVisibleElement = getAnimatableElement(startElementObj);
          var nextVisibleElement = getAnimatableElement(endElementObj);
          nextVisibleElement.style.opacity="1.0";
          nextVisibleElement.style.visibility="visible";
          currentVisibleElement.style.zIndex = 2;
          nextVisibleElement.style.zIndex = 1;

          var start = new State();
          start.setAttribute('left', 0);
          start.setAttribute('top', 0);
          start.setAttribute('width', _getWidth(currentVisibleElement));
          start.setAttribute('height', _getHeight(currentVisibleElement));

          var end = start.clone();
          end.setAttribute('left', _getWidth(currentVisibleElement)/2);
          end.setAttribute('top', _getHeight(currentVisibleElement)/2);
          end.setAttribute('width', 0);
          end.setAttribute('height', 0);

          //var a = new Animator(currentVisibleElement, start, end);
          var a = new Animator(startElementObj, start, end);
          a.setAnimateAttributesAsGroup(true);
          a.setTypeOfAnimation('CollapseToCenter');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put('left', getUnitValue(deltaUnit, 'left'));
          deltaKVMap.put('top', getUnitValue(deltaUnit, 'top'));
          deltaKVMap.put('width', deltaKVMap.get('left') * 2);
          deltaKVMap.put('height', deltaKVMap.get('top') * 2);
          var speedKVMap = new KeyValueMap();
          speedKVMap.setDefault('left', 0);
          speedKVMap.setDefault('top', 0);
          speedKVMap.setDefault('width', 0);
          speedKVMap.setDefault('height', getUnitValue(transitionDelay, 'height'));

          return new AnimatorWrapper(startElementObj, endElementObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     function EmergeFromCenter(startElementObj, endElementObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var currentVisibleElement = getAnimatableElement(startElementObj);
          var nextVisibleElement = getAnimatableElement(endElementObj);
          nextVisibleElement.style.opacity="1.0";
          nextVisibleElement.style.visibility="visible";
          currentVisibleElement.style.zIndex = 1;
          nextVisibleElement.style.zIndex = 2;

          var start = new State();
          start.setAttribute('left', _getWidth(currentVisibleElement)/2);
          start.setAttribute('top', _getHeight(currentVisibleElement)/2);
          start.setAttribute('width', 0);
          start.setAttribute('height', 0);

          var end = start.clone();
          end.setAttribute('left', 0);
          end.setAttribute('top', 0);
          end.setAttribute('width', _getWidth(currentVisibleElement));
          end.setAttribute('height', _getHeight(currentVisibleElement));

          //var a = new Animator(nextVisibleElement, start, end);
          var a = new Animator(endElementObj, start, end);
          a.setAnimateAttributesAsGroup(true);
          a.setTypeOfAnimation('EmergeFromCenter');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put('left', getUnitValue(deltaUnit, 'left'));
          deltaKVMap.put('top', getUnitValue(deltaUnit, 'top'));
          deltaKVMap.put('width', deltaKVMap.get('left') * 2);
          deltaKVMap.put('height', deltaKVMap.get('top') * 2);
          var speedKVMap = new KeyValueMap();
          speedKVMap.setDefault('left', 0);
          speedKVMap.setDefault('top', 0);
          speedKVMap.setDefault('width', 0);
          speedKVMap.setDefault('height', getUnitValue(transitionDelay, 'height'));

          return new AnimatorWrapper(startElementObj, endElementObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     //private
     function _getWidth(elem)
     {
          if (!elem)
               return 0;
          if (_isImgElement(elem))
          {
               return elem.width;
          }
          return elem.offsetWidth;
     };

     //private
     function _getHeight(elem)
     {
          if (!elem)
               return 0;
          if (_isImgElement(elem))
          {
               return elem.height;
          }
          return elem.offsetHeight;
     };

     //private
     function _setWidth(elem, width)
     {
          if (!elem)
               return;
          if (_isImgElement(elem))
          {
               elem.width = width;
          }
          else
          {
               elem.style.width = width + "px";
          }
     };

     //private
     function _setHeight(elem, height)
     {
          if (!elem)
               return;
          if (_isImgElement(elem))
          {
               elem.height = height;
          }
          else
          {
               elem.style.height = height + "px";
          }
     };

     //private
     function _isImgElement(elem)
     {
          return elem instanceof Image || elem instanceof HTMLImageElement;
     };

     //private
     function _applyStateToSource(typeOfAnimationBeingPlayed, sourceObj, state, attribute, isAttributeTransitionComplete, animatorWrapper)
     {
          var startElement = getAnimatableElement(animatorWrapper.startElementObj);
          var endElement = getAnimatableElement(animatorWrapper.endElementObj);

          var source = getAnimatableElement(sourceObj);

          var _attrib = attribute;
          if (attribute == 'opacity')
          {
               source.style[_attrib] = state.getAttributeValue(attribute);
               source.style.filter = "'alpha(opacity=" + (state.getAttributeValue(attribute) * 100) + ")'";

               endElement.style.opacity = 1 - state.getAttributeValue(attribute);
          }
          else if ((attribute == 'left') || (attribute == 'right') || (attribute == 'top') || (attribute == 'bottom'))
          {
               _attrib = attribute == 'left'? 'left': 
                         attribute == 'right'? 'left': 
                         attribute == 'top'? 'top': 
                         attribute == 'bottom'? 'top': 'left';
               source.style[_attrib] = state.getAttributeValue(attribute) + "px";
               if (typeOfAnimationBeingPlayed == 'CollapseToMiddleVerticalLine')
               {
                    var horizontal_bw = 0;
                    if (!_isImgElement(source))
                    {
                         //we would do border width calculations only for non image elements as borders with image element doesn't distort the offsetWidth and offsetHeight calculations.
                         var sbw = GetBorderWidth(source);
                         horizontal_bw = sbw.left + sbw.right;
                         horizontal_bw = isNaN(horizontal_bw)? 0: horizontal_bw;
                    }
                    _setWidth(source, Math.max(_getWidth(source) - (animatorWrapper.deltaKVMap.get('left') * 2) - horizontal_bw, 0));
                    //_setWidth(source, Math.max(_getWidth(source) - 6, 0));
               }
               else if (typeOfAnimationBeingPlayed == 'CollapseToMiddleHorizontalLine')
               {
                    var vertical_bw = 0;
                    if (!_isImgElement(source))
                    {
                         //we would do border width calculations only for non image elements as borders with image element doesn't distort the offsetWidth and offsetHeight calculations.
                         var sbw = GetBorderWidth(source);
                         vertical_bw = sbw.top + sbw.bottom;
                         vertical_bw = isNaN(vertical_bw)? 0: vertical_bw;
                    }
                    _setHeight(source, Math.max(_getHeight(source) - (animatorWrapper.deltaKVMap.get('top') * 2) - vertical_bw, 0));
               }
               else if (typeOfAnimationBeingPlayed == 'PushSlide')
               {
                    var nextVisibleElement = endElement;
                    var startOfNextElement = attribute == 'left'? _getWidth(nextVisibleElement): 
                                             attribute == 'right'? 0 - _getWidth(nextVisibleElement): 
                                             attribute == 'top'? _getHeight(nextVisibleElement): 
                                             attribute == 'bottom'? 0 - _getHeight(nextVisibleElement): 0;
               
                    nextVisibleElement.style[_attrib] = (startOfNextElement + state.getAttributeValue(attribute)) + "px";
               }
          }
          /*else if ((attribute == 'width' || attribute == 'height') && 
                   (typeOfAnimationBeingPlayed == 'CollapseToMiddleVerticalLine' || typeOfAnimationBeingPlayed == 'CollapseToCenter' || typeOfAnimationBeingPlayed == 'EmergeFromCenter'))
               source[attribute] = state.getAttributeValue(attribute);*/
          else if (attribute == 'width')
               _setWidth(source, state.getAttributeValue(attribute));
          else if (attribute == 'height')
               _setHeight(source, state.getAttributeValue(attribute));
          else
               source.style[_attrib] = state.getAttributeValue(attribute) + "px";

          if (animatorWrapper.onApplyStateToSourceCallback_PostProcessing)
          {
               //primary state has already been applied to the animatable object. Invoke the post callback for any additional processing by client.
               animatorWrapper.onApplyStateToSourceCallback_PostProcessing.call(this, typeOfAnimationBeingPlayed, sourceObj, state, attribute, isAttributeTransitionComplete);
          }
     };

     //private
     function _onComplete(animatorWrapper)
     {
          var animator = animatorWrapper.animator;
          var startElement = getAnimatableElement(animatorWrapper.startElementObj);
          var endElement = getAnimatableElement(animatorWrapper.endElementObj);
          var onCompleteClientCallback = animatorWrapper.onCompleteCallback;

          if (animator.getTypeOfAnimation() == 'Fade')
          {
               startElement.style.visibility = "hidden";
          }
          else if (animator.getTypeOfAnimation() == 'Slide')
          {
               startElement.style.visibility = "hidden";
          }
          else if (animator.getTypeOfAnimation() == 'PushSlide')
          {
               startElement.style.visibility = "hidden";     //let's hide the element which has scrolled out of the view.
               startElement.style.left = "0px";     //let's reset the left offset of the element so that other animation types are not adversely affected when executed in future.
               startElement.style.top = "0px";     //let's reset the top offset of the element so that other animation types are not adversely affected when executed in future.
          }
          else if (animator.getTypeOfAnimation() == 'CollapseToMiddleVerticalLine')
          {
               startElement.style.visibility = "hidden";
               _setWidth(startElement, animator.getStartState().getAttributeValue('width'));     //restore the width so that other animation types are not adversely affected when started in future.
               startElement.style.left = "0px";     //restore the left so that other animation types are not adversely affected when started in future.
          }
          else if (animator.getTypeOfAnimation() == 'CollapseToMiddleHorizontalLine')
          {
               startElement.style.visibility = "hidden";
               _setHeight(startElement, animator.getStartState().getAttributeValue('height'));     //restore the height so that other animation types are not adversely affected when started in future.
               startElement.style.top = "0px";     //restore the top so that other animation types are not adversely affected when started in future.
          }
          else if (animator.getTypeOfAnimation() == 'CollapseToCenter')
          {
               startElement.style.visibility = "hidden";
               _setWidth(startElement, animator.getStartState().getAttributeValue('width'));     //restore the width so that other animation types are not adversely affected when started in future.
               _setHeight(startElement, animator.getStartState().getAttributeValue('height'));     //restore the height so that other animation types are not adversely affected when started in future.
               startElement.style.left = "0px";     //restore the left so that other animation types are not adversely affected when started in future.
               startElement.style.top = "0px";     //restore the top so that other animation types are not adversely affected when started in future.
          }
          else if (animator.getTypeOfAnimation() == 'EmergeFromCenter')
          {
               startElement.style.visibility = "hidden";
          }

          if (onCompleteClientCallback)
               onCompleteClientCallback.call(this, animator);
     };

     //private
     function _onStop(animatorWrapper, stateAtStop)
     {
          var animator = animatorWrapper.animator;
          var onStopClientCallback = animatorWrapper.onStopCallback;
          if (onStopClientCallback)
               onStopClientCallback.call(this, animator, stateAtStop);
     };

     return {
          //export any public methods and variables
          FadeTransition : FadeTransition,
          SlideTo  : SlideTo,
          PushSlideTo : PushSlideTo,
          CollapseToMiddleVerticalLine : CollapseToMiddleVerticalLine,
          CollapseToMiddleHorizontalLine : CollapseToMiddleHorizontalLine,
          CollapseToCenter : CollapseToCenter,
          EmergeFromCenter : EmergeFromCenter
     };

}());