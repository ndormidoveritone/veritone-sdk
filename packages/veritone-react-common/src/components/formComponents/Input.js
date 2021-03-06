import React from 'react';
import LibInput from 'material-ui/Input';

/* eslint-disable react/prop-types */
const Input = ({ meta, input, ...props }) => {
  return <LibInput {...input} {...props} />;
};

export default Input;
