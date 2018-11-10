/*
 * ImageAnimationEffects class under util package of Bracket Javascript Library.
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
NS_BKTJSLIB1dot0_Util.ImageAnimationEffects = NS_BKTJSLIB1dot0_Util.ImageAnimationEffects || (function() {

     //shorthand names of the external classes used inside this class.
     var KeyValueMap = NS_BKTJSLIB1dot0_Collections.KeyValueMap.instance;
     var Animator = NS_BKTJSLIB1dot0_Util.Animator.instance;
     var State = NS_BKTJSLIB1dot0_Util.Animator.State;
     var SourceWrapper = NS_BKTJSLIB1dot0_Util.Animator.SourceWrapper;

     function AnimatorWrapper(startImgObj, endImgObj, animator, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          this.startImgObj = startImgObj;
          this.endImgObj = endImgObj;
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

     var getAnimatableElement = function(imgObj)
     {
          if (imgObj instanceof SourceWrapper)
               return imgObj.getAnimatableElement();
          return imgObj;
     };

     function FadeTransition(startImgObj, endImgObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var startImg = getAnimatableElement(startImgObj);
          var endImg = getAnimatableElement(endImgObj);

          startImg.style.zIndex = 2;
          endImg.style.zIndex = 1;
          endImg.style.opacity = 0.0;
          endImg.style.visibility = "visible";

          var start = new State();
          start.setAttribute('opacity', 1.0);

          var end = start.clone();
          end.setAttribute('opacity', 0.0);

          //var a = new Animator(startImg, start, end);
          var a = new Animator(startImgObj, start, end);
          a.setTypeOfAnimation('Fade');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put('opacity', getUnitValue(deltaUnit, 'opacity'));
          var speedKVMap = new KeyValueMap();
          speedKVMap.setDefault('default', getUnitValue(transitionDelay, 'opacity'));

          return new AnimatorWrapper(startImgObj, endImgObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     function SlideTo(direction, startImgObj, endImgObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var currentVisibleImage = getAnimatableElement(startImgObj);
          var nextVisibleImage = getAnimatableElement(endImgObj);
          nextVisibleImage.style.opacity="1.0";
          nextVisibleImage.style.visibility="visible";
          currentVisibleImage.style.zIndex = 1;
          nextVisibleImage.style.zIndex = 2;

          var startValue = direction == 'left'? nextVisibleImage.width: 
                           direction == 'right'? 0 - nextVisibleImage.width: 
                           direction == 'top'? nextVisibleImage.height: 
                           direction == 'bottom'? 0 - nextVisibleImage.height: 0;
          var endValue = 0;
          var attribute = direction == 'left'? 'left': 
                          direction == 'right'? 'left': 
                          direction == 'top'? 'top': 
                          direction == 'bottom'? 'top': 'left';

          if (attribute == 'left')
               nextVisibleImage.style.left = nextVisibleImage.width + "px";
          else if (attribute == 'top')
               nextVisibleImage.style.top = nextVisibleImage.height + "px";

          var start = new State();
          start.setAttribute(attribute, startValue);

          var end = start.clone();
          end.setAttribute(attribute, 0);

          //var a = new Animator(nextVisibleImage, start, end);
          var a = new Animator(endImgObj, start, end);
          a.setTypeOfAnimation('Slide');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put(attribute, getUnitValue(deltaUnit, attribute));
          var speedKVMap = new KeyValueMap();
          speedKVMap.setDefault('default', getUnitValue(transitionDelay, attribute));

          return new AnimatorWrapper(startImgObj, endImgObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     function PushSlideTo(direction, startImgObj, endImgObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var currentVisibleImage = getAnimatableElement(startImgObj);
          var nextVisibleImage = getAnimatableElement(endImgObj);
          nextVisibleImage.style.opacity="1.0";
          nextVisibleImage.style.visibility="visible";
          currentVisibleImage.style.zIndex = 2;
          nextVisibleImage.style.zIndex = 2;

          var startValue = 0;
          var endValue = direction == 'left'? 0 - currentVisibleImage.width: 
                         direction == 'right'? currentVisibleImage.width: 
                         direction == 'top'? 0 - currentVisibleImage.height: 
                         direction == 'bottom'? currentVisibleImage.height: 0;
          var attribute = direction;

          if ((attribute == 'left') || (attribute == 'right'))
               nextVisibleImage.style.top = "0px";
          else if ((attribute == 'top') || (attribute == 'bottom'))
               nextVisibleImage.style.left = "0px";

          var start = new State();
          start.setAttribute(attribute, startValue);

          var end = start.clone();
          end.setAttribute(attribute, endValue);

          //var a = new Animator(currentVisibleImage, start, end);
          var a = new Animator(startImgObj, start, end);
          a.setTypeOfAnimation('PushSlide');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put(attribute, getUnitValue(deltaUnit, attribute));
          var speedKVMap = new KeyValueMap();
          speedKVMap.setDefault('default', getUnitValue(transitionDelay, attribute));

          return new AnimatorWrapper(startImgObj, endImgObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     function CollapseToMiddleVerticalLine(startImgObj, endImgObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var currentVisibleImage = getAnimatableElement(startImgObj);
          var nextVisibleImage = getAnimatableElement(endImgObj);
          nextVisibleImage.style.opacity="1.0";
          nextVisibleImage.style.visibility="visible";
          currentVisibleImage.style.zIndex = 2;
          nextVisibleImage.style.zIndex = 1;

          var start = new State();
          start.setAttribute('left', 0);
          start.setAttribute('width', currentVisibleImage.width);

          var end = start.clone();
          end.setAttribute('left', currentVisibleImage.width/2);
          //end.setAttribute('width', 0);

          //var a = new Animator(currentVisibleImage, start, end);
          var a = new Animator(startImgObj, start, end);
          //a.setAnimateAttributesAsGroup(true);
          a.setTypeOfAnimation('CollapseToMiddleVerticalLine');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put('left', getUnitValue(deltaUnit, 'left'));
          //deltaKVMap.put('width', deltaKVMap.get('left') * 2);
          var speedKVMap = new KeyValueMap();
          /* speedKVMap.setDefault('left', 0);
          speedKVMap.setDefault('width', getUnitValue(transitionDelay, 'width')); */
          speedKVMap.setDefault('default', getUnitValue(transitionDelay, 'left'));

          return new AnimatorWrapper(startImgObj, endImgObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     function CollapseToMiddleHorizontalLine(startImgObj, endImgObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var currentVisibleImage = getAnimatableElement(startImgObj);
          var nextVisibleImage = getAnimatableElement(endImgObj);
          nextVisibleImage.style.opacity="1.0";
          nextVisibleImage.style.visibility="visible";
          currentVisibleImage.style.zIndex = 2;
          nextVisibleImage.style.zIndex = 1;

          var start = new State();
          start.setAttribute('top', 0);
          start.setAttribute('height', currentVisibleImage.height);

          var end = start.clone();
          end.setAttribute('top', currentVisibleImage.height/2);
          //end.setAttribute('height', 0);

          //var a = new Animator(currentVisibleImage, start, end);
          var a = new Animator(startImgObj, start, end);
          a.setTypeOfAnimation('CollapseToMiddleHorizontalLine');
          var deltaKVMap = new KeyValueMap();
          deltaKVMap.put('top', getUnitValue(deltaUnit, 'top'));
          //deltaKVMap.put('height', deltaKVMap.get('top') * 2);
          var speedKVMap = new KeyValueMap();
          speedKVMap.setDefault('default', getUnitValue(transitionDelay, 'top'));

          return new AnimatorWrapper(startImgObj, endImgObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     function CollapseToCenter(startImgObj, endImgObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var currentVisibleImage = getAnimatableElement(startImgObj);
          var nextVisibleImage = getAnimatableElement(endImgObj);
          nextVisibleImage.style.opacity="1.0";
          nextVisibleImage.style.visibility="visible";
          currentVisibleImage.style.zIndex = 2;
          nextVisibleImage.style.zIndex = 1;

          var start = new State();
          start.setAttribute('left', 0);
          start.setAttribute('top', 0);
          start.setAttribute('width', currentVisibleImage.width);
          start.setAttribute('height', currentVisibleImage.height);

          var end = start.clone();
          end.setAttribute('left', currentVisibleImage.width/2);
          end.setAttribute('top', currentVisibleImage.height/2);
          end.setAttribute('width', 0);
          end.setAttribute('height', 0);

          //var a = new Animator(currentVisibleImage, start, end);
          var a = new Animator(startImgObj, start, end);
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

          return new AnimatorWrapper(startImgObj, endImgObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     function EmergeFromCenter(startImgObj, endImgObj, deltaUnit, transitionDelay, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing)
     {
          var currentVisibleImage = getAnimatableElement(startImgObj);
          var nextVisibleImage = getAnimatableElement(endImgObj);
          nextVisibleImage.style.opacity="1.0";
          nextVisibleImage.style.visibility="visible";
          currentVisibleImage.style.zIndex = 1;
          nextVisibleImage.style.zIndex = 2;

          var start = new State();
          start.setAttribute('left', currentVisibleImage.width/2);
          start.setAttribute('top', currentVisibleImage.height/2);
          start.setAttribute('width', 0);
          start.setAttribute('height', 0);

          var end = start.clone();
          end.setAttribute('left', 0);
          end.setAttribute('top', 0);
          end.setAttribute('width', currentVisibleImage.width);
          end.setAttribute('height', currentVisibleImage.height);

          //var a = new Animator(nextVisibleImage, start, end);
          var a = new Animator(endImgObj, start, end);
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

          return new AnimatorWrapper(startImgObj, endImgObj, a, deltaKVMap, speedKVMap, onCompleteCallback, onStopCallback, onApplyStateToSourceCallback_PostProcessing);
     };

     //private
     function _applyStateToSource(typeOfAnimationBeingPlayed, sourceObj, state, attribute, isAttributeTransitionComplete, animatorWrapper)
     {
          var startImg = getAnimatableElement(animatorWrapper.startImgObj);
          var endImg = getAnimatableElement(animatorWrapper.endImgObj);

          var source = getAnimatableElement(sourceObj);

          var _attrib = attribute;
          if (attribute == 'opacity')
          {
               source.style[_attrib] = state.getAttributeValue(attribute);
               source.style.filter = "'alpha(opacity=" + (state.getAttributeValue(attribute) * 100) + ")'";

               endImg.style.opacity = 1 - state.getAttributeValue(attribute);
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
                    source.width = Math.max(source.width - (animatorWrapper.deltaKVMap.get('left') * 2), 0);
                    //source.width = Math.max(source.width - 6, 0);
               }
               else if (typeOfAnimationBeingPlayed == 'CollapseToMiddleHorizontalLine')
               {
                    source.height = Math.max(source.height - (animatorWrapper.deltaKVMap.get('top') * 2), 0);
               }
               else if (typeOfAnimationBeingPlayed == 'PushSlide')
               {
                    var nextVisibleImage = endImg;
                    var startOfNextImage = attribute == 'left'? nextVisibleImage.width: 
                                           attribute == 'right'? 0 - nextVisibleImage.width: 
                                           attribute == 'top'? nextVisibleImage.height: 
                                           attribute == 'bottom'? 0 - nextVisibleImage.height: 0;
               
                    nextVisibleImage.style[_attrib] = (startOfNextImage + state.getAttributeValue(attribute)) + "px";
               }
          }
          /* else if ((attribute == 'width' || attribute == 'height') && 
                   (typeOfAnimationBeingPlayed == 'CollapseToMiddleVerticalLine' || typeOfAnimationBeingPlayed == 'CollapseToCenter' || typeOfAnimationBeingPlayed == 'EmergeFromCenter'))
               source[attribute] = state.getAttributeValue(attribute); */
          else if (attribute == 'width' || attribute == 'height')
               source[attribute] = state.getAttributeValue(attribute);
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
          var startImg = getAnimatableElement(animatorWrapper.startImgObj);
          var endImg = getAnimatableElement(animatorWrapper.endImgObj);
          var onCompleteClientCallback = animatorWrapper.onCompleteCallback;

          if (animator.getTypeOfAnimation() == 'Fade')
          {
               startImg.style.visibility = "hidden";
          }
          else if (animator.getTypeOfAnimation() == 'Slide')
          {
               startImg.style.visibility = "hidden";
          }
          else if (animator.getTypeOfAnimation() == 'PushSlide')
          {
               startImg.style.visibility = "hidden";     //let's hide the image which has scrolled out of the view.
               startImg.style.left = "0px";     //let's reset the left offset of the image so that other animation types are not adversely affected when executed in future.
               startImg.style.top = "0px";     //let's reset the top offset of the image so that other animation types are not adversely affected when executed in future.
          }
          else if (animator.getTypeOfAnimation() == 'CollapseToMiddleVerticalLine')
          {
               startImg.style.visibility = "hidden";
               startImg.width = animator.getStartState().getAttributeValue('width');     //restore the width so that other animation types are not adversely affected when started in future.
               startImg.style.left = "0px";     //restore the left so that other animation types are not adversely affected when started in future.
          }
          else if (animator.getTypeOfAnimation() == 'CollapseToMiddleHorizontalLine')
          {
               startImg.style.visibility = "hidden";
               startImg.height = animator.getStartState().getAttributeValue('height');     //restore the height so that other animation types are not adversely affected when started in future.
               startImg.style.top = "0px";     //restore the top so that other animation types are not adversely affected when started in future.
          }
          else if (animator.getTypeOfAnimation() == 'CollapseToCenter')
          {
               startImg.style.visibility = "hidden";
               startImg.width = animator.getStartState().getAttributeValue('width');     //restore the width so that other animation types are not adversely affected when started in future.
               startImg.height = animator.getStartState().getAttributeValue('height');     //restore the height so that other animation types are not adversely affected when started in future.
               startImg.style.left = "0px";     //restore the left so that other animation types are not adversely affected when started in future.
               startImg.style.top = "0px";     //restore the top so that other animation types are not adversely affected when started in future.
          }
          else if (animator.getTypeOfAnimation() == 'EmergeFromCenter')
          {
               startImg.style.visibility = "hidden";
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