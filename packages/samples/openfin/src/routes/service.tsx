import React, { useEffect } from 'react';
import { expose, exposeInstance, useExposer } from '@thresholds/core';
import { OpenFinExposer } from '@thresholds/openfin-exposer';
import { MyService } from './my-service';

useExposer(
  'openfin',
  new OpenFinExposer((window as any).fin.InterApplicationBus)
);

export const ServiceRoute = () => {
  useEffect(() => {
    exposeInstance(new MyService('constructor'), 'openfin', 'test-service', {
      iabId: 'test-service'
    });
  });
  return <h3>Service</h3>;
};
