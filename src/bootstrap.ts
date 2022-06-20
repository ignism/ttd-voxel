import React from 'react';
import { hijackEffects } from 'stop-runaway-react-effects';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });

  hijackEffects();
}
