import { useState } from 'react';

const [state, setState] = useState(0);

setState(1);

export const usePublish = () => {
  return state;
}