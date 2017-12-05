// adapted from
// https://decembersoft.com/posts/file-upload-progress-with-redux-saga/

import { buffers, channel, END } from 'redux-saga';

export default function uploadFilesChannel(uploadDescriptors, files, method = 'PUT') {
  if (uploadDescriptors.length !== files.length) {
    throw new Error('Need an upload descriptor for each file to be uploaded!');
  }

  const chan = channel(buffers.sliding(2));
  let remainingFiles = files.length;

  const onFileProgress = (
    file,
    descriptor,
    { lengthComputable, loaded, total }
  ) => {
    if (lengthComputable) {
      const progress = loaded / total;
      chan.put({ progress, file, descriptor });
    }
  };

  const onFileFailure = (file, descriptor) => {
    chan.put({ err: new Error('Upload failed'), file, descriptor });
  };

  const onFileReadyStateChange = (
    file,
    descriptor,
    { target: { readyState, status } }
  ) => {
    if (readyState === XMLHttpRequest.DONE) {
      remainingFiles -= 1;

      if (status === 200) {
        chan.put({ success: true, file, descriptor });
      } else {
        onFileFailure(file, descriptor);
      }

      if (remainingFiles === 0) {
        chan.put(END);
      }
    }
  };

  files.forEach((file, i) => {
    const descriptor = uploadDescriptors[i];
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener(
      'progress',
      onFileProgress.bind(null, file, descriptor)
    );
    xhr.upload.addEventListener(
      'error',
      onFileFailure.bind(null, file, descriptor)
    );
    xhr.onreadystatechange = onFileReadyStateChange.bind(
      null,
      file,
      descriptor
    );
    // xhr.upload.addEventListener('abort', onFailure.bind(null, file, descriptor));

    xhr.open(method, descriptor.url, true);
    xhr.send(file);
  });

  return chan;
}