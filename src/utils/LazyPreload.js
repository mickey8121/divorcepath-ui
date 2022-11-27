import { lazy } from 'react';

const LazyPreload = importStatement => {
  const Component = lazy(importStatement);
  Component.preload = importStatement;
  return Component;
};

export default LazyPreload;
