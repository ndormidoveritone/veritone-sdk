import React, { Component } from 'react';
import Button from 'material-ui/Button';
import { number, func } from 'prop-types';
import styles from './styles.scss';

class FilePickerFooter extends Component {
  render() {
    return (
      <div className={styles.filePickerFooter}>
        <Button onClick={this.props.onCancel}>Cancel</Button>
        <Button
          raised
          disabled={this.props.fileCount < 1}
          color="primary"
          onClick={this.props.onUploadFiles}
        >
          Upload
        </Button>
      </div>
    );
  }
}

FilePickerFooter.propTypes = {
  fileCount: number,
  onCancel: func,
  onUploadFiles: func
};

FilePickerFooter.defaultProps = {
  fileCount: 0
};

export default FilePickerFooter;