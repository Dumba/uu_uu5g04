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
// coded: Martin Mach, 04.10.2020
// reviewed: -
//@@viewOff:revision

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./forms-ns.js";
import TextInputMixin from "./mixins/text-input-mixin.js";
import ItemsInput from "./internal/items-input.js";
import TextInput from "./internal/text-input.js";
import Label from "./internal/label.js";
import Time from "./time.js";
import Context from "./form-context.js";
import DateTools, { UNSPECIFIED_FROM, UNSPECIFIED_TO, UNSPECIFIED_CHAR } from "./internal/date-tools.js";
import withUserPreferences from "../common/user-preferences";
import Css from "./internal/css";

import "./calendar.less";
import "./date-time-range-picker.less";
//@@viewOff:imports

const TIME_FORMAT_AM = "AM";
const TIME_FORMAT_PM = "PM";
const TIME_FORMAT_12 = "12";
const TIME_FORMAT_24 = "24";

let DateTimeRangePicker = Context.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "DateTimeRangePicker", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.ScreenSizeMixin,
      UU5.Common.ContentMixin,
      TextInputMixin,
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("DateTimeRangePicker"),
      classNames: {
        main: ns.css("datetimerangepicker"),
        open: ns.css("datetimerangepicker-open"),
        menu: ns.css("input-menu"),
        leftCalendar: ns.css("datetimerangepicker-calendar-left"),
        rightCalendar: ns.css("datetimerangepicker-calendar-right"),
        multiMonth: ns.css("datetimerangepicker-multi-month-selection"),
        screenSizeBehaviour: ns.css("screen-size-behaviour"),
        mainInput: ns.css("datetimerangepicker-main-input"),
        inputContentWrapper: ns.css("datetimerangepicker-input-content-wrapper"),
        inputText: ns.css("datetimerangepicker-input-text"),
        inputValue: ns.css("datetimerangepicker-input-value"),
        inputFrom: ns.css("datetimerangepicker-from-input"),
        inputTo: ns.css("datetimerangepicker-to-input"),
        inputActive: ns.css("input-active"),
        inputWrapper: ns.css("datetimerangepicker-input-wrapper"),
        calendarSeparator: ns.css("datetimerangepicker-calendar-separator"),
        firstRow: ns.css("datetimerangepicker-popover-first-row"),
        secondRow: ns.css("datetimerangepicker-popover-second-row"),
        leftColumn: ns.css("datetimerangepicker-popover-left-column"),
        rightColumn: ns.css("datetimerangepicker-popover-right-column"),
        fromWrapper: ns.css("datetimerangepicker-from-wrapper"),
        toWrapper: ns.css("datetimerangepicker-to-wrapper"),
        dateInput: ns.css("datetimerangepicker-date-input"),
        timeInput: ns.css("datetimerangepicker-time-input"),
        dayPartInput: ns.css("datetimerangepicker-time-part-input"),
        todayButton: ns.css("datetimerangepicker-today-button"),
        inputOpen: ns.css("items-input-open"),
        calendars: ns.css("datetimerangepicker-calendars"),
        customContent: ns.css("datetimerangepicker-custom-content"),
        labelFrom: ns.css("datetimerangepicker-from-label"),
        labelTo: ns.css("datetimerangepicker-to-label"),
        mainPlaceholder: ns.css("datetimerangepicker-main-placeholder"),
        inputsWrapper: ns.css("datetimerangepicker-inputs-wrapper"),
        popoverWrapper: ns.css("datetimerangepicker-popover-wrapper"),
        removeRightBorder: ns.css("datetimerangepicker-remove-right-border"),
        compactLayout: ns.css("datetimerangepicker-compact-layout"),
        labelBogus: ns.css("datetimerangepicker-label-bogus"),
        withSeconds: ns.css("datetimerangepicker-seconds"),
        withEnglishFormat: ns.css("datetimerangepicker-english-format"),
        inputPlaceholder: ns.css("input-placeholder"),
        popover: ns.css("datetimerangepicker-popover"),
        resetButton: () => Css.css`&&&& { margin-left: auto; }`,
      },
      defaults: {
        format: "dd.mm.Y",
        columnRegexp: /^((?:offset-)?[a-z]+)(?:-)?(\d+)$/,
      },
      errors: {
        dateFromGreaterThanDateTo: "The property dateFrom is greater than the property dateTo.",
        firstGreaterThanSecond: "The first date of range is greater than the second date of range.",
      },
      lsi: () =>
        UU5.Common.Tools.merge(
          {},
          UU5.Environment.Lsi.Bricks.calendar,
          UU5.Environment.Lsi.Forms.message,
          UU5.Environment.Lsi.Forms.datePicker
        ),
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: UU5.PropTypes.arrayOf(UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string])),
      dateFrom: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
      dateTo: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
      format: UU5.PropTypes.string,
      country: UU5.PropTypes.string,
      beforeRangeMessage: UU5.PropTypes.any,
      afterRangeMessage: UU5.PropTypes.any,
      parseDate: UU5.PropTypes.func,
      icon: UU5.PropTypes.string,
      iconOpen: UU5.PropTypes.string,
      iconClosed: UU5.PropTypes.string,
      dateIcon: UU5.PropTypes.string,
      timeIcon: UU5.PropTypes.string,
      disableBackdrop: UU5.PropTypes.bool,
      openToContent: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.string]),
      placeholderTime: UU5.PropTypes.string,
      hideFormatPlaceholder: UU5.PropTypes.bool,
      hideWeekNumber: UU5.PropTypes.bool,
      showTodayButton: UU5.PropTypes.bool,
      labelFrom: UU5.PropTypes.any,
      labelTo: UU5.PropTypes.any,
      pickerLabelFrom: UU5.PropTypes.any,
      pickerLabelTo: UU5.PropTypes.any,
      innerLabel: UU5.PropTypes.bool,
      timeFormat: UU5.PropTypes.oneOf(["12", "24", 12, 24]),
      timeStep: UU5.PropTypes.number,
      strictTimeStep: UU5.PropTypes.bool,
      timePickerType: UU5.PropTypes.oneOf(["single-column", "multi-column"]),
      timeZone: UU5.PropTypes.number,
      popoverLocation: UU5.PropTypes.oneOf(["local", "portal"]),
      weekStartDay: UU5.PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7]),
      valueType: UU5.PropTypes.oneOf(["date", "iso", "isoLocal"]),
      allowUnspecifiedRange: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.oneOf(["from", "to"])]),
      hideResetButton: UU5.PropTypes.bool,
      timeFromDefault: UU5.PropTypes.string,
      timeToDefault: UU5.PropTypes.string,
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        value: null,
        dateFrom: null,
        dateTo: null,
        format: null,
        country: null,
        beforeRangeMessage: {
          cs: "Datum a čas je mimo rozsah.",
          en: "Date and time is out of range.",
        },
        afterRangeMessage: {
          cs: "Datum a čas je mimo rozsah.",
          en: "Date and time is out of range.",
        },
        parseDate: null,
        dateIcon: "mdi-calendar",
        timeIcon: "mdi-clock-outline",
        icon: "mdi-calendar",
        iconOpen: "mdi-menu-down",
        iconClosed: "mdi-menu-down",
        disableBackdrop: false,
        openToContent: "xs",
        placeholderTime: null,
        hideFormatPlaceholder: false,
        hideWeekNumber: false,
        showTodayButton: false,
        labelFrom: null,
        labelTo: null,
        pickerLabelFrom: undefined,
        pickerLabelTo: undefined,
        innerLabel: false,
        timeFormat: 24,
        timeStep: 1,
        strictTimeStep: false,
        timePickerType: "multi-column",
        timeZone: undefined,
        popoverLocation: "local", // "local" <=> backward-compatible behaviour
        weekStartDay: 1,
        valueType: "date",
        allowUnspecifiedRange: false,
        hideResetButton: false,
        timeFromDefault: undefined,
        timeToDefault: undefined,
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      this._isAllowedFromUnspecifiedRange = DateTools.isAllowedFromUnspecifiedRange(this.props);
      this._isAllowedToUnspecifiedRange = DateTools.isAllowedToUnspecifiedRange(this.props);
      this._formattingValues = {};
      this._setFormattingValues(this.props);
      this._allowTimeZoneAdjustment = true;
      let propValue = Array.isArray(this.props.value) && this.props.value.length > 1 ? this.props.value : null;
      propValue = this._parseDate(propValue);
      let fromDateInputValue = null;
      let fromTimeInputValue = null;
      let toDateInputValue = null;
      let toTimeInputValue = null;
      let fromDayPart = TIME_FORMAT_AM;
      let toDayPart = TIME_FORMAT_AM;

      let fromValue = this._getFromValue(propValue);
      let toValue = this._getToValue(propValue);

      if (propValue) {
        propValue = this._getInitialValue(propValue);
        let validateResult = this._validateDateRangeResult({ value: propValue });
        if (validateResult.feedback === "error") propValue = null;
        else if (Array.isArray(propValue) && propValue.length === 1) propValue = null;

        if (propValue && fromValue && toValue) {
          fromDateInputValue = this._getDateString(propValue[0]);
          fromTimeInputValue = this._getTimeString(propValue[0], this.props, this._isSorXs());
          toDateInputValue = this._getDateString(propValue[1]);
          toTimeInputValue = this._getTimeString(propValue[1], this.props, this._isSorXs());
          fromDayPart = UU5.Common.Tools.getDayPart(propValue[0]);
          toDayPart = UU5.Common.Tools.getDayPart(propValue[1]);
        }
      }

      let { fromDisplayDate, toDisplayDate } = this._getDisplayDates(propValue, this.props.dateFrom, this.props.dateTo);

      return {
        fromDisplayDate,
        fromDateInputValue,
        fromTimeInputValue,
        fromFeedback: { feedback: "initial", message: null },
        toDisplayDate,
        toDateInputValue,
        toTimeInputValue,
        toFeedback: { feedback: "initial", message: null },
        activeInput: undefined,
        tempValue: null,
        fromDayPart,
        toDayPart,
      };
    },

    UNSAFE_componentWillMount() {
      this._hasFocus = false;
      this._setUpLimits(this.props);

      let value;
      let devValidation = this._validateDevProps(this.props.value, this.props.dateFrom, this.props.dateTo);
      if (devValidation.valid) {
        if (this.state.value) {
          // value is probably valid
          value = this.state.value;

          if (this.props.onValidate && typeof this.props.onValidate === "function") {
            this._validateOnChange({ value, event: null, component: this });
          }
        } else if (this.props.value) {
          // value probably isnt valid
          value = this.props.value;
          this._allowTimeZoneAdjustment = true;

          if (this.props.onValidate && typeof this.props.onValidate === "function") {
            this._validateOnChange({ value, event: null, component: this });
          } else {
            if (Array.isArray(value) && value.length === 1) {
              this.setValue(null);
            } else {
              let validateResult = this._validateDateRangeResult({ value });
              if (validateResult.feedback === "error") {
                this._privateSetFeedback("error", validateResult.message, null);
              }
            }
          }
        } else {
          // there is no value
          if (this.props.onValidate && typeof this.props.onValidate === "function") {
            this._validateOnChange({ value, event: null, component: this });
          }
        }
      } else {
        this.showError(devValidation.error);
      }

      return this;
    },

    componentDidMount() {
      UU5.Environment.EventListener.registerDateTime(this.getId(), this._change);
    },

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.controlled) {
        this._isAllowedFromUnspecifiedRange = DateTools.isAllowedFromUnspecifiedRange(nextProps);
        this._isAllowedToUnspecifiedRange = DateTools.isAllowedToUnspecifiedRange(nextProps);
        this._setFormattingValues(nextProps);
        this._setUpLimits(nextProps);

        this._allowTimeZoneAdjustment = true;
        let value = this._unspecifiedRangeValueToDate(nextProps.value);
        let devValidation = this._validateDevProps(value, nextProps.dateFrom, nextProps.dateTo);
        value = this._getInitialValue(value, nextProps);
        if (devValidation.valid) {
          let result = this._validateDateRangeResult(
            { value, message: nextProps.message, feedback: nextProps.feedback },
            nextProps
          );
          if (result) {
            if (typeof result === "object") {
              let displayValue;
              if (result.feedback) {
                displayValue = result.value;
                this._privateSetFeedback(result.feedback, result.message, result.value);
              } else {
                displayValue = value;
                this._privateSetFeedback(nextProps.feedback, nextProps.message, value);
              }

              let { fromDisplayDate, toDisplayDate } = this._getDisplayDates(
                displayValue,
                nextProps.dateFrom,
                nextProps.dateTo
              );
              this.setState({ fromDisplayDate, toDisplayDate });
            }
          }
        } else {
          this.showError(devValidation.error);
        }
      }

      return this;
    },

    componentWillUnmount() {
      this._removeEvent();
      this._removeKeyEvents();
      UU5.Environment.EventListener.unregisterDateTime(this.getId(), this._change);
    },

    componentDidUpdate(prevProps, prevState) {
      if (this.state.open && prevState.open) {
        if (prevState.activeInput !== this.state.activeInput) {
          this._onOpen(this.state.activeInput);
        }

        if (prevState.message && !this.state.message) {
          this._onOpen(this.state.activeInput);
        }
      }

      let isSorXs = this._isSorXs(this.state);
      if (isSorXs !== this._isSorXs(prevState)) {
        let newState = this._getInnerState(this.state.value);

        if (isSorXs) {
          newState.toDisplayDate = this.state.fromDisplayDate;
        } else {
          let toDisplayDate = UU5.Common.Tools.cloneDateObject(this.state.toDisplayDate);
          toDisplayDate = DateTools.increaseDate(toDisplayDate, undefined, 1);
          newState.toDisplayDate = toDisplayDate;
        }

        this.setState({ ...newState });
      }
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    toggle(setStateCallback) {
      if (this.isOpen()) {
        this.close(() => this._removeEvent(setStateCallback));
      } else {
        this.open(() => this._addEvent(setStateCallback));
      }

      return this;
    },

    parseDate(dates) {
      let result;

      if (Array.isArray(dates)) {
        result = dates.map((date) => this._parseDate(date)).filter((date) => !!date);
        if (result.length === 0) result = null;
      } else {
        result = this._parseDate(dates);
      }

      return result;
    },

    parseDateDefault(date) {
      return this._parseDateDefault(date);
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    open_(setStateCallback) {
      this._addEvent();

      if (this._isSorXs() && !this.state.activeInput) {
        this.setState({ activeInput: "fromDate" });
      }

      this.openDefault(() => this._onOpen(this._isSorXs() ? "fromDate" : undefined, setStateCallback));
    },

    close_(setStateCallback) {
      this._removeEvent();
      this.closeDefault(() => this._onClose(setStateCallback));
    },

    reset_(setStateCallback) {
      this._allowTimeZoneAdjustment = true;
      let newState = this._getInnerState(this.props.value, "interface", true);
      newState.message = this.props.message;
      newState.feedback = this.props.feedback;
      newState.readOnly = this.props.readOnly;

      this.setState({ ...newState }, setStateCallback);
    },

    setValue_(value, setStateCallback) {
      this._allowTimeZoneAdjustment = true;
      value = this._unspecifiedRangeValueToDate(value);
      value = this._getInitialValue(value);
      let devValidation = this._validateDevProps(value, this.props.dateFrom, this.props.dateTo);
      if (devValidation.valid) {
        if (Array.isArray(value) && value.length < 2) {
          // If value is an array with just one item, treat it as if the value is null
          value = null;
        }

        if (this._checkRequired({ value: value })) {
          let initialFeedback = { feedback: "initial", message: null };
          let state = { ...initialFeedback, ...this._getInnerState(value, "interface", true) };

          if (typeof this.props.onValidate === "function") {
            this._validateOnChange({ value: value, event: null, component: this }, setStateCallback);
          } else {
            this.setState({ ...state }, setStateCallback);
          }
        } else if (typeof setStateCallback === "function") {
          setStateCallback();
        }
      } else {
        this.showError(devValidation.error);

        if (typeof setStateCallback === "function") {
          setStateCallback();
        }
      }
    },

    setFeedback_(feedback, message, value, setStateCallback) {
      value = this._unspecifiedRangeValueToDate(value);
      if (value === "") {
        value = null;
      }

      this._allowTimeZoneAdjustment = true;
      value = this._parseDate(value);
      let state = { ...this._getInnerState(value), ...{ feedback }, ...{ message } };
      this.setState({ ...state }, setStateCallback);
    },

    getValue_() {
      let date;

      if (!this.state.value) {
        date = null;
      } else {
        date = this.state.value;
      }

      date = this._parseDate(date);
      return this._getOutcomingValue(date);
    },

    getInputWidth_(opt) {
      let width = null;

      if (this.props.inputWidth && !this._isSorXs()) {
        // DateTimeRangePicker doesnt support input width on S and XS screen size
        if (opt && opt.dualInput) {
          let unit = this.props.inputWidth.replace(/[0-9]/g, "");
          width = parseInt(this.props.inputWidth) / 2 + unit;
        } else {
          width = this.props.inputWidth;
        }
      }

      return width;
    },

    onChangeDefault_(opt, setStateCallback) {
      if (opt._data.type === "calendar") {
        this._onCalendarChangeDefault(opt, setStateCallback);
      } else if (opt._data.type === "time") {
        this._onTimeChangeDefault(opt, setStateCallback);
      } else if (opt._data.type.match(/input/i)) {
        this._onInputChangeDefault(opt, setStateCallback);
      }

      return this;
    },

    onFocusDefault_(opt) {
      let value = opt._data ? opt._data.value : opt.value;
      opt.value = value;
      let result = this.getFocusFeedback(opt);

      if (result || opt._data) {
        result = result || {};
        if (opt._data && this.state.activeInput !== opt._data.activeInput) {
          result.activeInput = opt._data.activeInput;
        }

        this.setState({ ...result });
      }

      return this;
    },

    onBlurDefault_(opt) {
      let value = opt._data ? opt._data.value : opt.value;
      opt.value = this._getOutcomingValue(value);

      if (this._checkRequired({ value: opt.value }) && !this.props.validateOnChange) {
        opt.required = this.props.required;
        let blurResult = this.getBlurFeedback({ ...opt, value });
        blurResult = { feedback: "initial", message: null, ...blurResult };

        if (typeof this.props.onChangeFeedback === "function") {
          this.props.onChangeFeedback({ ...blurResult, component: this });
        } else {
          this.setState({ ...blurResult });
        }
        return this;
      }

      return this;
    },

    setChangeFeedback__(opt, setStateCallback) {
      this._allowTimeZoneAdjustment = true;
      let value = this._getInitialValue(opt.value);
      value = this._unspecifiedRangeValueToDate(value);
      let newState = this._getInnerState(value);
      newState.feedback = opt.feedback;
      newState.message = opt.message;

      this.setState({ ...newState }, setStateCallback);
    },

    getInitialValue_(propValue) {
      this._isAllowedFromUnspecifiedRange = DateTools.isAllowedFromUnspecifiedRange(this.props);
      this._isAllowedToUnspecifiedRange = DateTools.isAllowedToUnspecifiedRange(this.props);
      this._formattingValues = this._formattingValues || {};
      this._setFormattingValues(this.props);
      let stateValue = !Array.isArray(propValue) || propValue.length < 2 ? null : propValue;
      stateValue = this._unspecifiedRangeValueToDate(stateValue);

      if (stateValue) {
        this._allowTimeZoneAdjustment = true;
        stateValue = this._parseDate(stateValue);
        let devValidation = this._validateDevProps(stateValue, this.props.dateFrom, this.props.dateTo);
        if (devValidation.valid) {
          let validateResult = this._validateDateRangeResult({ value: stateValue });
          if (validateResult.feedback === "error") stateValue = null;
          else stateValue = this._getInitialValue(stateValue);
        } else {
          stateValue = null;
        }
      }

      return stateValue;
    },

    getInputWrapperProps_(children, buttons, opts) {
      let props = this._getInputWrapperPropsDefault(children, buttons, opts);

      if (opts && opts.type === "fromWrapper") {
        delete props.message;
      }

      if (this._isSorXs() && (this.props.inputWidth || this.props.labelWidth)) {
        props.colWidth = UU5.Common.Tools.buildColWidthClassName(
          props.label != null ? this.props.inputColWidth : "xs12"
        );
      }

      return props;
    },
    //@@viewOff:overriding

    //@@viewOn:private
    // Used to hold current values of props/state which is used for formatting.
    // These values are used on various places and its value has to be always
    // updated (e.g. in functions called from willReceiveProps)
    _setFormattingValues(props) {
      let formattingKeys = [
        "format",
        "country",
        "timeStep",
        "strictTimeStep",
        "parseDate",
        "valueType",
        "timeFormat",
        "timeZone",
        "seconds",
        "valueType",
        "timeFromDefault",
        "timeToDefault",
        "dateFrom",
        "dateTo",
        "beforeRangeMessage",
        "afterRangeMessage",
      ];

      for (let i = 0; i < formattingKeys.length; i++) {
        let key = formattingKeys[i];
        let value = props[key];
        this._formattingValues[key] = value;
      }
    },

    _getOutcomingValue(value) {
      let { timeZone } = this._formattingValues;

      let getSingleOutputValue = (singleValue, index) => {
        if (singleValue) {
          singleValue = this._parseDate(singleValue, index === 1);

          if (
            (index === 0 &&
              this._isAllowedFromUnspecifiedRange &&
              singleValue &&
              singleValue.getTime() === UNSPECIFIED_FROM.getTime()) ||
            (index === 1 &&
              this._isAllowedToUnspecifiedRange &&
              singleValue &&
              singleValue.getTime() === UNSPECIFIED_TO.getTime())
          ) {
            singleValue = null;
          } else if (typeof timeZone === "number" && this._formattingValues.valueType !== "isoLocal") {
            singleValue = UU5.Common.Tools.adjustForTimezone(
              singleValue,
              -singleValue.getTimezoneOffset() / 60,
              timeZone
            );
          }

          if (this._formattingValues.valueType === "iso") {
            singleValue = DateTools.getISO(singleValue);
          } else if (this._formattingValues.valueType === "isoLocal" && singleValue) {
            singleValue = DateTools.getISOLocal(singleValue, this._formattingValues.timeZone);
          }
        }

        return singleValue;
      };

      if (Array.isArray(value)) {
        value = value.map(getSingleOutputValue);
      } else {
        value = getSingleOutputValue(value);
      }

      return value;
    },

    _privateSetFeedback(feedback = null, message = null, value = null, setStateCallback) {
      this.setState({ feedback, message, value }, setStateCallback);
    },

    _setUpLimits(props) {
      let { timeFrom, timeTo, show24 } = DateTools.setupLimits(props);
      this._timeFrom = timeFrom;
      this._timeTo = timeTo;
      this._show24 = show24;
    },

    _getInitialValue(value, props = this.props) {
      let result = null;

      if (Array.isArray(value)) {
        let parseString = (string, index) => {
          let dateObject = this._parseDate(string, index === 1);
          let timeString = this._getTimeString(dateObject, props, true);
          let dateString = this._getDateString(dateObject);

          return this._getFullDate(dateString, timeString);
        };

        result = value.map((value, index) => {
          if (typeof value === "string") {
            return parseString(value, index);
          } else if (value instanceof Date) {
            return this._parseDate(value, index === 1);
          }
        });
      }

      return this._adjustTimeZone(result, props.timeZone);
    },

    _isSorXs(state) {
      let screenSize = state ? state.screenSize : this.getScreenSize();
      return screenSize === "xs" || screenSize === "s";
    },

    _adjustTimeZone(date, outputTimeZone) {
      if (typeof outputTimeZone !== "number") {
        outputTimeZone = this.props.timeZone;
      }

      if (date && typeof (outputTimeZone || this.props.timeZone) === "number" && this._allowTimeZoneAdjustment) {
        outputTimeZone = typeof outputTimeZone === "number" ? outputTimeZone : this.props.timeZone;

        let adjust = (date) => {
          let inputTimeZone = -(date.getTimezoneOffset() / 60);

          return UU5.Common.Tools.adjustForTimezone(date, outputTimeZone, inputTimeZone);
        };

        if (Array.isArray(date)) {
          this._allowTimeZoneAdjustment = false;
          return date.map((singleDate) => adjust(singleDate)).filter((singleDate) => !!singleDate);
        } else {
          this.showError("adjusting time zone for a single value is buggy. It must be an array of two values");
          return date;
        }
      } else {
        return date;
      }
    },

    _getAutofilledTime(isEndDate) {
      let time = this._formattingValues.timeFormat == TIME_FORMAT_12 ? "12:00" : "00:00";
      let seconds = "00";
      let dayPart = TIME_FORMAT_AM;
      let usedDefault = this._formattingValues[isEndDate ? "timeToDefault" : "timeFromDefault"];

      if (usedDefault) {
        let timeDefault = usedDefault;
        if (this._formattingValues.timeFormat == TIME_FORMAT_12 && !/AM|PM/.test(timeDefault)) {
          timeDefault = DateTools.timeFormat24to12(timeDefault);
        }
        let parts = timeDefault.trim().split(" ");
        dayPart = parts[1];
        parts = parts[0].split(":");
        time = parts[0] + ":" + (parts[1] || "00");
        seconds = parts[2];
      }

      if (this._formattingValues.seconds) {
        time += ":" + seconds;
      }

      if (this._formattingValues.timeFormat == TIME_FORMAT_12) {
        time += " " + dayPart;
      }

      return time;
    },

    _parseDate(dates, isEndDate, applyTimeAutofill = true) {
      let result = null;
      let { parseDate, timeZone } = this._formattingValues;

      let parseSingleDate = (date, index) => {
        isEndDate = index === 1;
        let resultDate = null;

        if (typeof date !== "string") {
          resultDate = date;
        } else {
          if (parseDate && typeof parseDate === "function") {
            let dateStringMatch = resultDate && resultDate.match(/.+ /);

            if (dateStringMatch) {
              resultDate = dateStringMatch[0].trim();
            }

            resultDate = parseDate(date, this);
          } else {
            resultDate = this.parseDateDefault(date);
          }

          let timeString = this._getTimeString(date, true);
          if (applyTimeAutofill && !timeString) timeString = this._getAutofilledTime(isEndDate);
          if (timeString && resultDate instanceof Date) {
            let timeData = this._parseTime(timeString);
            if (timeData) {
              if (timeData.dayPart === TIME_FORMAT_AM && timeData.hours === 12) {
                timeData.hours -= 12;
              } else if (timeData.dayPart === TIME_FORMAT_PM && timeData.hours < 12) {
                timeData.hours += 12;
              }
              resultDate.setHours(timeData.hours);
              resultDate.setMinutes(timeData.minutes);
              resultDate.setSeconds(timeData.seconds);
            }
          }
        }

        return resultDate;
      };

      if (Array.isArray(dates)) {
        result = dates.map(parseSingleDate).filter((date) => !!date);
        if (result.length === 0) result = null;
        result = this._adjustTimeZone(result, timeZone);
      } else {
        result = parseSingleDate(dates, isEndDate ? 1 : 0);
      }

      return result;
    },

    _parseDateDefault(date) {
      let { format, country } = this._formattingValues;
      return UU5.Common.Tools.parseDate(date, {
        format,
        country,
      });
    },

    _parseTime(times) {
      let result;
      let { timeFormat } = this._formattingValues;

      if (Array.isArray(times)) {
        result = times.map((time) => UU5.Common.Tools.parseTime(time, timeFormat)).filter((time) => !!time);
        if (result.length === 0) result = null;
      } else {
        result = UU5.Common.Tools.parseTime(times, timeFormat);
      }

      return result;
    },

    _getTimeString(value, displayDatePart = false) {
      let { seconds, timeFormat, timeStep } = this._formattingValues;
      return UU5.Common.Tools.getTimeString(value, seconds, timeFormat, displayDatePart, timeStep);
    },

    _getDateString(value) {
      let { format, country } = this._formattingValues;
      let isoDateOnlyString = value instanceof Date ? DateTools.toISODateOnlyString(value) : value;
      return UU5.Common.Tools.getDateString(isoDateOnlyString, { format, country });
    },

    _getFullDate(dateString, timeString, dayPart) {
      let value = null;
      let dateObject = this._parseDate(dateString);
      let timeObject = this._parseTime(timeString);

      if (dateObject) {
        if (timeObject) {
          if (timeObject.dayPart === TIME_FORMAT_AM && timeObject.hours === 12) {
            timeObject.hours -= 12;
          } else if (timeObject.dayPart === TIME_FORMAT_PM && timeObject.hours < 12) {
            timeObject.hours += 12;
          }
          dateObject.setHours(timeObject.hours);
          dateObject.setMinutes(timeObject.minutes);
          dateObject.setSeconds(timeObject.seconds);
        }

        if (this.props.timeFormat == TIME_FORMAT_12) {
          dayPart = dayPart || timeObject.dayPart;
          value = this._setDayPart(dateObject, dayPart);
        } else {
          value = dateObject;
        }
      }

      return value;
    },

    _getDateFrom(date) {
      return this._parseDate(date || this.props.dateFrom, false, false);
    },

    _getDateTo(date) {
      return this._parseDate(date || this.props.dateTo, true, false);
    },

    _getToday() {
      let today = new Date(Date.now());

      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);

      return today;
    },

    _getFromValue(value = this.state.value) {
      let result = undefined;

      if (Array.isArray(value) && value.length >= 1) {
        result = value[0];
      } else if (!value && this.state && this.state.tempValue) {
        result = this.state.tempValue;
      } else {
        result = value;
      }

      if (result) {
        result = UU5.Common.Tools.cloneDateObject(this._parseDate(result));
      }

      return result;
    },

    _getToValue(value = this.state.value) {
      let result = undefined;

      if (Array.isArray(value) && value.length >= 2) {
        result = UU5.Common.Tools.cloneDateObject(this._parseDate(value[1], true));
      } else {
        result = UU5.Common.Tools.cloneDateObject(this._parseDate(value, true));
      }

      return result;
    },

    _validateOnChange(opt, checkValue, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";

      if (!checkValue || this._hasValueChanged(this.state.value, opt.value)) {
        let result =
          typeof this.props.onValidate === "function"
            ? this.props.onValidate({ ...opt, value: this._getOutcomingValue(opt.value) })
            : null;
        if (result) {
          if (typeof result === "object") {
            if (result.feedback) {
              _callCallback = false;
              this._privateSetFeedback(result.feedback, result.message, result.value, setStateCallback);
            } else {
              _callCallback = false;
              this.setState({ value: opt.value }, setStateCallback);
            }
          } else {
            this.showError("validateError", null, {
              context: { event: null, func: this.props.onValidate, result: result },
            });
          }
        } else if (opt._data?.state) {
          _callCallback = false;
          this.setState({ ...opt._data.state }, setStateCallback);
        } else if (opt.value) {
          _callCallback = false;
          this._privateSetFeedback("initial", null, opt.value, setStateCallback);
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },

    _validateDateResult(opt, isEndDate) {
      let result = opt;

      if (opt) {
        let date = this._parseDate(opt.value, isEndDate);
        date = this._getOutcomingValue(date);

        if (!opt.value || date) {
          if (this._compareDates(date, this._formattingValues.dateFrom, "lesser")) {
            result.feedback = "error";
            result.message = this.getLsiItem(this._formattingValues.beforeRangeMessage);
          } else if (this._compareDates(date, this._formattingValues.dateTo, "greater")) {
            result.feedback = "error";
            result.message = this.getLsiItem(this._formattingValues.afterRangeMessage);
          } else {
            result.feedback = opt ? opt.feedback || "initial" : "initial";
            result.message = opt ? opt.message || null : null;
            result.value = date;
          }
        }

        if (opt.value && result.feedback !== "error") {
          let timeString = this._getTimeString(date);
          let parsedTime = this._parseTime(timeString);
          if (
            parsedTime &&
            this._formattingValues.strictTimeStep &&
            parsedTime.minutes % this._formattingValues.timeStep > 0
          ) {
            result.feedback = "error";
            result.message = this.getLsiValue("invalidTimeMessage");
          }
        }
      }

      return result;
    },

    _validateDateRangeResult(opt, props = this.props) {
      let result = opt;

      let date = this._parseDate(opt.value);
      if (opt && Array.isArray(opt.value)) {
        if (date) {
          let dateFrom = this._getDateFrom(props.dateFrom);
          let dateTo = this._getDateTo(props.dateTo);
          let valueFrom = this._getFromValue(date);
          let valueTo = this._getToValue(date);
          if (
            (valueFrom instanceof Date && isNaN(valueFrom.getDate())) ||
            (valueTo instanceof Date && isNaN(valueTo.getDate()))
          ) {
            result = false;
          } else if (dateFrom && valueFrom < dateFrom) {
            result.feedback = "error";
            result.message = this.getLsiItem(this.props.beforeRangeMessage);
          } else if (dateTo && valueTo > dateTo) {
            result.feedback = "error";
            result.message = this.getLsiItem(this.props.afterRangeMessage);
          }
        }
      }

      return result;
    },

    _validateDevProps(value, dateFrom = this.props.dateFrom, dateTo = this.props.dateTo) {
      let result = { valid: true, error: null };

      if (Array.isArray(value) && value.length === 2) {
        // Currently only 2 values are relevant
        if (this._compareDates(value[0], value[1], "greater")) {
          result.valid = false;
          result.error = "firstGreaterThanSecond";
        } else if (dateFrom && dateTo && this._compareDates(dateFrom, dateTo, "greater")) {
          result.valid = false;
          result.error = "dateFromGreaterThanDateTo";
        }
      }

      return result;
    },

    _onOpen(type, setStateCallback) {
      let aroundElement;
      let right = type ? type.match(/to/i) : undefined;
      let targetRef = this._isSorXs() ? (right ? this._toPopover : this._fromPopover) : this._popover;

      if (this._isSorXs()) {
        type = type || "dateFrom";
        if (right) {
          aroundElement = type.match(/date/i) ? this._toDateTextInput : this._toTimeTextInput;
        } else {
          aroundElement = type.match(/date/i) ? this._fromDateTextInput : this._fromTimeTextInput;
        }
      } else {
        aroundElement = this._textInput;
      }

      if (targetRef) {
        targetRef.open(
          {
            onClose: this._onClose,
            aroundElement,
            position: "bottom",
            offset: this._shouldOpenToContent() ? 0 : 4,
            disableBackdrop: this.props.disableBackdrop,
            horizontalOnly: this._shouldOpenToContent(),
          },
          setStateCallback
        );
      } else if (typeof setStateCallback === "function") {
        setStateCallback();
      }
    },

    _onClose(setStateCallback) {
      let targetRef = this._isSorXs()
        ? this.state.activeInput && this.state.activeInput.match(/to/)
          ? this._toPopover
          : this._fromPopover
        : this._popover;

      if (targetRef) {
        targetRef.close(setStateCallback);
      } else if (typeof setStateCallback === "function") {
        setStateCallback();
      }
    },

    _close(persistListeners, setStateCallback) {
      if (!persistListeners) this._removeEvent();
      this.closeDefault(() => this._onClose(setStateCallback));
    },

    _open(type, setStateCallback) {
      this._addEvent();
      this.openDefault(() => this._onOpen(type, setStateCallback));
    },

    _change(opt) {
      this._onChangeFormat(opt);
    },

    _onChangeFormat(opt, setStateCallback) {
      let format = opt.format === undefined ? this._formattingValues.format : opt.format;
      let country =
        opt.country === undefined
          ? this._formattingValues.country
          : opt.country
          ? opt.country.toLowerCase()
          : opt.country;
      this._formattingValues.format = format;
      this._formattingValues.country = country;
      this.setState({}, setStateCallback); // needs to re-render
    },

    _toggleDayPart(right) {
      let state = {};
      let fromPrevPart = this.state.fromDayPart;
      let fromNextPart = fromPrevPart == TIME_FORMAT_AM ? TIME_FORMAT_PM : TIME_FORMAT_AM;
      let toPrevPart = this.state.toDayPart;
      let toNextPart = toPrevPart == TIME_FORMAT_AM ? TIME_FORMAT_PM : TIME_FORMAT_AM;
      let value = this.state.value ? [...this.state.value] : null;

      if (right) {
        let fromDate = this._setDayPart(this._getFromValue() || this.state.tempValue, fromPrevPart);
        let toDate = this._setDayPart(this._getToValue(), toNextPart);
        value = [fromDate, toDate];
        state = this._getInnerState(value, "input");
        state.toDayPart = toNextPart;
      } else {
        let fromDate = this._setDayPart(this._getFromValue() || this.state.tempValue, fromNextPart);
        let toDate = this._setDayPart(this._getToValue(), toPrevPart);
        value = [fromDate, toDate];
        state = this._getInnerState(value, "input");
        state.fromDayPart = fromNextPart;
      }

      this.setState({ ...state });
    },

    _setDayPart(date, dayPart) {
      date = UU5.Common.Tools.cloneDateObject(date);
      dayPart = date ? dayPart || UU5.Common.Tools.getDayPart(date) : null;

      if (date) {
        let hours = date.getHours();
        if (dayPart === TIME_FORMAT_PM) {
          if (hours < 12) {
            date.setHours(hours + 12);
          }
        } else if (dayPart === TIME_FORMAT_AM) {
          if (hours >= 12) {
            date.setHours(hours - 12);
          }
        }
      }

      return date;
    },

    _getInputValidationResult(fromValue, toValue) {
      fromValue = this._parseDate(fromValue);
      toValue = this._parseDate(toValue, true);

      let result = {
        fromFeedback: this._validateDateResult({ value: fromValue }),
        toFeedback: this._validateDateResult({ value: toValue }, true),
      };

      delete result.fromFeedback.value;
      delete result.toFeedback.value;

      if (this._compareDates(fromValue, toValue, "greater")) {
        result.toFeedback = { feedback: "error", message: this.getLsiValue("dateInPast") };
      }

      return result;
    },

    _onResize() {
      if (this.isOpen() && !this.isXs()) {
        UU5.Common.Tools.debounce(() => {
          this.state.activeInput ? this._onOpen(this.state.activeInput) : this._onClose();
        }, 500)();
      }
    },

    _onCalendarViewChange(opt) {
      // do nothing
      return undefined;
    },

    _onChange(opt) {
      opt.component = this;

      if (opt._data.type === "calendar") {
        this._onCalendarChange(opt);
      } else if (opt._data.type === "time") {
        this._onTimeChange(opt);
      } else if (opt._data.type === "dateInput") {
        this._onDateInputChange(opt);
      } else if (opt._data.type === "timeInput") {
        this._onTimeInputChange(opt);
      }
    },

    _onCalendarChange(opt) {
      let value = opt.value;
      let executeOnChange = false;

      if (this.state.tempValue) {
        if (
          this._compareDates(value, this.state.tempValue, "greater") ||
          this._compareDates(value, this.state.tempValue, "equals")
        ) {
          if (this.props.timeToDefault) DateTools.setTimeToDate(value, this.props.timeToDefault);
          value = [this.state.tempValue, value];
          executeOnChange = true;
        } else {
          if (this.props.timeFromDefault) DateTools.setTimeToDate(value, this.props.timeFromDefault);
          value = [value];
        }
      } else {
        if (this.props.timeFromDefault) DateTools.setTimeToDate(value, this.props.timeFromDefault);
        value = [value];
      }

      opt.value = this._getOutcomingValue(value);
      opt._data.value = value;
      opt._data.executeOnChange = executeOnChange;
      if (executeOnChange && typeof this.props.onChange === "function") {
        this.props.onChange(opt);
      } else {
        this.onChangeDefault(opt);
      }
    },

    _onTimeChange(opt) {
      let right = opt._data.right;
      let timeObject = opt.value;
      if (opt._data.changeType && opt._data.changeType !== "single-column") {
        // if its single-column, then just get the opt.value
        timeObject = this._parseTime(right ? this.state.toTimeInputValue : this.state.fromTimeInputValue);
        timeObject[opt._data.changeType] = opt.value[opt._data.changeType];
      }
      let timeString = UU5.Common.Tools.formatTime(
        timeObject,
        this.props.seconds,
        this.props.timeFormat,
        false,
        this.props.timeStep,
        true
      );
      let date = right ? this._getToValue() || this._getToday() : this._getFromValue() || this._getToday();
      let value = this._getFullDate(this._getDateString(date), timeString);
      value = this._setDayPart(value, timeObject.dayPart);
      let executeOnChange = false;

      if (right) {
        value = [this._getFromValue(), value];
      } else {
        value = [value, this._getToValue()];
      }

      opt.value = this._getOutcomingValue(value);
      opt._data.value = value;
      opt._data.executeOnChange = executeOnChange;
      if (executeOnChange && typeof this.props.onChange === "function") {
        this.props.onChange(opt);
      } else {
        this.onChangeDefault(opt);
      }
    },

    _onDateInputChange(opt) {
      // The code below tries to parse values of both inputs and validate them towards eachother.
      // If the second (right) value (date) isnt greater than the first (left) value (date), then
      // the value isnt valid and thus it basically is null. It means that onChange cannot be executed
      let right = opt._data.right;
      let dateInputValue = opt.value;
      let parsedDate = this._parseDate(dateInputValue, right);
      let state = {
        fromFeedback: this.state.fromFeedback,
        toFeedback: this.state.toFeedback,
      };
      let executeOnChange = false;

      if (right) {
        state.toDateInputValue = dateInputValue;

        if (this.state.toTimeInputValue) {
          parsedDate = this._getFullDate(dateInputValue, this.state.toTimeInputValue);

          if (parsedDate && this.props.timeFormat == TIME_FORMAT_12) {
            parsedDate = this._setDayPart(parsedDate, this.state.toDayPart);
          }
        }
      } else {
        state.fromDateInputValue = dateInputValue;

        if (this.state.fromTimeInputValue) {
          parsedDate = this._getFullDate(dateInputValue, this.state.fromTimeInputValue);
        }

        if (parsedDate && this.props.timeFormat == TIME_FORMAT_12) {
          parsedDate = this._setDayPart(parsedDate, this.state.fromDayPart);
        }
      }

      if (parsedDate) {
        if (right) {
          if (this.props.timeToDefault) DateTools.setTimeToDate(parsedDate, this.props.timeToDefault);
          state = this._getInnerState(
            [this.state.value ? this.state.value[0] : this.state.tempValue, parsedDate],
            "input",
            true,
            true
          );
          state.toDateInputValue = opt.value;
        } else {
          if (this.props.timeFromDefault) DateTools.setTimeToDate(parsedDate, this.props.timeFromDefault);
          state = this._getInnerState([parsedDate, this.state.value ? this.state.value[1] : null], "input", true);
          state.fromDateInputValue = opt.value;
        }
      } else if (!opt.value) {
        if (right) {
          if (!this.state.toTimeInputValue && !this.state.fromTimeInputValue && !this.state.fromDateInputValue) {
            state = this._getInnerState(null, "input", true, true);
          } else {
            state.toDateInputValue = opt.value;
          }
        } else {
          if (!this.state.fromTimeInputValue && !this.state.toTimeInputValue && !this.state.toDateInputValue) {
            state = this._getInnerState(null, "input", true, true);
          } else {
            state.fromDateInputValue = opt.value;
          }
        }
      }

      state.fromTimeInputValue = state.fromTimeInputValue || this.state.fromTimeInputValue;
      state.toTimeInputValue = state.toTimeInputValue || this.state.toTimeInputValue;

      let allInputsEmpty =
        !state.fromDateInputValue && !state.toDateInputValue && !state.fromTimeInputValue && !state.toTimeInputValue;

      if (state.value == null && allInputsEmpty && this.state.value) {
        executeOnChange = true;
      } else if (this.state.value == null && state.value) {
        executeOnChange = true;
      } else if (state.value && this.state.value && state.value.length === 2 && this.state.value.length === 2) {
        if (
          !this._compareDates(state.value[0], this.state.value[0], "equals") ||
          !this._compareDates(state.value[1], this.state.value[1], "equals")
        ) {
          executeOnChange = true;
        }
      }

      if (!this.isComputedDisabled() && !this.isReadOnly()) {
        opt._data.state = state;
        opt._data.executeOnChange = executeOnChange;
        opt._data.value = state.value;
        opt.value = this._getOutcomingValue(state.value);
        if (executeOnChange && typeof this.props.onChange === "function") {
          this.props.onChange(opt);
        } else {
          this.onChangeDefault(opt);
        }
      }
    },

    _onTimeInputChange(opt) {
      let isValidTime = UU5.Common.Tools.isValidTime(
        opt.value,
        this.props.timeFormat,
        this.props.seconds && this.props.timeStep === 1
      );

      let right = opt._data.right;
      let dateInputValue = right ? this.state.toDateInputValue : this.state.fromDateInputValue;
      let timeInputValue = opt.value;
      let parsedDate = isValidTime
        ? this._getFullDate(dateInputValue, timeInputValue, right ? this.state.toDayPart : this.state.fromDayPart)
        : null;
      let state = {
        fromFeedback: this.state.fromFeedback,
        toFeedback: this.state.toFeedback,
      };
      let executeOnChange = false;

      if (parsedDate) {
        if (right) {
          state = this._getInnerState(
            [this.state.value ? this.state.value[0] : this.state.tempValue, parsedDate],
            "input",
            true,
            true
          );
        } else {
          state = this._getInnerState([parsedDate, this.state.value ? this.state.value[1] : undefined], "input", true);
        }
      } else if (!opt.value) {
        if (right && !this.state.toDateInputValue && !this.state.fromTimeInputValue && !this.state.fromDateInputValue) {
          state = this._getInnerState(null, "input", true, true);
        } else if (
          !right &&
          !this.state.fromDateInputValue &&
          !this.state.toTimeInputValue &&
          !this.state.toDateInputValue
        ) {
          state = this._getInnerState(null, "input", true, true);
        }
      }

      if (right) {
        state.fromTimeInputValue = this.state.fromTimeInputValue;
        state.toTimeInputValue = timeInputValue;
      } else {
        state.fromTimeInputValue = timeInputValue;
        state.toTimeInputValue = this.state.toTimeInputValue;
      }

      let allInputsEmpty =
        !state.fromDateInputValue && !state.toDateInputValue && !state.fromTimeInputValue && !state.toTimeInputValue;

      if (state.value == null && allInputsEmpty && this.state.value) {
        executeOnChange = true;
      } else if (this.state.value == null && state.value) {
        executeOnChange = true;
      } else if (state.value && this.state.value && state.value.length === 2 && this.state.value.length === 2) {
        if (
          !this._compareDates(state.value[0], this.state.value[0], "equals") ||
          !this._compareDates(state.value[1], this.state.value[1], "equals")
        ) {
          executeOnChange = true;
        }
      }

      if (!this.isComputedDisabled() && !this.isReadOnly()) {
        opt._data.state = state;
        opt._data.executeOnChange = executeOnChange;
        opt._data.value = state.value;
        opt.value = this._getOutcomingValue(state.value);
        if (executeOnChange && typeof this.props.onChange === "function") {
          this.props.onChange(opt);
        } else {
          this.onChangeDefault(opt);
        }
      }
    },

    _onTimeChangeDefault(opt, setStateCallback) {
      let right = this._isSorXs() ? opt._data.right : false;
      let value = opt._data ? opt._data.value : opt.value;
      value = right && Array.isArray(value) && value.length === 1 ? [null, value[0]] : value;
      let innerState = this._getInnerState(value, "input");
      let feedback;
      let _callCallback = typeof setStateCallback === "function";

      if (!innerState.value && this.props.required && this.state.value) {
        feedback = {
          feedback: "error",
          message: this.props.requiredMessage || this.getLsiComponent("requiredMessage"),
        };
      } else if (innerState.value || (!innerState.value && this.state.value)) {
        feedback = { feedback: "initial", message: null };
      }

      if (opt._data.executeOnChange) {
        opt.value = innerState.value;
        opt.feedback = feedback && feedback.feedback;
        opt.message = feedback && feedback.message;

        if (this.props.validateOnChange) {
          _callCallback = false;
          this._validateOnChange(opt, false, setStateCallback);
        } else if (this._checkRequired({ value: opt.value })) {
          opt.required = this.props.required;
          let result = this.getChangeFeedback(opt);
          _callCallback = false;
          this.setState({ ...feedback, ...innerState, ...result }, setStateCallback);
        }
      } else {
        _callCallback = false;
        this.setState({ ...feedback, ...innerState }, setStateCallback);
      }

      if (_callCallback) {
        setStateCallback();
      }
    },

    _onCalendarChangeDefault(opt, setStateCallback) {
      let value = opt._data ? opt._data.value : opt.value;
      let innerState = this._getInnerState(value);
      let feedback;
      let _callCallback = typeof setStateCallback === "function";

      if (!innerState.value && this.props.required && this.state.value) {
        feedback = {
          feedback: "error",
          message: this.props.requiredMessage || this.getLsiComponent("requiredMessage"),
        };
      } else if (innerState.value || (!innerState.value && this.state.value && (!value || value.length === 2))) {
        feedback = { feedback: "initial", message: null };
      }

      if (innerState.tempValue) {
        innerState.activeInput =
          this._isAllowedFromUnspecifiedRange && innerState.tempValue.getTime() === UNSPECIFIED_FROM.getTime()
            ? "toDate"
            : "fromTime";
      } else if (
        this._isAllowedToUnspecifiedRange &&
        innerState.value &&
        innerState.value[1]?.getTime() === UNSPECIFIED_FROM.getTime()
      ) {
        innerState.activeInput = "toTime";
      }

      if (opt._data.executeOnChange) {
        opt = {
          ...opt,
          value: innerState.value,
          feedback: feedback && feedback.feedback,
          message: feedback && feedback.message,
        };

        if (this.props.validateOnChange) {
          _callCallback = false;
          this._validateOnChange(opt, false, setStateCallback);
        } else if (this._checkRequired({ value: opt.value })) {
          opt.required = this.props.required;
          let result = this.getChangeFeedback(opt);
          _callCallback = false;
          this.setState({ ...feedback, ...innerState, ...result }, setStateCallback);
        }
      } else {
        _callCallback = false;
        this.setState({ ...feedback, ...innerState }, setStateCallback);
      }

      if (_callCallback) {
        setStateCallback();
      }
    },

    _onInputChangeDefault(opt, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";
      let value = opt._data ? opt._data.value : opt.value;

      if (opt._data.executeOnChange) {
        if (this.props.validateOnChange) {
          _callCallback = false;
          this._validateOnChange(opt, false, setStateCallback);
        } else if (this.shouldValidateRequired()) {
          if (this.props.required && !value) {
            opt.feedback = "error";
            opt.message = this.props.requiredMessage || this.getLsiComponent("requiredMessage");
          }
          opt.required = this.props.required;
          let result = this.getChangeFeedback({ ...opt, value });
          _callCallback = false;
          this.setState({ ...opt._data.state, ...result }, setStateCallback);
        }
      } else {
        _callCallback = false;
        this.setState({ ...opt._data.state }, setStateCallback);
      }

      if (_callCallback) {
        setStateCallback();
      }
    },

    _onClickUnspecifiedRange(e) {
      let opt = { event: e, component: this, _data: { type: "calendar" } };
      let value;
      let executeOnChange = false;

      if (this.state.tempValue) {
        value = [this.state.tempValue, UNSPECIFIED_TO];
        executeOnChange = true;
      } else {
        value = [UNSPECIFIED_FROM];
      }

      opt.value = this._getOutcomingValue(value);
      opt._data.value = value;
      opt._data.executeOnChange = executeOnChange;
      if (executeOnChange && typeof this.props.onChange === "function") {
        this.props.onChange(opt);
      } else {
        this.onChangeDefault(opt);
      }
    },

    _unspecifiedRangeValueToDate(value) {
      return DateTools.unspecifiedRangeValueToDate(
        value,
        this._isAllowedFromUnspecifiedRange,
        this._isAllowedToUnspecifiedRange
      );
    },

    _onClickReset(e) {
      let opt = { event: e, component: this, _data: { type: "calendar" } };
      let value = this._getOutcomingValue(value) || null;
      let executeOnChange = value !== this.state.value;
      opt.value = value;
      opt._data.value = value;
      opt._data.executeOnChange = executeOnChange;
      if (executeOnChange && typeof this.props.onChange === "function") {
        this.props.onChange(opt);
      } else {
        this.onChangeDefault(opt);
      }
    },

    _getInnerState(value, changeType, adjustDisplayDate, preferRightDisplayDate) {
      let initialFeedback = { feedback: "initial", message: null };
      let state = {};
      let fromValue, toValue, fromInputValidateResult, toInputValidateResult;
      value = this._unspecifiedRangeValueToDate(value);

      if (value) {
        if (!Array.isArray(value)) {
          // value isnt array
          fromValue = this._parseDate(value);
          toValue = this._parseDate(value, true);
          fromInputValidateResult =
            fromValue || this.state.fromDateInputValue
              ? this._validateDateResult({ value: fromValue || this.state.fromDateInputValue })
              : initialFeedback;
          toInputValidateResult =
            toValue || this.state.toDateInputValue
              ? this._validateDateResult({ value: toValue || this.state.toDateInputValue }, true)
              : initialFeedback;
          delete fromInputValidateResult.value;
          delete toInputValidateResult.value;
          state.value = [fromValue, toValue];
          state.fromDateInputValue = this._getDateString(fromValue);
          state.toDateInputValue = this._getDateString(toValue);

          state.fromTimeInputValue = this._getTimeString(fromValue, this.props, this._isSorXs());
          state.toTimeInputValue = this._getTimeString(toValue, this.props, this._isSorXs());
        } else if (Array.isArray(value)) {
          // value is array
          fromValue = this._parseDate(value[0]);
          toValue = this._parseDate(value[1], true);
          fromInputValidateResult =
            fromValue || this.state.fromDateInputValue
              ? this._validateDateResult({ value: fromValue || this.state.fromDateInputValue })
              : initialFeedback;
          toInputValidateResult =
            toValue || this.state.toDateInputValue
              ? this._validateDateResult({ value: toValue || this.state.toDateInputValue }, true)
              : initialFeedback;
          delete fromInputValidateResult.value;
          delete toInputValidateResult.value;

          if (changeType !== "input") {
            if (
              this._compareDates(fromValue, toValue, "greater") ||
              (!fromValue && toValue && this.state.fromDateInputValue)
            ) {
              fromValue = toValue;
              toValue = null;
            }
          }

          if (!toValue) {
            if (this.state.toDateInputValue && !this.state.value) {
              toValue = this._parseDate(this.state.toDateInputValue, true);

              if (toValue) {
                if (!this._compareDates(toValue, fromValue, "lesser")) {
                  state.value = [fromValue, toValue];
                  state.tempValue = null;
                  state.fromDateInputValue = this._getDateString(fromValue);
                  state.toDateInputValue = this._getDateString(toValue);

                  state.fromTimeInputValue = this._getTimeString(fromValue, this.props, this._isSorXs());
                  state.toTimeInputValue = this._getTimeString(toValue, this.props, this._isSorXs());
                } else {
                  state.value = null;
                  state.tempValue = null;

                  state.fromDateInputValue = this._getDateString(fromValue);
                  state.toDateInputValue = null;

                  state.fromTimeInputValue = this._getTimeString(fromValue, this.props, this._isSorXs());
                  state.toTimeInputValue = null;
                }
              } else {
                state.value = null;
                state.tempValue = fromValue;

                state.fromDateInputValue = this._getDateString(fromValue, this._formattingValues.format);

                state.fromTimeInputValue = this._getTimeString(fromValue, this.props, this._isSorXs());
              }
            } else {
              state.value = null;
              state.tempValue = fromValue;

              state.fromDateInputValue = this._getDateString(fromValue);
              state.toDateInputValue = null;

              state.fromTimeInputValue = this._getTimeString(fromValue, this.props, this._isSorXs());
              state.toTimeInputValue = null;
            }
          } else if (!fromValue) {
            state.value = null;
            state.tempValue = null;

            state.fromDateInputValue = this._getDateString(fromValue);
            state.toDateInputValue = this._getDateString(toValue);

            state.fromTimeInputValue = this._getTimeString(fromValue, this.props, this._isSorXs());
            state.toTimeInputValue = this._getTimeString(toValue, this.props, this._isSorXs());
          } else {
            state.value = [fromValue, toValue];
            state.tempValue = null;

            state.fromDateInputValue = this._getDateString(fromValue);
            state.toDateInputValue = this._getDateString(toValue);

            state.fromTimeInputValue = this._getTimeString(fromValue, this.props, this._isSorXs());
            state.toTimeInputValue = this._getTimeString(toValue, this.props, this._isSorXs());
          }
        }

        state.fromFeedback = this.state.fromDateInputValue ? fromInputValidateResult : initialFeedback;
        state.toFeedback = this.state.toDateInputValue ? toInputValidateResult : initialFeedback;
        if (changeType === "input") {
          // Don't set formated date immediately (it will be changed on blur)
          delete state.fromDateInputValue;
          delete state.toDateInputValue;
        }

        if (fromValue && toValue) {
          let inputFeedback = this._getInputValidationResult(fromValue, toValue);
          state.fromFeedback = inputFeedback.fromFeedback;
          state.toFeedback = inputFeedback.toFeedback;

          if (state.fromFeedback.feedback === "error") {
            delete state.fromDisplayDate;
            if (state.value) {
              if (this.state.value) {
                state.value[0] = this.state.value[0];
              } else {
                delete state.value;
              }
            }
          }

          if (state.toFeedback.feedback === "error") {
            delete state.toDisplayDate;
            if (state.value) {
              if (this.state.value) {
                state.value[1] = this.state.value[1];
              } else {
                delete state.value;
              }
            }
          }

          if (state.fromFeedback.feedback === "error" && state.toFeedback.feedback === "error") {
            adjustDisplayDate = false;
          }
        }
      } else {
        state.tempValue = null;
        state.value = value;
        state.fromDateInputValue = null;
        state.toDateInputValue = null;
        state.fromFeedback = initialFeedback;
        state.toFeedback = initialFeedback;

        state.fromTimeInputValue = null;
        state.toTimeInputValue = null;
      }

      if (fromValue) {
        state.fromDayPart = UU5.Common.Tools.getDayPart(fromValue);
      }

      if (toValue) {
        state.toDayPart = UU5.Common.Tools.getDayPart(toValue);
      }

      if (adjustDisplayDate) {
        if (fromValue && toValue) {
          if (preferRightDisplayDate) {
            state.toDisplayDate = toValue;
            state.fromDisplayDate = DateTools.decreaseDate(toValue, undefined, 1);
          } else {
            state.fromDisplayDate = fromValue;
            state.toDisplayDate = DateTools.increaseDate(fromValue, undefined, 1);
          }
        } else if (fromValue) {
          state.fromDisplayDate = fromValue;
          state.toDisplayDate = DateTools.increaseDate(fromValue, undefined, 1);
        } else if (toValue) {
          state.toDisplayDate = toValue;
          state.toDisplayDate = DateTools.decreaseDate(toValue, undefined, 1);
        }
      }

      if (changeType === "interface") {
        if (!state.feedback || state.feedback === "initial") {
          if (state.fromFeedback.feedback !== "initial") {
            state.feedback = state.fromFeedback.feedback;
            state.message = state.fromFeedback.message;
          }

          if (state.toFeedback.feedback !== "initial") {
            state.feedback = state.toFeedback.feedback;
            state.message = state.toFeedback.message;
          }
        }
      }

      return state;
    },

    _handleClick(e) {
      let clickData = this._findTarget(e);
      let canClose = this._isSorXs()
        ? !clickData.popover && !clickData.input && this.isOpen()
        : !clickData.popover && this.isOpen();
      let canBlur = !clickData.popover && !clickData.input;
      let opt = { value: this.state.value, event: e, component: this };

      if (canClose) {
        if ((this.props.disableBackdrop && clickData.input) || (!this.props.disableBackdrop && !clickData.input)) {
          if (clickData.input) {
            // prevent an immediate re-openning
            e.stopPropagation();
            e.preventDefault();
          }
          this._close(!canBlur, canBlur ? () => this._onBlur(opt) : undefined);
        } else if (canBlur) {
          this._onBlur(opt, true);
        }
      } else if (canBlur) {
        this._onBlur(opt);
      }
    },

    _addEvent(callback) {
      // listener added to capturing phase to prevent triggering right after it is registered
      window.addEventListener("click", this._handleClick, true);
      UU5.Environment.EventListener.addWindowEvent("resize", this.getId(), this._onResize);
      if (typeof callback === "function") {
        callback();
      }
    },

    _removeEvent(callback) {
      window.removeEventListener("click", this._handleClick, true);
      UU5.Environment.EventListener.removeWindowEvent("resize", this.getId());
      if (typeof callback === "function") {
        callback();
      }
    },

    _getDisplayDates(value, dateFrom, dateTo) {
      let fromDisplayDate, toDisplayDate;
      let valueFrom = this._getFromValue(value);
      let valueTo = this._getToValue(value);
      let today = this._getToday();

      if (valueFrom && valueTo) {
        fromDisplayDate = valueFrom;
      } else if (dateFrom || dateTo) {
        if (
          dateFrom &&
          this._compareDates(today, dateFrom, "greater") &&
          dateTo &&
          this._compareDates(today, dateTo, "lesser")
        ) {
          fromDisplayDate = today;
        } else {
          fromDisplayDate = this._getFromValue(this._parseDate(dateFrom || dateTo));
        }
      } else {
        fromDisplayDate = today;
      }

      if (this._isAllowedFromUnspecifiedRange && fromDisplayDate.getTime() === UNSPECIFIED_FROM.getTime()) {
        if (this.state) {
          fromDisplayDate = this.state.fromDisplayDate;
        } else {
          fromDisplayDate = today;
        }
      }

      if (this._isSorXs()) {
        toDisplayDate = fromDisplayDate;
      } else {
        toDisplayDate = new Date(fromDisplayDate.getFullYear(), fromDisplayDate.getMonth() + 1, 1);
      }

      return { fromDisplayDate, toDisplayDate };
    },

    _compareDates(date1, date2, method) {
      let result = false;
      date1 = this._parseDate(date1);
      date2 = this._parseDate(date2, true);

      if (date1 && date2) {
        date1 = Date.UTC(
          date1.getFullYear(),
          date1.getMonth(),
          date1.getDate(),
          date1.getHours(),
          date1.getMinutes(),
          date1.getSeconds()
        );
        date2 = Date.UTC(
          date2.getFullYear(),
          date2.getMonth(),
          date2.getDate(),
          date2.getHours(),
          date2.getMinutes(),
          date2.getSeconds()
        );
        if (method === "equals") {
          result = date1 === date2;
        } else if (method === "greater") {
          result = date1 > date2;
        } else if (method === "lesser") {
          result = date1 < date2;
        }
      }

      return result;
    },

    _isSameMonth(date1, date2) {
      let result = false;
      if (date1 instanceof Date && date2 instanceof Date) {
        result = date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
      }
      return result;
    },

    _goToToday() {
      let fromDate = this._getToday();
      let toDate = this._getToday();

      if (!this._isSorXs()) {
        toDate = DateTools.increaseDate(toDate, undefined, 1);
      }
      this._onChange({ value: this._getToday(), _data: { type: "calendar" } });
      this.setState({ fromDisplayDate: fromDate, toDisplayDate: toDate });
    },

    _getWeeksInMonth(date) {
      let dateMin = UU5.Common.Tools.cloneDateObject(date);
      let dateMax = UU5.Common.Tools.cloneDateObject(date);

      dateMin.setDate(1);
      dateMax = DateTools.increaseDate(dateMax, undefined, 1);
      dateMax.setDate(0);

      return UU5.Common.Tools.getWeekNumber(dateMax) - UU5.Common.Tools.getWeekNumber(dateMin) + 1;
    },

    _onNextSelection() {
      let fromDisplayDate = DateTools.increaseDate(this.state.fromDisplayDate, undefined, 1);
      let toDisplayDate = DateTools.increaseDate(this.state.toDisplayDate, undefined, 1);

      this.setState({ fromDisplayDate, toDisplayDate });
    },

    _onPrevSelection() {
      let fromDisplayDate = DateTools.decreaseDate(this.state.fromDisplayDate, undefined, 1);
      let toDisplayDate = DateTools.decreaseDate(this.state.toDisplayDate, undefined, 1);

      this.setState({ fromDisplayDate, toDisplayDate });
    },

    _getInputType(type, right) {
      let result = right ? "to" : "from";

      if (type === "date") {
        result += "Date";
      } else if (type === "time") {
        result += "Time";
      }

      return result;
    },

    _onFocus(opt) {
      let setStateCallback;

      if (!this._hasFocus) {
        this._addKeyEvents();
        this._hasFocus = true;

        if (opt._data) {
          opt._data.value = opt.value;
          opt.value = this._getOutcomingValue(opt.value);
        } else {
          opt._data = { value: opt.value };
          opt.value = this._getOutcomingValue(opt.value);
        }

        if (!this.isReadOnly() && !this.isComputedDisabled()) {
          if (typeof this.props.onFocus === "function") {
            setStateCallback = () => this.props.onFocus(opt);
          } else {
            setStateCallback = () => this.onFocusDefault(opt);
          }
        }
      }

      if (opt._data && opt._data.activeInput) {
        let activeInput = opt._data.activeInput;
        this.setState({ activeInput }, setStateCallback);
      } else if (typeof setStateCallback === "function") {
        setStateCallback();
      }
    },

    _onBlur(opt, preserveActiveInput) {
      if (this._hasFocus) {
        this._hasFocus = false;
        let state = preserveActiveInput ? {} : { activeInput: undefined };
        let callback;

        if (opt._data) {
          opt._data.value = opt.value;
          opt.value = this._getOutcomingValue(opt.value);
        } else {
          opt._data = { value: opt.value };
          opt.value = this._getOutcomingValue(opt.value);
        }

        callback = (opt) => {
          this._removeKeyEvents();
          typeof this.props.onBlur === "function" ? this.props.onBlur(opt) : this.onBlurDefault(opt);
        };

        let value = null;
        if (this.state.tempValue && !this._getToValue()) {
          let fromValue = this.state.tempValue;
          let toValue = this.state.tempValue;
          if (this._isAllowedFromUnspecifiedRange && fromValue.getTime() === UNSPECIFIED_FROM.getTime())
            toValue = new Date(Date.now());
          value = [fromValue, toValue];
          opt.value = value;
          opt._data.value = value;
          state = { ...state, value, ...this._getInnerState(value) };
          let origCallback = callback;
          callback = (opt) => {
            if (typeof this.props.onChange === "function") {
              this.props.onChange({ ...opt, _data: { ...opt._data, type: "input" } });
            }

            origCallback(opt);
          };
        } else if (this.state.toDateInputValue && !this.state.fromDateInputValue) {
          value = [this._parseDate(this.state.toDateInputValue), this._parseDate(this.state.toDateInputValue, true)];
          if (!value[0] || !value[1]) value = null;
          opt.value = value;
          opt._data.value = value;
          state = { ...state, value, ...this._getInnerState(value) };
          let origCallback = callback;
          callback = (opt) => {
            if (typeof this.props.onChange === "function") {
              this.props.onChange(opt);
            }

            origCallback(opt);
          };
        } else if (
          this.props.timeFormat == TIME_FORMAT_12 &&
          this.state.value &&
          (this.state.fromFeedback.feedback === "error" || this.state.toFeedback.feedback === "error")
        ) {
          // if this happens, then it might be enough to change the AM/PM
          let newState = { ...state, ...this._getInnerState(this.state.value) };
          if (newState.fromFeedback.feedback === "initial" && newState.toFeedback.feedback === "initial") {
            let fromDayPart = UU5.Common.Tools.getDayPart(this._getFromValue());
            let toDayPart = UU5.Common.Tools.getDayPart(this._getToValue());
            state = { ...newState, fromDayPart, toDayPart };
          }
        }

        this.setState(state, () => callback(opt));
      }
    },

    _onKeyDown(e, customOnKeyDown) {
      let opt = { value: this.state.value, event: e, component: this };

      // customOnKeyDown is user function passed to inputAttrs.onKeyDown
      if (typeof customOnKeyDown === "function") {
        customOnKeyDown(e, opt);
      }

      if (typeof this.props.onEnter === "function" && (e.keyCode || e.which) === 13 && !e.shiftKey && !e.ctrlKey) {
        this.props.onEnter(opt);
        this._close(true, () => this.focus());
      }
    },

    _onClickInnerInput(e) {
      let handleMobileClick = (e, activeInput) => {
        let result = false;

        if (activeInput !== this.state.activeInput) {
          if (this.isOpen()) {
            e.target.focus();
            result = true;
          } else {
            this._close(true);
            document.activeElement.blur();
            e.target.blur();
            result = true;
          }
        } else {
          if (this.isOpen()) {
            e.target.focus();
            this._close(true);
          } else {
            document.activeElement.blur();
            e.target.blur();
            result = true;
          }
        }

        UU5.Common.Tools.scrollToTarget(
          this.getId() + "-input",
          false,
          UU5.Environment._fixedOffset + 20,
          this._findScrollElement(this._root)
        );

        return result;
      };

      let clickData = this._findTarget(e.nativeEvent);
      let shouldOpen = !this.isOpen();

      let opt = { value: this.state.value || null, event: e, component: this };

      if (clickData.input) {
        e.preventDefault();

        let activeInput;

        if (clickData.fromDateInput) activeInput = "fromDate";
        else if (clickData.toDateInput) activeInput = "toDate";
        else if (clickData.fromTimeInput) activeInput = "fromTime";
        else if (clickData.toTimeInput) activeInput = "toTime";

        let isDisabled =
          (activeInput === "fromTime" && this._isFromUnspecified()) ||
          (activeInput === "toTime" && this._isToUnspecified());

        if (isDisabled) return;

        if (activeInput) {
          opt._data = { activeInput };
        }

        if (this._shouldOpenToContent()) {
          shouldOpen = handleMobileClick(e, activeInput);
        }

        if (shouldOpen) {
          this._open(activeInput, () => this._onFocus(opt));
        } else {
          this._onFocus(opt);
        }
      }
    },

    _onClickDayPart(right) {
      this._toggleDayPart(right);
    },

    _getEventPath(e) {
      let path = [];
      let node = e.target;

      while (node != document.body && node != document.documentElement && node) {
        path.push(node);
        node = node.parentNode;
      }

      return path;
    },

    _findTarget(e) {
      let labelMatch = `[id="${this.getId()}"] label`;
      let inputMatch1 = `[id="${this.getId()}"] .uu5-forms-items-input`;
      let inputMatch2 = `[id="${this.getId()}"] .uu5-forms-text-input, [id="${this.getId()}-popover"] .uu5-forms-text-input`;
      let fromDateInputMatch = `[id="${this.getId()}"] .uu5-forms-datetimerangepicker-from-wrapper .uu5-forms-datetimerangepicker-date-input, [id="${this.getId()}"] .uu5-forms-datetimerangepicker-from-wrapper .uu5-forms-datetimerangepicker-date-input`;
      let toDateInputMatch = `[id="${this.getId()}"] .uu5-forms-datetimerangepicker-to-wrapper .uu5-forms-datetimerangepicker-date-input, [id="${this.getId()}-popover"] .uu5-forms-datetimerangepicker-to-wrapper .uu5-forms-datetimerangepicker-date-input`;
      let fromTimeInputMatch = `[id="${this.getId()}"] .uu5-forms-datetimerangepicker-from-wrapper .uu5-forms-datetimerangepicker-time-input, [id="${this.getId()}-popover"] .uu5-forms-datetimerangepicker-from-wrapper .uu5-forms-datetimerangepicker-time-input`;
      let toTimeInputMatch = `[id="${this.getId()}"] .uu5-forms-datetimerangepicker-to-wrapper .uu5-forms-datetimerangepicker-time-input,[id="${this.getId()}-popover"] .uu5-forms-datetimerangepicker-to-wrapper .uu5-forms-datetimerangepicker-time-input`;
      let popoverMatch = `[id="${this.getId()}-popover"]`;
      let customContentMatch = `[id="${this.getId()}-popover"] .uu5-forms-datetimerangepicker-custom-content`;
      let result = {
        component: false,
        input: false,
        label: false,
        mainInput: false,
        fromDateInput: false,
        toDateInput: false,
        fromTimeInput: false,
        toTimeInput: false,
        popover: false,
        customContent: false,
      };
      let eventPath = this._getEventPath(e);

      eventPath.every((item) => {
        let functionType = item.matches ? "matches" : "msMatchesSelector";
        if (item[functionType]) {
          if (item[functionType](labelMatch)) {
            result.label = true;
            result.component = true;
          } else if (item[functionType](inputMatch1)) {
            result.input = true;
            result.mainInput = true;
            result.component = true;
          } else if (item[functionType](inputMatch2)) {
            result.input = true;
            result.component = true;

            if (item[functionType](fromDateInputMatch)) {
              result.fromDateInput = true;
            } else if (item[functionType](toDateInputMatch)) {
              result.toDateInput = true;
            } else if (item[functionType](fromTimeInputMatch)) {
              result.fromTimeInput = true;
            } else if (item[functionType](toTimeInputMatch)) {
              result.toTimeInput = true;
            }
          } else if (item[functionType](popoverMatch)) {
            result.popover = true;
            result.component = true;
          } else if (item[functionType](customContentMatch)) {
            result.customContent = true;
            result.component = true;
          } else if (item === this._root) {
            result.component = true;
            return false;
          }
          return true;
        } else {
          return false;
        }
      });

      return result;
    },

    _addKeyEvents() {
      let handleKeyDown = (e) => {
        if (e.which === 13) {
          // enter
          e.preventDefault();
        } else if (e.which === 40) {
          // bottom
          e.preventDefault();
        } else if (e.which === 27) {
          // esc
          e.preventDefault();
        }
      };

      let handleKeyUp = (e) => {
        let focusResult = this._findTarget(e);
        let opt = { value: this.state.value, event: e, component: this };

        if (e.which === 13) {
          // enter
          if (!this.isOpen()) {
            this.open();
          } else {
            this._onEnter(opt);
            this._close(true, () => this.focus());
          }
        } else if (e.which === 40) {
          // bottom
          e.preventDefault();
          if (!this.isOpen()) {
            this.open();
          }
        } else if (e.which === 27) {
          // esc
          if (this.isOpen()) {
            this._close(true, () => this.focus());
          }
        } else if (e.which === 9) {
          // tab
          if (focusResult.fromDateInput) {
            this.setState({ activeInput: "fromDate" });
          } else if (focusResult.fromTimeInput) {
            this.setState({ activeInput: "fromTime" });
          } else if (focusResult.toDateInput) {
            this.setState({ activeInput: "toDate" });
          } else if (focusResult.toTimeInput) {
            this.setState({ activeInput: "toTime" });
          } else if (!focusResult.component) {
            this._close(false, () => this._onBlur(opt));
          }
        }
      };

      UU5.Environment.EventListener.addWindowEvent("keydown", this.getId(), (e) => handleKeyDown(e));
      UU5.Environment.EventListener.addWindowEvent("keyup", this.getId(), (e) => handleKeyUp(e));
    },

    _removeKeyEvents() {
      UU5.Environment.EventListener.removeWindowEvent("keydown", this.getId());
      UU5.Environment.EventListener.removeWindowEvent("keyup", this.getId());
    },

    _onEnter(opt) {
      if (typeof this.props.onEnter === "function") {
        this.props.onEnter(opt);
      }
    },

    _shouldOpenToContent() {
      let result = false;

      if (typeof this.props.openToContent === "string") {
        let screenSize = this.getScreenSize();
        this.props.openToContent
          .trim()
          .split(" ")
          .some((size) => {
            if (screenSize == size) {
              result = true;
              return true;
            } else {
              return false;
            }
          });
      } else if (typeof this.props.openToContent === "boolean") {
        result = this.props.openToContent;
      }

      return result;
    },

    _getDatePlaceholder() {
      let format = this._formattingValues.format || UU5.Environment.dateTimeFormat[this._formattingValues.country];
      format && (format = format.replace(/Y+/, "YYYY").replace(/y+/, "yy"));
      let placeholder;
      if (format && !this.props.hideFormatPlaceholder) {
        placeholder = format;
      }

      return placeholder;
    },

    _getMainPlaceholder() {
      let format = this._formattingValues.format || UU5.Environment.dateTimeFormat[this._formattingValues.country];
      format && (format = format.replace(/Y+/, "YYYY").replace(/y+/, "yy"));
      let placeholder;
      if (this.props.placeholder && format && !this.props.hideFormatPlaceholder) {
        placeholder = this.props.placeholder + " " + format + " - " + format;
      } else if (format && !this.props.hideFormatPlaceholder) {
        placeholder = format + " - " + format;
      } else {
        placeholder = this.props.placeholder;
      }
      return placeholder;
    },

    _getPopoverProps(isSorXs, right) {
      let isOpen = false;

      if (this.isOpen()) {
        if (isSorXs) {
          if (right && (this.state.activeInput === "toDate" || this.state.activeInput === "toTime")) isOpen = true;
          else if (!right && (this.state.activeInput === "fromDate" || this.state.activeInput === "fromTime"))
            isOpen = true;
        } else {
          isOpen = true;
        }
      }
      let props = {};

      if (isSorXs) {
        if (right) {
          props.ref_ = (ref) => (this._toPopover = ref);
        } else {
          props.ref_ = (ref) => (this._fromPopover = ref);
        }
      } else {
        props.ref_ = (ref) => (this._popover = ref);
      }

      props.forceRender = true;
      props.disableBackdrop = true;
      props.shown = isOpen;
      props.location = !this._shouldOpenToContent() ? this.props.popoverLocation : "local";
      props.className = this.getClassName("popover");
      props.id = this.getId() + "-popover";

      if (
        (this.props.label && !this.props.labelFrom && !this.props.labelTo) ||
        !(this.props.labelFrom && this.props.labelTo)
      ) {
        props.className += " " + this.getClassName("compactLayout");
      }

      if (this.props.seconds) {
        props.className += " " + this.getClassName("withSeconds");
      }

      if (this.props.timeFormat == TIME_FORMAT_12) {
        props.className += " " + this.getClassName("withEnglishFormat");
      }

      return props;
    },

    _getCalendarValue(right) {
      let value = this.parseDate(this.state.value);
      let firstDate, secondDate;

      if (value && value.length === 2) {
        firstDate = UU5.Common.Tools.cloneDateObject(value[0]);
        secondDate = UU5.Common.Tools.cloneDateObject(value[1]);
        let multiMonth = !this._isSameMonth(firstDate, secondDate);

        if (multiMonth) {
          value = [firstDate, secondDate];
        } else {
          if (right) {
            if (this._isSameMonth(firstDate, this.state.toDisplayDate)) {
              // value = value;
            } else {
              value = null;
            }
          } else {
            if (this._isSameMonth(firstDate, this.state.fromDisplayDate)) {
              // value = value;
            } else {
              value = null;
            }
          }
        }
      } else if (this.state.tempValue) {
        firstDate = UU5.Common.Tools.cloneDateObject(this.state.tempValue);
        if (right) {
          if (this.state.toDisplayDate.getMonth() === firstDate.getMonth()) {
            value = this.state.tempValue;
          } else {
            value = null;
          }
        } else {
          if (this.state.fromDisplayDate.getMonth() === firstDate.getMonth()) {
            value = this.state.tempValue;
          } else {
            value = null;
          }
        }
      }

      return value;
    },

    _getTimeValue(right) {
      let time = null;
      let fromValue = this._getFromValue();
      let toValue = this._getToValue();

      if (right) {
        if (toValue) {
          time = this._getTimeString(toValue, this.props, this._isSorXs());
        }
      } else {
        if (fromValue) {
          time = this._getTimeString(fromValue, this.props, this._isSorXs());
        }
      }

      return time ? this._parseTime(time) : time;
    },

    _isFromUnspecified() {
      let parsedValue = this._parseDate(this.state.fromDateInputValue);
      return this._isAllowedFromUnspecifiedRange && parsedValue && parsedValue.getTime() === UNSPECIFIED_FROM.getTime();
    },

    _isToUnspecified() {
      let parsedValue = this._parseDate(this.state.toDateInputValue, true);
      return this._isAllowedToUnspecifiedRange && parsedValue && parsedValue.getTime() === UNSPECIFIED_TO.getTime();
    },

    _getTimeProps(right) {
      let isOpen = false;
      if (this.isOpen()) {
        if (right && this.state.activeInput === "toTime") isOpen = true;
        else if (!right && this.state.activeInput === "fromTime") isOpen = true;
      }

      return {
        className: this.getClassName("menu"),
        value: this._getTimeValue(right),
        hidden: !isOpen,
        onChange: (opt) =>
          this._onChange({ ...opt, ...{ _data: { right, type: "time", changeType: opt._data.changeType } } }),
        format: this.props.timeFormat,
        seconds: this.props.seconds,
        step: this.props.timeStep,
        type: this.props.timePickerType,
        colorSchema: this.getColorSchema(),
        mobileDisplay: this.isXs(),
        horizontalOnly: this._shouldOpenToContent(),
        timeFrom: this._timeFrom,
        timeTo: this._timeTo,
      };
    },

    _getCalendarProps(isSorXs, right) {
      let isOpen = false;

      if (this.isOpen()) {
        if (isSorXs) {
          if (right && this.state.activeInput === "toDate") isOpen = true;
          else if (!right && this.state.activeInput === "fromDate") isOpen = true;
        } else {
          isOpen = true;
        }
      }

      let props = {
        className: this.getClassName("menu"),
        value: this._getCalendarValue(isSorXs ? false : right),
        dateFrom: this.props.dateFrom,
        dateTo: this.props.dateTo,
        hidden: !isOpen,
        selectionMode: "range",
        onChange: (opt) => this._onChange({ ...opt, ...{ _data: { right, type: "calendar" } } }),
        onViewChange: this._onCalendarViewChange,
        hideWeekNumber: this.props.hideWeekNumber,
        hideOtherSections: true,
        colorSchema: this.getColorSchema(),
        weekStartDay: this.props.weekStartDay,
      };

      if (isSorXs) {
        props.displayDate =
          right && !this._isSameMonth(this.state.toDisplayDate, this.state.fromDisplayDate)
            ? this.state.toDisplayDate
            : this.state.fromDisplayDate;
        props.onPrevSelection = this._onPrevSelection;
        props.onNextSelection = this._onNextSelection;
      } else {
        if (right) {
          props.className += " " + this.getClassName("rightCalendar");
          props.displayDate = this.state.toDisplayDate;
          props.onNextSelection = this._onNextSelection;
          props.hidePrevSelection = true;
        } else {
          props.className += " " + this.getClassName("leftCalendar");
          props.displayDate = this.state.fromDisplayDate;
          props.onPrevSelection = this._onPrevSelection;
          props.hideNextSelection = true;
        }
      }

      return props;
    },

    _getDateInputProps(props, right, isSorXs, isUnspecified) {
      props.className = this.getClassName("dateInput");
      props.onChange = (e) =>
        this._onChange({
          event: e,
          component: this,
          value: e.target.value,
          _data: { right: right, type: "dateInput" },
        });
      props.value = (right ? this.state.toDateInputValue : this.state.fromDateInputValue) || "";
      props.icon = isSorXs ? this.props.dateIcon : null;

      if (isUnspecified) {
        props.value = undefined;
        props.placeholder = this._isSorXs() ? UNSPECIFIED_CHAR : this.getLsiValue("unspecifiedRange");
      }

      return props;
    },

    _getTimeInputProps(props, right, isSorXs, isUnspecified) {
      props.className = this.getClassName("timeInput");
      props.onChange = (e) =>
        this._onChange({
          event: e,
          component: this,
          value: e.target.value,
          _data: { right: right, type: "timeInput" },
        });
      props.value = (right ? this.state.toTimeInputValue : this.state.fromTimeInputValue) || "";
      props.icon = isSorXs ? this.props.timeIcon : null;

      if (isUnspecified) {
        props.value = undefined;
        props.disabled = true;
        props.onFocus = undefined;
        props.mainAttrs.onFocus = undefined;
      }

      return props;
    },

    _getDayPartInputProps(props, right, isUnspecified) {
      props.className = this.getClassName("dayPartInput");
      props.value = right ? this.state.toDayPart : this.state.fromDayPart;
      props.disabled = isUnspecified;
      props.mainAttrs = {};
      props.mainAttrs.onClick = () => this._onClickDayPart(right);

      if (isUnspecified) {
        props.disabled = true;
        props.onFocus = undefined;
        props.mainAttrs.onClick = undefined;
      }

      return props;
    },

    _getCalendarInputProps(type, isSorXs, right, sizeClass) {
      let placeholder;
      if (type === "date") {
        placeholder = this._getDatePlaceholder();
      } else if (type === "time") {
        placeholder = this.props.placeholderTime;
      }

      let props = {
        onFocus: !this.isReadOnly() && !this.isComputedDisabled() ? this._onFocus : null,
        onKeyDown: this._onKeyDown,
        placeholder,
        mainAttrs: {},
        colorSchema: this.props.colorSchema,
      };

      if (isSorXs) {
        props.mainAttrs = this.props.inputAttrs;
        props.mainAttrs = UU5.Common.Tools.merge({ autoComplete: "off" }, props.mainAttrs);
        props.mainAttrs.className === "" ? delete props.mainAttrs.className : null;
        props.mainAttrs.tabIndex = !this.isReadOnly() && !this.isComputedDisabled() ? "0" : undefined;
        props.mainAttrs.onFocus = !this.isReadOnly() && !this.isComputedDisabled() ? this._onFocus : null;

        let useSeparatedFeedback =
          this.state.fromFeedback.feedback === "error" || this.state.toFeedback.feedback === "error";
        props.inputWidth = this._getInputWidth({ dualInput: true });
        props.className += " " + sizeClass;
        props.borderRadius = this.props.borderRadius;
        props.elevation = this.props.elevation;
        props.bgStyle = this.props.bgStyle;
        props.size = this.props.size;

        if (right) {
          if (useSeparatedFeedback) {
            props = { ...props, ...this.state.toFeedback };
            props.mainAttrs.title = this.state.toFeedback.message;
          } else {
            props.feedback = this.getFeedback();
          }

          props.className += " " + this.getClassName("inputTo");

          if (type === "date") {
            props.ref_ = (item) => (this._toDateTextInput = item);

            if (this.isOpen() && this.state.activeInput === "toDate") {
              props.mainAttrs.className = this.getClassName("inputActive");
            }
          } else if (type === "time") {
            props.ref_ = (item) => (this._toTimeTextInput = item);

            if (this.isOpen() && this.state.activeInput === "toTime") {
              props.mainAttrs.className = this.getClassName("inputActive");
            }
          }
        } else {
          if (useSeparatedFeedback) {
            props = { ...props, ...this.state.fromFeedback };
            props.mainAttrs.title = this.state.fromFeedback.message;
          } else {
            props.feedback = this.getFeedback();
          }

          props.className += " " + this.getClassName("inputFrom");

          if (type === "date") {
            props.ref_ = (item) => {
              this._textInput = item;
              this._fromDateTextInput = item;
            };

            if (this.isOpen() && this.state.activeInput === "fromDate") {
              props.mainAttrs.className = this.getClassName("inputActive");
            }
          } else if (type === "time") {
            props.ref_ = (item) => (this._fromTimeTextInput = item);

            if (this.isOpen() && this.state.activeInput === "fromTime") {
              props.mainAttrs.className = this.getClassName("inputActive");
            }
          }
        }
      } else {
        if (right) {
          props.mainAttrs.title = this.state.toFeedback.message;
          props.feedback = this.state.toFeedback.feedback;
          if (type === "date") props.prefix = this.props.pickerLabelTo;
        } else {
          props.mainAttrs.title = this.state.fromFeedback.message;
          props.feedback = this.state.fromFeedback.feedback;
          if (type === "date") props.prefix = this.props.pickerLabelFrom;
        }

        if (type === "date" || (type === "time" && this.props.timeFormat == TIME_FORMAT_12)) {
          props.mainAttrs.className =
            (props.mainAttrs.className ? props.mainAttrs.className + " " : "") + this.getClassName("removeRightBorder");
        }

        props.size = "m";
        props.ref_ = (item) => {
          if (right) {
            this._rightTextInput = item;
          } else {
            this._leftTextInput = item;
          }
        };
      }

      let isUnspecified = right ? this._isToUnspecified() : this._isFromUnspecified();

      if (type === "date") {
        props = this._getDateInputProps(props, right, isSorXs, isUnspecified);
      } else if (type === "time") {
        props = this._getTimeInputProps(props, right, isSorXs, isUnspecified);
      } else if (type === "dayPart") {
        props = this._getDayPartInputProps(props, right, isUnspecified);
      }

      return props;
    },

    _getMainAttrs() {
      let attrs = this.getMainAttrs();
      attrs.id = this.getId();
      attrs.ref = (comp) => (this._root = comp);

      let mainClassRegExp = new RegExp(this.getClassName("main", "UU5.Forms.InputMixin"), "g");
      attrs.className = attrs.className.replace(mainClassRegExp, "").replace(/\s\s/, " ");

      let firstValue = this._getFromValue();
      let secondValue = this._getToValue();

      if (firstValue && secondValue && firstValue.getMonth() !== secondValue.getMonth()) {
        attrs.className += " " + this.getClassName("multiMonth");
      }

      if ((this.props.nestingLevel === "inline" || this.props.inputWidth) && !this._isSorXs()) {
        attrs.className += " " + this.getClassName("inline", "UU5.Forms.InputMixin");

        if (this.props.nestingLevel === "inline" || this.props.inputWidth === "auto") {
          attrs.className += " " + this.getClassName("withAutoWidth", "UU5.Forms.InputMixin");
        }
      }

      if (this.isOpen()) {
        attrs.className += " " + this.getClassName("open");
      }

      if (this._shouldOpenToContent()) {
        attrs.className += " " + this.getClassName("screenSizeBehaviour");
      }

      return attrs;
    },

    _getMainInnerMainAttrs(ommitMainAttrs) {
      let attrs = this._getInputAttrs(ommitMainAttrs);
      attrs.className += " " + this.getClassName("main", "UU5.Forms.InputMixin");

      if (!ommitMainAttrs) {
        attrs.id = this.getId();
        attrs.ref = (comp) => (this._root = comp);
      }

      if (this._shouldOpenToContent()) {
        attrs.className += " " + this.getClassName("screenSizeBehaviour");
      }

      if (!this.isReadOnly() && !this.isComputedDisabled()) {
        attrs.onClick = this._onClickInnerInput;
      }

      if (
        (this.props.label && !this.props.labelFrom && !this.props.labelTo) ||
        !(this.props.labelFrom && this.props.labelTo)
      ) {
        attrs.className += " " + this.getClassName("compactLayout");
      }

      if (this.props.seconds) {
        attrs.className += " " + this.getClassName("withSeconds");
      }

      if (this.props.timeFormat == TIME_FORMAT_12) {
        attrs.className += " " + this.getClassName("withEnglishFormat");
      }

      if (this._isSorXs()) {
        attrs.className = attrs.className
          .replace(this.getClassName("inline", "UU5.Forms.InputMixin"), "")
          .replace("  ", " ");
        attrs.className = attrs.className
          .replace(this.getClassName("withAutoWidth", "UU5.Forms.InputMixin"), "")
          .replace("  ", " ");
      }

      return attrs;
    },

    _getInputValue() {
      let result = null;
      let firstDate = this._getFromValue();
      let secondDate = this._getToValue();

      if (firstDate && secondDate) {
        let stringDate1 =
          this._isAllowedFromUnspecifiedRange && firstDate.getTime() === UNSPECIFIED_FROM.getTime()
            ? UNSPECIFIED_CHAR
            : this._getDateString(firstDate);
        let stringDate2 =
          this._isAllowedToUnspecifiedRange && secondDate.getTime() === UNSPECIFIED_TO.getTime()
            ? UNSPECIFIED_CHAR
            : this._getDateString(secondDate);
        let stringTime1 = this._getTimeString(firstDate, this.props, true);
        let stringTime2 = this._getTimeString(secondDate, this.props, true);
        let totalDate1 = stringDate1;
        let totalDate2 = stringDate2;

        if (stringDate1 !== UNSPECIFIED_CHAR) totalDate1 += " " + stringTime1;
        if (stringDate2 !== UNSPECIFIED_CHAR) totalDate2 += " " + stringTime2;
        if (stringDate1 !== UNSPECIFIED_CHAR && stringDate2 !== UNSPECIFIED_CHAR) {
          if (this._compareDates(firstDate, secondDate, "equals")) {
            totalDate1 = "";
          }
        }

        result = totalDate1 + (totalDate1 ? " - " : "") + totalDate2;
      } else if (firstDate) {
        let stringDate1 =
          this._isAllowedFromUnspecifiedRange && firstDate.getTime() === UNSPECIFIED_FROM.getTime()
            ? UNSPECIFIED_CHAR
            : this._getDateString(firstDate);
        let stringTime1 = this._getTimeString(firstDate, this.props, true);
        if (stringDate1 === UNSPECIFIED_CHAR) result = stringDate1;
        else result = stringDate1 + " " + stringTime1;
      }

      if (result) {
        result = UU5.Common.Tools.wrapIfExists(
          UU5.Common.Fragment,
          <span className={this.getClassName("inputText")}>
            {this.props.innerLabel && this.props.label ? this.props.label + "\xa0" : null}
          </span>,
          <span className={this.getClassName("inputValue")}>{result}</span>
        );
      } else {
        result = UU5.Common.Tools.wrapIfExists(
          UU5.Common.Fragment,
          <span className={this.getClassName("inputText")}>
            {this.props.innerLabel && this.props.label ? this.props.label + "\xa0" : null}
          </span>,
          <span className={this.getClassName("mainPlaceholder") + " " + this.getClassName("inputPlaceholder")}>
            {this._getMainPlaceholder()}
          </span>
        );
      }

      return (
        <div className={this.getClassName("inputContentWrapper")}>
          <UU5.Bricks.Icon icon={this.props.icon} />
          {result}
          {!this.isComputedDisabled() && !this.isReadOnly() ? (
            <UU5.Bricks.Icon icon={this.isOpen() ? this.props.iconOpen : this.props.iconClosed} />
          ) : null}
        </div>
      );
    },

    _getLabelBogus(colWidth) {
      return <Label key="labelBogus" className={this.getClassName("labelBogus")} colWidth={colWidth} />;
    },

    _getLabel(inputId, allowInnerLabel, right) {
      let result;

      let colWidth = null;
      let labelColWidth = this.props.labelColWidth || this.getDefault("labelColWidth", "UU5.Forms.InputMixin");

      if (!this.props.inputWidth && !this.props.labelWidth) {
        colWidth = UU5.Common.Tools.buildColWidthClassName(labelColWidth);
      }

      if (this._isSorXs()) {
        if (this.props.labelFrom && this.props.labelTo) {
          if (right && this.props.labelTo) {
            let labelProps = this._getLabelProps(inputId);
            labelProps.className += ` ${this.getClassName("labelTo")}`;
            result = (
              <Label
                {...labelProps}
                tooltip={this.props.labelFrom ? null : this.props.tooltip}
                content={this.props.labelTo}
                key="toLabel"
              />
            );
          } else if (!right && this.props.labelFrom) {
            let labelProps = this._getLabelProps(inputId);
            labelProps.className += ` ${this.getClassName("labelFrom")}`;
            result = <Label {...labelProps} content={this.props.labelFrom} key="fromLabel" />;
          }
        } else if (right) {
          result = this._getLabelBogus(colWidth);
        } else {
          result = this.getLabel(inputId);
        }
      } else if (this._isSorXs() && right && !this.props.labelTo) {
        result = this._getLabelBogus(colWidth);
      } else {
        result = allowInnerLabel && this.props.innerLabel ? null : this.getLabel(inputId);
      }

      return result;
    },

    _getCustomContent() {
      let result = null;
      let content = this.getChildren();

      if (content) {
        result = <div className={this.getClassName("customContent")}>{content}</div>;
      }

      return result;
    },

    _getSecondRow() {
      let buttons = [];

      if (this.props.showTodayButton) {
        buttons.push(
          <UU5.Bricks.Button
            content={this.getLsiComponent("today")}
            className={this.getClassName("todayButton")}
            onClick={this._goToToday}
            key="today"
          />
        );
      }

      if (this._isAllowedFromUnspecifiedRange || this._isAllowedToUnspecifiedRange) {
        let disabled = false;
        if (!this._isAllowedToUnspecifiedRange && this.state.tempValue) disabled = true;
        if (!this._isAllowedFromUnspecifiedRange && (!this.state.tempValue || this.state.value)) disabled = true;
        buttons.push(
          <UU5.Bricks.Button
            content={this.getLsiComponent("unspecifiedRange")}
            onClick={this._onClickUnspecifiedRange}
            disabled={disabled}
            key="unspecifiedRange"
          />
        );
      }

      if (!this.props.hideResetButton && (!this._isSorXs() || buttons.length < 2)) {
        buttons.push(
          <UU5.Bricks.Button
            content={this.getLsiComponent("reset")}
            onClick={this._onClickReset}
            key="reset"
            className={this.getClassName("resetButton")}
          />
        );
      }

      return buttons.length ? <div className={this.getClassName("secondRow")}>{buttons}</div> : null;
    },

    _normalRender(inputId, sizeClass) {
      let mainClassName = this.getClassName("mainInput");
      if (this.isOpen()) {
        mainClassName += " " + this.getClassName("inputOpen");
      }

      mainClassName += " " + sizeClass;
      let inputAttrs = this.props.inputAttrs;
      inputAttrs = UU5.Common.Tools.merge({ autoComplete: "off" }, inputAttrs);
      inputAttrs.className === "" ? delete inputAttrs.className : null;
      inputAttrs.tabIndex = !this.isReadOnly() && !this.isComputedDisabled() ? "0" : undefined;
      inputAttrs.onFocus = (e) => this._onFocus({ value: this.state.value || null, event: e, component: this });

      return (
        <div {...this._getMainAttrs()}>
          <div {...this._getMainInnerMainAttrs(true)}>
            {this._getLabel(inputId, true, false)}
            {this.getInputWrapper([
              <ItemsInput
                id={inputId}
                name={this.props.name || inputId}
                value={this._getInputValue()}
                placeholder={this._getMainPlaceholder()}
                mainAttrs={inputAttrs}
                disabled={this.isComputedDisabled()}
                readonly={this.isReadOnly()}
                loading={this.isLoading()}
                ref_={(item) => (this._textInput = item && item.findDOMNode())}
                feedback={this.getFeedback()}
                borderRadius={this.props.borderRadius}
                elevation={this.props.elevation}
                bgStyle={this.props.bgStyle}
                inputWidth={this._getInputWidth({ dualInput: false })}
                key="input"
                size={this.props.size}
                className={mainClassName}
                onKeyDown={this._onKeyDown}
                colorSchema={this.props.colorSchema}
              />,
            ])}
          </div>
          <div className={this.getClassName("popoverWrapper")}>
            <UU5.Bricks.Popover {...this._getPopoverProps()} key="popover">
              {this.isOpen()
                ? UU5.Common.Tools.wrapIfExists(
                    UU5.Common.Fragment,
                    <div className={this.getClassName("calendars") + " uu5-forms-input-m"}>
                      <div className={this.getClassName("firstRow")}>
                        <div className={this.getClassName("fromWrapper")}>
                          <div className={this.getClassName("inputWrapper")}>
                            <TextInput {...this._getCalendarInputProps("date", false, false)} />
                            <TextInput {...this._getCalendarInputProps("time", false, false)} />
                            {this.props.timeFormat == 12 ? (
                              <ItemsInput {...this._getCalendarInputProps("dayPart", false, false)} />
                            ) : null}
                          </div>
                          <UU5.Bricks.Calendar {...this._getCalendarProps(false, false)} />
                        </div>
                        <span className={this.getClassName("calendarSeparator")} />
                        <div className={this.getClassName("toWrapper")}>
                          <div className={this.getClassName("inputWrapper")}>
                            <TextInput {...this._getCalendarInputProps("date", false, true)} />
                            <TextInput {...this._getCalendarInputProps("time", false, true)} />
                            {this.props.timeFormat == 12 ? (
                              <ItemsInput {...this._getCalendarInputProps("dayPart", false, true)} />
                            ) : null}
                          </div>
                          <UU5.Bricks.Calendar {...this._getCalendarProps(false, true)} />
                        </div>
                      </div>
                      {this._getSecondRow()}
                    </div>,
                    this._getCustomContent()
                  )
                : null}
            </UU5.Bricks.Popover>
          </div>
        </div>
      );
    },

    _smallRender(inputId) {
      return (
        <div {...this._getMainInnerMainAttrs()}>
          <div className={this.getClassName("fromWrapper")} key="fromWrapper">
            <div className={this.getClassName("inputsWrapper")}>
              {this._getLabel(inputId, false, false)}
              {this.getInputWrapper(
                [
                  <TextInput id={inputId} {...this._getCalendarInputProps("date", true, false)} key="dateInput" />,
                  <TextInput
                    id={inputId + "-2"}
                    {...this._getCalendarInputProps("time", true, false)}
                    key="timeInput"
                  />,
                ],
                null,
                { type: "fromWrapper" }
              )}
            </div>
            <div className={this.getClassName("popoverWrapper")}>
              <UU5.Bricks.Popover {...this._getPopoverProps(true, false)}>
                {this.isOpen() ? (
                  <div className={this.getClassName("calendars") + " uu5-forms-input-m"}>
                    <div className={this.getClassName("firstRow")}>
                      {!this.state.activeInput || this.state.activeInput.match(/date/i) ? (
                        <UU5.Bricks.Calendar {...this._getCalendarProps(true, false)} />
                      ) : (
                        <Time {...this._getTimeProps(false)} />
                      )}
                    </div>
                    {!this.state.activeInput || this.state.activeInput.match(/date/i) ? this._getSecondRow() : null}
                  </div>
                ) : null}
              </UU5.Bricks.Popover>
            </div>
          </div>
          <div className={this.getClassName("toWrapper")} key="toWrapper">
            <div className={this.getClassName("inputsWrapper")}>
              {this._getLabel(inputId, false, true)}
              {this.getInputWrapper(
                [
                  <TextInput
                    id={inputId + "-3"}
                    {...this._getCalendarInputProps("date", true, true)}
                    key="dateInput"
                  />,
                  <TextInput
                    id={inputId + "-4"}
                    {...this._getCalendarInputProps("time", true, true)}
                    key="timeInput"
                  />,
                ],
                null,
                { type: "toWrapper" }
              )}
            </div>
            <div className={this.getClassName("popoverWrapper")}>
              <UU5.Bricks.Popover {...this._getPopoverProps(true, true)}>
                {this.isOpen() ? (
                  <div className={this.getClassName("calendars") + " uu5-forms-input-m"}>
                    <div className={this.getClassName("firstRow")}>
                      {!this.state.activeInput || this.state.activeInput.match(/date/i) ? (
                        <UU5.Bricks.Calendar {...this._getCalendarProps(true, true)} />
                      ) : (
                        <Time {...this._getTimeProps(true)} />
                      )}
                    </div>
                    {!this.state.activeInput || this.state.activeInput.match(/date/i) ? this._getSecondRow() : null}
                  </div>
                ) : null}
              </UU5.Bricks.Popover>
            </div>
          </div>
        </div>
      );
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      let inputId = this.getId() + "-input";
      let sizeClass = this.props.size ? "uu5-forms-input-" + this.props.size : null;
      let result = null;

      if (this._isSorXs()) {
        result = this._smallRender(inputId, sizeClass);
      } else {
        result = this._normalRender(inputId, sizeClass);
      }

      return result;
    },
    //@@viewOn:render
  })
);

DateTimeRangePicker = withUserPreferences(DateTimeRangePicker, {
  weekStartDay: "weekStartDay",
  timeFormat: "hourFormat",
});

export { DateTimeRangePicker };
export default DateTimeRangePicker;
