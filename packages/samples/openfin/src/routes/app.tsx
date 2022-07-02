import React, { useEffect, useState } from 'react';
import { consume, useConsumer } from '@thresholds/core';
import {
  OpenFinConsumer,
  OpenfinPropertyDefinition
} from '@thresholds/openfin-consumer';
import { MyService } from './my-service';

useConsumer('openfin', new OpenFinConsumer());

export const AppRoute = () => {
  const [myService, setMyService] = useState<MyService>();

  useEffect(() => {
    consume<MyService, OpenfinPropertyDefinition>('openfin', {
      iabId: 'test-service'
    }).then((s) => {
      (window as any).api = s;
      setMyService(s);
    });
  }, []);
  return <h3>App</h3>;
};
