/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:revision
// coded: Martin Mach, 02.10.2020
// reviewed: -
//@@viewOff:revision

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import { LAYER, RenderIntoPortal } from "./internal/portal.js";
import { disableBodyScrolling, enableBodyScrolling } from "./internal/page-utils.js";
import ResizeObserver from "./resize-observer";

import "./popover.less";
//@@viewOff:imports

const PopoverContext = UU5.Common.Context.create({});

const withContext = (Component) => {
  if (!UU5.Common.Context.isSupported()) return Component;
  let forwardRef = UU5.Common.Reference.forward((props, ref) => {
    return (
      <PopoverContext.Consumer>
        {({ getPopover }) => <Component getPopover={getPopover} {...props} ref={ref} />}
      </PopoverContext.Consumer>
    );
  });

  forwardRef.isUu5PureComponent = true;
  forwardRef.displayName = `forwardRef(${Component.displayName || Component.name || "Component"})`;
  forwardRef.tagName = Component.tagName;

  return forwardRef;
};

function getStackTraceCallerRow() {
  // stack is e.g.:
  // Error: ------
  //   at getStackTraceCallerRow (popover.js:52)
  //   at Object._open (popover.js:226)
  //   at Object.open (popover.js:181)
  //   at Object._registerPopover (color-picker.js:335) <------ this is what we want
  //   ...
  let err = new Error("------");
  let stack = err.stack;
  return stack ? stack.replace(/(?:\s|\S)*?------(?:.*\r?\n){4}/, "").split("\n")[0] : "";
}

let warnedMixingControlledAndApi;
export const Popover = withContext(
  UU5.Common.VisualComponent.create({
    displayName: "Popover", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.SectionMixin,
      UU5.Common.NestingLevelMixin,
      UU5.Common.CcrWriterMixin,
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("Popover"),
      nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
      classNames: {
        main: ns.css("popover"),
        open: ns.css("popover-shown"),
        header: ns.css("popover-header"),
        body: ns.css("popover-body"),
        footer: ns.css("popover-footer"),
        top: ns.css("popover-menu-top"),
        bottom: ns.css("popover-menu-bottom"),
        left: ns.css("popover-menu-left"),
        right: ns.css("popover-menu-right"),
        removeHeight: ns.css("popover-remove-height"),
        displayed: ns.css("popover-displayed"),
      },
      defaults: {
        transitionDuration: 100,
      },
      opt: {
        nestingLevelRoot: true,
      },
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      shown: UU5.PropTypes.bool,
      forceRender: UU5.PropTypes.bool,
      fitHeightToViewport: UU5.PropTypes.bool,
      getPopover: UU5.PropTypes.func,
      hidden: UU5.Common.ElementaryMixin.propTypes.disabled,
      controlled: UU5.Common.ElementaryMixin.propTypes.controlled,
      disabled: UU5.Common.ElementaryMixin.propTypes.disabled,
      header: UU5.Common.SectionMixin.propTypes.header,
      content: UU5.Common.ContentMixin.propTypes.content,
      footer: UU5.Common.SectionMixin.propTypes.footer,
      className: UU5.Common.BaseMixin.propTypes.className,
      location: UU5.PropTypes.oneOf(["local", "portal"]),
      autoResize: UU5.PropTypes.bool,
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        shown: false,
        forceRender: false,
        fitHeightToViewport: false,
        getToolbar: undefined,
        location: undefined,
        autoResize: false,
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      this._canOpenOnMount = true;
      this._lastOpenOpts;
      this._onResize = UU5.Common.Tools.debounce(this._onResize, UU5.Environment.resizeInterval, { leading: true });
      return {
        header: null,
        content: null,
        footer: null,
        className: null,
        bodyClassName: null,
        pageX: null,
        pageY: null,
        width: null,
        maxHeight: null,
        disableBackdrop: false,
        position: {
          top: false,
          left: false,
        },
        removeHeight: this.props.hidden && !this.props.shown,
        display: false,
        autoResize: this.props.autoResize,
      };
    },

    UNSAFE_componentWillMount() {
      this.setState({ hidden: !this.props.shown });
    },

    componentDidMount() {
      // NOTE Some components call popover.open() inside of ref_ handler which means that
      // our setState performed inside of open() is batched for after mount - we don't want
      // to call this.open() ourselves here in such case
      // (but cannot detect it here using this.state.xyz because there is nothing there yet)
      // => detect it using private field this._canOpenOnMount
      if (this.props.shown && this._canOpenOnMount) {
        // NOTE We should do same logic for open() and for props.shown=true but we don't (to preserve backward compatibility)...
        if (this._getCentralPopover() || this.props.location) this._open(false);
      }
    },

    componentDidUpdate(prevProps, prevState) {
      // if opening to portal/page then hide/show scrollbars on body
      if (this.props.location === "portal" || this.state.isPagePopover) {
        if (this.state.display && !prevState.display) {
          disableBodyScrolling("popover-" + this.getId());
        } else if (!this.state.display && prevState.display) {
          enableBodyScrolling("popover-" + this.getId());
        }
      }
    },

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.controlled) {
        this.setState({
          disabled: nextProps.disabled,
          hidden: !nextProps.shown,
          display: nextProps.shown,
          removeHeight: nextProps.hidden && !nextProps.shown,
          autoResize: nextProps.autoResize,
        });
      }
    },

    componentWillUnmount() {
      this._removeEvent();
      enableBodyScrolling("popover-" + this.getId(), true);
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    open(opt, setStateCallback) {
      this._lastOpenOpts = opt;
      return this._open(true, opt, setStateCallback);
    },

    close(setStateCallback) {
      let centralPopover = this._getCentralPopover();
      if (centralPopover) {
        centralPopover.close(() => typeof setStateCallback === "function" && setStateCallback());
      } else {
        let callback = () => {
          this.setState({ removeHeight: true }, () => {
            typeof setStateCallback === "function" && setStateCallback();
          });
        };
        this._removeEvent();
        this.hide(callback);
      }

      return this;
    },

    isOpen() {
      return this._getCentralPopover() ? !this._getCentralPopover().isHidden() : !this.isHidden();
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    hide_(setStateCallback) {
      this.setState({ hidden: true, display: false }, setStateCallback);
    },
    //@@viewOff:overriding

    //@@viewOn:private
    _registerBody(ref) {
      this._body = ref;
    },

    _open(checkWrongUsage, opt, setStateCallback) {
      // check temporarily disabled because we have it wrong in:
      //   - context-menu.js, date-*-picker.js, time-picker.js, item-list.js, color-picker.js

      //       if (
      //         process.env.NODE_ENV === "development" &&
      //         checkWrongUsage &&
      //         this.props.controlled &&
      //         (this.props.shown || this.props.disabled) &&
      //         !warnedMixingControlledAndApi
      //       ) {
      //         warnedMixingControlledAndApi = true;
      //         UU5.Common.Tools
      //           .warning(`Bad usage of ${this.getTagName()} detected - props "shown" and "disabled" should not be set on JSX element if using API method popoverRef.open(). Proper usage is one of:
      // a) Use prop "controlled={false}" and method popoverRef.open(). If you need to pass prop "disabled", pass it using popoverRef.open({ disabled: true }), not as a prop in JSX element.
      // b) Use props "shown" and "onClose" (and any other) and keep the state about whether the popover is open in your component. Do not call popoverRef.open().

      // The method was called from:
      // ${getStackTraceCallerRow()}`);
      //       }

      this._canOpenOnMount = false;
      opt = opt || {};
      if (opt.event && typeof opt.event.persist === "function") opt.event.persist();

      let centralPopover = this._getCentralPopover();
      if (centralPopover) {
        opt = UU5.Common.Tools.merge({}, opt);
        opt.disabled = opt.disabled || this.state.disabled;
        opt.header = opt.header || this.props.header;
        opt.content = opt.content || this.props.content || this.props.children;
        opt.footer = opt.footer || this.props.footer;
        opt.className = opt.className || this.props.className;
        opt.bodyClassName = opt.bodyClassName || null;
        opt.headerClassName = opt.headerClassName || null;
        opt.footerClassName = opt.footerClassName || null;
        opt.fitHeightToViewport = this.props.fitHeightToViewport;
        opt.autoResize = opt.autoResize != null ? opt.autoResize : this.props.autoResize;
        opt.customPopover = this;
        if (centralPopover.isOpen()) {
          typeof centralPopover.state.onBeforeClose === "function" && centralPopover.state.onBeforeClose();
          centralPopover.close(() => {
            typeof centralPopover.state.onClose === "function" && centralPopover.state.onClose();
            centralPopover.open(opt, setStateCallback);
          });
        } else {
          centralPopover.open(opt, setStateCallback);
        }
      } else {
        let onClose = opt.onClose;
        let onBeforeClose = opt.onBeforeClose;
        let bodyClassName = opt.bodyClassName || null;
        let headerClassName = opt.headerClassName || null;
        let footerClassName = opt.footerClassName || null;
        let autoResize = opt.autoResize != null ? opt.autoResize : this.props.autoResize;
        let fitWidthToAroundElement = opt.fitWidthToAroundElement;
        let fitHeightToViewport =
          "fitHeightToViewport" in opt ? opt.fitHeightToViewport : this.props.fitHeightToViewport;

        this.setState(
          {
            disableBackdrop: !!opt.disableBackdrop,
            disabled: opt.disabled || this.state.disabled,
            header: opt.header,
            content: opt.content,
            footer: opt.footer,
            hidden: true,
            display: true,
            className: opt.className,
            bodyClassName: bodyClassName,
            headerClassName: headerClassName,
            footerClassName: footerClassName,
            pageX: 0,
            pageY: 0,
            maxHeight: null,
            removeHeight: false,
            onClose: onClose,
            onBeforeClose: onBeforeClose,
            isPagePopover: !!opt.customPopover,
            autoResize,
            width: fitWidthToAroundElement && opt.aroundElement ? this._getAroundElementWidth(opt.aroundElement) : null,
          },
          () => {
            this._addEvent(onBeforeClose, onClose, fitHeightToViewport);
            this._setPosition(opt, setStateCallback);
            // This is a workaround. Otherwise the first click outside of popover after opening it doesnt close it
            setTimeout(() => (this._stopPropagation = false));
          }
        );
      }
      return this;
    },

    _setPosition(opt, setStateCallback) {
      let { pageX, pageY, maxHeight, position } = this.state;
      let aroundElement = opt.aroundElement;
      let horizontalOnly = opt.horizontalOnly;
      let fitHeightToViewport = this.props.fitHeightToViewport || opt.fitHeightToViewport;
      let requiredPosition = opt.position;
      let offset = opt.offset || 0;
      let left = opt.pageX == null ? 0 : opt.pageX - window.pageXOffset;
      let top = opt.pageY == null ? 0 : opt.pageY - window.pageYOffset;

      if (opt.event) {
        left = left || opt.event.pageX - window.pageXOffset;
        top = top || opt.event.pageY - window.pageYOffset;
      }

      if (opt.preventPositioning) {
        pageX = 0;
        pageY = 0;
      }

      if (aroundElement) {
        if (aroundElement.findDOMNode) {
          aroundElement = aroundElement.findDOMNode();
        }
        let aroundElementRect = aroundElement.getBoundingClientRect();

        if (!opt.preventPositioning) {
          ({ pageX, pageY, maxHeight, position } = this._getPosition(
            requiredPosition,
            aroundElementRect,
            offset,
            fitHeightToViewport,
            horizontalOnly
          ));
        }

        this.setState(
          {
            hidden: false,
            display: true,
            pageX,
            pageY,
            maxHeight,
            position,
          },
          setStateCallback
        );
      } else {
        let aroundElementRect = {
          left,
          right: left,
          top,
          bottom: top,
          width: 0,
          height: 0,
        };

        if (!opt.preventPositioning) {
          ({ pageX, pageY, maxHeight, position } = this._getPosition(
            requiredPosition,
            aroundElementRect,
            offset,
            fitHeightToViewport,
            horizontalOnly
          ));
        }

        this.setState(
          {
            hidden: false,
            display: true,
            pageX,
            pageY,
            maxHeight,
            position,
          },
          setStateCallback
        );
      }
    },

    _getAroundElementWidth(aroundElement) {
      let width = null;

      if (aroundElement) {
        let element = aroundElement;
        if (UU5.Common.Element.isValid(element)) {
          element = UU5.Common.DOM.findNode(element);
        }

        if (typeof element?.nodeType === "number") {
          width = element.getBoundingClientRect().width;
        }
      }

      return width;
    },

    _getOffsetParentRect(element, relative) {
      let rect;
      if (relative) {
        let { bottom, top, left, right } = element.style;
        element.style.bottom = "0px";
        element.style.top = "0px";
        element.style.left = "0px";
        element.style.right = "0px";
        rect = element.getBoundingClientRect();
        Object.assign(element.style, { bottom, top, left, right });
      } else {
        let parent = element.offsetParent || document.body;
        rect = parent.getBoundingClientRect();
      }

      return rect;
    },

    _findScrollableElement(offsetParent) {
      let node = offsetParent;
      while (node != document.body && node != document.documentElement && node) {
        let { overflowY } = getComputedStyle(node);
        if (overflowY === "auto" || overflowY === "scroll") {
          return node;
        }
        node = node.parentNode;
      }
    },

    _getPosition(requiredPosition, aroundElementRect, offset = 0, fitHeightToViewport, horizontalOnly) {
      let element = UU5.Common.DOM.findNode(this);

      let origBodyMaxHeight = this._body?.style.maxHeight;
      let origBodyScrollTop = this._body?.scrollTop;
      if (this._body) {
        this._body.style.maxHeight = "";
      }

      let isRelative = getComputedStyle(element).position === "relative";
      let elementRect = UU5.Common.Tools.merge(element.getBoundingClientRect(), {});
      aroundElementRect = UU5.Common.Tools.merge(aroundElementRect, {});
      let availableAreaRect;

      if (this._body) {
        this._body.style.maxHeight = origBodyMaxHeight;
        this._body.scrollTop = origBodyScrollTop;
      }

      if (isRelative) {
        availableAreaRect = {
          top: document.body.getBoundingClientRect().top,
          height: (document.scrollingElement || document.body).scrollHeight,
        };
        availableAreaRect.bottom = availableAreaRect.top + availableAreaRect.height;
      } else {
        let scrollableElement = this._findScrollableElement(element.offsetParent);
        if (scrollableElement) {
          availableAreaRect = scrollableElement.getBoundingClientRect();
        } else {
          availableAreaRect = { top: 0, bottom: window.innerHeight, height: window.innerHeight };
          // Limit available space between Page's Top and Bottom elements
          if (!this._isCentralPopover()) {
            availableAreaRect.top += this._getTopPageVisibility();
            availableAreaRect.bottom -= this._getBottomPageVisibility();
            availableAreaRect.height -= this._getTopPageVisibility() + this._getBottomPageVisibility();
          }
        }
      }

      let parentOffset = {};
      let parentRect = this._getOffsetParentRect(element, isRelative);
      let parentWidth = document.documentElement.clientWidth || window.innerWidth;
      parentOffset.bottom = parentRect.bottom;
      parentOffset.top = parentRect.top;
      parentOffset.left = parentRect.left;
      parentOffset.right = parentRect.right;

      let pageX = aroundElementRect.left;
      let pageY = aroundElementRect.top + aroundElementRect.height + offset;
      let maxHeight = null;
      let result = {};

      let availableTop, availableBottom, availableLeft, availableRight;

      if (/^(left|right)/.test(requiredPosition)) {
        availableTop = aroundElementRect.bottom - availableAreaRect.top;
        availableBottom = availableAreaRect.bottom - aroundElementRect.top;
        availableLeft = aroundElementRect.left;
        availableRight = parentWidth - aroundElementRect.left - aroundElementRect.width;

        if (availableTop >= elementRect.height) {
          pageY = aroundElementRect.top + aroundElementRect.height - elementRect.height;
          result.top = pageY;
        }

        if (availableBottom >= elementRect.height) {
          pageY = aroundElementRect.top;
          result.bottom = pageY;
        }

        if (availableLeft >= elementRect.width + offset) {
          pageX = aroundElementRect.left - (elementRect.width + offset);
          result.left = pageX;
        }

        if (availableRight >= elementRect.width + offset) {
          pageX = aroundElementRect.left + aroundElementRect.width + offset;
          result.right = pageX;
        }

        if (result.top === undefined && result.bottom === undefined) {
          if (availableAreaRect.height >= elementRect.height) {
            result.bottom = availableAreaRect.bottom - elementRect.height;
            result.top = 0 + availableAreaRect.top;
          }
        }

        if (result.left === undefined && result.right === undefined) {
          if (result.top) {
            result.top -= aroundElementRect.height + offset;
          }

          if (result.bottom) {
            result.bottom += aroundElementRect.height + offset;
          }
        }
      } else {
        availableTop = aroundElementRect.top - availableAreaRect.top;
        availableBottom = availableAreaRect.bottom - aroundElementRect.bottom;
        availableLeft = parentWidth - aroundElementRect.left;
        availableRight = aroundElementRect.left + aroundElementRect.width;

        if (availableTop >= elementRect.height + offset) {
          pageY = aroundElementRect.top - (elementRect.height + offset);
          result.top = pageY;
        }

        if (availableBottom >= elementRect.height + offset) {
          pageY = aroundElementRect.top + aroundElementRect.height + offset;
          result.bottom = pageY;
        }

        if (availableLeft >= elementRect.width) {
          pageX = aroundElementRect.left;
          result.left = pageX;
        }

        if (availableRight >= elementRect.width) {
          pageX = aroundElementRect.left + aroundElementRect.width - elementRect.width;
          result.right = pageX;
        }

        if (result.top === undefined && result.bottom === undefined && fitHeightToViewport) {
          if (availableTop > availableBottom) {
            maxHeight = availableTop - offset - 8;
            pageY = aroundElementRect.top - (elementRect.height + offset) + (elementRect.height - maxHeight) + 8;
            result.top = pageY - 8;
          } else {
            maxHeight = availableBottom - offset - 8;
            pageY = aroundElementRect.top + aroundElementRect.height + offset;
            result.bottom = pageY;
          }
        }
      }

      // adjust X position if no ideal position was found
      if (result.left === undefined && result.right === undefined) {
        result.right = parentWidth - elementRect.width - 8;
        result.left = parentWidth - elementRect.width - 8;
      }

      // adjust Y position if no ideal position was found
      if (result.top === undefined && result.bottom === undefined) {
        result.top = 8;
        result.bottom = availableAreaRect.bottom - elementRect.height - 8;
      }

      pageX -= parentOffset.left;
      pageY -= parentOffset.top;

      result.top !== undefined ? (result.top -= parentOffset.top) : null;
      result.bottom !== undefined ? (result.bottom -= parentOffset.top) : null;
      result.left !== undefined ? (result.left -= parentOffset.left) : null;
      result.right !== undefined ? (result.right -= parentOffset.left) : null;

      let parsedPosition = this._parsePosition(requiredPosition);
      let newPageX,
        position = {};
      if (parsedPosition.left) {
        if (result.left !== undefined) {
          newPageX = result.left;
          position.left = true;
        } else if (result.right !== undefined) {
          newPageX = result.right;
          position.left = false;
        }
      } else {
        if (result.right !== undefined) {
          newPageX = result.right;
          position.left = false;
        } else if (result.left !== undefined) {
          newPageX = result.left;
          position.left = true;
        }
      }

      pageX = newPageX === undefined ? pageX : newPageX;

      let newPageY;
      if (parsedPosition.top) {
        if (result.top !== undefined) {
          newPageY = result.top;
          position.top = true;
        } else if (result.bottom !== undefined) {
          newPageY = result.bottom;
          position.top = false;
        }
      } else {
        if (result.bottom !== undefined) {
          newPageY = result.bottom;
          position.top = false;
        } else if (result.top !== undefined) {
          newPageY = result.top;
          position.top = true;
        }
      }

      pageY = horizontalOnly ? undefined : newPageY === undefined ? pageY : newPageY;

      return { pageX, pageY, maxHeight, position };
    },

    _parsePosition(positionStr) {
      let positionArr = (positionStr || "bottom").toLowerCase();
      let position = {
        top: positionArr.indexOf("top") > -1,
        bottom: positionArr.indexOf("bottom") > -1,
        left: positionArr.indexOf("left") > -1,
        right: positionArr.indexOf("right") > -1,
      };

      !position.top && !position.bottom && (position.bottom = true);
      !position.left && !position.right && (position.left = true);

      return position;
    },

    _onResize() {
      if (this.isOpen()) {
        this._setPosition(this._lastOpenOpts);
      }
    },

    _getTopPageVisibility() {
      let result = 0;
      let element = document.getElementsByClassName("uu5-bricks-page-top")[0];
      if (element) {
        let rect = element.getBoundingClientRect();
        let top = rect.height + rect.top;
        if (top > 0) {
          result = top;
        }
      }

      return result;
    },

    _getBottomPageVisibility() {
      let result = 0;
      let element = document.getElementsByClassName("uu5-bricks-page-bottom")[0];
      if (element) {
        let rect = element.getBoundingClientRect();
        let top = window.innerHeight - rect.top;
        if (top > 0) {
          result = top;
        }
      }
      return result;
    },

    _isCentralPopover() {
      let result = false;
      if (!this.props.location && !this.props.forceRender && typeof this.props.getPopover === "function") {
        let centralPopover = this.props.getPopover();
        if (centralPopover && centralPopover.getId() === this.getId()) result = true;
      }
      return result;
    },

    _getCentralPopover() {
      // NOTE The method is expected to return central popover but not if it is the same instance as this.
      let result = null;
      if (!this.props.location && !this.props.forceRender && typeof this.props.getPopover === "function") {
        let centralPopover = this.props.getPopover();
        if (centralPopover && centralPopover.getId() !== this.getId()) result = centralPopover;
      }
      return result;
    },

    _findTarget(item) {
      let result = false;
      let id = this.getId();

      if (item.id === id) {
        result = true;
      } else if (item.parentElement) {
        result = this._findTarget(item.parentElement);
      }

      return result;
    },

    _addEvent(onBeforeClose, onClose, resize) {
      this._stopPropagation = true;

      if (this._closeListener) this._removeEvent();
      if (!this.state.disableBackdrop && !this.props.disableBackdrop) {
        this._closeListener = (e) => {
          let isPopover = this._findTarget(e.target);
          let looksLikeSelect = e.type === "click" && this._lastMouseDownTarget !== e.target;

          if (!this._stopPropagation && !isPopover && !this.isHidden() && !looksLikeSelect) {
            if (typeof onBeforeClose === "function") {
              onBeforeClose();
            }
            this.close(onClose);
          } else {
            this._stopPropagation = false;
          }
        };

        window.addEventListener("click", this._closeListener);
        window.addEventListener("contextmenu", this._closeListener);
        if (resize) window.addEventListener("resize", this._onResize);

        window.addEventListener("mousedown", this._onMouseDown);
      }
    },

    _removeEvent() {
      if (this._closeListener) {
        window.removeEventListener("click", this._closeListener);
        window.removeEventListener("contextmenu", this._closeListener);
        window.removeEventListener("resize", this._onResize);
        window.removeEventListener("mousedown", this._onMouseDown);
        this._closeListener = null;
      }
    },

    _onMouseDown(e) {
      this._lastMouseDownTarget = e.target;
    },

    _getMainAttrs() {
      let props = this.getMainAttrs();

      props.id = this.getId();

      this.isOpen() && (props.className += " " + this.getClassName().open);
      props.className += this.state.position.top ? " " + this.getClassName("top") : " " + this.getClassName("bottom");
      props.className += this.state.position.left ? " " + this.getClassName("left") : " " + this.getClassName("right");
      props.className += this.state.removeHeight ? " " + this.getClassName("removeHeight") : "";
      props.className += this.state.display ? " " + this.getClassName("displayed") : "";
      this.state.className && (props.className += ` ${this.state.className}`);

      props.style = props.style || {};
      if (this.state.pageX !== null) {
        props.style.left = this.state.pageX;
        props.style.top = this.state.pageY;
      }

      props.style.width = this.state.width;

      return props;
    },

    _getHeader() {
      let header = this.state.header || this.getHeader();
      if (header) {
        let className = this.getClassName().header;
        if (this.state.headerClassName) {
          className += " " + this.state.headerClassName;
        }
        header = (
          <div className={className} key="header">
            {header}
          </div>
        );
      }
      return header;
    },

    _getFooter() {
      let footer = this.state.footer || this.getFooter();
      if (footer) {
        let className = this.getClassName().footer;
        if (this.state.footerClassName) {
          className += " " + this.state.footerClassName;
        }
        footer = (
          <div className={className} key="footer">
            {footer}
          </div>
        );
      }
      return footer;
    },

    _getBody() {
      let children = this.buildChildren({
        content: this.state.content || this.props.content,
        children: this.props.children,
      });
      if (children) {
        let props = { ref: this._registerBody };
        if (this.state.maxHeight) {
          props.style = { maxHeight: this.state.maxHeight, overflowY: "auto" };
        }
        props.className = this.getClassName().body;
        if (this.state.bodyClassName) {
          props.className += " " + this.state.bodyClassName;
        }
        props.key = "children";
        children = <div {...props}>{children}</div>;
      }
      return children;
    },

    //@@viewOff:private

    //@@viewOn:render
    render() {
      let result;
      let centralPopover = this._getCentralPopover();
      if (!centralPopover) {
        let { location } = this.props;
        result = (
          <div {...this._getMainAttrs()}>
            {this._getHeader()}
            {this._getBody()}
            {this._getFooter()}
            {this.getDisabledCover()}
            {this.state.autoResize && this.isOpen() ? <ResizeObserver onResize={this._onResize} /> : null}
          </div>
        );
        if (location === "portal") {
          result =
            this.state.display || this.isOpen() ? (
              <RenderIntoPortal layer={LAYER.POPOVER}>{result}</RenderIntoPortal>
            ) : null;
        }
      } else {
        result = null;
      }
      return result;
    },
    //@@viewOff:render
  })
);

Popover.Context = { Provider: PopoverContext.Provider };

export default Popover;
