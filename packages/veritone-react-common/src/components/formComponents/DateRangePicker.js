import React from 'react';
import { instanceOf, func, shape, number, string, oneOfType } from 'prop-types';
import InfiniteCalendar, {
  Calendar,
  withRange,
  EVENT_TYPE
} from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import {
  differenceInHours,
  startOfMonth,
  endOfMonth,
  endOfDay,
  subYears
} from 'date-fns';

import { Interval } from '../../helpers/date';
const RangedCalendar = withRange(Calendar);

export default class DateRangePicker extends React.Component {
  static propTypes = {
    minViewableDate: instanceOf(Date),
    maxViewableDate: instanceOf(Date),
    minDate: instanceOf(Date),
    maxDate: instanceOf(Date),
    maxSelectionSizeMs: number, // todo
    input: shape({
      value: oneOfType([instanceOf(Interval), string]), // string to handle null "empty-string" value
      onChange: func
    })
  };
  static defaultProps = {};

  handleSelectCustomDate = ({ eventType, start, end }) => {
    if (eventType === EVENT_TYPE.END) {
      this.props.input.onChange(
        differenceInHours(end, start) > 0
          ? new Interval({ start, end })
          : // single day selection is full day
            new Interval({ start, end: endOfDay(end) })
      );
    }
  };

  get minViewableDate() {
    return this.props.minViewableDate || this.props.minDate
      ? startOfMonth(this.props.minDate)
      : startOfMonth(subYears(new Date(), 3));
  }

  get maxViewableDate() {
    return this.props.maxViewableDate || this.props.maxDate
      ? endOfMonth(this.props.maxDate)
      : endOfMonth(new Date());
  }

  render() {
    // const defaultCalendarDate = {
    //   start: subDays(new Date(), 2),
    //   end: new Date()
    // };

    return (
      <InfiniteCalendar
        Component={RangedCalendar}
        min={this.minViewableDate}
        max={this.maxViewableDate}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        selected={this.props.input.value || false}
        onSelect={this.handleSelectCustomDate}
        locale={{
          headerFormat: 'MMM Do'
        }}
        // theme={{
        //   // headerColor: '#4caf50',
        //   // weekdayColor: '#00c753'
        // }}
      />
    );
  }
}
